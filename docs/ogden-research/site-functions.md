# ogden.munch.love — 網站功能盤點

> **網站定位**：簡中（zh-CN）的 Ogden Basic English 850 字學習手冊。靜態網頁，純前端 JS。
> **作者自述**：作者「@hx831126」在 X 貼文 `status/2058416903119679595` 自陳由 Codex 協助製作；定位是「中英双语 · 精炼版」。

## 1. 頁面層級結構

單頁應用（SPA-like，但實為純靜態 + JS）：

- **Hero 區**：標題 *Ogden's **Basic** English* / 副標「850 词学习手册 · 中英双语 · 精炼版」/ meta「A controlled language designed by C.K. Ogden · 1930」
- **Sticky Navigation**（top 0，半透明背景 + backdrop blur）
- **5 個分類 section**：依序 Operations / General Things / Picturable / Qualities General / Qualities Opposites
- **卡片網格**：每張卡片為一個單字
- **Footer**：「Based on Charles Kay Ogden's Basic English (1930) · 850 words」+「Crafted with care for **虎象** · 2026」
- **練習模式（overlay/全屏）**：點「卡片练习」按鈕進入

## 2. Navigation 元件

- **搜尋框**（圓角 pill，左邊放大鏡 icon，右邊 kbd 提示鍵）
- **分類 pills**（filter tags，可單選）：
  - All · 全部 850
  - Operations · 操作词 100
  - General Things · 通用词 400
  - Picturable · 图示词 200
  - Qualities · 性质词 100
  - Opposites · 反义对 50
- **全域切換器**：
  - 🇬🇧 UK 英式 / 🇺🇸 US 美式（發音口音）
  - 简 / 繁（簡繁中文，但實測首頁 `lang="zh-CN"`，繁體支援未驗證細節）
  - 「卡片练习」CTA 按鈕

## 3. 詞卡欄位（依作者 X 貼文自述）

每張卡片有：

| 欄位 | 說明 |
|---|---|
| 英文單字 | Headword |
| 中文釋義 | gloss（zh） |
| 英文定義 | 用簡單英語解釋英語 — Ogden 自己的「定義不超出 850 字」風格 |
| 例句 | 1 句真實語境英文例句 |
| 同義詞 | 2–3 個，可點擊聽發音與看用法差異 |
| 發音按鈕 | 點單字聽、點例句聽 — 接**有道詞典**語音 API、語速稍慢、UK/US 可切 |

## 4. 5 分類視覺設計（CSS 變數確認）

| 分類 | 主色（深） | 主色（淺底） | 性格 |
|---|---|---|---|
| Operations | `#b45309`（terracotta 紅褐） | `#fef3c7` | 暖、操作感 |
| General Things | `#166534`（forest 森綠） | `#dcfce7` | 沈穩、廣泛 |
| Picturable | `#a16207`（amber 琥珀） | `#fef9c3` | 溫黃、具象 |
| Qualities General | `#1e40af`（blue 深藍） | `#dbeafe` | 冷靜、描述 |
| Opposites | `#7c3aed`（plum 紫） | `#ede9fe` | 對比、特殊 |

**整體配色**：背景 `#faf6ed`（暖米色），文字 `#1c1917`（近黑），分隔線 `#e7e2d4`。整體是 warm cream + 高對比墨色，明顯走「紙質書 / serif 排版」風格。

**字型**：
- 英文標題：`Cormorant Garamond`（serif，書本感）
- 英文正文 / UI：`Inter`（sans-serif）
- 中文：`Noto Serif SC` + 退回 `PingFang SC` / `Microsoft YaHei`

## 5. 練習模式（Flashcard）

進入後：

- 卡片計數：`1 / 850`
- 主按鈕：「查看释义」（翻面）
- 導覽：「← 上一个」/「下一个 →」
- 鍵盤：`← →` 切換、`空格` 翻面、`Esc` 退出
- 選項：
  - ☑ 自动发音
  - ☑ 打乱顺序（shuffle）
  - ✕ 退出

## 6. 互動細節

