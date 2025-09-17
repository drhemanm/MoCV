// src/components/CVBuilder/FontSystem/FontSelector.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Type, Filter, Loader2, Check, Eye, Star } from 'lucide-react';
import { GoogleFont, FontCategoryKey, FONT_CATEGORIES } from './types';
import { useFontSystem } from './FontProvider';
import { useStyleSystem } from '../StyleSystem/ThemeProvider';

interface FontSelectorProps {
  target: 'heading' | 'body';
  onFontSelect: (fontFamily: string) => void;
  className?: string;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  target,
  onFontSelect,
  className = ''
}) => {
  const { currentTheme } = useStyleSystem();
  const { 
    availableFonts, 
    loadingState, 
    currentTypography, 
    loadFont, 
    previewFont,
    isFontLoaded 
  } = useFontSystem();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FontCategoryKey | 'all'>('all');
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popularity' | 'name'>('popularity');

  // Get current font family for the target
  const currentFontFamily = target === 'heading' 
    ? currentTypography.headingFont.family 
    : currentTypography.bodyFont.family;

  // Filter and sort fonts
  const filteredFonts = useMemo(() => {
    let fonts = [...availableFonts];

    // Filter by search query
    if (searchQuery) {
      fonts = fonts.filter(font =>
        font.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
        font.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        font.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryConfig = FONT_CATEGORIES[selectedCategory];
      fonts = fonts.filter(font => {
        const matchesCategory = categoryConfig.filters.includes(font.category);
        const matchesTags = categoryConfig.tags.some(tag => 
          font.tags.includes(tag)
        );
        return matchesCategory || matchesTags;
      });
    }

    // Sort fonts
    fonts.sort((a, b) => {
      if (sortBy === 'popularity') {
        return b.popularity - a.popularity;
      } else {
        return a.family.localeCompare(b.family);
      }
    });

    return fonts;
  }, [availableFonts, searchQuery, selectedCategory, sortBy]);

  const handleFontSelect = (fontFamily: string) => {
    onFontSelect(fontFamily);
    setShowPreview(null);
  };

  const handlePreview = (fontFamily: string) => {
    if (showPreview === fontFamily) {
      setShowPreview(null);
      return;
    }
    
    setShowPreview(fontFamily);
    if (!isFontLoaded(fontFamily)) {
      loadFont(fontFamily, [400, 600]);
    }
  };

  const renderFontItem = (font: GoogleFont) => {
    const isSelected = font.family === currentFontFamily;
    const isLoading = loadingState.loadingFonts.has(font.family);
    const isLoaded = loadingState.loadedFonts.has(font.family);
    const isPreviewing = showPreview === font.family;

    const previewText = target === 'heading' 
      ? 'Professional Resume' 
      : 'Experience in software development with expertise in modern technologies and methodologies.';

    return (
      <div
        key={font.family}
        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
          isSelected ? 'ring-2' : ''
        }`}
        style={{
          backgroundColor: isSelected ? 'var(--cv-color-surface)' : 'var(--cv-color-background)',
          borderColor: isSelected ? 'var(--cv-color-primary)' : 'var(--cv-color-border)',
          ringColor: isSelected ? 'var(--cv-color-primary)' : 'transparent'
        }}
      >
        {/* Font Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 
              className="font-medium"
              style={{
                fontSize: 'var(--cv-text-base)',
                color: 'var(--cv-color-text-primary)',
                fontFamily: isLoaded ? `'${font.family}', ${font.category}` : 'inherit'
              }}
            >
              {font.family}
            </h3>
            
            {isSelected && (
              <Check 
                className="h-4 w-4" 
                style={{ color: 'var(--cv-color-primary)' }}
              />
            )}
            
            {font.popularity > 85 && (
              <Star 
                className="h-3 w-3" 
                style={{ color: 'var(--cv-color-warning)' }}
                title="Popular choice"
              />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePreview(font.family)}
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
              onClick={() => handleFontSelect(font.family)}
              className="px-3 py-1 text-xs rounded transition-colors"
              style={{
                backgroundColor: isSelected ? 'var(--cv-color-primary)' : 'var(--cv-color-surface)',
                color: isSelected ? 'white' : 'var(--cv-color-text-primary)',
                border: `1px solid ${isSelected ? 'var(--cv-color-primary)' : 'var(--cv-color-border)'}`
              }}
            >
              {isSelected ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>

        {/* Font Info */}
        <div className="flex items-center gap-4 mb-3 text-xs">
          <span 
            className="px-2 py-1 rounded"
            style={{
              backgroundColor: 'var(--cv-color-surface)',
              color: 'var(--cv-color-text-secondary)',
              border: `1px solid var(--cv-color-border)`
            }}
          >
            {font.category}
          </span>
          
          <span style={{ color: 'var(--cv-color-text-muted)' }}>
            {font.variants.length} weights
          </span>
          
          <span style={{ color: 'var(--cv-color-text-muted)' }}>
            {font.popularity}% popular
          </span>
        </div>

        {/* Font Description */}
        {font.description && (
          <p 
            className="text-xs mb-3"
            style={{ color: 'var(--cv-color-text-secondary)' }}
          >
            {font.description}
          </p>
        )}

        {/* Font Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {font.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs rounded"
              style={{
                backgroundColor: 'var(--cv-color-background)',
                color: 'var(--cv-color-text-muted)',
                border: `1px solid var(--cv-color-border)`
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Font Preview */}
        {(isPreviewing || isSelected) && isLoaded && (
          <div 
            className="p-3 rounded border"
            style={{
              backgroundColor: 'var(--cv-color-background)',
              borderColor: 'var(--cv-color-border)',
              marginTop: '12px'
            }}
          >
            <div
              style={{
                fontFamily: `'${font.family}', ${font.category}`,
                fontSize: target === 'heading' ? 'var(--cv-text-xl)' : 'var(--cv-text-sm)',
                fontWeight: target === 'heading' ? 600 : 400,
                color: 'var(--cv-color-text-primary)',
                lineHeight: target === 'heading' ? 'var(--cv-leading-tight)' : 'var(--cv-leading-normal)'
              }}
            >
              {previewText}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`font-selector ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Type 
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
          {target === 'heading' ? 'Heading Font' : 'Body Font'}
        </h2>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
            style={{ color: 'var(--cv-color-text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search fonts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--cv-color-background)',
              borderColor: 'var(--cv-color-border)',
              color: 'var(--cv-color-text-primary)',
              focusRingColor: 'var(--cv-color-primary)'
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" style={{ color: 'var(--cv-color-text-secondary)' }} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as FontCategoryKey | 'all')}
              className="px-3 py-1 text-sm border rounded focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--cv-color-background)',
                borderColor: 'var(--cv-color-border)',
                color: 'var(--cv-color-text-primary)'
              }}
            >
              <option value="all">All Categories</option>
              {Object.entries(FONT_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span 
              className="text-sm"
              style={{ color: 'var(--cv-color-text-secondary)' }}
            >
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popularity' | 'name')}
              className="px-3 py-1 text-sm border rounded focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--cv-color-background)',
                borderColor: 'var(--cv-color-border)',
                color: 'var(--cv-color-text-primary)'
              }}
            >
              <option value="popularity">Popularity</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <span 
          className="text-sm"
          style={{ color: 'var(--cv-color-text-secondary)' }}
        >
          {filteredFonts.length} fonts available
        </span>
        
        {loadingState.status === 'loading' && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--cv-color-text-secondary)' }}>
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading fonts...
          </div>
        )}
      </div>

      {/* Font List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredFonts.length > 0 ? (
          filteredFonts.map(renderFontItem)
        ) : (
          <div 
            className="text-center py-8"
            style={{ color: 'var(--cv-color-text-muted)' }}
          >
            <Type className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No fonts found matching your criteria</p>
            <p className="text-sm mt-1">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FontSelector;
