import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function Register({ setCurrentPage }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default is regular user
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password, role);
      alert("Account created successfully!");
      setCurrentPage('home');
    } catch (error) {
      alert(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '5rem 0' }}>
      <div className="card-glass" style={{ maxWidth: '480px', margin: '0 auto', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', backgroundColor: 'var(--accent-glow)', borderRadius: '16px', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
            <UserPlus size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem' }}>Join the Platform</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Discover local businesses or establish your online presence
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. alice_explorer" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="e.g. alice@explorer.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="form-control" 
                placeholder="Min 6 characters" 
                required
                minLength={6}
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

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">I want to...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              
              <div 
                onClick={() => setRole('user')}
                style={{
                  border: `1.5px solid ${role === 'user' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  background: role === 'user' ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'var(--transition-fast)'
                }}
              >
                Explore & Review
              </div>

              <div 
                onClick={() => setRole('owner')}
                style={{
                  border: `1.5px solid ${role === 'owner' ? 'var(--accent-secondary)' : 'var(--border-color)'}`,
                  background: role === 'owner' ? 'rgba(168, 85, 247, 0.05)' : 'transparent',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'var(--transition-fast)'
                }}
              >
                Register Businesses
              </div>

            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setCurrentPage('login'); }}
            style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}
          >
            Sign In
          </a>
        </div>

      </div>
    </div>
  );
}
