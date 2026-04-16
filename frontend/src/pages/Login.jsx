import React, { useState, useEffect } from 'react';
import '../styles/Login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

function Login() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'register') {
      setMode('register');
    }
  }, [location.search]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let data;
      if (mode === 'login') {
        data = await login(email, password);
      } else {
        data = await register(name, email, password);
      }

      if (data?.token) {
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Operation failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1 className="logo">
            <span>📍</span>
            Tap-Track
          </h1>
          <button type="button" className="page-theme-toggle" onClick={handleThemeToggle}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'tab active' : 'tab'}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'tab active' : 'tab'}
            onClick={() => setMode('register')}
          >
            Sign Up
          </button>
        </div>

        <h2>{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (mode === 'login' ? 'Logging in...' : 'Creating account...')
              : (mode === 'login' ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="demo-info">
          Demo credentials: admin@tap-track.local / password123
        </p>
      </div>
    </div>
  );
}

export default Login;
