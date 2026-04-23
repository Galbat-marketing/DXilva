"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createDiscount, updateDiscount } from "./actions";
import { DiscountCode } from "@/types";
import { createDiscountSchema, updateDiscountSchema } from "@/lib/validations";
import styles from "./form.module.css";

interface Props {
  discount?: DiscountCode;
}

export default function DiscountForm({ discount }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serverError = searchParams.get("error");
  const schema = discount ? updateDiscountSchema : createDiscountSchema;

  const [formData, setFormData] = useState({
    code: discount?.code || "",
    description: discount?.description || "",
    discount_type: discount?.discount_type || "percentage",
    discount_value: discount?.discount_value?.toString() || "",
    minimum_amount: discount?.minimum_amount?.toString() || "",
    usage_limit: discount?.usage_limit?.toString() || "",
    expires_at: discount?.expires_at ? new Date(discount.expires_at).toISOString().split('T')[0] : "",
    is_active: discount?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Prepare data for validation
    const dataToValidate = {
      ...formData,
      code: formData.code.toUpperCase(),
      discount_value: formData.discount_value ? parseFloat(formData.discount_value) : undefined,
      minimum_amount: formData.minimum_amount ? parseFloat(formData.minimum_amount) : undefined,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : undefined,
      expires_at: formData.expires_at || undefined,
    };

    // Validate with Zod
    const result = schema.safeParse(dataToValidate);
    if (!result.success) {
      const validationErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        validationErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(result.data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          data.append(key, value.toString());
        }
      });

      if (discount) {
        await updateDiscount(discount.id, data);
      } else {
        await createDiscount(data);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: checked !== undefined ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {(serverError || Object.keys(errors).length > 0) && (
        <div className={styles.alertError}>
          {serverError || "Por favor corrige los errores en el formulario"}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="code">Código *</label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
          placeholder="EJEMPLO10"
          className={`${styles.input} ${errors.code ? styles.inputError : ""}`}
        />
        <small>Los códigos se convierten automáticamente a mayúsculas</small>
        {errors.code && <span className={styles.errorText}>{errors.code}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Descripción *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Descripción del descuento"
          className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`}
          rows={3}
        />
        {errors.description && <span className={styles.errorText}>{errors.description}</span>}
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="discount_type">Tipo de Descuento *</label>
          <select
            id="discount_type"
            name="discount_type"
            value={formData.discount_type}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="percentage">Porcentaje (%)</option>
            <option value="fixed">Monto Fijo ($)</option>
          </select>
          {errors.discount_type && <span className={styles.errorText}>{errors.discount_type}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="discount_value">Valor del Descuento *</label>
          <input
            type="number"
            id="discount_value"
            name="discount_value"
            value={formData.discount_value}
            onChange={handleChange}
            required
            min="0"
            step={formData.discount_type === 'percentage' ? '1' : '0.01'}
            max={formData.discount_type === 'percentage' ? '100' : undefined}
            placeholder={formData.discount_type === 'percentage' ? '10' : '5.00'}
            className={`${styles.input} ${errors.discount_value ? styles.inputError : ""}`}
          />
          {errors.discount_value && <span className={styles.errorText}>{errors.discount_value}</span>}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="minimum_amount">Monto Mínimo</label>
          <input
            type="number"
            id="minimum_amount"
            name="minimum_amount"
            value={formData.minimum_amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            className={`${styles.input} ${errors.minimum_amount ? styles.inputError : ""}`}
          />
          <small>Opcional. Monto mínimo para aplicar el descuento</small>
          {errors.minimum_amount && <span className={styles.errorText}>{errors.minimum_amount}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="usage_limit">Límite de Uso</label>
          <input
            type="number"
            id="usage_limit"
            name="usage_limit"
            value={formData.usage_limit}
            onChange={handleChange}
            min="1"
            placeholder="100"
            className={`${styles.input} ${errors.usage_limit ? styles.inputError : ""}`}
          />
          <small>Opcional. Número máximo de veces que se puede usar</small>
          {errors.usage_limit && <span className={styles.errorText}>{errors.usage_limit}</span>}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="expires_at">Fecha de Expiración</label>
        <input
          type="date"
          id="expires_at"
          name="expires_at"
          value={formData.expires_at}
          onChange={handleChange}
          className={`${styles.input} ${errors.expires_at ? styles.inputError : ""}`}
        />
        <small>Opcional. Después de esta fecha, el código dejará de funcionar</small>
        {errors.expires_at && <span className={styles.errorText}>{errors.expires_at}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className={styles.checkbox}
          />
          Código activo
        </label>
        <small>Desmarca para desactivar temporalmente el código</small>
        {errors.is_active && <span className={styles.errorText}>{errors.is_active}</span>}
      </div>

      <div className={styles.formActions}>
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? "Guardando..." : (discount ? "Actualizar Código" : "Crear Código")}
        </button>
        <Link href="/admin/descuentos" className={styles.cancelBtn}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}