const assert = require('node:assert/strict');
const { units, convert, ductArea, ductValue } = require('../local-version/converter.js');
function near(actual, expected) { assert.ok(Math.abs(actual - expected) <= Math.max(1e-12, Math.abs(expected) * 1e-10), `${actual} != ${expected}`); }
near(convert(1, units.pressure[0][2], 1), 9.80665);
near(convert(1, units.pressure[1][2], units.pressure[0][2]), 25.4);
near(convert(1, units.pressure[4][2], units.pressure[8][2]), 1.01325);
near(convert(1, units.flow[0][2], units.flow[2][2]), 60);
near(convert(1, units.flow[1][2], units.flow[5][2]), 0.4719474432);
near(ductArea('round', 100), Math.PI / 4);
near(ductValue('to-flow', ductArea('round', 100), 2), 30 * Math.PI);
near(ductValue('to-flow', ductArea('rectangle', 50, 20), 10), 60);
near(ductValue('to-speed', ductArea('rectangle', 50, 20), 60), 10);
near(ductValue('to-flow', ductArea('round', 30), 0), 0);
for (const group of Object.values(units)) for (const from of group) for (const to of group) {
  near(convert(convert(123.456, from[2], to[2]), to[2], from[2]), 123.456);
}
console.log('Converter checks passed: reference values, duct geometry, both directions, zero and all unit round trips.');
