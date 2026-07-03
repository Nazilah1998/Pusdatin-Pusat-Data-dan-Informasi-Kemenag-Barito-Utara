import { db } from "../src/lib/drizzle";
import { users as usersTable } from "../src/db/schema";
import { inArray } from "drizzle-orm";

async function run() {
  const dummyEmails = [
    "surat@kemenag.go.id",
    "pegawai@kemenag.go.id",
    "budi@kemenag.go.id",
    "siti@kemenag.go.id",
    "ahmad@kemenag.go.id",
    "rina@kemenag.go.id",
    "joko@kemenag.go.id",
    "dewi@kemenag.go.id"
  ];

  console.log("Menghapus user dummy...");
  const result = await db.delete(usersTable).where(inArray(usersTable.email, dummyEmails)).returning();
  
  console.log(`Berhasil menghapus ${result.length} user dummy.`);
  process.exit(0);
}

run();
