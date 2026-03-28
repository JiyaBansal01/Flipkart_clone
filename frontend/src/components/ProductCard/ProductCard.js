/**
 * components/ProductCard/ProductCard.js
 * =======================================
 * The individual product tile shown in grid listings.
 * Shows: image, name, rating, price, discount.
 * Clicking navigates to the product detail page.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addingToCart, setAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const inWishlist = isInWishlist(product.id);

  // Format price with Indian Rupee symbol and commas
  const formatPrice = (price) => {
    if (!price) return '₹0';
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  // Rating color: green for high, yellow for medium, red for low
  const getRatingColor = (rating) => {
    if (!rating) return '';
    if (rating >= 4) return 'high';
    if (rating >= 3) return 'medium';
    return 'low';
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();  // Prevent navigation to product page
    e.stopPropagation();
    setAddingToCart(true);
    const result = await addToCart(product.id, 1);
    setAddingToCart(false);
    if (result.success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
  };

  return (
    <>
      <Link to={`/product/${product.slug}`} className="product-card">
        
        {/* Wishlist Heart Button */}
        <button
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? '#ff6161' : 'none'} stroke={inWishlist ? '#ff6161' : '#878787'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Product Image */}
        <div className="product-image-container">
          <img
            src={product.primary_image || 'https://via.placeholder.com/200x200?text=No+Image'}
            alt={product.name}
            className="product-image"
            loading="lazy"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; }}
          />
          {product.discount_percent > 0 && (
            <span className="discount-badge">{product.discount_percent}% off</span>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          {/* Brand */}
          {product.brand && (
            <p className="product-brand">{product.brand}</p>
          )}

          {/* Rating */}
          {product.rating && product.rating > 0 && (
            <div className="product-rating">
              <span className={`rating-badge ${getRatingColor(product.rating)}`}>
                {Number(product.rating).toFixed(1)} ★
              </span>
              <span className="review-count">
                ({product.review_count?.toLocaleString('en-IN') || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="price-tag">
            <span className="price-final">
              {formatPrice(product.discounted_price || product.price)}
            </span>
            {product.discounted_price && product.price > product.discounted_price && (
              <>
                <span className="price-original">{formatPrice(product.price)}</span>
                <span className="price-discount">{product.discount_percent}% off</span>
              </>
            )}
          </div>

          {/* Stock warning */}
          {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
            <p className="stock-warning">Only {product.stock_quantity} left!</p>
          )}
          {product.stock_quantity === 0 && (
            <p className="out-of-stock">Out of Stock</p>
          )}
        </div>

        {/* Add to Cart button (appears on hover via CSS) */}
        {product.stock_quantity > 0 && (
          <button
            className={`card-add-cart-btn ${addingToCart ? 'loading' : ''}`}
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? 'Adding...' : '+ Add to Cart'}
          </button>
        )}
      </Link>

      {/* Toast notification */}
      {showToast && (
        <div className="toast">
          ✅ Added to cart!
        </div>
      )}
    </>
  );
}
