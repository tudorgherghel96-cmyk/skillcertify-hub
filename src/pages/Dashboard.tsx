import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Lock, ChevronRight } from "lucide-react";

const modules = [
  { id: 1, title: "Health & Safety in Construction", lessons: 6 },
  { id: 2, title: "Accident Prevention & Reporting", lessons: 5 },
  { id: 3, title: "Working at Height & Excavations", lessons: 5 },
  { id: 4, title: "Manual Handling & Equipment", lessons: 6 },
  { id: 5, title: "Fire Safety & Emergencies", lessons: 4 },
];

const Dashboard = () => {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Course</h1>
        <p className="text-muted-foreground text-sm">Level 1 Award in Health & Safety</p>
      </div>

      {/* Overall progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Overall Progress</span>
            <span className="text-muted-foreground">0%</span>
          </div>
          <Progress value={0} className="h-2" />
        </CardContent>
      </Card>

      {/* Module list */}
      <div className="space-y-3">
        {modules.map((mod, i) => {
          const isLocked = i > 0; // first module unlocked, rest locked for now
          return (
            <Link
              key={mod.id}
              to={isLocked ? "#" : `/module/${mod.id}`}
              className={isLocked ? "pointer-events-none" : ""}
            >
              <Card className={`transition-colors ${isLocked ? "opacity-50" : "hover:border-primary/40"}`}>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {isLocked ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <span className="text-primary font-bold">{mod.id}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">Module {mod.id}: {mod.title}</h3>
                    <p className="text-xs text-muted-foreground">{mod.lessons} lessons</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* CSCS Section */}
      <Card className="border-primary/30">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">CSCS Test Preparation</h3>
              <p className="text-xs text-muted-foreground">Available after all 5 modules passed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
