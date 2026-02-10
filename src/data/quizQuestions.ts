/**
 * Quiz question bank for practice mode.
 * Each question has moduleId for filtering and lessonId for review linking.
 */

export interface QuizQuestion {
  id: string;
  moduleId: number;
  lessonId: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  /** Used for "REMEMBER THIS" reinforcement on wrong answers */
  rememberText: string;
}

export interface Flashcard {
  id: string;
  moduleId: number;
  lessonId: number;
  front: string;
  back: string;
  type: "remember" | "testTip";
}

/* ─────────────── MODULE 1 QUESTIONS ─────────────── */

const m1Questions: QuizQuestion[] = [
  {
    id: "m1q1",
    moduleId: 1,
    lessonId: 1,
    question: "What is a HAZARD?",
    options: [
      "Something with the potential to cause harm",
      "The likelihood of harm occurring",
      "An accident that has already happened",
      "A piece of safety equipment",
    ],
    correctIndex: 0,
    explanation:
      "A hazard is something with the POTENTIAL to cause harm. A risk is the LIKELIHOOD of that harm happening.",
    rememberText:
      "HAZARD = potential to cause harm. RISK = likelihood of harm. This is tested in nearly every exam.",
  },
  {
    id: "m1q2",
    moduleId: 1,
    lessonId: 1,
    question: "Who is responsible for health and safety on a construction site?",
    options: [
      "Only the site manager",
      "Only the HSE inspector",
      "Everyone on site",
      "Only the main contractor",
    ],
    correctIndex: 2,
    explanation:
      "Everyone on site has a duty of care for health and safety — not just the manager.",
    rememberText:
      "EVERYONE on site is responsible for health and safety. This includes workers, managers, visitors, and subcontractors.",
  },
  {
    id: "m1q3",
    moduleId: 1,
    lessonId: 1,
    question: "What does a Prohibition Notice require?",
    options: [
      "Fix the problem within 30 days",
      "Pay a fine immediately",
      "Stop work immediately",
      "Write a risk assessment",
    ],
    correctIndex: 2,
    explanation:
      "A Prohibition Notice means STOP work immediately because there is serious danger.",
    rememberText:
      "Prohibition = STOP immediately. Improvement = fix within a time limit.",
  },
  {
    id: "m1q4",
    moduleId: 1,
    lessonId: 1,
    question:
      "Approximately how many construction workers die each year in the UK?",
    options: ["5-10", "15-20", "30-40", "100+"],
    correctIndex: 2,
    explanation:
      "Around 30-40 construction workers die on UK sites each year, making it one of the most dangerous industries.",
    rememberText:
      "Construction has one of the HIGHEST fatal injury rates in the UK — around 30-40 deaths per year.",
  },
  {
    id: "m1q5",
    moduleId: 1,
    lessonId: 2,
    question: "The Health and Safety at Work Act was introduced in which year?",
    options: ["1964", "1974", "1984", "1994"],
    correctIndex: 1,
    explanation: "HASAWA was introduced in 1974 and is the main UK health and safety law.",
    rememberText: "HASAWA 1974 — the most important health and safety law in the UK.",
  },
  {
    id: "m1q6",
    moduleId: 1,
    lessonId: 2,
    question:
      "When must an employer have a written health and safety policy?",
    options: [
      "When they employ 1 or more people",
      "When they employ 3 or more people",
      "When they employ 5 or more people",
      "When they employ 10 or more people",
    ],
    correctIndex: 2,
    explanation:
      "A written safety policy is required when employing 5 or more people.",
    rememberText:
      "5 or more employees = written safety policy required. Common test question!",
  },
  {
    id: "m1q7",
    moduleId: 1,
    lessonId: 2,
    question: "Which of these is an EMPLOYEE duty under HASAWA?",
    options: [
      "Provide PPE to all workers",
      "Write the site safety policy",
      "Cooperate with the employer on safety matters",
      "Carry out site inspections",
    ],
    correctIndex: 2,
    explanation:
      "Employees must cooperate with their employer, use PPE, report hazards, and not misuse safety equipment.",
    rememberText:
      "Employee duties: cooperate, use PPE, report hazards, don't interfere with safety equipment.",
  },
  {
    id: "m1q8",
    moduleId: 1,
    lessonId: 1,
    question: "What is a RISK?",
    options: [
      "A piece of safety equipment",
      "The source of potential harm",
      "The likelihood that harm will occur",
      "An accident report",
    ],
    correctIndex: 2,
    explanation:
      "Risk is the LIKELIHOOD that harm from a hazard will actually occur. Hazard = source, Risk = likelihood.",
    rememberText:
      "RISK = the LIKELIHOOD of harm. Always pair with: HAZARD = POTENTIAL to cause harm.",
  },
  {
    id: "m1q9",
    moduleId: 1,
    lessonId: 1,
    question: "HSE inspectors can visit a construction site:",
    options: [
      "Only with 24 hours notice",
      "Only when invited by the site manager",
      "Without any notice at all",
      "Only after an accident has occurred",
    ],
    correctIndex: 2,
    explanation: "HSE inspectors can visit ANY site at ANY time without notice.",
    rememberText:
      "HSE inspectors can visit sites WITHOUT notice. They can issue Improvement or Prohibition Notices.",
  },
  {
    id: "m1q10",
    moduleId: 1,
    lessonId: 2,
    question:
      "Under HASAWA, what must an employer provide? (Select the BEST answer)",
    options: [
      "Free meals on site",
      "A safe place of work, safe equipment, and adequate training",
      "Transport to and from the site",
      "Entertainment during breaks",
    ],
    correctIndex: 1,
    explanation:
      "Employers must provide a safe workplace, safe equipment, adequate training, and a written safety policy (5+ employees).",
    rememberText:
      "Employer duties: safe workplace, safe equipment, training, PPE, written policy (5+ staff).",
  },
  {
    id: "m1q11",
    moduleId: 1,
    lessonId: 3,
    question: "What is the PRIMARY purpose of a risk assessment?",
    options: [
      "To blame someone when an accident happens",
      "To identify hazards and evaluate risks to reduce harm",
      "To increase insurance costs",
      "To slow down work on site",
    ],
    correctIndex: 1,
    explanation:
      "Risk assessments identify hazards, evaluate risks, and put controls in place to reduce harm.",
    rememberText:
      "Risk assessment = identify hazards + evaluate risks + implement controls to reduce harm.",
  },
  {
    id: "m1q12",
    moduleId: 1,
    lessonId: 4,
    question: "What is a method statement?",
    options: [
      "A record of accidents on site",
      "A step-by-step guide to doing a job safely",
      "A list of workers on site",
      "A contract between employer and employee",
    ],
    correctIndex: 1,
    explanation:
      "A method statement describes HOW to do a job safely, step by step. Often paired with a risk assessment (RAMS).",
    rememberText:
      "Method statement = step-by-step safe working procedure. RAMS = Risk Assessment + Method Statement.",
  },
];

