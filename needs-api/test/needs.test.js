import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSubmission,deidentify} from '../src/validation.js';
import {validateRecommendation,recommend,eligibleIds} from '../src/recommend.js';
import {catalog} from '../src/catalog.js';
import {makeNotice} from '../src/notice.js';
import {detailSchema} from '../src/validation.js';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {screenFan} from '../src/fan-selection.js';
const require=createRequire(import.meta.url);
const {calculate:calculateFan}=require('../../fan-selection/fan.js');

const valid={requirements:{industry:'金屬加工',process:'研磨乾式粉塵',pollutants:['dust'],flow:'18000',flowBasis:'actual',flowDryness:'wet',temperature:'60',humidity:'50',details:{dust:{material:'鋼件研磨',particleDensity:'7800',d50:'30',inletConcentration:'500',concentrationBasis:'actual-wet',moisture:'dry',combustible:'unknown'}}},contact:{company:'範例公司',name:'測試人',phone:'+886 2 1234 5678',email:'TEST@example.com'},consent:true};
test('each customer category form matches the API field schema',()=>{
  const html=readFileSync(new URL('../../needs/index.html',import.meta.url),'utf8');
  for(const [need,fields] of Object.entries(detailSchema)){
    const panel=html.match(new RegExp(`<fieldset class="need-panel" data-need="${need}"[\\s\\S]*?<\\/fieldset>`));
    assert.ok(panel,`Missing ${need} panel`);
    const inForm=[...panel[0].matchAll(/name="([^"]+)"/g)].map(x=>x[1]);
    assert.deepEqual(inForm.sort(),Object.keys(fields).map(key=>`${need}.${key}`).sort());
  }
});
test('validates customer fields and retains physical units',()=>{
  const output=validateSubmission(valid);
  assert.equal(output.requirements.flow,18000);
  assert.equal(output.requirements.temperature,60);
  assert.equal(output.requirements.details.dust.particleDensity,7800);
  assert.equal(output.requirements.details.dust.d50,30);
  assert.equal(output.requirements.flowDryness,'wet');
  assert.equal(output.contact.email,'test@example.com');
});
test('retains all selected need tables and omits unselected details',()=>{
  const pollutants=['dust','acid','voc','oil','odor','heat','ventilation','other'];
  const details={...valid.requirements.details,
    acid:{species:'HCl',inletConcentration:'200',concentrationUnit:'ppmv',reagent:'yes'},
    voc:{species:'甲苯',inletConcentration:'30',concentrationUnit:'ppmv',flammable:'possible'},
    oil:{source:'machining',inletConcentration:'15'},odor:{species:'氨',frequency:'intermittent'},
    heat:{targetTemperature:'45',coolingMedium:'water'},ventilation:{sourceCount:'3',staticPressure:'2400',ductLength:'70'},other:{notes:'另需現場勘查'}
  };
  const input=validateSubmission({...valid,requirements:{...valid.requirements,pollutants,details}});
  assert.deepEqual(Object.keys(input.requirements.details),pollutants);
  assert.equal(input.requirements.details.acid.inletConcentration,200);
  assert.equal(input.requirements.details.ventilation.staticPressure,2400);
  const notice=makeNotice({requestId:'many',...input},{from:'sender@example.invalid',to:'info@bestasv.vn'});
  assert.match(notice.text,/甲苯/);
  assert.match(notice.text,/現有系統總壓損 Pa：2400/);
  const onlyDust=validateSubmission({...valid,requirements:{...valid.requirements,details:{...details,acid:{species:'不應儲存'}}}});
  assert.equal(onlyDust.requirements.details.acid,undefined);
});
test('rejects bad consent, contact and out-of-range conditions',()=>{
  assert.throws(()=>validateSubmission({...valid,consent:false}));
  assert.throws(()=>validateSubmission({...valid,contact:{...valid.contact,email:'bad'}}));
  assert.throws(()=>validateSubmission({...valid,requirements:{...valid.requirements,humidity:150}}));
  assert.throws(()=>validateSubmission({...valid,requirements:{...valid.requirements,hoursPerDay:25}}));
  assert.throws(()=>validateSubmission({...valid,requirements:{...valid.requirements,details:{dust:{...valid.requirements.details.dust,particleDensity:'-1'}}}}));
  assert.throws(()=>validateSubmission({...valid,requirements:{...valid.requirements,details:{dust:{...valid.requirements.details.dust,concentrationBasis:'unknown'}}}}));
  assert.throws(()=>validateSubmission({...valid,requirements:{...valid.requirements,details:{}}}));
});
test('removes common contact data from AI-facing free text',()=>{
  const cleaned=deidentify({...valid.requirements,process:'聯絡 test@example.com 或 +886 2 1234 5678'});
  assert.equal(cleaned.process.includes('test@example.com'),false);
  assert.equal(cleaned.process.includes('1234 5678'),false);
  const nested=deidentify({...valid.requirements,details:{dust:{material:'測試 test@example.com'}}});
  assert.equal(nested.details.dust.material.includes('test@example.com'),false);
});
test('uses the selected engineering conditions to filter candidates',()=>{
  const dry=validateSubmission(valid).requirements;
  assert.equal(eligibleIds(dry).has('pulse-bag'),true);
  assert.equal(eligibleIds(dry).has('hp-forward-fan'),false);
  const sticky=structuredClone(dry);
  sticky.details.dust.moisture='sticky';sticky.details.dust.d50=2;
  assert.equal(eligibleIds(sticky).has('pulse-bag'),false);
  assert.equal(eligibleIds(sticky).has('cyclone'),false);
  assert.equal(eligibleIds(sticky).has('wet-dust'),true);
  const vent={...dry,pollutants:['ventilation'],details:{ventilation:{staticPressure:2500,ductLength:70,corrosive:'no'}}};
  assert.equal(eligibleIds(vent).has('hp-forward-fan'),true);
  assert.equal(eligibleIds(vent).has('frp-fan'),false);
});
test('returns only catalog items and limits count',()=>{
  const raw={summary:'乾式粉塵',items:[{id:'made-up',reason:'錯誤產品'},...catalog.map(x=>({id:x.id,reason:'初步適用'}))],missing:['粒徑分布']};
  const checked=validateRecommendation(raw);
  assert.equal(checked.items.length,5);
  assert.ok(checked.items.every(x=>catalog.some(y=>y.id===x.id&&y.url===x.url)));
});
test('rejects a plausible but irrelevant catalog item',()=>{
  assert.throws(()=>validateRecommendation({summary:'',items:[{id:'oil-esp',reason:'粉塵'}],missing:[]},valid.requirements));
  assert.throws(()=>validateRecommendation({summary:'',items:[{id:'fan',reason:'通風'}],missing:[]},{pollutants:['heat'],details:{heat:{}}}));
  const sticky=validateSubmission(valid).requirements;sticky.details.dust.moisture='sticky';
  assert.throws(()=>validateRecommendation({summary:'',items:[{id:'pulse-bag',reason:'乾式粉塵'}],missing:[]},sticky));
});
test('AI request excludes structured contact fields and enforces strict output',async()=>{
  const fakeFetch=async(_url,options)=>{
    const request=JSON.parse(options.body);
    assert.equal(request.store,false);
    assert.equal(request.text.format.strict,true);
    assert.equal(request.input.includes('範例公司'),false);
    return {ok:true,json:async()=>({output:[{content:[{type:'output_text',text:JSON.stringify({summary:'建議先評估袋濾',items:[{id:'pulse-bag',reason:'乾式粉塵'}],missing:['粉塵粒徑']})}]}]})};
  };
  const result=await recommend(valid.requirements,{apiKey:'fake',model:'test-model',fetcher:fakeFetch});
  assert.equal(result.items[0].id,'pulse-bag');
});
test('notification uses the company inbox and correct flow basis',()=>{
  const input=validateSubmission({...valid,requirements:{...valid.requirements,flowBasis:'normal'}});
  const message=makeNotice({requestId:'test-id',...input,recommendation:null},{from:'test@example.invalid',to:'info@bestasv.vn'});
  assert.equal(message.to,'info@bestasv.vn');
  assert.match(message.text,/18000 Nm³\/h/);
  assert.match(message.text,/粒子真密度 kg\/m³：7800/);
  assert.match(message.text,/待人工確認/);
});

