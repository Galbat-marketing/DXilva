"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, CartState, Product } from "../types";

interface CartContextProps extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const defaultState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
};

const CartContext = createContext<CartContextProps>({
  ...defaultState,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage initially
  useEffect(() => {
    const stored = localStorage.getItem("dxilva_cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse cart JSON", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("dxilva_cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.product_id === product.id);
      if (existing) {
        return currentItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...currentItems,
        {
          id: Math.random().toString(36).substring(7), // Temporal ID mock
          product_id: product.id,
          product,
          quantity,
        },
      ];
    });
    // FUTURE: Here we trigger a Supabase API call to sync the `carts` table!
  };

  const removeFromCart = (productId: string) => {
    setItems((current) => current.filter((item) => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((current) =>
      current.map((item) => (item.product_id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, total, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