/* ─────────────── MODULE 2 QUESTIONS ─────────────── */

const m2Questions: QuizQuestion[] = [
  {
    id: "m2q1",
    moduleId: 2,
    lessonId: 1,
    question: "What is the correct first step when lifting a heavy load?",
    options: [
      "Bend your back and lift quickly",
      "Plan the lift and assess the load",
      "Ask someone else to do it",
      "Use your back muscles for power",
    ],
    correctIndex: 1,
    explanation:
      "Always plan the lift first: assess the load weight, route, and destination before lifting.",
    rememberText:
      "Plan the lift FIRST. Think: What am I lifting? Where is it going? Do I need help?",
  },
  {
    id: "m2q2",
    moduleId: 2,
    lessonId: 2,
    question: "What does TILEO stand for in manual handling?",
    options: [
      "Task, Individual, Load, Environment, Other",
      "Time, Instruction, Lifting, Equipment, Organisation",
      "Training, Inspection, Load, Equipment, Operation",
      "Task, Inspection, Lifting, Environment, Organisation",
    ],
    correctIndex: 0,
    explanation:
      "TILEO: Task, Individual, Load, Environment, Other factors — the 5 risk factors in manual handling.",
    rememberText:
      "TILEO = Task, Individual, Load, Environment, Other. These are the 5 manual handling risk factors.",
  },
  {
    id: "m2q3",
    moduleId: 2,
    lessonId: 2,
    question: "When lifting, you should bend at the:",
    options: [
      "Back",
      "Waist",
      "Knees and hips",
      "Neck",
    ],
    correctIndex: 2,
    explanation:
      "Always bend your knees and hips when lifting, keeping your back straight. Never lift with a bent back.",
    rememberText:
      "Lift with your LEGS, not your back. Bend knees and hips, keep back straight, hold load close.",
  },
  {
    id: "m2q4",
    moduleId: 2,
    lessonId: 1,
    question: "The most common manual handling injury is to the:",
    options: [
      "Hands and fingers",
      "Lower back",
      "Feet and ankles",
      "Head and neck",
    ],
    correctIndex: 1,
    explanation:
      "Lower back injuries are the most common manual handling injury in construction.",
    rememberText:
      "Lower back = most common manual handling injury. That's why correct lifting technique matters!",
  },
  {
    id: "m2q5",
    moduleId: 2,
    lessonId: 1,
    question: "Why is safe manual handling important on a construction site?",
    options: [
      "To make the work slower",
      "To prevent injuries to yourself and others",
      "To impress the site manager",
      "It's not important if you're strong",
    ],
    correctIndex: 1,
    explanation:
      "Safe manual handling prevents injuries. Over one third of all workplace injuries are from manual handling.",
    rememberText:
      "Over ONE THIRD of workplace injuries are from manual handling. It affects EVERYONE, regardless of strength.",
  },
  {
    id: "m2q6",
    moduleId: 2,
    lessonId: 2,
    question: "A load is too heavy for you. What should you do?",
    options: [
      "Try your best and lift it quickly",
      "Drag it along the ground",
      "Inform your supervisor and request help or equipment",
      "Leave it and walk away",
    ],
    correctIndex: 2,
    explanation:
      "Never attempt to lift a load that is too heavy. Inform your supervisor and get help or mechanical equipment.",
    rememberText:
      "Too heavy? NEVER try alone. Inform supervisor → get help → use equipment. This is the SAFE and LEGAL answer.",
  },
  {
    id: "m2q7",
    moduleId: 2,
    lessonId: 3,
    question: "Which of the following is a manual handling lifting aid?",
    options: [
      "Hard hat",
      "Sack truck",
      "Safety goggles",
      "High-vis vest",
    ],
    correctIndex: 1,
    explanation:
      "A sack truck is a mechanical lifting aid. Others include wheelbarrows, pallet trucks, trolleys, and forklifts.",
    rememberText:
      "Lifting aids: sack truck, wheelbarrow, pallet truck, trolley, forklift, crane, conveyor belt.",
  },
  {
    id: "m2q8",
    moduleId: 2,
    lessonId: 1,
    question: "What is a long-term effect of repeated poor manual handling?",
    options: [
      "Improved fitness",
      "Better posture",
      "Musculoskeletal disorders and osteoarthritis",
      "Increased strength",
    ],
    correctIndex: 2,
    explanation:
      "Repeated poor manual handling causes long-term damage: musculoskeletal disorders, osteoarthritis, chronic back pain, and disc problems.",
    rememberText:
      "Long-term effects: musculoskeletal disorders (MSDs), osteoarthritis, chronic back pain, slipped discs. PERMANENT damage.",
  },
];

