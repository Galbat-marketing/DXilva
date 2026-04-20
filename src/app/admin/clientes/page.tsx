import { createClient } from "@/utils/supabase/server";
import styles from "./page.module.css";
import { Users, Search, Mail, Calendar, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const supabase = await createClient();

  // Fetch all profiles
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching profiles:", error);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Gestión de Clientes</h1>
          <p>Visualiza y administra los usuarios registrados en el sistema</p>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            className={styles.searchInput} 
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email / Contacto</th>
              <th>Rol</th>
              <th>Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            {profiles && profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className={styles.clientCell}>
                    <div className={styles.avatar}>
                      {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className={styles.clientInfo}>
                      <span className={styles.clientName}>{profile.full_name || "Usuario sin nombre"}</span>
                      <span className={styles.clientId}>{profile.id.substring(0, 8)}...</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={14} color="var(--dx-gray)" />
                        {profile.email || "Sin correo"}
                      </span>
                      {profile.phone && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--dx-gray)' }}>
                           📞 {profile.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.roleBadge} ${styles[`role_${profile.role}`]}`}>
                      {profile.role === 'admin' ? 'Administrador' : 
                       profile.role === 'seller' ? 'Vendedor' : 'Cliente'}
                    </span>
                  </td>
                  <td className={styles.date}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} />
                      {new Date(profile.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={styles.empty}>No hay usuarios registrados todavía.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
