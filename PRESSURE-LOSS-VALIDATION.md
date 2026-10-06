# 壓損計算：公式、實測依據與適用範圍

此工具計算**單一等截面風管段**。輸入風量為該段的實際工況風量 m³/h；密度與動力黏度必須對應同一氣體與工況。直管採 Darcy–Weisbach：`ΔP_f = f_D (L/D_h) ρv²/2`。紊流 `Re ≥ 4000` 使用 Colebrook–White 迭代求 Darcy 摩擦係數；圓管層流 `Re < 2300` 使用 `64/Re`。`2300 ≤ Re < 4000` 過渡流不輸出壓損。矩形風管紊流用 `D_h = 2ab/(a+b)`；矩形層流未納入，避免錯用圓管的 `64/Re`。

局部損失只在使用者提供對應風管截面與風速基準的 `ΣK` 時，計為 `ΣK·ρv²/2`。過濾器、洗滌塔等設備壓損必須填廠商額定或量測值。兩者缺任一項時只顯示已知小計，不顯示完整總壓損。分支、變截面、漏風、煙囪／熱浮力、系統效應及不同溫壓段應逐段分析。

公式及風管實驗依據：[ASHRAE Handbook 2017, Duct Design, SI 第 21 章](https://handbook.ashrae.org/Handbooks/F17/SI/f17_ch21/f17_ch21_si.aspx)。其實測鍍鋅圓管粗糙度為 0.049–0.098 mm（平均 0.09 mm），矩形管為 0.082–0.15 mm；預設 0.09 mm 只是初始參考。該章也引用矩形管實驗，指出一般 HVAC 氣流下用水力直徑配 Colebrook 可合理關聯實驗數據。配件 `K` 需按實際幾何自 [ASHRAE Duct Fitting Database](https://www.ashrae.org/technical-resources/bookstore/duct-fitting-database) 或實測取得，本工具沒有臆測彎頭係數。

獨立實測佐證：[NIST Technical Note 2294](https://nvlpubs.nist.gov/nistpubs/TechnicalNotes/NIST.TN.2294.pdf) 的直銅管摩擦係數測值，與 Colebrook 相關式在其實驗條件下相差約 ±3%。這是**模型的外部實驗支持**，不是本網站在工業風管現場可保證 ±3% 的證明。

對照 ASHRAE 第 21 章 Example 6 的鍍鋅螺旋圓管案例：內徑 250 mm、長 1.8 m、風量 470 L/s、密度 1.204 kg/m³、粗糙度 0.12 mm；ASHRAE 表列 7.7 Pa，本程式在 20°C 空氣黏度 1.81×10⁻⁵ Pa·s 下得到 7.609 Pa，差約 1.18%。這是針對直管的公開案例對照，未驗證彎頭、設備或現場漏風。

程式測試：`node --test pressure-loss.test.cjs`。核對 Colebrook 方程殘差、Darcy 與局部損失平衡、矩形水力直徑、層流／過渡流處理，以及資料不完整時不產生總壓損。
