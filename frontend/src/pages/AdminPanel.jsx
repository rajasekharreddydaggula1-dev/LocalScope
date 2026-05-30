import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, ShieldCheck, ShieldAlert, Users, Award, MessageCircle, Check, X, Trash2 } from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('directory_user'))?.token;
      
      // Load Stats
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Load Pending Listings
      const pendingRes = await fetch('http://localhost:5000/api/admin/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const pendingData = await pendingRes.json();
      setPending(pendingData);

      // Load All Businesses
      const allRes = await fetch('http://localhost:5000/api/businesses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const allData = await allRes.json();
      setAllBusinesses(allData);

      setLoading(false);
    } catch (error) {
      console.error("Error loading admin data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerify = async (id, name) => {
    if (!window.confirm(`Approve and verify "${name}"? It will become visible to all platform users immediately.`)) {
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem('directory_user'))?.token;
      const res = await fetch(`http://localhost:5000/api/admin/verify/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to verify business");
      
      alert(`"${name}" successfully approved and verified!`);
      loadAdminData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Reject and delete the listing request for "${name}"?`)) {
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem('directory_user'))?.token;
      const res = await fetch(`http://localhost:5000/api/admin/reject/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to reject listing");
      
      alert(`"${name}" listing rejected.`);
      loadAdminData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This is permanent.`)) return;
    try {
      const token = JSON.parse(localStorage.getItem('directory_user'))?.token;
      const res = await fetch(`http://localhost:5000/api/businesses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      alert(`"${name}" deleted.`);
      loadAdminData();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <h2>Loading Administrator Control Panel...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      
      {/* Header */}
      <div style={{ padding: '2.5rem 0 2.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={24} style={{ color: 'var(--accent-secondary)' }} />
          <span>System Administration Dashboard</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Overview system growth, moderate listing registrations, verify small businesses, and manage platform safety.
        </p>
      </div>

      {/* Quick Metrics */}
      {stats && (
        <div className="dashboard-stats-grid" style={{ marginBottom: '2.5rem' }}>
          <div className="card-glass stat-box">
            <Users size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
            <h3 className="stat-number">{stats.totalUsers}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Members</p>
          </div>
          <div className="card-glass stat-box">
            <Award size={24} style={{ color: 'var(--success)', marginBottom: '0.5rem' }} />
            <h3 className="stat-number">{stats.verifiedBusinesses}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Verified Listings</p>
          </div>
          <div className="card-glass stat-box">
            <ShieldAlert size={24} style={{ color: 'var(--warning)', marginBottom: '0.5rem' }} />
            <h3 className="stat-number">{stats.pendingVerifications}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Pending Approvals</p>
          </div>
          <div className="card-glass stat-box">
            <MessageCircle size={24} style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }} />
            <h3 className="stat-number">{stats.totalReviews}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Reviews</p>
          </div>
        </div>
      )}

      {/* Pending Approvals Table */}
      <div className="card-glass" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          Pending Listing Verifications ({pending.length})
        </h3>

        {pending.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Category</th>
                  <th>City</th>
                  <th>Street Address</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((biz) => (
                  <tr key={biz.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{biz.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{biz.category}</td>
                    <td>{biz.city}</td>
                    <td>{biz.address}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleVerify(biz.id, biz.name)}
                          className="btn btn-primary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Check size={14} />
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(biz.id, biz.name)}
                          className="btn btn-danger" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
            <h4 style={{ color: 'var(--text-primary)' }}>All caught up!</h4>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>No business profiles are currently awaiting administrator moderation.</p>
          </div>
        )}
      </div>

      {/* All Businesses Table */}
      <div className="card-glass" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          All Businesses ({allBusinesses.length})
        </h3>
        {allBusinesses.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Category</th>
                  <th>City</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allBusinesses.map((biz) => (
                  <tr key={biz.id}>
                    <td style={{ fontWeight: 600 }}>{biz.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{biz.category}</td>
                    <td>{biz.city}</td>
                    <td>
                      {biz.isVerified ? (
                        <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ShieldCheck size={13} /> Verified
                        </span>
                      ) : (
                        <span style={{ color: 'var(--warning)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ShieldAlert size={13} /> Pending
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(biz.id, biz.name)}
                        className="btn btn-danger"
                        style={{ padding: '0.4rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No businesses found.</p>
        )}
      </div>

    </div>
  );
}
