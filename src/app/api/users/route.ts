import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/api-helpers";
import { getCurrentSessionContext } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { users as usersTable } from "@/db/schema";
import { recordAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSessionContext();
    if (!session.isAdmin) {
      return apiResponse({ message: "Unauthorized" }, 401);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();

    const allUsers = await db.select().from(usersTable);

    const filtered = search
      ? allUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search),
        )
      : allUsers;

    return apiResponse(filtered);
  } catch (err) {
    console.error("[USERS] GET error:", err);
    return apiResponse({ message: "Internal server error" }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSessionContext();
    if (!session.isAdmin) {
      return apiResponse({ message: "Unauthorized" }, 401);
    }

    const body = await request.json();
    const { name, email, password, role, status } = body;

    if (!name || !email) {
      return apiResponse({ message: "Nama dan email wajib diisi" }, 400);
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const [newUser] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        passwordHash,
        role: role || "viewer",
        status: status || "active",
      })
      .returning();

    await recordAudit({
      action: "INSERT",
      target: `user:${newUser.email}`,
      targetSchema: "pusdatin",
      performedBy: session.user?.email ?? "unknown",
      ip: getClientIp(request),
      afterState: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });

    return apiResponse(newUser, 201);
  } catch (err) {
    console.error("[USERS] POST error:", err);
    return apiResponse({ message: "Internal server error" }, 500);
  }
}
