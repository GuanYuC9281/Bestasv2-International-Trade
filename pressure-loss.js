/* Darcy-Weisbach + Colebrook-White duct loss, SI units throughout. */
(function(root){
  'use strict';
  const number=v=>v===''||v==null?null:Number(v);
  function calculate(input){
    const q=number(input.flow),length=number(input.length),rho=number(input.density),mu=number(input.viscosity),eps=number(input.roughness);
    const d=number(input.diameter),w=number(input.width),h=number(input.height);
    const k=number(input.fittingK),equipment=number(input.equipmentLoss);
    if(![q,length,rho,mu,eps].every(Number.isFinite)||q<=0||length<0||rho<=0||mu<=0||eps<0)return {error:'請提供有效的實際風量、長度、密度、黏度及粗糙度。'};
    let area,dh,aspect=1;
    if(input.shape==='round'){
      if(!Number.isFinite(d)||d<=0)return {error:'圓管內徑須大於 0。'};
      dh=d/1000;area=Math.PI*dh*dh/4;
    }else if(input.shape==='rectangle'){
      if(!Number.isFinite(w)||w<=0||!Number.isFinite(h)||h<=0)return {error:'矩形管內寬、內高皆須大於 0。'};
      const a=w/1000,b=h/1000;area=a*b;dh=2*a*b/(a+b);aspect=Math.max(a,b)/Math.min(a,b);
    }else return {error:'風管形狀無效。'};
    if(k!==null&&(!Number.isFinite(k)||k<0))return {error:'局部阻力係數總和須大於或等於 0。'};
    if(equipment!==null&&(!Number.isFinite(equipment)||equipment<0))return {error:'設備壓損須大於或等於 0。'};
    const velocity=(q/3600)/area,velocityPressure=rho*velocity*velocity/2,re=rho*velocity*dh/mu;
    if(![velocity,velocityPressure,re].every(Number.isFinite)||re<=0)return {error:'輸入超出計算範圍。'};
    if(re>=2300&&re<4000)return {error:'雷諾數介於 2300–4000，屬過渡流區；摩擦係數不穩定，請改用實測壓損。',reynolds:re};
    if(re<2300&&input.shape==='rectangle')return {error:'矩形管層流需依長寬比修正摩擦係數；本版僅計算其紊流壓損。',reynolds:re};
    let frictionFactor;
    if(re<2300)frictionFactor=64/re;
    else{
      frictionFactor=0.02;
      for(let i=0;i<50;i++){
        const next=1/Math.pow(-2*Math.log10((eps/1000)/(3.7*dh)+2.51/(re*Math.sqrt(frictionFactor))),2);
        if(!Number.isFinite(next)||next<=0)return {error:'Colebrook 摩擦係數無法收斂。'};
        if(Math.abs(next-frictionFactor)<1e-12){frictionFactor=next;break;}
        frictionFactor=next;
      }
    }
    const straightLoss=frictionFactor*(length/dh)*velocityPressure;
    const fittingLoss=k===null?null:k*velocityPressure;
    const total=equipment===null||fittingLoss===null?null:straightLoss+fittingLoss+equipment;
    const knownSubtotal=straightLoss+(fittingLoss||0)+(equipment||0);
    const warnings=[];
    if(aspect>4)warnings.push('矩形管長寬比超過 4；水力直徑近似的誤差可能變大，建議現場量測。');
    if(eps/1000>dh/10)warnings.push('相對粗糙度過高，超出一般風管的常見範圍；請核對輸入。');
    if(velocity>30)warnings.push('風速超過 30 m/s；噪音、磨損與氣體可壓縮性需另行評估。');
    if(fittingLoss===null)warnings.push('未提供彎頭、三通、變徑等局部阻力係數，不能宣稱為整段總壓損。');
    if(equipment===null)warnings.push('未提供過濾器、洗滌塔等設備的額定或實測壓損，不能宣稱為整套系統總壓損。');
    return {area,hydraulicDiameter:dh,velocity,velocityPressure,reynolds:re,frictionFactor,straightLoss,fittingLoss,equipmentLoss:equipment,knownSubtotal,total,warnings};
  }
  const api={calculate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PressureLoss=api;
})(typeof window!=='undefined'?window:globalThis);
