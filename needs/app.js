'use strict';
const needsForm=document.getElementById('needs-form');
const submitStatus=document.getElementById('submit-status');
const submitButton=document.getElementById('submit-needs');
const apiBase=(window.BESTA_NEEDS_API_BASE||'').replace(/\/$/,'');
let requestId=crypto.randomUUID();
needsForm.elements.flowBasis.addEventListener('change',()=>{
  const basis=needsForm.elements.flowBasis.value;
  document.getElementById('flow-unit').textContent=basis==='normal'?'Nm³/h':basis==='actual'?'m³/h':'單位待確認';
});
if(!apiBase){submitButton.disabled=true;submitStatus.textContent='需求工具目前為介面測試版；資料庫與通知服務完成部署後才開放送出。';}
else{
  submitButton.disabled=true;submitStatus.textContent='正在確認需求服務狀態…';
  fetch(`${apiBase}/api/health`,{cache:'no-store'}).then(async response=>{
    if(!response.ok||!(await response.json()).ready)throw Error('服務未就緒');
    submitButton.disabled=false;submitStatus.textContent='';
  }).catch(()=>{submitStatus.textContent='需求服務暫時無法使用，請稍後再試或聯絡 info@bestasv.vn。';});
}

function readRequirements(form){
  return {
    industry:form.get('industry'),process:form.get('process'),pollutants:form.getAll('pollutants'),
    flow:form.get('flow'),flowBasis:form.get('flowBasis'),temperature:form.get('temperature'),humidity:form.get('humidity'),
    target:form.get('target'),constraints:form.get('constraints'),location:form.get('location')
  };
}
function textElement(tag,className,value){const el=document.createElement(tag);if(className)el.className=className;el.textContent=value;return el;}
function showRecommendation(data){
  const box=document.getElementById('recommendation'),grid=document.getElementById('recommendation-items'),missing=document.getElementById('recommendation-missing');
  document.getElementById('recommendation-summary').textContent=data.summary;
  grid.replaceChildren();missing.replaceChildren();
  for(const item of data.items){
    const card=textElement('article','recommendation-card','');
    card.append(textElement('span','tag',item.category),textElement('h3','',item.name),textElement('p','',item.reason));
    const link=textElement('a','','查看官網產品 ↗');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';card.append(link);grid.append(card);
  }
  for(const question of data.missing)missing.append(textElement('li','',question));
  box.hidden=false;box.scrollIntoView({behavior:'smooth',block:'start'});
}
needsForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!apiBase)return;
  if(!needsForm.reportValidity())return;
  const form=new FormData(needsForm),requirements=readRequirements(form);
  if(!requirements.pollutants.length){submitStatus.textContent='請至少選擇一項處理項目。';return;}
  const payload={requirements,contact:{company:form.get('company'),name:form.get('name'),phone:form.get('phone'),email:form.get('email')},consent:form.get('consent')==='on',website:form.get('website')};
  submitButton.disabled=true;submitStatus.textContent='正在保存需求與產生初步建議…';
  try{
    const response=await fetch(`${apiBase}/api/needs`,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':requestId},body:JSON.stringify(payload),cache:'no-store'});
    const result=await response.json();
    if(!response.ok)throw Error(result.error||'送出失敗，請稍後再試。');
    if(result.recommendation){showRecommendation(result.recommendation);submitStatus.textContent=`需求已保存（編號 ${result.requestId}）。${result.notification==='sent'?'公司已收到通知。':'通知待補送，工程人員可在後台查看。'}`;}
    else submitStatus.textContent=`需求已保存（編號 ${result.requestId}），暫無法產生可靠建議，將由工程人員確認。`;
    needsForm.querySelectorAll('input,select,textarea,button').forEach(el=>{el.disabled=true;});
  }catch(error){submitStatus.textContent=error.message;submitButton.disabled=false;}
});
