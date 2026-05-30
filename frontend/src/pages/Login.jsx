import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Eye, EyeOff, User, Briefcase, ShieldCheck } from 'lucide-react';

const ROLES = [
  { key: 'user',  label: 'User',             icon: User,         accent: 'var(--accent-primary)',   glow: 'var(--accent-glow)',          placeholder: 'e.g. alice@explorer.com',  demo: 'alice@explorer.com / admin123' },
  { key: 'owner', label: 'Business Owner',   icon: Briefcase,    accent: 'var(--accent-secondary)', glow: 'rgba(168,85,247,0.12)',        placeholder: 'e.g. john@vintagebrew.com', demo: 'john@vintagebrew.com / admin123' },
  { key: 'admin', label: 'Admin',            icon: ShieldCheck,  accent: '#f59e0b',                 glow: 'rgba(245,158,11,0.12)',        placeholder: 'e.g. admin@directory.com', demo: 'admin@directory.com / admin123' },
];

export default function Login({ setCurrentPage }) {
  const { login, logout } = useAuth();
  const [activeRole, setActiveRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const role = ROLES.find(r => r.key === activeRole);
  const Icon = role.icon;

  const handleTabChange = (key) => {
    setActiveRole(key);
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { alert('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.role !== activeRole) {
        logout();
        alert(`This account is not a ${role.label} account. Please select the correct role.`);
        return;
      }
      setCurrentPage(data.role === 'admin' ? 'admin' : data.role === 'owner' ? 'dashboard' : 'home');
    } catch (error) {
      alert(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '5rem 0' }}>
      <div className="card-glass" style={{ maxWidth: '460px', margin: '0 auto', padding: '2.5rem' }}>

        {/* Role Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '2rem' }}>
          {ROLES.map(r => {
            const TabIcon = r.icon;
            const active = r.key === activeRole;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => handleTabChange(r.key)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
                  padding: '0.65rem 0.5rem', borderRadius: '10px', cursor: 'pointer',
                  border: `1.5px solid ${active ? r.accent : 'var(--border-color)'}`,
                  background: active ? r.glow : 'transparent',
                  color: active ? r.accent : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: '0.75rem', transition: 'all 0.2s'
                }}
              >
                <TabIcon size={18} />
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', backgroundColor: role.glow, borderRadius: '16px', color: role.accent, marginBottom: '1rem' }}>
            <Icon size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem' }}>{role.label} Login</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {activeRole === 'user'  && 'Discover and review local businesses'}
            {activeRole === 'owner' && 'Manage your business listings'}
            {activeRole === 'admin' && 'Access the admin control panel'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder={role.placeholder}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0, display: 'flex' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', background: role.accent, borderColor: role.accent }}
          >
            {loading ? 'Signing In...' : `Sign In as ${role.label}`}
          </button>
        </form>

        {activeRole !== 'admin' && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setCurrentPage('register'); }}
              style={{ color: role.accent, fontWeight: 600, textDecoration: 'underline' }}
            >
              Sign Up
            </a>
          </div>
        )}

        {/* Demo credentials */}
        <div style={{ marginTop: '1.5rem', padding: '0.85rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Demo: </span>
          {role.demo}
        </div>

      </div>
    </div>
  );
}
