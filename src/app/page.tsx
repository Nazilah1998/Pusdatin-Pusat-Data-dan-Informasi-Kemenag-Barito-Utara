import Link from "next/link";
import { ArrowRight, Database, Shield, BarChart3, RefreshCw } from "lucide-react";

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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/branding/kemenag.svg" alt="Kemenag" className="h-10 w-10" />
            <div>
              <p className="text-sm font-bold text-slate-900">Pusdatin</p>
              <p className="text-xs text-slate-500">Kemenag Barito Utara</p>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Masuk ke Portal
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto w-full px-4 pb-24 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full text-center">
            <div className="mb-6 flex justify-center">
              <img src="/branding/kemenag.svg" alt="Kemenag" className="h-24 w-24" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Portal Pusat Data dan Informasi
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Kementerian Agama Kabupaten Barito Utara
            </p>
            <p className="mt-6 text-base text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Sistem Manajemen Data Master dan Autentikasi Terpusat untuk seluruh
              aplikasi layanan Kemenag Barito Utara. Kelola pengguna, pantau
              aplikasi, dan kontrol pemeliharaan dari satu tempat.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Masuk ke Portal
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto w-full px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto w-full text-center">
            <h2 className="text-3xl font-bold text-slate-900">Fitur Utama</h2>
            <p className="mt-2 text-slate-600">
              Portal Pusdatin menyediakan berbagai fitur untuk memudahkan pengelolaan sistem informasi.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto w-full px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Pusdatin Kemenag Barito Utara.
          </p>
        </div>
      </footer>
    </div>
  );
}
