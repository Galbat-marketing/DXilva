import { createClient } from "@/utils/supabase/server";
import ProductForm from "../ProductForm";
import Link from "next/link";
import styles from "./page.module.css";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  const supabase = await createClient();

  // Fetch categories for the select input
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
        <h1>Añadir Nuevo Producto</h1>
      </header>

      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
