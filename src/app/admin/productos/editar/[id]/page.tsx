import { createClient } from "@/utils/supabase/server";
import { updateProduct } from "../../actions";
import Link from "next/link";
import styles from "../../nuevo/page.module.css";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch the product data
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (productError || !product) {
    return notFound();
  }

  // 2. Fetch categories for the select input
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  // Format images for the textarea (one per line)
  const imagesValue = product.images ? (Array.isArray(product.images) ? product.images.join("\n") : "") : "";

  // Bind the ID to the update action
  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin/productos" className={styles.backLink}>
          <ArrowLeft size={18} /> Volver a productos
        </Link>
        <h1>Editar Producto</h1>
        <p className={styles.productId}>ID: {id}</p>
      </header>

      <form action={updateProductWithId} className={styles.form}>
        <input type="hidden" name="slug" value={product.slug} />
        
        <div className={styles.mainContent}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Información Básica</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Nombre del Producto</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                defaultValue={product.name}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="short_description">Descripción Corta</label>
              <input 
                type="text" 
                id="short_description" 
                name="short_description" 
                required 
                defaultValue={product.short_description}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="description">Descripción Detallada</label>
              <textarea 
                id="description" 
                name="description" 
                rows={5} 
                required
                defaultValue={product.description}
              ></textarea>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Multimedia</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="thumbnail_url">URL de la Imagen Principal (Portada)</label>
              <div className={styles.imageInputWrapper}>
                <ImageIcon size={20} className={styles.inputIcon} />
                <input 
                  type="url" 
                  id="thumbnail_url" 
                  name="thumbnail_url" 
                  required 
                  defaultValue={product.thumbnail_url}
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="images">Galería de Imágenes (Opcional)</label>
              <textarea 
                id="images" 
                name="images" 
                rows={4}
                defaultValue={imagesValue}
              ></textarea>
              <p className={styles.helpText}>Introduce cada URL de imagen adicional en una línea nueva.</p>
            </div>
          </section>
        </div>

        <aside className={styles.sideContent}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Estado y Categoría</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="category_id">Categoría</label>
              <select id="category_id" name="category_id" required className={styles.select} defaultValue={product.category_id}>
                <option value="">Selecciona una...</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.checkboxGroup}>
              <input 
                type="checkbox" 
                id="is_active" 
                name="is_active" 
                defaultChecked={product.is_active} 
              />
              <label htmlFor="is_active">Producto Activo (Visible en tienda)</label>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Precio e Inventario</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="price">Precio (USD)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                step="0.01" 
                required 
                defaultValue={product.price}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="compare_price">Precio de Comparación (Opcional)</label>
              <input 
                type="number" 
                id="compare_price" 
                name="compare_price" 
                step="0.01" 
                defaultValue={product.compare_price || ""}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="stock_quantity">Cantidad en Stock</label>
              <input 
                type="number" 
                id="stock_quantity" 
                name="stock_quantity" 
                required 
                defaultValue={product.stock_quantity}
              />
            </div>
          </section>

          <button type="submit" className={styles.submitBtn}>
            <Save size={20} />
            Actualizar Producto
          </button>
        </aside>
      </form>
    </div>
  );
}
