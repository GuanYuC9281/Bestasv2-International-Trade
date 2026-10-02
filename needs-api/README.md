# 需求工具 API

此服務供 GitHub Pages 的 `needs/` 客戶頁使用。GitHub Pages 只提供公開靜態檔案；MongoDB 連線、OpenAI 金鑰、SMTP 帳密與客戶資料只能放在本服務及受保護資料庫，**不可放在 GitHub 儲存庫或 `needs/config.js`**。

## 啟用

1. 建立由公司掌控的 MongoDB Atlas 資料庫及最小權限的應用程式帳號，資料庫名稱建議 `besta_needs`，啟用 TLS、備份與 IP／網路存取限制。此程式第一次連線時會建立 `customer_needs` 集合、唯一需求編號索引，以及到期刪除索引。
2. 將本資料夾部署至支援 Node.js 20+ 的 HTTPS 後端平台。執行 `npm ci`，啟動指令 `npm start`。
3. 複製 `.env.example` 的項目至**部署平台的秘密環境變數**，不要上傳實際 `.env`。`MONGODB_URI` 應使用資料庫專用帳號；`ADMIN_API_TOKEN` 至少 32 個隨機字元。SMTP 收件人預設為官網公開信箱 `info@bestasv.vn`。
4. 將 GitHub Pages 來源網域設成 `PUBLIC_ORIGIN=https://guanyuc9281.github.io`；把 `needs/config.js` 的 API 位址設為步驟 2 的 HTTPS 網址。
5. 使用**虛構資料**驗收：先確認 `GET /api/health` 回傳 `ready:true`；提交後核對 MongoDB 文件、寄信狀態與推薦產品連結。不要把真實客戶個資放進測試紀錄或 GitHub issue。

必要環境變數：`MONGODB_URI`、`MONGODB_DB`、`PUBLIC_ORIGIN`、`OPENAI_API_KEY`、`OPENAI_MODEL`、`SMTP_HOST`、`SMTP_FROM`、`ADMIN_API_TOKEN`。SMTP 若需登入，再設定 `SMTP_USER`、`SMTP_PASS`。`SMTP_SECURE=true` 用於 465；587 預設要求 STARTTLS。資料預設保存 365 天，可用 `DATA_RETENTION_DAYS` 調整（30–3650 天）。正式上線前需與公司隱私權聲明一致。

若後端確實位於單層受信任反向代理之後，設定 `TRUST_PROXY=true`，讓每個客戶的 IP 限流正確；直接對外的 Node 服務維持 `false`。正式使用仍建議在代理層加上持久化限流與機器人防護。

## 流程與資料邊界

- `POST /api/needs` 驗證需求及聯絡欄位，要求同意聲明，使用每次提交的 UUID 防止重複建檔。客戶可勾選多項問題，每項都有獨立的工程資料表，未選項目不儲存。資料先存入 MongoDB，再由 OpenAI Responses API 的 Structured Outputs 初篩，最後寄通知。AI 只接收製程資料；結構化的公司、聯絡人、電話與信箱不會送出。自由文字中的常見信箱／電話格式也會遮蔽，但無法保證辨識所有個資，因此頁面提示客戶勿填入個資。
- AI 的可選項只來自 `src/catalog.js`，同時收錄 `bestasv.com` 及 `codanh.com` 可核對的產品。程式再次檢查產品 ID、問題類型和已知工程條件（例如濕黏粉塵不建議乾式濾材、細粉塵不單靠旋風、高壓風機須有風管或壓損資料）。若 AI 無法給出相符產品，需求仍保存並發通知，由工程師人工評估。AI 結果不代表設備規格、去除效率或法規達標承諾。
- 寄信失敗時紀錄 `notification=failed`，`GET /api/admin/needs` 可查並用 `POST /api/admin/needs/:id/resend` 補寄。通知並非交易式 exactly-once，補寄前請核對信箱是否已收到相同需求編號。
- `GET /api/admin/needs`（支援 `limit`、`before` 分頁）、`GET /api/admin/needs/:id`、`POST /api/admin/needs/:id/resend`、`DELETE /api/admin/needs/:id` 必須使用 `Authorization: Bearer <ADMIN_API_TOKEN>`。公開客戶頁沒有查詢資料庫權限。正式營運建議加上人員帳號、權限與操作稽核，再提供公司內部管理介面。

## 驗證

在本資料夾執行 `npm test`、`npm audit`。計算公式的既有驗證在上層 `engineering/test.cjs`、`engineering/VALIDATION.md`、`engineering/FIELD-AUDIT.md`。產品名稱與連結以 [貝達基銘集塵設備](https://bestasv.com/zh/collector-solution.html)、[廢氣處理](https://bestasv.com/zh/chemical-gas-treatment.html)、[油煙處理](https://bestasv.com/zh/oil-smoke-treatment.html)、[噴漆設備](https://bestasv.com/zh/paint-dust-treatment.html)、[工業風機](https://bestasv.com/zh/fan-solution.html)、[風管](https://bestasv.com/zh/duct-solution.html)、[基銘乾式過濾設備](https://www.codanh.com/zh/products/industrial-dry-filter-systems)、[濕式過濾設備](https://www.codanh.com/zh/products/industrial-wet-filter-systems) 與 [高壓前傾風機](https://www.codanh.com/zh/products/industrial-ventilation-fan/high-pressure/hp-forward) 頁核對。該風機頁的數值欄位疑似錯置，僅用產品類別，不以網頁表格直接推算型號。AI 結構化輸出實作依照 [OpenAI 官方文件](https://developers.openai.com/api/docs/guides/structured-outputs)。

需求欄位的工程依據：[US EPA 空污防制成本手冊](https://www.epa.gov/sites/default/files/2020-07/documents/c_allchs.pdf)指出袋濾選型與粉塵、濾材、溫度、壓損及粒徑相關；[US EPA 活性碳吸附章節](https://www.epa.gov/sites/default/files/2020-11/documents/cs3-1ch1.pdf)列出風量、VOC 入口／出口負荷、吸附時間、工作容量、濕度等參數；[US EPA 濕式洗滌監測說明](https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-control-technique-wet-scrubber-particulate-matter)列出壓差、液體流量與出口濃度等監測量。粉塵入口量的頁面即時計算只在風量與濃度同為實際或標準狀態，且乾／濕基準相同時使用質量平衡 `kg/h = (m³/h) × (mg/m³) ÷ 10⁶`，不把不同基準的數值混算。這是入口質量流率，不是預測設備出口排放或效率。
