'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type AppTheme = 'coding' | 'music';

interface ThemeContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>('coding');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as AppTheme;
    if (savedTheme === 'coding' || savedTheme === 'music') {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('music-theme', savedTheme === 'music');
    }
  }, []);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
    document.documentElement.classList.toggle('music-theme', newTheme === 'music');
  };

  const toggleTheme = () => {
    setTheme(theme === 'coding' ? 'music' : 'coding');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return fallback if used outside provider
    return {
      theme: 'coding' as AppTheme,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}
