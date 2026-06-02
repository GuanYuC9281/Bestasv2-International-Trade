# 圖片管理說明

## 📁 目錄結構

```
images/
├── company/        # 公司相關圖片
├── news/          # 新聞圖片
├── products/      # 產品圖片
├── services/      # 服務圖片
├── team/          # 團隊成員圖片
└── background/    # 背景圖片
```

## 🖼️ 圖片用途說明

### 🏢 company/
- **logo.png** - 公司Logo
- **building.jpg** - 公司建築外觀
- **office.jpg** - 辦公室環境
- **team-photo.jpg** - 團隊合照

### 📰 news/
- **news-1.jpg** - 新聞1配圖
- **news-2.jpg** - 新聞2配圖
- **news-3.jpg** - 新聞3配圖
- **featured.jpg** - 精選新聞圖片

### 📦 products/
- **product-1.jpg** - 產品1圖片
- **product-2.jpg** - 產品2圖片
- **product-3.jpg** - 產品3圖片
- **category-1.jpg** - 分類1圖片

### 🛠️ services/
- **service-1.jpg** - 服務1圖片
- **service-2.jpg** - 服務2圖片
- **service-3.jpg** - 服務3圖片
- **process.jpg** - 服務流程圖片

### 👥 team/
- **ceo.jpg** - 執行長照片
- **manager-1.jpg** - 經理1照片
- **manager-2.jpg** - 經理2照片
- **staff-1.jpg** - 員工1照片

### 🌄 background/
- **hero-bg.jpg** - 首頁背景圖
- **about-bg.jpg** - 關於我們背景圖
- **contact-bg.jpg** - 聯絡我們背景圖
- **pattern.jpg** - 裝飾圖案

## 📏 圖片規格建議

### 📐 尺寸規格
- **Logo**: 200x200px (正方形)
- **橫向圖片**: 1200x800px (16:10)
- **縱向圖片**: 800x1200px (2:3)
- **縮圖圖片**: 400x300px (4:3)

### 💾 檔案格式
- **推薦**: JPG, PNG, WebP
- **Logo**: PNG (支援透明背景)
- **檔案大小**: 建議小於 500KB

### 🎨 圖片品質
- **解析度**: 72dpi (網頁用)
- **壓縮**: 平衡品質與檔案大小
- **命名**: 使用英文和連字符，避免空格

## 🔗 使用方式

### HTML 中的引用
```html
<!-- 公司Logo -->
<img src="images/company/logo.png" alt="貝達國際貿易有限公司">

<!-- 新聞圖片 -->
<img src="images/news/news-1.jpg" alt="新聞標題">

<!-- 產品圖片 -->
<img src="images/products/product-1.jpg" alt="產品名稱">
```

### CSS 中的引用
```css
.hero-section {
    background-image: url('images/background/hero-bg.jpg');
    background-size: cover;
    background-position: center;
}
```

## 📝 注意事項

1. **版權**: 確保所有圖片都有使用權限
2. **優化**: 壓縮圖片以提升載入速度
3. **命名**: 使用有意義的檔案名稱
4. **備份**: 定期備份重要圖片
5. **一致性**: 保持同類型圖片的風格一致

## 🔄 更新流程

1. 將新圖片放入對應資料夾
2. 按照命名規則重新命名
3. 在HTML/CSS中更新引用路徑
4. 測試圖片是否正確顯示
5. 更新此README文件（如需要）
