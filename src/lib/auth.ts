import { createServerSupabaseClient } from "./supabase/server";
import { db } from "./drizzle";
import { env } from "./env";
import { users as usersTable } from "../db/schema";
import { eq } from "drizzle-orm";

export interface SessionContext {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export async function getCurrentSessionContext(): Promise<SessionContext> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, isAuthenticated: false, isAdmin: false };
    }

    const [profile] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, user.id))
      .limit(1);

    const role = user.email === env.superAdminEmail
      ? "super_admin"
      : profile?.role || "viewer";

    const userData = {
      id: user.id,
      email: user.email ?? "",
      name: profile?.name || user.email?.split("@")[0] || "Admin",
      role,
    };

    return {
      user: userData,
      isAuthenticated: true,
      isAdmin: role === "super_admin" || role === "admin",
    };
  } catch {
    return { user: null, isAuthenticated: false, isAdmin: false };
  }
}
