import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const SRC = '/tmp/be2000-raw.md';
const OUT = join(import.meta.dir, '..', 'data', 'reference', 'wordlist-be2000.json');

const text = readFileSync(SRC, 'utf-8');

// Stop at "Footnotes" / "References" / end-of-letter-list to avoid pulling in nav/footer
const stopIdx = text.search(/\n## (References|Footnotes|See also|External links)/);
const body = stopIdx > 0 ? text.slice(0, stopIdx) : text;

// Match markdown links — pull out the visible label
const LINK = /\[([^\]\n]+)\]\([^)\n]+\)/g;
const raw = new Set<string>();
let m: RegExpExecArray | null;
while ((m = LINK.exec(body)) !== null) {
  const label = m[1]!.trim();
  if (!label) continue;
  // Drop nav/anchor labels like "Top", "0-9", single-letter A-Z
  if (/^[A-Z]$/.test(label)) continue;
  if (label === 'Top' || label === '0-9') continue;
  // Drop "wikt:..." / "Image N" / footnotes
  if (label.startsWith('wikt:')) continue;
  if (/^Image \d/.test(label)) continue;
  if (/^\[\d+\]$/.test(label)) continue;
  // Looks like a word/phrase
  if (label.length > 40) continue;
  raw.add(label.toLowerCase());
}

const sorted = [...raw].sort();
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify(
    {
      source: 'https://simple.wikipedia.org/wiki/Wikipedia:Basic_English_combined_wordlist',
      license: 'CC BY-SA 4.0',
      note: 'Flat list extracted from Simple English Wikipedia BE Combined Wordlist (Basic + International + Addendum + Compound). Used as the example-sentence vocabulary ceiling.',
      count: sorted.length,
      words: sorted,
    },
    null,
    2,
  ),
  'utf-8',
);

console.log(`Wrote ${sorted.length} words to ${OUT}`);
