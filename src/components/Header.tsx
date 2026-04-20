"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { Menu, Search, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/utils/supabase/client";
import ThemeToggle from "./ThemeToggle";

export default function Header({ initialUser, initialRole }: { initialUser?: any, initialRole?: string | null }) {
  const { itemCount } = useCart();
  const [user, setUser] = useState<any>(initialUser ?? null);
  const [role, setRole] = useState<string | null>(initialRole ?? null);

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            {/* The Logo image, we will assume it's saved as logo.png in public folder */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="D'XILVA Logo" className={styles.logoImage} />
            <span className={styles.visuallyHidden}>D'XILVA</span>
          </Link>
        </div>

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
          <button className={styles.menuBtn} aria-label="Menú">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
