import { NavLink } from "react-router-dom";
import { LayoutDashboard, ReceiptText, Users, PlusCircle, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

export default function BottomNav() {
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Özet" },
    { to: "/transactions", icon: ReceiptText, label: "İşlemler" },
    { to: "/add", icon: PlusCircle, label: "Ekle", isPrimary: true },
    { to: "/ledger", icon: Users, label: "Kişiler" },
    { to: "/settings", icon: Settings, label: "Ayarlar" },
  ];

  return (
    <nav className="absolute bottom-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-t border-outline-variant h-20 px-2 sm:px-6 flex justify-around items-center rounded-b-[32px] sm:rounded-b-[32px] overflow-hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center transition-all duration-200 active:scale-95 px-2 py-1 relative",
              item.isPrimary
                ? "text-primary -mt-8 bg-surface p-2 rounded-full border border-outline-variant"
                : isActive
                ? "text-primary"
                : "text-secondary hover:text-primary/70"
            )
          }
        >
          {({ isActive }) => (
            <>
              {item.isPrimary ? (
                <div className="bg-primary text-on-primary rounded-full p-3 shadow-lg shadow-primary/30">
                  <item.icon size={28} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              ) : (
                <>
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
                  <span className={cn("text-[10px] uppercase tracking-widest", isActive ? "font-bold text-primary" : "font-bold text-secondary")}>
                    {item.label}
                  </span>
                </>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
