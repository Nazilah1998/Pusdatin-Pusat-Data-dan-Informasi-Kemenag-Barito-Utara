import Link from "next/link";
import { ThemeToggleBtn } from "@/components/ui/ThemeToggleBtn";
import {
  ArrowRight,
  Database,
  Shield,
  BarChart3,
  RefreshCw,
  Activity,
  ExternalLink,
} from "lucide-react";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { satelliteApps } from "@/db/schema";
import { withRetry } from "@/lib/db-retry";

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

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  let apps: any[] = [];
  try {
    apps = await withRetry(
      () => db.query.satelliteApps.findMany({
        where: eq(satelliteApps.status, "online"),
        orderBy: (apps, { asc }) => [asc(apps.sortOrder)],
      }),
      2, "LANDING"
    );
  } catch {
    // Jika koneksi gagal total, tampilkan halaman tanpa daftar aplikasi
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <header className="border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/branding/kemenag.svg"
              alt="Kemenag"
              className="h-10 w-10"
            />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">PUSDATIN (Pusat Data dan Informasi)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kemenag Barito Utara</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggleBtn />
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Masuk ke Dasbor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto w-full px-4 pb-24 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full text-center">
            <div className="mb-6 flex justify-center">
              <img
                src="/branding/kemenag.svg"
                alt="Kemenag"
                className="h-24 w-24"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Pusat Data dan Informasi
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Kementerian Agama Kabupaten Barito Utara
            </p>
            <p className="mt-6 text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Sistem Manajemen Data Master dan Autentikasi Terpusat untuk
              seluruh aplikasi layanan Kemenag Barito Utara. Kelola pengguna,
              pantau aplikasi, dan kontrol pemeliharaan dari satu tempat.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Masuk ke Dasbor
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {apps.length > 0 && (
        <section className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="mx-auto w-full px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto w-full text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Layanan Aplikasi</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Kumpulan sistem informasi dan layanan publik yang terintegrasi.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm flex flex-col transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500">
                      {app.icon && (app.icon.startsWith('/') || app.icon.startsWith('http')) ? (
                        <img src={app.icon} alt={app.name} className="h-6 w-6 object-contain" />
                      ) : (
                        <Activity className="h-6 w-6" />
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Online
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{app.name}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                    {app.description || "Layanan aplikasi terintegrasi Pusdatin Kemenag Barito Utara."}
                  </p>
                  {app.url && (
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                      <a href={app.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400">
                        Akses Aplikasi <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto w-full px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto w-full text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Fitur Utama</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Pusdatin menyediakan berbagai fitur untuk memudahkan pengelolaan sistem informasi.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="mx-auto w-full px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} PUSDATIN (Pusat Data dan Informasi) | <a href="https://baritoutara.kemenag.go.id" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">baritoutara.kemenag.go.id</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
