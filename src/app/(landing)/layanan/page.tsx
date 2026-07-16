import { Metadata } from "next";
import { Activity, ExternalLink } from "lucide-react";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { satelliteApps } from "@/db/schema";
import { withRetry } from "@/lib/db-retry";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Layanan Aplikasi",
};

export default async function LayananPage() {
  let apps: any[] = [];

  try {
    apps = await withRetry(
      () => db.query.satelliteApps.findMany({
        where: eq(satelliteApps.status, "online"),
        orderBy: (apps, { asc }) => [asc(apps.sortOrder)],
      }),
      2, "LANDING_LAYANAN"
    );
  } catch {
    // Abaikan jika error
  }

  return (
    <section className="flex-1 py-20 bg-slate-50 dark:bg-slate-900/20 flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Layanan Aplikasi</h2>
          <div className="mt-2 h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            Pilih dan akses berbagai sistem informasi publik dan internal yang terintegrasi di lingkungan Kemenag Barito Utara.
          </p>
        </div>

        {apps.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col transition-all hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200 dark:hover:border-emerald-800/50 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110">
                    {app.icon && (app.icon.startsWith('/') || app.icon.startsWith('http')) ? (
                      <img src={app.icon} alt={app.name} className="h-8 w-8 object-contain" />
                    ) : (
                      <Activity className="h-8 w-8" />
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </span>
                </div>
                <h3 className="mt-6 font-bold text-slate-900 dark:text-slate-100 text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{app.name}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                  {app.description || "Layanan aplikasi terintegrasi Pusdatin Kemenag Barito Utara."}
                </p>
                {app.url && (
                  <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800/80">
                    <a href={app.url} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all">
                      Akses Aplikasi <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            Belum ada layanan aplikasi yang tersedia.
          </div>
        )}
      </div>
    </section>
  );
}
