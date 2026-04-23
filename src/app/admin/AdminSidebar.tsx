"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  Tag,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  X,
  Percent
} from "lucide-react";
import styles from "./layout.module.css";

interface Props {
  pendingCount: number | null;
  isOpen: boolean;
  onClose: () => void;
  signoutAction: any;
}

export default function AdminSidebar({ pendingCount, isOpen, onClose, signoutAction }: Props) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`} 
        onClick={onClose}
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.logoWrapper}>
          <Link href="/admin" onClick={onClose}>
            <span className={styles.logoText}>DX <span className={styles.gold}>ADMIN</span></span>
          </Link>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar menú">
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          <Link 
            href="/admin" 
            className={`${styles.navLink} ${isActive("/admin") ? styles.activeLink : ""}`}
            onClick={onClose}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
            <ChevronRight size={14} className={styles.chevron} />
          </Link>
          
          <Link 
            href="/admin/productos" 
            className={`${styles.navLink} ${isActive("/admin/productos") ? styles.activeLink : ""}`}
            onClick={onClose}
          >
            <Package size={20} />
            <span>Productos</span>
            <ChevronRight size={14} className={styles.chevron} />
          </Link>
          
          <Link 
            href="/admin/ordenes" 
            className={`${styles.navLink} ${isActive("/admin/ordenes") ? styles.activeLink : ""}`}
            onClick={onClose}
          >
            <ListOrdered size={20} />
            <span>Órdenes</span>
            {pendingCount && pendingCount > 0 ? (
              <div className={styles.newBadge}>{pendingCount}</div>
            ) : null}
            <ChevronRight size={14} className={styles.chevron} />
          </Link>
          
          <Link
            href="/admin/categorias"
            className={`${styles.navLink} ${isActive("/admin/categorias") ? styles.activeLink : ""}`}
            onClick={onClose}
          >
            <Tag size={20} />
            <span>Categorías</span>
            <ChevronRight size={14} className={styles.chevron} />
          </Link>

          <Link
            href="/admin/descuentos"
            className={`${styles.navLink} ${isActive("/admin/descuentos") ? styles.activeLink : ""}`}
            onClick={onClose}
          >
            <Percent size={20} />
            <span>Descuentos</span>
            <ChevronRight size={14} className={styles.chevron} />
          </Link>

          <Link
            href="/admin/clientes"
            className={`${styles.navLink} ${isActive("/admin/clientes") ? styles.activeLink : ""}`}
            onClick={onClose}
          >
            <Users size={20} />
            <span>Clientes</span>
            <ChevronRight size={14} className={styles.chevron} />
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link 
            href="/admin/configuracion" 
            className={`${styles.navLink} ${isActive("/admin/configuracion") ? styles.activeLink : ""}`}
            onClick={onClose}
          >
            <Settings size={20} />
            <span>Ajustes</span>
          </Link>
          <form action={signoutAction}>
            <button type="submit" className={styles.logoutBtn}>
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
