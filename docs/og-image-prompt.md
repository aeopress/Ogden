# OG Image · gpt-image-2 prompt template

目前 `public/og-image.png` 是 sharp 從 SVG 生成的站位圖（1200×630，dark stone bg、橘色 accent、五分類色塊）。
要替換成 gpt-image-2 的最終版時，把生成的 PNG 直接覆蓋到 `public/og-image.png` 即可——`<Base.astro>` 已 hardcode 指向這條路徑、不需改任何 code。

## 規格

| 項目 | 值 |
|---|---|
| 尺寸 | **1200 × 630**（OG / Twitter Card 標準長寬比，1.91:1）|
| 格式 | PNG（X / Facebook 不可靠支援 SVG/WEBP）|
| 檔案大小 | < 200 KB 為佳（X 上限 5 MB，但越輕快越好）|
| 安全區 | 上下左右各保留 60-80px padding，社交平台可能用圓角或暗化邊緣 |

## Site 視覺基底（給 gpt-image-2 當參考）

- 背景：暗色 `#1c1917`（stone-900）→ `#0c0a09` 漸層
- 主字：`Cormorant Garamond` italic、白色 `#fafaf9`
- 強調色（Basic 那個字、accent bar）：`#fb923c` 橘
- 副標：`Noto Serif TC` 繁中、`#e7e5e4`
- 小 kicker：`Inter` uppercase letter-spacing 3px、`#a8a29e`
- 五分類色票（呼應暗色模式）：
  - operations `#fb923c` 橘 + bg `#3a1f12`
  - general `#5eead4` 青 + bg `#0d2926`
  - picturable `#fbbf24` 琥珀 + bg `#2d2410`
  - qualities `#a5b4fc` 藍紫 + bg `#1e1d3a`
  - opposites `#d8b4fe` 紫 + bg `#2b1e3a`

## 文字內容（必須清晰可讀）

```
A CONTROLLED LANGUAGE · 1930              ← 小字 kicker
Ogden's Basic English                      ← 主標、Basic 斜體
850 字繁中學習手冊                          ← 中文副標
ogden.orz99.com                            ← 左下角小字
```

## Prompt（給 gpt-image-2 / nano banana / grok-imagine 等）

```
A 1200x630 horizontal social-share card for a Traditional Chinese English-learning
website. Dark warm-stone background (#1c1917 fading to #0c0a09 vertically). On the
left third: a thin vertical orange accent bar (#fb923c) next to a small uppercase
kicker "A CONTROLLED LANGUAGE · 1930" in light grey. Below the kicker, the main
title "Ogden's Basic English" in elegant serif (Cormorant Garamond style), white,
where the middle word "Basic" is in italic and in vibrant orange (#fb923c). Below
that, a Traditional Chinese subtitle "850 字繁中學習手冊" in slightly smaller
serif, off-white. In the lower half: five horizontal pill-shaped category swatches
in a row, each with a colored outline and small CJK + Romaji labels:
"功能詞 OPERATIONS · 100" (orange), "一般名詞 GENERAL · 400" (teal),
"具象名詞 PICTURABLE · 200" (amber), "形容詞 QUALITIES · 100" (indigo),
"反義詞 OPPOSITES · 50" (purple). Bottom-left footer: "ogden.orz99.com" in small
light-grey sans-serif. Editorial, vintage-meets-modern, museum-catalog aesthetic.
Clean typography, lots of negative space, no decorative clutter. Photographic
realism is not required — flat 2D vector composition with high contrast and
crisp type rendering is preferred.
```

## 替換步驟

1. 用 gpt-image-2 跑上面 prompt、拿到 PNG
2. 如尺寸不是 1200×630，用 `bunx sharp` 或任何圖片編輯軟體 resize / pad
3. 覆蓋 `public/og-image.png`
4. `git add public/og-image.png && git commit -m "feat(og): final og-image generated via gpt-image-2"`
5. push → Actions 自動重新部署 → X / Facebook 抓 production 上的新圖

## 測試 OG 是否生效

部署後用這幾個 debugger 看抓到的內容：

| 平台 | URL |
|---|---|
| Facebook | https://developers.facebook.com/tools/debug/?q=https%3A%2F%2Fogden.orz99.com |
| Twitter / X | https://cards-dev.twitter.com/validator（已關閉，現用 post preview 直接測試）|
| LinkedIn | https://www.linkedin.com/post-inspector/inspect/https%3A%2F%2Fogden.orz99.com |
| 萬用 | https://www.opengraph.xyz/?url=https%3A%2F%2Fogden.orz99.com |

X 對新 URL 的圖片快取會持續 7 天，發推前可先用上面的 debugger 強制 refresh。
