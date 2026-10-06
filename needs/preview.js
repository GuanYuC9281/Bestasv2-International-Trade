/* Local, deterministic dry run. No network request, storage, or AI. */
(function(root){
  'use strict';
  const items={
    bag:['脈衝袋濾集塵機','粉塵','https://www.codanh.com/zh/products/industrial-dry-filter-systems/pulse-jet-baghouse'],
    cartridge:['脈衝彈匣式集塵機','粉塵','https://www.codanh.com/zh/products/industrial-dry-filter-systems/cartridge-dust-collector'],
    cyclone:['旋風集塵器','粉塵','https://www.codanh.com/zh/products/industrial-dry-filter-systems/cyclone-dust-collector'],
    scrubber:['PP／FRP 洗滌塔','酸鹼廢氣','https://bestasv.com/zh/chemical-gas-treatment.html'],
    carbon:['活性碳吸附設備','VOC／異味','https://bestasv.com/zh/chemical-gas-treatment.html'],
    oil:['靜電油煙處理機','油煙','https://bestasv.com/zh/oil-smoke-treatment.html'],
    fan:['工業風機系列','排風','https://bestasv.com/zh/fan-solution.html'],
    duct:['通風風管系列','排風','https://bestasv.com/zh/duct-solution.html'],
    radial:['中壓彎翼徑向離心風機','風機系列','https://www.codanh.com/zh/products/industrial-ventilation-fan/medium-pressure/radial-curved'],
    backward:['中壓彎翼後傾離心風機','風機系列','https://www.codanh.com/zh/products/industrial-ventilation-fan/low-pressure/backward-curved'],
    high:['高壓後傾透浦離心風機','風機系列','https://www.codanh.com/zh/products/industrial-ventilation-fan/high-pressure/hp-backward'],
    frp:['防腐玻璃鋼風機','風機系列','https://www.codanh.com/zh/products/anti-corrosion-series']
  };
  function recommend(r){
    const chosen=[],missing=[];
    const add=(id,reason)=>{if(!chosen.some(x=>x.id===id)){const i=items[id];chosen.push({id,name:i[0],category:i[1],url:i[2],reason});}};
    const needs=r.pollutants||[],d=r.details||{};
    if(needs.includes('dust')){
      const dust=d.dust||{};
      if(dust.moisture!=='dry')missing.push('粉塵含水／黏性未確認或已知潮濕；暫不列乾式濾材，須工程師確認處理方案。');
      else if(dust.d50!==''&&dust.d50!=null&&Number(dust.d50)<10)add('cartridge','已知細粒徑且非濕黏，先評估細粉塵過濾；仍須核對粒徑分布及濾材。');
      else {add('bag','乾燥粉塵的初步過濾候選；須核對粒徑、負荷與濾材。');if(Number(dust.d50)>=10)add('cyclone','較粗粒子可評估前處理；不能單靠旋風保證出口濃度。');}
      if(!dust.d50)missing.push('缺粉塵粒徑分布。');
      if(!dust.particleDensity)missing.push('缺粒子真密度。');
      if(dust.combustible!=='no')missing.push('須確認粉塵可燃性及防爆要求。');
    }
    if(needs.includes('acid')){add('scrubber','酸鹼氣體的濕式洗滌候選；需確認成分、藥劑與廢液處置。');if(!d.acid?.species)missing.push('缺酸鹼氣體成分。');}
    if(needs.includes('voc')){add('carbon','VOC 吸附候選；濃度峰值、成分及可燃性未確認前不可定型。');if(!d.voc?.species)missing.push('缺 VOC 物種。');if(d.voc?.flammable!=='no')missing.push('須確認 VOC 可燃性與 LEL。');}
    if(needs.includes('oil'))add('oil','油煙／油霧處理候選；須確認來源與清洗頻率。');
    if(needs.includes('odor')){add('carbon','異味處理候選；需依實際成分確認吸附適用性。');if(!d.odor?.species)missing.push('缺異味成分。');}
    if(needs.includes('ventilation')){add('fan','排風需求候選；須以實際風量與完整系統壓損核對風機曲線。');add('duct','風管與集氣配置需一併核對。');}
    if(needs.includes('heat'))missing.push('高溫降溫目前無足夠的已核對官網產品資料，須工程師人工評估。');
    if(needs.includes('other'))missing.push('其他需求須工程師閱讀描述後確認。');
    let fanDuty=null;
    if(needs.includes('fan')&&r.fanSelection){
      const f=r.fanSelection;fanDuty=root.BestaFan?.calculate(f)||null;
      if(f.gasCondition==='clean'){add('backward','較潔淨氣流的中壓系列候選；需原廠 Q–P 曲線核對。');add('high','較潔淨、高阻力工況的另一系列候選；需原廠曲線核對。');}
      else if(f.gasCondition==='dust')add('radial','原廠列為粉塵集氣用途；須核對磨蝕、黏附與曲線。');
      else if(f.gasCondition==='corrosive')add('frp','腐蝕性氣流的材質候選；須核對介質、溫度與曲線。');
      else if(f.gasCondition==='oil')add('fan','含油霧需評估清洗與材質，由工程師進一步選系列。');
      else missing.push('風機入口氣流狀態未確認，無法縮小系列。');
      if(!f.flow||!f.pressure)missing.push('缺風機入口實際風量或壓力需求。');
      missing.push('確定型號、效率及馬達前須取得原廠 Q–P／效率曲線。');
    }
    if(!r.flow&&!r.fanSelection?.flow)missing.push('缺實際風量及基準。');
    return {summary:'以下是本機規則初篩的測試結果；正式 AI 判斷與工程覆核尚未執行。',items:chosen,missing:[...new Set(missing)].slice(0,10),fanDuty,kind:'local-rule-preview'};
  }
  const api={recommend};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.BestaPreview=api;
})(typeof window!=='undefined'?window:globalThis);
