"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "../page.module.css";
import { CheckCircle, ShoppingBag, Clock } from "@/components/Icons";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const status = searchParams.get("status"); // "paid" or "pending"

  const isPending = status === "pending";

  return (
    <div className={styles.successContainer}>
      {isPending ? (
        <Clock size={80} className={styles.successIcon} style={{ color: "var(--primary)" }} />
      ) : (
        <CheckCircle size={80} className={styles.successIcon} />
      )}

      <h1 className={styles.successTitle}>
        {isPending ? "¡Pago en Proceso!" : "¡Pedido Confirmado!"}
      </h1>

      <p className={styles.successDesc}>
        {isPending ? (
          <>
            Tu orden <strong>{orderNumber || ""}</strong> ha sido registrada.
            Hemos creado la factura en QvaPay. Una vez confirmado el pago,
            actualizaremos el estado automáticamente.
          </>
        ) : (
          <>
            ¡Gracias por confiar en D&apos;XILVA! Tu orden{" "}
            <strong>{orderNumber || ""}</strong> ha sido pagada exitosamente.
            Pronto recibirás un correo con los detalles de envío.
          </>
        )}
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/tienda" className={styles.continueBtn}>
          <ShoppingBag size={18} />
          Seguir Comprando
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.successContainer}>
          <p>Cargando...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
