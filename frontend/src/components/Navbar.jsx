import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, Search, Bookmark, LayoutDashboard, Settings, LogOut, User } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage }) {
  const { user, isAuthenticated, logout, isAdmin, isOwner } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>
          <Compass size={24} />
          <span>LocalScope</span>
        </a>

        <nav className="nav-links">
          <a
            href="#"
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
          >
            Home
          </a>
          <a
            href="#"
            className={`nav-link ${currentPage === 'search' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}
          >
            Discover
          </a>

          {isAuthenticated && (
            <a
              href="#"
              className={`nav-link ${currentPage === 'bookmarks' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('bookmarks'); }}
            >
              Saved
            </a>
          )}

          {isOwner && (
            <a
              href="#"
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('dashboard'); }}
            >
              Manage
            </a>
          )}

          {isAdmin && (
            <a
              href="#"
              className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('admin'); }}
            >
              Admin
            </a>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <User size={16} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.username}</span>
              </div>
              <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setCurrentPage('login')}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentPage('register')}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
