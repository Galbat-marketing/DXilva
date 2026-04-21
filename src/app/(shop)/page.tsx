import styles from "./page.module.css";
import { ArrowRight, ShoppingBag, Percent } from "@/components/Icons";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  // Fetch products with discount (compare_price > price)
  const { data: discountedProducts } = await supabase
    .from("products")
    .select("*")
    .gt("compare_price", "0")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  // We only show products where compare_price is actually greater than price
  const offers = discountedProducts?.filter(p => Number(p.compare_price) > Number(p.price)) || [];

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Transformando el
            <span className={styles.goldText}> Comercio Digital</span>
          </h1>
          <p className={styles.description}>
            D'XILVA conecta mercados locales e internacionales mediante nuestra plataforma
            moderna, segura y escalable diseñada para impulsar tu negocio.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/tienda" className={styles.primaryBtn}>
              <ShoppingBag size={20} />
              Explorar Tienda
            </Link>
            <Link href="/categorias" className={styles.secondaryBtn}>
              Ver Categorías
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        <div className={styles.heroImageWrapper}>
          <div className={styles.heroAbstractShape}></div>
        </div>
      </section>

      {/* Offers Section */}
      {offers.length > 0 && (
        <section className={styles.featured}>
          <h2>Ofertas Especiales</h2>
          <div className={styles.grid}>
            {offers.map((product) => (
              <div key={product.id} className={styles.card}>
                <div 
                  className={styles.cardImage} 
                  style={{ backgroundImage: `url(${product.thumbnail_url || '/placeholder.png'})` }}
                >
                  <div className={styles.discountBadge}>
                    <Percent size={14} />
                    {Math.round((1 - (Number(product.price) / Number(product.compare_price))) * 100)}% DCTO
                  </div>
                </div>
                <h3>{product.name}</h3>
                <p>{product.short_description}</p>
                <div className={styles.priceRow}>
                  <div className={styles.priceContainer}>
                    <span className={styles.oldPrice}>${Number(product.compare_price).toFixed(2)}</span>
                    <span className={styles.newPrice}>${Number(product.price).toFixed(2)}</span>
                  </div>
                  <Link href={`/tienda/${product.slug}`} className={styles.cartBtn}>Ver más</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured section for regular products if no offers available */}
      {offers.length === 0 && (
        <section className={styles.featured}>
          <h2>Descubre lo Nuevo</h2>
          <p style={{ textAlign: 'center', color: 'var(--dx-gray)' }}>Explora los productos más recientes de nuestro catálogo.</p>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/tienda" className={styles.primaryBtn} style={{ display: 'inline-flex' }}>
              Ir a la Tienda
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
