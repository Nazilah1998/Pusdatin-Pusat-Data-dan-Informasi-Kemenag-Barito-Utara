import { db } from "../src/lib/drizzle";
import { satelliteApps } from "../src/db/schema";
import { eq } from "drizzle-orm";

const APP_FEATURES: Record<string, { id: string, label: string }[]> = {
  "website-kemenag": [
    { id: "berita", label: "Kelola Berita" },
    { id: "slider", label: "Kelola Slider" },
    { id: "dokumen", label: "Dokumen Laporan" },
  ],
  "ptsp-kemenag": [
    { id: "buku-tamu", label: "Buku Tamu" },
    { id: "janji-temu", label: "Janji Temu" },
    { id: "pengaduan", label: "Pengaduan" },
  ],
  "e-surat-kemenag": [],
  "e-arsip-kemenag": [
    { id: "full_access", label: "Full Access" }
  ],
  "sop-kemenag": [
    { id: "login", label: "Akses Login" }
  ],
  "bot-kemenag": [],
  "inklusi-kemenag": []
};

async function run() {
  try {
    for (const [appId, features] of Object.entries(APP_FEATURES)) {
      if (features.length > 0) {
        await db.update(satelliteApps)
          .set({ availableFeatures: features })
          .where(eq(satelliteApps.id, appId));
        console.log(`Berhasil mengupdate fitur untuk ${appId}`);
      }
    }
    console.log("Selesai!");
  } catch (err) {
    console.error("Gagal:", err);
  }
  process.exit(0);
}

run();
