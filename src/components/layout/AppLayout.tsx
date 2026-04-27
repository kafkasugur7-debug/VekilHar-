import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  const location = useLocation();
  // We can hide bottom nav on some specific pages if needed, e.g., /add
  // But the design shows it almost everywhere, though for forms it might get covered by keyboard.
  const isAddPage = location.pathname === '/add';

  return (
    <div className="bg-[#F2F2F7] min-h-screen text-[#1C1C1E] font-sans flex items-center justify-center sm:py-8">
      <div className="w-full h-full sm:h-auto sm:max-h-[850px] max-w-md bg-[#F2F2F7] sm:rounded-[32px] relative min-h-[100dvh] sm:min-h-[800px] shadow-sm sm:border border-[#D1D1D6] overflow-hidden flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
          <Outlet />
        </div>
        
        {/* Bottom Navigation */}
        {!isAddPage && <BottomNav />}
      </div>
    </div>
  );
}
