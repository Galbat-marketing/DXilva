import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import styles from "./page.module.css";
import { Search, Filter, Eye } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Gestión de Órdenes</h1>
          <p>Supervisa el procesamiento y envío de pedidos</p>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Buscar por número de orden o cliente..." className={styles.searchInput} />
        </div>
        <div className={styles.filters}>
          <select className={styles.select}>
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmados</option>
            <option value="processing">Procesando</option>
            <option value="shipped">Enviados</option>
            <option value="delivered">Entregados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Órden</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className={styles.orderNumber}>#{order.order_number.split("-").pop()}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.customerInfo}>
                      <span className={styles.customerName}>{order.customer_name || "Anónimo"}</span>
                      <span className={styles.customerEmail}>{order.customer_email || "Sin email"}</span>
                    </div>
                  </td>
                  <td className={styles.price}>${Number(order.total).toFixed(2)}</td>
                  <td>
                    <span className={`${styles.paymentStatus} ${styles[order.payment_status]}`}>
                      {order.payment_method?.toUpperCase()} - {order.payment_status}
                    </span>
                  </td>
                  <td>
                    <OrderStatusBadge orderId={order.id} initialStatus={order.status} />
                  </td>
                  <td className={styles.actions}>
                    <Link href={`/admin/ordenes/${order.id}`} className={styles.iconBtn} title="Ver detalles">
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.empty}>No se han registrado órdenes todavía.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
