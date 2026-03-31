# 貝達國際貿易有限公司官網

專業的國際貿易公司網站，包含前後台管理系統，支援多語言。

## 功能特色

### 前台功能
- 🌐 多語言支援 (繁體中文、英文、日文、越南文)
- 📱 響應式設計，支援各種設備
- 🎨 現代化簡約設計風格
- ⚡ 快速載入的Loading畫面
- 📧 聯絡表單功能
- 📰 最新消息展示
- 🏢 公司介紹
- 📦 產品與服務展示
- 🔄 合作流程說明

### 後台管理功能
- 📊 儀表板總覽
- 📰 最新消息管理
- 📧 聯絡表單管理
- 📦 產品管理
- 🛠️ 服務管理
- ⚙️ 系統設定
- 📊 性能監控
- 👥 用戶權限管理

## 技術架構

### 前端
- React 18
- React Router
- Tailwind CSS
- Framer Motion (動畫)
- React i18next (多語言)
- Lucide React (圖標)
- Axios (HTTP客戶端)

### 後端
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT認證
- Multer (文件上傳)
- Helmet (安全性)
- Morgan (日誌)

## 安裝說明

### 環境需求
- Node.js 16+ 
- MongoDB 4.4+
- npm 或 yarn

### 安裝步驟

1. **安裝Node.js**
   ```bash
   # 前往 https://nodejs.org 下載並安裝最新LTS版本
   ```

2. **安裝MongoDB**
   ```bash
   # 前往 https://www.mongodb.com 下載並安裝MongoDB
   # 或使用MongoDB Atlas (雲端版)
   ```

3. **克隆專案**
   ```bash
   git clone https://github.com/GuanYuC9281/Bestasv2-International-Trade.git
   cd Bestasv2-International-Trade
   ```

4. **安裝依賴**
   ```bash
   # 安裝根目錄依賴
   npm install
   
   # 安裝前端依賴
   cd client
   npm install
   
   # 安裝後端依賴
   cd ../server
   npm install
   ```

5. **環境設定**
   ```bash
   # 複製環境變數檔案
   cd server
   cp .env.example .env
   
   # 編輯 .env 檔案，設定必要的環境變數
   # MONGODB_URI, JWT_SECRET, EMAIL_HOST 等
   ```

6. **啟動MongoDB**
   ```bash
   # 如果使用本地MongoDB
   mongod
   
   # 或確保MongoDB服務正在運行
   ```

7. **啟動應用程式**
   ```bash
   # 回到根目錄
   cd ..
   
   # 同時啟動前後端 (開發模式)
   npm run dev
   
   # 或分別啟動
   # 啟動後端 (端口 5000)
   npm run server
   
   # 啟動前端 (端口 3000)
   npm run client
   ```

8. **建立管理員帳戶**
   ```bash
   # 訪問 http://localhost:3000/admin
   # 註冊第一個帳戶將自動成為管理員
   ```

## 部署說明

### 生產環境部署

1. **建置前端**
   ```bash
   npm run build
   ```

2. **設定生產環境變數**
   ```bash
   # 在 server/.env 中設定
   NODE_ENV=production
   MONGODB_URI=mongodb://your-production-db
   JWT_SECRET=your-super-secret-key
   ```

3. **啟動生產伺服器**
   ```bash
   npm start
   ```

### Docker部署 (可選)

```bash
# 建置Docker映像
docker build -t bestas-trade .

# 運行容器
docker run -p 5000:5000 -e MONGODB_URI=your-db-uri bestas-trade
```

## 專案結構

```
Bestasv2-International-Trade/
├── client/                 # React前端
│   ├── public/
│   ├── src/
│   │   ├── components/     # 共用組件
│   │   ├── pages/         # 頁面組件
│   │   ├── i18n/          # 多語言設定
│   │   └── ...
│   └── package.json
├── server/                 # Node.js後端
│   ├── models/            # MongoDB模型
│   ├── routes/            # API路由
│   ├── middleware/        # 中介軟體
│   ├── uploads/           # 文件上傳目錄
│   └── package.json
├── package.json            # 根目錄設定
└── README.md
```

## API文檔

### 認證
- `POST /api/auth/login` - 登入
- `POST /api/auth/register` - 註冊
- `GET /api/auth/me` - 獲取用戶資訊

### 新聞管理
- `GET /api/news` - 獲取新聞列表
- `GET /api/news/:id` - 獲取單篇新聞
- `POST /api/news` - 創建新聞 (需認證)
- `PUT /api/news/:id` - 更新新聞 (需認證)
- `DELETE /api/news/:id` - 刪除新聞 (需認證)

### 聯絡表單
- `POST /api/contact` - 提交聯絡表單
- `GET /api/contact/admin/all` - 獲取所有聯絡記錄 (需認證)
- `PUT /api/contact/admin/:id/status` - 更新狀態 (需認證)

## 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 授權

本專案採用 MIT 授權 - 查看 [LICENSE](LICENSE) 檔案了解詳情。

## 聯絡資訊

**貝達國際貿易有限公司**
- 📱 電話: +886-985-328-164
- 📧 郵箱: info@bestas-trade.com
- 📍 地址: 台北市文山區木柵路二段

---

© 2024 貝達國際貿易有限公司. All rights reserved.
