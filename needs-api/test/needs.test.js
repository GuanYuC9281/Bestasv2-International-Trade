import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSubmission,deidentify} from '../src/validation.js';
import {validateRecommendation,recommend,eligibleIds} from '../src/recommend.js';
import {catalog} from '../src/catalog.js';
import {makeNotice} from '../src/notice.js';
import {detailSchema} from '../src/validation.js';
import {readFileSync} from 'node:fs';

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
