import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navigation.css';

function Navigation({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  const titles = {
    '/dashboard': 'Dashboard',
    '/classes': 'Classes',
    '/students': 'Students',
    '/attendance': 'Attendance',
    '/reports': 'Reports',
    '/checkin': 'Check In',
    '/users': 'Users',
  };

  const pageTitle = titles[location.pathname] || 'Tap-Track';

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  return (
    <div className={`sidebar-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">TT</span>
          <div className="brand-text">
            <h1>Tap-Track</h1>
            <p>Attendance</p>
          </div>
          <button className="sidebar-close-btn" onClick={closeSidebar} title="Close menu">
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="nav-link">
            📊 Dashboard
          </NavLink>
          <NavLink to="/classes" className="nav-link">
            📚 Classes
          </NavLink>
          <NavLink to="/students" className="nav-link">
            👥 Students
          </NavLink>
          <NavLink to="/attendance" className="nav-link">
            ✓ Attendance
          </NavLink>
          <NavLink to="/reports" className="nav-link">
            📈 Reports
          </NavLink>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <header className="topbar">
        <div className="topbar-left">
          <h2>{pageTitle}</h2>
          <span className="status-chip">Online</span>
        </div>

        <div className="topbar-right">
          {!sidebarOpen && (
            <button type="button" className="sidebar-toggle-btn" onClick={openSidebar} title="Open menu">
              ☰
            </button>
          )}
          <button type="button" className="sync-btn" onClick={() => window.location.reload()}>
            Sync
          </button>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
    </div>
  );
}

export default Navigation;
