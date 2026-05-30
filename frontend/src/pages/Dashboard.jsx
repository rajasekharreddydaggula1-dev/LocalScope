import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Plus, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function Dashboard({ setCurrentPage, setDetailId }) {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMyListings = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('directory_user'))?.token;
      const res = await fetch('http://localhost:5000/api/businesses/my-listings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setMyListings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading listings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyListings();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <h2>Loading Dashboard Listings...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5rem 0 2.5rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LayoutDashboard size={24} style={{ color: 'var(--accent-primary)' }} />
            <span>Business Partner Hub</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Manage your profiles, track verification requests, and moderate customer reviews.
          </p>
        </div>

        <button 
          onClick={() => setCurrentPage('register_business')}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Register Business
        </button>
      </div>

      {/* Pending Approvals */}
      {myListings.filter(b => !b.isVerified).length > 0 && (
        <div className="card-glass" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}>
            <ShieldAlert size={18} style={{ color: 'var(--warning)' }} />
            Pending Approvals ({myListings.filter(b => !b.isVerified).length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {myListings.filter(b => !b.isVerified).map(biz => (
              <div key={biz.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'rgba(245,158,11,0.05)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{biz.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem', textTransform: 'capitalize' }}>{biz.category} &bull; {biz.city}</p>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--warning)', backgroundColor: 'rgba(245,158,11,0.1)', padding: '0.25rem 0.65rem', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                  Awaiting Admin Review
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main panel */}
      <div className="card-glass" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>My Registered Profiles</h3>

        {myListings.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Category</th>
                  <th>Review Score</th>
                  <th>Approval Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map((biz) => (
                  <tr key={biz.id}>
                    <td style={{ fontWeight: 600 }}>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); setDetailId(biz.id); setCurrentPage('detail'); }}
                        style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}
                      >
                        {biz.name}
                      </a>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{biz.category}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ color: 'var(--warning)' }}>★</span>
                        <span>{biz.rating > 0 ? biz.rating : 'N/A'}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({biz.reviewCount})</span>
                      </div>
                    </td>
                    <td>
                      {biz.isVerified ? (
                        <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                          <ShieldCheck size={14} />
                          Active & Verified
                        </span>
                      ) : (
                        <span style={{ color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                          <ShieldAlert size={14} />
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => { setDetailId(biz.id); setCurrentPage('detail'); }}
                        className="btn btn-secondary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <h4 style={{ color: 'var(--text-primary)' }}>You don't have any registered businesses.</h4>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Click the "Register Business" button above to establish your online presence today!</p>
          </div>
        )}
      </div>

    </div>
  );
}
