"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  const settingsData = {
    store_name: formData.get("store_name") as string,
    support_email: formData.get("support_email") as string,
    contact_phone: formData.get("contact_phone") as string,
    meta_description: formData.get("meta_description") as string,
    maintenance_mode: formData.get("maintenance_mode") === "on",
    updated_at: new Date().toISOString(),
  };

  // Upsert the single settings record (ID 1)
  const { error } = await supabase
    .from("store_settings")
    .upsert({ id: "1", ...settingsData });

  if (error) {
    console.error("Error updating settings:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/configuracion");
  revalidatePath("/");
  return { success: true };
}
