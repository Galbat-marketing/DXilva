import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CarritoClientPage from "./CarritoClientPage";

export default async function CarritoPage() {
  // Verificar autenticación
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Debes+iniciar+sesión+para+ver+tu+carrito");
  }

  return <CarritoClientPage />;
}