/* ─────────────── MODULE 3 QUESTIONS ─────────────── */

const m3Questions: QuizQuestion[] = [
  {
    id: "m3q1",
    moduleId: 3,
    lessonId: 1,
    question: "What caused ALL 35 construction deaths in 2024/25?",
    options: [
      "Electrocution",
      "Falls from height",
      "Being struck by vehicles",
      "Manual handling injuries",
    ],
    correctIndex: 1,
    explanation:
      "ALL 35 construction worker deaths in 2024/25 were caused by falls from height — the number one killer.",
    rememberText:
      "Falls from height = NUMBER ONE killer. ALL 35 deaths in 2024/25 were from falls.",
  },
  {
    id: "m3q2",
    moduleId: 3,
    lessonId: 2,
    question: "The correct ladder angle ratio is:",
    options: [
      "1 in 2",
      "1 in 3",
      "1 in 4",
      "1 in 5",
    ],
    correctIndex: 2,
    explanation:
      "The ladder angle is 1 in 4 — for every 4 metres up, the base is 1 metre out. This gives a safe 75° angle.",
    rememberText:
      "Ladder angle: 1 in 4 = 75°. 4 up, 1 out. Ladder must extend 1m above the landing point.",
  },
  {
    id: "m3q3",
    moduleId: 3,
    lessonId: 3,
    question: "Who can erect scaffolding on a construction site?",
    options: [
      "Any experienced worker",
      "The site manager",
      "Trained, competent CISRS scaffolders only",
      "Any worker with a CSCS card",
    ],
    correctIndex: 2,
    explanation:
      "Only CISRS-trained and competent scaffolders can erect, alter, or dismantle scaffolding.",
    rememberText:
      "Only CISRS-trained scaffolders can erect scaffolding. NEVER modify it yourself!",
  },
  {
    id: "m3q4",
    moduleId: 3,
    lessonId: 4,
    question: "What PPE is used as a LAST RESORT when working at height?",
    options: [
      "Hard hat",
      "Safety harness and lanyard",
      "High-visibility vest",
      "Steel-toe boots",
    ],
    correctIndex: 1,
    explanation:
      "A harness is the LAST RESORT for fall protection — only after avoiding and preventing falls.",
    rememberText:
      "Hierarchy: AVOID height → PREVENT falls (guardrails) → MINIMISE consequences (harness = LAST RESORT).",
  },
  {
    id: "m3q5",
    moduleId: 3,
    lessonId: 1,
    question: "What is the MOST effective control for working at height?",
    options: [
      "Wear a safety harness",
      "Install guardrails",
      "Eliminate the need for height work altogether",
      "Use safety nets",
    ],
    correctIndex: 2,
    explanation:
      "The FIRST and most effective step is to AVOID working at height altogether. Only then prevent and minimise.",
    rememberText:
      "AVOID is always FIRST. Don't jump to harnesses — eliminate the height work if possible.",
  },
  {
    id: "m3q6",
    moduleId: 3,
    lessonId: 4,
    question: "When working on a fragile roof, you should:",
    options: [
      "Walk along the strongest-looking areas",
      "Never step on it unless certain it is load-bearing — use crawling boards",
      "Only avoid the skylights",
      "Wear extra-grippy boots",
    ],
    correctIndex: 1,
    explanation:
      "NEVER assume a fragile roof is safe. Always use crawling boards to spread your weight.",
    rememberText:
      "Fragile roofs: NEVER assume safe. Use crawling boards. Asbestos cement looks solid but shatters.",
  },
  {
    id: "m3q7",
    moduleId: 3,
    lessonId: 2,
    question: "Three points of contact on a ladder means:",
    options: [
      "Three hands on the ladder",
      "Two hands and one foot, or two feet and one hand",
      "Both feet and both hands",
      "One hand and one foot",
    ],
    correctIndex: 1,
    explanation:
      "3 points of contact = 2 hands + 1 foot, or 2 feet + 1 hand on the ladder at all times.",
    rememberText:
      "3 points of contact ALWAYS. Never carry tools while climbing — use a tool belt.",
  },
  {
    id: "m3q8",
    moduleId: 3,
    lessonId: 3,
    question: "When must scaffolding be inspected?",
    options: [
      "Once a month",
      "Before each shift and after bad weather",
      "Only when it looks damaged",
      "Every Friday",
    ],
    correctIndex: 1,
    explanation:
      "Scaffolding must be inspected before EVERY shift and after bad weather (wind, rain, snow, frost).",
    rememberText:
      "Scaffold inspection: before EVERY shift + after bad weather + after any modification. Results must be RECORDED.",
  },
];

