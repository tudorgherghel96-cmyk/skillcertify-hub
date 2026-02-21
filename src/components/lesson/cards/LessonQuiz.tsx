import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correct: string;
  explanation: string;
  test_tip?: string;
  ac_reference?: string;
}

interface LessonQuizProps {
  title: string;
  subtitle?: string;
  pass_threshold: number;
  questions: QuizQuestion[];
  lessonId: string;
  onQuizComplete: (passed: boolean, score: number, total: number) => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function LessonQuiz({
  title,
  subtitle,
  pass_threshold,
  questions: rawQuestions,
  lessonId,
  onQuizComplete,
}: LessonQuizProps) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState(() => shuffleArray(rawQuestions));
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);

  const q = questions[currentQ];
  const isCorrect = confirmed && selected === q?.correct;
  const isWrong = confirmed && selected !== q?.correct;

  const score = useMemo(() => {
    if (!showResults) return 0;
    return questions.reduce(
      (acc, qq) => acc + (answers[qq.id] === qq.correct ? 1 : 0),
      0,
    );
  }, [showResults, questions, answers]);

  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  const passed = pct >= pass_threshold * 100;
  const examReady = pct >= 80;

  const handleConfirm = useCallback(() => {
    if (!selected || !q) return;
    setConfirmed(true);
    setAnswers((prev) => ({ ...prev, [q.id]: selected }));
  }, [selected, q]);

  const handleNext = useCallback(() => {
    if (currentQ < total - 1) {
      setCurrentQ((i) => i + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setShowResults(true);
    }
  }, [currentQ, total]);

  const handleFinish = useCallback(async () => {
    const finalScore = questions.reduce(
      (acc, qq) => acc + (answers[qq.id] === qq.correct ? 1 : 0),
      0,
    );
    const finalPassed = Math.round((finalScore / total) * 100) >= pass_threshold * 100;

    if (user) {
      setSaving(true);
      await supabase.from("lesson_quiz_attempts" as any).insert({
        user_id: user.id,
        lesson_id: lessonId,
        score: finalScore,
        total,
        passed: finalPassed,
        answers_json: answers,
      });
      setSaving(false);
    }

    onQuizComplete(finalPassed, finalScore, total);
  }, [questions, answers, total, pass_threshold, user, lessonId, onQuizComplete]);

  const handleRetry = useCallback(() => {
    setQuestions(shuffleArray(rawQuestions));
    setCurrentQ(0);
    setSelected(null);
    setConfirmed(false);
    setAnswers({});
    setShowResults(false);
  }, [rawQuestions]);

  // Results screen
  if (showResults) {
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div
        className="flex flex-col items-center justify-center h-full px-6"
        style={{ background: "#0a0a0f" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Circular gauge */}
        <div className="relative mb-6">
          <svg width="140" height="140" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={examReady ? "#22c55e" : passed ? "#f59e0b" : "#ef4444"}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{pct}%</span>
            <span className="text-xs text-white/50">{score}/{total}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-2">
          {examReady ? "🎉 Excellent!" : passed ? "✅ Quiz Passed" : "❌ Keep Practising"}
        </h2>

        <p className="text-sm text-white/60 text-center mb-2 max-w-xs">
          {examReady
            ? `You scored ${pct}%. You're on track to pass the GQA exam!`
            : passed
            ? `You scored ${pct}%. You passed, but aim for 80%+ for the real exam.`
            : `You scored ${pct}%. You need ${Math.round(pass_threshold * 100)}% to continue. Review the lesson and try again.`}
        </p>

        {!examReady && (
          <p className="text-xs text-amber-400/80 text-center mb-6 max-w-xs">
            💡 The GQA exam requires 80%. Keep practising!
          </p>
        )}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={handleRetry}
            className="h-12 rounded-2xl bg-white/10 border border-white/15 text-white font-semibold text-sm"
          >
            🔄 Try Again
          </button>
          {passed && (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="h-12 rounded-2xl bg-amber-500 text-white font-bold text-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : "Continue →"}
            </button>
          )}
          {!passed && (
            <p className="text-xs text-white/40 text-center">
              Score at least {Math.round(pass_threshold * 100)}% to continue to the next lesson.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!q) return null;

  // Question screen
  return (
    <div
      className="flex flex-col h-full px-5 pt-6 pb-8"
      style={{ background: "#0a0a0f" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Progress */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/50 font-medium">{title}</span>
        <span className="text-xs text-white/50">
          {currentQ + 1} of {total}
        </span>
      </div>
      <div className="h-1 bg-white/10 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentQ + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col"
        >
          <p className="text-white text-base font-semibold leading-snug mb-5">
            {q.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5 flex-1">
            {q.options.map((opt, idx) => {
              const isSelected = selected === opt.id;
              const isAnswer = opt.id === q.correct;
              let bg = "rgba(255,255,255,0.06)";
              let border = "rgba(255,255,255,0.1)";
              let labelBg = "rgba(255,255,255,0.08)";

              if (confirmed) {
                if (isAnswer) {
                  bg = "rgba(34,197,94,0.15)";
                  border = "rgba(34,197,94,0.5)";
                  labelBg = "rgba(34,197,94,0.3)";
                } else if (isSelected && !isAnswer) {
                  bg = "rgba(239,68,68,0.15)";
                  border = "rgba(239,68,68,0.5)";
                  labelBg = "rgba(239,68,68,0.3)";
                }
              } else if (isSelected) {
                bg = "rgba(245,158,11,0.15)";
                border = "rgba(245,158,11,0.5)";
                labelBg = "rgba(245,158,11,0.3)";
              }

              return (
                <button
                  key={opt.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!confirmed) setSelected(opt.id);
                  }}
                  disabled={confirmed}
                  style={{ background: bg, borderColor: border }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200"
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: labelBg }}
                  >
                    {OPTION_LABELS[idx]}
                  </span>
                  <span className="text-sm text-white/90 leading-snug">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {confirmed && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3.5 rounded-xl border space-y-2"
              style={{
                background: isCorrect ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                borderColor: isCorrect ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
              }}
            >
              <p className="text-xs text-white/70 leading-relaxed">
                {q.explanation}
              </p>
              {q.test_tip && (
                <div className="flex items-start gap-2 bg-amber-500/10 rounded-lg p-2.5 border border-amber-500/20">
                  <span className="text-amber-400 text-xs font-bold shrink-0">
                    📝 TEST TIP
                  </span>
                  <span className="text-xs text-amber-200/80 leading-relaxed">
                    {q.test_tip}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action button */}
      <div className="mt-4">
        {!confirmed ? (
          <button
            onClick={(e) => { e.stopPropagation(); handleConfirm(); }}
            disabled={!selected}
            className="w-full h-12 rounded-2xl bg-amber-500 text-white font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
          >
            Confirm Answer
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="w-full h-12 rounded-2xl bg-white/10 border border-white/15 text-white font-semibold text-sm"
          >
            {currentQ < total - 1 ? "Next Question →" : "See Results"}
          </button>
        )}
      </div>
    </div>
  );
}
