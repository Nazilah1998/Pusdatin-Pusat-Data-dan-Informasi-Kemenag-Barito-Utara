import { AppShell } from "@/components/layout/AppShell";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  let isTrusted = false;
  if (data?.currentLevel !== 'aal2') {
    const cookieStore = await cookies();
    const trustedCookie = cookieStore.get('trusted_device')?.value;
    if (trustedCookie) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const [cookieUserId, signature] = trustedCookie.split('.');
        if (cookieUserId === session.user.id) {
          const secret = process.env.TURNSTILE_SECRET_KEY || 'pusdatin_secret_key';
          const expectedSignature = crypto.createHmac('sha256', secret).update(session.user.id).digest('hex');
          if (signature === expectedSignature) {
            isTrusted = true;
          }
        }
      }
    }
    
    if (!isTrusted) {
      redirect("/login");
    }
  }

  return <AppShell>{children}</AppShell>;
}
