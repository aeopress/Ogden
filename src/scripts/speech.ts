type Lang = 'en-GB' | 'en-US';

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const v = speechSynthesis.getVoices();
    if (v.length) {
      cachedVoices = v;
      resolve(v);
      return;
    }
    speechSynthesis.addEventListener(
      'voiceschanged',
      () => {
        cachedVoices = speechSynthesis.getVoices();
        resolve(cachedVoices);
      },
      { once: true },
    );
  });
}

// macOS legacy novelty voices — these sound robotic / chipmunk / sound-effect-y.
// Filter them out so en-US picks Samantha not Albert.
const NOVELTY_NAMES = new Set([
  'Albert', 'Bad News', 'Bahh', 'Bells', 'Boing', 'Bubbles', 'Cellos',
  'Deranged', 'Fred', 'Good News', 'Hysterical', 'Jester', 'Junior',
  'Kathy', 'Organ', 'Pipe Organ', 'Princess', 'Ralph', 'Superstar',
  'Trinoids', 'Whisper', 'Zarvox', 'Wobble',
]);

// Preferred standard voices per locale (macOS / Chrome on macOS).
const PREFERRED: Record<Lang, string[]> = {
  'en-GB': ['Daniel', 'Kate', 'Serena', 'Oliver'],
  'en-US': ['Samantha', 'Alex', 'Tom', 'Victoria', 'Allison'],
};

function voiceScore(v: SpeechSynthesisVoice): number {
  const uri = v.voiceURI ?? '';
  if (uri.includes('premium')) return 3;
  if (uri.includes('enhanced')) return 2;
  if (uri.includes('compact')) return 1;
  return 0;
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const candidates = cachedVoices.filter(
    (v) => v.lang === lang && !NOVELTY_NAMES.has(v.name),
  );

  // 1) Preferred name list, top to bottom
  for (const name of PREFERRED[lang]) {
    const hit = candidates.find((v) => v.name === name);
    if (hit) return hit;
  }

  // 2) Default voice for this locale
  const def = candidates.find((v) => v.default);
  if (def) return def;

  // 3) Highest quality among remaining (premium > enhanced > compact)
  if (candidates.length) {
    return candidates.sort((a, b) => voiceScore(b) - voiceScore(a))[0];
  }

  // 4) Fallback: any voice with matching language prefix, still filtering novelty
  return cachedVoices.find(
    (v) => v.lang.startsWith(lang.slice(0, 2)) && !NOVELTY_NAMES.has(v.name),
  );
}

let currentLang: Lang = (localStorage.getItem('voice') as Lang) ?? 'en-GB';

export function setLang(lang: Lang): void {
  currentLang = lang;
  localStorage.setItem('voice', lang);
}

export function getLang(): Lang {
  return currentLang;
}

export async function speak(text: string): Promise<void> {
  if (!('speechSynthesis' in window)) return;
  if (!cachedVoices.length) await loadVoices();
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = currentLang;
  u.rate = 0.9;
  const voice = pickVoice(currentLang);
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}

if (typeof window !== 'undefined') {
  // warm voices early so first click feels instant
  void loadVoices();
}
