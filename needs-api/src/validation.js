const text=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
const oneOf=(v,values)=>values.includes(v)?v:'';
const numeric=(v,min,max)=>v===''||v==null?null:(Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max?Number(v):null);
const EMAIL=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function validateSubmission(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('請填寫需求資料。');
  const r=raw.requirements||{}, c=raw.contact||{};
  const requirements={
    industry:text(r.industry,80),process:text(r.process,600),pollutants:Array.isArray(r.pollutants)?[...new Set(r.pollutants.filter(x=>['dust','acid','voc','oil','odor','heat','ventilation','other'].includes(x)))]:[],
    pollutantDetails:text(r.pollutantDetails,300),flow:numeric(r.flow,0.001,1e9),flowBasis:oneOf(r.flowBasis,['actual','normal','unknown']),temperature:numeric(r.temperature,-50,1000),humidity:numeric(r.humidity,0,100),hoursPerDay:numeric(r.hoursPerDay,0.1,24),
    target:text(r.target,300),constraints:text(r.constraints,300),location:text(r.location,120)
  };
  const contact={company:text(c.company,120),name:text(c.name,100),phone:text(c.phone,40),email:text(c.email,254).toLowerCase()};
  if(!requirements.industry||!requirements.process||requirements.pollutants.length===0)throw new Error('請填寫產業、製程與污染物類型。');
  if(requirements.flow===null&&r.flow!==''&&r.flow!=null)throw new Error('風量超出允許範圍。');
  if(requirements.temperature===null&&r.temperature!==''&&r.temperature!=null)throw new Error('溫度超出允許範圍。');
  if(requirements.humidity===null&&r.humidity!==''&&r.humidity!=null)throw new Error('濕度超出允許範圍。');
  if(requirements.hoursPerDay===null&&r.hoursPerDay!==''&&r.hoursPerDay!=null)throw new Error('每日運轉時間超出允許範圍。');
  if(!contact.company||!contact.name||!EMAIL.test(contact.email)||!/^\+?[0-9()\-\s]{7,30}$/.test(contact.phone))throw new Error('請確認公司、聯絡人、電話與信箱。');
  if(raw.consent!==true)throw new Error('請先閱讀並同意資料使用說明。');
  if(raw.website)throw new Error('提交失敗。'); // Honeypot field.
  return {requirements,contact,consent:true};
}

export function deidentify(requirements){
  // Free text may still contain unanticipated PII. Redact common email/phone patterns.
  const clean=s=>s.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[email]').replace(/(?:\+?\d[\d\s()-]{6,}\d)/g,'[phone]');
  return Object.fromEntries(Object.entries(requirements).map(([k,v])=>[k,typeof v==='string'?clean(v):v]));
}
