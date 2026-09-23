(function () {
  'use strict';
  // Factors to Pa (pressure) and m³/s (flow). Conventional liquid-column units.
  const units = {
    pressure: [
      ['毫米水柱', 'mmAq / mmH₂O', 9.80665], ['英吋水柱', 'inAq / inH₂O', 249.08891],
      ['帕斯卡', 'Pa', 1], ['公斤力／平方公分', 'kgf/cm²', 98066.5],
      ['標準大氣壓', 'atm', 101325], ['磅力／平方英吋', 'psi', 6894.757293168],
      ['毫米汞柱', 'mmHg', 133.322387415], ['英吋汞柱', 'inHg', 3386.388640341],
      ['巴', 'bar', 100000], ['毫巴', 'mbar', 100], ['百帕', 'hPa', 100], ['千帕', 'kPa', 1000]
    ],
    flow: [
      ['每分鐘立方公尺', 'CMM · m³/min', 1 / 60], ['每分鐘立方英呎', 'CFM · ft³/min', 0.028316846592 / 60],
      ['每小時立方公尺', 'CMH · m³/h', 1 / 3600], ['每秒立方公尺', 'CMS · m³/s', 1],
      ['每秒立方英呎', 'CFS · ft³/s', 0.028316846592], ['每秒公升', 'LPS · L/s', 0.001], ['每分鐘公升', 'LPM · L/min', 0.001 / 60]
    ]
  };
  function format(value) { return Number(value.toPrecision(10)).toString(); }
  function convert(value, from, to) { return value * from / to; }
  function ductArea(shape, dimension, width) {
    return shape === 'round' ? Math.PI * Math.pow(dimension / 200, 2) : dimension * width / 10000;
  }
  function ductValue(direction, area, known) { return direction === 'to-flow' ? area * known * 60 : known / (area * 60); }
  // Keep the calculation core available to the Node verification script.
  if (typeof module !== 'undefined' && module.exports) module.exports = { units, convert, ductArea, ductValue, format };
  if (typeof document === 'undefined') return;
  const get = id => document.getElementById(id);
  Object.entries(units).forEach(([group, entries]) => {
    const container = get(group + '-fields');
    entries.forEach(([name, symbol], index) => {
      const label = document.createElement('label');
      label.htmlFor = group + '-' + index;
      label.innerHTML = '<span class="unit-name">' + name + '<small>' + symbol + '</small></span><span class="input-wrap"><input type="number" step="any" inputmode="decimal" placeholder="輸入數值" id="' + label.htmlFor + '" aria-describedby="' + group + '-message"><span>' + symbol + '</span></span>';
      if (group === 'flow') label.querySelector('input').min = '0';
      container.append(label);
    });
    const inputs = Array.from(container.querySelectorAll('input'));
    inputs.forEach((input, index) => input.addEventListener('input', () => {
      inputs.forEach(field => field.removeAttribute('aria-invalid'));
      const empty = input.value === '' && !input.validity.badInput;
      const value = input.valueAsNumber;
      const results = entries.map(entry => convert(value, entries[index][2], entry[2]));
      const valid = Number.isFinite(value) && (group !== 'flow' || value >= 0) && results.every(Number.isFinite);
      inputs.forEach((field, i) => { if (i !== index) field.value = !empty && valid ? format(results[i]) : ''; });
      get(group + '-message').textContent = empty || valid ? '' : group === 'flow' ? '請輸入大於或等於 0 的有效風量；數值不可超出計算範圍。' : '請輸入有效數字；數值不可超出計算範圍。';
      if (!empty && !valid) input.setAttribute('aria-invalid', 'true');
    }));
  });
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  function activate(tab) {
    tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; get(item.getAttribute('aria-controls')).hidden = !active; });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      const target = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
      if (target !== undefined) { event.preventDefault(); activate(tabs[target]); tabs[target].focus(); }
    });
  });
  function updateDuct() {
    const round = get('shape').value === 'round';
    const toFlow = get('direction').value === 'to-flow';
    get('width-field').hidden = round;
    get('width').disabled = round;
    get('dimension-label').textContent = round ? '直徑' : '長度';
    get('known-label').textContent = toFlow ? '已知風速' : '已知風量';
    get('known-unit').textContent = toFlow ? 'm/s' : 'CMM';
    get('result-label').textContent = toFlow ? '計算風量' : '計算風速';
    get('result-unit').textContent = toFlow ? 'CMM · m³/min' : 'm/s';
    const required = [get('dimension'), ...round ? [] : [get('width')], get('known')];
    let incomplete = false;
    let invalid = false;
    required.forEach(input => {
      input.removeAttribute('aria-invalid');
      if (input.value === '' && !input.validity.badInput) { incomplete = true; return; }
      if (!Number.isFinite(input.valueAsNumber) || (input.id === 'known' ? input.valueAsNumber < 0 : input.valueAsNumber <= 0)) {
        invalid = true; input.setAttribute('aria-invalid', 'true');
      }
    });
    get('duct-result').textContent = '—';
    get('duct-message').textContent = invalid ? '風管尺寸須大於 0；風速或風量須為大於或等於 0 的有效數字。' : '';
    if (incomplete || invalid) return;
    const area = ductArea(get('shape').value, get('dimension').valueAsNumber, get('width').valueAsNumber);
    const result = ductValue(get('direction').value, area, get('known').valueAsNumber);
    if (!(area > 0) || !Number.isFinite(area) || !Number.isFinite(result)) { get('duct-message').textContent = '數值超出計算範圍，請調整輸入。'; return; }
    get('duct-result').textContent = format(result);
  }
  get('duct-form').addEventListener('submit', event => event.preventDefault());
  get('duct-form').addEventListener('input', updateDuct);
  get('shape').addEventListener('change', updateDuct);
  get('direction').addEventListener('change', () => { get('known').value = ''; updateDuct(); });
  document.querySelectorAll('[data-clear]').forEach(button => button.addEventListener('click', () => {
    const section = get(button.dataset.clear);
    section.querySelectorAll('input').forEach(input => { input.value = ''; input.removeAttribute('aria-invalid'); });
    get(button.dataset.clear + '-message').textContent = '';
    if (button.dataset.clear === 'duct') updateDuct();
    section.querySelector('input:not(:disabled)').focus();
  }));
  updateDuct();
})();
