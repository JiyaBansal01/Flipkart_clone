/**
 * context/WishlistContext.js - Global Wishlist State
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../utils/api';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(new Set());

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.getWishlist();
      const ids = new Set(response.data.map(item => item.product_id));
      setWishlistIds(ids);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      const response = await wishlistAPI.toggleWishlist(productId);
      if (response.data.action === 'added') {
        setWishlistIds(prev => new Set([...prev, productId]));
      } else {
        setWishlistIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
      return response.data;
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const isInWishlist = (productId) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isInWishlist, wishlistCount: wishlistIds.size }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider');
  return context;
}