test('fan duty uses actual flow, total pressure and explicitly supplied efficiency',()=>{
  const duty=calculateFan({flow:30000,pressure:1800,pressureBasis:'total',totalEfficiency:75,driveType:'direct',motorMargin:1.2});
  assert.equal(duty.airPower,15);
  assert.equal(duty.shaftPower,20);
  assert.equal(duty.motorRatingMin,24);
  assert.equal(calculateFan({flow:30000,pressure:1800,pressureBasis:'total'}).shaftPower,null);
  assert.equal(calculateFan({flow:30000,pressure:1800,pressureBasis:'unknown'}).airPower,null);
  const belt=calculateFan({flow:30000,pressure:1800,pressureBasis:'total',totalEfficiency:75,driveType:'belt',driveEfficiency:80,motorMargin:1.2});
  assert.ok(Math.abs(belt.motorRatingMin-30)<1e-12);
  assert.equal(calculateFan({flow:30000,pressure:1800,pressureBasis:'total',totalEfficiency:75,driveType:'belt',motorMargin:1.2}).motorRatingMin,null);
});

test('static pressure converts to total only with outlet size and gas density',()=>{
  const incomplete=calculateFan({flow:3600,pressure:1000,pressureBasis:'static'});
  assert.equal(incomplete.totalPressure,null);
  assert.equal(incomplete.airPower,null);
  const duty=calculateFan({flow:3600,pressure:1000,pressureBasis:'static',outletFlow:3600,outletDiameter:1000,density:1.2});
  const velocity=1/(Math.PI/4);
  assert.ok(Math.abs(duty.totalPressure-(1000+0.5*1.2*velocity**2))<1e-10);
  assert.ok(Math.abs(duty.airPower-duty.totalPressure/1000)<1e-10);
});