/* ─────────────── MODULE 4 QUESTIONS ─────────────── */

const m4Questions: QuizQuestion[] = [
  {
    id: "m4q1",
    moduleId: 4,
    lessonId: 1,
    question: "What does COSHH stand for?",
    options: [
      "Control of Substances Hazardous to Health",
      "Code of Safety and Health Hazards",
      "Committee on Site Health and Handling",
      "Control of Safety in Hazardous Habitats",
    ],
    correctIndex: 0,
    explanation:
      "COSHH = Control of Substances Hazardous to Health. It covers chemicals, dust, fumes, and biological agents.",
    rememberText:
      "COSHH = Control of Substances Hazardous to Health. Covers chemicals, dust, fumes, gases, biological agents.",
  },
  {
    id: "m4q2",
    moduleId: 4,
    lessonId: 2,
    question: "If you discover what you think might be asbestos, you should:",
    options: [
      "Remove it yourself carefully",
      "Cover it with plastic sheeting",
      "Stop work, leave the area, and report it immediately",
      "Continue working but wear a dust mask",
    ],
    correctIndex: 2,
    explanation:
      "STOP, leave the area, report it. Only licensed specialists can remove asbestos. NEVER disturb it.",
    rememberText:
      "Asbestos: STOP work → LEAVE the area → REPORT immediately. Never touch, disturb, or try to remove it yourself.",
  },
  {
    id: "m4q3",
    moduleId: 4,
    lessonId: 3,
    question:
      "Prolonged exposure to excessive noise on site can cause:",
    options: [
      "Skin irritation",
      "Permanent hearing loss",
      "Back pain",
      "Vision problems",
    ],
    correctIndex: 1,
    explanation:
      "Noise-induced hearing loss is permanent and irreversible. Ear protection is mandatory above 85dB.",
    rememberText:
      "Noise above 85dB = mandatory ear protection. Hearing loss is PERMANENT — it cannot be reversed.",
  },
];

