import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/api-helpers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut({ scope: 'local' });
    return apiResponse({ ok: true });
  } catch {
    return apiResponse({ ok: true });
  }
}

