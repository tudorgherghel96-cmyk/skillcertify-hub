export function speakWord(word: string) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-GB";
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
}
