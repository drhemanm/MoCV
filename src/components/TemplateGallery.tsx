// Enhanced TemplateGallery with real previews and customization
import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, Check, Zap, Palette, Type, Layout, Eye } from 'lucide-react';
import { CVTemplate } from '../types';

interface TemplateGalleryProps {
  templates: CVTemplate[];
  isLoading: boolean;
  onTemplateSelect: (template: CVTemplate, customization?: TemplateCustomization) => void;
  onTemplatePreview?: (template: CVTemplate) => void;
  onBack: () => void;
}

interface TemplateCustomization {
  colorScheme: 'blue' | 'black' | 'green' | 'purple' | 'red';
  accentColor: string;
  fontStyle: 'modern' | 'classic' | 'minimal';
  headerStyle: 'standard' | 'centered' | 'sidebar';
  spacing: 'compact' | 'balanced' | 'spacious';
}

// Enhanced templates with distinctive visual differences
const enhancedTemplates: CVTemplate[] = [
  {
    id: 'professional-standard',
    name: 'Professional Standard',
    description: 'Traditional two-column layout with clear hierarchy and optimal ATS structure',
    category: 'modern',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Two-Column Layout', 'ATS Optimized', 'Skills Sidebar'],
    difficulty: 'beginner',
    estimatedTime: '15 minutes',
    popularity: 95,
    tags: ['professional', 'ats', 'two-column']
  },
  {
    id: 'executive-timeline',
    name: 'Executive Timeline',
    description: 'Achievement-focused layout with timeline experience and leadership emphasis',
    category: 'classic',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Timeline Layout', 'Achievement Focus', 'Executive Format'],
    difficulty: 'intermediate',
    estimatedTime: '20 minutes',
    popularity: 88,
    tags: ['executive', 'timeline', 'achievements']
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean single-column design with subtle accents and maximum white space',
    category: 'minimal',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Single Column', 'Minimal Design', 'Clean Typography'],
    difficulty: 'beginner',
    estimatedTime: '12 minutes',
    popularity: 92,
    tags: ['minimal', 'clean', 'simple']
  },
  {
    id: 'creative-professional',
    name: 'Creative Professional',
    description: 'Balanced layout with visual elements while maintaining ATS compatibility',
    category: 'creative',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Visual Elements', 'ATS Safe', 'Portfolio Ready'],
    difficulty: 'intermediate',
    estimatedTime: '25 minutes',
    popularity: 82,
    tags: ['creative', 'visual', 'portfolio']
  },
  {
    id: 'tech-focused',
    name: 'Tech Focused',
    description: 'Optimized for technical roles with prominent skills and project sections',
    category: 'modern',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Technical Skills Grid', 'Project Showcase', 'GitHub Integration'],
    difficulty: 'intermediate',
    estimatedTime: '18 minutes',
    popularity: 89,
    tags: ['tech', 'developer', 'projects']
  }
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates: propTemplates,
  isLoading,
  onTemplateSelect,
  onTemplatePreview,
  onBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showCustomization, setShowCustomization] = useState<string | null>(null);
  const [customization, setCustomization] = useState<TemplateCustomization>({
    colorScheme: 'blue',
    accentColor: '#3B82F6',
    fontStyle: 'modern',
    headerStyle: 'standard',
    spacing: 'balanced'
  });

  const templates = propTemplates.length > 0 ? propTemplates : enhancedTemplates;

  const filteredTemplates = useMemo(() => {
    let filtered = templates;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return filtered;
  }, [templates, selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'creative', name: 'Creative' }
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Professional Blue', color: '#3B82F6', bg: 'bg-blue-50' },
    { id: 'black', name: 'Classic Black', color: '#1F2937', bg: 'bg-gray-50' },
    { id: 'green', name: 'Success Green', color: '#059669', bg: 'bg-green-50' },
    { id: 'purple', name: 'Creative Purple', color: '#7C3AED', bg: 'bg-purple-50' },
    { id: 'red', name: 'Bold Red', color: '#DC2626', bg: 'bg-red-50' }
  ];

  const handleTemplateSelect = (template: CVTemplate) => {
    if (showCustomization === template.id) {
      // Confirm selection with customization
      onTemplateSelect(template, customization);
    } else {
      // Show customization panel
      setShowCustomization(template.id);
      setSelectedTemplate(template.id);
    }
  };

  const handleUseTemplate = (template: CVTemplate) => {
    onTemplateSelect(template, customization);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 sticky top-0 bg-white z-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Choose your template</h1>
              <p className="text-gray-600 mt-1">Professional templates with customization options</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Templates Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  isCustomizing={showCustomization === template.id}
                  customization={customization}
                  onSelect={handleTemplateSelect}
                  onPreview={onTemplatePreview}
                />
              ))}
            </div>
          </div>

          {/* Customization Panel */}
          {showCustomization && (
            <div className="w-80 bg-gray-50 rounded-2xl p-6 sticky top-32 h-fit">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Customize Template</h3>
              </div>

              {/* Color Scheme */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Color Scheme</h4>
                <div className="grid grid-cols-2 gap-2">
                  {colorSchemes.map((scheme) => (
                    <button
                      key={scheme.id}
                      onClick={() => setCustomization(prev => ({
                        ...prev,
                        colorScheme: scheme.id as any,
                        accentColor: scheme.color
                      }))}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        customization.colorScheme === scheme.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="w-6 h-6 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: scheme.color }}
                      />
                      <div className="text-xs font-medium text-center">{scheme.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Style */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Typography</h4>
                <div className="space-y-2">
                  {[
                    { id: 'modern', name: 'Modern Sans-serif', desc: 'Clean and contemporary' },
                    { id: 'classic', name: 'Classic Serif', desc: 'Traditional and formal' },
                    { id: 'minimal', name: 'Minimal', desc: 'Simple and unobtrusive' }
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setCustomization(prev => ({ ...prev, fontStyle: font.id as any }))}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        customization.fontStyle === font.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{font.name}</div>
                      <div className="text-xs text-gray-600">{font.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spacing */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Spacing</h4>
                <div className="space-y-2">
                  {[
                    { id: 'compact', name: 'Compact', desc: 'More content, less space' },
                    { id: 'balanced', name: 'Balanced', desc: 'Perfect readability' },
                    { id: 'spacious', name: 'Spacious', desc: 'Generous white space' }
                  ].map((spacing) => (
                    <button
                      key={spacing.id}
                      onClick={() => setCustomization(prev => ({ ...prev, spacing: spacing.id as any }))}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        customization.spacing === spacing.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{spacing.name}</div>
                      <div className="text-xs text-gray-600">{spacing.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleUseTemplate(templates.find(t => t.id === showCustomization)!)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Use This Template
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Template Card with realistic previews
interface TemplateCardProps {
  template: CVTemplate;
  isSelected: boolean;
  isCustomizing: boolean;
  customization: TemplateCustomization;
  onSelect: (template: CVTemplate) => void;
  onPreview?: (template: CVTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  isCustomizing,
  customization,
  onSelect,
  onPreview
}) => {
  // Generate distinctive preview based on template type
  const renderTemplatePreview = () => {
    const accentColor = customization.accentColor;
    
    switch (template.id) {
      case 'professional-standard':
        return (
          <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 p-3 flex">
            <div className="flex-1 pr-3">
              <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: '#1F2937' }}></div>
              <div className="h-2 bg-gray-500 rounded w-1/2 mb-3"></div>
              <div className="h-px bg-gray-200 mb-3"></div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-400 rounded w-full"></div>
                <div className="h-2 bg-gray-400 rounded w-4/5"></div>
                <div className="h-2 bg-gray-400 rounded w-3/4"></div>
              </div>
            </div>
            <div className="w-1/3 pl-3 border-l border-gray-200">
              <div className="h-3 rounded w-full mb-2" style={{ backgroundColor: accentColor }}></div>
              <div className="space-y-1">
                <div className="h-2 bg-gray-300 rounded w-full"></div>
                <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                <div className="h-2 bg-gray-300 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        );
        
      case 'executive-timeline':
        return (
          <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 p-3">
            <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: '#1F2937' }}></div>
            <div className="h-2 bg-gray-500 rounded w-1/2 mb-3"></div>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: accentColor }}></div>
              <div className="pl-4 space-y-3">
                <div className="relative">
                  <div className="absolute -left-5 top-0 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                  <div className="h-2 bg-gray-600 rounded w-2/3 mb-1"></div>
                  <div className="h-2 bg-gray-400 rounded w-1/2"></div>
                </div>
                <div className="relative">
                  <div className="absolute -left-5 top-0 w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="h-2 bg-gray-600 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-400 rounded w-2/5"></div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'modern-minimal':
        return (
          <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="text-center mb-4">
              <div className="h-4 rounded w-1/2 mb-2 mx-auto" style={{ backgroundColor: '#1F2937' }}></div>
              <div className="h-2 bg-gray-500 rounded w-1/3 mx-auto"></div>
            </div>
            <div className="h-px bg-gray-200 mb-4"></div>
            <div className="space-y-3">
              <div className="h-2 rounded w-1/4" style={{ backgroundColor: accentColor }}></div>
              <div className="space-y-1">
                <div className="h-2 bg-gray-400 rounded w-full"></div>
                <div className="h-2 bg-gray-400 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        );
        
      case 'creative-professional':
        return (
          <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 p-3">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: accentColor }}></div>
              <div className="flex-1">
                <div className="h-3 rounded w-3/4 mb-1" style={{ backgroundColor: '#1F2937' }}></div>
                <div className="h-2 bg-gray-500 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-px bg-gray-200 mb-3"></div>
            <div className="grid grid-cols-3 gap-1 mb-3">
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-2 bg-gray-400 rounded w-full"></div>
              <div className="h-2 bg-gray-400 rounded w-4/5"></div>
            </div>
          </div>
        );
        
      case 'tech-focused':
        return (
          <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 p-3">
            <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: '#1F2937' }}></div>
            <div className="h-2 bg-gray-500 rounded w-1/2 mb-3"></div>
            <div className="grid grid-cols-4 gap-1 mb-3">
              <div className="h-3 rounded text-center" style={{ backgroundColor: accentColor }}></div>
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-600 rounded w-2/3"></div>
              <div className="h-2 bg-gray-400 rounded w-full"></div>
              <div className="h-2 bg-gray-400 rounded w-4/5"></div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 p-3">
            <div className="space-y-3">
              <div className="h-4 bg-gray-900 rounded w-3/4"></div>
              <div className="h-2 bg-gray-600 rounded w-1/2"></div>
              <div className="h-px bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-400 rounded w-full"></div>
                <div className="h-2 bg-gray-400 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className={`
        bg-white border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer
        hover:shadow-lg hover:border-gray-300
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'}
      `}
      onClick={() => onSelect(template)}
    >
      <div className="aspect-[3/4] bg-gray-50 p-4">
        {renderTemplatePreview()}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          {template.popularity >= 90 && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Popular
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {template.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {template.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{template.estimatedTime}</span>
          <div className="flex items-center gap-2">
            {isCustomizing && (
              <span className="text-blue-600 font-medium flex items-center gap-1">
                <Palette className="w-3 h-3" />
                Customizing
              </span>
            )}
            <span className="capitalize">{template.difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
