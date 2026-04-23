"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import DiscountInput from "@/components/DiscountInput";
import styles from "./page.module.css";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function CarritoClientPage() {
  const { items, total, discount, discountedTotal, removeFromCart, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <ShoppingBag size={64} className={styles.emptyIcon} />
        <h2>Tu carrito está vacío</h2>
        <p>Parece que aún no has agregado productos de D'XILVA a tu carrito.</p>
        <Link href="/tienda" className={styles.continueBtn}>
          Explorar Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tu Carrito</h1>

      <div className={styles.layout}>
        {/* Cart Items List */}
        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemImageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.product.thumbnail_url || "/placeholder.png"} alt={item.product.name} className={styles.itemImage} />
              </div>

              <div className={styles.itemDetails}>
                <Link href={`/tienda/${item.product.slug}`} className={styles.itemName}>
                  {item.product.name}
                </Link>
                <div className={styles.itemPrice}>${item.product.price.toFixed(2)}</div>

                <div className={styles.itemActions}>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock_quantity}
                    >
                      +
                    </button>
                  </div>
                  {item.product.stock_quantity <= 5 && (
                    <div className={styles.stockWarning}>
                      Solo {item.product.stock_quantity} en stock
                    </div>
                  )}

                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className={styles.removeBtn}
                    aria-label="Eliminar producto"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className={styles.itemTotal}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className={styles.summary}>
          <h2>Resumen de Orden</h2>

          <DiscountInput />

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {discount && (
            <div className={styles.summaryRow}>
              <span>Descuento ({discount.code.code})</span>
              <span className={styles.discountText}>-${discount.discount_amount.toFixed(2)}</span>
            </div>
          )}

          <div className={styles.summaryRow}>
            <span>Envío Estimado</span>
            <span>Por calcular</span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.summaryRowTotal}>
            <span>Total</span>
            <span className={styles.goldText}>${discountedTotal.toFixed(2)}</span>
          </div>

          <Link href="/checkout" className={styles.checkoutBtn}>
            Proceder al Pago
            <ArrowRight size={20} />
          </Link>

          <Link href="/tienda" className={styles.backLink}>
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}