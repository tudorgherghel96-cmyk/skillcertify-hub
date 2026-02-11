import { Unlock } from "lucide-react";
import { useSuperUser } from "@/contexts/SuperUserContext";

const SuperUserBanner = () => {
  const { isSuperUser, setSuperUser } = useSuperUser();

  if (!isSuperUser) return null;

  return (
    <div className="sticky top-14 z-40 bg-amber-500 text-amber-950 px-4 py-2 flex items-center justify-between text-sm font-medium">
      <div className="flex items-center gap-2">
        <Unlock className="h-4 w-4" />
        <span>🔓 SUPER USER MODE — All modules unlocked</span>
      </div>
      <button
        onClick={() => setSuperUser(false)}
        className="text-xs font-bold underline hover:no-underline"
      >
        Disable
      </button>
    </div>
  );
};

export default SuperUserBanner;
