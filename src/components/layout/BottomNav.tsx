import { Home, BookOpen, CreditCard, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/learn", icon: BookOpen, label: "Learn" },
  { to: "/my-card", icon: CreditCard, label: "My Card" },
  { to: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md sm:hidden safe-area-bottom" aria-label="Main navigation">
      <div className="flex items-stretch justify-around">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-2 min-h-[56px] text-muted-foreground transition-colors"
            activeClassName="text-primary"
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-tight">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
