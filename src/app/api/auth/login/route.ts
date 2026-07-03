import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/api-helpers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentSessionContext } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(`login:${ip}`, 5, 60_000);
    if (!success) {
      return apiResponse({ message: "Terlalu banyak percobaan login. Silakan coba lagi nanti." }, 429);
    }

    const { email, password, turnstileToken } = await request.json();

    if (!email || !password || !turnstileToken) {
      return apiResponse({ message: "Email, password, dan verifikasi keamanan wajib diisi" }, 400);
    }

    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.turnstileSecretKey,
        response: turnstileToken,
      }),
      signal: AbortSignal.timeout(5000),
    });

    const verifyJson = await verifyRes.json();
    if (!verifyJson.success) {
      return apiResponse({ message: "Verifikasi keamanan gagal. Silakan coba lagi." }, 400);
    }

    const supabase = await createServerSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return apiResponse({ message: "Email atau password salah" }, 401);
    }

    const session = await getCurrentSessionContext();
    if (!session.isAdmin) {
      await supabase.auth.signOut();
      return apiResponse({ message: "Akun ini tidak memiliki akses ke portal Pusdatin" }, 403);
    }

    await recordAudit({
      action: "INSERT",
      target: `login:${authData.user.email}`,
      targetSchema: "pusdatin",
      performedBy: authData.user.email ?? "unknown",
      ip,
    });

    return apiResponse({
      user: session.user,
      token: authData.session?.access_token ?? "",
    });
  } catch (err) {
    console.error("[LOGIN] Error:", err);
    return apiResponse({ message: "Terjadi kesalahan server" }, 500);
  }
}
