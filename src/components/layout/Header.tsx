"use client";

import { useUIStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { Menu, LogOut, User, Moon, Sun } from "lucide-react";

export function Header() {
  const { toggleSidebar, isDark, toggleTheme } = useUIStore();
  const { user, clearAuth } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <button
          onClick={toggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <Dropdown
            trigger={
              <button className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-100">
                <Avatar name={user?.name} size="sm" />
                <span className="hidden text-sm font-medium text-slate-700 sm:block">
                  {user?.name || "Admin"}
                </span>
              </button>
            }
            items={[
              {
                label: "Profil",
                icon: <User className="h-4 w-4" />,
                onClick: () => {},
              },
              {
                label: "Keluar",
                icon: <LogOut className="h-4 w-4" />,
                onClick: () => clearAuth(),
                danger: true,
              },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
