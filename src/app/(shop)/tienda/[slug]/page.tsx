import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/supabase-data";
import AddToCartBtn from "@/components/AddToCartBtn";
import styles from "./page.module.css";
import { ArrowLeft, CheckCircle, ShieldCheck } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Link href="/tienda" className={styles.backLink}>
        <ArrowLeft size={18} /> Volver a la Tienda
      </Link>

      <div className={styles.productLayout}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            <Image
              src={product.thumbnail_url}
              alt={product.name}
              width={500}
              height={500}
              className={styles.mainImage}
            />
          </div>
        </div>

        {/* Details */}
        <div className={styles.details}>
          <div className={styles.stockBadge}>
            <CheckCircle size={16} /> En Stock
          </div>
          
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.priceRow}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {product.compare_price && (
              <span className={styles.oldPrice}>${product.compare_price.toFixed(2)}</span>
            )}
            <span className={styles.currency}>{product.currency}</span>
          </p>
          
          <div className={styles.divider} />
          
          <p className={styles.description}>
            {product.description}
          </p>

          <div className={styles.actionArea}>
            <AddToCartBtn product={product} showQuantity={true} />
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <ShieldCheck size={20} className={styles.featureIcon} />
              <span>Garantía de calidad D'XILVA</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={20} className={styles.featureIcon} />
              <span>Soporte al cliente 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
