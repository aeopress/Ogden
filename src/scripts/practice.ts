import { setLearned } from './progress';
import { speak } from './speech';

interface WordLite {
  id: string;
  headword: string;
  spelling_uk: string;
  spelling_us: string;
  category: string;
  is_18_operators: boolean;
  definition_en: string;
  gloss_zh_tw: string;
  example_en: string;
  example_zh_tw: string;
  synonyms: string[];
  notes?: string;
}

let pool: WordLite[] = [];

function readPool(): WordLite[] {
  const cards = document.querySelectorAll<HTMLElement>('article.card');
  const items: WordLite[] = [];
  for (const c of cards) {
    items.push({
      id: c.dataset.wordId ?? '',
      headword: c.dataset.headword ?? '',
      spelling_uk: c.dataset.spellingUk ?? '',
      spelling_us: c.dataset.spellingUs ?? '',
      category: c.dataset.category ?? '',
      is_18_operators: c.querySelector('.badge-18op') !== null,
      definition_en: c.querySelector('.def-en')?.textContent ?? '',
      gloss_zh_tw: c.querySelector('.gloss-zh')?.textContent ?? '',
      example_en: c.querySelector('.ex-en')?.textContent ?? '',
      example_zh_tw: c.querySelector('.ex-zh')?.textContent ?? '',
      synonyms: [...c.querySelectorAll<HTMLElement>('.syn')].map((s) => s.dataset.syn ?? ''),
      notes: c.classList.contains('placeholder') ? 'PLACEHOLDER' : undefined,
    });
  }
  return items;
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

let order: WordLite[] = [];
let cursor = 0;
let flipped = false;
let mode: 'flip' | 'quiz-en-to-zh' | 'quiz-zh-to-en' = 'flip';
let autoSpeak = true;
let shuffled = false;

function pickFiltered(): WordLite[] {
  // Respect the page's current category filter + search via :not([hidden]) ancestor
  return pool.filter((w) => {
    const el = document.querySelector(`article.card[data-word-id="${w.id}"]`);
    return el && !(el as HTMLElement).hidden;
  });
}

function start(newMode: typeof mode): void {
  mode = newMode;
  if (!pool.length) pool = readPool();
  const filtered = pickFiltered();
  order = shuffled ? shuffle(filtered) : filtered;
  cursor = 0;
  flipped = false;
  if (!order.length) {
    alert('沒有符合篩選的卡片可以練習。');
    return;
  }
  render();
  document.body.dataset.practice = 'on';
}

function close(): void {
  delete document.body.dataset.practice;
  speechSynthesis.cancel();
}

function current(): WordLite | undefined {
  return order[cursor];
}

function next(): void {
  if (cursor < order.length - 1) {
    cursor++;
    flipped = false;
    render();
  } else {
    // wrap to end summary
    cursor = 0;
    flipped = false;
    render();
  }
}
function prev(): void {
  if (cursor > 0) {
    cursor--;
    flipped = false;
    render();
  }
}

function buildQuizOptions(target: WordLite): WordLite[] {
  const sameCat = pool.filter((w) => w.category === target.category && w.id !== target.id);
  const distractors = shuffle(sameCat).slice(0, 3);
  return shuffle([target, ...distractors]);
}

let activeOptions: WordLite[] = [];
let answered = false;

function escAttr(s: string): string {
  return s.replace(/[&"<>]/g, (c) => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' })[c] ?? c);
}
function escHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] ?? c);
}
function speakBtn(text: string, label: string): string {
  return `<button class="speak-inline" data-speak-text="${escAttr(text)}" aria-label="${label}" title="${label}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></button>`;
}

function renderFlip(w: WordLite): string {
  return `
    <div class="card-face ${flipped ? 'back' : 'front'}">
      <div class="counter">${cursor + 1} / ${order.length}</div>
      <div class="big-word">
        <span>${escHtml(w.spelling_uk)}</span>
        ${speakBtn(w.spelling_uk, '聽單字')}
      </div>
      ${flipped
        ? `<div class="reveal">
            <p class="en-def">
              <span>${escHtml(w.definition_en)}</span>
              ${speakBtn(w.definition_en, '聽英文釋義')}
            </p>
            <p class="zh-gloss">${escHtml(w.gloss_zh_tw)}</p>
            <div class="ex-block">
              <p class="ex-en">
                <span>${escHtml(w.example_en)}</span>
                ${speakBtn(w.example_en, '聽例句')}
              </p>
              <p class="ex-zh">${escHtml(w.example_zh_tw)}</p>
            </div>
          </div>`
        : `<button class="reveal-btn" id="reveal">查看釋義</button>`}
    </div>
  `;
}

