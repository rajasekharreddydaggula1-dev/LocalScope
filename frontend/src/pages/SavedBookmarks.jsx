import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BusinessCard from '../components/BusinessCard';
import { Bookmark, Sparkles } from 'lucide-react';

export default function SavedBookmarks({ setCurrentPage, setDetailId }) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('directory_user'))?.token;
      const res = await fetch('http://localhost:5000/api/businesses/bookmarks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setBookmarks(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleBookmarkToggle = (id, isBookmarked) => {
    if (!isBookmarked) {
      // Remove from state immediately on toggle off
      setBookmarks(bookmarks.filter(b => b.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <h2>Loading Bookmarks...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      
      {/* Header */}
      <div style={{ padding: '2.5rem 0 2.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bookmark size={24} style={{ color: 'var(--accent-secondary)' }} />
          <span>My Saved Businesses</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Quickly access your favorite places, bookmarked salons, and preferred local restaurants.
        </p>
      </div>

      {/* Grid */}
      {bookmarks.length > 0 ? (
        <div className="business-grid">
          {bookmarks.map((biz) => (
            <BusinessCard 
              key={biz.id} 
              business={biz} 
              isBookmarked={true}
              onBookmarkToggle={handleBookmarkToggle}
              onViewDetail={(id) => { setDetailId(id); setCurrentPage('detail'); }}
            />
          ))}
        </div>
      ) : (
        <div className="card-glass" style={{ textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed' }}>
          <Sparkles size={48} style={{ color: 'var(--accent-secondary)', marginBottom: '1.25rem' }} />
          <h3 style={{ color: 'var(--text-primary)' }}>Your bookmark list is empty</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Start exploring verified listings and click the bookmark icon on any card to save details here.
          </p>
          <button 
            onClick={() => setCurrentPage('search')} 
            className="btn btn-primary" 
            style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem' }}
          >
            Find Businesses
          </button>
        </div>
      )}

    </div>
  );
}
