import React, { createContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storage';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const user = StorageService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiLogin(email, password);
      setCurrentUser(data.user);
      StorageService.setCurrentUser(data.user);
      StorageService.setAuthToken(data.token);
      window.dispatchEvent(new Event('authChange'));
      return { user: data.user, token: data.token };
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiRegister(name, email, password);
      setCurrentUser(data.user);
      StorageService.setCurrentUser(data.user);
      StorageService.setAuthToken(data.token);
      window.dispatchEvent(new Event('authChange'));
      return { user: data.user, token: data.token };
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setCurrentUser(null);
      StorageService.clearAll();
      window.dispatchEvent(new Event('authChange'));
      setIsLoading(false);
    }
  }, []);

  // CRITICAL FIX: Included 'register' in the value object below
  const value = {
    currentUser,
    setCurrentUser,
    isLoading,
    error,
    setError,
    login,
    register, 
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
