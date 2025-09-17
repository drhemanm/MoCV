// src/components/CVBuilder/ColorSystem/colorUtils.ts
import { Color, HSLColor, RGBColor, ColorHarmony, AccessibilityReport, WCAG_REQUIREMENTS, COLOR_HARMONY_TYPES } from './types';

/**
 * Convert HEX color to RGB
 */
export const hexToRgb = (hex: string): RGBColor => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
};

/**
 * Convert RGB color to HEX
 */
export const rgbToHex = (rgb: RGBColor): string => {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
};

/**
 * Convert RGB to HSL
 */
export const rgbToHsl = (rgb: RGBColor): HSLColor => {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

/**
 * Convert HSL to RGB
 */
export const hslToRgb = (hsl: HSLColor): RGBColor => {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

/**
 * Create a complete Color object from any format
 */
export const createColor = (input: string | RGBColor | HSLColor, name?: string): Color => {
  let hex: string;
  let rgb: RGBColor;
  let hsl: HSLColor;

  if (typeof input === 'string') {
    hex = input.startsWith('#') ? input : `#${input}`;
    rgb = hexToRgb(hex);
    hsl = rgbToHsl(rgb);
  } else if ('r' in input) {
    rgb = input;
    hex = rgbToHex(rgb);
    hsl = rgbToHsl(rgb);
  } else {
    hsl = input;
    rgb = hslToRgb(hsl);
    hex = rgbToHex(rgb);
  }

  return { hex, rgb, hsl, name };
};

/**
 * Calculate luminance of a color (for contrast calculations)
 */
export const getLuminance = (color: Color): number => {
  const { r, g, b } = color.rgb;
  
  const srgb = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
};

/**
 * Calculate contrast ratio between two colors
 */
export const getContrastRatio = (color1: Color, color2: Color): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Check WCAG accessibility compliance
 */
export const checkAccessibility = (foreground: Color, background: Color): AccessibilityReport => {
  const contrastRatio = getContrastRatio(foreground, background);
  
  const meetsAA = contrastRatio >= WCAG_REQUIREMENTS.AA.normal;
  const meetsAAA = contrastRatio >= WCAG_REQUIREMENTS.AAA.normal;
  
  const recommendations: string[] = [];
  
  if (!meetsAA) {
    recommendations.push('Increase contrast for better readability');
    recommendations.push(`Current ratio: ${contrastRatio.toFixed(2)}, need: ${WCAG_REQUIREMENTS.AA.normal}`);
  }
  
  if (meetsAA && !meetsAAA) {
    recommendations.push('Consider increasing contrast for AAA compliance');
  }
  
  return {
    isAccessible: meetsAA,
    contrastRatio: parseFloat(contrastRatio.toFixed(2)),
    wcagLevel: meetsAAA ? 'AAA' : meetsAA ? 'AA' : 'fail',
    recommendations
  };
};

/**
 * Lighten a color by adjusting lightness
 */
export const lightenColor = (color: Color, amount: number): Color => {
  const newHsl = {
    ...color.hsl,
    l: Math.min(100, color.hsl.l + amount)
  };
  
  return createColor(newHsl);
};

/**
 * Darken a color by adjusting lightness
 */
export const darkenColor = (color: Color, amount: number): Color => {
  const newHsl = {
    ...color.hsl,
    l: Math.max(0, color.hsl.l - amount)
  };
  
  return createColor(newHsl);
};

/**
 * Adjust color saturation
 */
export const adjustSaturation = (color: Color, amount: number): Color => {
  const newHsl = {
    ...color.hsl,
    s: Math.max(0, Math.min(100, color.hsl.s + amount))
  };
  
  return createColor(newHsl);
};

/**
 * Adjust color hue
 */
export const adjustHue = (color: Color, amount: number): Color => {
  const newHsl = {
    ...color.hsl,
    h: (color.hsl.h + amount + 360) % 360
  };
  
  return createColor(newHsl);
};

/**
 * Generate color harmony based on color theory
 */
export const generateColorHarmony = (baseColor: Color, type: ColorHarmony['type']): ColorHarmony => {
  const harmonyConfig = COLOR_HARMONY_TYPES[type];
  const colors: Color[] = [];
  
  switch (type) {
    case 'monochromatic':
      colors.push(baseColor);
      colors.push(lightenColor(baseColor, 20));
      colors.push(darkenColor(baseColor, 20));
      colors.push(adjustSaturation(baseColor, -30));
      break;
      
    case 'analogous':
      colors.push(baseColor);
      colors.push(adjustHue(baseColor, 30));
      colors.push(adjustHue(baseColor, -30));
      break;
      
    case 'complementary':
      colors.push(baseColor);
      colors.push(adjustHue(baseColor, 180));
      break;
      
    case 'triadic':
      colors.push(baseColor);
      colors.push(adjustHue(baseColor, 120));
      colors.push(adjustHue(baseColor, 240));
      break;
      
    case 'tetradic':
      colors.push(baseColor);
      colors.push(adjustHue(baseColor, 90));
      colors.push(adjustHue(baseColor, 180));
      colors.push(adjustHue(baseColor, 270));
      break;
      
    case 'split-complementary':
      colors.push(baseColor);
      colors.push(adjustHue(baseColor, 150));
      colors.push(adjustHue(baseColor, 210));
      break;
  }
  
  return {
    type,
    colors,
    description: harmonyConfig.description
  };
};

/**
 * Generate neutral color scale from a base color
 */
export const generateNeutralScale = (baseColor: Color): Record<string, Color> => {
  const scale: Record<string, Color> = {};
  
  // Desaturate the base color for neutrals
  const neutralBase = adjustSaturation(baseColor, -70);
  
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const lightnesses = [95, 90, 80, 65, 50, 40, 30, 20, 15, 10];
  
  stops.forEach((stop, index) => {
    scale[stop.toString()] = createColor({
      ...neutralBase.hsl,
      l: lightnesses[index]
    });
  });
  
  return scale;
};

/**
 * Extract dominant colors from image data
 */
export const extractDominantColors = (imageData: ImageData, colorCount: number = 5): Color[] => {
  const pixels = imageData.data;
  const colorMap = new Map<string, number>();
  
  // Sample every 4th pixel for performance
  for (let i = 0; i < pixels.length; i += 16) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    // Skip transparent pixels
    if (a < 128) continue;
    
    // Round to reduce color variations
    const roundedR = Math.round(r / 10) * 10;
    const roundedG = Math.round(g / 10) * 10;
    const roundedB = Math.round(b / 10) * 10;
    
    const colorKey = `${roundedR},${roundedG},${roundedB}`;
    colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
  }
  
  // Sort by frequency and take top colors
  const sortedColors = Array.from(colorMap.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, colorCount)
    .map(([colorKey]) => {
      const [r, g, b] = colorKey.split(',').map(Number);
      return createColor({ r, g, b });
    });
  
  return sortedColors;
};

/**
 * Check if a color is light or dark
 */
export const isLightColor = (color: Color): boolean => {
  return getLuminance(color) > 0.5;
};

/**
 * Get readable text color for a background
 */
export const getReadableTextColor = (backgroundColor: Color): Color => {
  const isLight = isLightColor(backgroundColor);
  return createColor(isLight ? '#000000' : '#FFFFFF');
};

/**
 * Generate accessible color variations
 */
export const generateAccessibleColors = (baseColor: Color): Color[] => {
  const variations: Color[] = [];
  
  // Generate lighter and darker versions until we get good contrast
  for (let i = 10; i <= 90; i += 10) {
    const lighter = createColor({ ...baseColor.hsl, l: i });
    const contrastRatio = getContrastRatio(lighter, baseColor);
    
    if (contrastRatio >= WCAG_REQUIREMENTS.AA.normal) {
      variations.push(lighter);
    }
  }
  
  return variations;
};

/**
 * Convert color palette to CSS custom properties
 */
export const paletteToCSS = (palette: any): Record<string, string> => {
  const cssVars: Record<string, string> = {};
  
  const flattenColors = (obj: any, prefix = ''): void => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && 'hex' in value) {
        // It's a Color object
        cssVars[`--${prefix}${key}`] = (value as Color).hex;
      } else if (typeof value === 'object' && value !== null) {
        // It's a nested object
        flattenColors(value, `${prefix}${key}-`);
      }
    });
  };
  
  flattenColors(palette);
  return cssVars;
};

/**
 * Parse CSS color string to Color object
 */
export const parseColorString = (colorString: string): Color | null => {
  try {
    // Handle hex colors
    if (colorString.startsWith('#')) {
      return createColor(colorString);
    }
    
    // Handle rgb/rgba colors
    const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      return createColor({
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      });
    }
    
    // Handle hsl/hsla colors
    const hslMatch = colorString.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/);
    if (hslMatch) {
      return createColor({
        h: parseInt(hslMatch[1]),
        s: parseInt(hslMatch[2]),
        l: parseInt(hslMatch[3])
      });
    }
    
    return null;
  } catch {
    return null;
  }
};
