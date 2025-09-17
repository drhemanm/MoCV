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
