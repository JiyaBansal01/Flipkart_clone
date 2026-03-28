/**
 * pages/HomePage.js
 * ==================
 * The main landing page with:
 * - Hero banner carousel
 * - Category shortcuts
 * - Featured products grid
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import { productAPI, categoryAPI } from '../utils/api';
import './HomePage.css';

// Hero banner slides
const BANNERS = [
  {
    id: 1,
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    title: 'Big Billion Days',
    subtitle: 'Up to 80% off on Electronics',
    cta: 'Shop Now',
    link: '/products?category=electronics',
    emoji: '⚡',
    tag: 'SALE'
  },
  {
    id: 2,
    bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    title: 'Fashion Week',
    subtitle: 'Trendy styles from top brands',
    cta: 'Explore Fashion',
    link: '/products?category=fashion',
    emoji: '👗',
    tag: 'NEW'
  },
  {
    id: 3,
    bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    title: 'Home Makeover',
    subtitle: 'Transform your living space',
    cta: 'Shop Home',
    link: '/products?category=home-kitchen',
    emoji: '🏠',
    tag: 'HOT'
  },
];
function getCategoryIcon(slug) {
  const icons = {
    'electronics':    '💻',
    'fashion':        '👔',
    'home-kitchen':   '🍳',
    'books':          '📖',
    'sports-fitness': '🏃',
    'toys-games':     '🎯',
    'beauty':         '💅',
    'grocery':        '🥦',
  };
  return icons[slug] || '🛍️';
}
export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const navigate = useNavigate();

  // Auto-cycle banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Load products and categories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getProducts({ per_page: 20, sort_by: 'rating', sort_order: 'desc' }),
          categoryAPI.getCategories()
        ]);
        setProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="homepage">

      {/* ── Hero Banner ── */}
      <section className="hero-banner">
        <div
          className="banner-slide"
          style={{ background: BANNERS[activeBanner].bg }}
        >
          <div className="banner-content">
            <span className="banner-tag">{BANNERS[activeBanner].tag}</span>
            <div className="banner-emoji">{BANNERS[activeBanner].emoji}</div>
            <h1 className="banner-title">{BANNERS[activeBanner].title}</h1>
            <p className="banner-subtitle">{BANNERS[activeBanner].subtitle}</p>
            <Link to={BANNERS[activeBanner].link} className="banner-cta">
              {BANNERS[activeBanner].cta} →
            </Link>
          </div>
        </div>

        {/* Banner dots */}
        <div className="banner-dots">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === activeBanner ? 'active' : ''}`}
              onClick={() => setActiveBanner(i)}
            />
          ))}
        </div>
      </section>

      {/* ── Category Quick Links ── */}
      <section className="category-section container">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/products" className="see-all-link">See All →</Link>
        </div>
        <div className="category-grid">
          {(categories.length ? categories : PLACEHOLDER_CATEGORIES).map(cat => (
          <Link
            key={cat.id || cat.slug}
            to={`/products?category=${cat.slug}`}
            className="category-card"
          >
            <span className="cat-icon">{getCategoryIcon(cat.slug)}</span>
            <span className="cat-label">{cat.name}</span>
          </Link>
        ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="products-section container">
        <div className="section-header">
          <h2>✨ Top Picks For You</h2>
          <Link to="/products" className="see-all-link">View All →</Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>No products yet</h3>
            <p>Make sure the backend is running and the database is seeded.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Promo Banners ── */}
      <section className="promo-section container">
        <div className="promo-grid">
          <div className="promo-card promo-blue" onClick={() => navigate('/products?category=electronics')}>
            <div>
              <h3>Electronics Sale</h3>
              <p>Upto 60% Off</p>
            </div>
            <span className="promo-emoji">📱</span>
          </div>
          <div className="promo-card promo-orange" onClick={() => navigate('/products?category=fashion')}>
            <div>
              <h3>Fashion Fiesta</h3>
              <p>Trending Styles</p>
            </div>
            <span className="promo-emoji">👗</span>
          </div>
          <div className="promo-card promo-green" onClick={() => navigate('/products?category=books')}>
            <div>
              <h3>Books & More</h3>
              <p>Min 50% Off</p>
            </div>
            <span className="promo-emoji">📚</span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner container">
          <div className="footer-col">
            <h4>ABOUT</h4>
            <a href="#">Contact Us</a>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
          </div>
          <div className="footer-col">
            <h4>HELP</h4>
            <a href="#">Payments</a>
            <a href="#">Shipping</a>
            <a href="#">Returns</a>
            <a href="#">FAQ</a>
          </div>
          <div className="footer-col">
            <h4>POLICY</h4>
            <a href="#">Return Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy</a>
          </div>
          <div className="footer-col footer-brand">
            <h3>Flipkart Clone</h3>
            <p>A learning project inspired by Flipkart's UI/UX.</p>
            <p>Built with React + FastAPI + MySQL.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Flipkart Clone. Built for learning purposes only.</p>
        </div>
      </footer>
    </div>
  );
}

// Shown while categories load from API
const PLACEHOLDER_CATEGORIES = [
  { name: 'Electronics',      slug: 'electronics',   emoji: '📱' },
  { name: 'Fashion',          slug: 'fashion',        emoji: '👗' },
  { name: 'Home & Kitchen',   slug: 'home-kitchen',   emoji: '🏠' },
  { name: 'Books',            slug: 'books',          emoji: '📚' },
  { name: 'Sports',           slug: 'sports-fitness', emoji: '⚽' },
  { name: 'Toys & Games',     slug: 'toys-games',     emoji: '🎮' },
  { name: 'Beauty',           slug: 'beauty',         emoji: '💄' },
  { name: 'Grocery',          slug: 'grocery',        emoji: '🛒' },
];