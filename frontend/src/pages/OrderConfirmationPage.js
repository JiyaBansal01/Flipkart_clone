/**
 * pages/OrderConfirmationPage.js
 * ================================
 * Success page shown after order is placed.
 * Displays order number, items, delivery info.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      orderAPI.getOrderById(orderId)
        .then(res => setOrder(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orderId, order]);

  const formatPrice = (p) => `₹${Number(p || 0).toLocaleString('en-IN')}`;

  const getEstimatedDelivery = () => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ marginTop: 100 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="empty-state" style={{ marginTop: 100 }}>
        <div className="icon">❌</div>
        <h3>Order not found</h3>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const addr = order.shipping_address_snapshot;

  return (
    <div className="confirmation-page">
      <div className="confirmation-container container">

        {/* ── Success Banner ── */}
        <div className="success-banner">
          <div className="success-icon">✅</div>
          <div className="success-text">
            <h1>Order Placed Successfully!</h1>
            <p>
              Your order <strong>#{order.order_number}</strong> has been placed.
              You'll receive a confirmation soon.
            </p>
          </div>
        </div>

        <div className="confirmation-body">
          
          {/* ── Left: Order Details ── */}
          <div className="confirmation-main">

            {/* Order Items */}
            <div className="conf-card">
              <h3 className="conf-card-title">Items Ordered</h3>
              <div className="conf-items">
                {order.order_items?.map(item => (
                  <div key={item.id} className="conf-item">
                    <img
                      src={item.product_image || 'https://via.placeholder.com/80'}
                      alt={item.product_name}
                      className="conf-item-img"
                      onError={e => { e.target.src = 'https://via.placeholder.com/80'; }}
                    />
                    <div className="conf-item-info">
                      <p className="conf-item-name">{item.product_name}</p>
                      <p className="conf-item-meta">Qty: {item.quantity}</p>
                      <p className="conf-item-price">{formatPrice(item.total_price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="conf-card">
              <h3 className="conf-card-title">Delivery Address</h3>
              <div className="conf-address">
                <p className="addr-name">{addr.full_name}</p>
                <p>{addr.address_line1}</p>
                {addr.address_line2 && <p>{addr.address_line2}</p>}
                <p>{addr.city}, {addr.state} – {addr.pincode}</p>
                <p>📞 {addr.phone}</p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="conf-card delivery-info-card">
              <span className="delivery-status-badge">Confirmed</span>
              <div>
                <p className="delivery-eta-label">Expected Delivery</p>
                <p className="delivery-eta">{getEstimatedDelivery()}</p>
              </div>
              <span className="delivery-emoji">🚚</span>
            </div>
          </div>

          {/* ── Right: Price Summary ── */}
          <aside className="conf-summary">
            <div className="conf-card">
              <h3 className="conf-card-title">Order Summary</h3>

              <div className="conf-order-meta">
                <div className="meta-row">
                  <span>Order ID</span>
                  <strong>{order.order_number}</strong>
                </div>
                <div className="meta-row">
                  <span>Payment</span>
                  <strong>{order.payment_method}</strong>
                </div>
                <div className="meta-row">
                  <span>Status</span>
                  <span className="status-badge">{order.status}</span>
                </div>
              </div>

              <div className="divider" />

              <div className="summary-row"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="summary-row"><span>Shipping</span>
                <span className={order.shipping_fee == 0 ? 'free-delivery' : ''}>
                  {order.shipping_fee == 0 ? 'FREE' : formatPrice(order.shipping_fee)}
                </span>
              </div>
              
              <div className="divider" />
              <div className="summary-row total-row">
                <strong>Total Paid</strong>
                <strong>{formatPrice(order.total_amount)}</strong>
              </div>
            </div>

            {/* Action buttons */}
            <div className="conf-actions">
              <Link to="/orders" className="btn btn-outline conf-btn">
                View All Orders
              </Link>
              <Link to="/products" className="btn btn-primary conf-btn">
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
