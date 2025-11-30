'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'coding' | 'music';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('coding');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'coding' ? 'music' : 'coding'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a AppThemeProvider');
  }
  return context;
}
