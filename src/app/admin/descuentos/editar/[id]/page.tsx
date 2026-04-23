import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import DiscountForm from "../../DiscountForm";
import styles from "../../form.module.css";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDiscountPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: discount } = await supabase
    .from("discount_codes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!discount) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>Código de descuento no encontrado</h1>
          <Link href="/admin/descuentos" className={styles.backLink}>
            <ArrowLeft size={20} />
            Volver a Descuentos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin/descuentos" className={styles.backLink}>
          <ArrowLeft size={20} />
          Volver a Descuentos
        </Link>
        <h1>Editar Código de Descuento</h1>
        <p className={styles.codeDisplay}>
          Código actual: <strong>{discount.code}</strong>
        </p>
      </header>

      <div className={styles.formWrapper}>
        <DiscountForm discount={discount} />
      </div>
    </div>
  );
}