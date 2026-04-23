import { createClient } from "@/utils/supabase/server";
import ProductForm from "../../ProductForm";
import Link from "next/link";
import styles from "../../nuevo/page.module.css";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch the product data
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!product) {
    return notFound();
  }

  // 2. Fetch categories for the select input
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin/productos" className={styles.backLink}>
          <ArrowLeft size={18} /> Volver a productos
        </Link>
        <h1>Editar Producto</h1>
        <p className={styles.productId}>ID: {id}</p>
      </header>

      <ProductForm initialProduct={product} categories={categories} mode="edit" />
    </div>
  );
}
