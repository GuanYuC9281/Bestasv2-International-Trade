const test=require('node:test');
const assert=require('node:assert/strict');
const {calculate}=require('./pressure-loss.js');
const base={shape:'round',flow:3600,length:20,diameter:400,density:1.204,viscosity:0.0000181,roughness:0.09,fittingK:0.5,equipmentLoss:200};
const near=(actual,expected,tolerance=1e-9)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} differs from ${expected}`);

test('Darcy-Colebrook round-duct result resolves the implicit equation and loss balance',()=>{
  const x=calculate(base);
  near(x.velocity,1/(Math.PI*.4**2/4));
  near(1/Math.sqrt(x.frictionFactor),-2*Math.log10(.00009/(3.7*.4)+2.51/(x.reynolds*Math.sqrt(x.frictionFactor))),1e-8);
  near(x.straightLoss,x.frictionFactor*(20/.4)*x.velocityPressure);
  near(x.fittingLoss,.5*x.velocityPressure);
  near(x.total,x.straightLoss+x.fittingLoss+200);
  near(x.total,251.7178138854,1e-6);
});
test('rectangular duct uses hydraulic diameter and actual area',()=>{
  const x=calculate({...base,shape:'rectangle',width:400,height:300,diameter:null,fittingK:0,equipmentLoss:0});
  near(x.area,.12);near(x.hydraulicDiameter,2*.4*.3/(.4+.3));
  near(x.velocity,1/.12);near(x.total,x.straightLoss);
});
test('laminar round duct uses 64/Re; transition and rectangular laminar are withheld',()=>{
  const laminar=calculate({...base,flow:1,fittingK:0,equipmentLoss:0});
  assert.ok(laminar.reynolds<2300);near(laminar.frictionFactor,64/laminar.reynolds);
  assert.match(calculate({...base,flow:50}).error,/過渡流/);
  assert.match(calculate({...base,shape:'rectangle',width:400,height:300,flow:1}).error,/矩形管層流/);
});
test('does not call a partial loss a complete system total',()=>{
  const x=calculate({...base,fittingK:'',equipmentLoss:''});
  assert.equal(x.total,null);near(x.knownSubtotal,x.straightLoss);
  assert.equal(x.warnings.length,2);
  assert.match(calculate({...base,roughness:-1}).error,/粗糙度/);
});
test('reproduces ASHRAE Handbook Chapter 21 Example 6 rigid spiral duct within 2%',()=>{
  // ASHRAE 2017 SI Ch.21 Example 6: 1.8 m, 250 mm, 470 L/s,
  // rho=1.204 kg/m3, eps=0.12 mm. DFDB table reports 7.7 Pa.
  const x=calculate({shape:'round',flow:470*3.6,length:1.8,diameter:250,density:1.204,viscosity:0.0000181,roughness:0.12,fittingK:0,equipmentLoss:0});
  assert.ok(Math.abs(x.total-7.7)/7.7<0.02,`model=${x.total} Pa, published=7.7 Pa`);
});
