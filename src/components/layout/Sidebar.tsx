"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Monitor,
  Shield,
  BarChart3,
  LogOut,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Pengguna", icon: Users },
  { href: "/dashboard/apps", label: "Aplikasi", icon: Monitor },
  { href: "/dashboard/audit", label: "Audit Log", icon: Shield },
  { href: "/dashboard/reports", label: "Laporan", icon: BarChart3 },
];

interface SidebarProps {
  onClose?: () => void;
  onLogout?: () => void;
}

export function Sidebar({ onClose, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <img
            src="/branding/kemenag.svg"
            alt="Kemenag"
            className="h-10 w-10"
          />
          <div>
            <p className="text-sm font-bold text-slate-900">Pusdatin</p>
            <p className="text-xs text-slate-500">Kemenag Barito Utara</p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Keluar
        </button>
      </div>
    </div>
  );
}
