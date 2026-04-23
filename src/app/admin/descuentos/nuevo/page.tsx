import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DiscountForm from "../DiscountForm";
import styles from "../form.module.css";

export default function NewDiscountPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin/descuentos" className={styles.backLink}>
          <ArrowLeft size={20} />
          Volver a Descuentos
        </Link>
        <h1>Crear Nuevo Código de Descuento</h1>
      </header>

      <div className={styles.formWrapper}>
        <DiscountForm />
      </div>
    </div>
  );
}