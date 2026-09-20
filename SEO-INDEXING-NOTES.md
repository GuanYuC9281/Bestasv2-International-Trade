# 兩個網域獨立收錄的處理紀錄

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
