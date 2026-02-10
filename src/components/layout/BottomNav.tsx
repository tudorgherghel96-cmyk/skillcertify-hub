import { Home, BookOpen, Brain, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { ui } from "@/i18n/translations";

const BottomNav = () => {
  const { language } = useLanguage();
  const lang = language.code;

  const navItems = [
    { to: "/dashboard", icon: Home, label: ui("nav_home", lang) },
    { to: "/module/1", icon: BookOpen, label: ui("nav_lessons", lang) },
    { to: "/practice/1", icon: Brain, label: ui("nav_practice", lang) },
    { to: "/results", icon: User, label: ui("nav_profile", lang) },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card sm:hidden">
      <div className="flex items-stretch justify-around">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-h-[56px] text-muted-foreground transition-colors"
            activeClassName="text-primary"
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
