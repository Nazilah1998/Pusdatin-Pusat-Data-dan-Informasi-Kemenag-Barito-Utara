import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { satelliteApps } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Since Next.js 15, params is a Promise. Our version is 16.2.3.
) {
  try {
    const { id } = await params;
    
    const [app] = await db
      .select({ status: satelliteApps.status })
      .from(satelliteApps)
      .where(eq(satelliteApps.id, id));

    if (!app) {
      return NextResponse.json({ status: "online" }); // Fallback for unknown apps
    }

    return NextResponse.json({ status: app.status });
  } catch (err) {
    console.error("[PUBLIC APPS STATUS] GET error:", err);
    return NextResponse.json({ status: "online" }); // Fallback on error to not break apps
  }
}
