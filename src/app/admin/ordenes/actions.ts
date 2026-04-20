"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/ordenes");
  revalidatePath("/admin");
  return { success: true };
}
