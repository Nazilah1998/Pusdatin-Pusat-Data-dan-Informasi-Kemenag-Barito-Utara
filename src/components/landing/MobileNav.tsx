"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden flex items-center gap-1">
      <button
        onClick={toggleMenu}
        className="p-2 text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {mounted && createPortal(
        <div className="md:hidden">
          {/* Backdrop */}
          <div 
            className={cn(
              "fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90] transition-opacity duration-300",
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={closeMenu}
          />

          {/* Sidebar Menu (Right to Left) */}
          <div 
            className={cn(
              "fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-slate-950 shadow-2xl z-[100] flex flex-col transition-transform duration-300 ease-in-out transform",
              isOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white">Menu</span>
              <button
                onClick={closeMenu}
                className="p-2 text-slate-600 hover:text-red-500 dark:text-slate-300 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-4 overflow-y-auto">
              <Link href="/" onClick={closeMenu} className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-emerald-400 rounded-lg transition-colors">Beranda</Link>
              <Link href="/profil" onClick={closeMenu} className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-emerald-400 rounded-lg transition-colors">Profil</Link>
              <Link href="/layanan" onClick={closeMenu} className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-emerald-400 rounded-lg transition-colors">Layanan Aplikasi</Link>
              <Link href="/pengumuman" onClick={closeMenu} className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-emerald-400 rounded-lg transition-colors">Pengumuman</Link>

              
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                >
                  Login Admin
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </nav>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
