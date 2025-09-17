// src/components/CVBuilder/ColorSystem/types.ts

export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface Color {
  hex: string;
  hsl: HSLColor;
  rgb: RGBColor;
  name?: string;
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  primary: Color;
  secondary: Color;
  accent: Color;
  neutral: {
    50: Color;
    100: Color;
    200: Color;
    300: Color;
    400: Color;
    500: Color;
    600: Color;
    700: Color;
    800: Color;
    900: Color;
  };
  semantic: {
    success: Color;
    warning: Color;
    error: Color;
    info: Color;
  };
}

export interface BrandColors {
  primary: Color[];
  secondary: Color[];
  accent: Color[];
  neutral: Color[];
}

export interface AccessibilityReport {
  isAccessible: boolean;
  contrastRatio: number;
  wcagLevel: 'AA' | 'AAA' | 'fail';
  recommendations: string[];
}

export interface ColorHarmony {
  type: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'split-complementary';
  colors: Color[];
  description: string;
}

export interface ColorSystemContextType {
  // Current colors
  currentPalette: ColorPalette;
  customColors: Record<string, Color>;
  
  // Color operations
  updatePaletteColor: (key: keyof ColorPalette, color: Color) => void;
  generatePalette: (baseColor: Color, type: ColorHarmony['type']) => ColorPalette;
  extractColorsFromImage: (imageFile: File) => Promise<BrandColors>;
  
  // Palette management
  savePalette: (palette: ColorPalette) => void;
  loadPalette: (paletteId: string) => void;
  resetPalette: () => void;
  
  // Accessibility
  checkContrast: (foreground: Color, background: Color) => AccessibilityReport;
  suggestAccessibleColors: (baseColor: Color) => Color[];
  
  // Color utilities
  generateHarmony: (baseColor: Color, type: ColorHarmony['type']) => ColorHarmony;
  adjustColor: (color: Color, adjustments: Partial<HSLColor>) => Color;
  
  // Preview
  previewColor: (key: string, color: Color) => void;
  clearPreview: () => void;
  
  // Export
  exportPalette: (format: 'css' | 'json' | 'scss') => string;
}

// Predefined color harmonies
export const COLOR_HARMONY_TYPES = {
  monochromatic: {
    name: 'Monochromatic',
    description: 'Different shades of the same color',
    angles: [0]
  },
  analogous: {
    name: 'Analogous',
    description: 'Colors next to each other on the color wheel',
    angles: [0, 30, 60]
  },
  complementary: {
    name: 'Complementary',
    description: 'Colors opposite on the color wheel',
    angles: [0, 180]
  },
  triadic: {
    name: 'Triadic',
    description: 'Three colors evenly spaced on the color wheel',
    angles: [0, 120, 240]
  },
  tetradic: {
    name: 'Tetradic',
    description: 'Four colors forming a rectangle on the color wheel',
    angles: [0, 90, 180, 270]
  },
  'split-complementary': {
    name: 'Split Complementary',
    description: 'Base color plus two colors adjacent to its complement',
    angles: [0, 150, 210]
  }
} as const;

// Professional color palettes for different industries
export const INDUSTRY_PALETTES = {
  technology: {
    primary: '#0066CC',
    secondary: '#4A90E2',
    accent: '#00D4FF',
    success: '#00C851',
    warning: '#FF6900',
    error: '#FF4444'
  },
  finance: {
    primary: '#1E3A8A',
    secondary: '#3B82F6',
    accent: '#10B981',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626'
  },
  healthcare: {
    primary: '#0F766E',
    secondary: '#14B8A6',
    accent: '#06B6D4',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  creative: {
    primary: '#7C3AED',
    secondary: '#A855F7',
    accent: '#EC4899',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  legal: {
    primary: '#1F2937',
    secondary: '#4B5563',
    accent: '#6B7280',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626'
  },
  consulting: {
    primary: '#1E40AF',
    secondary: '#3B82F6',
    accent: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  }
} as const;

// Default neutral color scales
export const NEUTRAL_SCALES = {
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A'
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  },
  zinc: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B'
  }
} as const;

// WCAG contrast requirements
export const WCAG_REQUIREMENTS = {
  AA: {
    normal: 4.5,
    large: 3.0
  },
  AAA: {
    normal: 7.0,
    large: 4.5
  }
} as const;

// Color picker presets
export const COLOR_PRESETS = {
  reds: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D'],
  oranges: ['#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12'],
  yellows: ['#EAB308', '#CA8A04', '#A16207', '#854D0E', '#713F12'],
  greens: ['#10B981', '#059669', '#047857', '#065F46', '#064E3B'],
  blues: ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A'],
  indigos: ['#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81'],
  purples: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95'],
  pinks: ['#EC4899', '#DB2777', '#BE185D', '#9D174D', '#831843'],
  grays: ['#6B7280', '#4B5563', '#374151', '#1F2937', '#111827']
} as const;

export type ColorPresetKey = keyof typeof COLOR_PRESETS;
