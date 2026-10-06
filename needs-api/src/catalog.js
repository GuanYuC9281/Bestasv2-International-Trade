// This is an allowlist of items explicitly shown on the company's Chinese site.
// Changes to product offerings require a catalog review before deployment.
export const CATALOG_VERSION = '2026-10-06';
export const catalog = Object.freeze([
  {id:'pulse-bag',name:'脈衝袋濾集塵機',category:'粉塵',url:'https://www.codanh.com/zh/products/industrial-dry-filter-systems/pulse-jet-baghouse',fit:'乾燥、非黏性粉塵的過濾；可燃粉塵需另行防爆評估'},
  {id:'cartridge',name:'脈衝彈匣式集塵機',category:'粉塵',url:'https://www.codanh.com/zh/products/industrial-dry-filter-systems/cartridge-dust-collector',fit:'乾燥、非黏性細粉塵；濾材與清灰需按特性核對'},
  {id:'cyclone',name:'旋風集塵器',category:'粉塵',url:'https://www.codanh.com/zh/products/industrial-dry-filter-systems/cyclone-dust-collector',fit:'較粗顆粒或高負荷粉塵的前處理；細粉塵不可單靠旋風保證達標'},
  {id:'multi-cyclone',name:'多管旋風集塵器',category:'粉塵',url:'https://www.codanh.com/zh/products/industrial-dry-filter-systems/multi-cyclone-dust-collector',fit:'多管旋風前處理；需按粒徑分布與排放目標核對效率'},
  {id:'wet-dust',name:'金屬研磨粉塵濕式過濾設備',category:'粉塵',url:'https://www.codanh.com/zh/products/industrial-wet-filter-systems',fit:'金屬研磨粉塵可評估濕式收集；需核對材質、廢水與安全性'},
  {id:'wet-cyclone',name:'濕式旋風分離機',category:'粉塵',url:'https://www.codanh.com/zh/products/industrial-wet-filter-systems',fit:'潮濕或需濕式處理的粉塵候選；需核對廢水、腐蝕與實際收集效率'},
  {id:'esp',name:'靜電集塵器（ESP）',category:'粉塵',url:'https://bestasv.com/zh/collector-solution.html',fit:'細粒子收集；需確認粉塵電阻率與實際工況'},
  {id:'scrubber',name:'PP／FRP 洗滌塔',category:'酸鹼廢氣',url:'https://bestasv.com/zh/chemical-gas-treatment.html',fit:'可溶性酸鹼氣體；需確認藥劑、材質與廢液處置'},
  {id:'chemical-wash',name:'化學洗滌系統',category:'酸鹼廢氣',url:'https://bestasv.com/zh/chemical-gas-treatment.html',fit:'需依污染物反應性配置洗滌液與接觸時間'},
  {id:'carbon',name:'活性碳吸附設備',category:'VOC／異味',url:'https://bestasv.com/zh/chemical-gas-treatment.html',fit:'適合可吸附 VOC／異味；需確認濃度、溫濕度與更換週期'},
  {id:'rto',name:'蓄熱式焚化爐（RTO）',category:'VOC',url:'https://www.codanh.com/zh/products/industrial-dry-filter-systems',fit:'VOC 氧化處理的候選方案；需核對成分、熱值、濃度波動及安全性'},
  {id:'oil-esp',name:'靜電油煙處理機',category:'油煙',url:'https://bestasv.com/zh/oil-smoke-treatment.html',fit:'油煙霧滴及細小油粒'},
  {id:'oil-wash',name:'水洗式處理設備',category:'油煙',url:'https://bestasv.com/zh/oil-smoke-treatment.html',fit:'油煙前處理與清洗需求；需處理循環水'},
  {id:'paint-system',name:'噴漆設備工程',category:'噴漆',url:'https://bestasv.com/zh/paint-dust-treatment.html',fit:'漆霧、噴塗粉塵與配套排風整合'},
  {id:'fan',name:'工業風機系列',category:'排風',url:'https://bestasv.com/zh/fan-solution.html',fit:'搭配工況、總壓損與風量選型'},
  {id:'hp-forward-fan',name:'高壓彎翼前傾離心風機',category:'排風',url:'https://www.codanh.com/zh/products/industrial-ventilation-fan/high-pressure/hp-forward',fit:'長風管、高阻力工況候選；須用實測壓損與風機曲線確認型號，不依網頁規格表自動選型'},
  {id:'hp-backward-fan',name:'高壓後傾透浦離心風機',category:'風機系列',url:'https://www.codanh.com/zh/products/industrial-ventilation-fan/high-pressure/hp-backward',fit:'較潔淨氣流及高阻力系統的候選；須以入口實際風量、全壓和原廠曲線核對'},
  {id:'medium-backward-fan',name:'中壓彎翼後傾離心風機',category:'風機系列',url:'https://www.codanh.com/zh/products/industrial-ventilation-fan/low-pressure/backward-curved',fit:'較潔淨氣流的中壓通風候選；官方網址與頁面壓力級別文字不一致，需向原廠核對'},
  {id:'medium-radial-fan',name:'中壓彎翼徑向離心風機',category:'風機系列',url:'https://www.codanh.com/zh/products/industrial-ventilation-fan/medium-pressure/radial-curved',fit:'粉塵集氣或污染處理排風候選；需核對磨蝕、黏附性與原廠曲線'},
  {id:'axial-fan',name:'軸流風機系列',category:'風機系列',url:'https://www.codanh.com/zh/products/industrial-ventilation-fan/low-pressure/axial-flow',fit:'較潔淨、低阻力大風量直送通風候選；官網壓力級別文字不一致，需原廠曲線確認'},
  {id:'frp-fan',name:'防腐玻璃鋼風機',category:'排風',url:'https://www.codanh.com/zh/products/anti-corrosion-series',fit:'腐蝕性氣流的排風候選；須核對材質、溫度與風機曲線'},
  {id:'duct',name:'通風風管系列',category:'排風',url:'https://bestasv.com/zh/duct-solution.html',fit:'依腐蝕性、溫度與配置選材'},
  {id:'oil-exhaust',name:'排煙通風系統',category:'油煙',url:'https://bestasv.com/zh/oil-smoke-treatment.html',fit:'餐飲或工業油煙整體排風'},
]);
export const catalogById = new Map(catalog.map(item=>[item.id,item]));
