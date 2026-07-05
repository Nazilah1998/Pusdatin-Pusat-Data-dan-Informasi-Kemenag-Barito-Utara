import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/api-helpers";
import { getCurrentSessionContext } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { satelliteApps } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentSessionContext();
    if (!session.isAdmin) {
      return apiResponse({ message: "Unauthorized" }, 401);
    }

    const apps = await db.select().from(satelliteApps).orderBy(asc(satelliteApps.sortOrder));
    return apiResponse(apps);
  } catch (err) {
    console.error("[APPS] GET error:", err);
    return apiResponse({ message: "Internal server error" }, 500);
  }
}
