# 風壓、風量與風速換算頁測試

獨立頁面：`local-version/zh/converter.html`。尚未加入官網選單。

## 開啟方式

切換到 `codex/airflow-converter` 分支，或在 GitHub 選擇此分支後使用 Code → Download ZIP 並解壓縮。

直接以瀏覽器開啟 `local-version/zh/converter.html` 即可操作，不需要安裝套件。也可以在專案根目錄執行：

```sh
python -m http.server 8766 --bind 127.0.0.1 --directory local-version
```

然後開啟 `http://127.0.0.1:8766/zh/converter.html`。此網址僅供執行伺服器的電腦使用；GitHub 原始碼頁面本身不會執行換算工具。

## 核對案例

| 功能 | 輸入 | 預期結果 |
| --- | --- | --- |
| 風壓 | 100 mmAq | 980.665 Pa |
| 風量 | 1 CMM | 60 CMH、約 35.31466672 CFM |
| 圓管風量反算風速 | 直徑 50 cm、37 CMM | 約 3.140657544 m/s |
| 矩形管風速推算風量 | 長 50 cm、寬 20 cm、10 m/s | 60 CMM |
| 矩形管風量反算風速 | 長 50 cm、寬 20 cm、60 CMM | 10 m/s |
| 無效尺寸 | 直徑 0 cm | 提示尺寸須大於 0，不顯示計算值 |

另請確認：三個頁籤切換、清除、空白欄位、負風量提示及手機畫面操作。

圓管面積使用 JavaScript `Math.PI`，內部保留浮點計算精度。畫面目前顯示最多 10 位有效數字。參考網站若使用 π = 3.14，圓管案例會出現約 0.0507% 的差異。

## 自動檢查

已安裝 Node.js 時，可在專案根目錄執行，不需額外套件：

```sh
node scripts/check-converter.js
```

檢查包含標準換算數值、圓管及矩形管面積、雙向計算、零流量及所有單位的往返換算。
