// src/components/CVBuilder/FontSystem/FontPairingSelector.tsx
import React, { useState, useMemo } from 'react';
import { Palette, Filter, Star, Check, Eye, Loader2 } from 'lucide-react';
import { FontPairing } from './types';
import { FONT_PAIRINGS, POPULAR_PAIRINGS_BY_CATEGORY, INDUSTRY_FONT_RECOMMENDATIONS } from './fontData';
import { useFontSystem } from './FontProvider';
import { useStyleSystem } from '../StyleSystem/ThemeProvider';

interface FontPairingSelectorProps {
  onPairingSelect: (pairing: FontPairing) => void;
  className?: string;
}

const FontPairingSelector: React.FC<FontPairingSelectorProps> = ({
  onPairingSelect,
  className = ''
}) => {
  const { currentTheme } = useStyleSystem();
  const { 
    currentTypography, 
    loadingState, 
    applyFontPairing, 
    loadFont, 
    isFontLoaded 
  } = useFontSystem();

  const [selectedCategory, setSelectedCategory] = useState<FontPairing['category'] | 'all'>('all');
  const [previewPairing, setPreviewPairing] = useState<string | null>(null);
  const [showIndustryRecommendations, setShowIndustryRecommendations] = useState(false);

  // Get current pairing ID for comparison
  const currentPairingId = useMemo(() => {
    return FONT_PAIRINGS.find(pairing => 
      pairing.heading.family === currentTypography.headingFont.family &&
      pairing.body.family === currentTypography.bodyFont.family
    )?.id || null;
  }, [currentTypography]);

  // Filter pairings by category
  const filteredPairings = useMemo(() => {
    let pairings = [...FONT_PAIRINGS];

    if (selectedCategory !== 'all') {
      pairings = pairings.filter(pairing => pairing.category === selectedCategory);
    }

    // Sort by popularity
    pairings.sort((a, b) => b.popularity - a.popularity);

    return pairings;
  }, [selectedCategory]);

  const handlePairingSelect = (pairing: FontPairing) => {
    applyFontPairing(pairing);
    onPairingSelect(pairing);
    setPreviewPairing(null);
  };

  const handlePreview = async (pairing: FontPairing) => {
    if (previewPairing === pairing.id) {
      setPreviewPairing(null);
      return;
    }

    setPreviewPairing(pairing.id);
    
    // Load fonts if not already loaded
    if (!isFontLoaded(pairing.heading.family)) {
      await loadFont(pairing.heading.family, [400, 600, 700]);
    }
    if (!isFontLoaded(pairing.body.family)) {
      await loadFont(pairing.body.family, [400, 500, 600]);
    }
  };

  const renderPairingItem = (pairing: FontPairing) => {
    const isSelected = pairing.id === currentPairingId;
    const isPreviewing = previewPairing === pairing.id;
    const isLoadingHeading = loadingState.loadingFonts.has(pairing.heading.family);
    const isLoadingBody = loadingState.loadingFonts.has(pairing.body.family);
    const isLoading = isLoadingHeading || isLoadingBody;
    const bothLoaded = isFontLoaded(pairing.heading.family) && isFontLoaded(pairing.body.family);

    return (
      <div
        key={pairing.id}
        className={`p-5 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2' : ''
        }`}
        style={{
          backgroundColor: isSelected ? 'var(--cv-color-surface)' : 'var(--cv-color-background)',
          borderColor: isSelected ? 'var(--cv-color-primary)' : 'var(--cv-color-border)',
          ringColor: isSelected ? 'var(--cv-color-primary)' : 'transparent'
        }}
      >
        {/* Pairing Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 
              className="font-semibold"
              style={{
                fontSize: 'var(--cv-text-base)',
                color: 'var(--cv-color-text-primary)'
              }}
            >
              {pairing.name}
            </h3>
            
            {isSelected && (
              <Check 
                className="h-4 w-4" 
                style={{ color: 'var(--cv-color-primary)' }}
              />
            )}
            
            {pairing.popularity > 85 && (
              <Star 
                className="h-3 w-3" 
                style={{ color: 'var(--cv-color-warning)' }}
                title="Highly recommended"
              />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePreview(pairing)}
              className="p-1 rounded hover:opacity-80"
              style={{ color: 'var(--cv-color-text-secondary)' }}
              title={isPreviewing ? 'Hide preview' : 'Show preview'}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className={`h-4 w-4 ${isPreviewing ? 'opacity-100' : 'opacity-60'}`} />
              )}
            </button>
            
            <button
              onClick={() => handlePairingSelect(pairing)}
              className="px-4 py-1 text-sm rounded transition-colors"
              style={{
                backgroundColor: isSelected ? 'var(--cv-color-primary)' : 'var(--cv-color-surface)',
                color: isSelected ? 'white' : 'var(--cv-color-text-primary)',
                border: `1px solid ${isSelected ? 'var(--cv-color-primary)' : 'var(--cv-color-border)'}`
              }}
            >
              {isSelected ? 'Applied' : 'Apply'}
            </button>
          </div>
        </div>

        {/* Pairing Info */}
        <div className="flex items-center gap-4 mb-3">
          <span 
            className="px-2 py-1 text-xs rounded capitalize"
            style={{
              backgroundColor: 'var(--cv-color-background)',
              color: 'var(--cv-color-text-secondary)',
              border: `1px solid var(--cv-color-border)`
            }}
          >
            {pairing.category}
          </span>
          
          <span 
            className="text-xs"
            style={{ color: 'var(--cv-color-text-muted)' }}
          >
            {pairing.popularity}% recommended
          </span>
        </div>

        {/* Description */}
        <p 
          className="text-sm mb-4"
          style={{ color: 'var(--cv-color-text-secondary)' }}
        >
          {pairing.description}
        </p>

        {/* Font Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'var(--cv-color-text-secondary)' }}>
              Heading:
            </span>
            <span 
              style={{ 
                color: 'var(--cv-color-text-primary)',
                fontFamily: bothLoaded ? `'${pairing.heading.family}', ${pairing.heading.fallback}` : 'inherit',
                fontWeight: pairing.heading.weight
              }}
            >
              {pairing.heading.family} {pairing.heading.weight}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'var(--cv-color-text-secondary)' }}>
              Body:
            </span>
            <span 
              style={{ 
                color: 'var(--cv-color-text-primary)',
                fontFamily: bothLoaded ? `'${pairing.body.family}', ${pairing.body.fallback}` : 'inherit',
                fontWeight: pairing.body.weight
              }}
            >
              {pairing.body.family} {pairing.body.weight}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {pairing.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs rounded"
              style={{
                backgroundColor: 'var(--cv-color-surface)',
                color: 'var(--cv-color-text-muted)',
                border: `1px solid var(--cv-color-border)`
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Live Preview */}
        {(isPreviewing || isSelected) && bothLoaded && (
          <div 
            className="p-4 rounded border space-y-3"
            style={{
              backgroundColor: 'var(--cv-color-background)',
              borderColor: 'var(--cv-color-border)'
            }}
          >
            {/* Heading Preview */}
            <div>
              <h4 
                style={{
                  fontFamily: `'${pairing.heading.family}', ${pairing.heading.fallback}`,
                  fontWeight: pairing.heading.weight,
                  fontSize: 'var(--cv-text-xl)',
                  color: 'var(--cv-color-text-primary)',
                  lineHeight: 'var(--cv-leading-tight)',
                  marginBottom: '8px'
                }}
              >
                Senior Software Engineer
              </h4>
              
              {/* Body Preview */}
              <p 
                style={{
                  fontFamily: `'${pairing.body.family}', ${pairing.body.fallback}`,
                  fontWeight: pairing.body.weight,
                  fontSize: 'var(--cv-text-sm)',
                  color: 'var(--cv-color-text-secondary)',
                  lineHeight: 'var(--cv-leading-normal)'
                }}
              >
                Experienced software developer with expertise in React, TypeScript, and Node.js. 
                Passionate about creating user-friendly applications and leading development teams.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderIndustryRecommendations = () => {
    if (!showIndustryRecommendations) return null;

    return (
      <div 
        className="mb-6 p-4 rounded-lg border"
        style={{
          backgroundColor: 'var(--cv-color-surface)',
          borderColor: 'var(--cv-color-border)'
        }}
      >
        <h3 
          className="font-semibold mb-3"
          style={{
            fontSize: 'var(--cv-text-base)',
            color: 'var(--cv-color-text-primary)'
          }}
        >
          Industry Recommendations
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(INDUSTRY_FONT_RECOMMENDATIONS).map(([industry, fonts]) => (
            <div key={industry} className="text-sm">
              <div 
                className="font-medium capitalize mb-1"
                style={{ color: 'var(--cv-color-text-primary)' }}
              >
                {industry}
              </div>
              <div 
                className="text-xs"
                style={{ color: 'var(--cv-color-text-secondary)' }}
              >
                {fonts.slice(0, 2).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`font-pairing-selector ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Palette 
            className="h-5 w-5" 
            style={{ color: 'var(--cv-color-primary)' }}
          />
          <h2 
            className="font-semibold"
            style={{
              fontSize: 'var(--cv-text-lg)',
              color: 'var(--cv-color-text-primary)'
            }}
          >
            Font Pairings
          </h2>
        </div>
        
        <button
          onClick={() => setShowIndustryRecommendations(!showIndustryRecommendations)}
          className="text-sm px-3 py-1 rounded transition-colors"
          style={{
            backgroundColor: showIndustryRecommendations ? 'var(--cv-color-primary)' : 'var(--cv-color-surface)',
            color: showIndustryRecommendations ? 'white' : 'var(--cv-color-text-primary)',
            border: `1px solid var(--cv-color-border)`
          }}
        >
          Industry Guide
        </button>
      </div>

      {/* Industry Recommendations */}
      {renderIndustryRecommendations()}

      {/* Category Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" style={{ color: 'var(--cv-color-text-secondary)' }} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as FontPairing['category'] | 'all')}
            className="px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--cv-color-background)',
              borderColor: 'var(--cv-color-border)',
              color: 'var(--cv-color-text-primary)'
            }}
          >
            <option value="all">All Categories</option>
            <option value="professional">Professional</option>
            <option value="creative">Creative</option>
            <option value="modern">Modern</option>
            <option value="elegant">Elegant</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>

        <span 
          className="text-sm"
          style={{ color: 'var(--cv-color-text-secondary)' }}
        >
          {filteredPairings.length} pairings available
        </span>
      </div>

      {/* Pairing List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredPairings.length > 0 ? (
          filteredPairings.map(renderPairingItem)
        ) : (
          <div 
            className="text-center py-8"
            style={{ color: 'var(--cv-color-text-muted)' }}
          >
            <Palette className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No font pairings found</p>
            <p className="text-sm mt-1">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FontPairingSelector;
