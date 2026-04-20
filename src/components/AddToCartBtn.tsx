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

  const handleAdd = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (!showQuantity) {
    return (
      <button 
        className={`${styles.simpleBtn} ${isAdded ? styles.added : ""} ${className}`}
        onClick={handleAdd}
        disabled={isAdded}
      >
        <ShoppingCart size={18} />
        <span>{isAdded ? "¡Añadido!" : "Añadir"}</span>
      </button>
    );
  }

  return (
    <div className={styles.fullControl}>
      <div className={styles.quantityControl}>
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(q => q + 1)}>+</button>
      </div>
      
      <button 
        className={`${styles.bigBtn} ${isAdded ? styles.addedBig : ""} ${className}`}
        onClick={handleAdd}
        disabled={isAdded}
      >
        <ShoppingBag size={20} />
        {isAdded ? "¡Agregado al Carrito!" : "Añadir al Carrito"}
      </button>
    </div>
  );
}
