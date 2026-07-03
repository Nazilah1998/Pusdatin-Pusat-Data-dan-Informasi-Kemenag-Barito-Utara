function readEnv(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

export const env = {
  siteUrl: readEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  supabaseUrl: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabasePublishableKey:
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  turnstileSiteKey: readEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY"),
  turnstileSecretKey: readEnv("TURNSTILE_SECRET_KEY"),
  databaseUrl: readEnv("DATABASE_URL"),
  directUrl: readEnv("DIRECT_URL"),
  superAdminEmail: readEnv("SUPER_ADMIN_EMAIL", "baritoutara@kemenag.go.id"),
  pusdatinSchema: readEnv("NEXT_PUBLIC_PUSDATIN_SCHEMA", "pusdatin"),
  redisUrl: readEnv("REDIS_URL", ""),
};

if (!env.supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
}
