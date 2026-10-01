# 兩個網域獨立收錄的處理紀錄

## 2026-10-01：品牌搜尋改善

本次針對「貝達」與「công ty tnhh tm sx & dv besta sv」檢查，依使用者要求先完成驗證再透過既有 GitHub → Vercel 流程發布。Search Console 索引要求需登入有管理權的工作階段才能提交，不能以部署成功代替。

### 公開網站與原始碼檢查

- `.com/zh/` 與 `.vn/vn/` 均回傳 HTTP 200，未帶 `X-Robots-Tag: noindex`；兩站 robots.txt 允許 Googlebot 並宣告各自的 Sitemap。
- `.com/` 回傳 HTTP 200，但內容是 meta refresh／JavaScript 跳轉頁；`.vn/` 實際回傳 307 到 `/vn/`。這些結果只代表當次公開 HTTP 檢查，不代表 Google 已收錄或選定本站 canonical。
- 25 個中文頁面的原始 HTML 中，公司名稱與 Logo 替代文字是問號，需依靠 JavaScript 補回。
- 越南站首頁的正文在後續版面同步後，與 `.com/vn/` 相同；舊測試甚至要求兩者相同。公司介紹與聯絡頁仍保留本地公司資訊。
- 公開搜尋工具本次沒有回傳兩站的 `site:` 查詢結果。這不能證明 Google 完全未收錄，也不是使用者所在地 Google 排名的完整量測；既有 Search Console 證據仍須保留。

### 已修改

- 將中文頁面的品牌文字直接寫入 HTML；中文首頁 H1 加入「貝達 BESTA SV」。
- 中文首頁新增公司簡介，包含越南公司完整名稱與越南官網連結；越南首頁新增本地公司介紹、稅號、既有地址、Email、詢價準備資訊與中文品牌對照。兩站的設備與案例區塊維持原有版面。
- 中文首頁、公司介紹及聯絡頁增加一致的 Organization、WebSite 與頁面結構化資料及 Open Graph；越南三個公司頁補齊品牌別名與另一官網的識別連結。兩站仍各自使用本站 canonical，未將兩站合併。
- 兩份 Vercel 設定新增依網域區分的永久首頁跳轉：`.com/`、`.com/index.html` → `.com/zh/`；`.vn/`、`.vn/index.html` → `.vn/vn/`。平台層的 Domain Redirect 若優先執行，必須在部署後另外確認實際 HTTP 狀態。
- Sitemap 移除僅供跳轉的 `.com/`，只更新本次變更頁面的 lastmod；新增回歸檢查，防止首頁內容再次完全同步或品牌文字退回問號。

### 發布後的必要驗證與提交

1. 部署後，確認兩站首頁回傳 200、canonical 各自指向本站、品牌介紹與結構化資料已更新；檢查根網址的 308 跳轉，以及 `/vn/` 未受內部 `__vn` 路徑的 noindex 設定影響。
2. 在 Search Console 各自的網域資源提交 `https://bestasv.com/sitemap.xml` 與 `https://bestasv.vn/sitemap-vn.xml`。
3. 對 `.com/zh/`、`.com/zh/about.html`、`.com/zh/contact.html`、`.vn/vn/`、`.vn/vn/about.html`、`.vn/vn/contact.html` 執行即時測試及要求建立索引。首頁使用上述最終網址，不提交僅供跳轉的根網址。
4. 比對「使用者宣告的標準網址」與「Google 選定的標準網址」，特別留意 `.vn/vn/` 是否仍被併到 `.com/vn/`。
5. 在成效報表分別觀察「貝達」、「貝達國際貿易」、「BESTA SV」與完整越南公司名稱的曝光、點擊及平均排名，並區分台灣／越南與裝置；不能把單次搜尋結果當成全體使用者排名。

SEO、站內連結及靜態建置可用 `node scripts/check-seo.js`、`node scripts/check-local-links.js`、`npm run build` 驗證。兩站共用的產品頁仍可能被視為重複內容；這次改善不能保證兩個網域同時出現在前兩名。

