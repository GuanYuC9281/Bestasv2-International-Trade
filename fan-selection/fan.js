/* Shared, unit-explicit fan duty calculation. No catalog curve or efficiency is assumed. */
(function (root) {
  'use strict';
  function value(input) {
    if (input === '' || input == null) return null;
    const n = Number(input);
    return Number.isFinite(n) ? n : null;
  }
  function calculate(input) {
    const flow = value(input.flow);
    const pressure = value(input.pressure);
    const outletFlow = value(input.outletFlow);
    const diameter = value(input.outletDiameter);
    const density = value(input.density);
    const efficiency = value(input.totalEfficiency);
    const driveEfficiency = value(input.driveEfficiency);
    const margin = value(input.motorMargin);
    const validFlow = flow !== null && flow > 0;
    const validPressure = pressure !== null && pressure > 0;
    const q = validFlow ? flow / 3600 : null;
    const area = diameter !== null && diameter > 0 ? Math.PI * (diameter / 1000) ** 2 / 4 : null;
    const outletVelocity = outletFlow !== null && outletFlow > 0 && area !== null ? (outletFlow / 3600) / area : null;
    const velocityPressure = outletVelocity !== null && density !== null && density > 0 ? density * outletVelocity ** 2 / 2 : null;
    const totalPressure = validPressure ? input.pressureBasis === 'total' ? pressure : input.pressureBasis === 'static' && velocityPressure !== null ? pressure + velocityPressure : null : null;
    const airPower = q !== null && totalPressure !== null ? flow * totalPressure / 3600000 : null;
    const shaftPower = airPower !== null && efficiency !== null && efficiency > 0 && efficiency <= 100 ? airPower / (efficiency / 100) : null;
    const driveFactor = input.driveType === 'direct' ? 1 : input.driveType === 'belt' && driveEfficiency !== null && driveEfficiency > 0 && driveEfficiency <= 100 ? driveEfficiency / 100 : null;
    const motorRatingMin = shaftPower !== null && driveFactor !== null && margin !== null && margin >= 1 && margin <= 2 ? shaftPower / driveFactor * margin : null;
    const missing = [];
    if (!validFlow) missing.push('風機入口的實際工況風量');
    if (!validPressure) missing.push('完整系統壓損及風機壓力需求');
    if (validPressure && input.pressureBasis === 'unknown') missing.push('風機壓力的全壓／靜壓基準');
    if (validPressure && input.pressureBasis === 'static' && velocityPressure === null) missing.push('風機出口實際風量、出口直徑與氣體密度，才能由靜壓估算全壓');
    if (shaftPower === null) missing.push('該工況點的風機全壓效率，才能估算軸功率');
    if (motorRatingMin === null) missing.push('傳動方式／效率、馬達選用倍率及產品曲線，才能確認馬達額定功率');
    return {flow: validFlow ? flow : null, pressureBasis: input.pressureBasis, inputPressure: validPressure ? pressure : null, outletVelocity, velocityPressure, totalPressure, airPower, shaftPower, motorRatingMin, missing};
  }
  const api = {calculate};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BestaFan = api;
})(typeof window !== 'undefined' ? window : globalThis);
