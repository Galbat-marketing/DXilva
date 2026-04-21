"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import styles from "./layout.module.css";
import AdminSidebar from "./AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";

interface Props {
  children: React.ReactNode;
  pendingCount: number | null;
  signoutAction: any;
}

export default function AdminLayoutClient({ children, pendingCount, signoutAction }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.adminContainer}>
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        pendingCount={pendingCount} 
        signoutAction={signoutAction}
      />

      <main className={styles.content}>
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <button 
              className={styles.menuBtn} 
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>
            <div className={styles.breadcrumb}>
              <span>Panel Administrativo</span>
            </div>
          </div>
          
          <div className={styles.userSection}>
            <ThemeToggle />
            <div className={styles.userInfo}>
              <div className={styles.avatar}>A</div>
              <span className={styles.userName}>Administrador</span>
            </div>
          </div>
        </div>
        
        <div className={styles.innerContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
