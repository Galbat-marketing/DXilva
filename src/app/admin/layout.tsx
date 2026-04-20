import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import styles from "./layout.module.css";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ListOrdered, 
  Tag, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { signout } from "@/app/(shop)/login/actions";
import ThemeToggle from "@/components/ThemeToggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Verify Authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  // 2. Verify Authorization (Role check)
  const { data: profile, error: dbError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (dbError || profile?.role !== "admin") {
    // If not admin, redirect to home. In a real app, maybe a 403 page.
    redirect("/?error=unauthorized");
  }

  // 3. Get pending orders count for the badge
  const { count: pendingCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.logoWrapper}>
          <Link href="/admin">
            <span className={styles.logoText}>DX <span className={styles.gold}>ADMIN</span></span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
            <ChevronRight size={14} className={styles.chevron} />
          </Link>
          <Link href="/admin/productos" className={styles.navLink}>
            <Package size={20} />
            <span>Productos</span>
            <ChevronRight size={14} className={styles.chevron} />
          </Link>
          <Link href="/admin/ordenes" className={styles.navLink}>
            <ListOrdered size={20} />
            <span>Órdenes</span>
            {pendingCount && pendingCount > 0 ? (
              <div className={styles.newBadge}>{pendingCount}</div>
            ) : null}
            <ChevronRight size={14} className={styles.chevron} />
          </Link>
          <Link href="/admin/categorias" className={styles.navLink}>
            <Tag size={20} />
            <span>Categorías</span>
            <ChevronRight size={14} className={styles.chevron} />
          </Link>
          <Link href="/admin/clientes" className={styles.navLink}>
            <Users size={20} />
            <span>Clientes</span>
            <ChevronRight size={14} className={styles.chevron} />
          </Link>
        </nav>

        <div className={styles.footer}>
          <Link href="/admin/configuracion" className={styles.navLink}>
            <Settings size={20} />
            <span>Ajustes</span>
          </Link>
          <form action={signout}>
            <button type="submit" className={styles.logoutBtn}>
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content area */}
      <main className={styles.content}>
        <div className={styles.topBar}>
          <div className={styles.breadcrumb}>
            <span>Panel Administrativo</span>
          </div>
          <div className={styles.userSection}>
            <ThemeToggle />
            <div className={styles.avatar}>A</div>
            <span>Administrador</span>
          </div>
        </div>
        
        <div className={styles.innerContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
