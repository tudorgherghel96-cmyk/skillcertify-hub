import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface TopNavProps {
  currentModule?: number;
  currentLesson?: number;
  overallProgress?: number;
}

const TopNav = ({ currentModule, currentLesson, overallProgress = 0 }: TopNavProps) => {
  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-1.5">
          <span className="text-lg font-bold text-primary tracking-tight">SKILLCERTIFY</span>
        </Link>

        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 -mr-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">EN</span>
        </button>
      </div>

      {overallProgress > 0 && (
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            {currentModule && (
              <span>
                Module {currentModule} of 5
                {currentLesson && ` — Lesson ${currentLesson}`}
              </span>
            )}
            <span>{overallProgress}% complete</span>
          </div>
          <Progress value={overallProgress} className="h-1.5" />
        </div>
      )}
    </header>
  );
};

export default TopNav;