### 部署前結構驗證

- 與原正式版 `7642090` 比對：127 個 HTML 頁面的既有標籤結構、ID、導航連結、圖片路徑、表單、事件處理及內嵌程式保留；共享 CSS／JavaScript 與既有 Vercel 路由不變。可用 `node scripts/check-seo-structure.js 7642090` 重現。
- SEO 檢查通過 125 個語系頁面及 115 個 Sitemap 網址；站內連結檢查與靜態建置通過。
- 瀏覽器檢查涵蓋中英日越首頁、中文與越南本地公司／聯絡頁的桌機及手機版本，驗證選單、首頁聯絡按鈕、語言切換、圖片與頁面錯誤。未實際送出聯絡表單。
- 中文與越南本地聯絡頁在 1440px 桌機視窗下有既存的 1621px 文件寬度；修改前後數值相同，並非本次 SEO 變更新增。為保留原結構，本次不修改該頁共享版型。

Google 官方參考：[網站名稱與首頁結構化資料](https://developers.google.com/search/docs/appearance/site-names)、[要求重新抓取](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)。重新抓取可能需數天至數週，索引申請不保證立即收錄或排名。

---

以下為先前處理紀錄，後續首頁同步情況及本次修正以 2026-10-01 紀錄為準。

## 已確認的問題

使用者提供的 Search Console 報告顯示：Google 成功抓取 https://bestasv.vn/vn/，但將它歸為重複內容，選定 https://bestasv.com/vn/ 為標準網址。後續搜尋截圖顯示 .com 的部分產品與公司頁面已被收錄，因此不能再把 .com 描述為完全未收錄。

## 本次實作

- 保留兩站各自指向本身的 canonical，沒有跨網域合併或重新導向。
- .vn 首頁、公司介紹與聯絡頁改為越南本地內容，加入可見的完整公司名稱、稅號 0318644214、企業地址、設備服務說明和詢價準備資訊；對應 Organization JSON-LD 同步公司資料。
- .vn 的公司地址統一為 D2/10A Đoàn Nguyễn Tuân, Thành phố Hồ Chí Minh, Việt Nam。採用已核對的街道與城市，不補寫未確認的行政區、工廠規模或服務承諾。
- .vn 不再被標記為 .com 多語言頁面的翻譯版本；.com 自身的中英日越語言標記保持原有對應。
- 兩站 robots.txt 各自宣告本站 Sitemap。.vn 的 /sitemap.xml 也提供越南站的 Sitemap，便於抓取與提交。
- 修正越南文內容裡殘留的 Beida 舊譯名；.com 保留台越國際業務定位。
- 圖示檢查：兩站首頁均有 favicon 宣告，圖示檔案 HTTP 200，內容相同。未發現缺檔；Google 搜尋和 Search Console 的圖示、舊標題更新仍需重新抓取。

## 驗證

執行 node scripts/check-seo.js、node scripts/check-local-links.js 及靜態建置；另外檢查越南站首頁桌面排版、公司介紹與聯絡頁手機排版。不要實際提交聯絡表單作為測試。

## Search Console 提交清單

- .vn Sitemap：https://bestasv.vn/sitemap-vn.xml
- .com Sitemap：https://bestasv.com/sitemap.xml
- .vn 要求重新索引：https://bestasv.vn/vn/、https://bestasv.vn/vn/about.html、https://bestasv.vn/vn/contact.html
- .com 要求重新索引：https://bestasv.com/、https://bestasv.com/vn/、https://bestasv.com/vn/about.html、https://bestasv.com/vn/faq.html

需要已登入且有管理權的 Search Console 工作階段才能提交。公開頁面可抓取、部署成功、索引要求已提交、Google 已收錄是四種不同狀態，必須分別確認。三個重點頁已差異化；兩站共用的產品頁仍可能被 Google 當成重複內容，不能保證所有網址均分開收錄或兩站同時排名。

參考：https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting
