import React, { createContext, useContext, useEffect } from 'react';
import { colors, lightColors, applyTheme } from './colors';

export type ThemeMode = 'light';

interface ThemeContextType {
  theme: 'light';
  isDark: false;
  colors: typeof lightColors;
  setTheme: (mode: any) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  colors: lightColors,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: any;
}> = ({ children }) => {
  useEffect(() => {
    applyTheme('light');
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: 'light',
        isDark: false,
        colors: lightColors,
        setTheme: () => {},
        toggleTheme: () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
