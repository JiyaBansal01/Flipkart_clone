/**
 * pages/ProductDetailPage.js
 * ===========================
 * Full product detail view with:
 * - Image carousel (thumbnail + large view)
 * - Product info, specs
 * - Add to Cart / Buy Now buttons
 * - Delivery info section
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity]       = useState(1);
  const [activeTab, setActiveTab]     = useState('description');
  const [cartLoading, setCartLoading] = useState(false);
  const [toastMsg, setToastMsg]       = useState('');
  const [pincode, setPincode]         = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState('');

  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getProductBySlug(slug);
        setProduct(res.data);
      } catch (err) {
        console.error('Product not found:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAddToCart = async () => {
    setCartLoading(true);
    const result = await addToCart(product.id, quantity);
    setCartLoading(false);
    if (result.success) {
      showToast('✅ Added to cart successfully!');
    } else {
      showToast(`❌ ${result.message}`);
    }
  };

  const handleBuyNow = async () => {
    setCartLoading(true);
    const result = await addToCart(product.id, quantity);
    setCartLoading(false);
    if (result.success) {
      navigate('/cart');
    } else {
      showToast(`❌ ${result.message}`);
    }
  };

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryInfo(`✅ Delivery available to ${pincode} by ${getDeliveryDate()}`);
    } else {
      setDeliveryInfo('Please enter a valid 6-digit pincode');
    }
  };

  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

  if (loading) {
    return (
      <div className="loading-container" style={{ marginTop: 100 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state" style={{ marginTop: 100 }}>
        <div className="icon">😕</div>
        <h3>Product Not Found</h3>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage]?.image_url
    || 'https://via.placeholder.com/500x500?text=No+Image';

  return (
    <div className="pdp-page">
      <div className="pdp-container container">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">›</span>
          {product.category && (
            <>
              <Link to={`/products?category=${product.category.slug}`}>
                {product.category.name}
              </Link>
              <span className="separator">›</span>
            </>
          )}
          <span className="current">{product.name}</span>
        </div>

        <div className="pdp-main">
          {/* ── Left: Image Section ── */}
          <div className="image-section">
            {/* Thumbnail strip */}
            <div className="thumbnails">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  className={`thumb-btn ${i === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img.image_url} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="main-image-wrapper">
              <img
                src={currentImage}
                alt={product.name}
                className="main-image"
              />
              {product.discount_percent > 0 && (
                <span className="pdp-discount-badge">{product.discount_percent}% off</span>
              )}
              {/* Wishlist on detail page */}
              <button
                className={`pdp-wishlist-btn ${inWishlist ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24"
                  fill={inWishlist ? '#ff6161' : 'none'}
                  stroke={inWishlist ? '#ff6161' : '#666'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {inWishlist ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            {/* Action Buttons (sticky on scroll) */}
            <div className="pdp-actions">
              <button
                className="btn btn-secondary action-btn"
                onClick={handleAddToCart}
                disabled={cartLoading || product.stock_quantity === 0}
              >
                🛒 {product.stock_quantity === 0 ? 'Out of Stock' : 'ADD TO CART'}
              </button>
              <button
                className="btn btn-primary action-btn"
                onClick={handleBuyNow}
                disabled={cartLoading || product.stock_quantity === 0}
              >
                ⚡ BUY NOW
              </button>
            </div>
          </div>

          {/* ── Right: Product Info ── */}
          <div className="info-section">
            {product.brand && <p className="pdp-brand">{product.brand}</p>}
            <h1 className="pdp-title">{product.name}</h1>

            {/* Rating summary */}
            {product.rating > 0 && (
              <div className="pdp-rating-row">
                <span className="rating-badge high">
                  {Number(product.rating).toFixed(1)} ★
                </span>
                <span className="rating-text">
                  {product.review_count?.toLocaleString('en-IN')} Ratings &amp; Reviews
                </span>
              </div>
            )}

            <div className="divider" />

            {/* Price block */}
            <div className="pdp-price-block">
              <div className="pdp-final-price">
                {formatPrice(product.discounted_price || product.price)}
              </div>
              {product.discounted_price && product.price > product.discounted_price && (
                <div className="pdp-price-row">
                  <span className="pdp-mrp">MRP <s>{formatPrice(product.price)}</s></span>
                  <span className="pdp-saving">{product.discount_percent}% off</span>
                  <span className="pdp-saved-amount">
                    You save {formatPrice(product.price - product.discounted_price)}!
                  </span>
                </div>
              )}
              <p className="inclusive-tax">Inclusive of all taxes</p>
            </div>

            {/* Offers */}
            <div className="offers-section">
              <h3 className="offers-title">Available offers</h3>
              <ul className="offers-list">
                <li><span className="offer-tag">Bank Offer</span> 10% off on HDFC Credit Card, T&C Apply</li>
                <li><span className="offer-tag">Special Price</span> Get extra {product.discount_percent}% off (price inclusive of discount)</li>
                <li><span className="offer-tag">No Cost EMI</span> Avail No Cost EMI on select cards</li>
              </ul>
            </div>

            <div className="divider" />

            {/* Delivery check */}
            <div className="delivery-section">
              <h3 className="delivery-title">Delivery</h3>
              <div className="pincode-row">
                <input
                  type="text"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="pincode-input"
                  maxLength={6}
                />
                <button className="check-btn" onClick={checkDelivery}>Check</button>
              </div>
              {deliveryInfo && <p className="delivery-result">{deliveryInfo}</p>}
            </div>

            {/* Quantity */}
            <div className="quantity-section">
              <span className="qty-label">Quantity:</span>
              <div className="qty-controls">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >−</button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                  disabled={quantity >= product.stock_quantity}
                >+</button>
              </div>
              {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                <span className="stock-warning">Only {product.stock_quantity} left!</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs: Description / Specifications ── */}
        <div className="pdp-tabs-section">
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <p>{product.description || 'No description available.'}</p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="specs-content">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <table className="specs-table">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key}>
                          <td className="spec-key">{key}</td>
                          <td className="spec-val">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-specs">No specifications available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}
