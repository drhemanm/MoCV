// src/components/CVBuilder/StyleSystem/types.ts
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface TypographyScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface SpacingScale {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface FontFamily {
  heading: string;
  body: string;
  mono: string;
}

export interface CVTheme {
  id: string;
  name: string;
  category: 'professional' | 'creative' | 'modern' | 'minimal';
  colors: ColorPalette;
  typography: {
    fontFamily: FontFamily;
    fontSize: TypographyScale;
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: SpacingScale;
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface StyleSystemContextType {
  currentTheme: CVTheme;
  availableThemes: CVTheme[];
  setTheme: (themeId: string) => void;
  customizeTheme: (updates: Partial<CVTheme>) => void;
  resetTheme: () => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => void;
}

// src/components/CVBuilder/StyleSystem/designTokens.ts
import { CVTheme } from './types';

// Base design tokens
export const baseSpacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
};

export const baseFontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
};

export const baseFontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const baseLineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

export const baseBorderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  full: '9999px',
};

export const baseShadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

// Professional Themes
export const professionalTheme: CVTheme = {
  id: 'professional',
  name: 'Professional Classic',
  category: 'professional',
  colors: {
    primary: '#1e40af',      // Blue 700
    secondary: '#64748b',    // Slate 500
    accent: '#0ea5e9',       // Sky 500
    background: '#ffffff',
    surface: '#f8fafc',      // Slate 50
    text: {
      primary: '#0f172a',    // Slate 900
      secondary: '#475569',  // Slate 600
      muted: '#94a3b8',      // Slate 400
    },
    border: '#e2e8f0',       // Slate 200
    success: '#059669',      // Emerald 600
    warning: '#d97706',      // Amber 600
    error: '#dc2626',        // Red 600
  },
  typography: {
    fontFamily: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontSize: baseFontSizes,
    fontWeight: baseFontWeights,
    lineHeight: baseLineHeights,
  },
  spacing: baseSpacing,
  borderRadius: baseBorderRadius,
  shadows: baseShadows,
};

export const creativeTheme: CVTheme = {
  id: 'creative',
  name: 'Creative Bold',
  category: 'creative',
  colors: {
    primary: '#7c3aed',      // Violet 600
    secondary: '#f59e0b',    // Amber 500
    accent: '#ec4899',       // Pink 500
    background: '#ffffff',
    surface: '#fafaf9',      // Stone 50
    text: {
      primary: '#1c1917',    // Stone 900
      secondary: '#57534e',  // Stone 600
      muted: '#a8a29e',      // Stone 400
    },
    border: '#e7e5e4',       // Stone 200
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
  },
  typography: {
    fontFamily: {
      heading: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'Source Code Pro', monospace",
    },
    fontSize: baseFontSizes,
    fontWeight: baseFontWeights,
    lineHeight: baseLineHeights,
  },
  spacing: baseSpacing,
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 2px 4px 0 rgb(124 58 237 / 0.1)',
    md: '0 4px 8px 0 rgb(124 58 237 / 0.15)',
    lg: '0 8px 16px 0 rgb(124 58 237 / 0.2)',
    xl: '0 12px 24px 0 rgb(124 58 237 / 0.25)',
  },
};

export const modernTheme: CVTheme = {
  id: 'modern',
  name: 'Modern Minimal',
  category: 'modern',
  colors: {
    primary: '#111827',      // Gray 900
    secondary: '#6b7280',    // Gray 500
    accent: '#06b6d4',       // Cyan 500
    background: '#ffffff',
    surface: '#f9fafb',      // Gray 50
    text: {
      primary: '#111827',    // Gray 900
      secondary: '#4b5563',  // Gray 600
      muted: '#9ca3af',      // Gray 400
    },
    border: '#e5e7eb',       // Gray 200
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
  },
  typography: {
    fontFamily: {
      heading: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'IBM Plex Mono', monospace",
    },
    fontSize: baseFontSizes,
    fontWeight: baseFontWeights,
    lineHeight: baseLineHeights,
  },
  spacing: baseSpacing,
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
    full: '9999px',
  },
  shadows: baseShadows,
};

