import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/api-helpers";
import { getCurrentSessionContext } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { users as usersTable, appPermissions, satelliteApps } from "@/db/schema";
import { recordAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";
import { eq, and, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getCurrentSessionContext();
    if (!session.isAdmin) {
      return apiResponse({ message: "Unauthorized" }, 401);
    }

    const { id } = await params;
    console.log("[DEBUG] API GET /api/users/[id] called with params:", await params, "extracted id:", id);

    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        userType: usersTable.userType,
        status: usersTable.status,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!user) {
      return apiResponse({ message: "User not found" }, 404);
    }

    const perms = await db
      .select({
        appId: appPermissions.appId,
        role: appPermissions.role,
        appName: satelliteApps.name,
        features: appPermissions.features,
      })
      .from(appPermissions)
      .leftJoin(satelliteApps, eq(appPermissions.appId, satelliteApps.id))
      .where(eq(appPermissions.userId, id));

    return apiResponse({
      ...user,
      createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
      updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
      appPermissions: perms.map(p => ({
        ...p,
        features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? (() => { try { return JSON.parse(p.features); } catch { return []; } })() : [])
      })),
    });
  } catch (err) {
    console.error("[USER] GET error:", err);
    return apiResponse({ message: "Internal server error" }, 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getCurrentSessionContext();
    if (!session.isAdmin) {
      return apiResponse({ message: "Unauthorized" }, 401);
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, password, role, status, userType, appPermissions: newPerms } = body;

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (userType) updateData.userType = userType;
    updateData.updatedAt = new Date();

    const [oldUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (oldUser) {
      await db.update(usersTable).set(updateData).where(eq(usersTable.id, id));

      if (newPerms) {
        await db.delete(appPermissions).where(eq(appPermissions.userId, id));
        if (newPerms.length > 0) {
          await db.insert(appPermissions).values(
            newPerms.map((p: { appId: string; role: string; appName: string; features?: string[] }) => ({
              userId: id,
              appId: p.appId,
              role: p.role,
              features: p.features || [],
            })),
          );
        }
      }

      await recordAudit({
        action: "UPDATE",
        target: `user:${oldUser.email}`,
        targetSchema: "kemenag_pusdatin",
        performedBy: session.user?.email ?? "unknown",
        ip: getClientIp(request),
        beforeState: { name: oldUser.name, email: oldUser.email, role: oldUser.role },
        afterState: { name, email, role },
      });

      // Sync to Supabase Auth
      try {
        const { createAdminSupabaseClient } = await import("@/lib/supabase/admin");
        const adminClient = createAdminSupabaseClient();
        
        // Find auth user by email first, since IDs might not match
        const { data: authUsers } = await adminClient.auth.admin.listUsers();
        const authUser = authUsers?.users.find(u => u.email === oldUser.email);
        
        if (authUser) {
          const updatePayload: any = {};
          if (name) updatePayload.user_metadata = { full_name: name };
          if (email) updatePayload.email = email;
          if (password) updatePayload.password = password;
          
          if (Object.keys(updatePayload).length > 0) {
            await adminClient.auth.admin.updateUserById(authUser.id, updatePayload);
          }

          // Sync ke kemenag_surat.pengguna (E-Surat / SI MANDAU)
          const suratPerm = newPerms?.find((p: any) => p.appId === "e-surat-kemenag");
          try {
            if (suratPerm && suratPerm.role !== "none") {
              // Punya akses E-Surat → upsert dengan data terbaru
              const syncNama = name || oldUser.name;
              await db.execute(sql`
                INSERT INTO "kemenag_surat"."pengguna" (id, nama, is_active, created_at, updated_at)
                VALUES (${authUser.id}, ${syncNama}, true, now(), now())
                ON CONFLICT (id) DO UPDATE
                SET nama = EXCLUDED.nama,
                    is_active = true,
                    updated_at = now()
              `);
            } else if (suratPerm && suratPerm.role === "none") {
              // Akses dicabut → nonaktifkan di E-Surat
              await db.execute(sql`
                UPDATE "kemenag_surat"."pengguna"
                SET is_active = false, updated_at = now()
                WHERE id = ${authUser.id}
              `);
            }
          } catch (suratSyncErr) {
            console.error("[SYNC ERROR] Failed to sync to kemenag_surat:", suratSyncErr);
          }
        }
      } catch (authSyncErr) {
        console.error("[SYNC ERROR] Failed to sync to Supabase Auth:", authSyncErr);
      }
    }

    return apiResponse({ ok: true });
  } catch (err) {
    console.error("[USER] PUT error:", err);
    return apiResponse({ message: "Internal server error" }, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getCurrentSessionContext();
    if (!session.isAdmin) {
      return apiResponse({ message: "Unauthorized" }, 401);
    }

    const { id } = await params;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (user) {
      await db.delete(appPermissions).where(eq(appPermissions.userId, id));
      await db.delete(usersTable).where(eq(usersTable.id, id));

      try {
        const { createAdminSupabaseClient } = await import("@/lib/supabase/admin");
        const adminClient = createAdminSupabaseClient();

        // Cari auth user berdasarkan email untuk mendapatkan auth ID yang benar
        const { data: authUsers } = await adminClient.auth.admin.listUsers();
        const authUser = authUsers?.users.find(u => u.email === user.email);

        if (authUser) {
          // Hapus dari kemenag_surat.pengguna (E-Surat)
          try {
            await db.execute(sql`
              DELETE FROM "kemenag_surat"."pengguna"
              WHERE id = ${authUser.id}
            `);
          } catch (suratDeleteErr) {
            console.error("[DELETE ERROR] Failed to delete from kemenag_surat:", suratDeleteErr);
          }

          // Hapus dari Supabase Auth
          await adminClient.auth.admin.deleteUser(authUser.id);
        }
      } catch (authDeleteErr) {
        console.error("[DELETE ERROR] Failed to delete from Supabase Auth:", authDeleteErr);
      }

      await recordAudit({
        action: "DELETE",
        target: `user:${user.email}`,
        targetSchema: "kemenag_pusdatin",
        performedBy: session.user?.email ?? "unknown",
        ip: getClientIp(request),
        beforeState: { name: user.name, email: user.email, role: user.role },
      });
    }

    return apiResponse({ ok: true });
  } catch (err) {
    console.error("[USER] DELETE error:", err);
    return apiResponse({ message: "Internal server error" }, 500);
  }
}
