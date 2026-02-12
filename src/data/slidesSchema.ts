/**
 * Slide-based lesson schema.
 * Each lesson is an ordered array of full-screen slides.
 * Slides are auto-generated from existing i18n content — no manual mapping needed.
 * Dual-language: English always present, translated text shown alongside when lang ≠ en.
 */

import type { I18nLessonContent } from "@/data/module1Content";
import { t } from "@/data/module1Content";
import { lessonMedia } from "@/data/mediaMap";

/* ─── Slide types ─── */

export interface VideoSlide {
  type: "video";
  lessonId: string;
}

export interface HeroSlide {
  type: "hero";
  title: string;
  subtitle: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface TextSlide {
  type: "text";
  body: string;
  bodyEn?: string; // English original (shown when lang ≠ en)
  title?: string;
  bold?: boolean;
}

export interface ImageSlide {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
}

export interface KeyTermSlide {
  type: "keyterm";
  term: string;
  explanation: string;
}

export interface RememberSlide {
  type: "remember";
  text: string;
  textEn?: string;
}

export interface TipSlide {
  type: "tip";
  text: string;
  textEn?: string;
}

export interface QuizSlide {
  type: "quiz";
  question: string;
  questionEn?: string;
  options: string[];
  correct: number;
  feedback?: string;
  conceptSlug?: string; // links to concepts table for recall tracking
}

export interface SummarySlide {
  type: "summary";
  facts: string[];
}

export type Slide =
  | VideoSlide
  | HeroSlide
  | TextSlide
  | ImageSlide
  | KeyTermSlide
  | RememberSlide
  | TipSlide
  | QuizSlide
  | SummarySlide;

/* ─── Auto-convert i18n content to slides ─── */

export function buildSlidesFromI18n(
  i18n: I18nLessonContent,
  lang: string,
  moduleId: number,
  lessonId: number,
  lessonTitle: string
): Slide[] {
  const key = `${moduleId}.${lessonId}`;
  const media = lessonMedia[key];
  const slides: Slide[] = [];
  const isTranslated = lang !== "en";

  // 1. Hero slide
  const heroImage = media?.images?.[0];
  slides.push({
    type: "hero",
    title: lessonTitle,
    subtitle: `Module ${moduleId} · Lesson ${lessonId}`,
    imageSrc: heroImage?.src,
    imageAlt: heroImage?.alt,
  });

  // 2. Video slide
  slides.push({ type: "video", lessonId: key });

  // 3. Key terms — one slide per term (always English term + translated explanation)
  for (const kt of i18n.keyTerms) {
    const translated = t(kt as any, lang);
    slides.push({
      type: "keyterm",
      term: kt.en,
      explanation: isTranslated && translated !== kt.en ? translated : (kt.ro || kt.lt || kt.bg || "Key construction term"),
    });
  }

  // 4. Content blocks → slides
  const imagePool = media?.images?.slice(1) ?? [];
  let imgIdx = 0;
  let paragraphBuffer: string[] = [];
  let paragraphBufferEn: string[] = [];

  const flushParagraphs = () => {
    if (paragraphBuffer.length === 0) return;
    slides.push({
      type: "text",
      body: paragraphBuffer.join("\n\n"),
      bodyEn: isTranslated ? paragraphBufferEn.join("\n\n") : undefined,
    });
    if (imgIdx < imagePool.length) {
      const img = imagePool[imgIdx++];
      slides.push({ type: "image", src: img.src, alt: img.alt });
    }
    paragraphBuffer = [];
    paragraphBufferEn = [];
  };

  for (const block of i18n.content) {
    switch (block.type) {
      case "paragraph": {
        paragraphBuffer.push(t(block.text, lang));
        if (isTranslated) paragraphBufferEn.push(block.text.en);
        if (paragraphBuffer.length >= 2) flushParagraphs();
        break;
      }
      case "bold": {
        flushParagraphs();
        slides.push({
          type: "text",
          body: t(block.text, lang),
          bodyEn: isTranslated ? block.text.en : undefined,
          bold: true,
        });
        break;
      }
      case "rememberThis": {
        flushParagraphs();
        slides.push({
          type: "remember",
          text: t(block.text, lang),
          textEn: isTranslated ? block.text.en : undefined,
        });
        break;
      }
      case "testTip": {
        flushParagraphs();
        slides.push({
          type: "tip",
          text: t(block.text, lang),
          textEn: isTranslated ? block.text.en : undefined,
        });
        break;
      }
      case "image": {
        flushParagraphs();
        if (imgIdx < imagePool.length) {
          const img = imagePool[imgIdx++];
          slides.push({ type: "image", src: img.src, alt: img.alt, caption: t(block.description, lang) });
        }
        break;
      }
      case "miniCheck": {
        flushParagraphs();
        slides.push({
          type: "quiz",
          question: t(block.question, lang),
          questionEn: isTranslated ? block.question.en : undefined,
          options: block.options.map((o) => t(o, lang)),
          correct: block.correct,
          feedback: t(block.feedback, lang),
        });
        break;
      }
    }
  }
  flushParagraphs();

  // 5. Key summary
  if (i18n.keySummary.length > 0) {
    slides.push({
      type: "summary",
      facts: i18n.keySummary.map((s) => t(s, lang)),
    });
  }

  return slides;
}