- **搜尋無結果提示**：「没找到匹配的词。换个词试试?」
- **Hover/focus 樣式**：按鈕有清楚的 outline ring（`outline: 2px solid var(--ink); outline-offset: 3px;`）— 鍵盤可用性有顧到
- **平滑捲動**：`html { scroll-behavior: smooth; }`
- **section 跳轉 offset**：`scroll-margin-top: 80px;`（避開 sticky nav 遮擋）
- **WebKit 字體渲染**：`-webkit-font-smoothing: antialiased`

## 7. 「未做 / 未見」

| 項目 | 狀態 |
|---|---|
| 使用者登入 / 帳號 | ❌ 無 |
| 學習進度儲存 | ❓ 未明確；可能用 localStorage（需看 JS） |
| 資料匯出（CSV / JSON） | ❌ 未見 |
| 公開 API | ❌ 未見 |
| 行動裝置 RWD | ❓ CSS 上有 flex-wrap，但全網沒明確 mobile-first；鍵盤快捷鍵說明暗示桌面導向 |
| 社群分享 / OG meta | ❓ 未驗證 meta tags |
| Dark mode | ❌ 未見（主題是固定的暖紙色） |

## 8. 技術棧（從 HTML/CSS 推斷）

- **純靜態 HTML**（單一 `index.html`、語言 `zh-CN`）
- **內聯 CSS**（不是 Tailwind class，是手寫的 BEM 風 selectors + CSS 變數）
- **Google Fonts** preconnect（Cormorant Garamond / Inter / Noto Serif SC）
- **JS 應為 vanilla** 或極輕量框架（沒看到 React/Vue/Next.js 的明顯標記，但完整 JS 未抓）
- **資料載入**：未看到 JSON 檔，可能 inline 在 `<script>` 區塊（待驗證）
- **語音 provider**：有道詞典 TTS API（依作者自述）
- **託管**：`munch.love` 是個人 / 工作坊網域

## 9. UI 文字（簡中原文，繁中版可作為翻譯對照）

```
850 词学习手册 · 中英双语 · 精炼版
A controlled language designed by C.K. Ogden · 1930
全部 850 / 操作词 100 / 通用词 400 / 图示词 200 / 性质词 100 / 反义对 50
UK 英式 / US 美式
简 / 繁
卡片练习
查看释义
上一个 / 下一个
← → 方向键切换 · 空格翻转 · Esc 退出
自动发音 / 打乱顺序 / 退出
没找到匹配的词。换个词试试?
```

## 10. 給繁中版的取捨建議

**可以致敬 / 沿用的設計**：
- 5 分類用顏色區隔（這個是 Ogden 自己的分類，不是 ogden.munch.love 的原創）
- 詞卡 5 欄位結構（單字 / 中文釋義 / 英文定義 / 例句 / 同義詞）
- 翻面式記憶卡 + 鍵盤快捷鍵
- UK/US 發音切換

**該另外做的**：
- **不要照搬 zh-CN 翻譯與英文 definition**：那些是該站作者的著作；繁中版需自己撰寫，且台灣用語要走自己的（注意「软件 → 軟體」、「视频 → 影片」之類）
- **不要照搬色票**：可以挪用「五類各色」概念，但建議調出自己的色票（避免複製感）
- **發音 API**：有道詞典在台灣訪問可能不穩；考慮 Forvo / Cambridge / 自建 ElevenLabs TTS / 瀏覽器 Web Speech API
- **字型**：英文 serif 可沿用 Cormorant 系，中文建議 `Noto Sans TC` 或 `Source Han Serif TC`（注意 SC ↔ TC 不同字型檔）
- **加分項**：標記 18 operators 的 Ogden 親選動詞集（ogden.munch.love 沒做）、提供原始 PDF 對照、CC BY-SA 4.0 授權清楚標示

## 11. 待補（如要再深入）

要再驗證以下需直接看 JS / network：

- [ ] 卡片資料是 inline JSON 還是 fetch 遠端 JSON
- [ ] 發音 URL 範本（確認是不是有道）
- [ ] 學習進度是否落地（localStorage / IndexedDB）
- [ ] 繁中切換實際是否生效（首頁 `lang="zh-CN"` 暗示主語言是簡中）
- [ ] 是否有埋 analytics（GA / Plausible / Umami）

要做就用 `opencli browser` 打開、network capture + 看 DOM。
