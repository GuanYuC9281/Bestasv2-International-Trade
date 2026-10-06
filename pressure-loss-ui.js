(function(){
  'use strict';
  if(typeof document==='undefined')return;
  const get=id=>document.getElementById(`loss-${id}`),form=get('form'),output=get('result'),message=get('message');
  const fields=['shape','flow','length','diameter','width','height','density','viscosity','roughness','k','equipment'];
  const labels={straightLoss:'直管摩擦損失',fittingLoss:'已知配件局部損失',equipmentLoss:'設備壓損',knownSubtotal:'已知項目小計',total:'本段總壓損'};
  const fmt=(n,digits=5)=>Number(n.toPrecision(digits)).toLocaleString('zh-TW');
  const row=(label,value,unit)=>{const div=document.createElement('div');div.className='loss-row';const name=document.createElement('span'),number=document.createElement('strong');name.textContent=label;number.textContent=value==null?'未提供':`${fmt(value)} ${unit}`;div.append(name,number);return div;};
  function update(){
    const rectangle=get('shape').value==='rectangle';
    get('diameter-wrap').hidden=rectangle;get('width-wrap').hidden=!rectangle;get('height-wrap').hidden=!rectangle;
    const data={shape:get('shape').value,flow:get('flow').value,length:get('length').value,diameter:get('diameter').value,width:get('width').value,height:get('height').value,density:get('density').value,viscosity:get('viscosity').value,roughness:get('roughness').value,fittingK:get('k').value,equipmentLoss:get('equipment').value};
    output.replaceChildren();message.textContent='';
    if(!data.flow||!data.length||!(rectangle?data.width&&data.height:data.diameter)){output.textContent='請輸入實際風量、直管長度及風管內部尺寸。';return;}
    const result=window.PressureLoss.calculate(data);
    if(result.error){message.textContent=result.error;return;}
    output.append(row('風速',result.velocity,'m/s'),row('雷諾數 Re',result.reynolds,''),row('Darcy 摩擦係數 f',result.frictionFactor,''),row('速度壓',result.velocityPressure,'Pa'));
    for(const [key,label] of Object.entries(labels))output.append(row(label,result[key],'Pa'));
    if(result.total===null)message.textContent='總壓損尚未完整；'+result.warnings.join(' ');
    else if(result.warnings.length)message.textContent=result.warnings.join(' ');
  }
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('input',update);form.addEventListener('change',update);
  get('clear').addEventListener('click',()=>{for(const id of fields.slice(1))get(id).value='';get('density').value='1.204';get('viscosity').value='0.0000181';get('roughness').value='0.09';update();get('flow').focus();});
  update();
})();
