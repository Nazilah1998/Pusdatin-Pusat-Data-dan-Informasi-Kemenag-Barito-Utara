import Link from "next/link";
import { ThemeToggleBtn } from "@/components/ui/ThemeToggleBtn";
import { MobileNav } from "@/components/landing/MobileNav";
import {
  ArrowRight,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Globe,
  Megaphone,
  Sparkles,
  Wrench
} from "lucide-react";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors scroll-smooth flex flex-col">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
      
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <img
              src="/branding/kemenag.svg"
              alt="Kemenag"
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
            />
            <div className="block">
              {/* Mobile text */}
              <div className="sm:hidden">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">PUSDATIN</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">Kemenag Barito Utara</p>
              </div>
              {/* Desktop text */}
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white">PUSDATIN (Pusat Data dan Informasi)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Kemenag Barito Utara</p>
              </div>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="relative text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-emerald-600 dark:after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-full">Beranda</Link>
            <Link href="/profil" className="relative text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-emerald-600 dark:after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-full">Profil</Link>
            <Link href="/layanan" className="relative text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-emerald-600 dark:after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-full">Layanan Aplikasi</Link>
            <Link href="/pengumuman" className="relative text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-emerald-600 dark:after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-full">Pengumuman</Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggleBtn />
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
            >
              Login Admin
              <ArrowRight className="h-4 w-4" />
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Running Text */}
      <div className="mt-16 bg-emerald-600 text-white overflow-hidden py-2 text-sm flex items-center relative z-40 shrink-0">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-12 font-medium w-full">
           <span className="inline-flex items-center gap-2"><Megaphone className="h-4 w-4 shrink-0" /> Selamat Datang di Portal Pusat Data dan Informasi (PUSDATIN) Kementerian Agama Kabupaten Barito Utara</span>
           <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 shrink-0" /> Layanan Digital Terintegrasi untuk Memudahkan Pelayanan Publik</span>
           <span className="inline-flex items-center gap-2"><Wrench className="h-4 w-4 shrink-0" /> Jika mengalami kendala teknis, silakan hubungi Helpdesk kami</span>
        </div>
      </div>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer id="helpdesk" className="bg-slate-900 text-slate-300 dark:bg-black pt-16 pb-8 border-t border-slate-800 shrink-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white p-2 rounded-lg">
                  <img src="/branding/kemenag.svg" alt="Kemenag" className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">PUSDATIN</h3>
                  <p className="text-emerald-400 text-xs font-bold tracking-wider">KEMENAG BARUT</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pusat Data dan Informasi. Sistem manajemen aplikasi dan layanan publik terpadu Kementerian Agama Kabupaten Barito Utara.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hubungi Kami</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">Jl. Pramuka No. 12, Muara Teweh, Kabupaten Barito Utara, Kalimantan Tengah</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm">(0519) 21123</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm">baritoutara@kemenag.go.id</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Tautan Cepat</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm hover:text-emerald-400 transition-colors">Beranda</Link></li>
                <li><Link href="/profil" className="text-sm hover:text-emerald-400 transition-colors">Tentang Kami</Link></li>
                <li><Link href="/layanan" className="text-sm hover:text-emerald-400 transition-colors">Daftar Aplikasi</Link></li>
                <li><a href="https://baritoutara.kemenag.go.id" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-emerald-400 transition-colors flex items-center gap-1.5">Website Utama <ExternalLink className="w-3 h-3" /></a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Helpdesk Layanan</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Mengalami kendala teknis? Tim IT Helpdesk kami siap membantu Anda pada jam kerja (Senin - Jumat, 08.00 - 16.00 WIB).
              </p>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-500 w-full sm:w-auto">
                Chat via WhatsApp
              </a>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} PUSDATIN Kementerian Agama Kabupaten Barito Utara. Hak Cipta Dilindungi.
            </p>
            <div className="flex items-center gap-4 text-slate-500">
              {/* Optional Social Icons */}
              <a href="#" className="hover:text-emerald-400 transition-colors"><Globe className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
