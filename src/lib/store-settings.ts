import { createClient } from "@/utils/supabase/server";

export interface StoreSettings {
  id: string;
  store_name: string;
  support_email: string;
  contact_phone: string;
  meta_description: string;
  maintenance_mode: boolean;
  updated_at: string;
}

export async function getStoreSettings(): Promise<StoreSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", "1")
    .single();

  if (error) {
    if (error.code !== "PGRST116") { // Ignore "no rows found" error
      console.error("Error fetching store settings:", error);
    }
    return null;
  }

  return data as StoreSettings;
}
