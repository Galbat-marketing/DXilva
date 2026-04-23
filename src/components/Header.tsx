"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { Menu, Search, User, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header({ initialUser, initialRole }: { initialUser?: any, initialRole?: string | null }) {
  const { itemCount, clearCart } = useCart();
  const [user, setUser] = useState<any>(initialUser ?? null);
  const [role, setRole] = useState<string | null>(initialRole ?? null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    if (!supabase) return;

    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      setRole(data?.role || "customer");
    };

    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        fetchProfile(data.user.id);
      }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      const previousUser = user;

      setUser(currentUser);

      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setRole(null);
        // Clear cart when user logs out
        if (previousUser) {
          console.log("User logged out from Header, clearing cart");
          clearCart();
        }
      }

      // Sync server-side layout state when auth changes
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            {/* Logo para Modo Oscuro (Dorado/Blanco) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-dark.png" alt="D'XILVA Logo" className={`${styles.logoImage} ${styles.logoDark}`} />
            
            {/* Logo para Modo Claro (Negro/Color) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-light.png" alt="D'XILVA Logo" className={`${styles.logoImage} ${styles.logoLight}`} />
            
            <span className={styles.visuallyHidden}>D'XILVA</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          <Link href="/tienda" className={styles.navLink}>Tienda</Link>
          <Link href="/categorias" className={styles.navLink}>Categorías</Link>
          {user && role === "admin" && (
            <Link href="/admin" className={styles.navLink} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
              Administración
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <button className={styles.iconBtn} aria-label="Buscar">
            <Search size={20} />
          </button>
          <Link href={user ? "/perfil" : "/login"} className={styles.iconBtn} aria-label="Cuenta">
            <User size={20} />
          </Link>
          <Link href="/carrito" className={styles.iconBtn} aria-label="Carrito">
            <div style={{ position: "relative" }}>
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className={styles.badge}>{itemCount}</span>
              )}
            </div>
          </Link>
          <button className={styles.menuBtn} onClick={toggleMenu} aria-label="Menú">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileOverlay} ${isMenuOpen ? styles.showOverlay : ""}`} onClick={toggleMenu} />
      
      {/* Mobile Sidebar */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.menuOpen : ""}`}>
        <div className={styles.menuHeader}>
          <h2 className={styles.menuTitle}>Menú</h2>
          <button onClick={toggleMenu} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>
        
        <nav className={styles.mobileNav}>
          <Link href="/" className={styles.mobileNavLink} onClick={toggleMenu}>Inicio</Link>
          <Link href="/tienda" className={styles.mobileNavLink} onClick={toggleMenu}>Tienda</Link>
          <Link href="/categorias" className={styles.mobileNavLink} onClick={toggleMenu}>Categorías</Link>
          
          <div className={styles.menuDivider} />
          
          {user && role === "admin" && (
            <Link href="/admin" className={styles.mobileNavLink} style={{ color: 'var(--primary)' }} onClick={toggleMenu}>
              Administración
            </Link>
          )}
          
          {user ? (
            <Link href="/perfil" className={styles.mobileNavLink} onClick={toggleMenu}>Mi Perfil</Link>
          ) : (
            <Link href="/login" className={styles.mobileNavLink} onClick={toggleMenu}>Iniciar Sesión</Link>
          )}
          
          <Link href="/carrito" className={styles.mobileNavLink} onClick={toggleMenu}>
            Mi Carrito ({itemCount})
          </Link>
        </nav>
      </div>
    </header>
  );
}
