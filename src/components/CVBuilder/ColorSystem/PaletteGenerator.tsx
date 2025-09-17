// src/components/CVBuilder/ColorSystem/PaletteGenerator.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { ColorFormat, BrandColor, ColorPalette, ColorHarmony } from './types';
import { createColorFormat, generateColorHarmony, generateNeutralScale } from './colorUtils';
import { useColorSystem } from './ColorProvider';

interface PaletteTemplate {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'industry' | 'trending';
  baseColors: string[];
  harmonyType?: ColorHarmony['type'];
  includeNeutrals: boolean;
}

interface GenerationOptions {
  includeNeutrals: boolean;
  neutralSteps: number;
  includeAccessibilityColors: boolean;
  maxColors: number;
}

const PALETTE_TEMPLATES: PaletteTemplate[] = [
  // Professional Templates
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Traditional business palette with trustworthy blues',
    category: 'professional',
    baseColors: ['#1e40af', '#3b82f6', '#60a5fa'],
    harmonyType: 'monochromatic',
    includeNeutrals: true
  },
  {
    id: 'executive-navy',
    name: 'Executive Navy',
    description: 'Premium navy-based palette for executive presentations',
    category: 'professional',
    baseColors: ['#1e293b', '#334155', '#475569'],
    harmonyType: 'analogous',
    includeNeutrals: true
  },
  {
    id: 'finance-green',
    name: 'Finance Green',
    description: 'Professional green palette for financial services',
    category: 'professional',
    baseColors: ['#059669', '#10b981', '#34d399'],
    harmonyType: 'monochromatic',
    includeNeutrals: true
  },

  // Creative Templates
  {
    id: 'creative-purple',
    name: 'Creative Purple',
    description: 'Vibrant purple palette for creative professionals',
    category: 'creative',
    baseColors: ['#7c3aed', '#a855f7', '#c084fc'],
    harmonyType: 'analogous',
    includeNeutrals: false
  },
  {
    id: 'artistic-orange',
    name: 'Artistic Orange',
    description: 'Warm orange palette for designers and artists',
    category: 'creative',
    baseColors: ['#ea580c', '#f97316', '#fb923c'],
    harmonyType: 'complementary',
    includeNeutrals: false
  },
  {
    id: 'creative-teal',
    name: 'Creative Teal',
    description: 'Modern teal palette for creative industries',
    category: 'creative',
    baseColors: ['#0d9488', '#14b8a6', '#2dd4bf'],
    harmonyType: 'triadic',
    includeNeutrals: false
  },

  // Industry Specific
  {
    id: 'healthcare-calm',
    name: 'Healthcare Calm',
    description: 'Calming colors for healthcare professionals',
    category: 'industry',
    baseColors: ['#0ea5e9', '#38bdf8', '#7dd3fc'],
    harmonyType: 'monochromatic',
    includeNeutrals: true
  },
  {
    id: 'tech-innovation',
    name: 'Tech Innovation',
    description: 'Modern tech palette with electric blues',
    category: 'industry',
    baseColors: ['#3b82f6', '#06b6d4', '#8b5cf6'],
    harmonyType: 'triadic',
    includeNeutrals: true
  },
  {
    id: 'education-friendly',
    name: 'Education Friendly',
    description: 'Approachable colors for education sector',
    category: 'industry',
    baseColors: ['#f59e0b', '#10b981', '#3b82f6'],
    harmonyType: 'triadic',
    includeNeutrals: true
  },

  // Trending Templates
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: 'Trending gradient-friendly color combinations',
    category: 'trending',
    baseColors: ['#ec4899', '#8b5cf6', '#06b6d4'],
    harmonyType: 'triadic',
    includeNeutrals: false
  },
  {
    id: 'neon-accent',
    name: 'Neon Accent',
    description: 'Bold neon accents for modern designs',
    category: 'trending',
    baseColors: ['#10b981', '#f59e0b', '#ef4444'],
    harmonyType: 'triadic',
    includeNeutrals: true
  },
  {
    id: 'pastel-modern',
    name: 'Pastel Modern',
    description: 'Soft pastels with modern appeal',
    category: 'trending',
    baseColors: ['#a78bfa', '#fb7185', '#60a5fa'],
    harmonyType: 'analogous',
    includeNeutrals: true
  }
];

