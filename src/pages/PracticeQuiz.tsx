import { useParams, Link } from "react-router-dom";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Brain, ListChecks, Layers, Zap, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MODULES } from "@/data/courseData";
import { getQuestionsForModule, getFlashcardsForModule, pickNextDrillQuestion } from "@/data/quizQuestions";
import { useProgress } from "@/contexts/ProgressContext";
import { getModuleProgress, isPracticeUnlocked } from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import FullQuiz from "@/components/practice/FullQuiz";
import FlashcardMode from "@/components/practice/FlashcardMode";
import DrillMode from "@/components/practice/DrillMode";
import SpeedChallenge from "@/components/practice/SpeedChallenge";
import { useTelemetry } from "@/hooks/useTelemetry";
import { getConceptIdMap } from "@/lib/conceptMap";

type PracticeMode = "menu" | "full" | "smart" | "speed" | "flashcards";

const PracticeQuiz = () => {
  const { moduleId: mIdStr } = useParams();
  const moduleId = Number(mIdStr);
  const { progress, recordPractice } = useProgress();
  const { isSuperUser } = useSuperUser();
  const { trackPracticeAttempt, trackConceptAttempt } = useTelemetry();
  const mp = getModuleProgress(progress, moduleId);
  const conceptMapRef = useRef<Record<string, string>>({});

  useEffect(() => {
    getConceptIdMap().then((map) => {
      conceptMapRef.current = map;
    });
  }, []);

  const handleConceptAttempt = useCallback(
    (conceptSlug: string, isCorrect: boolean, responseTimeMs: number) => {
      const conceptId = conceptMapRef.current[conceptSlug];
      if (conceptId) {
        trackConceptAttempt(conceptId, isCorrect, responseTimeMs);
      }
    },
    [trackConceptAttempt]
  );

  const mod = MODULES.find((m) => m.id === moduleId);
  const questions = useMemo(() => getQuestionsForModule(moduleId), [moduleId]);
  const flashcards = useMemo(() => getFlashcardsForModule(moduleId), [moduleId]);

  const unlocked = isPracticeUnlocked(mp, mod?.lessons.length ?? 0, isSuperUser);

  const [mode, setMode] = useState<PracticeMode>("menu");
  const [lastScore, setLastScore] = useState<number | null>(null);

  const handleQuizComplete = (score: number, answers: { questionId: string; selectedIndex: number; correct: boolean }[]) => {
    const pct = Math.round((answers.filter(a => a.correct).length / answers.length) * 100);
    setLastScore(pct);
    recordPractice(moduleId, pct);
    trackPracticeAttempt(moduleId, answers.filter(a => a.correct).length, answers.length, "full", answers);
    setMode("menu");
  };

  if (!mod) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">Topic not found.</p>
        <Link to="/learn" className="text-primary underline text-sm">Back to lessons</Link>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        <Link to={`/module/${moduleId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Topic {moduleId}
        </Link>
        <div className="text-center space-y-3 py-12">
          <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Brain className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Practice Locked</h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Finish all {mod.lessons.length} lessons in Topic {moduleId} to unlock practice.
          </p>
          <Button asChild variant="outline">
            <Link to={`/module/${moduleId}`}>Go to lessons</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Flashcard mode
  if (mode === "flashcards") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        <div>
          <button onClick={() => setMode("menu")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to practice
          </button>
          <h1 className="text-lg font-bold mt-1 text-foreground">Flashcards — {mod.title}</h1>
        </div>
        <FlashcardMode cards={flashcards} />
      </div>
    );
  }

  // Full quiz
  if (mode === "full") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        <FullQuiz questions={questions} onComplete={handleQuizComplete} onConceptAttempt={handleConceptAttempt} />
      </div>
    );
  }

  // Smart practice (drill mode)
  if (mode === "smart") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        <div>
          <button onClick={() => setMode("menu")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to practice
          </button>
          <h1 className="text-lg font-bold mt-1 text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> Smart Practice — {mod.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Prioritises questions you got wrong and topics that are fading
          </p>
        </div>
        <DrillMode questions={questions} onConceptAttempt={handleConceptAttempt} />
      </div>
    );
  }

  // Speed challenge
  if (mode === "speed") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        <SpeedChallenge questions={questions} onClose={() => setMode("menu")} onConceptAttempt={handleConceptAttempt} />
      </div>
    );
  }

  // Menu
  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
      {/* Header */}
      <div>
        <Link
          to={`/module/${moduleId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Topic {moduleId}
        </Link>
        <h1 className="text-lg font-bold mt-1 text-foreground">Practice — {mod.title}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">
            Best score: {mp.practice.bestScore}% · {mp.practice.attempts} attempt{mp.practice.attempts !== 1 ? "s" : ""}
          </span>
          {mp.practice.bestScore >= 80 && (
            <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
              Test unlocked ✓
            </span>
          )}
        </div>
      </div>

      {/* Mode cards */}
      <div className="space-y-3">
        {/* Full Practice */}
        <button
          onClick={() => setMode("full")}
          className="w-full text-left border-2 border-border rounded-xl p-4 bg-card hover:border-primary/40 transition-colors space-y-1 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ListChecks className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Full Practice</p>
              <p className="text-xs text-muted-foreground">{questions.length} questions · Timed · Score 80%+ to unlock test</p>
            </div>
          </div>
          {lastScore !== null && (
            <div className={`text-xs font-semibold mt-2 inline-block px-2.5 py-1 rounded-full ${
              lastScore >= 80 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            }`}>
              Last: {lastScore}%
            </div>
          )}
        </button>

        {/* Smart Practice */}
        <button
          onClick={() => setMode("smart")}
          className="w-full text-left border-2 border-border rounded-xl p-4 bg-card hover:border-primary/40 transition-colors active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <Brain className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Smart Practice</p>
              <p className="text-xs text-muted-foreground">Focuses on your weak spots · Spaced repetition</p>
            </div>
          </div>
        </button>

        {/* Speed Challenge */}
        <button
          onClick={() => setMode("speed")}
          className="w-full text-left border-2 border-border rounded-xl p-4 bg-card hover:border-primary/40 transition-colors active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <Timer className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Speed Challenge</p>
              <p className="text-xs text-muted-foreground">60 seconds · Answer fast · Beat your best!</p>
            </div>
            {(() => {
              try {
                const best = localStorage.getItem("sc_speed_best");
                if (best && parseInt(best) > 0) {
                  return <span className="text-xs font-bold text-primary">Best: {best}</span>;
                }
              } catch {}
              return null;
            })()}
          </div>
        </button>

        {/* Flashcards */}
        {flashcards.length > 0 && (
          <button
            onClick={() => setMode("flashcards")}
            className="w-full text-left border-2 border-border rounded-xl p-4 bg-card hover:border-primary/40 transition-colors active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Layers className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Flashcards</p>
                <p className="text-xs text-muted-foreground">{flashcards.length} cards · Key facts & test tips</p>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticeQuiz;
