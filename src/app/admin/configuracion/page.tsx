import styles from "./page.module.css";
import { Settings, Shield, Globe, Bell, Save, Trash2, Database } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  // Fetch current settings (assuming only one row with ID 1)
  const { data: settings } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", "1")
    .single();

  const defaultSettings = {
    store_name: "D'XILVA Comercial",
    support_email: "soporte@dxilva.com",
    contact_phone: "+53 55555555",
    meta_description: "D'XILVA: Tu destino premium para joyería y moda exclusiva.",
    maintenance_mode: false,
    ...settings
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Configuración del Sistema</h1>
        <p>Gestiona los parámetros globales de la plataforma D'XILVA</p>
      </header>

      <form action={updateSettings} className={styles.settingsGrid}>
        {/* General Settings */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconBox}><Globe size={20} /></div>
            <h2>Información de la Plataforma</h2>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="store_name">Nombre de la Tienda</label>
            <input 
              type="text" 
              id="store_name"
              name="store_name"
              className={styles.input} 
              defaultValue={defaultSettings.store_name} 
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="support_email">Email de Soporte</label>
              <input 
                type="email" 
                id="support_email"
                name="support_email"
                className={styles.input} 
                defaultValue={defaultSettings.support_email} 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="contact_phone">Teléfono de Contacto</label>
              <input 
                type="text" 
                id="contact_phone"
                name="contact_phone"
                className={styles.input} 
                defaultValue={defaultSettings.contact_phone} 
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="meta_description">Descripción Meta (SEO)</label>
            <textarea 
              id="meta_description"
              name="meta_description"
              className={styles.textarea} 
              rows={3} 
              defaultValue={defaultSettings.meta_description} 
            />
          </div>
          
          <div className={styles.footer}>
            <button type="submit" className={styles.saveBtn}>
              <Save size={18} /> Guardar Cambios
            </button>
          </div>
        </section>

        {/* Security / System */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconBox}><Shield size={20} /></div>
            <h2>Seguridad y API</h2>
          </div>
          
          <div className={styles.formGroup}>
            <label>URL de Supabase (Lectura)</label>
            <input type="text" className={styles.input} readOnly value={process.env.NEXT_PUBLIC_SUPABASE_URL || "Configurada en .env"} />
          </div>

          <div className={styles.formGroup}>
            <label>Modo de Mantenimiento</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="checkbox" 
                id="maintenance_mode" 
                name="maintenance_mode"
                defaultChecked={defaultSettings.maintenance_mode}
              />
              <label htmlFor="maintenance_mode" style={{ fontWeight: 'normal', cursor: 'pointer' }}>Activar modo mantenimiento (bloquea la tienda al público)</label>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className={`${styles.card} ${styles.dangerZone}`}>
          <div className={styles.cardHeader}>
            <div className={styles.iconBox} style={{ color: '#ef4444' }}><Trash2 size={20} /></div>
            <h2 style={{ color: '#ef4444' }}>Zona de Peligro</h2>
          </div>
          
          <p style={{ color: 'var(--dx-gray)', fontSize: '0.9rem' }}>
            Las siguientes acciones son irreversibles y afectarán a todos los usuarios de la plataforma.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" className={styles.dangerBtn}>Vaciar Caché del Sistema</button>
            <button type="button" className={styles.dangerBtn} style={{ backgroundColor: '#ef4444', color: 'white' }}>Reiniciar Base de Datos</button>
          </div>
        </section>
      </form>

      <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--dx-gray)', fontSize: '0.8rem' }}>
        <p>D'XILVA Admin v1.0.5 • © 2026 Todos los derechos reservados</p>
      </div>
    </div>
  );
}

