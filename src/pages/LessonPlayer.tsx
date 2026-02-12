import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { MODULES } from "@/data/courseData";
import { getLessonContent } from "@/data/lessonContent";
import { getModule1Lesson, t } from "@/data/module1Content";
import { getModule2Lesson } from "@/data/module2Content";
import { getModule3Lesson } from "@/data/module3Content";
import { getModule4Lesson } from "@/data/module4Content";
import { getModule5Lesson } from "@/data/module5Content";
import type { I18nLessonContent } from "@/data/module1Content";
import { useProgress, getModuleProgress } from "@/contexts/ProgressContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTelemetry } from "@/hooks/useTelemetry";
import { buildSlidesFromI18n } from "@/data/slidesSchema";
import LessonFlow from "@/components/lesson/LessonFlow";

const LessonPlayer = () => {
  const { moduleId: mIdStr, lessonId: lIdStr } = useParams();
  const moduleId = Number(mIdStr);
  const lessonId = Number(lIdStr);
  const navigate = useNavigate();
  const { progress, completeLesson } = useProgress();
  const { addStudyMinutes, recordStudySession } = useGamification();
  const { language } = useLanguage();
  const { trackLessonComplete } = useTelemetry();
  const lang = language.code;
  const mp = getModuleProgress(progress, moduleId);
  const [timeSpent, setTimeSpent] = useState(0);

  const mod = MODULES.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);

  const i18nContent: I18nLessonContent | undefined =
    moduleId === 1 ? getModule1Lesson(lessonId) :
    moduleId === 2 ? getModule2Lesson(lessonId) :
    moduleId === 3 ? getModule3Lesson(lessonId) :
    moduleId === 4 ? getModule4Lesson(lessonId) :
    moduleId === 5 ? getModule5Lesson(lessonId) : undefined;

  const isCompleted = mp.lessons[lessonId]?.completed ?? false;

  // Track study time
  useEffect(() => {
    recordStudySession();
    const id = setInterval(() => setTimeSpent((prev) => prev + 1), 1000);
    return () => {
      clearInterval(id);
      addStudyMinutes(timeSpent / 60);
    };
  }, []);

  if (!mod || !lesson) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">Lesson not found.</p>
        <Link to="/dashboard" className="text-primary underline mt-2 inline-block text-sm">Back to Dashboard</Link>
      </div>
    );
  }

  const lessonTitle = i18nContent ? t(i18nContent.title, lang) : lesson.title;

  // Build slides from i18n content
  const slides = i18nContent
    ? buildSlidesFromI18n(i18nContent, lang, moduleId, lessonId, lessonTitle)
    : [{ type: "hero" as const, title: lessonTitle, subtitle: `Module ${moduleId} · Lesson ${lessonId}` }];

  const handleMarkComplete = () => {
    completeLesson(moduleId, lessonId);
    trackLessonComplete(moduleId, lessonId);
  };

  const handleFinish = () => {
    const totalLessons = mod.lessons.length;
    if (lessonId < totalLessons) {
      navigate(`/lesson/${moduleId}/${lessonId + 1}`);
    } else {
      navigate(`/module/${moduleId}`);
    }
  };

  return (
    <LessonFlow
      slides={slides}
      moduleId={moduleId}
      lessonId={lessonId}
      lessonTitle={lessonTitle}
      isCompleted={isCompleted}
      onMarkComplete={handleMarkComplete}
      onFinish={handleFinish}
      lang={lang}
    />
  );
};

export default LessonPlayer;
