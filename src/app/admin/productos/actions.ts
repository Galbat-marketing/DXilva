"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function createProduct(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // Get current user for seller_id
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const slug = (formData.get("name") as string)
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  const imagesRaw = formData.get("images") as string;
  const images = imagesRaw ? imagesRaw.split("\n").map(url => url.trim()).filter(url => url !== "") : [];

  const productData = {
    name: formData.get("name") as string,
    slug: slug,
    description: formData.get("description") as string,
    short_description: formData.get("short_description") as string,
    price: parseFloat(formData.get("price") as string),
    compare_price: formData.get("compare_price") ? parseFloat(formData.get("compare_price") as string) : null,
    stock_quantity: parseInt(formData.get("stock_quantity") as string),
    category_id: formData.get("category_id") as string,
    thumbnail_url: formData.get("thumbnail_url") as string,
    images: images,
    is_active: formData.get("is_active") === "on",
    seller_id: user.id,
  };

  const { error } = await supabase.from("products").insert(productData);

  if (error) {
    console.error("Error creating product:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  redirect("/admin/productos");
}

export async function updateProduct(id: string, prevState: any, formData: FormData) {
  const supabase = await createClient();

  // Get current user for validation (sellers can only update own, admins can update all)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const imagesRaw = formData.get("images") as string;
  const images = imagesRaw ? imagesRaw.split("\n").map(url => url.trim()).filter(url => url !== "") : [];

  const updateData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    short_description: formData.get("short_description") as string,
    price: parseFloat(formData.get("price") as string),
    compare_price: formData.get("compare_price") ? parseFloat(formData.get("compare_price") as string) : null,
    stock_quantity: parseInt(formData.get("stock_quantity") as string),
    category_id: formData.get("category_id") as string,
    thumbnail_url: formData.get("thumbnail_url") as string,
    images: images,
    is_active: formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating product:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/productos");
  revalidatePath(`/tienda/${formData.get("slug")}`);
  revalidatePath("/tienda");
  redirect("/admin/productos");
}
