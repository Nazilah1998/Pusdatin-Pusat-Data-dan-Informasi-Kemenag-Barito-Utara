import Link from "next/link";
import { db } from "@/lib/drizzle";
import { satelliteApps, profiles, ptspServices, ptspServiceItems, profilesPegawai, profilesPemohon } from "@/db/schema";
import { withRetry } from "@/lib/db-retry";
import { eq, and, inArray } from "drizzle-orm";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
export const dynamic = "force-dynamic";

export default async function LandingPage() {
  let totalAppsCount = 0;
  let layananMasyarakat = 0;
  let layananPegawai = 0;
  let totalAdmin = 0;
  let totalPegawai = 0;
  let totalMasyarakat = 0;

  try {
    const allApps = await withRetry(
      () => db.select().from(satelliteApps),
      2, "LANDING_STATS_APPS"
    );
    totalAppsCount = allApps.length;

    const allServiceItems = await withRetry(
      () => db.select({ categoryId: ptspServices.category })
      .from(ptspServiceItems)
      .innerJoin(ptspServices, eq(ptspServiceItems.serviceId, ptspServices.id))
      .where(and(eq(ptspServiceItems.isActive, true), eq(ptspServices.isActive, true))),
      2, "LANDING_STATS_SERVICES"
    );
    layananMasyarakat = allServiceItems.filter(s => s.categoryId === 'public').length;
    layananPegawai = allServiceItems.filter(s => s.categoryId === 'asn').length;

    const allAdmins = await withRetry(
      () => db.select({ id: profiles.id }).from(profiles).where(inArray(profiles.role, ['super_admin', 'admin', 'sub_admin'])),
      2, "LANDING_STATS_ADMIN"
    );
    totalAdmin = allAdmins.length;

    const allPegawai = await withRetry(
      () => db.select({ id: profilesPegawai.id }).from(profilesPegawai),
      2, "LANDING_STATS_PEGAWAI"
    );
    totalPegawai = allPegawai.length;

    const allMasyarakat = await withRetry(
      () => db.select({ id: profilesPemohon.id }).from(profilesPemohon),
      2, "LANDING_STATS_PEMOHON"
    );
    totalMasyarakat = allMasyarakat.length;
  } catch (error) {
    // Abaikan jika error, card akan menampilkan 0
  }

  return (
    <>
      <section id="beranda" className="relative overflow-hidden flex-1 flex flex-col justify-center">
        <div className="absolute inset-0 bg-[url('/img/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:bg-[url('/img/grid-dark.svg')] opacity-20 dark:opacity-10 pointer-events-none"></div>
        <div className="mx-auto w-full px-4 pb-8 pt-12 sm:px-6 lg:px-8 relative">
          <div className="mx-auto w-full text-center max-w-4xl">
            <div className="mb-6 flex justify-center">
              <img
                src="/branding/kemenag.svg"
                alt="Kemenag"
                className="h-28 w-28 drop-shadow-md"
              />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-800 dark:from-emerald-400 dark:to-teal-600 pb-2">
              Pusat Data dan Informasi
            </h1>
            <p className="mt-2 text-xl font-semibold text-slate-700 dark:text-slate-200">
              Kementerian Agama Kabupaten Barito Utara
            </p>
            <p className="mt-6 text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Sistem Manajemen Data Master dan Autentikasi Terpusat untuk
              seluruh aplikasi layanan Kemenag Barito Utara. Kelola pengguna,
              pantau aplikasi, dan kontrol pemeliharaan dari satu tempat.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/60 py-12 shrink-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 sm:p-6 text-center shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                <AnimatedCounter value={totalAppsCount} />
              </div>
              <div className="mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Sistem Integrasi</div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 sm:p-6 text-center shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                <AnimatedCounter value={layananMasyarakat} />
              </div>
              <div className="mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Layanan Masyarakat</div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 sm:p-6 text-center shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                <AnimatedCounter value={layananPegawai} />
              </div>
              <div className="mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Layanan Pegawai</div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 sm:p-6 text-center shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                <AnimatedCounter value={totalAdmin} />
              </div>
              <div className="mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Administrator</div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 sm:p-6 text-center shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                <AnimatedCounter value={totalPegawai} />
              </div>
              <div className="mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pegawai Terdaftar</div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 sm:p-6 text-center shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                <AnimatedCounter value={totalMasyarakat} />
              </div>
              <div className="mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Masyarakat Terdaftar</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
