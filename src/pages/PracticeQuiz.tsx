import { useParams, Link } from "react-router-dom";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Brain, ListChecks, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MODULES } from "@/data/courseData";
import { getQuestionsForModule, getFlashcardsForModule } from "@/data/quizQuestions";
import { useProgress } from "@/contexts/ProgressContext";
import { getModuleProgress, isPracticeUnlocked } from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import FullQuiz from "@/components/practice/FullQuiz";
import FlashcardMode from "@/components/practice/FlashcardMode";
import { useTelemetry } from "@/hooks/useTelemetry";
import { getConceptIdMap } from "@/lib/conceptMap";

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

  const [quizStarted, setQuizStarted] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
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
        <p className="text-muted-foreground">Topic not found.</p>
        <Link to="/learn" className="text-primary underline text-sm">
          Back to lessons
        </Link>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        <Link
          to={`/module/${moduleId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
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

  if (showFlashcards) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        <div>
          <button
            onClick={() => setShowFlashcards(false)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to practice
          </button>
          <h1 className="text-lg font-bold mt-1 text-foreground">
            Flashcards — {mod.title}
          </h1>
        </div>
        <FlashcardMode cards={flashcards} />
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
          <ArrowLeft className="h-4 w-4" /> Topic {moduleId}
        </Link>
        <h1 className="text-lg font-bold mt-1 text-foreground">
          Practice — {mod.title}
        </h1>
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

      {/* Test-like reminder */}
      <div className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-lg px-3 py-2">
        <Brain className="h-4 w-4 text-secondary shrink-0" />
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Test yourself</span>{" "}
          — just like the real thing.
        </p>
      </div>

      {/* Main practice content */}
      {!quizStarted && (
        <div className="text-center space-y-4 py-6">
          <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <ListChecks className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Practice — {questions.length} questions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Timed · No going back
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Score 80%+ to unlock the test
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
            className="h-12 px-8 text-base font-semibold w-full max-w-xs"
          >
            Start Practice
          </Button>

          {flashcards.length > 0 && (
            <button
              onClick={() => setShowFlashcards(true)}
              className="text-sm text-primary hover:underline flex items-center gap-1.5 mx-auto"
            >
              <Layers className="h-4 w-4" />
              Or try flashcards
            </button>
          )}
        </div>
      )}

      {quizStarted && (
        <FullQuiz questions={questions} onComplete={handleQuizComplete} onConceptAttempt={handleConceptAttempt} />
      )}
    </div>
  );
};

export default PracticeQuiz;