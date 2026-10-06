'use strict';
const form=document.getElementById('fan-form'),status=document.getElementById('fan-status');
const base=(window.BESTA_NEEDS_API_BASE||'').replace(/\/$/,'');
const requestId=crypto.randomUUID();
const keys=['flow','pressure','pressureBasis','gasCondition','temperature','outletFlow','outletDiameter','density','totalEfficiency','driveType','driveEfficiency','motorMargin','notes'];
const el=(tag,text,className)=>{const n=document.createElement(tag);n.textContent=text;if(className)n.className=className;return n;};
const fmt=(n,unit)=>n==null?'待確認':`${Number(Number(n).toPrecision(5)).toLocaleString('zh-TW')} ${unit}`;
const readFan=data=>Object.fromEntries(keys.map(k=>[k,data.get(`fan.${k}`)]));
function drawDuty(){
  const duty=window.BestaFan.calculate(readFan(new FormData(form))),box=document.getElementById('fan-duty');
  box.replaceChildren(el('strong','風機所需工況（初步）'));
  for(const row of [`入口實際風量：${fmt(duty.flow,'m³/h')}`,`全壓：${fmt(duty.totalPressure,'Pa')}`,`空氣功率：${fmt(duty.airPower,'kW')}`,`軸功率：${fmt(duty.shaftPower,'kW')}`,`馬達額定輸出下限：${fmt(duty.motorRatingMin,'kW')}`])box.append(el('div',row));
  if(duty.missing.length){box.append(el('strong','仍需補充'));const list=el('ul','');for(const gap of duty.missing)list.append(el('li',gap));box.append(list);}
}
function requirements(data){return {industry:data.get('industry'),process:data.get('process'),pollutants:['fan'],details:{},fanSelection:readFan(data),flow:'',flowBasis:'unknown',flowDryness:'unknown',temperature:'',pressure:'',humidity:'',hoursPerDay:'',daysPerYear:'',target:'',constraints:'',location:data.get('location')};}
function show(result){
  const box=document.getElementById('fan-recommendation'),spec=document.getElementById('fan-spec'),cards=document.getElementById('fan-cards'),missing=document.getElementById('fan-missing');
  document.getElementById('fan-summary').textContent=result.summary;
  spec.replaceChildren(el('h3','所需規格初估'));
  const d=result.fanDuty;
  if(d)for(const row of [`入口實際風量：${fmt(d.flow,'m³/h')}`,`全壓：${fmt(d.totalPressure,'Pa')}`,`空氣功率：${fmt(d.airPower,'kW')}`,`軸功率：${fmt(d.shaftPower,'kW')}`,`馬達額定輸出下限：${fmt(d.motorRatingMin,'kW')}`])spec.append(el('p',row));
  cards.replaceChildren();for(const item of result.items)cards.append(window.BestaProductImages.card(item));
  missing.replaceChildren();for(const gap of result.missing)missing.append(el('li',gap));
  box.hidden=false;box.scrollIntoView({behavior:'smooth',block:'start'});
}
form.addEventListener('input',drawDuty);form.addEventListener('change',drawDuty);drawDuty();
document.getElementById('test-fan').addEventListener('click',()=>{
  if(!form.reportValidity())return;
  show(window.BestaPreview.recommend(requirements(new FormData(form))));
  status.textContent='測試完成：規則初篩只在本機執行，資料沒有傳送、寄信或保存。';
});
const submit=document.getElementById('submit-fan');
if(base)fetch(`${base}/api/health`,{cache:'no-store'}).then(async r=>{if(!r.ok||!(await r.json()).ready)throw Error();submit.disabled=false;}).catch(()=>{status.textContent='正式需求服務暫時無法使用。';});
else status.textContent='正式送出待資料庫、AI 與郵件服務部署後開放。';
form.addEventListener('submit',async event=>{
  event.preventDefault();if(!base||!form.reportValidity())return;
  const data=new FormData(form),payload={requirements:requirements(data),contact:{company:data.get('company'),name:data.get('name'),phone:data.get('phone'),email:data.get('email')},consent:data.get('consent')==='on'};
  submit.disabled=true;status.textContent='正在保存需求與產生初步建議…';
  try{const response=await fetch(`${base}/api/needs`,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':requestId},body:JSON.stringify(payload),cache:'no-store'});const result=await response.json();if(!response.ok)throw Error(result.error||'送出失敗');if(result.recommendation)show(result.recommendation);status.textContent=`需求已保存（編號 ${result.requestId}）。${result.notification==='sent'?'公司已收到通知。':'通知待補送。'}`;form.querySelectorAll('input,select,textarea,button').forEach(x=>x.disabled=true);}catch(e){status.textContent=e.message;submit.disabled=false;}
});
