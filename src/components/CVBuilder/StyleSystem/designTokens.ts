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
