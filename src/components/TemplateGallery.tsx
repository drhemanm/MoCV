// Enhanced TemplateGallery - Section 1: Imports, Interfaces & Data
import React, { useState, useMemo } from 'react';
import { 
  Search, ChevronLeft, Check, Zap, Palette, Type, Layout, Eye, 
  Heart, Clock, Star, TrendingUp, Download, Filter, Sparkles 
} from 'lucide-react';
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

// Enhanced template type with additional metadata
interface EnhancedCVTemplate extends CVTemplate {
  successRate?: number;
  isPopular?: boolean;
  isNew?: boolean;
  atsScore?: number;
  industryFit?: string[];
}

// Enhanced templates with better metadata
const enhancedTemplates: EnhancedCVTemplate[] = [
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
    tags: ['professional', 'ats', 'two-column'],
    // Enhanced metadata
    successRate: 94,
    isPopular: true,
    isNew: false,
    atsScore: 98,
    industryFit: ['Finance', 'Consulting', 'Technology']
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
    tags: ['executive', 'timeline', 'achievements'],
    successRate: 91,
    isPopular: false,
    isNew: true,
    atsScore: 85,
    industryFit: ['Executive', 'Management', 'Strategy']
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
    tags: ['minimal', 'clean', 'simple'],
    successRate: 89,
    isPopular: true,
    isNew: false,
    atsScore: 96,
    industryFit: ['Design', 'Startups', 'Creative']
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
    tags: ['creative', 'visual', 'portfolio'],
    successRate: 86,
    isPopular: false,
    isNew: true,
    atsScore: 92,
    industryFit: ['Creative', 'Marketing', 'Design']
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
    tags: ['tech', 'developer', 'projects'],
    successRate: 93,
    isPopular: true,
    isNew: false,
    atsScore: 97,
    industryFit: ['Technology', 'Engineering', 'Startups']
  }
];

