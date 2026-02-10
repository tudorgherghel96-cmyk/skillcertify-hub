/**
 * Lesson content data structure for all modules.
 * Each lesson contains structured blocks for rendering and key terms for memorisation.
 */

export interface KeyTerm {
  english: string;
  translations: Record<string, string>; // langCode → translation
}

export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface RememberThisBlock {
  type: "remember";
  text: string;
}

export interface TestTipBlock {
  type: "testTip";
  text: string;
}

export interface MiniCheckBlock {
  type: "miniCheck";
  question: string;
  options: string[];
  correctIndex: number;
}

export type ContentBlock =
  | ParagraphBlock
  | RememberThisBlock
  | TestTipBlock
  | MiniCheckBlock;

export interface LessonContent {
  moduleId: number;
  lessonId: number;
  title: string;
  keyTerms: KeyTerm[];
  content: ContentBlock[];
  keyFacts: string[];
}

/* ──────────────────────────────────────────────
   MODULE 1 — Health & Safe Working Environment
   ────────────────────────────────────────────── */

const m1_lesson1: LessonContent = {
  moduleId: 1,
  lessonId: 1,
  title: "Why Health & Safety Matters",
  keyTerms: [
    {
      english: "Hazard",
      translations: {
        ro: "Pericol",
        lt: "Pavojus",
        bg: "Опасност",
        ar: "خطر",
        ti: "ሓደጋ",
        yo: "Ewu",
        ig: "Ihe ize ndụ",
        so: "Khatar",
        am: "አደጋ",
      },
    },
    {
      english: "Risk",
      translations: {
        ro: "Risc",
        lt: "Rizika",
        bg: "Риск",
        ar: "مخاطرة",
        ti: "ስግኣት",
        yo: "Ewu",
        ig: "Ihe egwu",
        so: "Halista",
        am: "ስጋት",
      },
    },
    {
      english: "Safety",
      translations: {
        ro: "Siguranță",
        lt: "Sauga",
        bg: "Безопасност",
        ar: "سلامة",
        ti: "ድሕነት",
        yo: "Ààbò",
        ig: "Nchekwa",
        so: "Badbaado",
        am: "ደህንነት",
      },
    },
  ],
  content: [
    {
      type: "paragraph",
      text: "Construction is one of the most dangerous industries in the UK. Every year workers are killed or seriously injured on building sites.",
    },
    {
      type: "remember",
      text: "The construction industry has one of the HIGHEST rates of fatal injuries of any UK industry. Around 30-40 workers die each year on construction sites.",
    },
    {
      type: "paragraph",
      text: "Health and safety laws exist to protect YOU, your workmates, and the public. Everyone on site has a duty of care.",
    },
    {
      type: "testTip",
      text: "In the test, 'duty of care' means EVERYONE has a responsibility for safety — not just the site manager. If asked who is responsible, the answer is usually 'everyone on site'.",
    },
    {
      type: "miniCheck",
      question: "Who is responsible for health and safety on a construction site?",
      options: [
        "Only the site manager",
        "Only the HSE inspector",
        "Everyone on site",
        "Only the client",
      ],
      correctIndex: 2,
    },
    {
      type: "paragraph",
      text: "A HAZARD is something with the POTENTIAL to cause harm. A RISK is the LIKELIHOOD that harm will actually occur.",
    },
    {
      type: "remember",
      text: "HAZARD = potential to cause harm. RISK = likelihood of that harm happening. These definitions are tested in almost every GQA and CSCS exam.",
    },
    {
      type: "paragraph",
      text: "Examples of hazards: wet floors, unguarded machinery, working at height, exposed electrical wires. The risk depends on how likely someone is to be harmed and how serious that harm could be.",
    },
    {
      type: "miniCheck",
      question: "A hazard is defined as something that has the _____ to cause harm.",
      options: ["Potential", "Certainty", "Permission", "History"],
      correctIndex: 0,
    },
    {
      type: "testTip",
      text: "The test often asks: 'What is the difference between a hazard and a risk?' Remember: Hazard = WHAT can cause harm. Risk = HOW LIKELY it is to cause harm.",
    },
    {
      type: "paragraph",
      text: "The Health and Safety Executive (HSE) is the government body that enforces health and safety law. HSE inspectors can visit any site without notice.",
    },
    {
      type: "remember",
      text: "HSE inspectors can issue Improvement Notices (fix it within a time limit) or Prohibition Notices (STOP work immediately — serious danger).",
    },
    {
      type: "miniCheck",
      question: "What does a Prohibition Notice require?",
      options: [
        "Fix the problem within 30 days",
        "Pay a fine immediately",
        "Stop work immediately",
        "Hire more safety officers",
      ],
      correctIndex: 2,
    },
  ],
  keyFacts: [
    "Construction has one of the highest fatal injury rates in the UK",
    "HAZARD = potential to cause harm; RISK = likelihood of harm",
    "EVERYONE on site has a duty of care for health and safety",
    "HSE enforces health and safety law and can visit sites without notice",
    "Improvement Notice = fix within a deadline; Prohibition Notice = STOP immediately",
    "Around 30-40 construction workers die each year in the UK",
  ],
};

