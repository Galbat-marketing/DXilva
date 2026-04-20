"use client";

import { useActionState } from "react";
import { createProduct, updateProduct } from "./actions";
import styles from "./nuevo/page.module.css";
import { Save, Image as ImageIcon, AlertCircle, RefreshCw } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialProduct?: any;
  categories: Category[] | null;
  mode: "create" | "edit";
}

export default function ProductForm({ initialProduct, categories, mode }: ProductFormProps) {
  // Bind the appropriate action
  const action = mode === "create" 
    ? createProduct 
    : updateProduct.bind(null, initialProduct.id);

  const [state, formAction, isPending] = useActionState(action, null);

  // Format images for the textarea (one per line)
  const imagesValue = initialProduct?.images 
    ? (Array.isArray(initialProduct.images) ? initialProduct.images.join("\n") : "") 
    : "";

  return (
    <form action={formAction} className={styles.form}>
      {/* Notifications */}
      {state?.error && (
        <div style={{ 
          gridColumn: '1 / -1',
          backgroundColor: "#fee2e2", 
          border: "1px solid #ef4444", 
          color: "#b91c1c", 
          padding: "1rem", 
          borderRadius: "0.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <AlertCircle size={20} />
          <span>Error: {state.error}</span>
        </div>
      )}

      <div className={styles.mainContent}>
        {/* Hidden inputs for update mode */}
        {mode === "edit" && (
          <input type="hidden" name="id" value={initialProduct.id} />
        )}
        <input type="hidden" name="slug" value={initialProduct?.slug || ""} />

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Información Básica</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nombre del Producto</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              placeholder="Ej: Auriculares Premium Gold" 
              defaultValue={initialProduct?.name}
              disabled={isPending}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="short_description">Descripción Corta</label>
            <input 
              type="text" 
              id="short_description" 
              name="short_description" 
              required 
              placeholder="Breve resumen para el catálogo" 
              defaultValue={initialProduct?.short_description}
              disabled={isPending}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Descripción Detallada</label>
            <textarea 
              id="description" 
              name="description" 
              rows={5} 
              required 
              placeholder="Características completas del producto..."
              defaultValue={initialProduct?.description}
              disabled={isPending}
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
                placeholder="https://ejemplo.com/portada.jpg" 
                defaultValue={initialProduct?.thumbnail_url}
                disabled={isPending}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="images">Galería de Imágenes (Opcional)</label>
            <textarea 
              id="images" 
              name="images" 
              rows={4} 
              placeholder="Pega una URL por línea para la galería completa..."
              defaultValue={imagesValue}
              disabled={isPending}
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
            <select id="category_id" name="category_id" required className={styles.select} defaultValue={initialProduct?.category_id} disabled={isPending}>
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
              defaultChecked={initialProduct ? initialProduct.is_active : true} 
              disabled={isPending}
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
              placeholder="0.00" 
              defaultValue={initialProduct?.price}
              disabled={isPending}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="compare_price">Precio de Comparación (Opcional)</label>
            <input 
              type="number" 
              id="compare_price" 
              name="compare_price" 
              step="0.01" 
              placeholder="0.00" 
              defaultValue={initialProduct?.compare_price}
              disabled={isPending}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="stock_quantity">Cantidad en Stock</label>
            <input 
              type="number" 
              id="stock_quantity" 
              name="stock_quantity" 
              required 
              placeholder="0" 
              defaultValue={initialProduct?.stock_quantity}
              disabled={isPending}
            />
          </div>
        </section>

        <button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? <RefreshCw size={20} className={styles.spin} /> : <Save size={20} />}
          {isPending 
            ? "Guardando..." 
            : mode === "create" ? "Guardar Producto" : "Actualizar Producto"
          }
        </button>
      </aside>
    </form>
  );
}
