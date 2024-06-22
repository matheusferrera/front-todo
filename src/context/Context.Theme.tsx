// src/context/Context.Theme.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Theme {
  color: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  headerColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

const lightTheme: Theme = {
  color: '#333333', // Cor do texto principal
  backgroundColor: '#F5F5F5', // Cor de fundo principal
  cardBackgroundColor: '#FFFFFF', // Cor de fundo dos cards
  headerColor: '#2196F3', // Cor do cabeçalho
  buttonColor: '#2196F3', // Cor dos botões
  buttonTextColor: '#FFFFFF', // Cor do texto nos botões
};

const darkTheme: Theme = {
  color: '#FFFFFF', // Cor do texto principal
  backgroundColor: '#212121', // Cor de fundo principal
  cardBackgroundColor: '#333333', // Cor de fundo dos cards
  headerColor: '#FFD740', // Cor do cabeçalho
  buttonColor: '#FFD740', // Cor dos botões
  buttonTextColor: '#000000', // Cor do texto nos botões
};


interface ThemeContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentTheme: Theme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
