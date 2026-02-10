/**
 * Multilingual content for Module 2 — Safe Manual Handling.
 * Same structure as module1Content.ts.
 */

import type { I18nLessonContent } from "./module1Content";

/* ══════════════════════════════════════════════
   LESSON 2.1 — What is Manual Handling and Why Does it Matter?
   ══════════════════════════════════════════════ */

const lesson2_1: I18nLessonContent = {
  lessonId: "2.1",
  title: {
    en: "What is Manual Handling and Why Does it Matter?",
    ro: "Ce este Manipularea Manuală și De Ce Contează?",
  },
  videoPlaceholder: "Workers lifting materials on a construction site — correct and incorrect techniques",
  keyTerms: [
    { en: "Manual Handling", ro: "Manipulare Manuală", lt: "Rankinis krovimas", bg: "Ръчна обработка", ar: "المناولة اليدوية", ti: "ብኢድ ምልዓል", yo: "Gbígbé ọwọ́", ig: "Iburu aka", so: "Gacanta ku qaadista", am: "በእጅ ማንሳት" },
    { en: "Musculoskeletal Disorder", ro: "Tulburare Musculoscheletică", lt: "Raumenų ir skeleto sutrikimas", bg: "Мускулно-скелетно разстройство", ar: "اضطراب عضلي هيكلي", ti: "ሕማም ጭዋዳን ዓጽምን", yo: "Àrùn egungun-iṣan", ig: "Nsogbu ọkpụkpụ", so: "Xanuunka lafdha", am: "የአጥንትና ጡንቻ ችግር" },
    { en: "Back Injury", ro: "Leziune la Spate", lt: "Nugaros trauma", bg: "Увреждане на гърба", ar: "إصابة الظهر", ti: "ጉድኣት ሕቖ", yo: "Ìpalára ẹ̀yìn", ig: "Mmerụ azụ", so: "Dhaawac dhabarka", am: "የጀርባ ጉዳት" },
  ],
  content: [
    { type: "paragraph", text: { en: "Manual handling means moving a load by hand or bodily force. This includes lifting, lowering, pushing, pulling, and carrying. It is one of the most common causes of injury on construction sites.", ro: "Manipularea manuală înseamnă mutarea unei sarcini cu mâna sau forța corporală. Aceasta include ridicarea, coborârea, împingerea, tragerea și transportul. Este una dintre cele mai frecvente cauze de accidentare pe șantiere." } },
    { type: "rememberThis", text: { en: "Manual handling = any activity involving lifting, lowering, pushing, pulling, or carrying a load by hand or bodily force. Over ONE THIRD of all workplace injuries are caused by manual handling.", ro: "Manipularea manuală = orice activitate care implică ridicarea, coborârea, împingerea, tragerea sau transportul unei sarcini cu mâna sau forța corporală. Peste O TREIME din toate accidentările la locul de muncă sunt cauzate de manipularea manuală." } },
    { type: "paragraph", text: { en: "The most common injury from manual handling is a BACK INJURY. This can range from a mild strain to a serious disc problem. Poor lifting technique is the main cause.", ro: "Cea mai frecventă accidentare din manipularea manuală este o LEZIUNE LA SPATE. Aceasta poate varia de la o întindere ușoară la o problemă gravă de disc. Tehnica incorectă de ridicare este cauza principală." } },
    { type: "rememberThis", text: { en: "The MOST COMMON manual handling injury is LOWER BACK INJURY. Long-term effects include: chronic back pain, slipped discs, osteoarthritis, and musculoskeletal disorders (MSDs).", ro: "Cea mai FRECVENTĂ accidentare din manipularea manuală este LEZIUNEA LA SPATELE INFERIOR. Efectele pe termen lung includ: dureri cronice de spate, hernie de disc, osteoartrită și tulburări musculoscheletice (TMS)." } },
    { type: "testTip", text: { en: "The test will ask about the most common manual handling injury. The answer is ALWAYS lower back injury. They may also ask about long-term effects — remember: osteoarthritis, chronic pain, disc problems.", ro: "Testul va întreba despre cea mai frecventă accidentare din manipularea manuală. Răspunsul este ÎNTOTDEAUNA leziunea la spatele inferior. Pot întreba și despre efectele pe termen lung — rețineți: osteoartrită, dureri cronice, probleme de disc." } },
    { type: "miniCheck", question: { en: "What is the MOST COMMON injury caused by manual handling?", ro: "Care este cea mai FRECVENTĂ accidentare cauzată de manipularea manuală?" }, options: [{ en: "Broken arm", ro: "Braț rupt" }, { en: "Lower back injury", ro: "Leziune la spatele inferior" }, { en: "Head injury", ro: "Leziune la cap" }, { en: "Ankle sprain", ro: "Entorsă de gleznă" }], correct: 1, feedback: { en: "Correct! Lower back injury is the most common manual handling injury. This is why correct lifting technique is so important.", ro: "Corect! Leziunea la spatele inferior este cea mai frecventă accidentare din manipularea manuală. De aceea tehnica corectă de ridicare este atât de importantă." } },
    { type: "paragraph", text: { en: "The Manual Handling Operations Regulations 1992 (MHOR) set out the law. Employers must: 1) AVOID hazardous manual handling where possible. 2) ASSESS the risk if it cannot be avoided. 3) REDUCE the risk as much as possible.", ro: "Regulamentele privind Operațiunile de Manipulare Manuală din 1992 (MHOR) stabilesc legea. Angajatorii trebuie: 1) SĂ EVITE manipularea manuală periculoasă acolo unde este posibil. 2) SĂ EVALUEZE riscul dacă nu poate fi evitat. 3) SĂ REDUCĂ riscul cât mai mult posibil." } },
    { type: "rememberThis", text: { en: "MHOR 1992 hierarchy: 1) AVOID manual handling. 2) ASSESS the risk. 3) REDUCE the risk. Always try to AVOID first — use mechanical aids where possible.", ro: "Ierarhia MHOR 1992: 1) EVITAȚI manipularea manuală. 2) EVALUAȚI riscul. 3) REDUCEȚI riscul. Încercați întotdeauna să EVITAȚI mai întâi — folosiți ajutoare mecanice acolo unde este posibil." } },
    { type: "miniCheck", question: { en: "Under the Manual Handling Regulations, the FIRST thing an employer should do is:", ro: "Conform Regulamentelor privind Manipularea Manuală, PRIMUL lucru pe care trebuie să-l facă un angajator este:" }, options: [{ en: "Provide back support belts", ro: "Furnizați centuri de susținere a spatelui" }, { en: "Avoid hazardous manual handling where possible", ro: "Evitați manipularea manuală periculoasă acolo unde este posibil" }, { en: "Train all workers to lift correctly", ro: "Instruiți toți muncitorii să ridice corect" }, { en: "Buy stronger gloves", ro: "Cumpărați mănuși mai rezistente" }], correct: 1, feedback: { en: "Correct! AVOID is always the first step. Only if you can't avoid it, then assess and reduce the risk.", ro: "Corect! EVITAREA este întotdeauna primul pas. Doar dacă nu puteți evita, atunci evaluați și reduceți riscul." } },
  ],
  keySummary: [
    { en: "Manual handling = lifting, lowering, pushing, pulling, carrying by hand or body force.", ro: "Manipularea manuală = ridicare, coborâre, împingere, tragere, transport cu mâna sau forța corporală." },
    { en: "Most common injury = LOWER BACK INJURY. Long-term: osteoarthritis, chronic pain, disc problems.", ro: "Cea mai frecventă accidentare = LEZIUNE LA SPATELE INFERIOR. Pe termen lung: osteoartrită, dureri cronice, probleme de disc." },
    { en: "MHOR 1992: AVOID → ASSESS → REDUCE. Always try to avoid first.", ro: "MHOR 1992: EVITAȚI → EVALUAȚI → REDUCEȚI. Încercați întotdeauna să evitați mai întâi." },
    { en: "Over ONE THIRD of all workplace injuries are caused by manual handling.", ro: "Peste O TREIME din toate accidentările la locul de muncă sunt cauzate de manipularea manuală." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 2.2 — Safe Lifting Technique: Step by Step
   ══════════════════════════════════════════════ */

const lesson2_2: I18nLessonContent = {
  lessonId: "2.2",
  title: {
    en: "Safe Lifting Technique: Step by Step",
    ro: "Tehnica Corectă de Ridicare: Pas cu Pas",
  },
  videoPlaceholder: "Step-by-step demonstration of correct lifting technique on a construction site",
  keyTerms: [
    { en: "TILEO", ro: "TILEO", lt: "TILEO", bg: "TILEO", ar: "TILEO", ti: "TILEO", yo: "TILEO", ig: "TILEO", so: "TILEO", am: "TILEO" },
    { en: "Lifting", ro: "Ridicare", lt: "Kėlimas", bg: "Повдигане", ar: "رفع", ti: "ምልዓል", yo: "Gbígbé", ig: "Ibuli", so: "Qaadista", am: "ማንሳት" },
    { en: "PPE", ro: "EIP", lt: "AAP", bg: "ЛПС", ar: "معدات الوقاية الشخصية", ti: "PPE", yo: "PPE", ig: "PPE", so: "PPE", am: "PPE" },
  ],
  content: [
    { type: "paragraph", text: { en: "Before you lift anything, you MUST assess the risk using TILEO. This is the key assessment tool for manual handling and it WILL be on your test.", ro: "Înainte de a ridica ceva, TREBUIE să evaluați riscul folosind TILEO. Acesta este instrumentul cheie de evaluare pentru manipularea manuală și VA FI la testul dumneavoastră." } },
    { type: "bold", text: { en: "TILEO — The 5 Risk Factors for Manual Handling:", ro: "TILEO — Cei 5 Factori de Risc pentru Manipularea Manuală:" } },
    { type: "paragraph", text: { en: "T = TASK — What does the job involve? Twisting, bending, reaching, repetitive movements? I = INDIVIDUAL — Is the person fit and trained? Any health conditions? L = LOAD — How heavy, bulky, or awkward is it? Is it hot, sharp, or unstable? E = ENVIRONMENT — Is the floor wet or uneven? Is there enough space? Good lighting? O = OTHER — Is PPE needed? Are mechanical aids available? Is teamwork needed?", ro: "T = SARCINĂ — Ce implică munca? Răsucire, aplecare, întindere, mișcări repetitive? I = INDIVID — Este persoana aptă și instruită? Are probleme de sănătate? L = SARCINA FIZICĂ — Cât de grea, voluminoasă sau incomodă este? Este fierbinte, ascuțită sau instabilă? E = MEDIU — Este podeaua udă sau neuniformă? Este suficient spațiu? Iluminare bună? O = ALTELE — Este necesar EIP? Sunt disponibile ajutoare mecanice? Este nevoie de lucru în echipă?" } },
    { type: "rememberThis", text: { en: "TILEO = Task, Individual, Load, Environment, Other. This is the manual handling risk assessment. It WILL be on the test. Memorise it: T-I-L-E-O.", ro: "TILEO = Sarcină, Individ, Sarcină Fizică, Mediu, Altele. Aceasta este evaluarea riscului de manipulare manuală. VA FI la test. Memorați: T-I-L-E-O." } },
    { type: "miniCheck", question: { en: "TILEO stands for:", ro: "TILEO înseamnă:" }, options: [{ en: "Task, Individual, Load, Environment, Other", ro: "Sarcină, Individ, Sarcină Fizică, Mediu, Altele" }, { en: "Time, Inspection, Lifting, Equipment, Operation", ro: "Timp, Inspecție, Ridicare, Echipament, Operație" }, { en: "Training, Instruction, Load, Equipment, Organisation", ro: "Instruire, Instrucțiune, Sarcină, Echipament, Organizare" }, { en: "Task, Inspection, Lifting, Environment, Organisation", ro: "Sarcină, Inspecție, Ridicare, Mediu, Organizare" }], correct: 0, feedback: { en: "Correct! TILEO = Task, Individual, Load, Environment, Other. These are the 5 risk factors you must consider before any manual handling task.", ro: "Corect! TILEO = Sarcină, Individ, Sarcină Fizică, Mediu, Altele. Aceștia sunt cei 5 factori de risc pe care trebuie să-i luați în considerare înainte de orice sarcină de manipulare manuală." } },
    { type: "bold", text: { en: "The Correct Lifting Technique — Step by Step:", ro: "Tehnica Corectă de Ridicare — Pas cu Pas:" } },
    { type: "paragraph", text: { en: "Step 1: PLAN the lift — Where is the load going? Is the route clear? Do you need help? Step 2: POSITION your feet — Shoulder width apart, one foot slightly in front. Step 3: BEND your knees and hips — Keep your back STRAIGHT. Never bend at the waist.", ro: "Pasul 1: PLANIFICAȚI ridicarea — Unde merge sarcina? Este traseul liber? Aveți nevoie de ajutor? Pasul 2: POZIȚIONAȚI picioarele — La lățimea umerilor, un picior ușor în față. Pasul 3: ÎNDOIȚI genunchii și șoldurile — Mențineți spatele DREPT. Nu vă aplecați niciodată de la talie." } },
    { type: "paragraph", text: { en: "Step 4: GET A FIRM GRIP — Use the whole hand, not just fingertips. Step 5: LIFT with your LEGS — Push up through your legs, keeping the load close to your body. Step 6: MOVE SMOOTHLY — Don't twist your body. Turn with your feet. Step 7: SET DOWN — Lower by bending knees, then adjust position.", ro: "Pasul 4: PRINDEȚI FERM — Folosiți toată mâna, nu doar vârfurile degetelor. Pasul 5: RIDICAȚI cu PICIOARELE — Împingeți în sus prin picioare, ținând sarcina aproape de corp. Pasul 6: MIȘCAȚI-VĂ LIN — Nu vă răsuciți corpul. Întoarceți-vă cu picioarele. Pasul 7: AȘEZAȚI — Coborâți îndoind genunchii, apoi ajustați poziția." } },
    { type: "rememberThis", text: { en: "Safe lifting: FEET APART → BEND KNEES → STRAIGHT BACK → FIRM GRIP → LIFT WITH LEGS → LOAD CLOSE TO BODY → DON'T TWIST. If the load is too heavy: NEVER try alone — get help or use equipment.", ro: "Ridicare sigură: PICIOARE DEPĂRTATE → ÎNDOIȚI GENUNCHII → SPATE DREPT → PRIZĂ FERMĂ → RIDICAȚI CU PICIOARELE → SARCINA APROAPE DE CORP → NU VĂ RĂSUCIȚI. Dacă sarcina este prea grea: NU încercați NICIODATĂ singur — cereți ajutor sau folosiți echipament." } },
    { type: "testTip", text: { en: "The test loves questions about what to bend: the answer is KNEES, never your back or waist. Also remember: if a load is too heavy, the correct answer is ALWAYS to get help or use equipment — never 'try harder'.", ro: "Testul adoră întrebările despre ce trebuie îndoit: răspunsul este GENUNCHII, niciodată spatele sau talia. De asemenea, rețineți: dacă o sarcină este prea grea, răspunsul corect este ÎNTOTDEAUNA să cereți ajutor sau să folosiți echipament — niciodată 'încercați mai mult'." } },
    { type: "miniCheck", question: { en: "When lifting, you should bend your:", ro: "Când ridicați, ar trebui să îndoiți:" }, options: [{ en: "Back", ro: "Spatele" }, { en: "Waist", ro: "Talia" }, { en: "Knees and hips", ro: "Genunchii și șoldurile" }, { en: "Arms", ro: "Brațele" }], correct: 2, feedback: { en: "Correct! Always bend your knees and hips, keeping your back straight. Lift with your legs, not your back.", ro: "Corect! Îndoiți întotdeauna genunchii și șoldurile, menținând spatele drept. Ridicați cu picioarele, nu cu spatele." } },
    { type: "miniCheck", question: { en: "A load is too heavy for you to lift alone. You should:", ro: "O sarcină este prea grea pentru a o ridica singur. Ar trebui să:" }, options: [{ en: "Try your best and lift quickly", ro: "Încercați din răsputeri și ridicați repede" }, { en: "Ask for help or use mechanical equipment", ro: "Cereți ajutor sau folosiți echipament mecanic" }, { en: "Drag it along the floor", ro: "Trageți-o pe podea" }, { en: "Leave it and go home", ro: "Lăsați-o și plecați acasă" }], correct: 1, feedback: { en: "Correct! NEVER try to lift a load that is too heavy alone. Ask a colleague for help or use mechanical aids like a trolley or sack truck.", ro: "Corect! NU încercați NICIODATĂ să ridicați singur o sarcină prea grea. Cereți ajutor unui coleg sau folosiți ajutoare mecanice precum un cărucior sau un cărucior de saci." } },
  ],
  keySummary: [
    { en: "TILEO = Task, Individual, Load, Environment, Other — always assess before lifting.", ro: "TILEO = Sarcină, Individ, Sarcină Fizică, Mediu, Altele — evaluați întotdeauna înainte de ridicare." },
    { en: "Safe lift: feet apart, bend KNEES, straight back, firm grip, lift with LEGS, load close.", ro: "Ridicare sigură: picioare depărtate, îndoiți GENUNCHII, spate drept, priză fermă, ridicați cu PICIOARELE, sarcina aproape." },
    { en: "Never twist — turn with your FEET. Never lift with a bent BACK.", ro: "Nu vă răsuciți niciodată — întoarceți-vă cu PICIOARELE. Nu ridicați niciodată cu spatele APLECAT." },
    { en: "Too heavy? NEVER try alone. Get HELP or use EQUIPMENT.", ro: "Prea grea? NU încercați NICIODATĂ singur. Cereți AJUTOR sau folosiți ECHIPAMENT." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 2.3 — Lifting Aids and Mechanical Equipment
   ══════════════════════════════════════════════ */

const lesson2_3: I18nLessonContent = {
  lessonId: "2.3",
  title: {
    en: "Lifting Aids and Mechanical Equipment",
    ro: "Ajutoare de Ridicare și Echipament Mecanic",
  },
  videoPlaceholder: "Various lifting aids in use on a construction site — wheelbarrow, sack truck, pallet truck, forklift",
  keyTerms: [
    { en: "Wheelbarrow", ro: "Roabă", lt: "Karutis", bg: "Ръчна количка", ar: "عربة يد", ti: "ዊልባሮ", yo: "Kẹ̀kẹ́ ọwọ́", ig: "Wiilbaro", so: "Gaari gacmeed", am: "ባሮ" },
    { en: "Sack Truck", ro: "Cărucior de Saci", lt: "Maišų vežimėlis", bg: "Транспортна количка", ar: "عربة أكياس", ti: "ሳክ ትራክ", yo: "Kẹ̀kẹ́ àpò", ig: "Trọk akpa", so: "Gaari kiishash", am: "ጆንያ ጋሪ" },
    { en: "Pallet Truck", ro: "Transpalet", lt: "Padėklų vežimėlis", bg: "Палетна количка", ar: "رافعة البليتات", ti: "ፓለት ትራክ", yo: "Kẹ̀kẹ́ pálẹ́tì", ig: "Trọk palet", so: "Gaari baalad", am: "ፓሌት ጋሪ" },
  ],
  content: [
    { type: "paragraph", text: { en: "Whenever possible, you should use MECHANICAL AIDS instead of manual lifting. This is the first step in the manual handling hierarchy: AVOID manual handling by using equipment.", ro: "Ori de câte ori este posibil, ar trebui să folosiți AJUTOARE MECANICE în loc de ridicare manuală. Acesta este primul pas în ierarhia manipulării manuale: EVITAȚI manipularea manuală folosind echipament." } },
    { type: "bold", text: { en: "Common Lifting Aids on Construction Sites:", ro: "Ajutoare de Ridicare Comune pe Șantiere:" } },
    { type: "paragraph", text: { en: "WHEELBARROW — for moving loose materials like sand, gravel, and cement. SACK TRUCK — for moving heavy sacks, boxes, and drums. PALLET TRUCK — for moving palletised loads across flat surfaces. TROLLEY — for general movement of tools and materials.", ro: "ROABĂ — pentru mutarea materialelor în vrac precum nisip, pietriș și ciment. CĂRUCIOR DE SACI — pentru mutarea sacilor grei, cutiilor și butoaielor. TRANSPALET — pentru mutarea sarcinilor paletizate pe suprafețe plane. CĂRUCIOR — pentru mutarea generală a uneltelor și materialelor." } },
    { type: "paragraph", text: { en: "FORKLIFT TRUCK — for lifting and moving heavy loads. ONLY trained and certified operators can use forklifts. CRANE — for lifting extremely heavy loads. Operated by specialist trained personnel only. CONVEYOR BELT — for moving materials continuously over distances.", ro: "STIVUITOR — pentru ridicarea și mutarea sarcinilor grele. DOAR operatorii instruiți și certificați pot folosi stivuitoare. MACARA — pentru ridicarea sarcinilor extrem de grele. Operată doar de personal specialist instruit. BANDĂ TRANSPORTOARE — pentru mutarea continuă a materialelor pe distanțe." } },
    { type: "rememberThis", text: { en: "Lifting aids: wheelbarrow, sack truck, pallet truck, trolley, forklift, crane, conveyor. ALWAYS use equipment when available — it's SAFER and it's the LAW (MHOR 1992: avoid manual handling first).", ro: "Ajutoare de ridicare: roabă, cărucior de saci, transpalet, cărucior, stivuitor, macara, bandă transportoare. FOLOSIȚI ÎNTOTDEAUNA echipamentul când este disponibil — este MAI SIGUR și este LEGEA (MHOR 1992: evitați mai întâi manipularea manuală)." } },
    { type: "testTip", text: { en: "If a test question asks 'What should you do if a load is too heavy?' — the answer is NEVER 'try harder' or 'get more workers'. The best answer is: use mechanical equipment (forklift, crane, pallet truck) or break the load into smaller parts.", ro: "Dacă o întrebare de test întreabă 'Ce ar trebui să faceți dacă o sarcină este prea grea?' — răspunsul nu este NICIODATĂ 'încercați mai mult' sau 'luați mai mulți muncitori'. Cel mai bun răspuns este: folosiți echipament mecanic (stivuitor, macara, transpalet) sau împărțiți sarcina în părți mai mici." } },
    { type: "miniCheck", question: { en: "Who is allowed to operate a forklift truck on site?", ro: "Cine are voie să opereze un stivuitor pe șantier?" }, options: [{ en: "Any worker who has watched someone else do it", ro: "Orice muncitor care a văzut pe altcineva făcând" }, { en: "Only trained and certified operators", ro: "Doar operatorii instruiți și certificați" }, { en: "Anyone over 18 years old", ro: "Oricine peste 18 ani" }, { en: "The site manager only", ro: "Doar managerul de șantier" }], correct: 1, feedback: { en: "Correct! Only trained and certified operators may use forklifts. Using one without proper training is illegal and extremely dangerous.", ro: "Corect! Doar operatorii instruiți și certificați pot folosi stivuitoare. Folosirea unuia fără instruire corespunzătoare este ilegală și extrem de periculoasă." } },
    { type: "paragraph", text: { en: "Before using ANY lifting aid, you must CHECK it first. Inspect for damage, check wheels and brakes, ensure it's rated for the weight. Report any defects immediately and DO NOT USE damaged equipment.", ro: "Înainte de a folosi ORICE ajutor de ridicare, trebuie SĂ-L VERIFICAȚI mai întâi. Inspectați pentru deteriorări, verificați roțile și frânele, asigurați-vă că este dimensionat pentru greutate. Raportați imediat orice defecte și NU FOLOSIȚI echipament deteriorat." } },
    { type: "rememberThis", text: { en: "ALWAYS inspect equipment before use. Check: wheels, brakes, weight rating, visible damage. If defective: STOP, TAG IT, REPORT IT, DO NOT USE.", ro: "VERIFICAȚI ÎNTOTDEAUNA echipamentul înainte de utilizare. Verificați: roți, frâne, capacitate de greutate, deteriorări vizibile. Dacă este defect: OPRIȚI, ETICHETAȚI, RAPORTAȚI, NU FOLOSIȚI." } },
    { type: "miniCheck", question: { en: "Before using a pallet truck, you should:", ro: "Înainte de a folosi un transpalet, ar trebui să:" }, options: [{ en: "Just start using it immediately", ro: "Începeți să-l folosiți imediat" }, { en: "Ask the foreman for permission only", ro: "Cereți doar permisiunea șefului de echipă" }, { en: "Inspect it for damage, check wheels and brakes, and ensure it's rated for the load weight", ro: "Inspectați-l pentru deteriorări, verificați roțile și frânele și asigurați-vă că este dimensionat pentru greutatea sarcinii" }, { en: "Wipe it clean", ro: "Ștergeți-l curat" }], correct: 2, feedback: { en: "Correct! Always inspect lifting equipment before use. Check for damage, test wheels and brakes, and verify the weight capacity.", ro: "Corect! Inspectați întotdeauna echipamentul de ridicare înainte de utilizare. Verificați deteriorările, testați roțile și frânele și verificați capacitatea de greutate." } },
  ],
  keySummary: [
    { en: "Lifting aids: wheelbarrow, sack truck, pallet truck, trolley, forklift, crane, conveyor.", ro: "Ajutoare de ridicare: roabă, cărucior de saci, transpalet, cărucior, stivuitor, macara, bandă transportoare." },
    { en: "Only TRAINED and CERTIFIED operators can use forklifts and cranes.", ro: "Doar operatorii INSTRUIȚI și CERTIFICAȚI pot folosi stivuitoare și macarale." },
    { en: "ALWAYS inspect equipment before use: wheels, brakes, weight rating, damage.", ro: "VERIFICAȚI ÎNTOTDEAUNA echipamentul înainte de utilizare: roți, frâne, capacitate, deteriorări." },
    { en: "Defective equipment: STOP → TAG → REPORT → DO NOT USE.", ro: "Echipament defect: OPRIȚI → ETICHETAȚI → RAPORTAȚI → NU FOLOSIȚI." },
  ],
};

/* ══════════════════════════════════════════════
   LESSON 2.4 — Safe Storage of Materials
   ══════════════════════════════════════════════ */

const lesson2_4: I18nLessonContent = {
  lessonId: "2.4",
  title: {
    en: "Safe Storage of Materials",
    ro: "Depozitarea Sigură a Materialelor",
  },
  videoPlaceholder: "Properly stacked and stored construction materials on site — pallets, bricks, timber, pipes",
  keyTerms: [
    { en: "Stacking", ro: "Stivuire", lt: "Krauti", bg: "Подреждане", ar: "تكديس", ti: "ምድርዳር", yo: "Dídi", ig: "Ikwụ elu", so: "Saare", am: "መደርደር" },
    { en: "Safe Storage", ro: "Depozitare Sigură", lt: "Saugus saugojimas", bg: "Безопасно съхранение", ar: "تخزين آمن", ti: "ውሑስ ዕቃ ምቕማጥ", yo: "Ìpamọ́ aláàbò", ig: "Nchekwa nchekwa", so: "Kaydinta badbaadada", am: "ደህና ማከማቸት" },
  ],
  content: [
    { type: "paragraph", text: { en: "Poor storage of materials is a major cause of accidents on construction sites. Materials can fall, collapse, or block escape routes. Proper storage keeps everyone safe and makes the site more efficient.", ro: "Depozitarea necorespunzătoare a materialelor este o cauză majoră de accidente pe șantierele de construcții. Materialele pot cădea, se pot prăbuși sau pot bloca căile de evacuare. Depozitarea corectă menține siguranța tuturor și face șantierul mai eficient." } },
    { type: "bold", text: { en: "Rules for Safe Stacking and Storage:", ro: "Reguli pentru Stivuire și Depozitare Sigură:" } },
    { type: "paragraph", text: { en: "1. Stack on LEVEL, FIRM ground only — never on soft or uneven surfaces. 2. DON'T stack too high — follow height limits for each material type. 3. BRICKS: stack no more than 2 metres high on a pallet. Use banding to secure.", ro: "1. Stivuiți doar pe teren NETED și FERM — niciodată pe suprafețe moi sau neuniforme. 2. NU stivuiți prea sus — respectați limitele de înălțime pentru fiecare tip de material. 3. CĂRĂMIZI: stivuiți maxim 2 metri înălțime pe un palet. Folosiți benzi pentru fixare." } },
    { type: "paragraph", text: { en: "4. TIMBER: store flat on bearers, off the ground, with spacers between layers. 5. PIPES and TUBES: use chocks or wedges to stop them rolling. 6. Keep WALKWAYS and EMERGENCY EXITS clear at all times. 7. Store HEAVY items LOW, light items HIGH.", ro: "4. LEMN: depozitați orizontal pe suporturi, deasupra solului, cu distanțiere între straturi. 5. ȚEVI și TUBURI: folosiți opritoare sau pene pentru a împiedica rostogolirea. 6. Mențineți CĂILE DE ACCES și IEȘIRILE DE URGENȚĂ libere în permanență. 7. Depozitați obiectele GRELE JOS, obiectele ușoare SUS." } },
    { type: "rememberThis", text: { en: "Storage rules: level ground, don't stack too high, bricks max 2m on pallet, timber on bearers off ground, pipes chocked/wedged, walkways ALWAYS clear, heavy items LOW.", ro: "Reguli de depozitare: teren neted, nu stivuiți prea sus, cărămizi maxim 2m pe palet, lemn pe suporturi deasupra solului, țevi fixate, căi de acces MEREU libere, obiecte grele JOS." } },
    { type: "testTip", text: { en: "Test questions about storage often ask about pipes/tubes. Remember: pipes must be CHOCKED or WEDGED to stop them rolling. Also common: 'Where should heavy items be stored?' — answer: LOW DOWN, light items higher up.", ro: "Întrebările de test despre depozitare întreabă adesea despre țevi/tuburi. Rețineți: țevile trebuie FIXATE sau OPRITE pentru a nu se rostogoli. De asemenea frecvent: 'Unde ar trebui depozitate obiectele grele?' — răspuns: JOS, obiectele ușoare mai sus." } },
    { type: "miniCheck", question: { en: "How should pipes and tubes be stored on site?", ro: "Cum ar trebui depozitate țevile și tuburile pe șantier?" }, options: [{ en: "Leaned against a wall", ro: "Sprijinite de un perete" }, { en: "Chocked or wedged to prevent rolling", ro: "Fixate sau oprite pentru a preveni rostogolirea" }, { en: "Placed loose on the ground", ro: "Așezate liber pe pământ" }, { en: "Suspended from ropes", ro: "Suspendate de frânghii" }], correct: 1, feedback: { en: "Correct! Pipes and tubes must be CHOCKED or WEDGED to stop them rolling. Loose pipes are a serious tripping and crushing hazard.", ro: "Corect! Țevile și tuburile trebuie FIXATE sau OPRITE pentru a nu se rostogoli. Țevile nefixate sunt un pericol serios de împiedicare și strivire." } },
    { type: "paragraph", text: { en: "HAZARDOUS SUBSTANCES must be stored separately in locked, labelled containers. Follow COSHH requirements (you'll learn more in Module 4). Flammable materials must be kept away from heat sources and ignition points.", ro: "SUBSTANȚELE PERICULOASE trebuie depozitate separat în recipiente închise și etichetate. Respectați cerințele COSHH (veți învăța mai multe în Modulul 4). Materialele inflamabile trebuie ținute departe de surse de căldură și puncte de aprindere." } },
    { type: "rememberThis", text: { en: "Hazardous substances: store in LOCKED, LABELLED containers, SEPARATE from other materials. Flammable = away from heat sources. Follow COSHH data sheets.", ro: "Substanțe periculoase: depozitați în recipiente ÎNCHISE, ETICHETATE, SEPARATE de alte materiale. Inflamabile = departe de surse de căldură. Respectați fișele de date COSHH." } },
    { type: "paragraph", text: { en: "Good housekeeping means keeping the site tidy at ALL times. Remove waste regularly. Don't let materials pile up in walkways. A clean site is a SAFE site.", ro: "Buna gospodărire înseamnă menținerea curățeniei pe șantier ÎN PERMANENȚĂ. Îndepărtați deșeurile regulat. Nu lăsați materialele să se acumuleze pe căile de acces. Un șantier curat este un șantier SIGUR." } },
    { type: "miniCheck", question: { en: "Where should heavy items be stored on a shelf or rack?", ro: "Unde ar trebui depozitate obiectele grele pe un raft sau suport?" }, options: [{ en: "At the top, where they're out of the way", ro: "Sus, unde nu deranjează" }, { en: "At the bottom/low level", ro: "Jos/la nivel scăzut" }, { en: "In the middle", ro: "La mijloc" }, { en: "It doesn't matter", ro: "Nu contează" }], correct: 1, feedback: { en: "Correct! Heavy items should ALWAYS be stored LOW DOWN. This reduces the risk of them falling and makes them easier to lift safely.", ro: "Corect! Obiectele grele ar trebui ÎNTOTDEAUNA depozitate JOS. Aceasta reduce riscul căderii lor și le face mai ușor de ridicat în siguranță." } },
  ],
  keySummary: [
    { en: "Stack on level, firm ground. Bricks max 2m high on pallets. Timber on bearers off ground.", ro: "Stivuiți pe teren neted și ferm. Cărămizi maxim 2m pe paleți. Lemn pe suporturi deasupra solului." },
    { en: "Pipes/tubes: CHOCK or WEDGE to prevent rolling.", ro: "Țevi/tuburi: FIXAȚI sau OPRIȚI pentru a preveni rostogolirea." },
    { en: "Heavy items LOW, light items HIGH. Keep walkways and exits CLEAR.", ro: "Obiecte grele JOS, obiecte ușoare SUS. Mențineți căile de acces și ieșirile LIBERE." },
    { en: "Hazardous substances: LOCKED, LABELLED containers, separate from other materials.", ro: "Substanțe periculoase: recipiente ÎNCHISE, ETICHETATE, separate de alte materiale." },
  ],
};

/* ══════════════════════════════════════════════
   EXPORT ALL MODULE 2 LESSONS
   ══════════════════════════════════════════════ */

export const MODULE_2_LESSONS: I18nLessonContent[] = [
  lesson2_1,
  lesson2_2,
  lesson2_3,
  lesson2_4,
];

export const getModule2Lesson = (lessonId: number): I18nLessonContent | undefined =>
  MODULE_2_LESSONS[lessonId - 1];
