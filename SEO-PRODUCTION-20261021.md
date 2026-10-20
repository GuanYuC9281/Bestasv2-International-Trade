# BESTA SV 正式版更新

本次以正式分支 `04b7a25` 為基礎整合 SEO、地址與信箱更新，保留已在線上的中文品牌文字、兩站品牌介紹、導航、產品、案例、表單及網域路由。

## 更新

- 四語及越南專用頁面的原木柵路地址與舊越南地址統一為 `D2/10A Đoàn Nguyễn Tuân, Bình Chánh, Vietnam, 71810`。
- 移除公司簡介的 `info@codanh.com` 段落。
- 補齊 BESTA／BESTA SV／完整越文名稱的標題與品牌別名、Organization／WebSite／WebPage 結構化資料，以及分享摘要；公司地址與郵遞區號同步。
- 保留兩站各自 canonical、既有語言關係與不同定位的首頁內容，更新 Sitemap 修改日期。
- 補上越南公司簡介與聯絡頁公司資訊區塊的響應式樣式。

## 發布前驗證

- `node scripts/check-seo.js`：125 個內容頁、115 個 Sitemap 網址通過。
- `node scripts/check-local-links.js`：125 個內容頁、5 個 CSS、9 個 JS 的本機連結／資源檢查通過。
- `node scripts/check-seo-structure.js 04b7a25`：127 個 HTML 與既有共用檔案比對通過。除明確要求的地址、信箱段落及品牌資訊外，原有結構、圖片、程式、表單與路由保留。
- `npm run build`：靜態建置成功。
- 原始網站檔案內舊地址各語言版本及指定舊信箱的搜尋結果為零。

## 正式部署確認

必須由正式 `master` 觸發 Vercel Production 部署，再核對兩網域的 HTTP 回應、標題、canonical、公司地址、舊信箱移除、robots 與 Sitemap。預覽部署與 Git 提交不能視為正式上線。

正式站更新後，Google 搜尋結果仍需重新抓取與索引；本次不宣稱已完成 Search Console 提交或搜尋排名更新。
