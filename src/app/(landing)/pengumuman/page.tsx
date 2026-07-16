import { Metadata } from "next";
import { Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Pengumuman",
};

export default function PengumumanPage() {
  return (
    <section className="flex-1 py-20 bg-white dark:bg-slate-950 flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-emerald-600 dark:bg-emerald-900/40 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
            <Bell className="w-96 h-96" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Pengumuman Terbaru</h2>
            <p className="text-emerald-50 dark:text-emerald-100 text-lg mb-6">
              Pantau terus informasi terbaru terkait pemeliharaan sistem, penambahan fitur aplikasi, dan kebijakan layanan IT Kemenag Barito Utara di sini.
            </p>
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 text-emerald-200 mb-2">
                <span className="text-sm font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-md">UPDATE INFO</span>
                <span className="text-sm font-medium">Hari ini</span>
              </div>
              <h4 className="font-bold text-xl mb-2">Pembaruan Portal Pusdatin v2.0</h4>
              <p className="text-emerald-50 text-sm leading-relaxed">Seluruh layanan aplikasi kini telah terintegrasi penuh ke dalam sistem Single Sign-On (SSO). Silakan lengkapi profil pengguna Anda pada dashboard masing-masing.</p>
            </div>
          </div>
          <div className="relative z-10 shrink-0">
             <div className="w-48 h-48 rounded-full border-8 border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md">
               <Bell className="w-20 h-20 text-white animate-bounce" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
