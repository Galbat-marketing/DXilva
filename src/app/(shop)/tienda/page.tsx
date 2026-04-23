import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getProducts } from "@/lib/supabase-data";
import AddToCartBtn from "@/components/AddToCartBtn";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function TiendaPage(props: { searchParams: Promise<{ categoria?: string }> }) {
  const searchParams = await props.searchParams;
  const categorySlug = searchParams.categoria;

  // Verificar autenticación
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Debes+iniciar+sesión+para+ver+nuestros+productos");
  }

  const products = await getProducts(categorySlug);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {categorySlug ? `Categoría: ${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}` : "Catálogo de Productos"}
        </h1>
        <p className={styles.subtitle}>
          {categorySlug 
            ? `Explorando nuestra selección de ${categorySlug}` 
            : "Descubre nuestra selección exclusiva en tiempo real"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className={styles.loader}>
          <h3>Aún no hay productos disponibles.</h3>
          {/* <p>Utiliza el panel de Supabase para añadir artículos a la tabla 'products'.</p> */}
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <Link href={`/tienda/${product.slug}`} className={styles.imageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.thumbnail_url} 
                  alt={product.name} 
                  className={styles.image} 
                />
              </Link>
              
              <div className={styles.cardBody}>
                <Link href={`/tienda/${product.slug}`}>
                  <h3 className={styles.productName}>{product.name}</h3>
                </Link>
                <p className={styles.shortDescription}>{product.short_description}</p>
                
                <div className={styles.priceRow}>
                  <div>
                    <span className={styles.price}>${product.price.toFixed(2)}</span>
                    {product.compare_price && (
                      <span className={styles.oldPrice}>${product.compare_price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <AddToCartBtn product={product} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
