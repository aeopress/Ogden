# Ogden's Basic English · 850 字繁中學習手冊

C.K. Ogden 1930 年 Basic English 850 字的繁體中文版（台灣用語）學習網站。

**線上版**：https://ogden.orz99.com

## 特色

- **850 字 × 5 分類**：100 operations / 400 general things / 200 picturable / 100 qualities / 50 opposites
- **詞卡欄位**：英文單字（雙拼字 UK/US）+ 中文釋義 + Ogden 風英文定義 + 自然口語例句 + 2–3 個同義詞
- **發音**：瀏覽器內建 Web Speech API，UK / US 口音切換
- **18 Operators 徽章**：Ogden 親選的 18 個核心動詞獨立標示
- **練習模式**：翻面卡片 + 考你（中→英 / 英→中 四選一）
- **進度追蹤**：localStorage 記「已學」、整體進度條
- **暗色模式**：跟隨系統 `prefers-color-scheme`，可手動切換
- **搜尋**：fuse.js 模糊搜尋英文 / 中文
- **零追蹤**：Cloudflare Web Analytics（無 cookies、不收個資）

## 開發

```bash
bun install
bun run dev                  # localhost:4321
bun run typecheck            # astro check + tsc
bun run validate             # 驗證 850 字資料完整性
bun run build && bun run preview
```

## 內容生成（重生 / 擴充用）

```bash
# 從 docs/ogden-research/basic-english-850.json 產生 seed
bun run scripts/build-seed.ts

# 用 Anthropic API 批次生 4 欄位內容（需 ANTHROPIC_API_KEY）
ANTHROPIC_API_KEY=sk-... bun run generate -- --dry-run
ANTHROPIC_API_KEY=sk-... bun run generate -- --category operations --batch 0

# 合併 data/generated/*.json 進 src/data/words.ts
bun run merge-reviewed
```

當前 `src/data/words.ts` 的內容是用 Claude Opus 4.7 在 session 內逐批生成、無 API quota 消耗的成果。

## 部署（Cloudflare Pages）

1. 在 Cloudflare Pages 連結這個 git repo，build command `bun run build`、output `dist/`
2. Custom domains 加 `ogden.orz99.com`（DNS CNAME → `*.pages.dev`）
3. Cloudflare Dashboard → Web Analytics → Add site → 拿 token → Pages env 加 `PUBLIC_CF_ANALYTICS_TOKEN`

## 授權

- 程式碼：MIT
- 內容（繁中釋義 / 英文定義 / 例句 / 同義詞）：CC BY-SA 4.0
- 字表底層：Wiktionary - Basic English word list（CC BY-SA 4.0）

## 致謝

- C.K. Ogden 設計了穿越近百年仍實用的 Basic English 字表
- Wiktionary 與 Simple English Wikipedia 編者維護開放資料
- [ogden.munch.love](https://ogden.munch.love) — 啟發本站的簡中版前作
