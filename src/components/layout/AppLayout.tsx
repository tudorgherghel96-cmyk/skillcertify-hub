import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      <main className="flex-1 pb-20 sm:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
