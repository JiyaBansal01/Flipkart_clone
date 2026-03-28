/**
 * pages/WishlistPage.js - Saved items wishlist
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  const load = async () => {
    try {
      const res = await wishlistAPI.getWishlist();
      setItems(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (productId) => {
    await toggleWishlist(productId);
    setItems(prev => prev.filter(i => i.product_id !== productId));
  };

  const handleMoveToCart = async (item) => {
    await addToCart(item.product_id, 1);
    await handleRemove(item.product_id);
  };

  const formatPrice = (p) => `₹${Number(p || 0).toLocaleString('en-IN')}`;

  if (loading) return <div className="loading-container" style={{marginTop:100}}><div className="spinner"/></div>;

  return (
    <div style={{ background: 'var(--fk-bg)', minHeight: '100vh', paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 16 }}>
        <h1 style={{ fontSize: 22, marginBottom: 16, background: 'white', padding: '16px 20px', borderRadius: 4 }}>
          My Wishlist ({items.length} items)
        </h1>

        {items.length === 0 ? (
          <div className="empty-state" style={{ background: 'white', borderRadius: 4, padding: 60 }}>
            <div className="icon">❤️</div>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love by clicking the heart icon on any product.</p>
            <Link to="/products" className="btn btn-primary">Discover Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1, background: '#e0e0e0', border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
            {items.map(item => (
              <div key={item.id} style={{ background: 'white', display: 'flex', flexDirection: 'column' }}>
                <Link to={`/product/${item.slug}`}>
                  <div style={{ aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: '#f5f5f5' }}>
                    <img src={item.product_image || 'https://via.placeholder.com/200'} alt={item.product_name}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={e => { e.target.src = 'https://via.placeholder.com/200'; }}
                    />
                  </div>
                  <div style={{ padding: '12px 12px 0' }}>
                    <p style={{ fontSize: 13, marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.product_name}</p>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 500 }}>{formatPrice(item.discounted_price || item.price)}</span>
                      {item.discounted_price && <span style={{ fontSize: 12, color: '#878787', textDecoration: 'line-through' }}>{formatPrice(item.price)}</span>}
                    </div>
                  </div>
                </Link>
                <div style={{ display: 'flex', gap: 0, borderTop: '1px solid #f0f0f0', marginTop: 'auto' }}>
                  <button onClick={() => handleMoveToCart(item)}
                    style={{ flex: 1, padding: '10px', background: 'none', border: 'none', color: 'var(--fk-blue)', fontSize: 12, fontWeight: 600, cursor: 'pointer', borderRight: '1px solid #f0f0f0' }}>
                    MOVE TO CART
                  </button>
                  <button onClick={() => handleRemove(item.product_id)}
                    style={{ flex: 1, padding: '10px', background: 'none', border: 'none', color: '#878787', fontSize: 12, cursor: 'pointer' }}>
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
