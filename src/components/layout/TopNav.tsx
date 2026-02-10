import { Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavProps {
  currentModule?: number;
  currentLesson?: number;
  overallProgress?: number;
}

const TopNav = ({ currentModule, currentLesson, overallProgress = 0 }: TopNavProps) => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-1.5">
          <span className="text-lg font-bold text-primary tracking-tight">SKILLCERTIFY</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 -mr-2">
              <span className="text-base">{language.flag}</span>
              <Globe className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang)}
                className={`gap-2 ${lang.code === language.code ? "bg-primary/10 font-medium" : ""}`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm">{lang.english}</span>
                <span className="text-xs text-muted-foreground ml-auto">{lang.native}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
