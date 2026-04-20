import Link from "next/link";
import styles from "./Footer.module.css";
import { StoreSettings } from "@/lib/store-settings";

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

interface Props {
  settings?: StoreSettings | null;
}

export default function Footer({ settings }: Props) {
  const storeName = settings?.store_name || "D'XILVA";
  const email = settings?.support_email || "contacto@dxilva.com";
  const phone = settings?.contact_phone || "+53 5555-5555";
  const description = settings?.meta_description || "Impulsando la transformación digital del comercio, conectando mercados locales e internacionales de manera eficiente y segura.";

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h2 className={styles.logoName}>{storeName}</h2>
          <p className={styles.slogan}>Agencia Comercial</p>
          <p className={styles.descripcion}>
            {description}
          </p>
        </div>

        <div className={styles.links}>
          <h3>Contacto</h3>
          <ul className={styles.contactList}>
            <li>
              <strong>Teléfono:</strong> <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
            </li>
            <li>
              <strong>Correo:</strong> <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              <strong>Ubicación:</strong> La Habana, Cuba
            </li>
          </ul>
        </div>

        <div className={styles.social}>
          <h3>Síguenos</h3>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook"><FacebookIcon /></a>
            <a href="#" aria-label="Instagram"><InstagramIcon /></a>
            <a href="#" aria-label="Twitter"><TwitterIcon /></a>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} {storeName} Agencia Comercial. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
