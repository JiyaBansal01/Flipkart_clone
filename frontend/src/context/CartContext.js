/**
 * context/CartContext.js - Global Cart State
 * ===========================================
 * React Context allows us to share cart data across ALL components
 * without "prop drilling" (passing data through many parent-child levels).
 * 
 * HOW IT WORKS:
 *   1. CartProvider wraps the whole app
 *   2. Any component can call useCart() to get/update cart data
 *   3. When cart changes, ALL components using useCart() re-render automatically
 * 
 * Example usage in a component:
 *   const { cartCount, addToCart, removeFromCart } = useCart();
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../utils/api';

// Create the context (like a "global store")
const CartContext = createContext(null);

/**
 * CartProvider - Wraps the app and provides cart state to all children
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    total_items: 0,
    savings: 0
  });
  const [loading, setLoading] = useState(false);

  /** Fetch cart from backend */
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load cart when app starts
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /** Add product to cart */
  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await cartAPI.addToCart(productId, quantity);
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to add to cart'
      };
    } finally {
      setLoading(false);
    }
  };

  /** Update cart item quantity */
  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, quantity);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  /** Remove item from cart */
  const removeFromCart = async (itemId) => {
    try {
      const response = await cartAPI.removeFromCart(itemId);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  /** Clear entire cart */
  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart({ items: [], subtotal: 0, total_items: 0, savings: 0 });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  // The value object holds everything components can access
  const value = {
    cart,
    cartCount: cart.total_items,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart - Custom hook to easily access cart context
 * Usage: const { cart, addToCart } = useCart();
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
