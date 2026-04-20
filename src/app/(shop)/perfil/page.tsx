import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { signout } from "../login/actions";
import styles from "./page.module.css";
import { User, Mail, LogOut, Package } from "lucide-react";

export default async function PerfilPage() {
  const supabase = await createClient();

  // Validate the session server-side
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const user = data.user;
  const fullName = user.user_metadata?.full_name || "Cliente D'XILVA";
  const role = user.user_metadata?.role || "Cliente";

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.avatar}>
          {fullName.charAt(0).toUpperCase()}
        </div>
        <h2 className={styles.name}>{fullName}</h2>
        <p className={styles.role}>{role}</p>
        
        <nav className={styles.nav}>
          <a href="#" className={styles.activeLink}>
            <User size={18} /> Mi Cuenta
          </a>
          <a href="#">
            <Package size={18} /> Mis Pedidos
          </a>
        </nav>
        
        <form action={signout} className={styles.logoutForm}>
          <button type="submit" className={styles.logoutBtn}>
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </form>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Información Personal</h1>
        
        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <div className={styles.iconBox}>
              <User size={20} />
            </div>
            <div className={styles.details}>
              <span className={styles.label}>Nombre Completo</span>
              <span className={styles.value}>{fullName}</span>
            </div>
          </div>
          
          <div className={styles.divider} />
          
          <div className={styles.infoRow}>
            <div className={styles.iconBox}>
              <Mail size={20} />
            </div>
            <div className={styles.details}>
              <span className={styles.label}>Correo Electrónico</span>
              <span className={styles.value}>{user.email}</span>
            </div>
          </div>
          
        </div>
        <p className={styles.helpText}>
          Tus datos se encuentran encriptados de manera segura en nuestros servidores según los protocolos de Supabase Auth.
        </p>
      </div>
    </div>
  );
}
