"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function createCategory(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    description: formData.get("description") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_active: true
  });

  if (error) {
    console.error("Error creating category:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}
