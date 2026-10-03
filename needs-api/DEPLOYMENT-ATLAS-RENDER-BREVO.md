# 需求工具上線：Atlas + Render + Brevo

目前客戶頁放在 GitHub Pages；GitHub Pages 不能保存私密客戶資料或執行寄信。以下配置讓需求先存進公司管理的資料庫，再由後端寄通知到 `info@bestasv.vn`，並產生初步 AI 推薦。三個服務的帳號、付費方式及 DNS 權限都應歸公司所有。不要把密碼、API 金鑰或 MongoDB 連線字串提交到 GitHub。

## 1. 建受保護資料庫：MongoDB Atlas

1. 用公司帳號在 [MongoDB Atlas](https://cloud.mongodb.com/) 建立專案（例如 `besta-needs`）。正式收集客戶資料建議選 **Flex**：有每日備份快照；免費 M0 沒有 Atlas 備份，較適合無真實客戶資料的測試。先選靠近 Render 後端的區域。
2. 建立專用的資料庫使用者，例如 `besta_needs_app`，只授權 `readWrite` 到 `besta_needs` 資料庫。此帳號與登入 Atlas 管理頁的帳號不同。
3. 到 Render 服務的 **Connect → Outbound** 取得對外 IP 範圍，將這些範圍加入 Atlas **Network Access**。避免長期開放 `0.0.0.0/0`。
4. 在 Atlas **Connect → Drivers** 取得 `mongodb+srv://…` 連線字串，替換使用者名稱和密碼。密碼若含特殊字元，須依 MongoDB 指示做 URI 編碼。把完整字串存入 Render 的 `MONGODB_URI` 秘密環境變數，`MONGODB_DB` 設為 `besta_needs`。

後端首次連上後會自動建立 `customer_needs` 集合及需求編號、建立時間、保存期限索引，不需在 Atlas 手動建立資料表。資料預設 365 天後透過 TTL 刪除，可用 `DATA_RETENTION_DAYS` 調整；上線前應確認這與公司的資料保存政策一致。

## 2. 建通知寄信服務：Brevo 或公司現有 SMTP

若公司現有郵件服務支援應用程式 SMTP 寄信，可直接使用其 SMTP 主機、帳號和專用憑證。若沒有，可用公司帳號建立 [Brevo](https://www.brevo.com/)：驗證 `bestasv.vn` 網域的 DNS 記錄（含 DKIM 等）、建立已驗證寄件者，再在 **SMTP & API → SMTP** 取得 SMTP 登入名稱及 **SMTP key**。SMTP key 不是 Brevo API key。

Brevo 的後端設定如下；`SMTP_FROM` 必須是已驗證寄件地址。客戶信箱會設成郵件的 `Reply-To`，公司收到通知後可直接回覆客戶。

```text
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<Brevo SMTP 登入名稱>
SMTP_PASS=<Brevo SMTP key>
SMTP_FROM=BESTA Needs <info@bestasv.vn>
NOTIFY_TO=info@bestasv.vn
```

若 `info@bestasv.vn` 尚不能作為已驗證寄件者，可用另一個公司網域的已驗證地址作為 `SMTP_FROM`，`NOTIFY_TO` 仍可保持 `info@bestasv.vn`。通知信會包含需求編號、所有已選問題類型的工程欄位、聯絡資料與初步推薦。寄信失敗時資料仍留在 Atlas，後台可核對狀態並補寄。

## 3. 部署後端：Render

在 [Render](https://dashboard.render.com/) 用公司帳號連結 GitHub 儲存庫 `GuanYuC9281/Bestasv2-International-Trade`，新增 **Web Service**：

| 設定 | 值 |
| --- | --- |
| Branch | `codex/customer-needs-tool` |
| Root Directory | `needs-api` |
| Language | Node |
| Build Command | `npm ci` |
| Start Command | `npm start` |
| Compute | 付費 Web Service；免費服務封鎖 25／465／587 SMTP 連接埠 |
| Health Check Path | `/api/health` |

在 Render 的 **Environment** 設定下列變數。值只填在 Render，不寫進儲存庫或公開的 `needs/config.js`。

```text
PUBLIC_ORIGIN=https://guanyuc9281.github.io
MONGODB_URI=<Atlas 連線字串>
MONGODB_DB=besta_needs
OPENAI_API_KEY=<服務端專用 API key>
OPENAI_MODEL=<支援 Structured Outputs 的模型>
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<Brevo SMTP 登入名稱>
SMTP_PASS=<Brevo SMTP key>
SMTP_FROM=BESTA Needs <info@bestasv.vn>
NOTIFY_TO=info@bestasv.vn
ADMIN_API_TOKEN=<至少 32 字元的隨機密鑰>
DATA_RETENTION_DAYS=365
```

`PORT` 可不填，由 Render 提供。`ADMIN_API_TOKEN` 只供受保護後台 API 查詢與補寄，不能放進公開網頁。Render 預設會給一個 HTTPS `onrender.com` 位址。

## 4. 接回 GitHub Pages 並驗收

1. 後端啟動成功後，用瀏覽器讀取 `https://<Render 網址>/api/health`，應顯示 `ready:true`。若失敗，先檢查 Atlas 網路存取、資料庫使用者和 Render 日誌。
2. 把 Render HTTPS 位址填入公開頁 `needs/config.js` 的 `BESTA_NEEDS_API_BASE`，部署到手機預覽分支後，送出按鈕才會開啟。**只填 URL，不填任何金鑰。**
3. 用虛構公司與聯絡資料從手機送一次，逐一核對：頁面出現需求編號、Atlas `customer_needs` 出現同編號記錄、公司信箱收到通知、推薦連結指向公司產品。測試 AI 失敗及寄信失敗情境，確認資料仍保留且可人工追蹤。這四項未通過前不要收集真實客戶資料。

參考：[Atlas 建立資料庫與連線](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/)、[Atlas 備份差異](https://www.mongodb.com/docs/atlas/manage-clusters/)、[Render 部署子資料夾](https://render.com/docs/your-first-deploy)、[Render 連線 Atlas](https://render.com/docs/connect-to-mongodb-atlas)、[Render 免費服務限制](https://render.com/docs/free)、[Brevo SMTP 設定](https://help.brevo.com/hc/en-us/articles/7924908994450-Send-transactional-emails-using-Brevo-SMTP)。
