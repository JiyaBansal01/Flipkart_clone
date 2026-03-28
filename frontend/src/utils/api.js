/**
 * utils/api.js - Centralized API Configuration
 * ==============================================
 * All API calls go through this file.
 * This means if the backend URL changes, we only update it here.
 * 
 * We use axios - a library that makes HTTP requests easier than fetch().
 */

import axios from 'axios';

// Base URL of our FastAPI backend
// Change this if your backend runs on a different port
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// -------------------------------------------------------
// PRODUCT API CALLS
// -------------------------------------------------------
export const productAPI = {
  /**
   * Get all products with optional filters
   * @param {Object} params - { search, category_id, min_price, max_price, page, per_page, sort_by }
   */
  getProducts: (params = {}) =>
    api.get('/products', { params }),

  /** Get product details by ID */
  getProductById: (id) =>
    api.get(`/products/${id}`),

  /** Get product details by slug (URL-friendly name) */
  getProductBySlug: (slug) =>
    api.get(`/products/slug/${slug}`),
};

// -------------------------------------------------------
// CATEGORY API CALLS
// -------------------------------------------------------
export const categoryAPI = {
  /** Get all categories */
  getCategories: () =>
    api.get('/categories'),
};

// -------------------------------------------------------
// CART API CALLS
// -------------------------------------------------------
export const cartAPI = {
  /** Get current cart contents */
  getCart: () =>
    api.get('/cart'),

  /** Add product to cart */
  addToCart: (productId, quantity = 1) =>
    api.post('/cart/add', { product_id: productId, quantity }),

  /** Update cart item quantity */
  updateCartItem: (itemId, quantity) =>
    api.put(`/cart/${itemId}`, { quantity }),

  /** Remove item from cart */
  removeFromCart: (itemId) =>
    api.delete(`/cart/${itemId}`),

  /** Remove all items from cart */
  clearCart: () =>
    api.delete('/cart/clear'),
};

// -------------------------------------------------------
// ORDER API CALLS
// -------------------------------------------------------
export const orderAPI = {
  /** Place a new order */
  placeOrder: (orderData) =>
    api.post('/orders/place', orderData),

  /** Get order history */
  getOrders: () =>
    api.get('/orders'),

  /** Get single order details */
  getOrderById: (id) =>
    api.get(`/orders/${id}`),
};

// -------------------------------------------------------
// WISHLIST API CALLS
// -------------------------------------------------------
export const wishlistAPI = {
  /** Get all wishlist items */
  getWishlist: () =>
    api.get('/wishlist'),

  /** Toggle item in/out of wishlist */
  toggleWishlist: (productId) =>
    api.post(`/wishlist/toggle/${productId}`),

  /** Check if product is in wishlist */
  checkWishlist: (productId) =>
    api.get(`/wishlist/check/${productId}`),
};

export default api;
