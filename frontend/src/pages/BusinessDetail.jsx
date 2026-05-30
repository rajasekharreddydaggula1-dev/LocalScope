import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import BusinessMap from '../components/BusinessMap';
import { MapPin, Phone, Mail, Globe, Clock, ShieldCheck, Bookmark, ChevronLeft, MessageSquare, Plus } from 'lucide-react';

export default function BusinessDetail({ businessId, setCurrentPage }) {
  const { user, isAuthenticated } = useAuth();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const loadData = async () => {
    try {
      // Fetch details
      const bizRes = await fetch(`http://localhost:5000/api/businesses/${businessId}`);
      if (!bizRes.ok) throw new Error("Business not found");
      const bizData = await bizRes.json();
      setBusiness(bizData);

      // Fetch reviews
      const revRes = await fetch(`http://localhost:5000/api/reviews/${businessId}`);
      const revData = await revRes.json();
      setReviews(revData);

      // Check bookmark status if authenticated
      if (isAuthenticated) {
        const bookmarkedUserRes = await fetch('http://localhost:5000/api/businesses/bookmarks', {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('directory_user'))?.token}`
          }
        });
        const savedList = await bookmarkedUserRes.json();
        setIsBookmarked(savedList.some(b => b.id === businessId));
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading detail info:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [businessId, isAuthenticated]);

  const handleBookmarkToggle = async () => {
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
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to write a review");
      return;
    }

    setSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem('directory_user'))?.token;
      const res = await fetch(`http://localhost:5000/api/reviews/${businessId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: ratingInput, comment: commentInput })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit review');
      }

      setCommentInput('');
      // Reload rating and reviews
      await loadData();
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <h2>Loading Business Directory Profile...</h2>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <h2>Business Profile Not Found</h2>
        <button onClick={() => setCurrentPage('search')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Discover
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      
      {/* Back button */}
      <div style={{ padding: '1.5rem 0' }}>
        <button 
          onClick={() => setCurrentPage('search')} 
          className="btn btn-secondary" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <ChevronLeft size={16} />
          Back to Listings
        </button>
      </div>

      {/* Main Grid */}
      <div className="detail-grid">
        
        {/* Left Column - Content */}
        <div>
          <div className="detail-header">
            <div className="detail-tags-row">
              <span className="business-cat-badge">{business.category}</span>
              {business.isVerified && (
                <span className="business-verified-badge">
                  <ShieldCheck size={14} />
                  Verified Business
                </span>
              )}
            </div>

            <div className="detail-title-row">
              <h1 style={{ fontSize: '2.5rem' }}>{business.name}</h1>
              
              <button 
                onClick={handleBookmarkToggle}
                className="btn btn-secondary" 
                style={{ 
                  borderRadius: '50%', 
                  width: '44px', 
                  height: '44px', 
                  padding: 0, 
                  color: isBookmarked ? 'var(--accent-secondary)' : 'var(--text-secondary)' 
                }}
              >
                <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
              <StarRating rating={business.rating} size={20} />
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{business.rating} rating</span>
              <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{business.reviewCount} customer reviews</span>
            </div>

            <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              {business.description}
            </p>
          </div>

          {/* Services Section */}
          <div style={{ padding: '2rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <h3>Offered Services & Amenities</h3>
            <div className="detail-services-list">
              {business.services.map((svc, idx) => (
                <span key={idx} className="detail-service-tag">{svc}</span>
              ))}
            </div>
          </div>

          {/* Map Location Section */}
          <div style={{ padding: '2rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Location & Navigation</h3>
            <div style={{ height: '350px', width: '100%' }}>
              <BusinessMap 
                businesses={[business]} 
                selectedBusiness={business} 
                center={[business.coordinates.lat, business.coordinates.lng]} 
                zoom={15}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
              <MapPin size={16} />
              <span style={{ fontSize: '0.9rem' }}>{business.address}, {business.city}</span>
            </div>
          </div>

          {/* Reviews & Feedback System */}
          <div style={{ padding: '2rem 0' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} />
              <span>Customer Reviews ({reviews.length})</span>
            </h3>

            {/* Post Review Form */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="card-glass" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Share Your Experience</h4>
                
                <div className="form-group">
                  <label className="form-label">Your Rating</label>
                  <StarRating rating={ratingInput} onRatingChange={setRatingInput} size={28} />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Comment</label>
                  <textarea 
                    rows="3"
                    className="form-control" 
                    placeholder="Tell others what you liked or disliked..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                >
                  {submitting ? 'Posting Review...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="card-glass" style={{ textAlign: 'center', padding: '2rem', marginBottom: '2rem', borderStyle: 'dashed' }}>
                <p style={{ color: 'var(--text-secondary)' }}>You must be logged in to leave a review.</p>
                <button 
                  onClick={() => setCurrentPage('login')} 
                  className="btn btn-outline" 
                  style={{ marginTop: '0.75rem', padding: '0.4rem 1.2rem', fontSize: '0.85rem' }}
                >
                  Login to Review
                </button>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div>
                {reviews.map((rev) => (
                  <div key={rev.id} className="review-card">
                    <div className="review-meta">
                      <div>
                        <span className="review-author">{rev.username}</span>
                        <div style={{ marginTop: '0.25rem' }}>
                          <StarRating rating={rev.rating} size={14} />
                        </div>
                      </div>
                      <span className="review-date">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                No reviews yet. Be the first to share your feedback!
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar Contacts & Hours */}
        <div>
          <div className="card-glass detail-sidebar-card">
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Contact Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {business.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '0.9rem' }}>{business.phone}</span>
                </div>
              )}
              {business.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '0.9rem' }}>{business.email}</span>
                </div>
              )}
              {business.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Globe size={16} style={{ color: 'var(--accent-primary)' }} />
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', textDecoration: 'underline' }}
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>

            <h3 style={{ marginTop: '2.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>Hours of Operation</span>
            </h3>

            <div>
              {Object.entries(business.hours || {}).map(([day, hrs]) => (
                <div key={day} className="detail-hours-row">
                  <span style={{ textTransform: 'capitalize', fontWeight: 500, color: 'var(--text-secondary)' }}>{day}</span>
                  <span style={{ fontSize: '0.85rem' }}>{hrs}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
