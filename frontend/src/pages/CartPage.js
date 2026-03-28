/**
 * pages/CartPage.js
 * ==================
 * Shopping cart with:
 * - Item list with quantity controls
 * - Remove items
 * - Price summary
 * - Proceed to checkout button
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const navigate = useNavigate();
  const { items, subtotal, savings } = cart;

  const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

  const shippingFee = Number(subtotal) >= 499 ? 0 : 40;
  const totalAmount = Number(subtotal) + shippingFee;

  if (loading && items.length === 0) {
    return (
      <div className="loading-container" style={{ marginTop: 100 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart container">
          <img
            src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png"
            alt="Empty Cart"
            className="empty-cart-img"
          />
          <h2>Your cart is empty!</h2>
          <p>Add items to it now.</p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container container">

        {/* ── Left: Cart Items ── */}
        <div className="cart-items-section">
          <div className="cart-header">
            <h2>My Cart <span className="cart-count">({items.length} items)</span></h2>
          </div>

          {items.map(item => (
            <div key={item.id} className="cart-item">
              {/* Product Image */}
              <div className="cart-item-image">
                <img
                  src={item.product_image || 'https://via.placeholder.com/100x100?text=Product'}
                  alt={item.product_name}
                  onError={e => { e.target.src = 'https://via.placeholder.com/100x100?text=Product'; }}
                />
              </div>

              {/* Product Details */}
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.product_name}</h3>
                {item.brand && <p className="cart-item-brand">{item.brand}</p>}

                {/* Stock warning */}
                {item.stock_quantity <= 5 && (
                  <p className="cart-stock-warn">
                    ⚠️ Only {item.stock_quantity} left in stock
                  </p>
                )}

                {/* Price */}
                <div className="cart-item-price">
                  {formatPrice(item.unit_price)}
                </div>

                {/* Quantity Controls */}
                <div className="cart-qty-row">
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateCartItem(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateCartItem(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock_quantity}
                    >+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Item Total */}
              <div className="cart-item-total">
                {formatPrice(item.total_price)}
              </div>
            </div>
          ))}

          {/* Place Order Bar */}
          <div className="cart-footer-bar">
            <span className="cart-footer-total">
              Total: <strong>{formatPrice(totalAmount)}</strong>
            </span>
            <button
              className="btn btn-primary place-order-btn"
              onClick={() => navigate('/checkout')}
            >
              PLACE ORDER
            </button>
          </div>
        </div>

        {/* ── Right: Price Summary ── */}
        <aside className="price-summary">
          <h3 className="summary-title">PRICE DETAILS</h3>
          <div className="divider" />

          <div className="summary-row">
            <span>Price ({items.length} item{items.length > 1 ? 's' : ''})</span>
            <span>{formatPrice(Number(subtotal) + Number(savings))}</span>
          </div>

          {Number(savings) > 0 && (
            <div className="summary-row discount-row">
              <span>Discount</span>
              <span className="save-amount">− {formatPrice(savings)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Delivery Charges</span>
            <span className={shippingFee === 0 ? 'free-delivery' : ''}>
              {shippingFee === 0 ? '🎉 FREE' : formatPrice(shippingFee)}
            </span>
          </div>

          <div className="divider" />

          <div className="summary-row total-row">
            <strong>Total Amount</strong>
            <strong>{formatPrice(totalAmount)}</strong>
          </div>

          <div className="divider" />

          {Number(savings) > 0 && (
            <p className="savings-msg">
              🎉 You will save {formatPrice(savings)} on this order
            </p>
          )}

          <button
            className="btn btn-primary summary-checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            PROCEED TO CHECKOUT
          </button>
        </aside>

      </div>
    </div>
  );
}
