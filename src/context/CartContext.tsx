"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, CartState, Product, AppliedDiscount, CartStateWithDiscount } from "../types";
import { createBrowserClient } from "@/utils/supabase/client";

interface CartContextProps extends CartStateWithDiscount {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (discount: AppliedDiscount | undefined) => void;
  removeDiscount: () => void;
}

const defaultState: CartStateWithDiscount = {
  items: [],
  itemCount: 0,
  total: 0,
  discountedTotal: 0,
};

const CartContext = createContext<CartContextProps>({
  ...defaultState,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  applyDiscount: () => {},
  removeDiscount: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | undefined>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [previousUserId, setPreviousUserId] = useState<string | null>(null);

  // Load from local storage initially
  useEffect(() => {
    const storedCart = localStorage.getItem("dxilva_cart");
    const storedDiscount = localStorage.getItem("dxilva_cart_discount");

    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart JSON", e);
      }
    }

    if (storedDiscount) {
      try {
        setAppliedDiscount(JSON.parse(storedDiscount));
      } catch (e) {
        console.error("Failed to parse discount JSON", e);
      }
    }

    setIsInitialized(true);
  }, []);

  // Check initial authentication state
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const supabase = createBrowserClient();
        if (!supabase) {
          console.error("Supabase client not available");
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id || null;
        setPreviousUserId(currentUserId);
      } catch (error) {
        console.error("Error checking auth state:", error);
      }
    };

    checkAuthState();
  }, []);

  // Monitor authentication changes and clear cart on logout or user switch
  useEffect(() => {
    const supabase = createBrowserClient();
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUserId = session?.user?.id || null;

      // Clear cart if user logged out or switched to different user
      if (previousUserId !== currentUserId && previousUserId && !currentUserId) {
        // Only clear on logout (not on login or user switch)
        setItems([]);
        setAppliedDiscount(undefined);
        localStorage.removeItem("dxilva_cart");
        localStorage.removeItem("dxilva_cart_discount");
      }

      setPreviousUserId(currentUserId);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [previousUserId]);

  // Sync to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("dxilva_cart", JSON.stringify(items));
      if (appliedDiscount) {
        localStorage.setItem("dxilva_cart_discount", JSON.stringify(appliedDiscount));
      } else {
        localStorage.removeItem("dxilva_cart_discount");
      }
    }
  }, [items, appliedDiscount, isInitialized]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.product_id === product.id);
      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, product.stock_quantity);
        return currentItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      const newQuantity = Math.min(quantity, product.stock_quantity);
      return [
        ...currentItems,
        {
          id: Math.random().toString(36).substring(7), // Temporal ID mock
          product_id: product.id,
          product,
          quantity: newQuantity,
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
      current.map((item) => {
        if (item.product_id === productId) {
          return { ...item, quantity: Math.min(quantity, item.product.stock_quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedDiscount(undefined);
    localStorage.removeItem("dxilva_cart");
    localStorage.removeItem("dxilva_cart_discount");
  };

  const applyDiscount = (discount: AppliedDiscount | undefined) => {
    setAppliedDiscount(discount);
  };

  const removeDiscount = () => {
    setAppliedDiscount(undefined);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountedTotal = appliedDiscount ? Math.max(0, total - appliedDiscount.discount_amount) : total;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        discount: appliedDiscount,
        discountedTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyDiscount,
        removeDiscount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
