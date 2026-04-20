"use client";

import { useActionState } from "react";
import { createCategory } from "../actions";
import Link from "next/link";
import styles from "../../productos/nuevo/page.module.css"; // Reuse form styles
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function NewCategoryPage() {
  const [state, formAction, isPending] = useActionState(createCategory, null);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin/categorias" className={styles.backLink}>
          <ArrowLeft size={18} /> Volver a categorías
        </Link>
        <h1>Crear Nueva Categoría</h1>
      </header>

      {state?.error && (
        <div style={{ 
          backgroundColor: "#fee2e2", 
          border: "1px solid #ef4444", 
          color: "#b91c1c", 
          padding: "1rem", 
          borderRadius: "0.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          maxWidth: "600px"
        }}>
          <AlertCircle size={20} />
          <span>Error: {state.error}</span>
        </div>
      )}

      <form action={formAction} className={styles.form} style={{ maxWidth: "600px" }}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Detalles de la Categoría</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" name="name" required placeholder="Ej: Relojes, Mochilas..." disabled={isPending} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Descripción</label>
            <textarea id="description" name="description" rows={3} placeholder="Breve descripción de los productos en esta categoría" disabled={isPending}></textarea>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="sort_order">Prioridad/Orden (Número)</label>
            <input type="number" id="sort_order" name="sort_order" defaultValue="0" disabled={isPending} />
          </div>
          
          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            <Save size={20} />
            {isPending ? "Guardando..." : "Guardar Categoría"}
          </button>
        </section>
      </form>
    </div>
  );
}
