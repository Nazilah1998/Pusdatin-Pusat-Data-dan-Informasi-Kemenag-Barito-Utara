import {
  pgSchema,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const pusdatin = pgSchema("kemenag_pusdatin");

export const users = pusdatin.table("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash"),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  userType: varchar("user_type", { length: 50 }).notNull().default("internal_admin"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const satelliteApps = pusdatin.table("satellite_apps", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  url: varchar("url", { length: 500 }),
  schemaName: varchar("schema_name", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("online"),
  lastHealthCheck: timestamp("last_health_check"),
  availableFeatures: jsonb("available_features"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appPermissions = pusdatin.table("app_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  appId: varchar("app_id", { length: 50 }).notNull().references(() => satelliteApps.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull().default("none"),
  features: jsonb("features"),
});

export const auditLogs = pusdatin.table("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  action: varchar("action", { length: 20 }).notNull(),
  target: varchar("target", { length: 255 }).notNull(),
  targetSchema: varchar("target_schema", { length: 100 }),
  performedBy: varchar("performed_by", { length: 255 }).notNull(),
  beforeState: jsonb("before_state"),
  afterState: jsonb("after_state"),
  ip: varchar("ip", { length: 50 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const systemMetrics = pusdatin.table("system_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  cpu: integer("cpu").notNull().default(0),
  ram: integer("ram").notNull().default(0),
  storage: integer("storage").notNull().default(0),
  uptime: varchar("uptime", { length: 100 }),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});
