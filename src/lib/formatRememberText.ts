/**
 * Smart parser for "Remember This" card content.
 * Detects titles, numbered lists, and key=value pairs in plain text
 * and returns a structured object for rich rendering.
 */

export interface ParsedRememberText {
  /** Optional title/header extracted before the first colon */
  title?: string;
  /** Structured items — numbered steps or key-value pairs */
  items: ParsedItem[];
  /** Raw fallback text when no structure is detected */
  fallback?: string;
}

export interface ParsedItem {
  type: "numbered" | "keyvalue" | "bullet" | "plain";
  number?: number;
  key?: string;
  text: string;
}

/**
 * Parses structured "Remember This" text into renderable segments.
 *
 * Handles patterns like:
 * - "TITLE: 1) first 2) second 3) third"
 * - "T.I.L.E: T=Task I=Individual L=Load E=Environment"
 * - Plain unstructured paragraphs (returned as fallback)
 */
export function formatRememberText(raw: string): ParsedRememberText {
  if (!raw || !raw.trim()) return { items: [], fallback: "" };

  const trimmed = raw.trim();

  // ── 1. Detect title before first colon ──
  let title: string | undefined;
  let body = trimmed;

  // Match a title like "5 STEPS OF RISK ASSESSMENT:" or "T.I.L.E:"
  // Only if the colon appears within the first ~80 chars and is followed by content
  const colonIdx = trimmed.indexOf(":");
  if (colonIdx > 0 && colonIdx < 80) {
    const candidate = trimmed.slice(0, colonIdx).trim();
    const rest = trimmed.slice(colonIdx + 1).trim();
    // Only treat as title if there's meaningful content after
    if (rest.length > 10) {
      title = candidate;
      body = rest;
    }
  }

  // ── 2. Try numbered list: "1) ... 2) ..." or "1. ... 2. ..."
  const numberedPattern = /(?:^|\s)(\d+)[.)]\s+/;
  if (numberedPattern.test(body)) {
    // Split on number patterns
    const parts = body.split(/(?:^|\s)(\d+)[.)]\s+/).filter(Boolean);
    const items: ParsedItem[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part) continue;
      const num = parseInt(part, 10);
      if (!isNaN(num) && num > 0 && num < 100 && i + 1 < parts.length) {
        items.push({
          type: "numbered",
          number: num,
          text: parts[i + 1].trim().replace(/\.$/, ""),
        });
        i++; // skip the text part
      }
    }

    if (items.length >= 2) {
      return { title, items };
    }
  }

  // ── 3. Try key=value pairs: "T=Task", "I=Individual"
  const kvPattern = /([A-Z])=([^.]+?)(?:\.\s*|$)/g;
  const kvMatches = [...body.matchAll(kvPattern)];
  if (kvMatches.length >= 2) {
    const items: ParsedItem[] = kvMatches.map((m) => ({
      type: "keyvalue" as const,
      key: m[1],
      text: m[2].trim(),
    }));
    return { title, items };
  }

  // ── 4. Fallback — return as plain text
  return { items: [], fallback: trimmed, title };
}
