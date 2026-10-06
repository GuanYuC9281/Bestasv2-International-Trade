const test=require('node:test');
const assert=require('node:assert/strict');
global.BestaFan=require('../fan-selection/fan.js');
const {recommend}=require('./preview.js');
const common={flow:'10000',pollutants:['dust'],details:{dust:{moisture:'dry',d50:'3',particleDensity:'2500',combustible:'no'}}};
test('dry fine dust receives a filter candidate but not a cyclone-only result',()=>{
  const result=recommend(common);
  assert.ok(result.items.some(x=>x.id==='cartridge'));
  assert.ok(!result.items.some(x=>x.id==='cyclone'));
  assert.equal(result.kind,'local-rule-preview');
});
test('damp or unknown dust does not receive dry-filter candidates',()=>{
  for(const moisture of ['damp','sticky','unknown']){
    const result=recommend({...common,details:{dust:{...common.details.dust,moisture}}});
    assert.ok(!result.items.some(x=>['bag','cartridge'].includes(x.id)));
    assert.ok(result.missing.some(x=>x.includes('含水')));
  }
});
test('acid and VOC produce only relevant company products and missing-chemistry prompts',()=>{
  const result=recommend({pollutants:['acid','voc'],details:{acid:{species:''},voc:{species:'',flammable:'unknown'}}});
  assert.deepEqual(result.items.map(x=>x.id),['scrubber','carbon']);
  assert.ok(result.missing.some(x=>x.includes('LEL')));
});
test('fan-only preview returns series and physically computed duty',()=>{
  const result=recommend({pollutants:['fan'],details:{},fanSelection:{flow:'30000',pressure:'1800',pressureBasis:'total',gasCondition:'dust',totalEfficiency:'75',driveType:'direct',motorMargin:'1.2'}});
  assert.deepEqual(result.items.map(x=>x.id),['radial']);
  assert.equal(result.fanDuty.airPower,15);
  assert.equal(result.fanDuty.motorRatingMin,24);
});
