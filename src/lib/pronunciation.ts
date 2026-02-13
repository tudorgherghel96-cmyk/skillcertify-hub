let britishVoice: SpeechSynthesisVoice | null = null;

function pickBritishVoice(): SpeechSynthesisVoice | null {
  if (britishVoice) return britishVoice;
  const voices = speechSynthesis.getVoices();
  // Prefer natural-sounding British voices
  const preferred = ["Daniel", "Google UK English Female", "Google UK English Male", "Martha", "Kate"];
  for (const name of preferred) {
    const v = voices.find((v) => v.name.includes(name) && v.lang.startsWith("en"));
    if (v) { britishVoice = v; return v; }
  }
  // Fallback: any en-GB voice
  const gb = voices.find((v) => v.lang === "en-GB");
  if (gb) { britishVoice = gb; return gb; }
  // Last resort: any English voice
  const en = voices.find((v) => v.lang.startsWith("en"));
  if (en) { britishVoice = en; return en; }
  return null;
}

// Pre-load voices (they load async on some browsers)
if ("speechSynthesis" in globalThis) {
  speechSynthesis.onvoiceschanged = () => { britishVoice = null; pickBritishVoice(); };
  pickBritishVoice();
}

export function speakWord(word: string) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-GB";
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  const voice = pickBritishVoice();
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}
