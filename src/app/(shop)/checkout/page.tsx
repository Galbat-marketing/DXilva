"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";
import { ArrowLeft, CreditCard, Wallet, Banknote, ShieldCheck, CheckCircle } from "@/components/Icons";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const paymentMethod = formData.get("payment") as string;

    const customerInfo = {
      email: formData.get("email") as string || "",
      phone: formData.get("phone") as string || "",
      firstName: formData.get("firstName") as string || "",
      lastName: formData.get("lastName") as string || "",
      address: formData.get("address") as string || "",
      city: formData.get("city") as string || "",
      province: formData.get("province") as string || "",
    };

    // ═══════════════════════════════════════════
    // QvaPay payment flow
    // ═══════════════════════════════════════════
    if (paymentMethod === "qvapay") {
      try {
        const res = await fetch("/api/checkout/qvapay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              name: i.product.name,
              price: i.product.price,
              quantity: i.quantity,
              product_id: i.product_id,
            })),
            total,
            customerInfo,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al crear la factura de pago");
        }

        // Clear the cart since the order has been created
        clearCart();

        // Redirect the user to QvaPay to complete payment
        window.location.href = data.paymentUrl;
        return;
      } catch (err: any) {
        console.error("QvaPay checkout error:", err);
        setError(err.message || "Error al procesar el pago con QvaPay");
        setIsSubmitting(false);
        return;
      }
    }

    // ═══════════════════════════════════════════
    // Other payment methods (simulated for now)
    // ═══════════════════════════════════════════
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className={styles.successContainer}>
        <CheckCircle size={80} className={styles.successIcon} />
        <h1 className={styles.successTitle}>¡Pedido Confirmado!</h1>
        <p className={styles.successDesc}>
          Gracias por confiar en D&apos;XILVA. Tu orden ha sido registrada exitosamente. 
          Pronto recibirás un correo con los detalles de envío y métodos de pago correspondientes.
        </p>
        <Link href="/tienda" className={styles.continueBtn}>
          Volver a la tienda
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2>Tu carrito está vacío</h2>
        <p>No tienes productos para procesar.</p>
        <Link href="/tienda" className={styles.backLink}>Ir a la tienda</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/carrito" className={styles.backLink}>
        <ArrowLeft size={18} /> Volver al Carrito
      </Link>
      
      <div className={styles.layout}>
        {/* Checkout Form */}
        <div className={styles.formSection}>
          <h1 className={styles.title}>Finalizar Compra</h1>
          
          {error && (
            <div style={{
              padding: "1rem 1.5rem",
              marginBottom: "1.5rem",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "var(--border-radius-sm)",
              color: "#ef4444",
              fontSize: "0.95rem",
            }}>
              ⚠️ {error}
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit} className={styles.form}>
            {/* Contact Info */}
            <section className={styles.formGroup}>
              <h2 className={styles.sectionTitle}>Información de Contacto</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" required placeholder="tu@correo.com" />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="phone">Teléfono</label>
                <input type="tel" id="phone" name="phone" required placeholder="+53 55555555" />
              </div>
            </section>

            <div className={styles.divider} />

            {/* Shipping Info */}
            <section className={styles.formGroup}>
              <h2 className={styles.sectionTitle}>Dirección de Envío</h2>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label htmlFor="firstName">Nombre</label>
                  <input type="text" id="firstName" name="firstName" required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="lastName">Apellidos</label>
                  <input type="text" id="lastName" name="lastName" required />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="address">Dirección</label>
                <input type="text" id="address" name="address" required placeholder="Calle, Número, Reparto..." />
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label htmlFor="city">Municipio / Ciudad</label>
                  <input type="text" id="city" name="city" required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="province">Provincia</label>
                  <select id="province" name="province" required>
                    <option value="">Selecciona...</option>
                    <option value="PR">Pinar del Río</option>
                    <option value="ART">Artemisa</option>
                    <option value="LH">La Habana</option>
                    <option value="MY">Mayabeque</option>
                    <option value="MTZ">Matanzas</option>
                    <option value="VC">Villa Clara</option>
                    <option value="SS">Sancti Spíritus</option>
                    <option value="CA">Ciego de Ávila</option>
                    <option value="CMG">Camagüey</option>
                    <option value="LT">Las Tunas</option>
                    <option value="HO">Holguín</option>
                    <option value="GR">Granma</option>
                    <option value="SC">Santiago de Cuba</option>
                    <option value="GT">Guantánamo</option>
                    <option value="IJ">Isla de la Juventud</option>
                  </select>
                </div>
              </div>
            </section>

            <div className={styles.divider} />

            {/* Payment Method */}
            <section className={styles.formGroup}>
              <h2 className={styles.sectionTitle}>Método de Pago</h2>
              <div className={styles.paymentMethods}>
                <label className={styles.paymentOption}>
                  <input type="radio" name="payment" value="qvapay" required defaultChecked />
                  <div className={styles.paymentCard}>
                    <CreditCard size={24} />
                    <span>QvaPay</span>
                  </div>
                </label>
                <label className={styles.paymentOption}>
                  <input type="radio" name="payment" value="transfermovil" required />
                  <div className={styles.paymentCard}>
                    <Wallet size={24} />
                    <span>Transfermóvil</span>
                  </div>
                </label>
                <label className={styles.paymentOption}>
                  <input type="radio" name="payment" value="enzona" required />
                  <div className={styles.paymentCard}>
                    <Wallet size={24} />
                    <span>EnZona</span>
                  </div>
                </label>
                <label className={styles.paymentOption}>
                  <input type="radio" name="payment" value="cash" required />
                  <div className={styles.paymentCard}>
                    <Banknote size={24} />
                    <span>Efectivo al recibir</span>
                  </div>
                </label>
              </div>
            </section>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Resumen de Orden</h2>
            
            <div className={styles.itemsList}>
              {items.map(item => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemImageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.product.thumbnail_url || "/placeholder.png"} alt={item.product.name} />
                    <span className={styles.itemBadge}>{item.quantity}</span>
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.product.name}</span>
                  </div>
                  <div className={styles.itemPrice}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.divider} />

            <div className={styles.totalsDetails}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Envío</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.grandTotal}>
              <span>Total a Pagar</span>
              <span className={styles.goldText}>${total.toFixed(2)}</span>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando de forma segura..." : "Realizar Pedido Seguro"}
            </button>
            
            <div className={styles.securityBadge}>
              <ShieldCheck size={18} />
              <span>Transacción cifrada y segura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
