import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Classes from './pages/Classes';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Navigation from './components/Navigation';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 1024);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem('authToken'));
    };

    const handleResize = () => {
      if (window.innerWidth > 1024 && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

  return (
    <Router>
      <div className={`app-wrapper ${isAuthenticated ? 'with-nav' : 'no-nav'} ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        {isAuthenticated && <Navigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
        <div className={`main-content ${isAuthenticated ? 'with-sidebar' : ''}`}>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/classes" element={isAuthenticated ? <Classes /> : <Navigate to="/login" />} />
          <Route path="/students" element={isAuthenticated ? <Students /> : <Navigate to="/login" />} />
          <Route path="/attendance" element={isAuthenticated ? <Attendance /> : <Navigate to="/login" />} />
          <Route path="/checkin" element={isAuthenticated ? <CheckIn /> : <Navigate to="/login" />} />
          <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} />
          <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Landing />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
