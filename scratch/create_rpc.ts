import { db } from "../src/lib/drizzle";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Creating get_pusdatin_user RPC...");

  try {
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION public.get_pusdatin_user(email_address TEXT)
      RETURNS JSONB
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        result JSONB;
      BEGIN
        SELECT jsonb_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email,
          'role', u.role,
          'status', u.status,
          'userType', u.user_type,
          'app_permissions', COALESCE(
            (SELECT jsonb_agg(ap) FROM pusdatin.app_permissions ap WHERE ap.user_id = u.id), 
            '[]'::jsonb
          )
        ) INTO result
        FROM pusdatin.users u
        WHERE u.email = email_address;
        
        RETURN result;
      END;
      $$;
    `);

    console.log("RPC created successfully!");
  } catch (err) {
    console.error("Error creating RPC:", err);
  }
  process.exit(0);
}

run();
