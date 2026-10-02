const detailLabels={
  dust:{material:'粉塵來源／材質',particleDensity:'粒子真密度 kg/m³',d50:'代表粒徑 d50 µm',inletConcentration:'入口粉塵濃度 mg/m³',concentrationBasis:'濃度基準',targetConcentration:'出口目標 mg/m³',moisture:'含水／黏性',combustible:'可燃／爆炸性',notes:'粉塵備註'},
  acid:{species:'酸鹼氣體成分',inletConcentration:'入口濃度',concentrationUnit:'濃度單位',targetConcentration:'出口目標（同入口單位）',reagent:'洗滌水／藥劑',wastewater:'廢液處理',notes:'酸鹼氣體備註'},
  voc:{species:'VOC 成分',inletConcentration:'入口濃度',concentrationUnit:'濃度單位',variation:'濃度波動',targetConcentration:'出口目標（同入口單位）',flammable:'可燃性',notes:'VOC 備註'},
  oil:{source:'油煙來源',inletConcentration:'入口濃度 mg/m³',cleaning:'油性／清洗狀態',odor:'伴隨異味',notes:'油煙備註'},
  odor:{species:'異味成分',frequency:'發生頻率',notes:'異味備註'},
  heat:{targetTemperature:'期望出口溫度 °C',coolingMedium:'冷卻介質',condensation:'結露／腐蝕',notes:'高溫備註'},
  ventilation:{sourceCount:'集氣／排氣點數',staticPressure:'現有系統總壓損 Pa',ductLength:'風管估計長度 m',corrosive:'氣體腐蝕性',notes:'通風備註'},
  other:{notes:'其他需求'}
};
export function makeNotice(record,{from,to}){
  const r=record.requirements,c=record.contact;
  const safe=s=>String(s??'').replace(/[\r\n]+/g,' ').slice(0,600);
  return {
    from,to,replyTo:c.email,
    subject:`[需求工具] ${safe(c.company)} · ${record.requestId}`,
    text:[`需求編號：${record.requestId}`,`公司：${safe(c.company)}`,`聯絡人：${safe(c.name)}`,`電話：${safe(c.phone)}`,`信箱：${safe(c.email)}`,`產業：${safe(r.industry)}`,`製程：${safe(r.process)}`,`污染物：${r.pollutants.join(', ')}`,`風量：${r.flow??'未提供'} ${r.flowBasis==='normal'?'Nm³/h':r.flowBasis==='actual'?'m³/h（實際工況）':'單位基準未確認'}，${r.flowDryness==='dry'?'乾基':r.flowDryness==='wet'?'濕基':'乾濕基準未確認'}`,`溫度：${r.temperature??'未提供'} °C`,`壓力：${r.pressure??'未提供'} kPa（絕對）`,`濕度：${r.humidity??'未提供'} %`,`每日運轉：${r.hoursPerDay??'未提供'} h/day`,`每年運轉：${r.daysPerYear??'未提供'} day/year`,...r.pollutants.flatMap(need=>[`【${need}資料】`,...Object.entries(r.details?.[need]||{}).map(([key,value])=>`${detailLabels[need]?.[key]||key}：${safe(value??'未提供')}`)]),`目標：${safe(r.target)}`,`限制：${safe(r.constraints)}`,`地點：${safe(r.location)}`,`推薦：${record.recommendation?.items.map(x=>x.name).join('、')||'待人工確認'}`].join('\n')
  };
}
