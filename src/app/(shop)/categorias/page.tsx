import Link from "next/link";
import styles from "./page.module.css";
import { getCategories } from "@/lib/supabase-data";
import { 
  Laptop, 
  Shirt, 
  Home, 
  Dumbbell, 
  BookOpen, 
  LayoutGrid,
  ShoppingBag,
  Zap,
  ArrowRight
} from "lucide-react";

// Mapeo dinámico de iconos basado en el slug
const ICON_MAP: Record<string, any> = {
  electronica: Laptop,
  tecnologia: Zap,
  ropa: Shirt,
  moda: ShoppingBag,
  hogar: Home,
  deportes: Dumbbell,
  libros: BookOpen,
};

export default async function CategoriasPage() {
  const categories = await getCategories();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Nuestras Categorías</h1>
        <p className={styles.subtitle}>Descubre lo mejor de D'XILVA en cada departamento</p>
      </header>

      <div className={styles.grid}>
        {categories.map((category: any) => {
          const Icon = ICON_MAP[category.slug] || LayoutGrid;
          
          return (
            <Link key={category.id} href={`/tienda?categoria=${category.slug}`} className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon size={32} strokeWidth={1.5} />
              </div>
              <div className={styles.info}>
                <h2 className={styles.cardTitle}>{category.name}</h2>
                <div className={styles.action}>
                  <span>Explorar selección</span>
                  <ArrowRight size={16} />
                </div>
              </div>
              <div className={styles.decoration}></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
