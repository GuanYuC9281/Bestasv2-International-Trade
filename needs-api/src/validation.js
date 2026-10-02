const text=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
const oneOf=(v,values)=>values.includes(v)?v:'';
const numeric=(v,min,max)=>v===''||v==null?null:(Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max?Number(v):null);
const EMAIL=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const detailSchema={
  dust:{material:['text',180],particleDensity:['number',1,30000],d50:['number',0.001,100000],inletConcentration:['number',0,1e8],concentrationBasis:['enum','unknown','actual-wet','actual-dry','normal-dry','normal-wet'],targetConcentration:['number',0,1e8],moisture:['enum','unknown','dry','damp','sticky'],combustible:['enum','unknown','no','possible','yes'],notes:['text',400]},
  acid:{species:['text',180],inletConcentration:['number',0,1e8],concentrationUnit:['enum','unknown','ppmv','mg-m3-actual','mg-Nm3-dry'],targetConcentration:['number',0,1e8],reagent:['enum','unknown','yes','no'],wastewater:['enum','unknown','yes','no'],notes:['text',400]},
  voc:{species:['text',180],inletConcentration:['number',0,1e8],concentrationUnit:['enum','unknown','ppmv','mg-m3-actual','mg-Nm3-dry'],variation:['enum','unknown','stable','intermittent','large'],targetConcentration:['number',0,1e8],flammable:['enum','unknown','no','possible','yes'],notes:['text',400]},
  oil:{source:['enum','unknown','cooking','machining','industrial'],inletConcentration:['number',0,1e8],cleaning:['enum','unknown','light','heavy'],odor:['enum','unknown','yes','no'],notes:['text',400]},
  odor:{species:['text',180],frequency:['enum','unknown','continuous','intermittent'],notes:['text',400]},
  heat:{targetTemperature:['number',-50,1000],coolingMedium:['enum','unknown','air','water','chilled-water','other'],condensation:['enum','unknown','no','possible','yes'],notes:['text',400]},
  ventilation:{sourceCount:['number',1,10000],staticPressure:['number',0,1e6],ductLength:['number',0,100000],corrosive:['enum','unknown','no','yes'],notes:['text',400]},
  other:{notes:['text',400]}
};
const optionalNumber=(source,key,min,max,label)=>{
  const value=numeric(source[key],min,max);
  if(value===null&&source[key]!==''&&source[key]!=null)throw new Error(`${label}超出允許範圍。`);
  return value;
};
function validateDetails(raw,selected){
  const details={};
  for(const need of selected){
    const source=raw?.[need];
    if(!source||typeof source!=='object'||Array.isArray(source))throw new Error(`請填寫${need}需求資料表。`);
    details[need]={};
    for(const [key,spec] of Object.entries(detailSchema[need])){
      if(spec[0]==='text')details[need][key]=text(source[key],spec[1]);
      else if(spec[0]==='number')details[need][key]=optionalNumber(source,key,spec[1],spec[2],`${need}.${key}`);
      else {
        const value=source[key]??'unknown';
        if(!spec.slice(1).includes(value))throw new Error(`${need}.${key}選項無效。`);
        details[need][key]=value;
      }
    }
  }
  return details;
}

export function validateSubmission(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('請填寫需求資料。');
  const r=raw.requirements||{}, c=raw.contact||{};
  const requirements={
    industry:text(r.industry,80),process:text(r.process,600),pollutants:Array.isArray(r.pollutants)?[...new Set(r.pollutants.filter(x=>['dust','acid','voc','oil','odor','heat','ventilation','other'].includes(x)))]:[],
    flow:numeric(r.flow,0.001,1e9),flowBasis:oneOf(r.flowBasis,['actual','normal','unknown']),flowDryness:oneOf(r.flowDryness,['dry','wet','unknown']),temperature:numeric(r.temperature,-50,1000),pressure:numeric(r.pressure,1,1000),humidity:numeric(r.humidity,0,100),hoursPerDay:numeric(r.hoursPerDay,0.1,24),daysPerYear:numeric(r.daysPerYear,1,366),
    target:text(r.target,300),constraints:text(r.constraints,300),location:text(r.location,120)
  };
  const contact={company:text(c.company,120),name:text(c.name,100),phone:text(c.phone,40),email:text(c.email,254).toLowerCase()};
  if(!requirements.industry||!requirements.process||requirements.pollutants.length===0)throw new Error('請填寫產業、製程與污染物類型。');
  requirements.details=validateDetails(r.details,requirements.pollutants);
  if(requirements.flow===null&&r.flow!==''&&r.flow!=null)throw new Error('風量超出允許範圍。');
  if(requirements.temperature===null&&r.temperature!==''&&r.temperature!=null)throw new Error('溫度超出允許範圍。');
  if(requirements.humidity===null&&r.humidity!==''&&r.humidity!=null)throw new Error('濕度超出允許範圍。');
  if(requirements.hoursPerDay===null&&r.hoursPerDay!==''&&r.hoursPerDay!=null)throw new Error('每日運轉時間超出允許範圍。');
  if(requirements.pressure===null&&r.pressure!==''&&r.pressure!=null)throw new Error('壓力超出允許範圍。');
  if(requirements.daysPerYear===null&&r.daysPerYear!==''&&r.daysPerYear!=null)throw new Error('每年運轉天數超出允許範圍。');
  if(!requirements.flowBasis)throw new Error('風量基準無效。');
  if(!requirements.flowDryness)throw new Error('風量乾濕基準無效。');
  for(const need of ['dust','acid','voc']){
    const d=requirements.details[need];
    if(d&&d.inletConcentration!==null&&d.concentrationBasis==='unknown'&&need==='dust')throw new Error('請指定粉塵入口濃度的量測基準。');
    if(d&&d.inletConcentration!==null&&d.concentrationUnit==='unknown')throw new Error(`請指定${need}入口濃度單位。`);
  }
  if(!contact.company||!contact.name||!EMAIL.test(contact.email)||!/^\+?[0-9()\-\s]{7,30}$/.test(contact.phone))throw new Error('請確認公司、聯絡人、電話與信箱。');
  if(raw.consent!==true)throw new Error('請先閱讀並同意資料使用說明。');
  if(raw.website)throw new Error('提交失敗。'); // Honeypot field.
  return {requirements,contact,consent:true};
}

export function deidentify(requirements){
  // Free text may still contain unanticipated PII. Redact common email/phone patterns.
  const clean=s=>s.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[email]').replace(/(?:\+?\d[\d\s()-]{6,}\d)/g,'[phone]');
  const walk=v=>typeof v==='string'?clean(v):Array.isArray(v)?v.map(walk):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,walk(x)])):v;
  return walk(requirements);
}
