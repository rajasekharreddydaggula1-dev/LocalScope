import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, MapPin, Coffee, Scissors, HeartPulse, ShoppingBag, GraduationCap, Utensils, Star, Compass, Dumbbell } from 'lucide-react';
import BusinessCard from '../components/BusinessCard';

const categories = [
  { id: 'all', name: 'All Categories', icon: Compass },
  { id: 'restaurants', name: 'Restaurants', icon: Utensils },
  { id: 'salons', name: 'Salons', icon: Scissors },
  { id: 'healthcare', name: 'Healthcare', icon: HeartPulse },
  { id: 'retail', name: 'Retail Shops', icon: ShoppingBag },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell }
];

export default function Home({ setCurrentPage, setSearchQuery, setSelectedCategory, setDetailId }) {
  const [localSearch, setLocalSearch] = useState('');
  const [localCity, setLocalCity] = useState('Bangalore');
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState({ users: 154, businesses: 42, reviews: 298 });

  useEffect(() => {
    // Load top verified businesses as featured
    fetch('http://localhost:5000/api/businesses')
      .then(res => res.json())
      .then(data => {
        // Sort by highest rating first and take top 3
        const sorted = data.sort((a, b) => b.rating - a.rating).slice(0, 3);
        setFeatured(sorted);
      })
      .catch(err => console.error("Error loading featured listings:", err));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setSelectedCategory('all');
    setCurrentPage('search');
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setSearchQuery('');
    setCurrentPage('search');
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <h1 className="hero-title">
          Discover Extraordinary<br />
          <span style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Local Businesses
          </span>
        </h1>
        <p className="hero-subtitle">
          Explore top-rated restaurants, premium salons, essential medical clinics, and unique local shops nestled in your neighborhood.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar-container">
          <div className="search-bar-glass">
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, borderRight: '1px solid var(--border-color)' }}>
              <SearchIcon size={20} style={{ color: 'var(--text-muted)', marginLeft: '1rem' }} />
              <input
                type="text"
                placeholder="What are you looking for? (e.g. coffee, haircut, dental...)"
                className="search-bar-input"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', width: '180px' }}>
              <MapPin size={18} style={{ color: 'var(--text-muted)', marginLeft: '0.75rem' }} />
              <input
                type="text"
                placeholder="City"
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', padding: '0.5rem 0.75rem' }}
                value={localCity}
                onChange={(e) => setLocalCity(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ borderRadius: '14px', padding: '0.6rem 1.5rem' }}>
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Categories Section */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 className="category-title">Browse by Category</h2>
        <div className="category-grid">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.id} 
                className="category-card"
                onClick={() => handleCategorySelect(cat.id)}
              >
                <Icon className="category-icon" size={32} />
                <span className="category-name">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="business-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Top-Rated Places</h2>
          <button 
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setCurrentPage('search'); }}
            className="btn btn-secondary" 
            style={{ fontSize: '0.9rem' }}
          >
            Explore All Listings
          </button>
        </div>

        <div className="business-grid">
          {featured.length > 0 ? (
            featured.map((biz) => (
              <BusinessCard 
                key={biz.id} 
                business={biz} 
                onViewDetail={(id) => { setDetailId(id); setCurrentPage('detail'); }}
              />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No businesses currently listed. Be the first to register one!
            </div>
          )}
        </div>
      </section>

      {/* Stat Counter Section */}
      <section style={{ padding: '4rem 0 6rem' }}>
        <div className="card-glass dashboard-stats-grid" style={{ padding: '3rem 2rem' }}>
          <div className="stat-box">
            <h3 className="stat-number">{stats.users}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.5rem' }}>Active Members</p>
          </div>
          <div className="stat-box" style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
            <h3 className="stat-number">{stats.businesses}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.5rem' }}>Verified Listings</p>
          </div>
          <div className="stat-box">
            <h3 className="stat-number">{stats.reviews}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.5rem' }}>Helpful Reviews</p>
          </div>
        </div>
      </section>
    </div>
  );
}
