import { createClient } from "@/utils/supabase/server";
import { Product } from "@/types";

export async function getProducts(categorySlug?: string) {
  const supabase = await createClient();
  
  let query = supabase
    .from("products")
    .select("*, categories!inner(slug)")
    .eq("is_active", true);

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }

  return data as Product;
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}