/* ─────────────── MODULE 5 QUESTIONS ─────────────── */

const m5Questions: QuizQuestion[] = [
  {
    id: "m5q1",
    moduleId: 5,
    lessonId: 1,
    question: "What is an exclusion zone?",
    options: [
      "A rest area for workers",
      "An area where no unauthorised people are allowed due to plant/equipment danger",
      "A storage area for materials",
      "An area for smoking breaks",
    ],
    correctIndex: 1,
    explanation:
      "Exclusion zones keep people away from dangerous moving plant and equipment. They must be clearly marked.",
    rememberText:
      "Exclusion zone = NO ENTRY area around moving plant/equipment. Clearly marked with barriers and signs.",
  },
  {
    id: "m5q2",
    moduleId: 5,
    lessonId: 2,
    question:
      "What should you do if you hear the emergency stop alarm on site?",
    options: [
      "Carry on working",
      "Move to the assembly point immediately",
      "Go and investigate the cause",
      "Call the police",
    ],
    correctIndex: 1,
    explanation:
      "When you hear the emergency alarm, stop work and go directly to the assembly point.",
    rememberText:
      "Emergency alarm = STOP work → go to ASSEMBLY POINT immediately. Don't investigate, don't collect belongings.",
  },
];

/* ─────────────── ALL QUESTIONS MAP ─────────────── */

const ALL_QUESTIONS: QuizQuestion[] = [
  ...m1Questions,
  ...m2Questions,
  ...m3Questions,
  ...m4Questions,
  ...m5Questions,
];

export const getQuestionsForModule = (moduleId: number): QuizQuestion[] =>
  ALL_QUESTIONS.filter((q) => q.moduleId === moduleId);

export const getAllQuestions = (): QuizQuestion[] => ALL_QUESTIONS;

/* ─────────────── FLASHCARD GENERATION ─────────────── */

import { getLessonContent } from "./lessonContent";
import { MODULES } from "./courseData";

export const getFlashcardsForModule = (moduleId: number): Flashcard[] => {
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) return [];

  const cards: Flashcard[] = [];
  for (const lesson of mod.lessons) {
    const content = getLessonContent(moduleId, lesson.id);
    if (!content) continue;
    for (const block of content.content) {
      if (block.type === "remember") {
        cards.push({
          id: `fc-${moduleId}-${lesson.id}-r-${cards.length}`,
          moduleId,
          lessonId: lesson.id,
          front: `What should you remember about "${content.title}"?`,
          back: block.text,
          type: "remember",
        });
      }
      if (block.type === "testTip") {
        cards.push({
          id: `fc-${moduleId}-${lesson.id}-t-${cards.length}`,
          moduleId,
          lessonId: lesson.id,
          front: "Test Tip — what does the examiner look for here?",
          back: block.text,
          type: "testTip",
        });
      }
    }
  }
  return cards;
};

/* ─────────────── SPACED REPETITION HELPERS ─────────────── */

export interface QuestionPerformance {
  questionId: string;
  correctCount: number;
  wrongCount: number;
  lastSeen: number; // timestamp
}

/**
 * Weighted random selection: questions answered wrong appear 3x more often.
 */
export const pickNextDrillQuestion = (
  questions: QuizQuestion[],
  performance: Record<string, QuestionPerformance>
): QuizQuestion => {
  const weights = questions.map((q) => {
    const perf = performance[q.id];
    if (!perf) return 3; // unseen = high weight
    if (perf.wrongCount > perf.correctCount) return 3;
    if (perf.wrongCount > 0) return 2;
    return 1;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < questions.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return questions[i];
  }
  return questions[0];
};
