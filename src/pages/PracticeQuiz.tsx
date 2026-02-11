import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowLeft, Brain, ListChecks, Repeat, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MODULES } from "@/data/courseData";
import { getQuestionsForModule, getFlashcardsForModule } from "@/data/quizQuestions";
import { useProgress } from "@/contexts/ProgressContext";
import { getModuleProgress, isPracticeUnlocked } from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import FullQuiz from "@/components/practice/FullQuiz";
import DrillMode from "@/components/practice/DrillMode";
import FlashcardMode from "@/components/practice/FlashcardMode";
import { useTelemetry } from "@/hooks/useTelemetry";

type Mode = "full" | "drill" | "flashcards";

const TABS: { key: Mode; label: string; icon: typeof ListChecks }[] = [
  { key: "full", label: "Full Quiz", icon: ListChecks },
  { key: "drill", label: "Drill Mode", icon: Repeat },
  { key: "flashcards", label: "Flashcards", icon: Layers },
];

const PracticeQuiz = () => {
  const { moduleId: mIdStr } = useParams();
  const moduleId = Number(mIdStr);
  const { progress, recordPractice } = useProgress();
  const { isSuperUser } = useSuperUser();
  const { trackPracticeAttempt } = useTelemetry();
  const mp = getModuleProgress(progress, moduleId);

  const mod = MODULES.find((m) => m.id === moduleId);
  const questions = useMemo(() => getQuestionsForModule(moduleId), [moduleId]);
  const flashcards = useMemo(() => getFlashcardsForModule(moduleId), [moduleId]);

  const unlocked = isPracticeUnlocked(mp, mod?.lessons.length ?? 0, isSuperUser);

  const [mode, setMode] = useState<Mode>("full");
  const [quizStarted, setQuizStarted] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const handleQuizComplete = (score: number, answers: { questionId: string; selectedIndex: number; correct: boolean }[]) => {
    const pct = Math.round((answers.filter(a => a.correct).length / answers.length) * 100);
    setLastScore(pct);
    recordPractice(moduleId, pct);
    trackPracticeAttempt(moduleId, answers.filter(a => a.correct).length, answers.length, "full", answers);
    setQuizStarted(false);
  };

  if (!mod) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">Module not found.</p>
        <Link to="/dashboard" className="text-primary underline text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Gate: must complete all lessons first
  if (!unlocked) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        <Link
          to={`/module/${moduleId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Module {moduleId}
        </Link>
        <div className="text-center space-y-3 py-12">
          <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Brain className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Practice Locked</h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Complete all {mod.lessons.length} lessons in Module {moduleId} to
            unlock the practice quiz.
          </p>
          <Button asChild variant="outline">
            <Link to={`/module/${moduleId}`}>Go to Lessons</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
      {/* Header */}
      <div>
        <Link
          to={`/module/${moduleId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Module {moduleId}
        </Link>
        <h1 className="text-lg font-bold mt-1 text-foreground">
          Practice — {mod.title}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">
            Best score: {mp.practice.bestScore}% · Attempts:{" "}
            {mp.practice.attempts}
          </span>
          {mp.practice.bestScore >= 80 && (
            <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
              GQA Unlocked ✓
            </span>
          )}
        </div>
      </div>

      {/* Closed book reminder */}
      <div className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-lg px-3 py-2">
        <Brain className="h-4 w-4 text-secondary shrink-0" />
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Exam conditions</span>{" "}
          — no hints, no going back. Train your memory.
        </p>
      </div>

      {/* Mode tabs */}
      {!quizStarted && (
        <div className="flex bg-muted rounded-xl p-1 gap-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                mode === key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {mode === "full" && !quizStarted && (
        <div className="text-center space-y-4 py-6">
          <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <ListChecks className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Full Quiz</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {questions.length} questions · Timed · No going back
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Score 80%+ to unlock the GQA Module {moduleId} Test
            </p>
          </div>

          {lastScore !== null && (
            <div
              className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold ${
                lastScore >= 80
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              Last attempt: {lastScore}%
            </div>
          )}

          <Button
            onClick={() => setQuizStarted(true)}
            className="h-12 px-8 text-base font-semibold"
          >
            Start Quiz
          </Button>
        </div>
      )}

      {mode === "full" && quizStarted && (
        <FullQuiz questions={questions} onComplete={handleQuizComplete} />
      )}

      {mode === "drill" && <DrillMode questions={questions} />}

      {mode === "flashcards" && <FlashcardMode cards={flashcards} />}
    </div>
  );
};

export default PracticeQuiz;
