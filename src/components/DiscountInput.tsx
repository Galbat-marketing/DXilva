"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Tag, X, Check } from "lucide-react";
import styles from "./DiscountInput.module.css";

export default function DiscountInput() {
  const { applyDiscount, removeDiscount, discount, total } = useCart();
  const [code, setCode] = useState(discount?.code.code || "");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const validateCode = async () => {
    if (!code.trim()) return;

    setIsValidating(true);
    setError("");

    try {
      const response = await fetch(`/api/discounts/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          cartTotal: total,
        }),
      });

      const data = await response.json();

      if (response.ok && data.discount) {
        applyDiscount({
          code: data.discount,
          discount_amount: data.discountAmount,
        });
        setError("");
      } else {
        setError(data.error || "Código inválido");
        removeDiscount();
      }
    } catch (err) {
      setError("Error al validar el código");
      removeDiscount();
    }

    setIsValidating(false);
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    setCode("");
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      validateCode();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <Tag size={18} className={styles.icon} />
          <input
            type="text"
            placeholder="Código de descuento"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            className={styles.input}
            disabled={!!discount}
          />
          {!discount ? (
            <button
              onClick={validateCode}
              disabled={isValidating || !code.trim()}
              className={styles.applyBtn}
            >
              {isValidating ? "Validando..." : "Aplicar"}
            </button>
          ) : (
            <button
              onClick={handleRemoveDiscount}
              className={styles.removeBtn}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {discount && (
        <div className={styles.success}>
          <Check size={16} />
          <span>
            Código <strong>{discount.code.code}</strong> aplicado: -${discount.discount_amount.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}