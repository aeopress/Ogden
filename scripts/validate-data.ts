import { CATEGORIES, CATEGORY_META, SeedWordSchema } from '../src/data/schema';
import { SEED_WORDS } from '../src/data/words.seed';

let errors = 0;
const log = (level: 'OK' | 'FAIL', msg: string) => {
  if (level === 'FAIL') errors++;
  console.log(`[${level}] ${msg}`);
};

if (SEED_WORDS.length === 850) {
  log('OK', `Total = 850`);
} else {
  log('FAIL', `Total = ${SEED_WORDS.length}, expected 850`);
}

const ids = new Set<string>();
for (const w of SEED_WORDS) {
  const parsed = SeedWordSchema.safeParse(w);
  if (!parsed.success) {
    log('FAIL', `Schema invalid for ${w.headword}: ${parsed.error.message}`);
  }
  if (ids.has(w.id)) {
    log('FAIL', `Duplicate id: ${w.id}`);
  }
  ids.add(w.id);
}
if (ids.size === SEED_WORDS.length) log('OK', `All ids unique (${ids.size})`);

for (const cat of CATEGORIES) {
  const count = SEED_WORDS.filter((w) => w.category === cat).length;
  const expected = CATEGORY_META[cat].expected;
  if (count === expected) log('OK', `${cat}: ${count}`);
  else log('FAIL', `${cat}: ${count}, expected ${expected}`);
}

const ops18 = SEED_WORDS.filter((w) => w.is_18_operators);
if (ops18.length === 18) log('OK', `18 operators present`);
else log('FAIL', `18 operators = ${ops18.length}`);

for (const w of ops18) {
  if (w.category !== 'operations') log('FAIL', `${w.id} is_18_operators but not in operations`);
}

const ukUs = SEED_WORDS.filter((w) => w.spelling_uk !== w.spelling_us);
log('OK', `UK/US distinct spellings: ${ukUs.length} (${ukUs.map((w) => `${w.spelling_uk}↔${w.spelling_us}`).join(', ')})`);

if (errors) {
  console.error(`\n${errors} error(s)`);
  process.exit(1);
}
console.log('\nAll checks passed.');
