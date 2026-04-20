import { createClient } from "@/utils/supabase/server";
import { createProduct } from "../actions";
import Link from "next/link";
import styles from "./page.module.css";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";

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

      <form action={createProduct} className={styles.form}>
        <div className={styles.mainContent}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Información Básica</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Nombre del Producto</label>
              <input type="text" id="name" name="name" required placeholder="Ej: Auriculares Premium Gold" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="short_description">Descripción Corta</label>
              <input type="text" id="short_description" name="short_description" required placeholder="Breve resumen para el catálogo" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="description">Descripción Detallada</label>
              <textarea id="description" name="description" rows={5} required placeholder="Características completas del producto..."></textarea>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Multimedia</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="thumbnail_url">URL de la Imagen Principal (Portada)</label>
              <div className={styles.imageInputWrapper}>
                <ImageIcon size={20} className={styles.inputIcon} />
                <input type="url" id="thumbnail_url" name="thumbnail_url" required placeholder="https://ejemplo.com/portada.jpg" />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="images">Galería de Imágenes (Opcional)</label>
              <textarea id="images" name="images" rows={4} placeholder="Pega una URL por línea para la galería completa..."></textarea>
              <p className={styles.helpText}>Introduce cada URL de imagen adicional en una línea nueva.</p>
            </div>
          </section>
        </div>

        <aside className={styles.sideContent}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Estado y Categoría</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="category_id">Categoría</label>
              <select id="category_id" name="category_id" required className={styles.select}>
                <option value="">Selecciona una...</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="is_active" name="is_active" defaultChecked />
              <label htmlFor="is_active">Producto Activo (Visible en tienda)</label>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Precio e Inventario</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="price">Precio (USD)</label>
              <input type="number" id="price" name="price" step="0.01" required placeholder="0.00" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="compare_price">Precio de Comparación (Opcional)</label>
              <input type="number" id="compare_price" name="compare_price" step="0.01" placeholder="0.00" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="stock_quantity">Cantidad en Stock</label>
              <input type="number" id="stock_quantity" name="stock_quantity" required placeholder="0" />
            </div>
          </section>

          <button type="submit" className={styles.submitBtn}>
            <Save size={20} />
            Guardar Producto
          </button>
        </aside>
      </form>
    </div>
  );
}
