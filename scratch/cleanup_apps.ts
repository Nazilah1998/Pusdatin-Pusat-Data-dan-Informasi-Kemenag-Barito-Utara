import { db } from "../src/lib/drizzle";
import { satelliteApps } from "../src/db/schema";
import { notInArray } from "drizzle-orm";

async function run() {
  const validIds = [
    "website-kemenag",
    "ptsp-kemenag",
    "e-surat-kemenag",
    "e-arsip-kemenag",
    "sop-kemenag",
    "bot-kemenag",
    "inklusi_kemenag",
    "loket_ptsp_kemenag",
  ];

  console.log("Menghapus aplikasi dummy/duplikat...");
  
  const result = await db.delete(satelliteApps)
    .where(notInArray(satelliteApps.id, validIds))
    .returning();
    
  console.log(`Berhasil menghapus ${result.length} aplikasi dummy:`, result.map(r => r.name));
  process.exit(0);
}

run().catch(console.error);
