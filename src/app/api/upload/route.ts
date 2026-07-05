import { NextRequest, NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSessionContext();
    if (!session.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.name.split(".").pop();
    const filename = `app-logo-${uniqueSuffix}.${extension}`;

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads", "apps");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/apps/${filename}`;

    return NextResponse.json({ url: fileUrl, message: "File uploaded successfully" });
  } catch (error) {
    console.error("[UPLOAD] error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