// Color scheme configuration
const colorSchemes = [
  { id: 'blue', name: 'Professional Blue', color: '#3B82F6', bg: 'bg-blue-50', text: 'text-blue-700' },
  { id: 'black', name: 'Classic Black', color: '#1F2937', bg: 'bg-gray-50', text: 'text-gray-700' },
  { id: 'green', name: 'Success Green', color: '#059669', bg: 'bg-green-50', text: 'text-green-700' },
  { id: 'purple', name: 'Creative Purple', color: '#7C3AED', bg: 'bg-purple-50', text: 'text-purple-700' },
  { id: 'red', name: 'Bold Red', color: '#DC2626', bg: 'bg-red-50', text: 'text-red-700' }
];
// Enhanced TemplateGallery - Section 2: Main Component Logic
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
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'difficulty' | 'time'>('popular');
  
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
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query)) ||
        template.features.some(feature => feature.toLowerCase().includes(query))
      );
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'newest':
          return ((b as EnhancedCVTemplate).isNew ? 1 : 0) - ((a as EnhancedCVTemplate).isNew ? 1 : 0);
        case 'difficulty':
          const difficultyOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'time':
          return parseInt(a.estimatedTime) - parseInt(b.estimatedTime);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [templates, selectedCategory, searchQuery, sortBy]);

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'modern', name: 'Modern', count: templates.filter(t => t.category === 'modern').length },
    { id: 'classic', name: 'Classic', count: templates.filter(t => t.category === 'classic').length },
    { id: 'minimal', name: 'Minimal', count: templates.filter(t => t.category === 'minimal').length },
    { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length }
  ];

  const toggleFavorite = (templateId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };

  const handleTemplateSelect = (template: CVTemplate) => {
    if (showCustomization === template.id) {
      onTemplateSelect(template, customization);
    } else {
      setShowCustomization(template.id);
      setSelectedTemplate(template.id);
    }
  };

  const handleUseTemplate = (template: CVTemplate) => {
    onTemplateSelect(template, customization);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading world-class templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div className="h-6 border-l border-gray-300"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Choose your template</h1>
              <p className="text-gray-600 mt-1">Professional templates with world-class customization</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Enhanced Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates, features, or industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Sort Dropdown */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="difficulty">Easiest First</option>
              <option value="time">Quick Setup</option>
            </select>
          </div>

          {/* Categories with counts */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-blue-700 text-blue-100'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Templates Grid */}
          <div className="flex-1">
            {/* Results header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredTemplates.length} templates found
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Professional designs optimized for modern recruiting
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <EnhancedTemplateCard
                  key={template.id}
                  template={template as EnhancedCVTemplate}
                  isSelected={selectedTemplate === template.id}
                  isCustomizing={showCustomization === template.id}
                  isHovered={hoveredTemplate === template.id}
                  isFavorited={favorites.has(template.id)}
                  customization={customization}
                  onSelect={handleTemplateSelect}
                  onPreview={onTemplatePreview}
                  onHover={setHoveredTemplate}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Customization Panel */}
          {showCustomization && (
            <div className="w-80 bg-white rounded-2xl border border-gray-200 p-6 sticky top-32 h-fit shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Customize Template</h3>
              </div>

              {/* Template Info */}
              {(() => {
                const template = templates.find(t => t.id === showCustomization) as EnhancedCVTemplate;
                return template ? (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      {template.isPopular && (
                        <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {template.atsScore}% ATS
                      </span>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Color Scheme */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  Color Scheme
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {colorSchemes.map((scheme) => (
                    <button
                      key={scheme.id}
                      onClick={() => setCustomization(prev => ({
                        ...prev,
                        colorScheme: scheme.id as any,
                        accentColor: scheme.color
                      }))}
                      className={`p-3 rounded-lg border-2 transition-all hover:shadow-sm ${
                        customization.colorScheme === scheme.id
                          ? 'border-blue-500 bg-blue-50 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="w-6 h-6 rounded-full mx-auto mb-2 shadow-sm"
                        style={{ backgroundColor: scheme.color }}
                      />
                      <div className="text-xs font-medium text-center text-gray-700">
                        {scheme.name.split(' ')[1]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Typography
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'modern', name: 'Modern Sans-serif', desc: 'Clean and contemporary', example: 'Aa' },
                    { id: 'classic', name: 'Classic Serif', desc: 'Traditional and formal', example: 'Aa' },
                    { id: 'minimal', name: 'Minimal', desc: 'Simple and unobtrusive', example: 'Aa' }
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setCustomization(prev => ({ ...prev, fontStyle: font.id as any }))}
                      className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                        customization.fontStyle === font.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{font.name}</div>
                          <div className="text-xs text-gray-600">{font.desc}</div>
                        </div>
                        <div className="text-2xl font-semibold text-gray-400">{font.example}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spacing */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Spacing
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'compact', name: 'Compact', desc: 'More content, less space', visual: '|||' },
                    { id: 'balanced', name: 'Balanced', desc: 'Perfect readability', visual: '| | |' },
                    { id: 'spacious', name: 'Spacious', desc: 'Generous white space', visual: '|  |  |' }
                  ].map((spacing) => (
                    <button
                      key={spacing.id}
                      onClick={() => setCustomization(prev => ({ ...prev, spacing: spacing.id as any }))}
                      className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                        customization.spacing === spacing.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{spacing.name}</div>
                          <div className="text-xs text-gray-600">{spacing.desc}</div>
                        </div>
                        <div className="text-sm font-mono text-gray-400">{spacing.visual}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleUseTemplate(templates.find(t => t.id === showCustomization)!)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Use This Template
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Enhanced TemplateGallery - Section 3: Enhanced Template Card Component
interface EnhancedTemplateCardProps {
  template: EnhancedCVTemplate;
  isSelected: boolean;
  isCustomizing: boolean;
  isHovered: boolean;
  isFavorited: boolean;
  customization: TemplateCustomization;
  onSelect: (template: CVTemplate) => void;
  onPreview?: (template: CVTemplate) => void;
  onHover: (templateId: string | null) => void;
  onToggleFavorite: (templateId: string) => void;
}

const EnhancedTemplateCard: React.FC<EnhancedTemplateCardProps> = ({
  template,
  isSelected,
  isCustomizing,
  isHovered,
  isFavorited,
  customization,
  onSelect,
  onPreview,
  onHover,
  onToggleFavorite
}) => {
  // Template preview rendering logic - keeping your existing logic
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
        group relative bg-white border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-300
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' : 'border-gray-200'}
      `}
      onClick={() => onSelect(template)}
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Template Preview */}
      <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
        {renderTemplatePreview()}
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-3">
            {onPreview && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(template);
                }}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            )}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Use Template</span>
            </button>
          </div>
        </div>

        {/* Enhanced Badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {template.isPopular && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Popular</span>
            </span>
          )}
          {template.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {template.atsScore && template.atsScore >= 95 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              ATS+
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(template.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isFavorited
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Enhanced Template Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              {isCustomizing && (
                <span className="text-blue-600 font-medium flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>

        {/* Enhanced Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{template.estimatedTime}</span>
            </span>
            {template.atsScore && (
              <span className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>{template.atsScore}%</span>
              </span>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full font-medium ${
            template.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
            template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {template.difficulty}
          </span>
        </div>

        {/* Enhanced Features */}
        <div className="flex flex-wrap gap-2 mb-3">
          {template.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium"
            >
              {feature}
            </span>
          ))}
          {template.features.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{template.features.length - 3} more
            </span>
          )}
        </div>

        {/* Industry Fit */}
        {template.industryFit && template.industryFit.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-500 mb-1">Perfect for:</p>
            <div className="flex flex-wrap gap-1">
              {template.industryFit.slice(0, 2).map((industry, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
                >
                  {industry}
                </span>
              ))}
              {template.industryFit.length > 2 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{template.industryFit.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;
