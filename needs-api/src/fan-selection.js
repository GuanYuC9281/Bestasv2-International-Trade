import {createRequire} from 'node:module';
import {catalogById} from './catalog.js';

const require=createRequire(import.meta.url);
const {calculate}=require('../../fan-selection/fan.js');

// Series screening uses the company's published applications only. Published
// tables are not duty curves and cannot prove a specific model meets Q and P.
export function screenFan(requirements){
  const fan=requirements?.fanSelection;
  if(!fan)return null;
  const duty=calculate(fan);
  const condition=fan.gasCondition;
  let ids=[];
  if(condition==='clean')ids=['medium-backward-fan','hp-backward-fan'];
  else if(condition==='dust')ids=['medium-radial-fan'];
  else if(condition==='corrosive')ids=['frp-fan'];
  else if(condition==='oil')ids=['fan'];
  const reasons={
    'medium-backward-fan':'較潔淨氣流的中壓通風候選；是否符合所填風量與全壓須用原廠 Q–P 曲線確認。',
    'hp-backward-fan':'較潔淨且高阻力系統的候選；公開資料不能確認此工況點，須以原廠曲線核對。',
    'medium-radial-fan':'原廠列為粉塵集氣與污染處理排風用途；須確認粒子磨蝕、堵塞風險和 Q–P 曲線。',
    'frp-fan':'原廠有防腐玻璃鋼風機系列；須核對介質、溫度、材質耐受與 Q–P 曲線。',
    fan:'含油霧／黏性氣流須確認葉輪清洗與材質；先由工業風機系列進行人工初篩。'
  };
  const candidates=ids.filter(id=>catalogById.has(id)).map(id=>({id,reason:reasons[id]}));
  const missing=[...duty.missing];
  if(condition==='unknown')missing.push('風機入口氣流是否含粉塵、腐蝕物或油霧，才能縮小風機系列。');
  if(fan.temperature==null)missing.push('風機入口溫度，才能確認材質、軸承與密封適用性。');
  missing.push('原廠該系列的 Q–P／效率曲線與運轉點，才能定型號及馬達。');
  return {duty,candidates,missing};
}
