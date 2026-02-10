import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, Brain, ExternalLink, ChevronRight } from "lucide-react";

const moduleData: Record<number, { title: string; lessons: { id: number; title: string }[] }> = {
  1: {
    title: "Health & Safety in Construction",
    lessons: [
      { id: 1, title: "Why Health & Safety Matters" },
      { id: 2, title: "The Health & Safety at Work Act" },
      { id: 3, title: "Risk Assessments" },
      { id: 4, title: "Method Statements" },
      { id: 5, title: "Site Inductions" },
      { id: 6, title: "PPE Requirements" },
    ],
  },
  2: {
    title: "Accident Prevention & Reporting",
    lessons: [
      { id: 1, title: "Common Causes of Accidents" },
      { id: 2, title: "RIDDOR Reporting" },
      { id: 3, title: "Near Miss Reporting" },
      { id: 4, title: "First Aid on Site" },
      { id: 5, title: "Accident Investigation" },
    ],
  },
  3: {
    title: "Working at Height & Excavations",
    lessons: [
      { id: 1, title: "Working at Height Regulations" },
      { id: 2, title: "Scaffolding Safety" },
      { id: 3, title: "Ladder Safety" },
      { id: 4, title: "Excavation Hazards" },
      { id: 5, title: "Shoring & Support" },
    ],
  },
  4: {
    title: "Manual Handling & Equipment",
    lessons: [
      { id: 1, title: "Manual Handling Principles" },
      { id: 2, title: "Lifting Techniques" },
      { id: 3, title: "Hand & Power Tools" },
      { id: 4, title: "Plant & Equipment" },
      { id: 5, title: "COSHH Regulations" },
      { id: 6, title: "Noise & Vibration" },
    ],
  },
  5: {
    title: "Fire Safety & Emergencies",
    lessons: [
      { id: 1, title: "Fire Triangle & Prevention" },
      { id: 2, title: "Fire Extinguisher Types" },
      { id: 3, title: "Emergency Procedures" },
      { id: 4, title: "Electrical Safety" },
    ],
  },
};

const ModuleOverview = () => {
  const { id } = useParams();
  const moduleId = Number(id) || 1;
  const mod = moduleData[moduleId];

  if (!mod) {
    return <div className="p-4 text-center text-muted-foreground">Module not found</div>;
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-sm text-primary font-medium">Module {moduleId}</p>
        <h1 className="text-xl font-bold">{mod.title}</h1>
      </div>

      {/* Lessons */}
      <div className="space-y-2">
        {mod.lessons.map((lesson) => (
          <Link key={lesson.id} to={`/lesson/${moduleId}/${lesson.id}`}>
            <Card className="hover:border-primary/40 transition-colors">
              <CardContent className="flex items-center gap-3 py-3">
                <PlayCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm flex-1">{lesson.title}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button asChild variant="outline" className="h-12">
          <Link to={`/practice/${moduleId}`}>
            <Brain className="mr-2 h-4 w-4" /> Practice Quiz
          </Link>
        </Button>
        <Button asChild className="h-12">
          <Link to={`/gqa-test/${moduleId}`}>
            <ExternalLink className="mr-2 h-4 w-4" /> GQA Module Test
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ModuleOverview;
