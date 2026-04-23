"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { checkoutSchema } from "@/lib/validations";
import styles from "./page.module.css";
import { ArrowLeft, CreditCard, Wallet, Banknote, ShieldCheck, CheckCircle, ShoppingBag } from "@/components/Icons";

export default function CheckoutClientPage() {
  const { items, total, discount, discountedTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  console.log("Checkout page render - items:", items.length, "total:", total);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit triggered");

    // Check if cart is empty
    if (items.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const paymentMethod = formData.get("payment") as string;
    console.log("Form data payment method:", paymentMethod);

    // Check if payment method is selected
    if (!paymentMethod) {
      setError("Por favor selecciona un método de pago");
      setIsSubmitting(false);
      return;
    }

    const customerInfo = {
      email: formData.get("email") as string || "",
      phone: formData.get("phone") as string || "",
      firstName: formData.get("firstName") as string || "",
      lastName: formData.get("lastName") as string || "",
      address: formData.get("address") as string || "",
      city: formData.get("city") as string || "",
      province: formData.get("province") as string || "",
    };

    // Validate form data
    const validationData = {
      items: items.map((i) => ({
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        product_id: i.product_id,
      })),
      total: discountedTotal,
      discount: discount ? {
        code: discount.code.code,
        discount_amount: discount.discount_amount,
      } : null,
      customerInfo,
    };

    console.log("Validation data:", validationData);
    const validationResult = checkoutSchema.safeParse(validationData);
    console.log("Validation result:", validationResult);
    if (!validationResult.success) {
      console.log("Validation errors:", validationResult.error.issues);
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      });
      setValidationErrors(errors);
      console.log("Setting validation errors:", errors);
      setIsSubmitting(false);
      return;
    }

    // ═══════════════════════════════════════════
    // QvaPay payment flow
    // ═══════════════════════════════════════════
    console.log("Payment method:", paymentMethod);
    if (paymentMethod === "qvapay") {
      try {
        console.log("Sending request to /api/checkout/qvapay");
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
            total: discountedTotal,
            discount: discount ? {
              code: discount.code.code,
              discount_amount: discount.discount_amount,
            } : null,
            customerInfo,
          }),
        });

        console.log("API response status:", res.status);
        const data = await res.json();
        console.log("API response data:", data);

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
    } else {
      console.log("Unsupported payment method:", paymentMethod);
      setError("Método de pago no soportado");
      setIsSubmitting(false);
      return;
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <Link href="/carrito" className={styles.backLink}>
          <ArrowLeft size={18} /> Volver al Carrito
        </Link>

        <div className={styles.emptyState}>
          <ShoppingBag size={64} className={styles.emptyIcon} />
          <h2>Tu carrito está vacío</h2>
          <p>No hay productos para procesar el pago.</p>
          <Link href="/tienda" className={styles.continueBtn}>
            Explorar Productos
          </Link>
        </div>
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
          <form id="checkout-form" onSubmit={handleSubmit} className={styles.form}>
            {/* Customer Info */}
            <section className={styles.formGroup}>
              <h2 className={styles.sectionTitle}>Información de Contacto</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Correo Electrónico *</label>
                <input type="email" id="email" name="email" required placeholder="tu@email.com" />
                {validationErrors["customerInfo.email"] && (
                  <span className={styles.errorText}>{validationErrors["customerInfo.email"]}</span>
                )}
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="phone">Teléfono *</label>
                <input type="tel" id="phone" name="phone" required placeholder="+5355555555, 55555555 o +15555555555" />
                <small>Formatos aceptados: Cuba (+53), USA (+1), España (+34), Colombia (+57)</small>
                {validationErrors["customerInfo.phone"] && (
                  <span className={styles.errorText}>{validationErrors["customerInfo.phone"]}</span>
                )}
              </div>
            </section>

            <div className={styles.divider} />

            {/* Shipping Info */}
            <section className={styles.formGroup}>
              <h2 className={styles.sectionTitle}>Dirección de Envío</h2>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label htmlFor="firstName">Nombre *</label>
                  <input type="text" id="firstName" name="firstName" required />
                  {validationErrors["customerInfo.firstName"] && (
                    <span className={styles.errorText}>{validationErrors["customerInfo.firstName"]}</span>
                  )}
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="lastName">Apellidos *</label>
                  <input type="text" id="lastName" name="lastName" required />
                  {validationErrors["customerInfo.lastName"] && (
                    <span className={styles.errorText}>{validationErrors["customerInfo.lastName"]}</span>
                  )}
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="address">Dirección *</label>
                <input type="text" id="address" name="address" required placeholder="Calle, Número, Reparto..." />
                {validationErrors["customerInfo.address"] && (
                  <span className={styles.errorText}>{validationErrors["customerInfo.address"]}</span>
                )}
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label htmlFor="city">Municipio / Ciudad *</label>
                  <input type="text" id="city" name="city" required />
                  {validationErrors["customerInfo.city"] && (
                    <span className={styles.errorText}>{validationErrors["customerInfo.city"]}</span>
                  )}
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="province">Provincia *</label>
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
                  {validationErrors["customerInfo.province"] && (
                    <span className={styles.errorText}>{validationErrors["customerInfo.province"]}</span>
                  )}
                </div>
              </div>
            </section>

            <div className={styles.divider} />

            {/* Payment Method */}
            <section className={styles.formGroup}>
              <h2 className={styles.sectionTitle}>Método de Pago</h2>

              <div className={styles.paymentOptions}>
                <div className={styles.paymentOption}>
                  <input type="radio" name="payment" value="qvapay" required />
                  <div className={styles.paymentInfo}>
                    <div className={styles.paymentHeader}>
                      <Wallet size={24} />
                      <span>QvaPay</span>
                    </div>
                    <p>Pago seguro con criptomonedas y métodos tradicionales</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
            </button>

            {/* Error Display */}
            {error && (
              <div className={styles.errorAlert}>
                {error}
              </div>
            )}

            {/* Success State */}
            {isSuccess && (
              <div className={styles.successAlert}>
                <CheckCircle size={20} />
                <span>¡Pedido procesado exitosamente!</span>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className={styles.summary}>
          <h2>Resumen del Pedido</h2>

          <div className={styles.orderItems}>
            {items.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.product.name}</span>
                  <span className={styles.itemQty}>x{item.quantity}</span>
                </div>
                <span className={styles.itemPrice}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.divider}></div>

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
            <span>Envío</span>
            <span>Por calcular</span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.totalAmount}>${discountedTotal.toFixed(2)}</span>
          </div>

          <div className={styles.securityNote}>
            <ShieldCheck size={16} />
            <span>Pago procesado de forma segura</span>
          </div>
        </div>
      </div>
    </div>
  );
}