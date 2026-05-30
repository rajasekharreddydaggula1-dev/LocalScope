import React, { useState, useEffect } from 'react';
import BusinessCard from '../components/BusinessCard';
import BusinessMap from '../components/BusinessMap';
import { Search as SearchIcon, Compass, Utensils, Scissors, HeartPulse, ShoppingBag, GraduationCap, Dumbbell } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All', icon: Compass },
  { id: 'restaurants', name: 'Restaurants', icon: Utensils },
  { id: 'salons', name: 'Salons', icon: Scissors },
  { id: 'healthcare', name: 'Healthcare', icon: HeartPulse },
  { id: 'retail', name: 'Retail', icon: ShoppingBag },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell }
];

export default function Search({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  setDetailId, 
  setCurrentPage 
}) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const fetchBusinesses = (category, search) => {
    setLoading(true);
    let url = `http://localhost:5000/api/businesses?category=${category}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => { setBusinesses(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => {
    fetchBusinesses(selectedCategory, searchQuery);
    setLocalSearch(searchQuery);
  }, [selectedCategory, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    fetchBusinesses(selectedCategory, localSearch);
  };

  const handleCardHover = (biz) => {
    setSelectedBusiness(biz);
  };

  const handleMarkerClick = (bizId) => {
    const found = businesses.find(b => b.id === bizId);
    if (found) {
      setSelectedBusiness(found);
      // Optional: scroll to the highlighted business element
      const element = document.getElementById(`biz-card-${bizId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="search-split-layout">
      {/* Left Pane - Businesses List */}
      <div className="search-results-pane">
        
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1.5rem' }}>
          <div className="search-bar-glass" style={{ borderRadius: '12px', padding: '0.25rem 0.5rem' }}>
            <SearchIcon size={18} style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }} />
            <input
              type="text"
              className="search-bar-input"
              placeholder="Filter by name, tags, address..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{ fontSize: '0.9rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', borderRadius: '8px' }}>
              Find
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                padding: '0.4rem 0.9rem', 
                fontSize: '0.8rem', 
                borderRadius: '20px', 
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <cat.icon size={12} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Found <strong>{businesses.length}</strong> matching businesses
          </span>
        </div>

        {/* List of cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Searching nearby businesses...
          </div>
        ) : businesses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {businesses.map((biz) => (
              <div 
                key={biz.id} 
                id={`biz-card-${biz.id}`}
                onMouseEnter={() => handleCardHover(biz)}
                style={{
                  border: selectedBusiness?.id === biz.id ? '1px solid var(--accent-primary)' : 'none',
                  borderRadius: '16px',
                  transition: 'border var(--transition-fast)'
                }}
              >
                <BusinessCard
                  business={biz}
                  onViewDetail={(id) => { setDetailId(id); setCurrentPage('detail'); }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
            <h3>No listings match your search.</h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Try clearing filters or checking for typos.</p>
          </div>
        )}
      </div>

      {/* Right Pane - Map split */}
      <div className="search-map-pane">
        <BusinessMap
          businesses={businesses}
          selectedBusiness={selectedBusiness}
          onMarkerClick={handleMarkerClick}
        />
      </div>
    </div>
  );
}
