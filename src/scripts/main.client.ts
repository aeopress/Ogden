import { initPractice } from './practice';
import { isLearned, subscribe, toggle, TOTAL_WORDS } from './progress';
import { getLang, setLang, speak } from './speech';

type CardEl = HTMLElement;
const cards = [...document.querySelectorAll<CardEl>('article.card')];

// ---------- theme ----------
const themeBtn = document.getElementById('theme-toggle');
themeBtn?.addEventListener('click', () => {
  const cur = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = cur;
  localStorage.setItem('theme', cur);
});

// ---------- voice toggle ----------
applyVoiceUi(getLang());
document.querySelectorAll<HTMLButtonElement>('[data-voice]').forEach((b) => {
  b.addEventListener('click', () => {
    const v = b.dataset.voice as 'en-GB' | 'en-US';
    setLang(v);
    applyVoiceUi(v);
  });
});
function applyVoiceUi(lang: 'en-GB' | 'en-US'): void {
  document.querySelectorAll<HTMLButtonElement>('[data-voice]').forEach((b) => {
    b.dataset.active = String(b.dataset.voice === lang);
  });
}

// ---------- speak buttons on cards ----------
for (const c of cards) {
  c.querySelectorAll<HTMLButtonElement>('[data-speak-target]').forEach((b) => {
    b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const target = b.dataset.speakTarget;
      if (target === 'word') {
        const text = (document.querySelector<HTMLElement>(`article.card[data-word-id="${c.dataset.wordId}"] .headword .primary`)?.textContent) ?? c.dataset.headword ?? '';
        void speak(text);
      } else if (target === 'example') {
        const text = c.querySelector('.ex-en')?.textContent ?? '';
        if (text) void speak(text);
      }
    });
  });
}

// ---------- filter state (declared early so subscribe() callbacks don't hit TDZ) ----------
let activeCat: string = 'all';
let learnedOnly = false;
let activeIds: Set<string> | null = null;
let searchRanks: Map<string, number> | null = null;

// ---------- learned toggle ----------
function syncLearnedUi(): void {
  for (const c of cards) {
    const id = c.dataset.wordId ?? '';
    const btn = c.querySelector<HTMLButtonElement>('[data-learned]');
    if (btn) btn.dataset.active = String(isLearned(id));
  }
}
for (const c of cards) {
  const btn = c.querySelector<HTMLButtonElement>('[data-learned]');
  btn?.addEventListener('click', (ev) => {
    ev.stopPropagation();
    toggle(c.dataset.wordId ?? '');
  });
}
syncLearnedUi();

// progress badge in nav
const learnedCount = document.getElementById('learned-count');
const learnedBar = document.getElementById('learned-bar');
subscribe((c, total) => {
  if (learnedCount) learnedCount.textContent = String(c);
  if (learnedBar) learnedBar.style.width = `${(c / total) * 100}%`;
  syncLearnedUi();
  applyFilters();
});

document.querySelectorAll<HTMLButtonElement>('.pill[data-cat]').forEach((b) => {
  b.addEventListener('click', () => {
    activeCat = b.dataset.cat ?? 'all';
    document.querySelectorAll<HTMLButtonElement>('.pill[data-cat]').forEach((x) => {
      x.dataset.active = String(x === b);
    });
    applyFilters();
  });
});

const toggleLearned = document.querySelector<HTMLButtonElement>('[data-toggle="learned-only"]');
toggleLearned?.addEventListener('click', () => {
  learnedOnly = !learnedOnly;
  toggleLearned.setAttribute('aria-pressed', String(learnedOnly));
  applyFilters();
});

// ---------- search ----------
const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
interface IndexEntry {
  id: string;
  headword: string;
  spelling_us: string;
  gloss: string;
  def: string;
  example_en: string;
  example_zh: string;
  synonyms: string;
}
const searchIndex: IndexEntry[] = cards.map((c) => ({
  id: c.dataset.wordId ?? '',
  headword: (c.dataset.headword ?? '').toLowerCase(),
  spelling_us: (c.dataset.spellingUs ?? '').toLowerCase(),
  gloss: c.querySelector('.gloss-zh')?.textContent ?? '',
  def: (c.querySelector('.def-en')?.textContent ?? '').toLowerCase(),
  example_en: (c.querySelector('.ex-en')?.textContent ?? '').toLowerCase(),
  example_zh: c.querySelector('.ex-zh')?.textContent ?? '',
  synonyms: [...c.querySelectorAll<HTMLElement>('.syn')]
    .map((s) => (s.dataset.syn ?? '').toLowerCase())
    .join(' '),
}));

// rank: lower = higher priority. 99 = not a match.
function rankMatch(e: IndexEntry, q: string): number {
  if (e.headword === q || e.spelling_us === q) return 0;
  const synList = e.synonyms.split(/\s+/);
  if (synList.includes(q)) return 1;
  if (e.headword.startsWith(q) || e.spelling_us.startsWith(q)) return 2;
  if (e.headword.includes(q) || e.spelling_us.includes(q)) return 3;
  if (e.synonyms.includes(q)) return 4;
  if (e.gloss.includes(q)) return 5;
  if (e.def.includes(q)) return 6;
  if (e.example_zh.includes(q)) return 7;
  if (e.example_en.includes(q)) return 8;
  return 99;
}

searchInput?.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {
    activeIds = null;
    searchRanks = null;
  } else {
    const ranks = new Map<string, number>();
    for (const e of searchIndex) {
      const r = rankMatch(e, q);
      if (r < 99) ranks.set(e.id, r);
    }
    activeIds = new Set(ranks.keys());
    searchRanks = ranks;
  }
  applyFilters();
});
// '/' focuses search
document.addEventListener('keydown', (ev) => {
  if (ev.key === '/' && document.activeElement !== searchInput) {
    ev.preventDefault();
    searchInput?.focus();
  }
});

function applyFilters(): void {
  let visible = 0;
  for (const c of cards) {
    const id = c.dataset.wordId ?? '';
    const cat = c.dataset.category ?? '';
    let ok = activeCat === 'all' || cat === activeCat;
    if (ok && activeIds) ok = activeIds.has(id);
    if (ok && learnedOnly) ok = !isLearned(id);
    c.hidden = !ok;
    if (ok) {
      visible++;
      c.style.order = searchRanks ? String(searchRanks.get(id) ?? 99) : '';
    } else {
      c.style.order = '';
    }
  }
  document.querySelectorAll<HTMLElement>('.section').forEach((sec) => {
    const cat = sec.id.replace(/^cat-/, '');
    const any = cards.some((c) => c.dataset.category === cat && !c.hidden);
    sec.hidden = !any;
  });
  const empty = document.getElementById('empty-state');
  if (empty) empty.hidden = visible > 0;
}

// ---------- practice ----------
initPractice();

console.info(`[ogden-tw] ready · ${cards.length} cards · total ${TOTAL_WORDS}`);