export const minimalTheme: CVTheme = {
  id: 'minimal',
  name: 'Ultra Minimal',
  category: 'minimal',
  colors: {
    primary: '#000000',
    secondary: '#525252',    // Neutral 500
    accent: '#737373',       // Neutral 500
    background: '#ffffff',
    surface: '#ffffff',
    text: {
      primary: '#000000',
      secondary: '#404040',   // Neutral 700
      muted: '#737373',       // Neutral 500
    },
    border: '#d4d4d4',       // Neutral 300
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
  },
  typography: {
    fontFamily: {
      heading: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      mono: "'Monaco', 'Menlo', monospace",
    },
    fontSize: baseFontSizes,
    fontWeight: baseFontWeights,
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  spacing: baseSpacing,
  borderRadius: {
    none: '0',
    sm: '0',
    md: '0',
    lg: '0',
    full: '0',
  },
  shadows: {
    sm: 'none',
    md: 'none',
    lg: 'none',
    xl: 'none',
  },
};

// Export all available themes
export const availableThemes: CVTheme[] = [
  professionalTheme,
  creativeTheme,
  modernTheme,
  minimalTheme,
];

// src/components/CVBuilder/StyleSystem/styleUtils.ts
import { CVTheme } from './types';

/**
 * Generate CSS custom properties from theme object
 */
export const generateCSSVariables = (theme: CVTheme): Record<string, string> => {
  return {
    // Colors
    '--cv-color-primary': theme.colors.primary,
    '--cv-color-secondary': theme.colors.secondary,
    '--cv-color-accent': theme.colors.accent,
    '--cv-color-background': theme.colors.background,
    '--cv-color-surface': theme.colors.surface,
    '--cv-color-text-primary': theme.colors.text.primary,
    '--cv-color-text-secondary': theme.colors.text.secondary,
    '--cv-color-text-muted': theme.colors.text.muted,
    '--cv-color-border': theme.colors.border,
    '--cv-color-success': theme.colors.success,
    '--cv-color-warning': theme.colors.warning,
    '--cv-color-error': theme.colors.error,

    // Typography
    '--cv-font-heading': theme.typography.fontFamily.heading,
    '--cv-font-body': theme.typography.fontFamily.body,
    '--cv-font-mono': theme.typography.fontFamily.mono,
    
    '--cv-text-xs': theme.typography.fontSize.xs,
    '--cv-text-sm': theme.typography.fontSize.sm,
    '--cv-text-base': theme.typography.fontSize.base,
    '--cv-text-lg': theme.typography.fontSize.lg,
    '--cv-text-xl': theme.typography.fontSize.xl,
    '--cv-text-2xl': theme.typography.fontSize['2xl'],
    '--cv-text-3xl': theme.typography.fontSize['3xl'],
    '--cv-text-4xl': theme.typography.fontSize['4xl'],

    '--cv-font-light': theme.typography.fontWeight.light.toString(),
    '--cv-font-normal': theme.typography.fontWeight.normal.toString(),
    '--cv-font-medium': theme.typography.fontWeight.medium.toString(),
    '--cv-font-semibold': theme.typography.fontWeight.semibold.toString(),
    '--cv-font-bold': theme.typography.fontWeight.bold.toString(),

    '--cv-leading-tight': theme.typography.lineHeight.tight.toString(),
    '--cv-leading-normal': theme.typography.lineHeight.normal.toString(),
    '--cv-leading-relaxed': theme.typography.lineHeight.relaxed.toString(),

    // Spacing
    '--cv-space-xs': theme.spacing.xs,
    '--cv-space-sm': theme.spacing.sm,
    '--cv-space-md': theme.spacing.md,
    '--cv-space-lg': theme.spacing.lg,
    '--cv-space-xl': theme.spacing.xl,
    '--cv-space-2xl': theme.spacing['2xl'],
    '--cv-space-3xl': theme.spacing['3xl'],
    '--cv-space-4xl': theme.spacing['4xl'],

    // Border radius
    '--cv-rounded-none': theme.borderRadius.none,
    '--cv-rounded-sm': theme.borderRadius.sm,
    '--cv-rounded-md': theme.borderRadius.md,
    '--cv-rounded-lg': theme.borderRadius.lg,
    '--cv-rounded-full': theme.borderRadius.full,

    // Shadows
    '--cv-shadow-sm': theme.shadows.sm,
    '--cv-shadow-md': theme.shadows.md,
    '--cv-shadow-lg': theme.shadows.lg,
    '--cv-shadow-xl': theme.shadows.xl,
  };
};

/**
 * Apply theme styles to an element
 */
export const applyThemeStyles = (element: HTMLElement, theme: CVTheme): void => {
  const cssVariables = generateCSSVariables(theme);
  
  Object.entries(cssVariables).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });
};

/**
 * Get computed CSS variable value
 */
export const getCSSVariable = (variableName: string, element?: HTMLElement): string => {
  const target = element || document.documentElement;
  return getComputedStyle(target).getPropertyValue(variableName).trim();
};

/**
 * Convert theme to CSS string for export
 */
export const themeToCSS = (theme: CVTheme): string => {
  const cssVariables = generateCSSVariables(theme);
  
  const cssRules = Object.entries(cssVariables)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n');
    
  return `:root {\n${cssRules}\n}`;
};

/**
 * Lighten or darken a color
 */
export const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

/**
 * Check if a color is light or dark
 */
export const isLightColor = (color: string): boolean => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};

// src/components/CVBuilder/StyleSystem/ThemeProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CVTheme, StyleSystemContextType } from './types';
import { availableThemes, professionalTheme } from './designTokens';
import { applyThemeStyles, generateCSSVariables } from './styleUtils';

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
