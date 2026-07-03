import { db } from "../src/lib/drizzle";
import { users as pusdatinUsers, appPermissions, satelliteApps } from "../src/db/schema";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Mulai sinkronisasi data pengguna dari aplikasi satelit...");

  // Get all active apps from satellite_apps table
  const apps = await db.select().from(satelliteApps);

  let totalUsersSynced = 0;
  let totalPermissionsGranted = 0;

  for (const app of apps) {
    const schema = app.schemaName;
    if (!schema) continue;

    console.log(`Memeriksa skema: ${schema} (App: ${app.id})...`);

    try {
      // Check if schema and users table exist
      const tableCheck = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = ${schema} AND table_name = 'users'
        );
      `);

      if (!tableCheck.rows[0]?.exists) {
        console.log(`[SKIP] Tabel users tidak ditemukan di skema ${schema}`);
        continue;
      }

      // Fetch users from the satellite app's users table
      const satelliteUsers = await db.execute(sql.raw(`
        SELECT * FROM "${schema}"."users"
      `));

      console.log(`Ditemukan ${satelliteUsers.rows.length} pengguna di ${schema}. Sinkronisasi...`);

      for (const sUser of satelliteUsers.rows) {
        if (!sUser.email) continue; // skip users without email

        // 1. Upsert ke pusdatin.users
        const [pUser] = await db.insert(pusdatinUsers)
          .values({
            name: (sUser.name as string) || "Unknown",
            email: sUser.email as string,
            passwordHash: (sUser.password_hash as string) || (sUser.password as string) || null, // try standard names
            role: "viewer", // default central role, can be upgraded
            status: (sUser.status as string) || "active",
          })
          .onConflictDoUpdate({
            target: pusdatinUsers.email,
            set: {
              // Only update name if it was somehow blank? Actually let's just ensure they exist.
              name: sql`COALESCE(${pusdatinUsers.name}, EXCLUDED.name)`,
            }
          })
          .returning();

        // 2. Insert ke pusdatin.app_permissions
        // We assume the satellite user has a role like 'admin', 'operator', or 'viewer'.
        // If they are in the satellite table, they at least have 'viewer' access.
        let permRole = "viewer";
        const sRole = ((sUser.role as string) || "").toLowerCase();
        if (sRole === "admin" || sRole === "superadmin" || sRole === "operator") {
          permRole = "operator";
        }

        await db.insert(appPermissions)
          .values({
            userId: pUser.id,
            appId: app.id,
            role: permRole,
          })
          .onConflictDoNothing(); // If they already have permission for this app, don't overwrite

        totalUsersSynced++;
        totalPermissionsGranted++;
      }
      
      console.log(`[OK] Selesai sinkronisasi skema ${schema}`);
    } catch (err: any) {
      console.log(`[ERROR] Gagal sinkronisasi skema ${schema}: ${err.message}`);
    }
  }

  console.log("===================================");
  console.log("Sinkronisasi Selesai!");
  console.log(`Total pengguna diproses: ${totalUsersSynced}`);
  console.log(`Total izin aplikasi diberikan: ${totalPermissionsGranted}`);
  process.exit(0);
}

run().catch(err => {
  console.error("Fatal Error:", err);
  process.exit(1);
});
