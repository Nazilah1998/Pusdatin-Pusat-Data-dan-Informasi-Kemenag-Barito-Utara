import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/api-helpers";
import { getCurrentSessionContext } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { satelliteApps, auditLogs } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export async function GET(_request: NextRequest) {
  try {
    const session = await getCurrentSessionContext();
    if (!session.isAdmin) {
      return apiResponse({ message: "Unauthorized" }, 401);
    }

    const apps = await db.select().from(satelliteApps);
    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

    const result = await Promise.all(
      apps.map(async (app, i) => {
        const [countResult] = await db
          .select({ count: sql<number>`count(*)` })
          .from(auditLogs)
          .where(eq(auditLogs.targetSchema, app.schemaName));

        return {
          appName: app.name,
          count: Number(countResult?.count || 0),
          color: colors[i % colors.length],
        };
      }),
    );

    return apiResponse(result);
  } catch (err) {
    console.error("[REPORTS APP-SUMMARY] error:", err);
    return apiResponse({ message: "Internal server error" }, 500);
  }
}
