const KEY = 'learned_ids';
const TOTAL = 850;

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

let learned = load();

function save(): void {
  localStorage.setItem(KEY, JSON.stringify([...learned]));
}

export function isLearned(id: string): boolean {
  return learned.has(id);
}

export function toggle(id: string): boolean {
  if (learned.has(id)) learned.delete(id);
  else learned.add(id);
  save();
  emit();
  return learned.has(id);
}

export function setLearned(id: string, value: boolean): void {
  if (value) learned.add(id);
  else learned.delete(id);
  save();
  emit();
}

export function count(): number {
  return learned.size;
}

export function ids(): string[] {
  return [...learned];
}

type Listener = (count: number, total: number) => void;
const listeners = new Set<Listener>();
export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  fn(learned.size, TOTAL);
  return () => listeners.delete(fn);
}
function emit(): void {
  for (const fn of listeners) fn(learned.size, TOTAL);
}

export const TOTAL_WORDS = TOTAL;
