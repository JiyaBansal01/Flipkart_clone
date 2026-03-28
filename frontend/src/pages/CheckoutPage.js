/**
 * pages/CheckoutPage.js
 * ======================
 * Checkout with shipping address form + order summary.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../utils/api';
import './CheckoutPage.css';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry'
];

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState({
    full_name: 'Rahul Sharma',
    phone: '9876543210',
    address_line1: '123, MG Road',
    address_line2: 'Near City Mall',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    address_type: 'HOME'
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const formatPrice = (p) => `₹${Number(p || 0).toLocaleString('en-IN')}`;
  const shippingFee = Number(cart.subtotal) >= 499 ? 0 : 40;
  const total = Number(cart.subtotal) + shippingFee;

  const handleChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const required = ['full_name', 'phone', 'address_line1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!address[field].trim()) {
        return `Please fill in ${field.replace('_', ' ')}`;
      }
    }
    if (address.phone.length < 10) return 'Please enter a valid 10-digit phone number';
    if (address.pincode.length !== 6) return 'Please enter a valid 6-digit pincode';
    return null;
  };

  const handlePlaceOrder = async () => {
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    if (cart.items.length === 0) { setError('Your cart is empty!'); return; }

    setPlacing(true);
    setError('');

    try {
      const orderData = {
        user_id: 1,
        shipping_address: address,
        payment_method: paymentMethod,
      };

      const response = await orderAPI.placeOrder(orderData);
      await refreshCart();
      navigate(`/order-confirmation/${response.data.id}`, {
        state: { order: response.data }
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-state container" style={{ marginTop: 40 }}>
          <div className="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container container">
        
        {/* ── Left: Address + Payment ── */}
        <div className="checkout-main">

          {/* Step 1: Delivery Address */}
          <div className="checkout-step">
            <div className="step-header">
              <span className="step-number">1</span>
              <h2>Delivery Address</h2>
            </div>

            <div className="address-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="full_name" value={address.full_name} onChange={handleChange} placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input name="phone" value={address.phone} onChange={handleChange} placeholder="10-digit number" maxLength={10} />
                </div>
              </div>

              <div className="form-group">
                <label>Address Line 1 * <span className="hint">(House No, Building, Street)</span></label>
                <input name="address_line1" value={address.address_line1} onChange={handleChange} placeholder="House no., building name, street" />
              </div>

              <div className="form-group">
                <label>Address Line 2 <span className="optional">(Optional)</span></label>
                <input name="address_line2" value={address.address_line2} onChange={handleChange} placeholder="Area, colony, landmark" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input name="city" value={address.city} onChange={handleChange} placeholder="City" />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input name="pincode" value={address.pincode} onChange={handleChange} placeholder="6-digit pincode" maxLength={6} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>State *</label>
                  <select name="state" value={address.state} onChange={handleChange}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Address Type</label>
                  <div className="radio-group">
                    {['HOME', 'WORK', 'OTHER'].map(type => (
                      <label key={type} className="radio-label">
                        <input
                          type="radio"
                          name="address_type"
                          value={type}
                          checked={address.address_type === type}
                          onChange={handleChange}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Payment */}
          <div className="checkout-step">
            <div className="step-header">
              <span className="step-number">2</span>
              <h2>Payment Option</h2>
            </div>

            <div className="payment-options">
              {[
                { value: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                { value: 'UPI', label: 'UPI Payment', icon: '📲', desc: 'PhonePe, GPay, Paytm' },
                { value: 'CARD', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                { value: 'NETBANKING', label: 'Net Banking', icon: '🏦', desc: 'All major banks supported' },
              ].map(opt => (
                <label key={opt.value} className={`payment-option ${paymentMethod === opt.value ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={paymentMethod === opt.value}
                    onChange={() => setPaymentMethod(opt.value)}
                  />
                  <span className="payment-icon">{opt.icon}</span>
                  <div>
                    <div className="payment-label">{opt.label}</div>
                    <div className="payment-desc">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="checkout-error">
              ⚠️ {error}
            </div>
          )}

          {/* Place Order Button */}
          <button
            className="btn btn-primary place-order-final"
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing ? '⏳ Placing Order...' : `Place Order — ${formatPrice(total)}`}
          </button>
        </div>

        {/* ── Right: Order Summary ── */}
        <aside className="checkout-summary">
          <h3 className="summary-title">ORDER SUMMARY</h3>
          <div className="divider" />

          {/* Items list */}
          <div className="summary-items">
            {cart.items.map(item => (
              <div key={item.id} className="summary-item">
                <img
                  src={item.product_image || 'https://via.placeholder.com/60'}
                  alt={item.product_name}
                  className="summary-item-img"
                  onError={e => { e.target.src = 'https://via.placeholder.com/60'; }}
                />
                <div className="summary-item-info">
                  <p className="summary-item-name">{item.product_name}</p>
                  <p className="summary-item-qty">Qty: {item.quantity}</p>
                  <p className="summary-item-price">
                    ₹{Number(item.total_price).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="divider" />

          {/* Totals */}
          <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
          {Number(cart.savings) > 0 && (
            <div className="summary-row"><span>Discount</span><span className="save-amount">−{formatPrice(cart.savings)}</span></div>
          )}
          <div className="summary-row">
            <span>Delivery</span>
            <span className={shippingFee === 0 ? 'free-delivery' : ''}>
              {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
            </span>
          </div>

          <div className="divider" />
          <div className="summary-row total-row">
            <strong>Total</strong>
            <strong>{formatPrice(total)}</strong>
          </div>

          {Number(cart.savings) > 0 && (
            <p className="savings-msg">🎉 You save {formatPrice(cart.savings)}!</p>
          )}
        </aside>
      </div>
    </div>
  );
}
