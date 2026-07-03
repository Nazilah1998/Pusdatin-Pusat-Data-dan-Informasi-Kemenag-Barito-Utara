// removed dynamic readEnv function as Next.js requires literal process.env access for client side variables
export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabasePublishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || "",
  databaseUrl: process.env.DATABASE_URL || "",
  directUrl: process.env.DIRECT_URL || "",
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL || "baritoutara@kemenag.go.id",
  pusdatinSchema: process.env.NEXT_PUBLIC_PUSDATIN_SCHEMA || "pusdatin",
  redisUrl: process.env.REDIS_URL || "",
};

if (!env.supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
}
