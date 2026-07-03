import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/api-helpers";
import { getCurrentSessionContext } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { systemMetrics } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(_request: NextRequest) {
  try {
    const session = await getCurrentSessionContext();
    if (!session.isAdmin) {
      return apiResponse({ message: "Unauthorized" }, 401);
    }

    const [latest] = await db
      .select()
      .from(systemMetrics)
      .orderBy(desc(systemMetrics.recordedAt))
      .limit(1);

    return apiResponse(
      latest || { cpu: 0, ram: 0, storage: 0, uptime: "N/A" },
    );
  } catch (err) {
    console.error("[SYSTEM HEALTH] error:", err);
    return apiResponse({ message: "Internal server error" }, 500);
  }
}
