import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/api-helpers";
import { getCurrentSessionContext } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { users as usersTable, appPermissions } from "@/db/schema";
import { recordAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";
import { eq, and } from "drizzle-orm";
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

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!user) {
      return apiResponse({ message: "User not found" }, 404);
    }

    const perms = await db
      .select()
      .from(appPermissions)
      .where(eq(appPermissions.userId, id));

    return apiResponse({ ...user, appPermissions: perms });
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
    const { name, email, password, role, status, appPermissions: newPerms } = body;

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;
    if (status) updateData.status = status;
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
            newPerms.map((p: { appId: string; role: string; appName: string }) => ({
              userId: id,
              appId: p.appId,
              role: p.role,
            })),
          );
        }
      }

      await recordAudit({
        action: "UPDATE",
        target: `user:${oldUser.email}`,
        targetSchema: "pusdatin",
        performedBy: session.user?.email ?? "unknown",
        ip: getClientIp(request),
        beforeState: { name: oldUser.name, email: oldUser.email, role: oldUser.role },
        afterState: { name, email, role },
      });
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

      await recordAudit({
        action: "DELETE",
        target: `user:${user.email}`,
        targetSchema: "pusdatin",
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
