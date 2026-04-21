import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/(shop)/login/actions";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Verify Authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  // 2. Verify Authorization (Role check)
  const { data: profile, error: dbError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (dbError || profile?.role !== "admin") {
    redirect("/?error=unauthorized");
  }

  // 3. Get pending orders count
  const { count: pendingCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <AdminLayoutClient 
      pendingCount={pendingCount} 
      signoutAction={signout}
    >
      {children}
    </AdminLayoutClient>
  );
}
