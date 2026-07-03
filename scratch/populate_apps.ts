import { db } from "../src/lib/drizzle";
import { satelliteApps } from "../src/db/schema";
import { sql } from "drizzle-orm";

async function run() {
  const apps = [
    {
      id: "website-kemenag",
      name: "Website Kemenag",
      description: "Website Profil Utama",
      icon: "Globe",
      url: "https://baritoutara.kemenag.go.id",
      schema: "website_kemenag",
    },
    {
      id: "ptsp-kemenag",
      name: "PTSP Kemenag",
      description: "Pelayanan Terpadu Satu Pintu",
      icon: "LayoutDashboard",
      url: "https://ptsp.kemenag-baritoutara.com",
      schema: "ptsp_kemenag",
    },
    {
      id: "e-surat-kemenag",
      name: "E-Surat",
      description: "Sistem Tata Persuratan",
      icon: "Mail",
      url: "https://surat.kemenag-baritoutara.com",
      schema: "surat_kemenag",
    },
    {
      id: "e-arsip-kemenag",
      name: "E-Arsip",
      description: "Sistem Kearsipan Digital",
      icon: "Archive",
      url: "https://arsip.kemenag-baritoutara.com",
      schema: "arsip_kemenag",
    },
    {
      id: "sop-kemenag",
      name: "SOP Kemenag",
      description: "Standar Operasional Prosedur",
      icon: "FileText",
      url: "https://sop.kemenag-baritoutara.com",
      schema: "sop_kemenag",
    },
    {
      id: "bot-kemenag",
      name: "Bot Kemenag",
      description: "Bot Pelayanan Otomatis",
      icon: "Bot",
      url: "https://bot.kemenag-baritoutara.com",
      schema: "bot_kemenag",
    },
    {
      id: "inklusi_kemenag",
      name: "Inklusi Kemenag",
      description: "Layanan Inklusi Disabilitas",
      icon: "HeartHandshake",
      url: "https://inklusi.kemenag-baritoutara.com",
      schema: "inklusi_kemenag",
    },
    {
      id: "loket_ptsp_kemenag",
      name: "Loket PTSP",
      description: "Layar Antrean Loket PTSP",
      icon: "Monitor",
      url: "https://loket.kemenag-baritoutara.com",
      schema: "loket_kemenag",
    },
  ];

  console.log("Updating satellite apps in database...");

  for (const app of apps) {
    await db
      .insert(satelliteApps)
      .values({
        id: app.id,
        name: app.name,
        description: app.description,
        icon: app.icon,
        url: app.url,
        status: "online",
        schemaName: app.schema,
      })
      .onConflictDoUpdate({
        target: satelliteApps.id,
        set: {
          name: app.name,
          description: app.description,
          icon: app.icon,
          url: app.url,
          schemaName: app.schema,
        },
      });
  }

  console.log("Success! Apps populated.");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
