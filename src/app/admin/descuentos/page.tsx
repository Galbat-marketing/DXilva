import Link from "next/link";
import styles from "./page.module.css";
import { Plus, Tag, Edit, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import DeleteDiscountBtn from "./DeleteDiscountBtn";

export default async function AdminDiscountsPage() {
  const supabase = await createClient();

  const { data: discounts, error } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Gestión de Códigos de Descuento</h1>
          <p>Crea y administra códigos promocionales para tus clientes</p>
        </div>
        <Link href="/admin/descuentos/nuevo" className={styles.addBtn}>
          <Plus size={20} />
          Nuevo Código
        </Link>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Mínimo</th>
              <th>Límite de Uso</th>
              <th>Usos</th>
              <th>Estado</th>
              <th>Expira</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {discounts && discounts.length > 0 ? (
              discounts.map((discount) => (
                <tr key={discount.id}>
                  <td className={styles.codeCell}>
                    <Tag size={16} />
                    <span className={styles.code}>{discount.code}</span>
                  </td>
                  <td>{discount.description}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[discount.discount_type]}`}>
                      {discount.discount_type === 'percentage' ? 'Porcentaje' : 'Fijo'}
                    </span>
                  </td>
                  <td>
                    {discount.discount_type === 'percentage'
                      ? `${discount.discount_value}%`
                      : `$${discount.discount_value.toFixed(2)}`
                    }
                  </td>
                  <td>
                    {discount.minimum_amount
                      ? `$${discount.minimum_amount.toFixed(2)}`
                      : 'Sin mínimo'
                    }
                  </td>
                  <td>
                    {discount.usage_limit || 'Ilimitado'}
                  </td>
                  <td>{discount.usage_count}</td>
                  <td>
                    <span className={`${styles.statusDot} ${discount.is_active ? styles.active : styles.inactive}`}></span>
                    {discount.is_active ? "Activo" : "Inactivo"}
                  </td>
                  <td>
                    {discount.expires_at
                      ? new Date(discount.expires_at).toLocaleDateString('es-ES')
                      : 'Sin expiración'
                    }
                  </td>
                  <td className={styles.actions}>
                    <Link href={`/admin/descuentos/editar/${discount.id}`} className={styles.iconBtn} title="Editar">
                      <Edit size={18} />
                    </Link>
                    <DeleteDiscountBtn discountId={discount.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className={styles.empty}>
                  No se encontraron códigos de descuento. Crea el primero para comenzar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}