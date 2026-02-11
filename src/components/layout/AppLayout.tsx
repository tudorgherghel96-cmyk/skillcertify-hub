import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import SuperUserBanner from "./SuperUserBanner";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      <SuperUserBanner />
      <main className="flex-1 pb-16 sm:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
