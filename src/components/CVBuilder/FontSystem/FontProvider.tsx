// src/components/CVBuilder/FontSystem/FontProvider.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  FontSystemContextType,
  TypographySettings,
  FontLoadingState,
  GoogleFont,
  FontPairing,
  FontWeight,
  DEFAULT_TYPOGRAPHY,
  TYPOGRAPHY_SCALES
} from './types';
import { PROFESSIONAL_FONTS, getGoogleFontsUrl, FONT_LOADING_STRATEGY } from './fontData';
import { useStyleSystem } from '../StyleSystem/ThemeProvider';

const FontSystemContext = createContext<FontSystemContextType | undefined>(undefined);

export const useFontSystem = (): FontSystemContextType => {
  const context = useContext(FontSystemContext);
  if (!context) {
    throw new Error('useFontSystem must be used within a FontProvider');
  }
  return context;
};

interface FontProviderProps {
  children: ReactNode;
  preloadCriticalFonts?: boolean;
  enableFontDisplay?: boolean;
}

export const FontProvider: React.FC<FontProviderProps> = ({
  children,
  preloadCriticalFonts = true,
  enableFontDisplay = true
}) => {
  const { currentTheme, customizeTheme } = useStyleSystem();
  
  const [currentTypography, setCurrentTypography] = useState<TypographySettings>(DEFAULT_TYPOGRAPHY);
  const [loadingState, setLoadingState] = useState<FontLoadingState>({
    status: 'idle',
    loadedFonts: new Set(),
    failedFonts: new Set(),
    loadingFonts: new Set()
  });

  // Preload critical fonts on mount
  useEffect(() => {
    if (preloadCriticalFonts) {
      FONT_LOADING_STRATEGY.critical.forEach(fontFamily => {
        loadFont(fontFamily, [400, 500, 600, 700]);
      });
    }
  }, [preloadCriticalFonts]);

  // Update theme typography when typography changes
  useEffect(() => {
    if (enableFontDisplay) {
      customizeTheme({
        typography: {
          fontFamily: {
            heading: `'${currentTypography.headingFont.family}', ${currentTypography.headingFont.fallback}`,
            body: `'${currentTypography.bodyFont.family}', ${currentTypography.bodyFont.fallback}`,
            mono: currentTheme.typography.fontFamily.mono
          },
          fontSize: {
            xs: `${currentTypography.bodyFont.size * 0.75}rem`,
            sm: `${currentTypography.bodyFont.size * 0.875}rem`,
            base: `${currentTypography.bodyFont.size}rem`,
            lg: `${currentTypography.bodyFont.size * 1.125}rem`,
            xl: `${currentTypography.headingFont.size.h4}rem`,
            '2xl': `${currentTypography.headingFont.size.h3}rem`,
            '3xl': `${currentTypography.headingFont.size.h2}rem`,
            '4xl': `${currentTypography.headingFont.size.h1}rem`
          },
          fontWeight: {
            light: 300,
            normal: currentTypography.bodyFont.weight,
            medium: 500,
            semibold: currentTypography.headingFont.weight,
            bold: 700
          },
          lineHeight: {
            tight: currentTypography.headingFont.lineHeight,
            normal: currentTypography.bodyFont.lineHeight,
            relaxed: currentTypography.rhythm
          }
        }
      });
    }
  }, [currentTypography, enableFontDisplay, customizeTheme, currentTheme]);

  const loadFont = useCallback(async (fontFamily: string, weights: FontWeight[] = [400]): Promise<void> => {
    // Check if font is already loaded
    if (loadingState.loadedFonts.has(fontFamily)) {
      return Promise.resolve();
    }

    // Check if font is currently loading
    if (loadingState.loadingFonts.has(fontFamily)) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (loadingState.loadedFonts.has(fontFamily)) {
            resolve();
          } else if (loadingState.failedFonts.has(fontFamily)) {
            resolve(); // Resolve even on failure to prevent hanging
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    // Mark as loading
    setLoadingState(prev => ({
      ...prev,
      status: 'loading',
      loadingFonts: new Set([...prev.loadingFonts, fontFamily])
    }));

    try {
      // Create font face declarations
      const fontUrl = getGoogleFontsUrl([fontFamily], weights);
      
      // Load font using CSS
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      link.crossOrigin = 'anonymous';
      
      // Use font display swap for better performance
      if (enableFontDisplay) {
        link.href += '&display=swap';
      }

      // Add to document head
      document.head.appendChild(link);

      // Use Font Loading API if available
      if ('fonts' in document) {
        const fontFaces = weights.map(weight => 
          new FontFace(fontFamily, `url(${fontUrl})`, {
            weight: weight.toString(),
            display: 'swap'
          })
        );

        await Promise.all(
          fontFaces.map(async (fontFace) => {
            try {
              const loadedFace = await fontFace.load();
              (document.fonts as any).add(loadedFace);
              return loadedFace;
            } catch (error) {
              console.warn(`Failed to load font weight ${fontFace.weight} for ${fontFamily}:`, error);
              return null;
            }
          })
        );
      } else {
        // Fallback: wait for load event
        await new Promise((resolve, reject) => {
          link.onload = resolve;
          link.onerror = reject;
          setTimeout(reject, 10000); // 10 second timeout
        });
      }

      // Mark as loaded
      setLoadingState(prev => ({
        ...prev,
        status: 'loaded',
        loadedFonts: new Set([...prev.loadedFonts, fontFamily]),
        loadingFonts: new Set([...prev.loadingFonts].filter(f => f !== fontFamily))
      }));

    } catch (error) {
      console.error(`Failed to load font ${fontFamily}:`, error);
      
      // Mark as failed
      setLoadingState(prev => ({
        ...prev,
        status: 'error',
        failedFonts: new Set([...prev.failedFonts, fontFamily]),
        loadingFonts: new Set([...prev.loadingFonts].filter(f => f !== fontFamily))
      }));
    }
  }, [loadingState.loadedFonts, loadingState.loadingFonts, loadingState.failedFonts, enableFontDisplay]);

  const updateTypography = useCallback((settings: Partial<TypographySettings>) => {
    setCurrentTypography(prev => {
      const newSettings = { ...prev, ...settings };
      
      // Recalculate font sizes based on scale if scale changed
      if (settings.scale && settings.scale !== prev.scale) {
        const scale = TYPOGRAPHY_SCALES[settings.scale];
        const baseSize = newSettings.bodyFont.size;
        
        newSettings.headingFont.size = {
          h4: baseSize * scale,
          h3: baseSize * Math.pow(scale, 2),
          h2: baseSize * Math.pow(scale, 3),
          h1: baseSize * Math.pow(scale, 4)
        };
      }
      
      return newSettings;
    });

    // Load fonts if they're not already loaded
    if (settings.headingFont?.family) {
      loadFont(settings.headingFont.family, [300, 400, 500, 600, 700]);
    }
    if (settings.bodyFont?.family) {
      loadFont(settings.bodyFont.family, [300, 400, 500, 600, 700]);
    }
  }, [loadFont]);

  const applyFontPairing = useCallback((pairing: FontPairing) => {
    const newTypography: Partial<TypographySettings> = {
      headingFont: {
        ...currentTypography.headingFont,
        family: pairing.heading.family,
        weight: pairing.heading.weight,
        fallback: pairing.heading.fallback
      },
      bodyFont: {
        ...currentTypography.bodyFont,
        family: pairing.body.family,
        weight: pairing.body.weight,
        fallback: pairing.body.fallback
      }
    };

    updateTypography(newTypography);
  }, [currentTypography, updateTypography]);

  const resetTypography = useCallback(() => {
    setCurrentTypography({ ...DEFAULT_TYPOGRAPHY });
  }, []);

  const previewFont = useCallback((fontFamily: string, target: 'heading' | 'body') => {
    // Load the font for preview
    loadFont(fontFamily, [400, 600]);
    
    // Apply temporary preview
    const previewSettings: Partial<TypographySettings> = {};
    
    if (target === 'heading') {
      previewSettings.headingFont = {
        ...currentTypography.headingFont,
        family: fontFamily
      };
    } else {
      previewSettings.bodyFont = {
        ...currentTypography.bodyFont,
        family: fontFamily
      };
    }
    
    updateTypography(previewSettings);
  }, [loadFont, currentTypography, updateTypography]);

  const clearPreview = useCallback(() => {
    // Reset to last confirmed typography
    // This would need additional state management for proper preview/confirm workflow
    resetTypography();
  }, [resetTypography]);

  const getFontUrl = useCallback((fontFamily: string, weights: FontWeight[] = [400]) => {
    return getGoogleFontsUrl([fontFamily], weights);
  }, []);

  const isFontLoaded = useCallback((fontFamily: string) => {
    return loadingState.loadedFonts.has(fontFamily);
  }, [loadingState.loadedFonts]);

  const getTypographyCSS = useCallback(() => {
    return {
      '--cv-font-heading': `'${currentTypography.headingFont.family}', ${currentTypography.headingFont.fallback}`,
      '--cv-font-body': `'${currentTypography.bodyFont.family}', ${currentTypography.bodyFont.fallback}`,
      '--cv-text-xs': `${currentTypography.bodyFont.size * 0.75}rem`,
      '--cv-text-sm': `${currentTypography.bodyFont.size * 0.875}rem`,
      '--cv-text-base': `${currentTypography.bodyFont.size}rem`,
      '--cv-text-lg': `${currentTypography.bodyFont.size * 1.125}rem`,
      '--cv-text-xl': `${currentTypography.headingFont.size.h4}rem`,
      '--cv-text-2xl': `${currentTypography.headingFont.size.h3}rem`,
      '--cv-text-3xl': `${currentTypography.headingFont.size.h2}rem`,
      '--cv-text-4xl': `${currentTypography.headingFont.size.h1}rem`,
      '--cv-font-light': '300',
      '--cv-font-normal': currentTypography.bodyFont.weight.toString(),
      '--cv-font-medium': '500',
      '--cv-font-semibold': currentTypography.headingFont.weight.toString(),
      '--cv-font-bold': '700',
      '--cv-leading-tight': currentTypography.headingFont.lineHeight.toString(),
      '--cv-leading-normal': currentTypography.bodyFont.lineHeight.toString(),
      '--cv-leading-relaxed': currentTypography.rhythm.toString()
    };
  }, [currentTypography]);

  const contextValue: FontSystemContextType = {
    availableFonts: PROFESSIONAL_FONTS,
    loadingState,
    currentTypography,
    loadFont,
    updateTypography,
    applyFontPairing,
    resetTypography,
    previewFont,
    clearPreview,
    getFontUrl,
    isFontLoaded,
    getTypographyCSS
  };

  return (
    <FontSystemContext.Provider value={contextValue}>
      {children}
    </FontSystemContext.Provider>
  );
};

export default FontProvider;
