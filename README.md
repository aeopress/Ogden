# 🇹🇼 Ogden's Basic English · 850 字繁中學習手冊

[![Code License: MIT](https://img.shields.io/badge/code%20license-MIT-blue.svg)](./LICENSE)
[![Content License: CC BY-SA 4.0](https://img.shields.io/badge/content%20license-CC%20BY--SA%204.0-lightgrey.svg)](./LICENSE-CONTENT.md)
[![Deploy](https://github.com/yelban/Ogden/actions/workflows/deploy.yml/badge.svg)](https://github.com/yelban/Ogden/actions/workflows/deploy.yml)
[![Site](https://img.shields.io/badge/site-ogden.orz99.com-orange.svg)](https://ogden.orz99.com)

C.K. Ogden 1930 年 Basic English 850 字的繁體中文版（台灣用語）學習網站。

**線上版**：https://ogden.orz99.com

---

## 為什麼是這 850 個字

1930 年，英國語言學家 C.K. Ogden 做了一件偏執的事。

他把整本牛津袖珍辭典翻過一遍——兩萬五千個詞——然後問自己一個簡單到近乎挑釁的問題：**如果只能留下最核心的那些，英文還夠用嗎？**

他的答案是：850 個，夠了。

這 850 個字不是憑感覺挑的。是他把英語拆到骨頭，逐字審視之後留下的「語言骨架」：

- **100 個功能詞**——「這、那、有、做」這些讓句子轉起來的膠水。其中有 18 個核心動詞（`come`、`get`、`give`、`go`…）。Ogden 算過：用這 18 個動詞加上介系詞拼接，可以替代大約 4000 個傳統動詞。`get off the boat` 就不用學 `disembark`。
- **400 個一般名詞**——日常英語中頻率最高、最抽象的那一層
- **200 個具象名詞**——能畫出來的東西，`door`、`fire`、`river`
- **100 個形容詞**——`clear`、`simple`、`important`
- **50 個反義詞**——成對出現，學一個等於學兩個

他把這套體系命名為 **Basic English**——`British American Scientific International Commercial English` 的縮寫。

故事到這裡開始有趣起來。

---

### 三個歷史名人對 850 個字的反應

**邱吉爾**站出來支持。1943 年他在哈佛接受榮譽學位的演講上，公開把 Basic English 抬到「世界和平的工具」這個高度，要求 BBC 用它廣播。

**羅斯福**則公開揶揄。他笑說邱吉爾那句傳世名言「blood, toil, tears, and sweat」，用 Basic English 講就只剩「blood, work, eye water, face water」——「這恐怕是 Basic English 能對五個偉大字眼做的最大努力了。」

**H.G. Wells**把 Basic English 寫進了 1933 年的科幻小說《未來事物的面貌》（*The Shape of Things to Come*）。他想像在 2020 年，地球上幾乎沒有人不會說 Basic English——它是某種仁慈獨裁政權強制推行的全球通用語。Wells 著迷，但有點害怕。

**Orwell**一開始也支持。1930 年代的他覺得 Basic English 是對抗虛飾語言的好武器。直到 1940 年代他在 BBC 做戰時宣傳工作，親身體會「精簡的語言」如何可以被武器化，他改變立場了。

《1984》裡的「新話」（Newspeak）——那套故意把詞彙不斷縮減、最終讓「自由」「思考」這些字詞消失的語言系統——其中一部分就是對 Basic English 的警示。Orwell 跟 Ogden 還通過信、互寄小冊子。

支持者覺得它是橋樑。批評者覺得它是枷鎖。
這場爭論，已經吵了將近一百年。

---

### 但這不是這個網站要參與的爭論

我們想說的是另一件事。

大多數人學英文，是被一本本厚厚的單字書、一張張考綱壓著學的。多益、托福、雅思、學測——每個證書背後都是幾千個字的暴力記憶。背了忘，忘了背，**從來沒有真的「用」過**。

Ogden 的邏輯剛好反過來：**不是多，是深。**

這 850 個字，每一個都是「高頻中的高頻」。當你真的把它們學透——不只認得意思，還知道它的用法、它的近義詞在什麼場景該用哪一個、它的例句裡藏著什麼語感——你對英文的掌握，會比背了 5000 個字卻每個只認得中譯來得紮實得多。

**根扎得夠深，枝才能生得夠遠。**

---

### 這個網站做了什麼

Ogden 原版的資料是一份黑白 PDF，排版像上個世紀（它確實是）。我把它變成可以真的拿來學習的東西。

每一個字，一張卡片。

卡片上有：
- **中文釋義**（台灣用語）
- **英文定義**——用最簡單的英語解釋英語，就像 Ogden 自己的風格
- **一個真實口語的例句**
- **2–3 個近義詞**，可點擊聽發音
- **五個分類各有自己的顏色**，一眼就知道你在學哪個區塊

每一個字，都可以聽發音。

用瀏覽器內建的 Web Speech API，預設美式發音、可切換英式。點單字聽一次、點例句聽一次，語速比正常稍慢，適合跟讀。Ogden 那 18 個核心動詞特別標了「18-OP」徽章——那是他親手選的、整個 Basic English 系統的骨幹。

「卡片練習」模式有兩種：翻面卡片、考你（中→英 / 英→中 四選一）。鍵盤就能操作完，適合在桌上反覆練。

---

### 一些誠實的話

- 網站完全**免費**、**不需要註冊**、**不收個資**（Cloudflare Web Analytics 不用 cookies）。
- 內容是 Claude Opus 4.7 批次生成 + 人工校對的。如果你發現翻譯有怪、定義有錯、例句不自然，[開 issue](https://github.com/yelban/Ogden/issues) 告訴我。
- 字表本身來自 Wiktionary，CC BY-SA 4.0，學術上完全乾淨。
- Basic English 不是萬靈丹。批評者指出：850 個字在 OED 裡其實有 18,416 個語義，`get` 一個字能扛 200+ 種用法。所以**這 850 個字不是「學完就會英文」**，而是「學透就能站穩腳跟」的起點。

如果你身邊有正在學英文的孩子，或是覺得自己「學了很多年但還是用不好」的大人——

打開來看看：**https://ogden.orz99.com**

也許這 850 個字，就是值得重新開始的起點。

---

## 特色

- **850 字 × 5 分類**：100 operations / 400 general things / 200 picturable / 100 qualities / 50 opposites
- **詞卡欄位**：英文單字（雙拼字 UK/US）+ 中文釋義 + Ogden 風英文定義 + 自然口語例句 + 2–3 個同義詞
- **發音**：瀏覽器內建 Web Speech API，UK / US 口音切換
- **18 Operators 徽章**：Ogden 親選的 18 個核心動詞獨立標示
- **練習模式**：翻面卡片 + 考你四選一；點字卡或近義詞直接進該詞練習；連勝里程碑音效歡呼 + 答對 1.2s 自動推進（皆可關）
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

## 授權（雙授權）

本專案採雙授權設計——程式碼跟內容分開規範：

| 範圍 | 授權 | 檔案位置 |
|---|---|---|
| **程式碼**：Astro components、TypeScript scripts、CSS、CI workflow、build config | **MIT** | [LICENSE](./LICENSE) |
| **內容**：850 詞表、繁中釋義、英文定義、例句、同義詞、`docs/ogden-research/` 研究筆記 | **CC BY-SA 4.0** | [LICENSE-CONTENT.md](./LICENSE-CONTENT.md) |

具體路徑歸屬：

| 路徑 | 授權 |
|---|---|
| `src/components/`, `src/layouts/`, `src/pages/`, `src/scripts/`, `src/styles/`, `src/data/schema.ts` | MIT |
| `scripts/`, `astro.config.mjs`, `tsconfig.json`, `wrangler.toml`, `.github/`, `package.json` | MIT |
| `src/data/words.ts`, `src/data/words.seed.ts`, `data/`, `docs/ogden-research/` | CC BY-SA 4.0 |
| `README.md`, `CLAUDE.md`, `docs/deploy-notes.md` | CC BY-SA 4.0 |

### 上游 attribution

- 字表來自 [Wiktionary - Basic English word list](https://en.wiktionary.org/wiki/Appendix:Basic_English_word_list)（CC BY-SA 4.0）
- 例句語料天花板參考 [Simple Wikipedia - Basic English combined wordlist](https://simple.wikipedia.org/wiki/Wikipedia:Basic_English_combined_wordlist)（CC BY-SA 4.0）
- C.K. Ogden 1930 年原著於多數司法管轄區已進入公共領域（台灣：作者卒於 1957，已於 2008 年過期）

### 你可以拿來做什麼

- 拿**整個專案**架你自己的 Ogden 學習站？✅ 保留兩個 LICENSE 檔案 + README 中的 attribution
- 只想拿**引擎**（Astro + 詞卡 UI）做別的單字學習站？✅ 換掉 `src/data/words.ts` 與 `docs/ogden-research/`，只需保留 MIT
- 拿**詞表內容**進你的商業 App？✅ 保留 attribution + 衍生內容也採 CC BY-SA 4.0 或相容授權
- 想把內容**重新打包賣**？✅ 但你的衍生物必須**也是開放授權**（這就是 ShareAlike 的本質）

## 致謝

- C.K. Ogden 設計了穿越近百年仍實用的 Basic English 字表
- Wiktionary 與 Simple English Wikipedia 編者維護開放資料
- [ogden.munch.love](https://ogden.munch.love) — 啟發本站的簡中版前作
