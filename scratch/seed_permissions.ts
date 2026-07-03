import { db } from "../src/lib/drizzle";
import { users as usersTable, appPermissions, satelliteApps } from "../src/db/schema";
import bcrypt from "bcryptjs";

async function run() {
  console.log("Membuat data pengguna dummy tersinkronisasi untuk setiap aplikasi...");

  const apps = await db.select().from(satelliteApps);
  if (apps.length === 0) {
    console.log("Tidak ada aplikasi satelit.");
    process.exit(0);
  }

  // Ciptakan beberapa user dummy
  const dummyUsers = [
    { name: "Budi Santoso", email: "budi@kemenag.go.id", role: "viewer" },
    { name: "Siti Aminah", email: "siti@kemenag.go.id", role: "viewer" },
    { name: "Ahmad Fauzi", email: "ahmad@kemenag.go.id", role: "operator" },
    { name: "Rina Kumala", email: "rina@kemenag.go.id", role: "viewer" },
    { name: "Joko Anwar", email: "joko@kemenag.go.id", role: "viewer" },
    { name: "Dewi Lestari", email: "dewi@kemenag.go.id", role: "operator" },
  ];

  const passwordHash = await bcrypt.hash("password123", 10);

  const insertedUsers = [];
  for (const du of dummyUsers) {
    const [u] = await db.insert(usersTable)
      .values({ ...du, passwordHash })
      .onConflictDoUpdate({
        target: usersTable.email,
        set: { name: du.name }
      })
      .returning();
    insertedUsers.push(u);
  }

  // Berikan izin acak ke setiap user untuk beberapa aplikasi
  let appIndex = 0;
  for (const user of insertedUsers) {
    // Beri akses ke 1-2 aplikasi
    const app1 = apps[appIndex % apps.length];
    const app2 = apps[(appIndex + 3) % apps.length];

    await db.insert(appPermissions).values([
      { userId: user.id, appId: app1.id, role: user.role === "operator" ? "operator" : "viewer" },
      { userId: user.id, appId: app2.id, role: "viewer" }
    ]).onConflictDoNothing();

    appIndex++;
  }

  console.log("Berhasil menyinkronkan data dummy pengguna ke aplikasi!");
  process.exit(0);
}

run().catch(console.error);
