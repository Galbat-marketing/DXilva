import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CheckoutClientPage from "./CheckoutClientPage";

export default async function CheckoutPage() {
  // Verificar autenticación
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Debes+iniciar+sesión+para+procesar+tu+compra");
  }

  return <CheckoutClientPage />;
}