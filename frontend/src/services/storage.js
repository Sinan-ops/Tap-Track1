// Minimal storage service - only for session/auth data
export const StorageService = {
  // Auth token
  setAuthToken: (token) => {
    localStorage.setItem('authToken', token);
  },
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },
  clearAuthToken: () => {
    localStorage.removeItem('authToken');
  },

  // Current user
  setCurrentUser: (user) => {
    localStorage.setItem('current_user', JSON.stringify(user));
  },
  getCurrentUser: () => {
    const data = localStorage.getItem('current_user');
    return data ? JSON.parse(data) : null;
  },
  clearCurrentUser: () => {
    localStorage.removeItem('current_user');
  },

  // Theme (preference, not data)
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
  },
  getTheme: () => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark' ? 'dark' : 'light';
  },

  // Clear all
  clearAll: () => {
    localStorage.clear();
  },
};