const HARMONY_DESCRIPTIONS = {
  monochromatic: 'Single hue with different saturations and brightness',
  analogous: 'Adjacent colors on the color wheel for harmony',
  complementary: 'Opposite colors for high contrast and energy',
  triadic: 'Three evenly spaced colors for vibrant balance',
  tetradic: 'Four colors forming a rectangle on color wheel',
  'split-complementary': 'Base color plus two adjacent to its complement'
};

export const PaletteGenerator: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PaletteTemplate['category'] | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<PaletteTemplate | null>(null);
  const [customBaseColor, setCustomBaseColor] = useState('#3b82f6');
  const [customHarmonyType, setCustomHarmonyType] = useState<ColorHarmony['type']>('complementary');
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
    includeNeutrals: true,
    neutralSteps: 7,
    includeAccessibilityColors: true,
    maxColors: 12
  });
  const [generatedPalettes, setGeneratedPalettes] = useState<ColorPalette[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'custom' | 'random'>('templates');

  const { 
    createPalette, 
    generateHarmony, 
    generateNeutralScale,
    checkContrast,
    savedPalettes 
  } = useColorSystem();

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'all' 
    ? PALETTE_TEMPLATES 
    : PALETTE_TEMPLATES.filter(t => t.category === selectedCategory);

  // Generate palette from template
  const generateFromTemplate = useCallback(async (template: PaletteTemplate) => {
    setIsGenerating(true);
    
    try {
      const colors: BrandColor[] = [];
      let colorIndex = 0;
      
      // Process base colors
      for (const hexColor of template.baseColors) {
        const colorFormat = createColorFormat(hexColor);
        const usage = colorIndex === 0 ? 'primary' : 
                     colorIndex === 1 ? 'secondary' : 'accent';
        
        colors.push({
          id: `template-${template.id}-${colorIndex}`,
          name: `${template.name} ${usage}`,
          color: colorFormat,
          usage: usage as BrandColor['usage']
        });
        
        colorIndex++;
      }
      
      // Generate harmony colors if specified
      if (template.harmonyType) {
        const baseColor = createColorFormat(template.baseColors[0]);
        const harmony = generateHarmony(baseColor, template.harmonyType);
        
        harmony.colors.slice(1).forEach((color, index) => {
          colors.push({
            id: `harmony-${template.id}-${index}`,
            name: `${template.name} Harmony ${index + 1}`,
            color,
            usage: 'accent'
          });
        });
      }
      
      // Add neutral colors if requested
      if (template.includeNeutrals || generationOptions.includeNeutrals) {
        const baseColor = createColorFormat(template.baseColors[0]);
        const neutrals = generateNeutralScale(baseColor, generationOptions.neutralSteps);
        
        neutrals.slice(0, 4).forEach((neutral, index) => {
          colors.push({
            id: `neutral-${template.id}-${index}`,
            name: `${template.name} Neutral ${index + 1}`,
            color: neutral,
            usage: 'neutral'
          });
        });
      }
      
      // Add accessibility colors
      if (generationOptions.includeAccessibilityColors) {
        colors.push(
          {
            id: `success-${template.id}`,
            name: 'Success',
            color: createColorFormat('#10b981'),
            usage: 'success'
          },
          {
            id: `warning-${template.id}`,
            name: 'Warning',
            color: createColorFormat('#f59e0b'),
            usage: 'warning'
          },
          {
            id: `error-${template.id}`,
            name: 'Error',
            color: createColorFormat('#ef4444'),
            usage: 'error'
          }
        );
      }
      
      // Limit colors if needed
      const finalColors = colors.slice(0, generationOptions.maxColors);
      
      // Create the palette
      const newPalette: ColorPalette = {
        id: `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${template.name} Palette`,
        colors: finalColors,
        createdAt: new Date(),
        source: 'generated',
        harmony: template.harmonyType ? {
          type: template.harmonyType,
          colors: [createColorFormat(template.baseColors[0])],
          baseColor: createColorFormat(template.baseColors[0])
        } : undefined
      };
      
      setGeneratedPalettes(prev => [newPalette, ...prev.slice(0, 4)]); // Keep last 5 generated
      
    } catch (error) {
      console.error('Failed to generate palette:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [generateHarmony, generateNeutralScale, generationOptions]);

  // Generate custom palette
  const generateCustomPalette = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      const baseColor = createColorFormat(customBaseColor);
      const harmony = generateHarmony(baseColor, customHarmonyType);
      
      const colors: BrandColor[] = [];
      
      // Add harmony colors
      harmony.colors.forEach((color, index) => {
        const usage = index === 0 ? 'primary' : 
                     index === 1 ? 'secondary' : 'accent';
        
        colors.push({
          id: `custom-${Date.now()}-${index}`,
          name: `Custom ${usage}`,
          color,
          usage: usage as BrandColor['usage']
        });
      });
      
      // Add neutrals if requested
      if (generationOptions.includeNeutrals) {
        const neutrals = generateNeutralScale(baseColor, generationOptions.neutralSteps);
        
        neutrals.slice(0, 4).forEach((neutral, index) => {
          colors.push({
            id: `custom-neutral-${Date.now()}-${index}`,
            name: `Custom Neutral ${index + 1}`,
            color: neutral,
            usage: 'neutral'
          });
        });
      }
      
      // Add accessibility colors
      if (generationOptions.includeAccessibilityColors) {
        colors.push(
          {
            id: `custom-success-${Date.now()}`,
            name: 'Success',
            color: createColorFormat('#10b981'),
            usage: 'success'
          },
          {
            id: `custom-warning-${Date.now()}`,
            name: 'Warning',
            color: createColorFormat('#f59e0b'),
            usage: 'warning'
          },
          {
            id: `custom-error-${Date.now()}`,
            name: 'Error',
            color: createColorFormat('#ef4444'),
            usage: 'error'
          }
        );
      }
      
      const finalColors = colors.slice(0, generationOptions.maxColors);
      
      const newPalette: ColorPalette = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `Custom ${customHarmonyType} Palette`,
        colors: finalColors,
        createdAt: new Date(),
        source: 'generated',
        harmony: {
          type: customHarmonyType,
          colors: harmony.colors,
          baseColor
        }
      };
      
      setGeneratedPalettes(prev => [newPalette, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.error('Failed to generate custom palette:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [customBaseColor, customHarmonyType, generateHarmony, generateNeutralScale, generationOptions]);

  // Generate random palette
  const generateRandomPalette = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      const randomHue = Math.floor(Math.random() * 360);
      const randomSaturation = 60 + Math.random() * 30; // 60-90%
      const randomLightness = 45 + Math.random() * 20; // 45-65%
      
      const baseColor = createColorFormat(
        `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`
      );
      
      const harmonyTypes: ColorHarmony['type'][] = [
        'complementary', 'triadic', 'analogous', 'split-complementary'
      ];
      const randomHarmony = harmonyTypes[Math.floor(Math.random() * harmonyTypes.length)];
      
      const harmony = generateHarmony(baseColor, randomHarmony);
      
      const colors: BrandColor[] = [];
      
      harmony.colors.forEach((color, index) => {
        const usage = index === 0 ? 'primary' : 
                     index === 1 ? 'secondary' : 'accent';
        
        colors.push({
          id: `random-${Date.now()}-${index}`,
          name: `Random ${usage}`,
          color,
          usage: usage as BrandColor['usage']
        });
      });
      
      if (generationOptions.includeNeutrals) {
        const neutrals = generateNeutralScale(baseColor, generationOptions.neutralSteps);
        
        neutrals.slice(0, 3).forEach((neutral, index) => {
          colors.push({
            id: `random-neutral-${Date.now()}-${index}`,
            name: `Random Neutral ${index + 1}`,
            color: neutral,
            usage: 'neutral'
          });
        });
      }
      
      const finalColors = colors.slice(0, generationOptions.maxColors);
      
      const newPalette: ColorPalette = {
        id: `random-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `Random ${randomHarmony} Palette`,
        colors: finalColors,
        createdAt: new Date(),
        source: 'generated',
        harmony: {
          type: randomHarmony,
          colors: harmony.colors,
          baseColor
        }
      };
      
      setGeneratedPalettes(prev => [newPalette, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.error('Failed to generate random palette:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [generateHarmony, generateNeutralScale, generationOptions]);

  // Save palette to collection
  const savePalette = useCallback((palette: ColorPalette) => {
    createPalette(palette.name, palette.colors);
  }, [createPalette]);

  return (
    <div style={{
      fontFamily: 'var(--cv-font-body)',
      background: 'var(--cv-color-surface)',
      border: '1px solid var(--cv-color-border)',
      borderRadius: 'var(--cv-rounded-lg)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--cv-color-background)',
        padding: 'var(--cv-space-lg)',
        borderBottom: '1px solid var(--cv-color-border)'
      }}>
        <h3 style={{
          fontSize: 'var(--cv-text-xl)',
          fontWeight: 'var(--cv-font-semibold)',
          color: 'var(--cv-color-text-primary)',
          margin: '0 0 var(--cv-space-sm) 0'
        }}>
          Palette Generator
        </h3>
        <p style={{
          fontSize: 'var(--cv-text-sm)',
          color: 'var(--cv-color-text-muted)',
          margin: 0
        }}>
          Create professional color palettes using templates or custom generation
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--cv-color-border)'
      }}>
        {(['templates', 'custom', 'random'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: 'var(--cv-space-md)',
              border: 'none',
              background: activeTab === tab ? 'var(--cv-color-primary)' : 'var(--cv-color-background)',
              color: activeTab === tab ? 'white' : 'var(--cv-color-text-secondary)',
              fontSize: 'var(--cv-text-sm)',
              fontWeight: 'var(--cv-font-medium)',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease'
            }}
          >
            {tab === 'templates' ? '🎨 Templates' : 
             tab === 'custom' ? '⚙️ Custom' : '🎲 Random'}
          </button>
        ))}
      </div>

      <div style={{ padding: 'var(--cv-space-lg)' }}>
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <>
            {/* Category Filter */}
            <div style={{ marginBottom: 'var(--cv-space-lg)' }}>
              <div style={{ display: 'flex', gap: 'var(--cv-space-sm)', flexWrap: 'wrap' }}>
                {(['all', 'professional', 'creative', 'industry', 'trending'] as const).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: 'var(--cv-space-sm) var(--cv-space-md)',
                      border: '1px solid var(--cv-color-border)',
                      background: selectedCategory === category ? 'var(--cv-color-primary)' : 'var(--cv-color-background)',
                      color: selectedCategory === category ? 'white' : 'var(--cv-color-text-secondary)',
                      borderRadius: 'var(--cv-rounded-md)',
                      fontSize: 'var(--cv-text-sm)',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--cv-space-md)',
              marginBottom: 'var(--cv-space-lg)'
            }}>
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  style={{
                    border: '1px solid var(--cv-color-border)',
                    borderRadius: 'var(--cv-rounded-md)',
                    padding: 'var(--cv-space-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ':hover': {
                      boxShadow: 'var(--cv-shadow-md)'
                    }
                  }}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div style={{
                    display: 'flex',
                    gap: 'var(--cv-space-xs)',
                    marginBottom: 'var(--cv-space-sm)'
                  }}>
                    {template.baseColors.map((color, index) => (
                      <div
                        key={index}
                        style={{
                          width: '24px',
                          height: '24px',
                          background: color,
                          borderRadius: 'var(--cv-rounded-sm)',
                          border: '1px solid var(--cv-color-border)'
                        }}
                      />
                    ))}
                  </div>
                  
                  <h4 style={{
                    fontSize: 'var(--cv-text-base)',
                    fontWeight: 'var(--cv-font-semibold)',
                    color: 'var(--cv-color-text-primary)',
                    margin: '0 0 var(--cv-space-xs) 0'
                  }}>
                    {template.name}
                  </h4>
                  
                  <p style={{
                    fontSize: 'var(--cv-text-sm)',
                    color: 'var(--cv-color-text-muted)',
                    margin: '0 0 var(--cv-space-sm) 0',
                    lineHeight: 'var(--cv-leading-normal)'
                  }}>
                    {template.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: 'var(--cv-text-xs)',
                      color: 'var(--cv-color-text-muted)',
                      textTransform: 'capitalize'
                    }}>
                      {template.category}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateFromTemplate(template);
                      }}
                      disabled={isGenerating}
                      style={{
                        padding: 'var(--cv-space-xs) var(--cv-space-sm)',
                        background: 'var(--cv-color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--cv-rounded-sm)',
                        fontSize: 'var(--cv-text-xs)',
                        cursor: 'pointer',
                        opacity: isGenerating ? 0.6 : 1
                      }}
                    >
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Custom Tab */}
        {activeTab === 'custom' && (
          <div style={{ maxWidth: '400px' }}>
            <div style={{ marginBottom: 'var(--cv-space-md)' }}>
              <label style={{
                display: 'block',
                fontSize: 'var(--cv-text-sm)',
                fontWeight: 'var(--cv-font-medium)',
                color: 'var(--cv-color-text-primary)',
                marginBottom: 'var(--cv-space-xs)'
              }}>
                Base Color
              </label>
              <input
                type="color"
                value={customBaseColor}
                onChange={(e) => setCustomBaseColor(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid var(--cv-color-border)',
                  borderRadius: 'var(--cv-rounded-md)',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div style={{ marginBottom: 'var(--cv-space-md)' }}>
              <label style={{
                display: 'block',
                fontSize: 'var(--cv-text-sm)',
                fontWeight: 'var(--cv-font-medium)',
                color: 'var(--cv-color-text-primary)',
                marginBottom: 'var(--cv-space-xs)'
              }}>
                Harmony Type
              </label>
              <select
                value={customHarmonyType}
                onChange={(e) => setCustomHarmonyType(e.target.value as ColorHarmony['type'])}
                style={{
                  width: '100%',
                  padding: 'var(--cv-space-sm)',
                  border: '1px solid var(--cv-color-border)',
                  borderRadius: 'var(--cv-rounded-md)',
                  background: 'var(--cv-color-background)',
                  fontSize: 'var(--cv-text-sm)'
                }}
              >
                {Object.entries(HARMONY_DESCRIPTIONS).map(([type, description]) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)} - {description}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generateCustomPalette}
              disabled={isGenerating}
              style={{
                width: '100%',
                padding: 'var(--cv-space-md)',
                background: 'var(--cv-color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--cv-rounded-md)',
                fontSize: 'var(--cv-text-sm)',
                fontWeight: 'var(--cv-font-medium)',
                cursor: 'pointer',
                opacity: isGenerating ? 0.6 : 1
              }}
            >
              {isGenerating ? 'Generating Custom Palette...' : 'Generate Custom Palette'}
            </button>
          </div>
        )}

        {/* Random Tab */}
        {activeTab === 'random' && (
          <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{
              fontSize: 'var(--cv-text-lg)',
              marginBottom: 'var(--cv-space-md)'
            }}>
              🎲
            </div>
            
            <p style={{
              fontSize: 'var(--cv-text-sm)',
              color: 'var(--cv-color-text-muted)',
              marginBottom: 'var(--cv-space-lg)',
              lineHeight: 'var(--cv-leading-relaxed)'
            }}>
              Generate completely random color palettes with mathematically harmonious relationships.
              Perfect for inspiration and discovering new color combinations.
            </p>

            <button
              onClick={generateRandomPalette}
              disabled={isGenerating}
              style={{
                padding: 'var(--cv-space-lg) var(--cv-space-xl)',
                background: 'var(--cv-color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--cv-rounded-lg)',
                fontSize: 'var(--cv-text-base)',
                fontWeight: 'var(--cv-font-medium)',
                cursor: 'pointer',
                opacity: isGenerating ? 0.6 : 1
              }}
            >
              {isGenerating ? 'Generating Random Palette...' : '🎲 Generate Random Palette'}
            </button>
          </div>
        )}

        {/* Generation Options */}
        <div style={{
          marginTop: 'var(--cv-space-xl)',
          padding: 'var(--cv-space-md)',
          background: 'var(--cv-color-background)',
          border: '1px solid var(--cv-color-border)',
          borderRadius: 'var(--cv-rounded-md)'
        }}>
          <h4 style={{
            fontSize: 'var(--cv-text-sm)',
            fontWeight: 'var(--cv-font-semibold)',
            color: 'var(--cv-color-text-primary)',
            margin: '0 0 var(--cv-space-md) 0'
          }}>
            Generation Options
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--cv-space-md)' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--cv-space-sm)',
              fontSize: 'var(--cv-text-sm)',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={generationOptions.includeNeutrals}
                onChange={(e) => setGenerationOptions(prev => ({
                  ...prev,
                  includeNeutrals: e.target.checked
                }))}
              />
              Include Neutrals
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--cv-space-sm)',
              fontSize: 'var(--cv-text-sm)',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={generationOptions.includeAccessibilityColors}
                onChange={(e) => setGenerationOptions(prev => ({
                  ...prev,
                  includeAccessibilityColors: e.target.checked
                }))}
              />
              Accessibility Colors
            </label>

            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--cv-text-xs)',
                color: 'var(--cv-color-text-muted)',
                marginBottom: '2px'
              }}>
                Neutral Steps: {generationOptions.neutralSteps}
              </label>
              <input
                type="range"
                min="3"
                max="12"
                value={generationOptions.neutralSteps}
                onChange={(e) => setGenerationOptions(prev => ({
                  ...prev,
                  neutralSteps: parseInt(e.target.value)
                }))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--cv-text-xs)',
                color: 'var(--cv-color-text-muted)',
                marginBottom: '2px'
              }}>
                Max Colors: {generationOptions.maxColors}
              </label>
              <input
                type="range"
                min="6"
                max="20"
                value={generationOptions.maxColors}
                onChange={(e) => setGenerationOptions(prev => ({
                  ...prev,
                  maxColors: parseInt(e.target.value)
                }))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Generated Palettes */}
      {generatedPalettes.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--cv-color-border)',
          padding: 'var(--cv-space-lg)'
        }}>
          <h4 style={{
            fontSize: 'var(--cv-text-lg)',
            fontWeight: 'var(--cv-font-semibold)',
            color: 'var(--cv-color-text-primary)',
            marginBottom: 'var(--cv-space-md)'
          }}>
            Generated Palettes
          </h4>

          <div style={{
            display: 'grid',
            gap: 'var(--cv-space-md)'
          }}>
            {generatedPalettes.map(palette => (
              <div
                key={palette.id}
                style={{
                  border: '1px solid var(--cv-color-border)',
                  borderRadius: 'var(--cv-rounded-md)',
                  padding: 'var(--cv-space-md)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--cv-space-sm)'
                }}>
                  <h5 style={{
                    fontSize: 'var(--cv-text-base)',
                    fontWeight: 'var(--cv-font-medium)',
                    color: 'var(--cv-color-text-primary)',
                    margin: 0
                  }}>
                    {palette.name}
                  </h5>
                  
                  <button
                    onClick={() => savePalette(palette)}
                    style={{
                      padding: 'var(--cv-space-xs) var(--cv-space-sm)',
                      background: 'var(--cv-color-success)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--cv-rounded-sm)',
                      fontSize: 'var(--cv-text-xs)',
                      cursor: 'pointer'
                    }}
                  >
                    💾 Save
                  </button>
                </div>

                <div style={{
                  display: 'flex',
                  gap: 'var(--cv-space-xs)',
                  flexWrap: 'wrap'
                }}>
                  {palette.colors.map(color => (
                    <div
                      key={color.id}
                      style={{
                        width: '32px',
                        height: '32px',
                        background: color.color.hex,
                        borderRadius: 'var(--cv-rounded-sm)',
                        border: '1px solid var(--cv-color-border)'
                      }}
                      title={`${color.name} (${color.color.hex})`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaletteGenerator;
