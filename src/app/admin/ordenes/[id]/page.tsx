import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Package, User, CreditCard, MapPin } from "lucide-react";
import styles from "./page.module.css";
import OrderStatusBadge from "../OrderStatusBadge";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;

  // Fetch the order and its items
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", resolvedParams.id)
    .maybeSingle();

  if (!order) {
    return notFound();
  }

  // Parse shipping address if it exists
  let address = null;
  if (order.shipping_address && typeof order.shipping_address === "string") {
    try {
      address = JSON.parse(order.shipping_address);
    } catch {
      address = { address: order.shipping_address };
    }
  } else if (order.shipping_address) {
    address = order.shipping_address;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin/ordenes" className={styles.backLink}>
          <ArrowLeft size={18} /> Volver a Órdenes
        </Link>
        <div className={styles.titleRow}>
          <h1>Petición / Orden #{order.order_number}</h1>
          <OrderStatusBadge orderId={order.id} initialStatus={order.status} />
        </div>
        <p className={styles.date}>
          Generada el {new Date(order.created_at).toLocaleString()}
        </p>
      </header>

      <div className={styles.grid}>
        {/* Customer Details */}
        <div className={styles.card}>
          <h2><User size={18} /> Información del Cliente</h2>
          <div className={styles.cardBody}>
            <p><strong>Nombre:</strong> {order.customer_name || "Anónimo"}</p>
            <p><strong>Email:</strong> {order.customer_email || "N/A"}</p>
            <p><strong>Teléfono:</strong> {order.customer_phone || "N/A"}</p>
          </div>
        </div>

        {/* Payment Details */}
        <div className={styles.card}>
          <h2><CreditCard size={18} /> Detalles de Pago</h2>
          <div className={styles.cardBody}>
            <p><strong>Método:</strong> {order.payment_method?.toUpperCase()}</p>
            <p>
              <strong>Estado:</strong>{" "}
              <span className={`${styles.badge} ${styles[order.payment_status]}`}>
                {order.payment_status}
              </span>
            </p>
            {order.qvapay_invoice_id && (
              <p><strong>Ref QvaPay:</strong> {order.qvapay_invoice_id}</p>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className={styles.card}>
          <h2><MapPin size={18} /> Dirección de Envío</h2>
          <div className={styles.cardBody}>
            {address ? (
              <>
                <p>{address.address}</p>
                <p>{address.city}, {address.province}</p>
              </>
            ) : (
              <p>No se especificó dirección estructurada.</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className={styles.itemsCard}>
        <h2><Package size={18} /> Productos de la Orden</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio Unid.</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items?.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>${Number(item.price).toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${Number(item.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className={styles.rightAlign}><strong>Total Pagado:</strong></td>
                <td><strong className={styles.goldText}>${Number(order.total).toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
