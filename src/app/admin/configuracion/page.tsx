import styles from "./page.module.css";
import { createClient } from "@/utils/supabase/server";
import SettingsForm from "./SettingsForm";

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

      <SettingsForm initialSettings={defaultSettings} />

      <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--dx-gray)', fontSize: '0.8rem' }}>
        <p>D'XILVA Admin v1.0.5 • © 2026 Todos los derechos reservados</p>
      </div>
    </div>
  );
}

