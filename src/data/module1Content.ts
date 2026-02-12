/**
 * Multilingual content types and Module 1 lesson data.
 * All text fields are I18nText objects for rendering in the user's selected language.
 */

/** Text in all supported languages. Falls back to `en` if translation missing. */
export interface I18nText {
  en: string;
  ro?: string;
  lt?: string;
  bg?: string;
  ar?: string;
  ti?: string;
  yo?: string;
  ig?: string;
  so?: string;
  am?: string;
}

export interface I18nKeyTerm {
  en: string;
  ro?: string;
  lt?: string;
  bg?: string;
  ar?: string;
  ti?: string;
  yo?: string;
  ig?: string;
  so?: string;
  am?: string;
}

export interface I18nParagraphBlock {
  type: "paragraph";
  text: I18nText;
}

export interface I18nBoldBlock {
  type: "bold";
  text: I18nText;
}

export interface I18nRememberBlock {
  type: "rememberThis";
  text: I18nText;
}

export interface I18nTestTipBlock {
  type: "testTip";
  text: I18nText;
}

export interface I18nImageBlock {
  type: "image";
  description: I18nText;
}

export interface I18nMiniCheckBlock {
  type: "miniCheck";
  question: I18nText;
  options: I18nText[];
  correct: number;
  feedback: I18nText;
  conceptSlug?: string;
}

export type I18nContentBlock =
  | I18nParagraphBlock
  | I18nBoldBlock
  | I18nRememberBlock
  | I18nTestTipBlock
  | I18nImageBlock
  | I18nMiniCheckBlock;

export interface I18nLessonContent {
  lessonId: string;
  title: I18nText;
  videoPlaceholder: string;
  keyTerms: I18nKeyTerm[];
  content: I18nContentBlock[];
  keySummary: I18nText[];
}

/** Helper: resolve I18nText to a string for the active language */
export const t = (text: I18nText, langCode: string): string => {
  const val = (text as unknown as Record<string, string>)[langCode];
  return val ?? text.en;
};

/* ══════════════════════════════════════════════
   LESSON 1.1 — Hazards and Risks
   ══════════════════════════════════════════════ */

