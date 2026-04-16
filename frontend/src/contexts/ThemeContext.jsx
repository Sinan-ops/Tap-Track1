import React, { createContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => StorageService.getTheme());
  const [isDark, setIsDark] = useState(false);

  // Apply theme to DOM
  useEffect(() => {
    const applyTheme = () => {
      let shouldBeDark = false;

      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'light') {
        shouldBeDark = false;
      } else {
        shouldBeDark = false;
      }

      setIsDark(shouldBeDark);
      const root = document.documentElement;
      if (shouldBeDark) {
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
      } else {
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
      }
    };

    applyTheme();

    // Listen for system theme changes
    return undefined;
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    StorageService.setTheme(newTheme);
  }, []);

  const value = {
    theme,
    setTheme,
    isDark,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
