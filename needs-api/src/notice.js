export function makeNotice(record,{from,to}){
  const r=record.requirements,c=record.contact;
  const safe=s=>String(s??'').replace(/[\r\n]+/g,' ').slice(0,600);
  return {
    from,to,replyTo:c.email,
    subject:`[需求工具] ${safe(c.company)} · ${record.requestId}`,
    text:[`需求編號：${record.requestId}`,`公司：${safe(c.company)}`,`聯絡人：${safe(c.name)}`,`電話：${safe(c.phone)}`,`信箱：${safe(c.email)}`,`產業：${safe(r.industry)}`,`製程：${safe(r.process)}`,`污染物：${r.pollutants.join(', ')}`,`污染物濃度：${safe(r.pollutantDetails)}`,`風量：${r.flow??'未提供'} ${r.flowBasis==='normal'?'Nm³/h':r.flowBasis==='actual'?'m³/h（實際工況）':'單位基準未確認'}`,`溫度：${r.temperature??'未提供'} °C`,`濕度：${r.humidity??'未提供'} %`,`每日運轉：${r.hoursPerDay??'未提供'} h/day`,`目標：${safe(r.target)}`,`限制：${safe(r.constraints)}`,`地點：${safe(r.location)}`,`推薦：${record.recommendation?.items.map(x=>x.name).join('、')||'待人工確認'}`].join('\n')
  };
}