test('fan selection data is validated, retained, and screened into company series',()=>{
  const input=validateSubmission({...valid,requirements:{...valid.requirements,pollutants:['dust','fan'],fanSelection:{flow:'30000',pressure:'1800',pressureBasis:'total',gasCondition:'dust',temperature:'60',totalEfficiency:'75',driveType:'direct',motorMargin:'1.2',notes:'風機在集塵器前'}}});
  assert.equal(input.requirements.fanSelection.flow,30000);
  const screened=screenFan(input.requirements);
  assert.equal(screened.duty.motorRatingMin,24);
  assert.deepEqual(screened.candidates.map(x=>x.id),['medium-radial-fan']);
  const checked=validateRecommendation({summary:'需先確認',items:[{id:'pulse-bag',reason:'乾式粉塵'}],missing:[]},input.requirements);
  assert.ok(checked.items.some(x=>x.id==='medium-radial-fan'));
  assert.equal(checked.fanDuty.airPower,15);
  const notice=makeNotice({requestId:'fan-test',...input,recommendation:checked},{from:'sender@example.invalid',to:'info@bestasv.vn'});
  assert.match(notice.text,/空氣功率：15 kW/);
  assert.match(notice.text,/風機入口實際風量：30000 m³\/h/);
  assert.throws(()=>validateSubmission({...valid,requirements:{...valid.requirements,pollutants:['fan'],fanSelection:{flow:'30000',pressure:'1800',pressureBasis:'unknown',gasCondition:'dust'}}}));
});

test('fan selection is on its own page, separate from the needs and calculator pages',()=>{
  const needsHtml=readFileSync(new URL('../../needs/index.html',import.meta.url),'utf8');
  const fanHtml=readFileSync(new URL('../../fan-selection/index.html',import.meta.url),'utf8');
  assert.doesNotMatch(needsHtml,/name="pollutants" value="fan"/);
  assert.doesNotMatch(needsHtml,/id="modules"/);
  assert.match(fanHtml,/id="fan-form"/);
  for(const field of ['flow','pressure','pressureBasis','gasCondition','temperature','outletFlow','outletDiameter','density','totalEfficiency','driveType','driveEfficiency','motorMargin','notes'])assert.ok(fanHtml.includes(`name="fan.${field}"`));
  const input=validateSubmission({...valid,requirements:{...valid.requirements,pollutants:['fan'],details:{},fanSelection:{flow:'12000',pressure:'1500',pressureBasis:'total',gasCondition:'clean'}}});
  assert.deepEqual(input.requirements.pollutants,['fan']);
  assert.deepEqual(Object.keys(input.requirements.details),[]);
  assert.ok(screenFan(input.requirements).candidates.some(x=>x.id==='medium-backward-fan'));
  assert.throws(()=>validateSubmission({...valid,requirements:{...valid.requirements,pollutants:['fan'],details:{},fanSelection:null}}));
});
