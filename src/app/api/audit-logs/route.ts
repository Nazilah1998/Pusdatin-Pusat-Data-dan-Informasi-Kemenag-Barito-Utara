import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/api-helpers";
import { getCurrentSessionContext } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { auditLogs } from "@/db/schema";
import { eq, desc, like, and, gte, lte } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSessionContext();
    if (!session.isAdmin) {
      return apiResponse({ message: "Unauthorized" }, 401);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const actionFilter = searchParams.get("action");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");

    const conditions: ReturnType<typeof eq>[] = [];

    if (actionFilter) {
      conditions.push(eq(auditLogs.action, actionFilter));
    }
    if (startDate) {
      conditions.push(gte(auditLogs.timestamp, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(auditLogs.timestamp, new Date(endDate)));
    }

    let query = db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    if (search) {
      query = query.where(like(auditLogs.target, `%${search}%`)) as typeof query;
    }

    const offset = (page - 1) * limit;
    const data = await query.limit(limit).offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogs);

    const total = Number(countResult[0]?.count || 0);

    return apiResponse({ data, total });
  } catch (err) {
    console.error("[AUDIT] GET error:", err);
    return apiResponse({ message: "Internal server error" }, 500);
  }
}
