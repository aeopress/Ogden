# Basic English 850 字 — 權威來源整理

研究目的：為自製繁中版蒐集**可信、可再利用**的 Ogden 原始 850 字清單。

## 結論先講

| 用途 | 推薦來源 | 授權 | 完整性 |
|---|---|---|---|
| **正式專案資料底** | Wiktionary `Appendix:Basic English word list`（已存 `wiktionary-raw.md` + 結構化 `basic-english-850.json`） | CC BY-SA 4.0 | 五分類齊全、850 字校對通過 |
| **原始/字母順序對照** | Internet Archive 上 Basic-English Institute 鏡像 PDF（已存 `ogdens-850-alphabetic.pdf`） | 公共領域宣告不明、但 Ogden 1957 卒 → 大多管轄區 70 年保護 2027 屆滿 | 字母順序、無分組 |
| **學術版本（脈絡）** | Contemporary Literature Press 重排版（線上可閱、未下載） | 學術重印，著作權狀態混合 | 完整含 grammar |

**直接拿來做繁中版**：✅ 用 Wiktionary 版本，CC BY-SA 4.0 只需署名 + 同方式分享（繁中釋義是衍生作品需一併採 CC BY-SA 4.0 或相容授權）。

**Basic-English Institute 官方站**（`ogden.basic-english.org`）已下線（2026 現況：DreamHost coming-soon page），不再可用。Wikipedia / Wiktionary 變成事實上的主要來源。

---

## 五大分類驗證

```
operations               100  ✓
general_things           400  ✓
picturable_things        200  ✓
qualities_general        100  ✓
qualities_opposites       50  ✓
TOTAL                    850  ✓
```

驗證腳本：`parse_wordlist.py`（從 `wiktionary-raw.md` 解析、寫入 `basic-english-850.json`、檢查每組計數）。

## 抽樣交叉比對

從 JSON 抽 10 個跨類別詞 vs PDF alphabetic：

| 詞 | 類別 | PDF 區段 | 命中 |
|---|---|---|---|
| tomorrow | operations | T | ✓ |
| please | operations | P | ✓ |
| science | general_things | S | ✓ |
| weather | general_things | W | ✓ |
| worm | picturable_things | W | ✓ |
| sponge | picturable_things | S | ✓ |
| automatic | qualities_general | A | ✓ |
| fertile | qualities_general | F | ✓ |
| cruel | qualities_opposites | C | ✓ |
| feeble | qualities_opposites | F | ✓ |

10/10。Wiktionary 分組版本與 Basic-English Institute 字母版本一致。

## 注意：拼法差異（英式 vs 美式）

Wiktionary 用 **英式拼法**（Ogden 是英國人，原版即英式）：

| Wiktionary（英式） | Basic-English Institute PDF（美式偏向） |
|---|---|
| behaviour | behavior |
| colour | color |
| harbour | harbor |
| humour | humor |
| organization | organization（兩版一致）|
| plough | plough/plow |
| grey | grey/gray |

做繁中版時要先決定要綁英式還是美式（或都提供切換 — `ogden.munch.love` 有做 UK/US 發音切換但拼字統一）。

## 額外脈絡（Wikipedia / Wiktionary 提到）

- **書名與年份**：C.K. Ogden, *Basic English: A General Introduction with Rules and Grammar*, 1930
- **作者卒年**：1957（影響公共領域時程）
- **「18 operators」**：Ogden 限制動詞為 18 個 operators（come, get, give, go, keep, let, make, put, seem, take, be, do, have, say, see, send, may, will），這 18 個都在 100 operations 裡的前 18 個位置
- **「BASIC」backronym**：British American Scientific International Commercial
- **歷史影響**：Churchill 二戰公開支持；H.G. Wells 寫入科幻；Orwell *1984* 的 Newspeak 是對 Basic English 的警示式致敬
- **Wikipedia 條目自身**：CC BY-SA 4.0
- **延伸詞表**：1000 / 2000 字版本存在，但「正統 Ogden 850」就是這 5 分類版

## 已收集的素材檔案

| 檔案 | 用途 |
|---|---|
| `wiktionary-raw.md` | Jina 抓的 Wiktionary 原始 markdown（50 KB） |
| `basic-english-850.json` | 機讀版：5 分類 × 850 字，含 source/license metadata |
| `ogdens-850-alphabetic.pdf` | Basic-English Institute 字母順序 PDF（102 KB，2017 最後更新） |
| `parse_wordlist.py` | 解析腳本，可重跑驗證 |

## 給繁中版專案的建議

1. **資料底用 `basic-english-850.json`**：直接 import，每類已分好；繁中翻譯欄位（例：`gloss_zh_tw`、`definition_zh_tw`、`example`、`synonyms`）疊加在純英文清單上即可。
2. **授權標示**：頁面 footer / about 頁列「字表來源：Wiktionary（CC BY-SA 4.0）」+ 連結。繁中釋義建議同採 CC BY-SA 4.0。
3. **拼字決策**：建議跟 Wiktionary 走英式（Ogden 原版精神），但提供英式/美式切換對應條目（behaviour ↔ behavior 等 ~7 個詞）。
4. **不要照搬 ogden.munch.love 的英文 definition / 例句 / 同義詞**：那些是該站作者用 AI（Codex）生成，著作權屬該站；自己重做。
5. **「18 operators」彩蛋**：100 operations 的前 18 是 Ogden 親手選的動詞，可在 UI 上特別標註成子分類（很多權威來源都沒做這個區分，做了會加分）。

## 參考連結

- [Wiktionary - Appendix:Basic English word list](https://en.wiktionary.org/wiki/Appendix:Basic_English_word_list) — 主要資料源
- [Wikipedia - Basic English](https://en.wikipedia.org/wiki/Basic_English) — 背景脈絡
- [Internet Archive - Ogden's Basic English Words List Alphabetic](https://archive.org/details/ogdens-basic-english-words-list-alphabetic) — PDF 來源
- [Simple Wiktionary - Basic English picture wordlist](https://simple.wiktionary.org/wiki/Wiktionary:Basic_English_picture_wordlist) — 200 picturable 的對應圖片清單（可考慮做圖卡參考）
