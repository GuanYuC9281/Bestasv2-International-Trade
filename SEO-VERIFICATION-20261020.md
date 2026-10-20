# BESTA SV SEO 與公司資料交付驗證

日期：2026-10-20

## 修改範圍

1. 加強 BESTA、BESTA SV、Bestasv 與 CÔNG TY TNHH TM SX & DV BESTA SV 的品牌識別：標題、分享摘要、公司／網站／頁面結構化資料，以及首頁與公司簡介可見內容。
2. 全站原木柵路地址及既有越南地址統一為：
   **D2/10A Đoàn Nguyễn Tuân, Bình Chánh, Vietnam, 71810**
3. 公司簡介移除指定舊信箱段落。現有 info@bestasv.vn 與聯絡表單收件設定保留。
4. .vn 首頁增加越南公司的資訊與服務導覽；.com 維持台越設備供應、國際合作的內容定位。兩站獨立 canonical 保留。
5. Sitemap 只列出標準內容網址；更新修改日期並補上既有中文版換算工具。
6. 明確設定 .com 與 .vn 根網址、index.html 的網域入口導向。既有語言路徑維持不變。

## 驗證結果

- `node scripts/check-seo.js`：126 個內容頁、116 個 Sitemap 網址通過。包含 canonical、語言對應、品牌標題、公司地址、JSON-LD、兩個網域入口及 robots/Sitemap 路由。
- `node scripts/check-local-links.js`：126 個 HTML、5 個 CSS、10 個 JS 的本機資源／連結檢查通過。
- `node scripts/check-converter.js`：換算參考值、風管幾何、零值及單位往返測試通過。
- `node tmp/check-seo-regression.cjs`：比對此次修改前的本機快照；126 個內容頁原有程式、事件處理與錨點保留，265 個既有圖片／樣式等資源雜湊相同，135 段程式語法通過，6 個表單標記完全一致。
- `npm run build`：靜態建置成功。
- 發佈用原始檔內舊木柵地址（含中英日越文）與指定舊信箱搜尋結果為零。
- 瀏覽器檢查：中文首頁、英文公司簡介、日文聯絡頁、越文產品頁，以及越南站首頁／公司簡介／聯絡頁；在 1280px 桌面與 390px 手機尺寸抽查。
- 越南站手機首頁、公司簡介及聯絡頁無新增頁面橫向溢位；手機選單展開／收合正常。聯絡表單選擇環保工程服務後，詢問項目按鈕正常啟用。未實際傳送表單。
- 日文聯絡頁的原有輸入欄位在 1280px 尺寸會造成 1538px 頁寬；修改前、後皆相同，這次沒有更改該表單版型。產品頁圖片檢查中的空 src 是既有未開啟圖片視窗的預留元素，並非產品圖片遺失。
- 兩個正式網域修改前的公開 HTTP 檢查均為 200，首頁分別導向 `/zh/`、`/vn/`，未發現整站 X-Robots-Tag 禁止索引。

## 交付與部署

- ZIP 的網站檔案位於壓縮檔根目錄，可使用內附 `vercel.json` 部署，outputDirectory 為 `.`。
- Git 專案部署則使用專案根目錄 `vercel.json`，outputDirectory 為 `local-version`。
- 兩個自訂網域應指向同一份支援 Host 條件重寫的部署。只上傳靜態檔案而未套用路由，不能保證 .vn 會使用 `__vn/vn` 的專用內容。
- ZIP 不含 .git、node_modules、環境變數、舊版 ZIP 或測試暫存資料。
- 程式碼提交／推送不代表正式網域已更新；這份報告的變更驗證對象為本機交付版本。正式發布後須再核對首頁標題、地址及路由。

## 正式部署後的索引步驟

目前沒有可用的已授權 Search Console 連線，因此本次未代為提交 Sitemap 或要求索引。使用兩個網域各自的 Search Console 資源：

| 網域 | Sitemap | 優先檢查／要求索引 |
| --- | --- | --- |
| bestasv.com | https://bestasv.com/sitemap.xml | `/zh/`、`/vn/`、`/zh/about.html`、`/vn/about.html` |
| bestasv.vn | https://bestasv.vn/sitemap.xml | `/vn/`、`/vn/about.html`、`/vn/contact.html` |

透過 URL 檢查確認「使用者宣告的標準網址」與「Google 選擇的標準網址」，再要求重新索引。若 .vn 仍被歸入 .com，繼續增加有實際資料支持的越南專案內容；不要複製公司資料或製造關鍵字頁面。

搜尋結果更新取決於 Google 重新抓取與索引，不能保證立即出現、指定名次或兩個網域同時排名。Google 表示重新抓取可能需要數天至數週，索引要求也不保證收錄。

參考：

- [Google：網站名稱與 WebSite 結構化資料](https://developers.google.com/search/docs/appearance/site-names)
- [Google：要求重新抓取](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Google：管理多語言與多地區網站](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