const lesson1_1: I18nLessonContent = {
  lessonId: "1.1",
  title: {
    en: "Hazards and Risks: What is the Difference?",
    ro: "Pericole și Riscuri: Care este Diferența?",
  },
  videoPlaceholder: "Construction site overview with workers, cranes, and scaffolding",
  keyTerms: [
    { en: "Hazard", ro: "Pericol", lt: "Pavojus", bg: "Опасност", ar: "خطر", ti: "ሓደጋ", yo: "Ewu", ig: "Ihe ize ndụ", so: "Khatar", am: "አደጋ" },
    { en: "Risk", ro: "Risc", lt: "Rizika", bg: "Риск", ar: "مخاطرة", ti: "ስግኣት", yo: "Ewu-nla", ig: "Ihe egwu", so: "Halista", am: "ስጋት" },
    { en: "Control measure", ro: "Măsură de control", lt: "Kontrolės priemonė", bg: "Мярка за контрол", ar: "إجراء وقائي", ti: "ናይ ቁጽጽር ስጉምቲ", yo: "Ìgbésè ìṣàkóso", ig: "Usoro njikwa", so: "Tallaabo xakameyn", am: "የቁጥጥር እርምጃ" },
  ],
  content: [
    { type: "paragraph", text: { en: "Construction is one of the most dangerous industries in the UK. Every year workers are killed or seriously injured on building sites. Understanding the difference between hazards and risks is the first step to staying safe.", ro: "Construcțiile sunt una dintre cele mai periculoase industrii din Marea Britanie. În fiecare an, muncitori sunt uciși sau grav răniți pe șantiere. Înțelegerea diferenței dintre pericole și riscuri este primul pas spre siguranță." } },
    { type: "rememberThis", text: { en: "A HAZARD is anything with the POTENTIAL to cause harm — it is the SOURCE of danger. A RISK is the LIKELIHOOD that harm will actually occur, combined with how SEVERE it could be.", ro: "Un PERICOL este orice cu POTENȚIALUL de a cauza rău — este SURSA pericolului. Un RISC este PROBABILITATEA ca răul să se producă, combinată cu cât de GRAV ar putea fi." } },
    { type: "paragraph", text: { en: "Think of it this way: a wet floor is a HAZARD. The RISK is that someone will slip, fall, and break a bone. The hazard is the thing; the risk is what could happen.", ro: "Gândiți-vă astfel: o podea udă este un PERICOL. RISCUL este că cineva va aluneca, va cădea și își va rupe un os. Pericolul este lucrul; riscul este ce s-ar putea întâmpla." } },
    { type: "testTip", text: { en: "The test WILL ask you the difference between a hazard and a risk. Remember this formula: HAZARD = the THING that can cause harm. RISK = the CHANCE of harm + how BAD it could be.", ro: "Testul VĂ VA ÎNTREBA diferența dintre pericol și risc. Rețineți această formulă: PERICOL = LUCRUL care poate cauza rău. RISC = ȘANSA de rău + cât de RĂU ar putea fi." } },
    { type: "miniCheck", conceptSlug: "hazard_vs_risk_difference", question: { en: "A wet floor is a ___?", ro: "O podea udă este un ___?" }, options: [{ en: "Hazard", ro: "Pericol" }, { en: "Risk", ro: "Risc" }, { en: "Method Statement", ro: "Declarație de metodă" }, { en: "Near Miss", ro: "Incident evitat" }], correct: 0, feedback: { en: "Correct! The wet floor is the HAZARD (the source of danger). The risk is someone slipping and breaking a bone.", ro: "Corect! Podeaua udă este PERICOLUL (sursa de pericol). Riscul este ca cineva să alunece și să își rupă un os." } },
    { type: "bold", text: { en: "Five common hazards on a construction site:", ro: "Cinci pericole comune pe un șantier:" } },
    { type: "paragraph", text: { en: "1. Working at height — falls from ladders, scaffolding, or roofs. 2. Moving vehicles — being struck by lorries, excavators, or dumpers. 3. Electricity — contact with underground or overhead cables. 4. Manual handling — lifting heavy materials incorrectly. 5. Falling objects — tools or materials dropped from height.", ro: "1. Lucrul la înălțime — căderi de pe scări, schele sau acoperișuri. 2. Vehicule în mișcare — lovirea de camioane, excavatoare sau basculante. 3. Electricitate — contactul cu cabluri subterane sau aeriene. 4. Manipulare manuală — ridicarea incorectă a materialelor grele. 5. Obiecte căzătoare — unelte sau materiale scăpate de la înălțime." } },
    { type: "rememberThis", text: { en: "5 common site hazards: Working at HEIGHT, moving VEHICLES, ELECTRICITY, manual HANDLING, falling OBJECTS. Memory trick: H-V-E-H-O = 'Have Very Energetic Helpers Often'.", ro: "5 pericole comune pe șantier: Lucrul la ÎNĂLȚIME, VEHICULE în mișcare, ELECTRICITATE, MANIPULARE manuală, OBIECTE căzătoare." } },
    { type: "miniCheck", conceptSlug: "hazard_vs_risk_difference", question: { en: "Which of these is a RISK, not a hazard?", ro: "Care dintre acestea este un RISC, nu un pericol?" }, options: [{ en: "An unguarded hole in the floor", ro: "O gaură neprotejată în podea" }, { en: "A worker falling through the hole and breaking their leg", ro: "Un muncitor care cade prin gaură și își rupe piciorul" }, { en: "A bottle of chemicals without a label", ro: "O sticlă de chimicale fără etichetă" }, { en: "Exposed electrical wires", ro: "Fire electrice expuse" }], correct: 1, feedback: { en: "Correct! The hole is the hazard. A worker falling through and breaking their leg is the RISK — the likelihood and severity of harm.", ro: "Corect! Gaura este pericolul. Un muncitor care cade și își rupe piciorul este RISCUL — probabilitatea și gravitatea rănilor." } },
    { type: "paragraph", text: { en: "To manage risks, we use CONTROL MEASURES. These are the steps we take to reduce the risk of harm from a hazard. For example: putting a barrier around a hole (control measure) reduces the risk of someone falling in.", ro: "Pentru a gestiona riscurile, folosim MĂSURI DE CONTROL. Acestea sunt pașii pe care îi facem pentru a reduce riscul de rău cauzat de un pericol. De exemplu: punerea unei bariere în jurul unei găuri (măsură de control) reduce riscul ca cineva să cadă." } },
    { type: "testTip", text: { en: "Examiners love asking: 'What control measure would reduce this risk?' Always think: what ACTION removes or reduces the danger? Barriers, PPE, training, signs, safe systems of work — these are all control measures.", ro: "Examinatorii adoră să întrebe: 'Ce măsură de control ar reduce acest risc?' Gândiți-vă mereu: ce ACȚIUNE elimină sau reduce pericolul? Bariere, EIP, instruire, semne, sisteme sigure de lucru — toate sunt măsuri de control." } },
    { type: "miniCheck", conceptSlug: "hierarchy_of_control", question: { en: "Putting a guard rail around a roof edge is an example of a:", ro: "Montarea unui parapet în jurul marginii acoperișului este un exemplu de:" }, options: [{ en: "Hazard", ro: "Pericol" }, { en: "Risk", ro: "Risc" }, { en: "Control measure", ro: "Măsură de control" }, { en: "Near miss", ro: "Incident evitat" }], correct: 2, feedback: { en: "Correct! A guard rail is a CONTROL MEASURE — it reduces the risk of falling from height.", ro: "Corect! Un parapet este o MĂSURĂ DE CONTROL — reduce riscul de cădere de la înălțime." } },
  ],
  keySummary: [
    { en: "HAZARD = source of harm (the thing). RISK = likelihood + severity of harm.", ro: "PERICOL = sursa de rău (lucrul). RISC = probabilitate + gravitate." },
    { en: "5 common site hazards: Height, Vehicles, Electricity, Handling, Objects.", ro: "5 pericole pe șantier: Înălțime, Vehicule, Electricitate, Manipulare, Obiecte." },
    { en: "Control measures REDUCE the risk from a hazard (barriers, PPE, training, signs).", ro: "Măsurile de control REDUC riscul unui pericol (bariere, EIP, instruire, semne)." },
    { en: "Everyone on site is responsible for identifying hazards and reducing risks.", ro: "Toți de pe șantier sunt responsabili pentru identificarea pericolelor și reducerea riscurilor." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 1.2 — Risk Assessments
   ══════════════════════════════════════════════ */

const lesson1_2: I18nLessonContent = {
  lessonId: "1.2",
  title: {
    en: "Risk Assessments: Keeping Everyone Safe",
    ro: "Evaluări de Risc: Siguranța Tuturor",
  },
  videoPlaceholder: "Worker reviewing a risk assessment document on a clipboard",
  keyTerms: [
    { en: "Risk Assessment", ro: "Evaluare de risc", lt: "Rizikos vertinimas", bg: "Оценка на риска", ar: "تقييم المخاطر", ti: "ገምጋም ስግኣት", yo: "Ìgbéléwọ̀n ewu", ig: "Nyocha ihe egwu", so: "Qiimaynta khatarta", am: "የስጋት ግምገማ" },
    { en: "Competent person", ro: "Persoană competentă", lt: "Kompetentingas asmuo", bg: "Компетентно лице", ar: "شخص مؤهل", ti: "ብቑዕ ሰብ", yo: "Ènìyàn tó múra", ig: "Onye nwere ike", so: "Qof xirfad leh", am: "ብቁ ሰው" },
    { en: "Reasonably practicable", ro: "Rezonabil practicabil", lt: "Pagrįstai įmanoma", bg: "Разумно осъществимо", ar: "معقول عملياً", ti: "ብግቡእ ዝከኣል", yo: "Ní ìwọ̀ntún-wọ̀nsì", ig: "Nke enwere ike ime", so: "Macquul ahaan", am: "በምክንያታዊ ተግባራዊ" },
  ],
  content: [
    { type: "paragraph", text: { en: "A risk assessment is a careful examination of what could cause harm on site, so you can decide whether enough precautions have been taken. It is a LEGAL REQUIREMENT — not optional.", ro: "O evaluare de risc este o examinare atentă a ceea ce ar putea cauza rău pe șantier, astfel încât să puteți decide dacă au fost luate suficiente precauții. Este o CERINȚĂ LEGALĂ — nu opțională." } },
    { type: "rememberThis", text: { en: "A risk assessment has 5 STEPS: 1) Identify the hazards. 2) Decide who might be harmed and how. 3) Evaluate the risks and decide on precautions. 4) Record findings and implement them. 5) Review and update regularly.", ro: "O evaluare de risc are 5 PAȘI: 1) Identificați pericolele. 2) Decideți cine ar putea fi rănit și cum. 3) Evaluați riscurile și decideți precauțiile. 4) Înregistrați constatările și implementați-le. 5) Revizuiți și actualizați regulat." } },
    { type: "testTip", text: { en: "The test often asks: 'What are the 5 steps of a risk assessment?' or 'What is the FIRST step?' The first step is ALWAYS: Identify the hazards.", ro: "Testul întreabă adesea: 'Care sunt cei 5 pași ai unei evaluări de risc?' sau 'Care este PRIMUL pas?' Primul pas este ÎNTOTDEAUNA: Identificați pericolele." } },
    { type: "miniCheck", conceptSlug: "five_steps_risk_assessment", question: { en: "What is the FIRST step of a risk assessment?", ro: "Care este PRIMUL pas al unei evaluări de risc?" }, options: [{ en: "Write a method statement", ro: "Scrieți o declarație de metodă" }, { en: "Identify the hazards", ro: "Identificați pericolele" }, { en: "Put up safety signs", ro: "Montați semne de siguranță" }, { en: "Buy PPE for workers", ro: "Cumpărați EIP pentru muncitori" }], correct: 1, feedback: { en: "Correct! Step 1 is ALWAYS to identify the hazards. You can't manage risks if you don't know what the hazards are.", ro: "Corect! Pasul 1 este ÎNTOTDEAUNA identificarea pericolelor. Nu puteți gestiona riscuri fără a cunoaște pericolele." } },
    { type: "paragraph", text: { en: "A risk assessment must be carried out by a COMPETENT PERSON — someone who has the training, knowledge, and experience to identify hazards and assess risks properly.", ro: "O evaluare de risc trebuie efectuată de o PERSOANĂ COMPETENTĂ — cineva care are instruirea, cunoștințele și experiența necesare pentru a identifica pericolele și a evalua corect riscurile." } },
    { type: "paragraph", text: { en: "Risk assessments must be REVIEWED regularly, especially when: the work activity changes, new equipment is introduced, there has been an accident, or a near miss has occurred.", ro: "Evaluările de risc trebuie REVIZUITE regulat, în special când: activitatea de lucru se schimbă, se introduce echipament nou, a avut loc un accident sau un incident evitat la limită." } },
    { type: "rememberThis", text: { en: "Risk assessments must be reviewed when: work CHANGES, new EQUIPMENT arrives, after an ACCIDENT, or after a NEAR MISS. Memory trick: C-E-A-N = 'Check Every Assessment Now'.", ro: "Evaluările de risc trebuie revizuite când: se SCHIMBĂ lucrarea, ajunge ECHIPAMENT nou, după un ACCIDENT sau după un INCIDENT evitat." } },
    { type: "miniCheck", conceptSlug: "risk_assessment_definition", question: { en: "A risk assessment should be reviewed when:", ro: "O evaluare de risc ar trebui revizuită când:" }, options: [{ en: "Only at the start of each year", ro: "Doar la începutul fiecărui an" }, { en: "When the work activity changes or after an accident", ro: "Când se schimbă activitatea sau după un accident" }, { en: "Only when the HSE asks for it", ro: "Doar când HSE o solicită" }, { en: "Never — once written it's permanent", ro: "Niciodată — odată scrisă este permanentă" }], correct: 1, feedback: { en: "Correct! Risk assessments are LIVING documents — they must be updated when conditions change.", ro: "Corect! Evaluările de risc sunt documente VIDE — trebuie actualizate când condițiile se schimbă." } },
    { type: "paragraph", text: { en: "The phrase 'so far as is reasonably practicable' means you must balance the risk against the cost, time, and effort of removing it. If the risk is high, you must act even if it costs money.", ro: "Expresia 'în măsura rezonabil practicabilă' înseamnă că trebuie să echilibrați riscul cu costul, timpul și efortul de a-l elimina. Dacă riscul este mare, trebuie să acționați chiar dacă costă bani." } },
    { type: "testTip", text: { en: "'Reasonably practicable' is a favourite test phrase. It means: if a risk is serious, you MUST do something about it — cost is NOT an excuse for ignoring a significant risk.", ro: "'Rezonabil practicabil' este o expresie preferată la test. Înseamnă: dacă un risc este serios, TREBUIE să faceți ceva — costul NU este o scuză pentru a ignora un risc semnificativ." } },
  ],
  keySummary: [
    { en: "Risk assessment = 5 steps: Identify → Who's harmed → Evaluate → Record → Review.", ro: "Evaluare de risc = 5 pași: Identificare → Cine e afectat → Evaluare → Înregistrare → Revizuire." },
    { en: "First step is ALWAYS: Identify the hazards.", ro: "Primul pas este ÎNTOTDEAUNA: Identificați pericolele." },
    { en: "Must be done by a COMPETENT person with training and experience.", ro: "Trebuie făcută de o PERSOANĂ COMPETENTĂ cu instruire și experiență." },
    { en: "Review when: work Changes, new Equipment, after Accident, after Near miss (CEAN).", ro: "Revizuire când: se Schimbă lucrarea, Echipament nou, după Accident, după iNcident evitat." },
    { en: "'Reasonably practicable' — cost is NOT an excuse for ignoring serious risks.", ro: "'Rezonabil practicabil' — costul NU este o scuză pentru a ignora riscuri serioase." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 1.3 — Method Statements
   ══════════════════════════════════════════════ */

const lesson1_3: I18nLessonContent = {
  lessonId: "1.3",
  title: { en: "Method Statements: The Safe Way to Work", ro: "Declarații de Metodă: Modalitatea Sigură de Lucru" },
  videoPlaceholder: "Worker reading a method statement before starting a job",
  keyTerms: [
    { en: "Method Statement", ro: "Declarație de metodă", lt: "Darbo metodų aprašas", bg: "Методична инструкция", ar: "بيان الطريقة", ti: "መግለጺ ኣገባብ", yo: "Ọ̀nà ìṣe", ig: "Nkọwa usoro", so: "Bayaanka habka", am: "የዘዴ መግለጫ" },
    { en: "RAMS", ro: "RAMS", lt: "RAMS", bg: "RAMS", ar: "RAMS", ti: "RAMS", yo: "RAMS", ig: "RAMS", so: "RAMS", am: "RAMS" },
    { en: "Safe system of work", ro: "Sistem sigur de lucru", lt: "Saugi darbo sistema", bg: "Безопасна система на работа", ar: "نظام عمل آمن", ti: "ውሑስ ስርዓት ስራሕ", yo: "Ètò iṣẹ́ ààbò", ig: "Usoro ọrụ nche", so: "Nidaamka shaqada badbaadada", am: "ደህንነቱ የተጠበቀ የሥራ ስርዓት" },
  ],
  content: [
    { type: "paragraph", text: { en: "A method statement is a document that describes HOW a job will be done SAFELY. It provides a step-by-step guide, listing the hazards and the control measures for each step.", ro: "O declarație de metodă este un document care descrie CUM se va face o lucrare în SIGURANȚĂ. Oferă un ghid pas cu pas, listând pericolele și măsurile de control pentru fiecare pas." } },
    { type: "rememberThis", text: { en: "RAMS = Risk Assessment + Method Statement. They almost always go together. The risk assessment identifies the hazards; the method statement explains how to do the job safely.", ro: "RAMS = Evaluare de Risc + Declarație de Metodă. Aproape întotdeauna merg împreună. Evaluarea de risc identifică pericolele; declarația de metodă explică cum să faceți treaba în siguranță." } },
    { type: "testTip", text: { en: "If the test asks 'What is a method statement?', the answer is: a step-by-step guide to carrying out a task safely. It is NOT a risk assessment — it WORKS WITH the risk assessment.", ro: "Dacă testul întreabă 'Ce este o declarație de metodă?', răspunsul este: un ghid pas cu pas pentru efectuarea unei sarcini în siguranță. NU este o evaluare de risc — FUNCȚIONEAZĂ CU evaluarea de risc." } },
    { type: "miniCheck", conceptSlug: "method_statement_purpose", question: { en: "What does RAMS stand for?", ro: "Ce înseamnă RAMS?" }, options: [{ en: "Risk Assessment and Method Statement", ro: "Evaluare de Risc și Declarație de Metodă" }, { en: "Report All Major Safety issues", ro: "Raportați Toate Problemele Majore de Siguranță" }, { en: "Reduce All Manual Strain", ro: "Reduceți Toată Solicitarea Manuală" }, { en: "Register All Materials on Site", ro: "Înregistrați Toate Materialele pe Șantier" }], correct: 0, feedback: { en: "Correct! RAMS = Risk Assessment and Method Statement. They work together to keep you safe.", ro: "Corect! RAMS = Evaluare de Risc și Declarație de Metodă. Funcționează împreună pentru siguranță." } },
    { type: "paragraph", text: { en: "A method statement typically includes: the job to be done, the sequence of steps, the hazards at each step, the control measures, the PPE required, and the people responsible.", ro: "O declarație de metodă include de obicei: lucrarea de făcut, secvența pașilor, pericolele la fiecare pas, măsurile de control, EIP-ul necesar și persoanele responsabile." } },
    { type: "paragraph", text: { en: "You MUST read and understand the method statement BEFORE you start work. If you don't understand it, ASK. Never start a job without knowing the safe way to do it.", ro: "TREBUIE să citiți și să înțelegeți declarația de metodă ÎNAINTE de a începe lucrul. Dacă nu o înțelegeți, ÎNTREBAȚI. Nu începeți niciodată o lucrare fără a cunoaște modalitatea sigură." } },
    { type: "rememberThis", text: { en: "ALWAYS read the method statement BEFORE starting work. If anything changes on site that makes the method statement wrong, STOP work and report it.", ro: "ÎNTOTDEAUNA citiți declarația de metodă ÎNAINTE de a începe lucrul. Dacă se schimbă ceva pe șantier care face declarația greșită, OPRIȚI lucrul și raportați." } },
    { type: "miniCheck", conceptSlug: "method_statement_purpose", question: { en: "When should you read a method statement?", ro: "Când ar trebui să citiți o declarație de metodă?" }, options: [{ en: "After the job is finished", ro: "După ce lucrarea este terminată" }, { en: "Only if there's an accident", ro: "Doar dacă există un accident" }, { en: "Before you start the work", ro: "Înainte de a începe lucrul" }, { en: "Only the supervisor reads it", ro: "Doar supervizorul o citește" }], correct: 2, feedback: { en: "Correct! ALWAYS read the method statement BEFORE starting work. Everyone involved must understand it.", ro: "Corect! ÎNTOTDEAUNA citiți declarația de metodă ÎNAINTE de a începe lucrul. Toți cei implicați trebuie să o înțeleagă." } },
  ],
  keySummary: [
    { en: "Method statement = step-by-step guide to doing a job SAFELY.", ro: "Declarație de metodă = ghid pas cu pas pentru a face o lucrare ÎN SIGURANȚĂ." },
    { en: "RAMS = Risk Assessment + Method Statement — they work TOGETHER.", ro: "RAMS = Evaluare de Risc + Declarație de Metodă — funcționează ÎMPREUNĂ." },
    { en: "ALWAYS read the method statement BEFORE starting work.", ro: "ÎNTOTDEAUNA citiți declarația de metodă ÎNAINTE de a începe lucrul." },
    { en: "If conditions change, STOP and report — the method statement may need updating.", ro: "Dacă condițiile se schimbă, OPRIȚI și raportați — declarația poate necesita actualizare." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 1.4 — Accidents, Near Misses, Incident Reporting
   ══════════════════════════════════════════════ */

const lesson1_4: I18nLessonContent = {
  lessonId: "1.4",
  title: { en: "Accidents, Near Misses, and Incident Reporting", ro: "Accidente, Incidente Evitate și Raportarea Incidentelor" },
  videoPlaceholder: "Worker filling out an accident report form at a site office",
  keyTerms: [
    { en: "Near miss", ro: "Incident evitat", lt: "Beveik įvykęs incidentas", bg: "Инцидент без последици", ar: "حادث وشيك", ti: "ዳርጋ ሓደጋ", yo: "Ó fẹ́rẹ̀ẹ́ ṣẹlẹ̀", ig: "Ihe fọrọ nke nta", so: "Shil-shil", am: "ሊሆን ተቃርቦ የነበረ አደጋ" },
    { en: "RIDDOR", ro: "RIDDOR", lt: "RIDDOR", bg: "RIDDOR", ar: "RIDDOR", ti: "RIDDOR", yo: "RIDDOR", ig: "RIDDOR", so: "RIDDOR", am: "RIDDOR" },
    { en: "Accident book", ro: "Registru de accidente", lt: "Nelaimingų atsitikimų knyga", bg: "Книга за злополуки", ar: "سجل الحوادث", ti: "መጽሓፍ ሓደጋ", yo: "Ìwé ìjàǹbá", ig: "Akwụkwọ ihe mberede", so: "Buugga shilalka", am: "የአደጋ መዝገብ" },
  ],
  content: [
    { type: "paragraph", text: { en: "ALL accidents, incidents, and near misses must be reported — no matter how small. Reporting helps prevent the SAME thing happening again to someone else.", ro: "TOATE accidentele, incidentele și incidentele evitate trebuie raportate — indiferent cât de mici. Raportarea ajută la prevenirea repetării aceluiași lucru." } },
    { type: "rememberThis", text: { en: "A NEAR MISS is an event that COULD have caused injury but didn't. Near misses are just as important to report as actual accidents — they are warnings of what COULD happen next time.", ro: "Un INCIDENT EVITAT este un eveniment care AR FI PUTUT cauza rănire, dar nu a făcut-o. Incidentele evitate sunt la fel de importante de raportat ca accidentele reale — sunt avertismente." } },
    { type: "testTip", text: { en: "The test often asks: 'Why should you report a near miss?' Answer: Because it helps prevent a real accident in the future. Near misses show where hazards exist that haven't been controlled.", ro: "Testul întreabă adesea: 'De ce ar trebui să raportați un incident evitat?' Răspuns: Pentru că ajută la prevenirea unui accident real în viitor." } },
    { type: "miniCheck", conceptSlug: "near_miss_definition", question: { en: "A scaffold pole falls and just misses a worker. Nobody is hurt. What should happen?", ro: "O bară de schelă cade și trece pe lângă un muncitor. Nimeni nu este rănit. Ce ar trebui să se întâmple?" }, options: [{ en: "Nothing — nobody was hurt", ro: "Nimic — nimeni nu a fost rănit" }, { en: "Report it as a near miss", ro: "Raportați-l ca incident evitat" }, { en: "Only tell a friend", ro: "Spuneți doar unui prieten" }, { en: "Move the pole and carry on", ro: "Mutați bara și continuați" }], correct: 1, feedback: { en: "Correct! This is a NEAR MISS and MUST be reported. Next time it might hit someone.", ro: "Corect! Acesta este un INCIDENT EVITAT și TREBUIE raportat. Data viitoare ar putea lovi pe cineva." } },
    { type: "paragraph", text: { en: "RIDDOR stands for Reporting of Injuries, Diseases and Dangerous Occurrences Regulations. Under RIDDOR, your employer must report serious injuries, deaths, and dangerous occurrences to the HSE.", ro: "RIDDOR înseamnă Regulamentele pentru Raportarea Rănilor, Bolilor și Evenimentelor Periculoase. Conform RIDDOR, angajatorul dvs. trebuie să raporteze rănirile grave, decesele și evenimentele periculoase la HSE." } },
    { type: "rememberThis", text: { en: "RIDDOR reportable events include: DEATH, major injuries (fractures, amputations), injuries causing MORE THAN 7 DAYS off work, dangerous occurrences, and certain occupational diseases.", ro: "Evenimentele raportabile RIDDOR includ: DECES, răniri majore (fracturi, amputări), răniri care cauzează MAI MULT DE 7 ZILE de absență, evenimente periculoase și anumite boli profesionale." } },
    { type: "miniCheck", conceptSlug: "accident_reporting_basics", question: { en: "Under RIDDOR, an injury must be reported if a worker is off work for more than:", ro: "Conform RIDDOR, o rănire trebuie raportată dacă un muncitor lipsește de la muncă mai mult de:" }, options: [{ en: "1 day", ro: "1 zi" }, { en: "3 days", ro: "3 zile" }, { en: "7 days", ro: "7 zile" }, { en: "14 days", ro: "14 zile" }], correct: 2, feedback: { en: "Correct! Under RIDDOR, injuries that keep a worker off for MORE THAN 7 DAYS must be reported to the HSE.", ro: "Corect! Conform RIDDOR, rănirile care țin un muncitor acasă MAI MULT DE 7 ZILE trebuie raportate la HSE." } },
    { type: "paragraph", text: { en: "Every site must have an ACCIDENT BOOK where all injuries, however minor, are recorded. This provides a legal record and helps identify patterns of incidents.", ro: "Fiecare șantier trebuie să aibă un REGISTRU DE ACCIDENTE unde toate rănirile, oricât de mici, sunt înregistrate. Acesta oferă o înregistrare legală și ajută la identificarea tiparelor de incidente." } },
  ],
  keySummary: [
    { en: "Report ALL accidents, incidents, and near misses — no matter how small.", ro: "Raportați TOATE accidentele, incidentele și incidentele evitate — indiferent cât de mici." },
    { en: "Near miss = COULD have caused harm but didn't. Report it to prevent future accidents.", ro: "Incident evitat = AR FI PUTUT cauza rău dar nu a făcut-o. Raportați pentru a preveni accidente viitoare." },
    { en: "RIDDOR: report deaths, major injuries, 7+ days off work, dangerous occurrences.", ro: "RIDDOR: raportați decese, răniri majore, 7+ zile de absență, evenimente periculoase." },
    { en: "Every site must have an accident book for recording all injuries.", ro: "Fiecare șantier trebuie să aibă un registru de accidente." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 1.5 — Safety Signs
   ══════════════════════════════════════════════ */

const lesson1_5: I18nLessonContent = {
  lessonId: "1.5",
  title: { en: "Safety Signs: Know What They Mean", ro: "Semne de Siguranță: Știți Ce Înseamnă" },
  videoPlaceholder: "Display board showing the 4 types of safety signs on a construction site",
  keyTerms: [
    { en: "Prohibition sign", ro: "Semn de interdicție", lt: "Draudžiamasis ženklas", bg: "Забранителен знак", ar: "علامة منع", ti: "ናይ ክልከላ ምልክት", yo: "Àmì ìdènà", ig: "Akara mgbochi", so: "Calaamadda mamnuucidda", am: "የክልከላ ምልክት" },
    { en: "Warning sign", ro: "Semn de avertizare", lt: "Įspėjamasis ženklas", bg: "Предупредителен знак", ar: "علامة تحذير", ti: "ናይ መጠንቀቕታ ምልክት", yo: "Àmì ìkìlọ̀", ig: "Akara ịdọ aka ná ntị", so: "Calaamadda digniin", am: "የማስጠንቀቂያ ምልክት" },
    { en: "Mandatory sign", ro: "Semn obligatoriu", lt: "Privalomasis ženklas", bg: "Задължителен знак", ar: "علامة إلزامية", ti: "ናይ ግዴታ ምልክት", yo: "Àmì àṣẹ", ig: "Akara iwu", so: "Calaamadda waajibka", am: "የግዴታ ምልክት" },
  ],
  content: [
    { type: "paragraph", text: { en: "Construction sites use FOUR types of safety signs. Each has a specific colour and shape. You MUST know what each colour means — this is always tested.", ro: "Șantierele de construcții folosesc PATRU tipuri de semne de siguranță. Fiecare are o culoare și formă specifică. TREBUIE să știți ce înseamnă fiecare culoare — aceasta este întotdeauna testată." } },
    { type: "rememberThis", text: { en: "The 4 sign types: 🔴 RED circle = PROHIBITION (do NOT do this). ⚠️ YELLOW triangle = WARNING (danger ahead). 🔵 BLUE circle = MANDATORY (you MUST do this). 🟢 GREEN rectangle = SAFE CONDITION (exit, first aid).", ro: "Cele 4 tipuri: 🔴 Cerc ROȘU = INTERDICȚIE (NU faceți asta). ⚠️ Triunghi GALBEN = AVERTIZARE (pericol). 🔵 Cerc ALBASTRU = OBLIGATORIU (TREBUIE să faceți asta). 🟢 Dreptunghi VERDE = CONDIȚIE SIGURĂ (ieșire, prim ajutor)." } },
    { type: "testTip", text: { en: "Examiners will show you a sign and ask what it means. Focus on COLOUR + SHAPE: Red circle = stop/don't. Yellow triangle = danger. Blue circle = must do. Green rectangle = safe/go.", ro: "Examinatorii vă vor arăta un semn și vor întreba ce înseamnă. Concentrați-vă pe CULOARE + FORMĂ: Cerc roșu = stop/nu. Triunghi galben = pericol. Cerc albastru = trebuie. Dreptunghi verde = sigur/mergi." } },
    { type: "miniCheck", conceptSlug: "hierarchy_of_control", question: { en: "A round BLUE sign with a white symbol means:", ro: "Un semn rotund ALBASTRU cu un simbol alb înseamnă:" }, options: [{ en: "You must NOT do something", ro: "NU trebuie să faceți ceva" }, { en: "There is danger ahead", ro: "Este pericol în față" }, { en: "You MUST do what the sign shows", ro: "TREBUIE să faceți ce arată semnul" }, { en: "This is a safe exit", ro: "Aceasta este o ieșire sigură" }], correct: 2, feedback: { en: "Correct! Blue circle = MANDATORY. You MUST do what the sign shows (e.g., wear hard hat, wear hi-vis).", ro: "Corect! Cerc albastru = OBLIGATORIU. TREBUIE să faceți ce arată semnul (ex: purtați cască, purtați vestă reflectorizantă)." } },
    { type: "paragraph", text: { en: "RED PROHIBITION signs tell you what you must NOT do. They have a red circle with a red diagonal line through a black symbol. Examples: No smoking, No entry, No mobile phones.", ro: "Semnele ROȘII de INTERDICȚIE vă spun ce NU trebuie să faceți. Au un cerc roșu cu o linie diagonală roșie prin un simbol negru. Exemple: Fumatul interzis, Intrarea interzisă, Telefoane mobile interzise." } },
    { type: "paragraph", text: { en: "YELLOW WARNING signs alert you to hazards. They are triangular with a black symbol on a yellow background. Examples: Danger — electricity, Caution — slippery floor, Warning — overhead loads.", ro: "Semnele GALBENE de AVERTIZARE vă alertează despre pericole. Sunt triunghiulare cu un simbol negru pe fundal galben. Exemple: Pericol — electricitate, Atenție — podea alunecoasă, Avertisment — sarcini deasupra." } },
    { type: "miniCheck", conceptSlug: "hierarchy_of_control", question: { en: "A yellow triangle sign means:", ro: "Un semn triunghi galben înseamnă:" }, options: [{ en: "You must do something", ro: "Trebuie să faceți ceva" }, { en: "Safe condition — exit this way", ro: "Condiție sigură — ieșiți pe aici" }, { en: "Warning — there is a hazard", ro: "Avertizare — există un pericol" }, { en: "You must not do something", ro: "Nu trebuie să faceți ceva" }], correct: 2, feedback: { en: "Correct! Yellow triangle = WARNING. It tells you there is a hazard ahead — be alert.", ro: "Corect! Triunghi galben = AVERTIZARE. Vă spune că există un pericol în față — fiți atenți." } },
    { type: "rememberThis", text: { en: "Memory trick for sign colours: RED = STOP (prohibition). YELLOW = SLOW DOWN (warning). BLUE = DO IT (mandatory). GREEN = GO (safe). Think traffic lights + blue.", ro: "Trucul de memorie pentru culorile semnelor: ROȘU = STOP (interdicție). GALBEN = ÎNCETINIȚI (avertizare). ALBASTRU = FACEȚI (obligatoriu). VERDE = MERGI (sigur). Gândiți-vă la semafoare + albastru." } },
  ],
  keySummary: [
    { en: "RED circle = PROHIBITION (do NOT do this).", ro: "Cerc ROȘU = INTERDICȚIE (NU faceți asta)." },
    { en: "YELLOW triangle = WARNING (hazard/danger ahead).", ro: "Triunghi GALBEN = AVERTIZARE (pericol)." },
    { en: "BLUE circle = MANDATORY (you MUST do this).", ro: "Cerc ALBASTRU = OBLIGATORIU (TREBUIE)." },
    { en: "GREEN rectangle = SAFE CONDITION (exit, first aid).", ro: "Dreptunghi VERDE = CONDIȚIE SIGURĂ (ieșire, prim ajutor)." },
    { en: "Traffic lights + blue: Red=Stop, Yellow=Slow, Blue=Do, Green=Go.", ro: "Semafoare + albastru: Roșu=Stop, Galben=Încet, Albastru=Fă, Verde=Mergi." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 1.6 — Dynamic Risk Assessments
   ══════════════════════════════════════════════ */

const lesson1_6: I18nLessonContent = {
  lessonId: "1.6",
  title: { en: "Dynamic Risk Assessments", ro: "Evaluări Dinamice de Risc" },
  videoPlaceholder: "Worker assessing changing conditions on a construction site in real-time",
  keyTerms: [
    { en: "Dynamic risk assessment", ro: "Evaluare dinamică de risc", lt: "Dinaminė rizikos vertinimas", bg: "Динамична оценка на риска", ar: "تقييم المخاطر الديناميكي", ti: "ተንቀሳቓሲ ገምጋም ስግኣት", yo: "Ìgbéléwọ̀n ewu aládàámọ̀", ig: "Nyocha ihe egwu mgbanwe", so: "Qiimaynta khatarta firfircoon", am: "ተለዋዋጭ የስጋት ግምገማ" },
    { en: "Stop work authority", ro: "Autoritate de oprire a lucrului", lt: "Teisė sustabdyti darbus", bg: "Правомощие за спиране на работа", ar: "صلاحية إيقاف العمل", ti: "ስልጣን ደው ምባል ስራሕ", yo: "Àṣẹ dáwọ́ iṣẹ́ dúró", ig: "Ikike ịkwụsị ọrụ", so: "Awood joojinta shaqada", am: "ሥራ የማቆም ሥልጣን" },
  ],
  content: [
    { type: "paragraph", text: { en: "A dynamic risk assessment is an ONGOING mental process of assessing risks in real time as conditions change on site. Unlike a written risk assessment, it happens continuously in your head.", ro: "O evaluare dinamică de risc este un proces mental CONTINUU de evaluare a riscurilor în timp real pe măsură ce condițiile se schimbă pe șantier. Spre deosebire de o evaluare scrisă, aceasta se întâmplă continuu în mintea dvs." } },
    { type: "rememberThis", text: { en: "Dynamic risk assessment = CONTINUOUS mental check. Ask yourself: 'Has anything CHANGED that makes this job more dangerous? Do I need to STOP and get help?'", ro: "Evaluare dinamică de risc = verificare mentală CONTINUĂ. Întrebați-vă: 'S-a SCHIMBAT ceva care face această lucrare mai periculoasă? Trebuie să mă OPRESC și să cer ajutor?'" } },
    { type: "testTip", text: { en: "The test may ask: 'What should you do if conditions change while you are working?' Answer: STOP, reassess the risks, and report to your supervisor if needed. Do NOT continue with the original plan if conditions have changed.", ro: "Testul poate întreba: 'Ce ar trebui să faceți dacă condițiile se schimbă în timp ce lucrați?' Răspuns: OPRIȚI-VĂ, reevaluați riscurile și raportați supervizorului dacă este necesar." } },
    { type: "miniCheck", conceptSlug: "dynamic_risk_assessment", question: { en: "What should you do if the weather suddenly gets very windy while you are working at height?", ro: "Ce ar trebui să faceți dacă vremea devine brusc foarte vântoasă în timp ce lucrați la înălțime?" }, options: [{ en: "Carry on but hold on tighter", ro: "Continuați, dar țineți-vă mai strâns" }, { en: "Stop work and reassess the risk", ro: "Opriți lucrul și reevaluați riscul" }, { en: "Wait 10 minutes and see if it calms down", ro: "Așteptați 10 minute să vedeți dacă se calmează" }, { en: "Only stop if the supervisor tells you", ro: "Opriți doar dacă supervizorul vă spune" }], correct: 1, feedback: { en: "Correct! Changed conditions = dynamic risk assessment. Strong wind makes working at height much more dangerous. Stop and reassess.", ro: "Corect! Condiții schimbate = evaluare dinamică de risc. Vântul puternic face lucrul la înălțime mult mai periculos. Opriți și reevaluați." } },
    { type: "paragraph", text: { en: "EVERYONE on site has stop work authority. This means ANY worker can stop a job if they believe it is unsafe. You do NOT need permission from a manager to stop unsafe work.", ro: "TOȚI de pe șantier au autoritatea de a opri lucrul. Aceasta înseamnă că ORICE muncitor poate opri o lucrare dacă crede că este nesigură. NU aveți nevoie de permisiunea unui manager pentru a opri lucrul nesigur." } },
    { type: "rememberThis", text: { en: "ANY worker can stop work if they believe it is unsafe. You do NOT need a manager's permission. This is called STOP WORK AUTHORITY and it applies to everyone.", ro: "ORICE muncitor poate opri lucrul dacă crede că este nesigur. NU aveți nevoie de permisiunea unui manager. Aceasta se numește AUTORITATE DE OPRIRE A LUCRULUI." } },
    { type: "miniCheck", conceptSlug: "employer_vs_employee_responsibility", question: { en: "Who has the authority to stop unsafe work on site?", ro: "Cine are autoritatea de a opri lucrul nesigur pe șantier?" }, options: [{ en: "Only the site manager", ro: "Doar managerul de șantier" }, { en: "Only the HSE inspector", ro: "Doar inspectorul HSE" }, { en: "Any worker on site", ro: "Orice muncitor de pe șantier" }, { en: "Only the client", ro: "Doar clientul" }], correct: 2, feedback: { en: "Correct! ANY worker has stop work authority. If you see something unsafe, you have the RIGHT and the DUTY to stop.", ro: "Corect! ORICE muncitor are autoritate de oprire. Dacă vedeți ceva nesigur, aveți DREPTUL și DATORIA de a opri." } },
  ],
  keySummary: [
    { en: "Dynamic risk assessment = continuous mental check as conditions change.", ro: "Evaluare dinamică = verificare mentală continuă pe măsură ce condițiile se schimbă." },
    { en: "If conditions change: STOP → reassess → report if needed.", ro: "Dacă condițiile se schimbă: OPRIȚI → reevaluați → raportați dacă este necesar." },
    { en: "ANY worker has stop work authority — no permission needed.", ro: "ORICE muncitor are autoritate de oprire — nu este nevoie de permisiune." },
    { en: "Never continue with the original plan if site conditions have changed.", ro: "Nu continuați niciodată cu planul original dacă condițiile de pe șantier s-au schimbat." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 1.7 — Electrical Safety, Fire Safety, PPE
   ══════════════════════════════════════════════ */

const lesson1_7: I18nLessonContent = {
  lessonId: "1.7",
  title: { en: "Electrical Safety, Fire Safety, and PPE", ro: "Siguranță Electrică, Siguranță la Incendiu și EIP" },
  videoPlaceholder: "Split screen showing electrical panel warning signs, fire extinguisher types, and PPE rack",
  keyTerms: [
    { en: "PPE", ro: "EIP", lt: "AAP", bg: "ЛПС", ar: "معدات الوقاية الشخصية", ti: "PPE", yo: "PPE", ig: "PPE", so: "PPE", am: "PPE" },
    { en: "Fire extinguisher", ro: "Stingător de incendiu", lt: "Gesintuvai", bg: "Пожарогасител", ar: "طفاية حريق", ti: "ናይ ሓዊ መጥፍኢ", yo: "Ohun ìpàiná", ig: "Ihe imenyụ ọkụ", so: "Dab-demiiska dabka", am: "የእሳት ማጥፊያ" },
    { en: "RCD", ro: "DDR", lt: "NAS", bg: "ДТЗ", ar: "جهاز التيار المتبقي", ti: "RCD", yo: "RCD", ig: "RCD", so: "RCD", am: "RCD" },
  ],
  content: [
    { type: "bold", text: { en: "ELECTRICAL SAFETY", ro: "SIGURANȚĂ ELECTRICĂ" } },
    { type: "paragraph", text: { en: "Electricity can kill. On construction sites, the main electrical dangers are: contact with overhead power lines, contact with underground cables, and using damaged electrical equipment.", ro: "Electricitatea poate ucide. Pe șantierele de construcții, principalele pericole electrice sunt: contactul cu liniile electrice aeriene, contactul cu cablurile subterane și utilizarea echipamentelor electrice deteriorate." } },
    { type: "rememberThis", text: { en: "110V supply (yellow plugs) should be used on construction sites — NOT 230V mains. An RCD (Residual Current Device) provides additional protection and must be tested regularly.", ro: "Alimentarea de 110V (prize galbene) trebuie folosită pe șantiere — NU 230V rețea. Un DDR (Dispozitiv de Curent Rezidual) oferă protecție suplimentară și trebuie testat regulat." } },
    { type: "miniCheck", conceptSlug: "elimination_vs_reduction", question: { en: "What voltage should portable electrical equipment use on a construction site?", ro: "Ce tensiune trebuie să folosească echipamentele electrice portabile pe un șantier?" }, options: [{ en: "230V", ro: "230V" }, { en: "110V", ro: "110V" }, { en: "415V", ro: "415V" }, { en: "12V", ro: "12V" }], correct: 1, feedback: { en: "Correct! 110V (yellow plugs) is the safe voltage for construction sites. 230V mains voltage can kill.", ro: "Corect! 110V (prize galbene) este tensiunea sigură pentru șantiere. 230V poate ucide." } },
    { type: "bold", text: { en: "FIRE SAFETY", ro: "SIGURANȚĂ LA INCENDIU" } },
    { type: "paragraph", text: { en: "The fire triangle: fire needs HEAT, FUEL, and OXYGEN. Remove any one of these three and the fire goes out. Fire prevention means controlling these three elements.", ro: "Triunghiul focului: focul are nevoie de CĂLDURĂ, COMBUSTIBIL și OXIGEN. Eliminați oricare dintre aceste trei și focul se stinge. Prevenirea incendiilor înseamnă controlul acestor trei elemente." } },
    { type: "rememberThis", text: { en: "Fire triangle: HEAT + FUEL + OXYGEN = fire. Remove ONE element and the fire cannot survive. Common test question!", ro: "Triunghiul focului: CĂLDURĂ + COMBUSTIBIL + OXIGEN = foc. Eliminați UN element și focul nu poate supraviețui." } },
    { type: "testTip", text: { en: "If asked 'What are the 3 elements of the fire triangle?', the answer is ALWAYS: Heat, Fuel, and Oxygen. They may also ask what to remove to put out a fire — any ONE of the three.", ro: "Dacă sunteți întrebat 'Care sunt cele 3 elemente ale triunghiului focului?', răspunsul este ÎNTOTDEAUNA: Căldură, Combustibil și Oxigen." } },
    { type: "miniCheck", conceptSlug: "fire_triangle", question: { en: "Which THREE elements make up the fire triangle?", ro: "Care TREI elemente formează triunghiul focului?" }, options: [{ en: "Heat, Fuel, Oxygen", ro: "Căldură, Combustibil, Oxigen" }, { en: "Water, Heat, Wood", ro: "Apă, Căldură, Lemn" }, { en: "Spark, Gas, Wind", ro: "Scânteie, Gaz, Vânt" }, { en: "Flame, Smoke, Air", ro: "Flacără, Fum, Aer" }], correct: 0, feedback: { en: "Correct! Fire needs Heat + Fuel + Oxygen. Remove one and the fire goes out.", ro: "Corect! Focul are nevoie de Căldură + Combustibil + Oxigen. Eliminați unul și focul se stinge." } },
    { type: "bold", text: { en: "PERSONAL PROTECTIVE EQUIPMENT (PPE)", ro: "ECHIPAMENT INDIVIDUAL DE PROTECȚIE (EIP)" } },
    { type: "paragraph", text: { en: "PPE is the LAST line of defence — not the first. The hierarchy of controls is: ELIMINATE the hazard → REDUCE the risk → ISOLATE people → CONTROL with procedures → PPE as last resort.", ro: "EIP este ULTIMA linie de apărare — nu prima. Ierarhia controlului este: ELIMINAȚI pericolul → REDUCEȚI riscul → IZOLAȚI persoanele → CONTROLAȚI cu proceduri → EIP ca ultimă soluție." } },
    { type: "rememberThis", text: { en: "PPE is the LAST resort, not the first choice. Always try to eliminate or reduce the hazard first. If PPE is needed, it must be: provided FREE by the employer, properly FITTED, regularly INSPECTED, and correctly STORED.", ro: "EIP este ULTIMA soluție, nu prima alegere. Încercați întotdeauna să eliminați sau să reduceți pericolul mai întâi. Dacă este nevoie de EIP, trebuie: furnizat GRATUIT de angajator, corect AJUSTAT, regulat INSPECTAT și corect DEPOZITAT." } },
    { type: "miniCheck", conceptSlug: "hierarchy_of_control", question: { en: "PPE should be used as:", ro: "EIP ar trebui folosit ca:" }, options: [{ en: "The first thing you try", ro: "Primul lucru pe care îl încercați" }, { en: "The last line of defence after other controls", ro: "Ultima linie de apărare după alte controale" }, { en: "Only when the HSE visits", ro: "Doar când vine HSE" }, { en: "A replacement for risk assessments", ro: "Un înlocuitor pentru evaluările de risc" }], correct: 1, feedback: { en: "Correct! PPE is the LAST resort in the hierarchy of controls. Eliminate → Reduce → Isolate → Control → PPE.", ro: "Corect! EIP este ULTIMA soluție în ierarhia controalelor. Eliminare → Reducere → Izolare → Control → EIP." } },
  ],
  keySummary: [
    { en: "Use 110V (yellow plugs) on site — NOT 230V mains. Use an RCD for extra protection.", ro: "Folosiți 110V (prize galbene) pe șantier — NU 230V. Folosiți DDR pentru protecție suplimentară." },
    { en: "Fire triangle: Heat + Fuel + Oxygen. Remove ONE to stop fire.", ro: "Triunghiul focului: Căldură + Combustibil + Oxigen. Eliminați UNUL pentru a opri focul." },
    { en: "PPE is the LAST line of defence: Eliminate → Reduce → Isolate → Control → PPE.", ro: "EIP este ULTIMA linie: Eliminare → Reducere → Izolare → Control → EIP." },
    { en: "PPE must be FREE, properly fitted, inspected, and correctly stored.", ro: "EIP trebuie GRATUIT, corect ajustat, inspectat și depozitat." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 1.8 — Personal Hygiene on Site
   ══════════════════════════════════════════════ */

const lesson1_8: I18nLessonContent = {
  lessonId: "1.8",
  title: { en: "Personal Hygiene on Site", ro: "Igiena Personală pe Șantier" },
  videoPlaceholder: "Worker washing hands at a site welfare facility",
  keyTerms: [
    { en: "Welfare facilities", ro: "Facilități de bunăstare", lt: "Gerovės priemonės", bg: "Социално-битови условия", ar: "مرافق الرعاية", ti: "ናይ ድሕነት ኣገልግሎታት", yo: "Àwọn ohun èlò ìtọ́jú", ig: "Ebe nlekọta ahụ", so: "Xarumaha daryeelka", am: "የደህንነት መገልገያዎች" },
    { en: "Dermatitis", ro: "Dermatită", lt: "Dermatitas", bg: "Дерматит", ar: "التهاب الجلد", ti: "ቆርበት ሕማም", yo: "Àrùn awọ̀", ig: "Ọrịa akpụkpọ ahụ", so: "Maqaarka cudurka", am: "የቆዳ በሽታ" },
    { en: "Leptospirosis", ro: "Leptospiroză", lt: "Leptospirozė", bg: "Лептоспироза", ar: "داء البريميات", ti: "ለፕቶስፓይሮሲስ", yo: "Leptospirosis", ig: "Leptospirosis", so: "Leptospirosis", am: "ሌፕቶስፒሮሲስ" },
  ],
  content: [
    { type: "paragraph", text: { en: "Personal hygiene on construction sites is not just about cleanliness — it protects you from serious diseases. Construction workers can be exposed to hazardous substances through their skin, mouth, and lungs.", ro: "Igiena personală pe șantierele de construcții nu este doar despre curățenie — vă protejează de boli grave. Muncitorii din construcții pot fi expuși la substanțe periculoase prin piele, gură și plămâni." } },
    { type: "rememberThis", text: { en: "ALWAYS wash your hands before eating, drinking, or smoking on site. Hazardous substances like cement dust, lead, and chemicals can enter your body through your mouth if your hands are contaminated.", ro: "ÎNTOTDEAUNA spălați-vă pe mâini înainte de a mânca, bea sau fuma pe șantier. Substanțele periculoase precum praful de ciment, plumbul și chimicalele pot intra în corp prin gură dacă mâinile sunt contaminate." } },
    { type: "testTip", text: { en: "The test often asks about DERMATITIS — a skin condition caused by contact with substances like cement, solvents, and oils. Prevention: wear gloves, use barrier cream, wash hands regularly.", ro: "Testul întreabă adesea despre DERMATITĂ — o afecțiune a pielii cauzată de contactul cu substanțe precum cimentul, solvenții și uleiurile. Prevenție: purtați mănuși, folosiți cremă de protecție, spălați-vă pe mâini regulat." } },
    { type: "miniCheck", conceptSlug: "hygiene_controls", question: { en: "What is the main cause of occupational dermatitis on construction sites?", ro: "Care este cauza principală a dermatitei profesionale pe șantierele de construcții?" }, options: [{ en: "Wearing a hard hat", ro: "Purtarea căștii" }, { en: "Contact with substances like cement, solvents, and oils", ro: "Contactul cu substanțe precum cimentul, solvenții și uleiurile" }, { en: "Working in sunlight", ro: "Lucrul în lumina soarelui" }, { en: "Using hand tools", ro: "Folosirea sculelor de mână" }], correct: 1, feedback: { en: "Correct! Dermatitis is caused by skin contact with substances like wet cement, solvents, oils, and chemicals. Wear gloves and wash hands.", ro: "Corect! Dermatita este cauzată de contactul pielii cu substanțe precum cimentul umed, solvenții, uleiurile și chimicalele. Purtați mănuși și spălați-vă pe mâini." } },
    { type: "paragraph", text: { en: "LEPTOSPIROSIS (Weil's disease) is a serious infection spread through RAT URINE. It can be found in water, mud, and soil contaminated by rats. Symptoms include flu-like illness that can become fatal.", ro: "LEPTOSPIROZA (boala lui Weil) este o infecție gravă răspândită prin URINĂ DE ȘOBOLAN. Poate fi găsită în apă, noroi și sol contaminate de șobolani. Simptomele includ o boală asemănătoare gripei care poate deveni fatală." } },
    { type: "rememberThis", text: { en: "Leptospirosis (Weil's disease) comes from RAT URINE in contaminated water/soil. Cover any cuts or grazes before working near water or soil. Wash hands thoroughly after.", ro: "Leptospiroza (boala lui Weil) provine din URINĂ DE ȘOBOLAN în apă/sol contaminate. Acoperiți orice tăietură sau zgârietură înainte de a lucra lângă apă sau sol. Spălați-vă bine pe mâini după." } },
    { type: "miniCheck", conceptSlug: "hygiene_controls", question: { en: "Leptospirosis (Weil's disease) is spread through:", ro: "Leptospiroza (boala lui Weil) se răspândește prin:" }, options: [{ en: "Breathing in dust", ro: "Inhalarea prafului" }, { en: "Contact with rat urine in contaminated water or soil", ro: "Contactul cu urina de șobolan în apă sau sol contaminate" }, { en: "Sharing tools with other workers", ro: "Împărțirea sculelor cu alți muncitori" }, { en: "Working in cold weather", ro: "Lucrul pe vreme rece" }], correct: 1, feedback: { en: "Correct! Leptospirosis is spread through rat urine in water and soil. Cover cuts and wash hands thoroughly.", ro: "Corect! Leptospiroza se răspândește prin urină de șobolan în apă și sol. Acoperiți tăieturile și spălați-vă bine pe mâini." } },
    { type: "paragraph", text: { en: "Employers must provide adequate WELFARE FACILITIES including: toilets, washing facilities with hot and cold water, a clean area for eating and drinking, and somewhere to dry wet clothing.", ro: "Angajatorii trebuie să ofere FACILITĂȚI DE BUNĂSTARE adecvate, inclusiv: toalete, facilități de spălat cu apă caldă și rece, o zonă curată pentru mâncat și băut, și un loc pentru uscarea hainelor ude." } },
    { type: "rememberThis", text: { en: "Welfare facilities are a LEGAL requirement. Employers MUST provide: toilets, washing facilities (hot + cold water), eating area, drinking water, changing rooms, and rest areas.", ro: "Facilitățile de bunăstare sunt o CERINȚĂ LEGALĂ. Angajatorii TREBUIE să furnizeze: toalete, facilități de spălat (apă caldă + rece), zonă de mâncare, apă potabilă, vestiare și zone de odihnă." } },
  ],
  keySummary: [
    { en: "ALWAYS wash hands before eating, drinking, or smoking on site.", ro: "ÎNTOTDEAUNA spălați-vă pe mâini înainte de a mânca, bea sau fuma pe șantier." },
    { en: "Dermatitis = skin disease from cement, solvents, oils. Prevent with gloves + washing.", ro: "Dermatita = boală de piele de la ciment, solvenți, uleiuri. Preveniți cu mănuși + spălare." },
    { en: "Leptospirosis (Weil's disease) = from RAT URINE. Cover cuts, wash hands after contact.", ro: "Leptospiroza (boala Weil) = din URINĂ DE ȘOBOLAN. Acoperiți tăieturile, spălați mâinile." },
    { en: "Welfare facilities (toilets, washing, eating area) are a LEGAL requirement.", ro: "Facilitățile de bunăstare (toalete, spălare, zonă de mâncare) sunt CERINȚĂ LEGALĂ." },
  ],
};

/* ══════════════════════════════════════════════
   EXPORT ALL MODULE 1 LESSONS
   ══════════════════════════════════════════════ */

export const MODULE_1_LESSONS: I18nLessonContent[] = [
  lesson1_1,
  lesson1_2,
  lesson1_3,
  lesson1_4,
  lesson1_5,
  lesson1_6,
  lesson1_7,
  lesson1_8,
];

export const getModule1Lesson = (lessonId: number): I18nLessonContent | undefined =>
  MODULE_1_LESSONS[lessonId - 1];
