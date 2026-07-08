import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "./env";
import * as schema from "../db/schema";

const globalForDb = globalThis as unknown as {
  postgresPool: pg.Pool | undefined;
};

const pool = globalForDb.postgresPool ?? new pg.Pool({
  connectionString: env.databaseUrl,
  max: 30,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresPool = pool;
}

pool.on("error", (err) => {
  console.error("[DB] Pool error:", err.message);
});

export const db = drizzle(pool, { schema });
