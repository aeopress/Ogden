/**
 * Generate Word content (definition_en / gloss_zh_tw / example_en / example_zh_tw / synonyms)
 * for the Ogden 850 word list using Claude Opus 4.7 via the Anthropic SDK.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... bun run generate
 *   ANTHROPIC_API_KEY=sk-... bun run generate -- --category operations
 *   ANTHROPIC_API_KEY=sk-... bun run generate -- --category operations --batch 0
 *   ANTHROPIC_API_KEY=sk-... bun run generate -- --dry-run                       # show plan only
 *
 * Output:  data/generated/<category>-batch-<NN>.json
 */

import Anthropic from '@anthropic-ai/sdk';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

import { CATEGORIES, type Category } from '../src/data/schema';
import { SEED_WORDS } from '../src/data/words.seed';

const MODEL = 'claude-opus-4-7';
const BATCH_SIZE = 25;
const MAX_TOKENS = 8000;
const MAX_RETRIES = 3;

const ROOT = join(import.meta.dir, '..');
const OUT_DIR = join(ROOT, 'data', 'generated');
const BE2000_PATH = join(ROOT, 'data', 'reference', 'wordlist-be2000.json');

interface GenerationResult {
  id: string;
  definition_en: string;
  gloss_zh_tw: string;
  example_en: string;
  example_zh_tw: string;
  synonyms: string[];
}

const be2000 = JSON.parse(readFileSync(BE2000_PATH, 'utf-8')) as {
  words: string[];
};

const ogden850 = SEED_WORDS.map((w) => w.headword);

const SYSTEM_PROMPT = `你是 Ogden Basic English 850 字繁體中文版的內容編輯。任務：為每個英文 headword 產生五個欄位 (definition_en, gloss_zh_tw, example_en, example_zh_tw, synonyms)。

# 嚴格規則

1. **definition_en**：用 **Ogden 850 字內** 的詞解釋這個 headword。一句話、第三人稱、避免迂迴。風格仿 Ogden 原書「用簡單英語解釋英語」。如果 headword 本身在解釋裡出現會打破循環定義，要繞開。
2. **gloss_zh_tw**：繁體中文（**台灣用語**）1-2 句釋義。例：軟體 / 影片 / 介面 / 資料 / 滑鼠 / 預設 / 解析度 / 程式 / 影像。**不要簡體用語**（軟件 / 視頻 / 界面 / 數據）。
3. **example_en**：包含 headword 本身的自然口語英文例句，限 **Basic English Combined Wordlist 2000 字** 範圍。動詞型態可變化 (-s, -ed, -ing)。
4. **example_zh_tw**：example_en 的繁體中文翻譯，台灣用語、口語、自然。
5. **synonyms**：2-3 個 Ogden 850 字內的同義或近義詞陣列（不夠才從 2000 字補）；不可包含 headword 本身。

# 範疇參考

- **Ogden 850 字清單**：${ogden850.join(', ')}
- **Basic English 2000 字（例句語料天花板）**：${be2000.words.slice(0, 1000).join(', ')}, ... 共 ${be2000.words.length} 詞。

# 輸出格式

回傳一個 JSON object，鍵為 \`words\`，值是陣列。每個元素：

\`\`\`json
{
  "id": "...",
  "definition_en": "...",
  "gloss_zh_tw": "...",
  "example_en": "...",
  "example_zh_tw": "...",
  "synonyms": ["...", "..."]
}
\`\`\`

只回傳 JSON，不要 markdown code fence、不要解說。`;

function batchWords(category: Category): Array<typeof SEED_WORDS[number][]> {
  const all = SEED_WORDS.filter((w) => w.category === category);
  const batches: Array<typeof SEED_WORDS[number][]> = [];
  for (let i = 0; i < all.length; i += BATCH_SIZE) {
    batches.push(all.slice(i, i + BATCH_SIZE));
  }
  return batches;
}

async function generateBatch(
  client: Anthropic,
  category: Category,
  batchIdx: number,
  batch: typeof SEED_WORDS[number][],
): Promise<GenerationResult[]> {
  const userMsg = `Category: ${category}
Batch: ${batchIdx + 1}

Generate content for these ${batch.length} headwords:

${batch
  .map(
    (w) =>
      `- id="${w.id}", headword="${w.headword}"${w.is_18_operators ? ' [18-operator]' : ''}`,
  )
  .join('\n')}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: userMsg }],
      });

      const text = resp.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('');

      const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      const parsed = JSON.parse(cleaned) as { words: GenerationResult[] };

      if (!Array.isArray(parsed.words) || parsed.words.length !== batch.length) {
        throw new Error(
          `Expected ${batch.length} words, got ${parsed.words?.length ?? 'undefined'}`,
        );
      }

      console.log(
        `  cache: ${resp.usage.cache_creation_input_tokens ?? 0} created, ${resp.usage.cache_read_input_tokens ?? 0} read; output: ${resp.usage.output_tokens}`,
      );
      return parsed.words;
    } catch (err) {
      console.error(`  attempt ${attempt}/${MAX_RETRIES} failed:`, err);
      if (attempt === MAX_RETRIES) throw err;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  throw new Error('unreachable');
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const catFlagIdx = args.indexOf('--category');
  const batchFlagIdx = args.indexOf('--batch');
  const catArg = catFlagIdx >= 0 ? args[catFlagIdx + 1] : undefined;
  const batchArg = batchFlagIdx >= 0 ? args[batchFlagIdx + 1] : undefined;

  const targetCategories: Category[] =
    catArg && CATEGORIES.includes(catArg as Category) ? [catArg as Category] : [...CATEGORIES];
  const targetBatchIdx = batchArg !== undefined ? parseInt(batchArg, 10) : null;

  console.log(`Model: ${MODEL}`);
  console.log(`Categories: ${targetCategories.join(', ')}`);
  if (targetBatchIdx !== null) console.log(`Batch: ${targetBatchIdx}`);

  for (const cat of targetCategories) {
    const batches = batchWords(cat);
    console.log(`\n[${cat}] ${batches.length} batches (${SEED_WORDS.filter((w) => w.category === cat).length} words)`);
    for (let i = 0; i < batches.length; i++) {
      if (targetBatchIdx !== null && i !== targetBatchIdx) continue;
      console.log(`  batch ${i + 1}/${batches.length}: ${batches[i]!.length} words`);
      if (dryRun) continue;

      const outPath = join(OUT_DIR, `${cat}-batch-${String(i + 1).padStart(2, '0')}.json`);
      if (existsSync(outPath)) {
        console.log(`  skip (exists): ${outPath}`);
        continue;
      }

      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        console.error('  ANTHROPIC_API_KEY not set; aborting.');
        process.exit(1);
      }
      const client = new Anthropic({ apiKey });
      const results = await generateBatch(client, cat, i, batches[i]!);

      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, JSON.stringify({ category: cat, batch: i + 1, results }, null, 2), 'utf-8');
      console.log(`  wrote ${outPath}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
