import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/Landing.css';

function Landing() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="landing-page">
      <div className="landing-inner">
        <header className="landing-header">
          <div className="landing-brand">
            <div className="landing-logo">TT</div>
            <div>
              <h1>Tap-Track</h1>
              <p>Attendance</p>
            </div>
          </div>
          <div className="landing-header-actions">
            <button type="button" className="theme-toggle" onClick={handleThemeToggle}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button type="button" className="btn-primary get-started" onClick={() => navigate('/login?mode=register')}>
              Get Started
            </button>
          </div>
        </header>

        <main className="landing-content">
          <p className="landing-eyebrow">Attendance Management</p>
          <h2>Attendance Management for Real Schools.</h2>
          <p className="landing-description">
            Manage classes, students, and daily attendance with analytics, exports, and secure sync.
          </p>
          <div className="landing-buttons">
            <button type="button" className="btn-primary" onClick={() => navigate('/login')}>
              Log In
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/login?mode=register')}>
              Sign Up
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Landing;
