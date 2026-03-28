/**
 * components/Navbar/Navbar.js - Fully Responsive Navbar
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './Navbar.css';

export default function Navbar() {
  const [searchQuery, setSearchQuery]       = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate  = useNavigate();
  const { cartCount }     = useCart();
  const { wishlistCount } = useWishlist();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          <span className="logo-text">Flipkart</span>
          <span className="logo-tagline"><em>Explore</em><span className="logo-plus">✦</span><em>Plus</em></span>
        </Link>

        <form className="search-bar" onSubmit={handleSearch}>
          <input type="text" placeholder="Search for products, brands and more" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
          <button type="submit" className="search-btn" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </form>

        <nav className="navbar-actions">
          <Link to="/login" className="nav-item"><span className="nav-item-label">Login</span></Link>
          <span className="nav-item hide-mobile"><span className="nav-item-label">Become a Seller</span></span>
          <Link to="/wishlist" className="nav-item nav-item-icon">
            <div className="icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </div>
            <span className="nav-item-label">Wishlist</span>
          </Link>
          <Link to="/cart" className="nav-item nav-item-icon">
            <div className="icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </div>
            <span className="nav-item-label">Cart</span>
          </Link>
        </nav>

        <div className="mobile-right">
          <Link to="/cart" className="mobile-cart-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
          <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      <CategoryStrip />

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/"         className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>🏠 Home</Link>
          <Link to="/products" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>🛍️ All Products</Link>
          <Link to="/cart"     className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>🛒 Cart {cartCount > 0 && `(${cartCount})`}</Link>
          <Link to="/wishlist" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>❤️ Wishlist</Link>
          <Link to="/orders"   className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>📦 My Orders</Link>
          <Link to="/login"    className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>👤 Login</Link>
          <div className="mobile-menu-divider" />
          <p className="mobile-menu-heading">Categories</p>
          {[
            {name:'Electronics',slug:'electronics',icon:'💻'},
            {name:'Fashion',slug:'fashion',icon:'👔'},
            {name:'Home & Kitchen',slug:'home-kitchen',icon:'🍳'},
            {name:'Books',slug:'books',icon:'📖'},
            {name:'Sports',slug:'sports-fitness',icon:'🏃'},
            {name:'Toys & Games',slug:'toys-games',icon:'🎯'},
            {name:'Beauty',slug:'beauty',icon:'💅'},
            {name:'Grocery',slug:'grocery',icon:'🥦'},
          ].map(cat => (
            <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

function CategoryStrip() {
  const categories = [
    {name:'Electronics',slug:'electronics',icon:'💻'},
    {name:'Fashion',slug:'fashion',icon:'👔'},
    {name:'Home & Kitchen',slug:'home-kitchen',icon:'🍳'},
    {name:'Books',slug:'books',icon:'📖'},
    {name:'Sports',slug:'sports-fitness',icon:'🏃'},
    {name:'Toys & Games',slug:'toys-games',icon:'🎯'},
    {name:'Beauty',slug:'beauty',icon:'💅'},
    {name:'Grocery',slug:'grocery',icon:'🥦'},
  ];
  return (
    <div className="category-strip">
      <div className="category-strip-inner">
        {categories.map(cat => (
          <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="category-strip-item">
            <span className="cat-emoji">{cat.icon}</span>
            <span className="cat-name">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
