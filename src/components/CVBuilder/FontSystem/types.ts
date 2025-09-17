// src/components/CVBuilder/FontSystem/types.ts

export type GoogleFontCategory = 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type FontStyle = 'normal' | 'italic';

export interface GoogleFontVariant {
  weight: FontWeight;
  style: FontStyle;
}

export interface GoogleFont {
  family: string;
  category: GoogleFontCategory;
  variants: FontWeight[];
  subsets: string[];
  popularity: number;
  tags: string[];
  description?: string;
  previewText?: string;
}

export interface FontPairing {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'modern' | 'elegant' | 'minimal';
  heading: {
    family: string;
    weight: FontWeight;
    fallback: string;
  };
  body: {
    family: string;
    weight: FontWeight;
    fallback: string;
  };
  popularity: number;
  tags: string[];
}

export interface TypographySettings {
  headingFont: {
    family: string;
    weight: FontWeight;
    size: {
      h1: number; // rem values
      h2: number;
      h3: number;
      h4: number;
    };
    lineHeight: number;
    letterSpacing: number;
    fallback: string;
  };
  bodyFont: {
    family: string;
    weight: FontWeight;
    size: number; // base font size in rem
    lineHeight: number;
    letterSpacing: number;
    fallback: string;
  };
  scale: 'minor-second' | 'major-second' | 'minor-third' | 'major-third' | 'perfect-fourth' | 'golden-ratio';
  rhythm: number; // base line height
}

export interface FontLoadingState {
  status: 'idle' | 'loading' | 'loaded' | 'error';
  loadedFonts: Set<string>;
  failedFonts: Set<string>;
  loadingFonts: Set<string>;
}

export interface FontSystemContextType {
  // Font state
  availableFonts: GoogleFont[];
  loadingState: FontLoadingState;
  
  // Current typography
  currentTypography: TypographySettings;
  
  // Font operations
  loadFont: (fontFamily: string, weights?: FontWeight[]) => Promise<void>;
  updateTypography: (settings: Partial<TypographySettings>) => void;
  applyFontPairing: (pairing: FontPairing) => void;
  resetTypography: () => void;
  
  // Preview
  previewFont: (fontFamily: string, target: 'heading' | 'body') => void;
  clearPreview: () => void;
  
  // Utility
  getFontUrl: (fontFamily: string, weights?: FontWeight[]) => string;
  isFontLoaded: (fontFamily: string) => boolean;
  getTypographyCSS: () => Record<string, string>;
}

// Typography scales for consistent sizing
export const TYPOGRAPHY_SCALES = {
  'minor-second': 1.067,
  'major-second': 1.125,
  'minor-third': 1.200,
  'major-third': 1.250,
  'perfect-fourth': 1.333,
  'golden-ratio': 1.618,
} as const;

// Default typography settings
export const DEFAULT_TYPOGRAPHY: TypographySettings = {
  headingFont: {
    family: 'Inter',
    weight: 600,
    size: {
      h1: 2.25, // 36px at 16px base
      h2: 1.875, // 30px
      h3: 1.5,   // 24px
      h4: 1.25,  // 20px
    },
    lineHeight: 1.2,
    letterSpacing: -0.025,
    fallback: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  bodyFont: {
    family: 'Inter',
    weight: 400,
    size: 1, // 16px base
    lineHeight: 1.6,
    letterSpacing: 0,
    fallback: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  scale: 'major-third',
  rhythm: 1.5,
};

// Font loading optimization
export interface FontLoadOptions {
  display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload: boolean;
  subset: string[];
}

export const DEFAULT_FONT_OPTIONS: FontLoadOptions = {
  display: 'swap',
  preload: true,
  subset: ['latin'],
};

// Professional font categories for filtering
export const FONT_CATEGORIES = {
  professional: {
    label: 'Professional',
    description: 'Clean, readable fonts perfect for business',
    filters: ['sans-serif', 'serif'],
    tags: ['professional', 'business', 'clean', 'readable']
  },
  creative: {
    label: 'Creative',
    description: 'Expressive fonts for creative industries',
    filters: ['display', 'handwriting'],
    tags: ['creative', 'artistic', 'unique', 'expressive']
  },
  modern: {
    label: 'Modern',
    description: 'Contemporary fonts with clean lines',
    filters: ['sans-serif'],
    tags: ['modern', 'minimal', 'geometric', 'clean']
  },
  elegant: {
    label: 'Elegant',
    description: 'Sophisticated serif fonts',
    filters: ['serif'],
    tags: ['elegant', 'sophisticated', 'traditional', 'formal']
  },
  technical: {
    label: 'Technical',
    description: 'Monospace fonts for developers',
    filters: ['monospace'],
    tags: ['technical', 'coding', 'monospace', 'developer']
  }
} as const;

export type FontCategoryKey = keyof typeof FONT_CATEGORIES;