const m1_lesson2: LessonContent = {
  moduleId: 1,
  lessonId: 2,
  title: "The Health & Safety at Work Act",
  keyTerms: [
    {
      english: "Employer",
      translations: {
        ro: "Angajator",
        lt: "Darbdavys",
        bg: "Работодател",
        ar: "صاحب العمل",
        ti: "ኣስራሒ",
        yo: "Agbanisise",
        ig: "Onye ọrụ",
        so: "Shaqo-bixiye",
        am: "አሰሪ",
      },
    },
    {
      english: "Employee",
      translations: {
        ro: "Angajat",
        lt: "Darbuotojas",
        bg: "Служител",
        ar: "موظف",
        ti: "ተቆጻሪ",
        yo: "Osise",
        ig: "Onye ọrụ",
        so: "Shaqaale",
        am: "ሰራተኛ",
      },
    },
    {
      english: "PPE",
      translations: {
        ro: "EIP",
        lt: "AAP",
        bg: "ЛПС",
        ar: "معدات الوقاية",
        ti: "PPE",
        yo: "PPE",
        ig: "PPE",
        so: "PPE",
        am: "PPE",
      },
    },
  ],
  content: [
    {
      type: "paragraph",
      text: "The Health and Safety at Work Act 1974 (HASAWA) is the most important piece of health and safety law in the UK. It covers ALL work activities.",
    },
    {
      type: "remember",
      text: "HASAWA 1974 — remember the year! This is the main law. It applies to EVERY workplace, not just construction.",
    },
    {
      type: "paragraph",
      text: "Under HASAWA, employers MUST provide: a safe place of work, safe equipment, adequate training, and a written safety policy (if they employ 5 or more people).",
    },
    {
      type: "testTip",
      text: "Test question trap: 'When must an employer have a written safety policy?' Answer: When they employ 5 or more people.",
    },
    {
      type: "miniCheck",
      question: "The Health and Safety at Work Act was introduced in which year?",
      options: ["1964", "1974", "1984", "1994"],
      correctIndex: 1,
    },
    {
      type: "paragraph",
      text: "Employees also have duties: cooperate with their employer on safety, not interfere with safety equipment, report hazards, and use PPE provided.",
    },
    {
      type: "remember",
      text: "Employees must NOT interfere with or misuse anything provided for health and safety. This includes removing guards from machinery or not wearing PPE.",
    },
    {
      type: "miniCheck",
      question: "An employer must have a written safety policy if they employ how many people?",
      options: ["1 or more", "3 or more", "5 or more", "10 or more"],
      correctIndex: 2,
    },
  ],
  keyFacts: [
    "HASAWA 1974 is the main UK health and safety law",
    "Employers must provide safe workplace, equipment, training, and PPE",
    "Written safety policy required for 5+ employees",
    "Employees must cooperate, report hazards, and use PPE",
    "Never interfere with or misuse safety equipment",
  ],
};

