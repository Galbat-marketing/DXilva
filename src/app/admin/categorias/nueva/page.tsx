import { createCategory } from "../actions";
import Link from "next/link";
import styles from "../../productos/nuevo/page.module.css"; // Reuse form styles
import { ArrowLeft, Save } from "lucide-react";

export default function NewCategoryPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin/categorias" className={styles.backLink}>
          <ArrowLeft size={18} /> Volver a categorías
        </Link>
        <h1>Crear Nueva Categoría</h1>
      </header>

      <form action={createCategory} className={styles.form} style={{ maxWidth: "600px" }}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Detalles de la Categoría</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" name="name" required placeholder="Ej: Relojes, Mochilas..." />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Descripción</label>
            <textarea id="description" name="description" rows={3} placeholder="Breve descripción de los productos en esta categoría"></textarea>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="sort_order">Prioridad/Orden (Número)</label>
            <input type="number" id="sort_order" name="sort_order" defaultValue="0" />
          </div>
          
          <button type="submit" className={styles.submitBtn}>
            <Save size={20} />
            Guardar Categoría
          </button>
        </section>
      </form>
    </div>
  );
}
