"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function createDiscount(formData: FormData) {
  const supabase = await createClient();

  const data = {
    code: formData.get("code") as string,
    description: formData.get("description") as string,
    discount_type: formData.get("discount_type") as string,
    discount_value: parseFloat(formData.get("discount_value") as string),
    minimum_amount: formData.get("minimum_amount") ? parseFloat(formData.get("minimum_amount") as string) : null,
    usage_limit: formData.get("usage_limit") ? parseInt(formData.get("usage_limit") as string) : null,
    expires_at: formData.get("expires_at") ? (formData.get("expires_at") as string) : null,
    is_active: formData.get("is_active") === "true" || formData.get("is_active") === "on",
  };

  const { error } = await supabase
    .from("discount_codes")
    .insert(data);

  if (error) {
    redirect(`/admin/descuentos/nuevo?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/descuentos");
  redirect("/admin/descuentos");
}

export async function updateDiscount(id: string, formData: FormData) {
  const supabase = await createClient();

  const data = {
    code: formData.get("code") as string,
    description: formData.get("description") as string,
    discount_type: formData.get("discount_type") as string,
    discount_value: parseFloat(formData.get("discount_value") as string),
    minimum_amount: formData.get("minimum_amount") ? parseFloat(formData.get("minimum_amount") as string) : null,
    usage_limit: formData.get("usage_limit") ? parseInt(formData.get("usage_limit") as string) : null,
    expires_at: formData.get("expires_at") ? (formData.get("expires_at") as string) : null,
    is_active: formData.get("is_active") === "true" || formData.get("is_active") === "on",
  };

  const { error } = await supabase
    .from("discount_codes")
    .update(data)
    .eq("id", id);

  if (error) {
    redirect(`/admin/descuentos/editar/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/descuentos");
  redirect("/admin/descuentos");
}

export async function deleteDiscount(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("discount_codes")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/descuentos");
}