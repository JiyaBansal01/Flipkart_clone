/**
 * App.js - Main Application with Routing
 * =========================================
 * This is the root of our React app.
 * It sets up:
 * 1. Context Providers (Cart, Wishlist global state)
 * 2. React Router (which page shows for which URL)
 * 3. The fixed Navbar that appears on all pages
 *
 * URL ROUTING MAP:
 *   /                        → Home page
 *   /products                → Product listing (search & filter)
 *   /product/:slug           → Single product detail
 *   /cart                    → Shopping cart
 *   /checkout                → Checkout page
 *   /order-confirmation/:id  → Order success page
 *   /orders                  → Order history
 *   /wishlist                → Saved items
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { CartProvider }     from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import Navbar from './components/Navbar/Navbar';

// Pages
import HomePage             from './pages/HomePage';
import ProductListPage      from './pages/ProductListPage';
import ProductDetailPage    from './pages/ProductDetailPage';
import CartPage             from './pages/CartPage';
import CheckoutPage         from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage     from './pages/OrderHistoryPage';
import WishlistPage         from './pages/WishlistPage';

// Global styles
import './styles/global.css';
import './styles/responsive.css';

function App() {
  return (
    /*
     * BrowserRouter: Enables URL-based navigation without page reloads
     * CartProvider:  Makes cart state available everywhere
     * WishlistProvider: Makes wishlist state available everywhere
     */
    <Router>
      <CartProvider>
        <WishlistProvider>
          {/* Navbar is always visible at the top */}
          <Navbar />

          {/* 
            page-content class adds top padding (80px) so content 
            doesn't hide behind the fixed navbar 
          */}
          <main className="page-content">
            <Routes>
              {/* Each Route maps a URL path to a component */}
              <Route path="/"                           element={<HomePage />} />
              <Route path="/products"                   element={<ProductListPage />} />
              <Route path="/product/:slug"              element={<ProductDetailPage />} />
              <Route path="/cart"                       element={<CartPage />} />
              <Route path="/checkout"                   element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/orders"                     element={<OrderHistoryPage />} />
              <Route path="/wishlist"                   element={<WishlistPage />} />

              {/* 404 fallback */}
              <Route path="*" element={
                <div className="empty-state container" style={{ marginTop: 60 }}>
                  <div className="icon">🔍</div>
                  <h3>Page Not Found</h3>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn btn-primary">Go Home</a>
                </div>
              } />
            </Routes>
          </main>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