function renderQuiz(w: WordLite): string {
  if (!activeOptions.length || !activeOptions.includes(w)) {
    activeOptions = buildQuizOptions(w);
    answered = false;
  }
  const prompt = mode === 'quiz-en-to-zh' ? w.spelling_uk : w.gloss_zh_tw;
  const promptClass = mode === 'quiz-en-to-zh' ? 'big-word' : 'big-zh';
  const optionLabel = (o: WordLite) => (mode === 'quiz-en-to-zh' ? o.gloss_zh_tw : o.spelling_uk);
  return `
    <div class="card-face quiz">
      <div class="counter">${cursor + 1} / ${order.length}</div>
      <div class="${promptClass}">${prompt}</div>
      <div class="quiz-options">
        ${activeOptions
          .map(
            (o, i) =>
              `<button class="opt ${answered ? (o.id === w.id ? 'correct' : 'wrong') : ''}" data-opt="${o.id}" data-correct="${o.id === w.id}">${i + 1}. ${optionLabel(o)}</button>`,
          )
          .join('')}
      </div>
      ${answered ? `<p class="hint">按 Enter 或 → 下一題</p>` : ''}
    </div>
  `;
}

function render(): void {
  const w = current();
  if (!w) return;
  const root = document.getElementById('practice-content');
  if (!root) return;
  root.innerHTML = mode === 'flip' ? renderFlip(w) : renderQuiz(w);

  if (mode === 'flip' && autoSpeak && !flipped) {
    void speak(w.spelling_uk);
  }

  // bind handlers
  root.querySelector<HTMLButtonElement>('#reveal')?.addEventListener('click', () => {
    flipped = true;
    render();
    if (autoSpeak && current()) void speak(current()!.example_en);
  });
  root.querySelectorAll<HTMLButtonElement>('.opt').forEach((b) => {
    b.addEventListener('click', () => onQuizPick(b));
  });
  root.querySelectorAll<HTMLButtonElement>('.speak-inline').forEach((b) => {
    b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const text = b.dataset.speakText ?? '';
      if (text) void speak(text);
    });
  });
}

function onQuizPick(btn: HTMLButtonElement): void {
  if (answered) return;
  answered = true;
  const correct = btn.dataset.correct === 'true';
  if (correct) {
    setLearned(current()!.id, true);
  }
  render();
}

function onKey(ev: KeyboardEvent): void {
  if (document.body.dataset.practice !== 'on') return;
  if (ev.key === 'Escape') {
    ev.preventDefault();
    close();
    return;
  }
  if (mode === 'flip') {
    if (ev.key === ' ') {
      ev.preventDefault();
      flipped = !flipped;
      render();
    } else if (ev.key === 'ArrowRight') {
      ev.preventDefault();
      next();
    } else if (ev.key === 'ArrowLeft') {
      ev.preventDefault();
      prev();
    }
  } else {
    if (ev.key === 'Enter' || ev.key === 'ArrowRight') {
      ev.preventDefault();
      next();
    } else if (['1', '2', '3', '4'].includes(ev.key)) {
      ev.preventDefault();
      const idx = parseInt(ev.key, 10) - 1;
      const btn = document.querySelectorAll<HTMLButtonElement>('.opt')[idx];
      if (btn) onQuizPick(btn);
    }
  }
}

export function initPractice(): void {
  document.addEventListener('keydown', onKey);
  document.getElementById('open-practice')?.addEventListener('click', () => start('flip'));
  document.getElementById('close-practice')?.addEventListener('click', close);
  document.getElementById('mode-flip')?.addEventListener('click', () => start('flip'));
  document.getElementById('mode-quiz-en-zh')?.addEventListener('click', () => start('quiz-en-to-zh'));
  document.getElementById('mode-quiz-zh-en')?.addEventListener('click', () => start('quiz-zh-to-en'));

  const shuffleEl = document.getElementById('practice-shuffle') as HTMLInputElement | null;
  const autoEl = document.getElementById('practice-auto-speak') as HTMLInputElement | null;
  shuffleEl?.addEventListener('change', () => {
    shuffled = shuffleEl.checked;
    start(mode);
  });
  autoEl?.addEventListener('change', () => {
    autoSpeak = autoEl.checked;
  });
}
