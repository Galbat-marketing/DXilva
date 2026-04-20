"use client";

import { useActionState } from "react";
import { updateSettings } from "./actions";
import styles from "./page.module.css";
import { Globe, Shield, Save, AlertCircle, CheckCircle2, RefreshCw, Trash2 } from "lucide-react";

interface SettingsFormProps {
  initialSettings: {
    store_name: string;
    support_email: string;
    contact_phone: string;
    meta_description: string;
    maintenance_mode: boolean;
  };
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(updateSettings, null);

  return (
    <form action={formAction} className={styles.settingsGrid}>
      {/* Notifications */}
      <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
        {state?.error && (
          <div style={{ 
            backgroundColor: "#fee2e2", 
            border: "1px solid #ef4444", 
            color: "#b91c1c", 
            padding: "1rem", 
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <AlertCircle size={20} />
            <span>Error: {state.error}</span>
          </div>
        )}
        {state?.success && (
          <div style={{ 
            backgroundColor: "#dcfce7", 
            border: "1px solid #22c55e", 
            color: "#15803d", 
            padding: "1rem", 
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <CheckCircle2 size={20} />
            <span>¡Configuración actualizada con éxito!</span>
          </div>
        )}
      </div>

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
            defaultValue={initialSettings.store_name} 
            disabled={isPending}
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
              defaultValue={initialSettings.support_email} 
              disabled={isPending}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contact_phone">Teléfono de Contacto</label>
            <input 
              type="text" 
              id="contact_phone"
              name="contact_phone"
              className={styles.input} 
              defaultValue={initialSettings.contact_phone} 
              disabled={isPending}
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
            defaultValue={initialSettings.meta_description} 
            disabled={isPending}
          />
        </div>
        
        <div className={styles.footer}>
          <button type="submit" className={styles.saveBtn} disabled={isPending}>
            {isPending ? <RefreshCw size={18} className={styles.spin} /> : <Save size={18} />}
            {isPending ? "Guardando..." : "Guardar Cambios"}
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
          <input type="text" className={styles.input} readOnly value="Configurada en .env" disabled />
        </div>

        <div className={styles.formGroup}>
          <label>Modo de Mantenimiento</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input 
              type="checkbox" 
              id="maintenance_mode" 
              name="maintenance_mode"
              defaultChecked={initialSettings.maintenance_mode}
              disabled={isPending}
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
          <button type="button" className={styles.dangerBtn} disabled={isPending}>Vaciar Caché del Sistema</button>
          <button type="button" className={styles.dangerBtn} style={{ backgroundColor: '#ef4444', color: 'white' }} disabled={isPending}>Reiniciar Base de Datos</button>
        </div>
      </section>
    </form>
  );
}
