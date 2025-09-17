// src/components/CVBuilder/StyleSystem/ThemeProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CVTheme, StyleSystemContextType } from './types';
import { availableThemes, professionalTheme } from './designTokens';
import { applyThemeStyles, getCSSVariable } from './styleUtils';

const StyleSystemContext = createContext<StyleSystemContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultThemeId?: string;
  persistTheme?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultThemeId = 'professional',
  persistTheme = true,
}) => {
  const [currentTheme, setCurrentTheme] = useState<CVTheme>(() => {
    if (persistTheme && typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('mocv-theme');
      if (savedTheme) {
        try {
          return JSON.parse(savedTheme);
        } catch (error) {
          console.warn('Failed to parse saved theme, using default');
        }
      }
    }
    
    return availableThemes.find(t => t.id === defaultThemeId) || professionalTheme;
  });

  // Apply theme to DOM when theme changes
  useEffect(() => {
    const root = document.documentElement;
    applyThemeStyles(root, currentTheme);
    
    // Add theme class for additional styling
    root.className = root.className.replace(/cv-theme-\w+/g, '');
    root.classList.add(`cv-theme-${currentTheme.id}`);
    
    // Persist theme if enabled
    if (persistTheme) {
      localStorage.setItem('mocv-theme', JSON.stringify(currentTheme));
    }
  }, [currentTheme, persistTheme]);

  const setTheme = (themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
    } else {
      console.warn(`Theme "${themeId}" not found`);
    }
  };

  const customizeTheme = (updates: Partial<CVTheme>) => {
    setCurrentTheme(prev => ({
      ...prev,
      ...updates,
      colors: { ...prev.colors, ...updates.colors },
      typography: { ...prev.typography, ...updates.typography },
      spacing: { ...prev.spacing, ...updates.spacing },
      borderRadius: { ...prev.borderRadius, ...updates.borderRadius },
      shadows: { ...prev.shadows, ...updates.shadows },
    }));
  };

  const resetTheme = () => {
    const originalTheme = availableThemes.find(t => t.id === currentTheme.id);
    if (originalTheme) {
      setCurrentTheme(originalTheme);
    }
  };

  const exportTheme = (): string => {
    return JSON.stringify(currentTheme, null, 2);
  };

  const importTheme = (themeData: string) => {
    try {
      const theme = JSON.parse(themeData) as CVTheme;
      setCurrentTheme(theme);
    } catch (error) {
      console.error('Failed to import theme:', error);
      throw new Error('Invalid theme data');
    }
  };

  const value: StyleSystemContextType = {
    currentTheme,
    availableThemes,
    setTheme,
    customizeTheme,
    resetTheme,
    exportTheme,
    importTheme,
  };

  return (
    <StyleSystemContext.Provider value={value}>
      {children}
    </StyleSystemContext.Provider>
  );
};

// Custom hook to use the style system
export const useStyleSystem = (): StyleSystemContextType => {
  const context = useContext(StyleSystemContext);
  if (context === undefined) {
    throw new Error('useStyleSystem must be used within a ThemeProvider');
  }
  return context;
};

// Utility hook for getting CSS variable values
export const useCSSVariable = (variableName: string): string => {
  const [value, setValue] = useState('');
  
  useEffect(() => {
    const updateValue = () => {
      const cssValue = getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
      setValue(cssValue);
    };
    
    updateValue();
    
    // Listen for theme changes
    const observer = new MutationObserver(updateValue);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
    
    return () => observer.disconnect();
  }, [variableName]);
  
  return value;
};

export default ThemeProvider;
