import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import BusinessDetail from './pages/BusinessDetail';
import RegisterBusiness from './pages/RegisterBusiness';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedBookmarks from './pages/SavedBookmarks';

function MainAppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');

  const navigate = (page) => {
    const publicPages = ['login', 'register'];
    if (!isAuthenticated && !publicPages.includes(page)) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  // Redirect to login if not authenticated and on a protected page
  React.useEffect(() => {
    const publicPages = ['login', 'register'];
    if (!loading && !isAuthenticated && !publicPages.includes(currentPage)) {
      setCurrentPage('login');
    }
    if (!loading && isAuthenticated && publicPages.includes(currentPage)) {
      setCurrentPage('home');
    }
  }, [isAuthenticated, loading]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [detailId, setDetailId] = useState(null);

  if (loading) return null;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            setCurrentPage={navigate}
            setSearchQuery={setSearchQuery}
            setSelectedCategory={setSelectedCategory}
            setDetailId={setDetailId}
          />
        );
      case 'search':
        return (
          <Search
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setDetailId={setDetailId}
            setCurrentPage={navigate}
          />
        );
      case 'detail':
        return (
          <BusinessDetail
            businessId={detailId}
            setCurrentPage={navigate}
          />
        );
      case 'register_business':
        return <RegisterBusiness setCurrentPage={navigate} />;
      case 'dashboard':
        return (
          <Dashboard
            setCurrentPage={navigate}
            setDetailId={setDetailId}
          />
        );
      case 'admin':
        return <AdminPanel />;
      case 'login':
        return <Login setCurrentPage={navigate} />;
      case 'register':
        return <Register setCurrentPage={navigate} />;
      case 'bookmarks':
        return (
          <SavedBookmarks
            setCurrentPage={navigate}
            setDetailId={setDetailId}
          />
        );
      default:
        return (
          <Home
            setCurrentPage={navigate}
            setSearchQuery={setSearchQuery}
            setSelectedCategory={setSelectedCategory}
            setDetailId={setDetailId}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar currentPage={currentPage} setCurrentPage={navigate} />
      
      <main className="main-content">
        {renderPage()}
      </main>

      <footer style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '2rem 0',
        marginTop: 'auto',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <div className="container">
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            LocalScope &bull; Centralized Business Discovery Platform
          </p>
          <p>© {new Date().getFullYear()} LocalScope. All rights reserved. Supporting small businesses and local economies.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
