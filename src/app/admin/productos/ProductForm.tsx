"use client";

import { useActionState, useState } from "react";
import { createProduct, updateProduct } from "./actions";
import { createProductSchema, updateProductSchema } from "@/lib/validations";
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
  const schema = mode === "create" ? createProductSchema : updateProductSchema;

  // Form state
  const [formData, setFormData] = useState({
    name: initialProduct?.name || "",
    short_description: initialProduct?.short_description || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price?.toString() || "",
    compare_price: initialProduct?.compare_price?.toString() || "",
    thumbnail_url: initialProduct?.thumbnail_url || "",
    images: initialProduct?.images || "",
    category_id: initialProduct?.category_id || "",
    stock_quantity: initialProduct?.stock_quantity?.toString() || "",
    is_active: initialProduct?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);

  // Bind the appropriate action
  const serverAction = mode === "create"
    ? createProduct
    : updateProduct.bind(null, initialProduct.id);

  const [serverState, serverFormAction, serverPending] = useActionState(serverAction, null);

  // Handle server action call
  const submitToServer = async (formData: FormData) => {
    await serverFormAction(formData);
  };

  // Handle form submission with validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Prepare data for validation
    const dataToValidate = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : undefined,
      compare_price: formData.compare_price ? parseFloat(formData.compare_price) : undefined,
      stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : undefined,
      images: formData.images || undefined,
    };

    // Validate with Zod
    const result = schema.safeParse(dataToValidate);
    if (!result.success) {
      const validationErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        validationErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(validationErrors);
      return;
    }

    setIsPending(true);

    // Create FormData for server action
    const formDataObj = new FormData();
    Object.entries(result.data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formDataObj.append(key, value.toString());
      }
    });

    try {
      await submitToServer(formDataObj);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsPending(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: checked !== undefined ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Format images for the textarea (one per line)
  const imagesValue = initialProduct?.images 
    ? (Array.isArray(initialProduct.images) ? initialProduct.images.join("\n") : "") 
    : "";

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Notifications */}
      {(serverState?.error || Object.keys(errors).length > 0) && (
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
          <span>
            {serverState?.error && `Error: ${serverState.error}`}
            {Object.keys(errors).length > 0 && "Por favor corrige los errores en el formulario"}
          </span>
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
              value={formData.name}
              onChange={handleChange}
              disabled={isPending || serverPending}
              className={errors.name ? styles.inputError : ""}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="short_description">Descripción Corta</label>
            <input
              type="text"
              id="short_description"
              name="short_description"
              required
              placeholder="Breve resumen para el catálogo"
              value={formData.short_description}
              onChange={handleChange}
              disabled={isPending || serverPending}
              className={errors.short_description ? styles.inputError : ""}
            />
            {errors.short_description && <span className={styles.errorText}>{errors.short_description}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Descripción Detallada</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              placeholder="Características completas del producto..."
              value={formData.description}
              onChange={handleChange}
              disabled={isPending || serverPending}
              className={errors.description ? styles.inputError : ""}
            ></textarea>
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
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
                value={formData.thumbnail_url}
                onChange={handleChange}
                disabled={isPending || serverPending}
                className={errors.thumbnail_url ? styles.inputError : ""}
              />
            </div>
            {errors.thumbnail_url && <span className={styles.errorText}>{errors.thumbnail_url}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="images">Galería de Imágenes (Opcional)</label>
            <textarea
              id="images"
              name="images"
              rows={4}
              placeholder="Pega una URL por línea para la galería completa..."
              value={formData.images}
              onChange={handleChange}
              disabled={isPending || serverPending}
              className={errors.images ? styles.inputError : ""}
            ></textarea>
            <p className={styles.helpText}>Introduce cada URL de imagen adicional en una línea nueva.</p>
            {errors.images && <span className={styles.errorText}>{errors.images}</span>}
          </div>
        </section>
      </div>

      <aside className={styles.sideContent}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Estado y Categoría</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="category_id">Categoría</label>
            <select
              id="category_id"
              name="category_id"
              required
              className={styles.select}
              value={formData.category_id}
              onChange={handleChange}
              disabled={isPending || serverPending}
            >
              <option value="">Selecciona una...</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <span className={styles.errorText}>{errors.category_id}</span>}
          </div>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              disabled={isPending || serverPending}
            />
            <label htmlFor="is_active">Producto Activo (Visible en tienda)</label>
            {errors.is_active && <span className={styles.errorText}>{errors.is_active}</span>}
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
              value={formData.price}
              onChange={handleChange}
              disabled={isPending || serverPending}
              className={errors.price ? styles.inputError : ""}
            />
            {errors.price && <span className={styles.errorText}>{errors.price}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="compare_price">Precio de Comparación (Opcional)</label>
            <input
              type="number"
              id="compare_price"
              name="compare_price"
              step="0.01"
              placeholder="0.00"
              value={formData.compare_price}
              onChange={handleChange}
              disabled={isPending || serverPending}
              className={errors.compare_price ? styles.inputError : ""}
            />
            {errors.compare_price && <span className={styles.errorText}>{errors.compare_price}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="stock_quantity">Cantidad en Stock</label>
            <input
              type="number"
              id="stock_quantity"
              name="stock_quantity"
              required
              placeholder="0"
              value={formData.stock_quantity}
              onChange={handleChange}
              disabled={isPending || serverPending}
              className={errors.stock_quantity ? styles.inputError : ""}
            />
            {errors.stock_quantity && <span className={styles.errorText}>{errors.stock_quantity}</span>}
          </div>
        </section>

        <button type="submit" className={styles.submitBtn} disabled={isPending || serverPending}>
          {(isPending || serverPending) ? <RefreshCw size={20} className={styles.spin} /> : <Save size={20} />}
          {(isPending || serverPending)
            ? "Guardando..."
            : mode === "create" ? "Guardar Producto" : "Actualizar Producto"
          }
        </button>
      </aside>
    </form>
  );
}
