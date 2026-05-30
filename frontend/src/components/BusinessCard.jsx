import React, { useState } from 'react';
import StarRating from './StarRating';
import { MapPin, Phone, ShieldCheck, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BusinessCard({ business, onViewDetail, onBookmarkToggle, isBookmarked = false }) {
  const { isAuthenticated } = useAuth();
  const [bookmarkedState, setBookmarkedState] = useState(isBookmarked);

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please login to save bookmarks");
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/businesses/${business.id}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('directory_user'))?.token}`
        }
      });
      const data = await response.json();
      setBookmarkedState(data.bookmarked);
      if (onBookmarkToggle) {
        onBookmarkToggle(business.id, data.bookmarked);
      }
    } catch (error) {
      console.error("Bookmark request failed:", error);
    }
  };

  return (
    <div className="card-glass business-card-inner" style={{ position: 'relative' }}>
      {/* Bookmark button */}
      <button 
        onClick={handleBookmarkClick}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: bookmarkedState ? 'var(--accent-secondary)' : 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'var(--transition-fast)',
          zIndex: 5
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <Bookmark size={16} fill={bookmarkedState ? "currentColor" : "none"} />
      </button>

      <div className="business-meta">
        <span className="business-cat-badge">{business.category}</span>
        {business.isVerified && (
          <span className="business-verified-badge">
            <ShieldCheck size={12} />
            Verified
          </span>
        )}
      </div>

      <h3 className="business-card-title">{business.name}</h3>

      {business.reviewCount > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <StarRating rating={business.rating} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({business.reviewCount})</span>
        </div>
      ) : (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>No reviews yet</span>
      )}

      <p className="business-card-desc">{business.description}</p>

      <div className="business-card-content">
        {/* Render tags */}
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {business.services.slice(0, 3).map((svc, i) => (
            <span 
              key={i} 
              style={{
                fontSize: '0.7rem',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px',
                color: 'var(--text-secondary)'
              }}
            >
              {svc}
            </span>
          ))}
          {business.services.length > 3 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              +{business.services.length - 3} more
            </span>
          )}
        </div>

        <div className="business-card-footer">
          <span className="business-address-text">
            <MapPin size={12} />
            <span>{business.address}</span>
          </span>
          <button 
            onClick={() => onViewDetail(business.id)}
            className="btn btn-outline" 
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', borderRadius: '8px' }}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
