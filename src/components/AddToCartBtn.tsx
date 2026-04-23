"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import styles from "./AddToCartBtn.module.css";

interface Props {
  product: Product;
  showQuantity?: boolean;
  className?: string;
}

export default function AddToCartBtn({ product, showQuantity = false, className = "" }: Props) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const maxQuantity = product.stock_quantity;
  const isOutOfStock = maxQuantity <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (!showQuantity) {
    return (
      <button
        className={`${styles.simpleBtn} ${isAdded ? styles.added : ""} ${className}`}
        onClick={handleAdd}
        disabled={isAdded || isOutOfStock}
      >
        <ShoppingCart size={18} />
        <span>{isOutOfStock ? "Sin Stock" : isAdded ? "¡Añadido!" : "Añadir"}</span>
      </button>
    );
  }

  return (
    <div className={styles.fullControl}>
      <div className={styles.quantityControl}>
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={isOutOfStock}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(q => q + 1)} disabled={quantity >= maxQuantity}>+</button>
      </div>

      <button
        className={`${styles.bigBtn} ${isAdded ? styles.addedBig : ""} ${className}`}
        onClick={handleAdd}
        disabled={isAdded || isOutOfStock}
      >
        <ShoppingBag size={20} />
        {isOutOfStock ? "Sin Stock" : isAdded ? "¡Agregado al Carrito!" : "Añadir al Carrito"}
      </button>
    </div>
  );
}
