import { db } from "../src/lib/drizzle";
import { users, satelliteApps, auditLogs, systemMetrics } from "../src/db/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // 1. Users
  const passwordHash = await bcrypt.hash("password123", 10);
  
  await db.insert(users).values([
    {
      name: "Super Admin",
      email: "baritoutara@kemenag.go.id",
      passwordHash,
      role: "super_admin",
      status: "active",
    },
    {
      name: "Admin Surat",
      email: "surat@kemenag.go.id",
      passwordHash,
      role: "admin",
      status: "active",
    },
    {
      name: "Pegawai Biasa",
      email: "pegawai@kemenag.go.id",
      passwordHash,
      role: "viewer",
      status: "inactive",
    }
  ]).onConflictDoNothing({ target: users.email });
  
  console.log("Users seeded");

  // 2. Apps
  await db.insert(satelliteApps).values([
    {
      id: "surat",
      name: "TATA NASKAH & TNDE",
      description: "Sistem Manajemen Persuratan Kemenag Barito Utara",
      icon: "Mail",
      url: "https://surat.kemenag-baritoutara.com",
      schemaName: "kemenag_surat",
      status: "online",
      lastHealthCheck: new Date(),
    },
    {
      id: "arsip",
      name: "ARSIP",
      description: "Sistem Arsip Dokumen Digital",
      icon: "Folder",
      url: "https://arsip.kemenag-baritoutara.com",
      schemaName: "kemenag_arsip",
      status: "maintenance",
      lastHealthCheck: new Date(),
    },
    {
      id: "sop",
      name: "SOP",
      description: "Sistem Operasional Prosedur",
      icon: "FileText",
      url: "https://sop.kemenag-baritoutara.com",
      schemaName: "kemenag_sop",
      status: "online",
      lastHealthCheck: new Date(),
    },
    {
      id: "ptsp",
      name: "PTSP",
      description: "Pelayanan Terpadu Satu Pintu",
      icon: "Briefcase",
      url: "https://ptsp.kemenag-baritoutara.com",
      schemaName: "kemenag_ptsp",
      status: "online",
      lastHealthCheck: new Date(),
    }
  ]).onConflictDoNothing({ target: satelliteApps.id });

  console.log("Apps seeded");

  // 3. Audit Logs (Seed for the past 7 days to show in charts)
  const logsToInsert = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 7));
    
    logsToInsert.push({
      action: ["INSERT", "UPDATE", "DELETE", "LOGIN"][Math.floor(Math.random() * 4)],
      target: ["users", "satellite_apps", "app_permissions", "system"][Math.floor(Math.random() * 4)],
      targetSchema: ["pusdatin", "kemenag_surat", "kemenag_arsip"][Math.floor(Math.random() * 3)],
      performedBy: "baritoutara@kemenag.go.id",
      timestamp: d,
      ip: "127.0.0.1",
    });
  }
  
  await db.insert(auditLogs).values(logsToInsert);
  console.log("Audit Logs seeded");

  // 4. System Metrics
  await db.insert(systemMetrics).values({
    cpu: 42,
    ram: 68,
    storage: 45,
    uptime: "14 days, 5 hours",
  });
  console.log("System Metrics seeded");

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seeding failed:");
  console.error(e);
  process.exit(1);
});
