import { db } from "../src/lib/drizzle";
import { users as usersTable, appPermissions } from "../src/db/schema";
import { notInArray, like, or } from "drizzle-orm";

async function run() {
  const users = await db.select().from(usersTable);
  console.log("USERS:");
  users.forEach(u => console.log(`- ${u.id}: ${u.name} (${u.email}) [${u.userType}]`));
  process.exit(0);
}

run();
