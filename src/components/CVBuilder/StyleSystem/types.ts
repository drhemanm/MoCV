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
