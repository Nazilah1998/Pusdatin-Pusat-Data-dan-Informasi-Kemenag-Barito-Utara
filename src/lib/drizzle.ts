import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "./env";
import * as schema from "../db/schema";

const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: 30,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("[DB] Pool error:", err.message);
});

export const db = drizzle(pool, { schema });
