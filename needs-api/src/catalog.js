// This is an allowlist of items explicitly shown on the company's Chinese site.
// Changes to product offerings require a catalog review before deployment.
export const CATALOG_VERSION = '2026-10-03';
export const catalog = Object.freeze([
  {id:'pulse-bag',name:'脈衝袋濾集塵機',category:'粉塵',url:'https://bestasv.com/zh/collector-solution.html',fit:'乾式粉塵、需高效率粒狀物收集'},
  {id:'cartridge',name:'筒式集塵機',category:'粉塵',url:'https://bestasv.com/zh/collector-solution.html',fit:'適合濾筒的乾式粉塵及緊湊配置'},
  {id:'cyclone',name:'旋風分離器',category:'粉塵',url:'https://bestasv.com/zh/collector-solution.html',fit:'較粗或高負荷粉塵的前處理；細粉塵通常需搭配後段'},
  {id:'esp',name:'靜電集塵器（ESP）',category:'粉塵',url:'https://bestasv.com/zh/collector-solution.html',fit:'細粒子收集；需確認粉塵電阻率與實際工況'},
  {id:'scrubber',name:'PP／FRP 洗滌塔',category:'酸鹼廢氣',url:'https://bestasv.com/zh/chemical-gas-treatment.html',fit:'可溶性酸鹼氣體；需確認藥劑、材質與廢液處置'},
  {id:'chemical-wash',name:'化學洗滌系統',category:'酸鹼廢氣',url:'https://bestasv.com/zh/chemical-gas-treatment.html',fit:'需依污染物反應性配置洗滌液與接觸時間'},
  {id:'carbon',name:'活性碳吸附設備',category:'VOC／異味',url:'https://bestasv.com/zh/chemical-gas-treatment.html',fit:'適合可吸附 VOC／異味；需確認濃度、溫濕度與更換週期'},
  {id:'oil-esp',name:'靜電油煙處理機',category:'油煙',url:'https://bestasv.com/zh/oil-smoke-treatment.html',fit:'油煙霧滴及細小油粒'},
  {id:'oil-wash',name:'水洗式處理設備',category:'油煙',url:'https://bestasv.com/zh/oil-smoke-treatment.html',fit:'油煙前處理與清洗需求；需處理循環水'},
  {id:'paint-system',name:'噴漆設備工程',category:'噴漆',url:'https://bestasv.com/zh/paint-dust-treatment.html',fit:'漆霧、噴塗粉塵與配套排風整合'},
  {id:'fan',name:'工業風機系列',category:'排風',url:'https://bestasv.com/zh/fan-solution.html',fit:'搭配工況、總壓損與風量選型'},
  {id:'duct',name:'通風風管系列',category:'排風',url:'https://bestasv.com/zh/duct-solution.html',fit:'依腐蝕性、溫度與配置選材'},
  {id:'oil-exhaust',name:'排煙通風系統',category:'油煙',url:'https://bestasv.com/zh/oil-smoke-treatment.html',fit:'餐飲或工業油煙整體排風'},
]);
export const catalogById = new Map(catalog.map(item=>[item.id,item]));
