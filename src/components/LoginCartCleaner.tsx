"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { createBrowserClient } from "@/utils/supabase/client";

export default function LoginCartCleaner() {
  const { clearCart, items } = useCart();

  useEffect(() => {
    const checkAndClearCart = async () => {
      try {
        const supabase = createBrowserClient();
        if (!supabase) {
          console.error("No Supabase client available");
          return;
        }

        // Check if user is authenticated
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error checking session:", error);
          return;
        }

        const hasUser = !!session?.user;
        const hasCartItems = items.length > 0;

        console.log("LoginCartCleaner - Has user:", hasUser, "Has cart items:", hasCartItems);

        // If no user is authenticated but there are cart items, clear the cart
        if (!hasUser && hasCartItems) {
          console.log("LoginCartCleaner - No authenticated user but cart has items, clearing cart");
          clearCart();
        } else if (!hasUser && !hasCartItems) {
          console.log("LoginCartCleaner - No user, no cart items - nothing to do");
        } else if (hasUser) {
          console.log("LoginCartCleaner - User is authenticated, keeping cart");
        }
      } catch (error) {
        console.error("LoginCartCleaner - Unexpected error:", error);
      }
    };

    // Small delay to ensure the cart context is fully loaded
    const timer = setTimeout(checkAndClearCart, 100);

    return () => clearTimeout(timer);
  }, [clearCart, items.length]);

  // This component doesn't render anything
  return null;
}