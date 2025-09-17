// src/components/CVBuilder/FontSystem/fontData.ts
import { GoogleFont, FontPairing } from './types';

// Curated professional Google Fonts for CVs
export const PROFESSIONAL_FONTS: GoogleFont[] = [
  // Sans-Serif - Professional
  {
    family: 'Inter',
    category: 'sans-serif',
    variants: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 95,
    tags: ['professional', 'modern', 'clean', 'versatile'],
    description: 'Designed specifically for computer screens',
    previewText: 'Inter is a typeface carefully crafted for computer screens.'
  },
  {
    family: 'Open Sans',
    category: 'sans-serif',
    variants: [300, 400, 500, 600, 700, 800],
    subsets: ['latin', 'latin-ext'],
    popularity: 92,
    tags: ['friendly', 'readable', 'neutral'],
    description: 'Humanist sans serif with excellent readability'
  },
  {
    family: 'Roboto',
    category: 'sans-serif',
    variants: [100, 300, 400, 500, 700, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 90,
    tags: ['modern', 'geometric', 'google'],
    description: 'Modern, friendly, and approachable'
  },
  {
    family: 'Poppins',
    category: 'sans-serif',
    variants: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 88,
    tags: ['geometric', 'friendly', 'rounded'],
    description: 'Geometric sans serif with rounded characters'
  },
  {
    family: 'Source Sans Pro',
    category: 'sans-serif',
    variants: [200, 300, 400, 600, 700, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 85,
    tags: ['professional', 'adobe', 'clean'],
    description: 'Adobe\'s first open source typeface family'
  },
  {
    family: 'Lato',
    category: 'sans-serif',
    variants: [100, 300, 400, 700, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 87,
    tags: ['humanist', 'warm', 'friendly'],
    description: 'Humanist typeface with warm characteristics'
  },
  {
    family: 'Montserrat',
    category: 'sans-serif',
    variants: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 89,
    tags: ['urban', 'modern', 'geometric'],
    description: 'Urban typeface inspired by Buenos Aires'
  },
  {
    family: 'Nunito Sans',
    category: 'sans-serif',
    variants: [200, 300, 400, 600, 700, 800, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 82,
    tags: ['rounded', 'friendly', 'approachable'],
    description: 'Well-balanced typeface with rounded characters'
  },
  {
    family: 'Work Sans',
    category: 'sans-serif',
    variants: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 80,
    tags: ['optimized', 'screen', 'middle-sized'],
    description: 'Optimized for work environments'
  },
  {
    family: 'IBM Plex Sans',
    category: 'sans-serif',
    variants: [100, 200, 300, 400, 500, 600, 700],
    subsets: ['latin', 'latin-ext'],
    popularity: 78,
    tags: ['corporate', 'technical', 'neutral'],
    description: 'IBM\'s signature typeface'
  },

  // Serif - Professional
  {
    family: 'Playfair Display',
    category: 'serif',
    variants: [400, 500, 600, 700, 800, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 85,
    tags: ['elegant', 'high-contrast', 'display'],
    description: 'High-contrast serif for headlines'
  },
  {
    family: 'Merriweather',
    category: 'serif',
    variants: [300, 400, 700, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 83,
    tags: ['readable', 'pleasant', 'screens'],
    description: 'Designed to be pleasant to read on screens'
  },
  {
    family: 'Libre Baskerville',
    category: 'serif',
    variants: [400, 700],
    subsets: ['latin', 'latin-ext'],
    popularity: 79,
    tags: ['classic', 'traditional', 'books'],
    description: 'Based on the American Type Founder\'s Baskerville'
  },
  {
    family: 'Crimson Text',
    category: 'serif',
    variants: [400, 600, 700],
    subsets: ['latin', 'latin-ext'],
    popularity: 76,
    tags: ['book', 'academic', 'traditional'],
    description: 'Inspired by old-style serif fonts'
  },
  {
    family: 'Lora',
    category: 'serif',
    variants: [400, 500, 600, 700],
    subsets: ['latin', 'latin-ext'],
    popularity: 81,
    tags: ['calligraphic', 'contemporary', 'brush'],
    description: 'Contemporary serif with calligraphic roots'
  },
  {
    family: 'Source Serif Pro',
    category: 'serif',
    variants: [200, 300, 400, 600, 700, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 77,
    tags: ['adobe', 'complement', 'source-sans'],
    description: 'Complement to Source Sans Pro'
  },

  // Display - Creative
  {
    family: 'Oswald',
    category: 'sans-serif',
    variants: [200, 300, 400, 500, 600, 700],
    subsets: ['latin', 'latin-ext'],
    popularity: 84,
    tags: ['condensed', 'gothic', 'headlines'],
    description: 'Reworking of the classic gothic typeface'
  },
  {
    family: 'Raleway',
    category: 'sans-serif',
    variants: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 86,
    tags: ['elegant', 'sophisticated', 'thin'],
    description: 'Elegant sans-serif with thin weight options'
  },

  // Monospace - Technical
  {
    family: 'JetBrains Mono',
    category: 'monospace',
    variants: [100, 200, 300, 400, 500, 600, 700, 800],
    subsets: ['latin', 'latin-ext'],
    popularity: 75,
    tags: ['coding', 'programming', 'developers'],
    description: 'Typeface for developers'
  },
  {
    family: 'Fira Code',
    category: 'monospace',
    variants: [300, 400, 500, 600, 700],
    subsets: ['latin', 'latin-ext'],
    popularity: 73,
    tags: ['programming', 'ligatures', 'coding'],
    description: 'Monospaced font with programming ligatures'
  },
  {
    family: 'Source Code Pro',
    category: 'monospace',
    variants: [200, 300, 400, 500, 600, 700, 900],
    subsets: ['latin', 'latin-ext'],
    popularity: 72,
    tags: ['adobe', 'coding', 'programming'],
    description: 'Monospaced font family for coding environments'
  }
];

// Professional font pairings curated for CVs
export const FONT_PAIRINGS: FontPairing[] = [
  // Professional Pairings
  {
    id: 'inter-inter',
    name: 'Inter Harmony',
    description: 'Clean and modern with Inter for both headings and body',
    category: 'professional',
    heading: {
      family: 'Inter',
      weight: 600,
      fallback: '-apple-system, BlinkMacSystemFont, sans-serif'
    },
    body: {
      family: 'Inter',
      weight: 400,
      fallback: '-apple-system, BlinkMacSystemFont, sans-serif'
    },
    popularity: 95,
    tags: ['modern', 'clean', 'versatile', 'tech']
  },
  {
    id: 'montserrat-opensans',
    name: 'Professional Balance',
    description: 'Strong Montserrat headings with readable Open Sans body',
    category: 'professional',
    heading: {
      family: 'Montserrat',
      weight: 600,
      fallback: 'sans-serif'
    },
    body: {
      family: 'Open Sans',
      weight: 400,
      fallback: 'sans-serif'
    },
    popularity: 90,
    tags: ['balanced', 'readable', 'professional']
  },
  {
    id: 'playfair-source',
    name: 'Editorial Elegance',
    description: 'Elegant Playfair Display with clean Source Sans Pro',
    category: 'elegant',
    heading: {
      family: 'Playfair Display',
      weight: 600,
      fallback: 'serif'
    },
    body: {
      family: 'Source Sans Pro',
      weight: 400,
      fallback: 'sans-serif'
    },
    popularity: 88,
    tags: ['elegant', 'sophisticated', 'editorial']
  },
  {
    id: 'poppins-lato',
    name: 'Friendly Professional',
    description: 'Approachable Poppins with warm Lato body text',
    category: 'modern',
    heading: {
      family: 'Poppins',
      weight: 600,
      fallback: 'sans-serif'
    },
    body: {
      family: 'Lato',
      weight: 400,
      fallback: 'sans-serif'
    },
    popularity: 85,
    tags: ['friendly', 'approachable', 'modern']
  },
  {
    id: 'oswald-opensans',
    name: 'Strong & Readable',
    description: 'Bold Oswald headings with readable Open Sans',
    category: 'modern',
    heading: {
      family: 'Oswald',
      weight: 500,
      fallback: 'sans-serif'
    },
    body: {
      family: 'Open Sans',
      weight: 400,
      fallback: 'sans-serif'
    },
    popularity: 82,
    tags: ['strong', 'modern', 'impact']
  },
  {
    id: 'raleway-merriweather',
    name: 'Sophisticated Mix',
    description: 'Elegant Raleway with traditional Merriweather',
    category: 'elegant',
    heading: {
      family: 'Raleway',
      weight: 500,
      fallback: 'sans-serif'
    },
    body: {
      family: 'Merriweather',
      weight: 400,
      fallback: 'serif'
    },
    popularity: 80,
    tags: ['sophisticated', 'traditional', 'elegant']
  },
  {
    id: 'work-nunito',
    name: 'Corporate Friendly',
    description: 'Professional Work Sans with friendly Nunito Sans',
    category: 'professional',
    heading: {
      family: 'Work Sans',
      weight: 600,
      fallback: 'sans-serif'
    },
    body: {
      family: 'Nunito Sans',
      weight: 400,
      fallback: 'sans-serif'
    },
    popularity: 78,
    tags: ['corporate', 'friendly', 'balanced']
  },
  {
    id: 'ibm-source',
    name: 'Tech Professional',
    description: 'IBM Plex Sans with Source Sans Pro for tech roles',
    category: 'professional',
    heading: {
      family: 'IBM Plex Sans',
      weight: 600,
      fallback: 'sans-serif'
    },
    body: {
      family: 'Source Sans Pro',
      weight: 400,
      fallback: 'sans-serif'
    },
    popularity: 75,
    tags: ['tech', 'corporate', 'neutral']
  },
  {
    id: 'lora-opensans',
    name: 'Classic Modern',
    description: 'Classic Lora headings with modern Open Sans body',
    category: 'elegant',
    heading: {
      family: 'Lora',
      weight: 600,
      fallback: 'serif'
    },
    body: {
      family: 'Open Sans',
      weight: 400,
      fallback: 'sans-serif'
    },
    popularity: 77,
    tags: ['classic', 'readable', 'balanced']
  },
  {
    id: 'crimson-source',
    name: 'Academic Professional',
    description: 'Traditional Crimson Text with clean Source Sans Pro',
    category: 'elegant',
    heading: {
      family: 'Crimson Text',
      weight: 600,
      fallback: 'serif'
    },
    body: {
      family: 'Source Sans Pro',
      weight: 400,
      fallback: 'sans-serif'
    },
    popularity: 73,
    tags: ['academic', 'traditional', 'professional']
  }
];

// Font suggestions based on industry
export const INDUSTRY_FONT_RECOMMENDATIONS = {
  technology: ['Inter', 'Roboto', 'Source Sans Pro', 'IBM Plex Sans'],
  finance: ['Montserrat', 'Open Sans', 'Source Sans Pro', 'Work Sans'],
  creative: ['Poppins', 'Raleway', 'Playfair Display', 'Lora'],
  legal: ['Crimson Text', 'Merriweather', 'Libre Baskerville', 'Source Serif Pro'],
  healthcare: ['Open Sans', 'Lato', 'Source Sans Pro', 'Nunito Sans'],
  education: ['Merriweather', 'Lora', 'Open Sans', 'Source Sans Pro'],
  consulting: ['Inter', 'Montserrat', 'Work Sans', 'IBM Plex Sans'],
  marketing: ['Poppins', 'Raleway', 'Montserrat', 'Open Sans'],
  engineering: ['Roboto', 'Source Sans Pro', 'IBM Plex Sans', 'Work Sans'],
  design: ['Raleway', 'Poppins', 'Playfair Display', 'Oswald']
} as const;

// Most popular pairings by category
export const POPULAR_PAIRINGS_BY_CATEGORY = {
  professional: ['inter-inter', 'montserrat-opensans', 'work-nunito', 'ibm-source'],
  creative: ['poppins-lato', 'raleway-merriweather', 'oswald-opensans'],
  modern: ['inter-inter', 'poppins-lato', 'oswald-opensans', 'work-nunito'],
  elegant: ['playfair-source', 'raleway-merriweather', 'lora-opensans', 'crimson-source'],
  minimal: ['inter-inter', 'work-nunito', 'ibm-source']
} as const;

// Google Fonts API helper
export const getGoogleFontsUrl = (fonts: string[], weights: number[] = [400]): string => {
  const fontParams = fonts.map(font => {
    const weightString = weights.join(',');
    return `${font.replace(' ', '+')}:wght@${weightString}`;
  }).join('&family=');
  
  return `https://fonts.googleapis.com/css2?family=${fontParams}&display=swap`;
};

// Font loading performance optimization
export const FONT_LOADING_STRATEGY = {
  critical: ['Inter', 'Open Sans', 'Roboto'], // Load immediately
  important: ['Montserrat', 'Poppins', 'Lato'], // Load after critical
  optional: ['Playfair Display', 'Oswald', 'Raleway'] // Load on demand
} as const;
