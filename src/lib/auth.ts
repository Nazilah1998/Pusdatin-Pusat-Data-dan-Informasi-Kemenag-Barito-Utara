import { createServerSupabaseClient } from "./supabase/server";
import type { User } from "@supabase/supabase-js";
import { db } from "./drizzle";
import { env } from "./env";
import { users as usersTable, appPermissions, satelliteApps } from "../db/schema";
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

export async function getCurrentSessionContext(serverUser?: User | null): Promise<SessionContext> {
  try {
    let user = serverUser;

    if (!user) {
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }

    if (!user) {
      return { user: null, isAuthenticated: false, isAdmin: false };
    }

    const [profile] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user.email ?? ""))
      .limit(1);

    const isCentralSuperAdmin =
      user.app_metadata?.role === "super_admin" ||
      user.user_metadata?.role === "super_admin";

    const role = isCentralSuperAdmin
      ? "super_admin"
      : user.email === env.superAdminEmail
      ? "super_admin"
      : profile?.role || "viewer";

    const perms = await db
      .select({
        appId: appPermissions.appId,
        role: appPermissions.role,
        appName: satelliteApps.name,
      })
      .from(appPermissions)
      .leftJoin(satelliteApps, eq(appPermissions.appId, satelliteApps.id))
      .where(eq(appPermissions.userId, user.id));

    const userData = {
      id: user.id,
      email: user.email ?? "",
      name: profile?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin",
      role,
      appPermissions: perms,
    };

    return {
      user: userData,
      isAuthenticated: true,
      isAdmin: role === "super_admin",
    };
  } catch (error) {
    console.error("[AUTH] getCurrentSessionContext error:", error);
    return { user: null, isAuthenticated: false, isAdmin: false };
  }
}
