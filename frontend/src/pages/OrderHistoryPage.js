/**
 * pages/OrderHistoryPage.js - View all past orders
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOrders()
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (p) => `₹${Number(p || 0).toLocaleString('en-IN')}`;

  const statusColors = {
    PENDING: '#ff9f00', CONFIRMED: '#2874f0',
    SHIPPED: '#9c27b0', DELIVERED: '#388e3c', CANCELLED: '#f44336'
  };

  if (loading) return <div className="loading-container" style={{marginTop:100}}><div className="spinner"/></div>;

  return (
    <div style={{ background: 'var(--fk-bg)', minHeight: '100vh', paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 16 }}>
        <h1 style={{ fontSize: 22, marginBottom: 16, background: 'white', padding: '16px 20px', borderRadius: 4 }}>
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="empty-state" style={{ background: 'white', borderRadius: 4, padding: 60 }}>
            <div className="icon">📦</div>
            <h3>No orders yet</h3>
            <p>When you place orders, they'll appear here.</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: 'white', borderRadius: 4, overflow: 'hidden' }}>
                {/* Order header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                  <div>
                    <span style={{ fontSize: 13, color: '#878787' }}>ORDER PLACED </span>
                    <span style={{ fontSize: 13 }}>{new Date(order.placed_at).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, color: '#878787' }}>ORDER # {order.order_number}</div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>{formatPrice(order.total_amount)}</div>
                  </div>
                </div>

                {/* Order items */}
                {order.order_items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 16, padding: '16px 20px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                    <img src={item.product_image || 'https://via.placeholder.com/80'} alt={item.product_name}
                      style={{ width: 80, height: 80, objectFit: 'contain', border: '1px solid #e0e0e0', borderRadius: 4, padding: 4 }}
                      onError={e => { e.target.src = 'https://via.placeholder.com/80'; }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 400, marginBottom: 4 }}>{item.product_name}</p>
                      <p style={{ fontSize: 13, color: '#878787' }}>Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, padding: '4px 10px', borderRadius: 3, background: statusColors[order.status] + '20', color: statusColors[order.status] }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}

                <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to={`/order-confirmation/${order.id}`} style={{ color: 'var(--fk-blue)', fontSize: 13, fontWeight: 500 }}>
                    View Order Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
