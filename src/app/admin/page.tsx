import { createClient } from "@/utils/supabase/server";
import styles from "./page.module.css";
import { 
  TrendingUp, 
  ShoppingBag, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight 
} from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch Summary Stats
  // 1. Total Revenue
  const { data: salesData } = await supabase.from("sales_analytics").select("total_revenue").limit(30);
  const totalRevenue = salesData?.reduce((acc, curr) => acc + (Number(curr.total_revenue) || 0), 0) || 0;

  // 2. Pending Orders
  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // 3. Low Stock Products
  const { count: lowStock } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .lt("stock_quantity", 5);

  // 4. Recent Orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <p>Resumen de rendimiento de D'XILVA</p>
      </header>

      {/* Quick Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.goldBg}`}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Ingresos Totales</span>
            <span className={styles.statValue}>${totalRevenue.toFixed(2)}</span>
            <span className={styles.statTrend}><ArrowUpRight size={14} /> +12%</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.blueBg}`}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Órdenes Pendientes</span>
            <span className={styles.statValue}>{pendingOrders || 0}</span>
            <span className={styles.statSub}>Pedidos por confirmar</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.redBg}`}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Stock Bajo</span>
            <span className={styles.statValue}>{lowStock || 0}</span>
            <span className={styles.statSub}>Productos críticos</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.greenBg}`}>
            <ShoppingBag size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Ventas del Mes</span>
            <span className={styles.statValue}>{salesData?.length || 0}</span>
            <span className={styles.statSub}>Órdenes completadas</span>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className={styles.mainGrid}>
        {/* Recent Orders Table */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Órdenes Recientes</h2>
            <Link href="/admin/ordenes" className={styles.viewAllLink}>Ver todas</Link>
          </div>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Órden</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.order_number.split("-").pop()}</td>
                      <td>{order.customer_name || "Anónimo"}</td>
                      <td>${Number(order.total).toFixed(2)}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className={styles.emptyCell}>No hay órdenes recientes</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

// Separate helper component for Link to work in RSC without import issues if needed
import Link from "next/link";