/* ──────────────────────────────────────────
   Placeholder generator for remaining lessons
   ────────────────────────────────────────── */

const createPlaceholderLesson = (
  moduleId: number,
  lessonId: number,
  title: string
): LessonContent => ({
  moduleId,
  lessonId,
  title,
  keyTerms: [
    {
      english: "Safety",
      translations: {
        ro: "Siguranță",
        lt: "Sauga",
        bg: "Безопасност",
        ar: "سلامة",
        ti: "ድሕነት",
        yo: "Ààbò",
        ig: "Nchekwa",
        so: "Badbaado",
        am: "ደህንነት",
      },
    },
  ],
  content: [
    {
      type: "paragraph",
      text: `This lesson covers ${title}. Full content will be added in upcoming updates.`,
    },
    {
      type: "remember",
      text: `Key facts about ${title} will appear here — designed to stick in your memory for the closed-book test.`,
    },
    {
      type: "testTip",
      text: "Test tips specific to this topic will be added soon. These highlight the exact phrasing examiners look for.",
    },
    {
      type: "miniCheck",
      question: `This lesson is about ${title}. What should you focus on?`,
      options: [
        "Memorising key facts",
        "Skipping to the test",
        "Reading once quickly",
        "Ignoring safety rules",
      ],
      correctIndex: 0,
    },
  ],
  keyFacts: [
    `${title} — content coming soon`,
    "Focus on understanding key terms in English",
    "Both GQA and CSCS tests are closed book",
    "Review this lesson multiple times for best retention",
  ],
});

// Build the full content map
const LESSON_CONTENT_MAP = new Map<string, LessonContent>();

// Module 1 — populated lessons
LESSON_CONTENT_MAP.set("1-1", m1_lesson1);
LESSON_CONTENT_MAP.set("1-2", m1_lesson2);

// Module 1 remaining placeholders
const m1Titles = [
  "", "", // 1,2 already done
  "Risk Assessments",
  "Method Statements",
  "Hazards, Risks & Accident Reporting",
  "Safety Signs & Signals",
  "Fire Safety & Prevention",
  "Personal Protective Equipment (PPE)",
];
for (let i = 3; i <= 8; i++) {
  LESSON_CONTENT_MAP.set(`1-${i}`, createPlaceholderLesson(1, i, m1Titles[i]));
}

// Module 2
const m2Titles = [
  "Correct Lifting Technique",
  "TILEO Risk Factors",
  "Manual Handling Injuries",
  "Lifting Aids & Storage Safety",
];
m2Titles.forEach((t, i) =>
  LESSON_CONTENT_MAP.set(`2-${i + 1}`, createPlaceholderLesson(2, i + 1, t))
);

// Module 3
const m3Titles = [
  "Working at Height Regulations",
  "Ladders & Step Ladders",
  "Scaffolding Safety",
  "Fragile Roofs, Voids & MEWPs",
];
m3Titles.forEach((t, i) =>
  LESSON_CONTENT_MAP.set(`3-${i + 1}`, createPlaceholderLesson(3, i + 1, t))
);

// Module 4
const m4Titles = [
  "COSHH & Hazardous Substances",
  "Asbestos Awareness",
  "Noise, Vibration, Dust & PPE Matching",
];
m4Titles.forEach((t, i) =>
  LESSON_CONTENT_MAP.set(`4-${i + 1}`, createPlaceholderLesson(4, i + 1, t))
);

// Module 5
const m5Titles = [
  "Exclusion Zones & Signallers",
  "Vehicles, Emergency Stops & Safeguards",
];
m5Titles.forEach((t, i) =>
  LESSON_CONTENT_MAP.set(`5-${i + 1}`, createPlaceholderLesson(5, i + 1, t))
);

export const getLessonContent = (
  moduleId: number,
  lessonId: number
): LessonContent | undefined => LESSON_CONTENT_MAP.get(`${moduleId}-${lessonId}`);
