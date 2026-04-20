"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("Error deleting product:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  return { success: true };
}
