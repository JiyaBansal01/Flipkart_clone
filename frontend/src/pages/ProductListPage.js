/**
 * pages/ProductListPage.js
 * =========================
 * Shows a filterable, searchable grid of products.
 * Reads URL params: ?search=phone&category=electronics
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import { productAPI, categoryAPI } from '../utils/api';
import './ProductListPage.css';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'name', label: 'Name: A to Z' },
];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const searchQuery    = searchParams.get('search') || '';
  const categorySlug   = searchParams.get('category') || '';
  const currentPage    = parseInt(searchParams.get('page') || '1');

  // Load categories for sidebar
  useEffect(() => {
    categoryAPI.getCategories()
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  // Load products whenever filters change
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Build sort params
      let sort_by = 'id', sort_order = 'desc';
      if (sortBy === 'price_asc')  { sort_by = 'price'; sort_order = 'asc'; }
      if (sortBy === 'price_desc') { sort_by = 'price'; sort_order = 'desc'; }
      if (sortBy === 'rating')     { sort_by = 'rating'; sort_order = 'desc'; }
      if (sortBy === 'name')       { sort_by = 'name'; sort_order = 'asc'; }

      const params = {
        page: currentPage,
        per_page: 20,
        sort_by,
        sort_order,
      };

      if (searchQuery)                params.search = searchQuery;
      if (categorySlug)               params.category_slug = categorySlug;
      if (priceRange.min)             params.min_price = priceRange.min;
      if (priceRange.max)             params.max_price = priceRange.max;

      const response = await productAPI.getProducts(params);
      setProducts(response.data.products || []);
      setTotalProducts(response.data.total || 0);
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categorySlug, currentPage, sortBy, priceRange]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleCategoryClick = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    params.delete('page');
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyPriceFilter = () => {
    loadProducts();
  };

  const currentCategoryName = categories.find(c => c.slug === categorySlug)?.name || '';

  return (
    <div className="product-list-page">
      <div className="plp-container">

        {/* ── Left Sidebar: Filters ── */}
        <aside className="filter-sidebar">
          <div className="filter-section">
            <h3 className="filter-title">Filters</h3>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h4 className="filter-heading">CATEGORY</h4>
            <ul className="filter-list">
              <li>
                <button
                  className={`filter-item ${!categorySlug ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('')}
                >
                  All Categories
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    className={`filter-item ${categorySlug === cat.slug ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(cat.slug)}
                  >
                    {cat.icon} {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4 className="filter-heading">PRICE RANGE</h4>
            <div className="price-filter">
              <input
                type="number"
                placeholder="Min ₹"
                value={priceRange.min}
                onChange={e => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="price-input"
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={priceRange.max}
                onChange={e => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="price-input"
              />
            </div>
            <button className="apply-filter-btn" onClick={applyPriceFilter}>
              Apply
            </button>
          </div>

          {/* Quick Price Ranges */}
          <div className="filter-section">
            <h4 className="filter-heading">QUICK FILTERS</h4>
            <ul className="filter-list">
              {[
                { label: 'Under ₹500',     min: '', max: '500' },
                { label: '₹500 – ₹1,000', min: '500', max: '1000' },
                { label: '₹1,000 – ₹5,000', min: '1000', max: '5000' },
                { label: '₹5,000 – ₹20,000', min: '5000', max: '20000' },
                { label: 'Above ₹20,000', min: '20000', max: '' },
              ].map(range => (
                <li key={range.label}>
                  <button
                    className="filter-item"
                    onClick={() => setPriceRange({ min: range.min, max: range.max })}
                  >
                    {range.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="plp-main">

          {/* Results Header */}
          <div className="results-header">
            <div className="results-info">
              {searchQuery && (
                <h1 className="results-title">
                  Results for "<span className="search-highlight">{searchQuery}</span>"
                </h1>
              )}
              {currentCategoryName && !searchQuery && (
                <h1 className="results-title">{currentCategoryName}</h1>
              )}
              {!searchQuery && !currentCategoryName && (
                <h1 className="results-title">All Products</h1>
              )}
              <p className="results-count">
                {loading ? 'Loading...' : `${totalProducts.toLocaleString('en-IN')} results`}
              </p>
            </div>

            {/* Sort */}
            <div className="sort-bar">
              <span className="sort-label">Sort by:</span>
              <div className="sort-options">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`sort-btn ${sortBy === opt.value ? 'active' : ''}`}
                    onClick={() => setSortBy(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
              <button
                className="btn btn-outline"
                onClick={() => setSearchParams({})}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid-plp">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    ‹ Prev
                  </button>

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    className="page-btn"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next ›
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
