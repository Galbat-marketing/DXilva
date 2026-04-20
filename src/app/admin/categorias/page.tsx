import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import styles from "./page.module.css";
import { Plus, Edit, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*, products(count)")
    .order("sort_order");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Categorías</h1>
          <p>Organiza tus productos en grupos lógicos</p>
        </div>
        <Link href="/admin/categorias/nueva" className={styles.addBtn}>
          <Plus size={20} />
          Nueva Categoría
        </Link>
      </header>

      <div className={styles.grid}>
        {categories && categories.length > 0 ? (
          categories.map((cat: any) => (
            <div key={cat.id} className={styles.categoryCard}>
              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryName}>{cat.name}</h3>
                <p className={styles.categoryDesc}>{cat.description}</p>
                <span className={styles.productCount}>
                  {cat.products?.[0]?.count || 0} productos asociados
                </span>
              </div>
              <div className={styles.categoryActions}>
                <button className={styles.iconBtn} title="Editar">
                  <Edit size={18} />
                </button>
                <button className={`${styles.iconBtn} ${styles.deleteBtn}`} title="Eliminar">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>No hay categorías creadas.</div>
        )}
      </div>
    </div>
  );
}
