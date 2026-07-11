import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "./env";
import * as schema from "../db/schema";

const globalForDb = globalThis as unknown as {
  postgresPool: pg.Pool | undefined;
};

const isProd = process.env.NODE_ENV === "production";

function createPool() {
  return new pg.Pool({
    connectionString: env.databaseUrl,
    max: isProd ? 10 : 3,
    idleTimeoutMillis: isProd ? 30000 : 5000,
    connectionTimeoutMillis: 15000, // VPS remote butuh waktu lebih lama
    allowExitOnIdle: !isProd,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  });
}

const pool = globalForDb.postgresPool ?? createPool();

if (!isProd) {
  globalForDb.postgresPool = pool;
}

pool.on("error", (err) => {
  console.error("[DB] Pool error:", err.message);
});

export const db = drizzle(pool, { schema });
