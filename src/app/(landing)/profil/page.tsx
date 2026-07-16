import { Database, Shield, BarChart3, RefreshCw } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil",
};

const features = [
  {
    icon: Database,
    title: "Manajemen Data Terpusat",
    desc: "Kelola seluruh data master pengguna dan aplikasi dalam satu panel kontrol terintegrasi.",
  },
  {
    icon: Shield,
    title: "Autentikasi Terpusat",
    desc: "Sistem login terpadu untuk seluruh aplikasi satelit Kemenag Barito Utara.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Eksekutif",
    desc: "Pantau kinerja dan laporan operasional seluruh aplikasi secara real-time.",
  },
  {
    icon: RefreshCw,
    title: "Kontrol Pemeliharaan",
    desc: "Aktifkan atau nonaktifkan mode pemeliharaan aplikasi satelit dengan satu klik.",
  },
];

export default function ProfilPage() {
  return (
    <section className="flex-1 py-20 bg-white dark:bg-slate-950 flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Tentang Pusdatin</h2>
          <div className="mt-2 h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Pusat Data dan Informasi (PUSDATIN) Kementerian Agama Kabupaten Barito Utara hadir sebagai wujud transformasi digital dalam memberikan pelayanan prima bagi aparatur dan masyarakat umum.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-8 transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mb-6">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
