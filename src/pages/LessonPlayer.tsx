import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const LessonPlayer = () => {
  const { moduleId, lessonId } = useParams();

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <Link to={`/module/${moduleId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Module {moduleId}
      </Link>

      {/* Video placeholder */}
      <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center">
        <p className="text-secondary-foreground/60 text-sm">Video Player — Lesson {lessonId}</p>
      </div>

      <div>
        <h1 className="text-lg font-bold">Module {moduleId} — Lesson {lessonId}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Lesson content will be displayed here. Watch the video and review the key points below.
        </p>
      </div>

      {/* Key points placeholder */}
      <div className="border rounded-xl p-4 bg-card space-y-2">
        <h2 className="font-semibold text-sm">Key Points to Remember</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Key point 1 — placeholder</li>
          <li>Key point 2 — placeholder</li>
          <li>Key point 3 — placeholder</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="sm" disabled={Number(lessonId) <= 1}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        <Button size="sm">
          Next <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LessonPlayer;
