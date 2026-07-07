import { AppShell } from "@/components/layout/AppShell";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (data?.currentLevel !== 'aal2') {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
