/**
 * Splits Test Tip content into digestible parts for structured rendering.
 * Detects sentence-based lists and key terms (text before colons).
 */

export interface TipPart {
  text: string;
  /** If text has a "KEY: rest" pattern, these are split out */
  highlighted?: string;
  rest?: string;
}

export function formatTestTipContent(raw: string): TipPart[] {
  if (!raw || !raw.trim()) return [{ text: "" }];

  const trimmed = raw.trim();

  // Split on period boundaries into sentences
  const sentences = trimmed
    .split(/\.\s+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter((s) => s.length > 6);

  if (sentences.length < 2) {
    // Single block — check for key:value highlight
    return [parseKeyHighlight(trimmed)];
  }

  return sentences.map((s) => parseKeyHighlight(s));
}

function parseKeyHighlight(text: string): TipPart {
  const colonIdx = text.indexOf(":");
  if (colonIdx > 0 && colonIdx < 40) {
    const before = text.slice(0, colonIdx).trim();
    const after = text.slice(colonIdx + 1).trim();
    if (after.length > 3) {
      return { text, highlighted: before, rest: after };
    }
  }
  return { text };
}
