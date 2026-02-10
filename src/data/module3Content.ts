/**
 * Multilingual content for Module 3 — Working at Height.
 * Same structure as module1Content.ts / module2Content.ts.
 */

import type { I18nLessonContent } from "./module1Content";

/* ══════════════════════════════════════════════
   LESSON 3.1 — What Counts as Working at Height?
   ══════════════════════════════════════════════ */

const lesson3_1: I18nLessonContent = {
  lessonId: "3.1",
  title: {
    en: "What Counts as Working at Height?",
    ro: "Ce Înseamnă Lucrul la Înălțime?",
  },
  videoPlaceholder: "Construction workers on scaffolding, ladders, and rooftops — demonstrating working at height scenarios",
  keyTerms: [
    { en: "Working at Height", ro: "Lucru la Înălțime", lt: "Darbas aukštyje", bg: "Работа на височина", ar: "العمل على ارتفاع", ti: "ስራሕ ኣብ ቁመት", yo: "Iṣẹ́ lórí gíga", ig: "Ọrụ n'elu", so: "Shaqo dherer ah", am: "በከፍታ ላይ መስራት" },
    { en: "Fall Arrest", ro: "Oprire Cădere", lt: "Kritimo sulaikymas", bg: "Спиране на падане", ar: "إيقاف السقوط", ti: "ምግታእ ውድቀት", yo: "Ìdádúró ìṣubú", ig: "Igbochi ịdaba", so: "Joojinta dhicista", am: "ውድቀት ማቆሚያ" },
    { en: "Guardrail", ro: "Balustradă", lt: "Apsauginis turėklas", bg: "Парапет", ar: "حاجز حماية", ti: "ዘንቢል ሓለዋ", yo: "Ọpa ààbò", ig: "Mgbọ nche", so: "Qaybta ilaalinta", am: "የጥበቃ አጥር" },
    { en: "Harness", ro: "Ham de Siguranță", lt: "Diržai", bg: "Обезопасителен колан", ar: "حزام أمان", ti: "ቀበቶ ድሕነት", yo: "Ìhámọ́ra ààbò", ig: "Eriri nchekwa", so: "Suunka badbaadada", am: "የደህንነት ቀበቶ" },
    { en: "Exclusion Zone", ro: "Zonă de Excludere", lt: "Draudžiama zona", bg: "Забранена зона", ar: "منطقة محظورة", ti: "ዞባ ምእጋድ", yo: "Àgbègbè ìdènà", ig: "Mpaghara amachibidoro", so: "Aagga mamnuuca", am: "የተከለከለ ቦታ" },
  ],
  content: [
    { type: "paragraph", text: { en: "Working at height means working in any place where you could fall and be injured. This is NOT just rooftops — it includes ladders, scaffolding, edges, fragile surfaces, and even ground level where there are openings.", ro: "Lucrul la înălțime înseamnă a lucra în orice loc de unde ai putea cădea și te-ai putea accidenta. Nu este vorba doar despre acoperișuri — include scări, schele, margini, suprafețe fragile și chiar nivelul solului unde există deschideri." } },
    { type: "rememberThis", text: { en: "In 2024/25, ALL 35 construction worker deaths in the UK were caused by FALLS FROM HEIGHT. This is the NUMBER ONE killer in construction — every single death.", ro: "În 2024/25, TOATE cele 35 de decese ale muncitorilor în construcții din Marea Britanie au fost cauzate de CĂDERI DE LA ÎNĂLȚIME. Acesta este UCIGAȘUL NUMĂRUL UNU în construcții — fiecare deces." } },
    { type: "testTip", text: { en: "The test WILL ask about the biggest cause of death in construction. The answer is ALWAYS falls from height. Remember: ALL 35 deaths in 2024/25 were from falls.", ro: "Testul VA întreba despre cea mai mare cauză de deces în construcții. Răspunsul este ÎNTOTDEAUNA căderea de la înălțime. Rețineți: TOATE cele 35 de decese din 2024/25 au fost din căderi." } },
    { type: "miniCheck", question: { en: "In 2024/25, what percentage of construction deaths were caused by falls from height?", ro: "În 2024/25, ce procent din decesele în construcții au fost cauzate de căderi de la înălțime?" }, options: [{ en: "50%", ro: "50%" }, { en: "75%", ro: "75%" }, { en: "100%", ro: "100%" }, { en: "25%", ro: "25%" }], correct: 2, feedback: { en: "Correct! 100% — ALL 35 construction deaths in 2024/25 were caused by falls from height. This is the biggest killer.", ro: "Corect! 100% — TOATE cele 35 de decese în construcții din 2024/25 au fost cauzate de căderi de la înălțime." } },
    { type: "paragraph", text: { en: "The Work at Height Regulations 2005 set out the law. They apply to ANY work where someone could fall a distance likely to cause personal injury. This includes work above ground AND at ground level near an opening or edge.", ro: "Regulamentele privind Lucrul la Înălțime din 2005 stabilesc legea. Se aplică ORICĂREI activități în care cineva ar putea cădea de la o distanță care ar putea cauza vătămare corporală." } },
    { type: "rememberThis", text: { en: "The hierarchy of controls for working at height: 1) AVOID working at height altogether. 2) PREVENT falls — use guardrails, platforms, barriers. 3) MINIMISE consequences — nets, harnesses, airbags (LAST RESORT).", ro: "Ierarhia controalelor pentru lucrul la înălțime: 1) EVITAȚI lucrul la înălțime complet. 2) PREVENIȚI căderile — folosiți balustrade, platforme, bariere. 3) MINIMIZAȚI consecințele — plase, hamuri, airbag-uri (ULTIMUL RECURS)." } },
    { type: "testTip", text: { en: "The test will ask: 'What is the FIRST thing to do about working at height?' The answer is AVOID it. NOT a harness — a harness is a LAST RESORT. Many candidates get this wrong.", ro: "Testul va întreba: 'Care este PRIMUL lucru de făcut în legătură cu lucrul la înălțime?' Răspunsul este SĂ-L EVITAȚI. NU un ham — hamul este ULTIMUL RECURS." } },
    { type: "miniCheck", question: { en: "A safety harness is the ___ resort for fall protection.", ro: "Un ham de siguranță este ___ recurs pentru protecția împotriva căderilor." }, options: [{ en: "First", ro: "Primul" }, { en: "Second", ro: "Al doilea" }, { en: "Last", ro: "Ultimul" }, { en: "Only", ro: "Singurul" }], correct: 2, feedback: { en: "Correct! A harness is the LAST resort. Always try to AVOID height work first, then PREVENT falls with guardrails, then minimise with harnesses.", ro: "Corect! Un ham este ULTIMUL recurs. Încercați întotdeauna mai întâi să EVITAȚI lucrul la înălțime, apoi PREVENIȚI căderile cu balustrade, apoi minimizați cu hamuri." } },
    { type: "paragraph", text: { en: "Everyone on site must report any unsafe conditions when working at height. If guardrails are missing, toe boards are damaged, or you see an unprotected edge — STOP and report it immediately.", ro: "Toți cei de pe șantier trebuie să raporteze orice condiții nesigure la lucrul la înălțime. Dacă lipsesc balustradele, scândurile de protecție sunt deteriorate sau vedeți o margine neprotejată — OPRIȚI-VĂ și raportați imediat." } },
    { type: "rememberThis", text: { en: "NEVER ignore missing guardrails, damaged edge protection, or unprotected openings. STOP work and REPORT it immediately. Your life and others' lives depend on it.", ro: "Nu ignorați NICIODATĂ balustradele lipsă, protecția marginilor deteriorată sau deschiderile neprotejate. OPRIȚI lucrul și RAPORTAȚI imediat." } },
  ],
  keySummary: [
    { en: "Working at height = ANY place where you could fall and be injured, including ground-level openings.", ro: "Lucrul la înălțime = ORICE loc de unde ai putea cădea și te-ai putea accidenta, inclusiv deschiderile la nivelul solului." },
    { en: "ALL 35 construction deaths in 2024/25 were from falls — the NUMBER ONE killer.", ro: "TOATE cele 35 de decese în construcții din 2024/25 au fost din căderi — UCIGAȘUL NUMĂRUL UNU." },
    { en: "Hierarchy: AVOID height → PREVENT falls (guardrails) → MINIMISE consequences (harness = LAST RESORT).", ro: "Ierarhie: EVITAȚI înălțimea → PREVENIȚI căderile (balustrade) → MINIMIZAȚI consecințele (ham = ULTIMUL RECURS)." },
    { en: "Work at Height Regulations 2005 — applies to ALL work where someone could fall.", ro: "Regulamentele privind Lucrul la Înălțime 2005 — se aplică la TOT lucrul în care cineva ar putea cădea." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 3.2 — Ladder Safety
   ══════════════════════════════════════════════ */

const lesson3_2: I18nLessonContent = {
  lessonId: "3.2",
  title: {
    en: "Ladder Safety",
    ro: "Siguranța pe Scară",
  },
  videoPlaceholder: "Worker positioning a ladder against a wall at the correct 75° angle with 3 points of contact",
  keyTerms: [
    { en: "Ladder", ro: "Scară", lt: "Kopėčios", bg: "Стълба", ar: "سلم", ti: "መሰላል", yo: "Àtẹ̀gùn", ig: "Nkwasa", so: "Jaranjar", am: "መሰላል" },
    { en: "Toe Board", ro: "Scândură de Protecție", lt: "Kojų lenta", bg: "Предпазна дъска", ar: "لوح حماية القدم", ti: "ሰሌዳ ሓለዋ እግሪ", yo: "Pátákó ẹsẹ̀", ig: "Osisi nchekwa ụkwụ", so: "Loox ilaalinta cagaha", am: "የእግር መከላከያ ሰሌዳ" },
    { en: "Three Points of Contact", ro: "Trei Puncte de Contact", lt: "Trys kontakto taškai", bg: "Три точки на контакт", ar: "ثلاث نقاط تلامس", ti: "ሰለስተ ነጥቢ ምትንኻፍ", yo: "Àwọn ojú ìkàn mẹ́ta", ig: "Isi nkwurịta atọ", so: "Saddex barta taabashada", am: "ሶስት ንክኪ ነጥቦች" },
  ],
  content: [
    { type: "paragraph", text: { en: "Ladders are one of the most common pieces of access equipment on construction sites. But they are also one of the most dangerous if used incorrectly. Ladders should only be used for SHORT-DURATION work (less than 30 minutes).", ro: "Scările sunt unul dintre cele mai comune echipamente de acces pe șantierele de construcții. Dar sunt și printre cele mai periculoase dacă sunt utilizate incorect. Scările ar trebui folosite doar pentru lucrări DE SCURTĂ DURATĂ (mai puțin de 30 de minute)." } },
    { type: "rememberThis", text: { en: "The ladder angle rule: 1 in 4 ratio — for every 4 metres UP, the base must be 1 metre OUT. This creates the safe 75° angle. The ladder must extend at least 1 metre above the landing point.", ro: "Regula unghiului scării: raport 1 la 4 — pentru fiecare 4 metri SUS, baza trebuie să fie 1 metru AFARĂ. Aceasta creează unghiul sigur de 75°. Scara trebuie să se extindă cel puțin 1 metru deasupra punctului de aterizare." } },
    { type: "testTip", text: { en: "The test WILL ask about ladder angles. Remember: 1 in 4 = 75 degrees. 4 up, 1 out. They may give you measurements and ask you to calculate the correct base distance.", ro: "Testul VA întreba despre unghiurile scării. Rețineți: 1 la 4 = 75 de grade. 4 sus, 1 afară. Vă pot da măsurători și să vă ceară să calculați distanța corectă a bazei." } },
    { type: "miniCheck", question: { en: "The correct ladder angle is 1 in ___.", ro: "Unghiul corect al scării este 1 la ___." }, options: [{ en: "2", ro: "2" }, { en: "3", ro: "3" }, { en: "4", ro: "4" }, { en: "5", ro: "5" }], correct: 2, feedback: { en: "Correct! 1 in 4 ratio — for every 4 metres up, 1 metre out at the base. This gives the safe 75° angle.", ro: "Corect! Raport 1 la 4 — pentru fiecare 4 metri sus, 1 metru afară la bază. Aceasta dă unghiul sigur de 75°." } },
    { type: "paragraph", text: { en: "You must ALWAYS maintain 3 points of contact on a ladder. This means two hands and one foot, OR two feet and one hand, touching the ladder at all times. You cannot carry tools while climbing — use a tool belt.", ro: "Trebuie să MENȚINEȚI ÎNTOTDEAUNA 3 puncte de contact pe scară. Aceasta înseamnă două mâini și un picior, SAU două picioare și o mână, atingând scara în orice moment. Nu puteți transporta unelte în timp ce urcați — folosiți o centură de scule." } },
    { type: "rememberThis", text: { en: "3 POINTS OF CONTACT at all times on a ladder: 2 hands + 1 foot, or 2 feet + 1 hand. NEVER carry tools or materials while climbing — use a tool belt or hoist them up.", ro: "3 PUNCTE DE CONTACT în orice moment pe scară: 2 mâini + 1 picior, sau 2 picioare + 1 mână. Nu transportați NICIODATĂ unelte sau materiale în timp ce urcați — folosiți o centură de scule sau ridicați-le." } },
    { type: "miniCheck", question: { en: "Three points of contact on a ladder means:", ro: "Trei puncte de contact pe scară înseamnă:" }, options: [{ en: "Three hands on the ladder", ro: "Trei mâini pe scară" }, { en: "Two hands + one foot, or two feet + one hand", ro: "Două mâini + un picior, sau două picioare + o mână" }, { en: "Both feet + both hands", ro: "Ambele picioare + ambele mâini" }, { en: "One hand + one foot", ro: "O mână + un picior" }], correct: 1, feedback: { en: "Correct! 3 points of contact = 2 hands and 1 foot, or 2 feet and 1 hand on the ladder at all times.", ro: "Corect! 3 puncte de contact = 2 mâini și 1 picior, sau 2 picioare și 1 mână pe scară în orice moment." } },
    { type: "paragraph", text: { en: "Before using any ladder, you must inspect it. Check for: damaged rungs, cracks, bent stiles, missing feet, and that it is the right length for the job. A defective ladder must be taken out of use and reported.", ro: "Înainte de a folosi orice scară, trebuie să o inspectați. Verificați: trepte deteriorate, fisuri, montanți îndoiți, picioare lipsă și dacă are lungimea potrivită pentru lucru." } },
    { type: "rememberThis", text: { en: "ALWAYS inspect a ladder before use. Check: rungs not damaged, stiles not cracked or bent, feet present, correct length. Defective ladder = DO NOT USE — tag it and report it.", ro: "INSPECTAȚI ÎNTOTDEAUNA o scară înainte de utilizare. Verificați: treptele nu sunt deteriorate, montanții nu sunt fisurați sau îndoiți, picioarele sunt prezente, lungimea corectă. Scară defectă = NU UTILIZAȚI — etichetați-o și raportați." } },
    { type: "paragraph", text: { en: "A ladder must be placed on firm, level ground. It must be secured — tied at the top or held (footed) by another person. Never rest a ladder on its rungs or use a damaged ladder.", ro: "O scară trebuie așezată pe un teren ferm și plat. Trebuie să fie asigurată — legată în partea de sus sau ținută de o altă persoană. Nu așezați niciodată o scară pe treptele sale și nu folosiți o scară deteriorată." } },
  ],
  keySummary: [
    { en: "Ladder angle: 1 in 4 ratio (75°) — 4 up, 1 out. Extend 1m above landing.", ro: "Unghiul scării: raport 1 la 4 (75°) — 4 sus, 1 afară. Extindeți 1m deasupra aterizării." },
    { en: "3 points of contact ALWAYS: 2 hands + 1 foot, or 2 feet + 1 hand.", ro: "3 puncte de contact ÎNTOTDEAUNA: 2 mâini + 1 picior, sau 2 picioare + 1 mână." },
    { en: "Inspect BEFORE every use. Defective = tag it, report it, DO NOT USE.", ro: "Inspectați ÎNAINTE de fiecare utilizare. Defectă = etichetați-o, raportați-o, NU UTILIZAȚI." },
    { en: "Ladders = short-duration work only (under 30 minutes). Use platforms for longer work.", ro: "Scări = doar lucrări de scurtă durată (sub 30 de minute). Folosiți platforme pentru lucrări mai lungi." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 3.3 — Scaffold Safety
   ══════════════════════════════════════════════ */

const lesson3_3: I18nLessonContent = {
  lessonId: "3.3",
  title: {
    en: "Scaffold Safety",
    ro: "Siguranța Schelelor",
  },
  videoPlaceholder: "CISRS-trained scaffolders erecting scaffolding with guardrails, toe boards, and scaffold tags",
  keyTerms: [
    { en: "Scaffolding", ro: "Schelă", lt: "Pastoliai", bg: "Скеле", ar: "سقالة", ti: "መደረብ", yo: "Àgò ìkọ́lé", ig: "Ihe nkwado", so: "Iskaafoolad", am: "ድንኳን" },
    { en: "CISRS", ro: "CISRS", lt: "CISRS", bg: "CISRS", ar: "CISRS", ti: "CISRS", yo: "CISRS", ig: "CISRS", so: "CISRS", am: "CISRS" },
    { en: "Scaffold Tag", ro: "Etichetă Schelă", lt: "Pastolių žyma", bg: "Етикет за скеле", ar: "بطاقة السقالة", ti: "ታግ መደረብ", yo: "Àmì àgò", ig: "Akara ihe nkwado", so: "Calaamadda iskaafoolka", am: "የድንኳን ምልክት" },
    { en: "MEWP", ro: "MEWP", lt: "MEWP", bg: "MEWP", ar: "MEWP", ti: "MEWP", yo: "MEWP", ig: "MEWP", so: "MEWP", am: "MEWP" },
  ],
  content: [
    { type: "paragraph", text: { en: "Scaffolding is one of the most important access platforms on construction sites. It allows workers to reach high areas safely — but ONLY when it is correctly erected, inspected, and maintained.", ro: "Schela este una dintre cele mai importante platforme de acces pe șantierele de construcții. Permite muncitorilor să ajungă în siguranță în zone înalte — dar DOAR când este corect montată, inspectată și întreținută." } },
    { type: "rememberThis", text: { en: "ONLY trained, competent, CISRS-qualified scaffolders can erect, alter, or dismantle scaffolding. NEVER modify scaffolding yourself — even moving a single board or guardrail is illegal and dangerous.", ro: "DOAR schelarii calificați CISRS, instruiți și competenți pot monta, modifica sau demonta schele. Nu modificați NICIODATĂ schelele singuri — chiar și mutarea unei singure scânduri sau balustrade este ilegală și periculoasă." } },
    { type: "testTip", text: { en: "The test will ask who can erect scaffolding. The answer is ONLY trained and competent scaffolders (CISRS-qualified). Not 'any experienced worker', not 'the site manager' — ONLY CISRS scaffolders.", ro: "Testul va întreba cine poate monta schele. Răspunsul este DOAR schelarii instruiți și competenți (calificați CISRS). Nu 'orice muncitor experimentat', nu 'managerul de șantier' — DOAR schelarii CISRS." } },
    { type: "miniCheck", question: { en: "Who can erect scaffolding on a construction site?", ro: "Cine poate monta schele pe un șantier de construcții?" }, options: [{ en: "Any experienced worker", ro: "Orice muncitor experimentat" }, { en: "The site manager", ro: "Managerul de șantier" }, { en: "Trained, competent CISRS scaffolders only", ro: "Doar schelarii calificați CISRS instruiți și competenți" }, { en: "Anyone with a hard hat", ro: "Oricine cu cască" }], correct: 2, feedback: { en: "Correct! ONLY CISRS-trained scaffolders. Never attempt to modify scaffolding yourself.", ro: "Corect! DOAR schelarii instruiți CISRS. Nu încercați niciodată să modificați schelele singuri." } },
    { type: "paragraph", text: { en: "Scaffolding must be inspected BEFORE each shift and AFTER bad weather (wind, rain, snow, frost). Inspections must be carried out by a competent person and the results recorded.", ro: "Schelele trebuie inspectate ÎNAINTE de fiecare schimb și DUPĂ vreme rea (vânt, ploaie, zăpadă, ger). Inspecțiile trebuie efectuate de o persoană competentă și rezultatele trebuie înregistrate." } },
    { type: "rememberThis", text: { en: "Scaffold inspection is required: 1) BEFORE first use. 2) BEFORE EVERY shift. 3) AFTER bad weather (wind, rain, snow, frost). 4) AFTER any modification or damage. Results must be RECORDED.", ro: "Inspecția schelelor este necesară: 1) ÎNAINTE de prima utilizare. 2) ÎNAINTE de FIECARE schimb. 3) DUPĂ vreme rea (vânt, ploaie, zăpadă, ger). 4) DUPĂ orice modificare sau deteriorare. Rezultatele trebuie ÎNREGISTRATE." } },
    { type: "miniCheck", question: { en: "When must scaffolding be inspected? (Select the BEST answer)", ro: "Când trebuie inspectate schelele? (Selectați cel mai bun răspuns)" }, options: [{ en: "Only once a week", ro: "Doar o dată pe săptămână" }, { en: "Before each shift and after bad weather", ro: "Înainte de fiecare schimb și după vreme rea" }, { en: "Only when it looks damaged", ro: "Doar când pare deteriorată" }, { en: "Monthly", ro: "Lunar" }], correct: 1, feedback: { en: "Correct! Before EVERY shift and after bad weather. This is a common test question.", ro: "Corect! Înainte de FIECARE schimb și după vreme rea. Aceasta este o întrebare frecventă la test." } },
    { type: "paragraph", text: { en: "Every scaffold must have a SCAFFOLD TAG. A GREEN tag means safe to use. A RED tag means DO NOT USE. Always check the tag before stepping onto any scaffold.", ro: "Fiecare schelă trebuie să aibă un TAG DE SCHELĂ. Un tag VERDE înseamnă sigur de utilizat. Un tag ROȘU înseamnă NU UTILIZAȚI. Verificați întotdeauna tag-ul înainte de a urca pe orice schelă." } },
    { type: "rememberThis", text: { en: "Scaffold tag system: GREEN = safe to use. RED = DO NOT USE. Always check the tag BEFORE getting on. A scaffold without a tag should be treated as UNSAFE.", ro: "Sistemul de tag-uri pentru schele: VERDE = sigur de utilizat. ROȘU = NU UTILIZAȚI. Verificați întotdeauna tag-ul ÎNAINTE de a urca. O schelă fără tag ar trebui tratată ca NESIGURĂ." } },
    { type: "paragraph", text: { en: "A safe scaffold must have: guardrails (top rail at 950mm), mid-rails, toe boards (at least 150mm high), and fully boarded platforms with no gaps. Materials should never be stacked near scaffold edges.", ro: "O schelă sigură trebuie să aibă: balustrade (șina superioară la 950mm), șine intermediare, scânduri de protecție (cel puțin 150mm înălțime) și platforme complet acoperite fără goluri." } },
  ],
  keySummary: [
    { en: "ONLY CISRS-trained scaffolders can erect, alter, or dismantle scaffolding.", ro: "DOAR schelarii instruiți CISRS pot monta, modifica sau demonta schele." },
    { en: "Inspect: BEFORE first use, BEFORE every shift, AFTER bad weather, AFTER any modification.", ro: "Inspectați: ÎNAINTE de prima utilizare, ÎNAINTE de fiecare schimb, DUPĂ vreme rea, DUPĂ orice modificare." },
    { en: "Scaffold tags: GREEN = safe. RED = do NOT use. No tag = treat as unsafe.", ro: "Tag-uri schele: VERDE = sigur. ROȘU = NU utilizați. Fără tag = tratați ca nesigur." },
    { en: "Safe scaffold needs: guardrails, mid-rails, toe boards (150mm+), fully boarded platforms.", ro: "Schela sigură are nevoie de: balustrade, șine intermediare, scânduri de protecție (150mm+), platforme complet acoperite." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 3.4 — Fragile Roofs, Internal Voids, and Fall Protection
   ══════════════════════════════════════════════ */

const lesson3_4: I18nLessonContent = {
  lessonId: "3.4",
  title: {
    en: "Fragile Roofs, Internal Voids, and Fall Protection",
    ro: "Acoperișuri Fragile, Goluri Interne și Protecție la Cădere",
  },
  videoPlaceholder: "Workers with crawling boards on a fragile roof, safety nets below, and warning signs around internal voids",
  keyTerms: [
    { en: "Fragile Roof", ro: "Acoperiș Fragil", lt: "Trapus stogas", bg: "Крехък покрив", ar: "سقف هش", ti: "ሸንጋጎ ናሕሲ", yo: "Orúlé elégé", ig: "Ụlọ elu nkọ", so: "Saqafka jilicsan", am: "ደካማ ጣሪያ" },
    { en: "Internal Void", ro: "Gol Intern", lt: "Vidinė ertmė", bg: "Вътрешна празнина", ar: "فراغ داخلي", ti: "ውሽጣዊ ባዶ", yo: "Òfo inú", ig: "Oghere n'ime", so: "Bannaanka gudaha", am: "ውስጣዊ ባዶ ቦታ" },
    { en: "Crawling Board", ro: "Scândură de Târâre", lt: "Šliaužimo lenta", bg: "Дъска за пълзене", ar: "لوح زحف", ti: "ሰሌዳ ምእላይ", yo: "Pátákó ìrà", ig: "Osisi nkwụ", so: "Looxda gurguurta", am: "የመሳብ ሰሌዳ" },
  ],
  content: [
    { type: "paragraph", text: { en: "A fragile roof is a roof that cannot support the weight of a person walking on it. Many construction materials LOOK solid but are NOT — cement sheets, skylights, glass panels, and corroded metal decking can all fail without warning.", ro: "Un acoperiș fragil este un acoperiș care nu poate suporta greutatea unei persoane care merge pe el. Multe materiale de construcții ARATĂ solide dar NU SUNT — plăcile de ciment, luminatoarele, panourile de sticlă și tablele metalice corodate pot ceda fără avertisment." } },
    { type: "rememberThis", text: { en: "NEVER step on a fragile roof unless you are CERTAIN it is load-bearing. If in doubt — DON'T. Use crawling boards to spread your weight. Fragile surfaces include: asbestos cement sheets, skylights, glass, liner panels, corroded metal.", ro: "Nu călcați NICIODATĂ pe un acoperiș fragil decât dacă sunteți SIGUR că poate suporta greutatea. Dacă aveți dubii — NU FACEȚI. Folosiți scânduri de târâre pentru a distribui greutatea." } },
    { type: "testTip", text: { en: "The test will ask about fragile roofs. The key answer: NEVER assume a roof is safe. Always use crawling boards. The most dangerous fragile material is asbestos cement sheeting — it looks solid but shatters.", ro: "Testul va întreba despre acoperișuri fragile. Răspunsul cheie: Nu presupuneți NICIODATĂ că un acoperiș este sigur. Folosiți întotdeauna scânduri de târâre." } },
    { type: "miniCheck", question: { en: "When working on a fragile roof, you should:", ro: "Când lucrați pe un acoperiș fragil, ar trebui:" }, options: [{ en: "Walk carefully along the edges", ro: "Mergeți cu atenție pe margini" }, { en: "Use crawling boards to spread your weight", ro: "Folosiți scânduri de târâre pentru a distribui greutatea" }, { en: "Step only on the strongest-looking areas", ro: "Călcați doar pe zonele care par cele mai rezistente" }, { en: "Avoid the skylights only", ro: "Evitați doar luminatoarele" }], correct: 1, feedback: { en: "Correct! Always use crawling boards. Never assume any area is safe just because it looks solid.", ro: "Corect! Folosiți întotdeauna scânduri de târâre. Nu presupuneți niciodată că o zonă este sigură doar pentru că arată solidă." } },
    { type: "paragraph", text: { en: "Internal voids are openings inside a building — such as lift shafts, stairwells, floor openings, and service ducts. They must be covered with fixed covers or surrounded by guardrails. Covers must be clearly marked.", ro: "Golurile interne sunt deschideri în interiorul unei clădiri — cum ar fi puțurile de lift, casele scărilor, deschiderile în podea și canalele de servicii. Trebuie acoperite cu capace fixe sau înconjurate de balustrade. Capacele trebuie marcate clar." } },
    { type: "rememberThis", text: { en: "Internal voids (lift shafts, floor openings, stairwells) must be: 1) COVERED with fixed, marked covers, OR 2) SURROUNDED by guardrails. Covers must be labelled 'VOID — DO NOT REMOVE' and strong enough to bear weight.", ro: "Golurile interne (puțuri de lift, deschideri în podea, case ale scărilor) trebuie: 1) ACOPERITE cu capace fixe, marcate, SAU 2) ÎNCONJURATE de balustrade. Capacele trebuie etichetate 'GOL — NU ÎNDEPĂRTAȚI'." } },
    { type: "paragraph", text: { en: "Fall protection equipment includes safety nets, soft-landing systems, and personal fall arrest systems (harnesses + lanyards). Remember: these are the LAST RESORT after avoiding and preventing falls.", ro: "Echipamentul de protecție la cădere include plase de siguranță, sisteme de aterizare moale și sisteme personale de oprire a căderii (hamuri + curele). Rețineți: acestea sunt ULTIMUL RECURS după evitarea și prevenirea căderilor." } },
    { type: "rememberThis", text: { en: "Fall arrest (harness + lanyard) is the LAST RESORT — only used when you cannot avoid height work AND cannot install guardrails or platforms. Harnesses must be inspected before EVERY use and properly fitted.", ro: "Oprirea căderii (ham + curea) este ULTIMUL RECURS — folosit doar când nu puteți evita lucrul la înălțime ȘI nu puteți instala balustrade sau platforme. Hamurile trebuie inspectate înainte de FIECARE utilizare." } },
    { type: "paragraph", text: { en: "MEWPs (Mobile Elevated Work Platforms) — like cherry pickers and scissor lifts — provide a safer alternative to ladders for working at height. Only trained operators can use them, and a harness must be worn inside the basket.", ro: "MEWP-urile (Platforme Mobile de Lucru la Înălțime) — cum ar fi nacele și platformele cu foarfecă — oferă o alternativă mai sigură scărilor pentru lucrul la înălțime. Doar operatorii instruiți le pot folosi și un ham trebuie purtat în coș." } },
    { type: "rememberThis", text: { en: "MEWPs (cherry pickers, scissor lifts): ONLY trained operators can use them. You MUST wear a harness inside the basket. Always check ground conditions — the MEWP needs firm, level ground.", ro: "MEWP-uri (nacele, platforme cu foarfecă): DOAR operatorii instruiți le pot folosi. TREBUIE să purtați un ham în coș. Verificați întotdeauna condițiile solului — MEWP-ul are nevoie de teren ferm și plat." } },
  ],
  keySummary: [
    { en: "NEVER step on a fragile roof unless certain it is load-bearing. Use crawling boards.", ro: "Nu călcați NICIODATĂ pe un acoperiș fragil decât dacă sunteți sigur că poate suporta greutatea. Folosiți scânduri de târâre." },
    { en: "Internal voids must be COVERED (fixed, marked) or SURROUNDED by guardrails.", ro: "Golurile interne trebuie ACOPERITE (fixe, marcate) sau ÎNCONJURATE de balustrade." },
    { en: "Fall arrest (harness) = LAST RESORT. Inspect before every use.", ro: "Oprirea căderii (ham) = ULTIMUL RECURS. Inspectați înainte de fiecare utilizare." },
    { en: "MEWPs: trained operators ONLY. Harness required inside basket. Firm, level ground.", ro: "MEWP-uri: DOAR operatori instruiți. Ham obligatoriu în coș. Teren ferm și plat." },
  ],
};

/* ─── Exports ─── */

const MODULE_3_LESSONS: Record<number, I18nLessonContent> = {
  1: lesson3_1,
  2: lesson3_2,
  3: lesson3_3,
  4: lesson3_4,
};

export const getModule3Lesson = (lessonId: number): I18nLessonContent | undefined =>
  MODULE_3_LESSONS[lessonId];
