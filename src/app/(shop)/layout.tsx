import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import { getStoreSettings } from "@/lib/store-settings";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const settings = await getStoreSettings();
  let role = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    role = profile?.role;
  }

  return (
    <>
      <Header initialUser={user} initialRole={role} />
      {children}
      <Footer settings={settings} />
    </>
  );
}
