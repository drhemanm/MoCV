// src/components/TemplateGallery.tsx - Apple Design + ATS Optimized
import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, Check, Zap } from 'lucide-react';
import { CVTemplate } from '../types';

interface TemplateGalleryProps {
  templates: CVTemplate[];
  isLoading: boolean;
  onTemplateSelect: (template: CVTemplate) => void;
  onTemplatePreview?: (template: CVTemplate) => void;
  onBack: () => void;
}

// Enhanced template data with ATS optimization info
const enhancedTemplates: CVTemplate[] = [
  {
    id: 'professional-standard',
    name: 'Professional Standard',
    description: 'Clean, ATS-friendly design optimized for maximum compatibility',
    category: 'modern',
    previewUrl: '/templates/professional-standard/preview.png',
    markdownUrl: '/templates/professional-standard/template.md',
    thumbnail: '/templates/professional-standard/thumb.png',
    features: ['ATS Optimized', 'Clean Layout', 'Standard Headers'],
    difficulty: 'beginner',
    estimatedTime: '15 minutes',
    popularity: 95,
    tags: ['professional', 'ats', 'standard', 'clean']
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Contemporary design with optimal white space and readability',
    category: 'minimal',
    previewUrl: '/templates/modern-minimal/preview.png',
    markdownUrl: '/templates/modern-minimal/template.md',
    thumbnail: '/templates/modern-minimal/thumb.png',
    features: ['Minimal Design', 'High Readability', 'ATS Compatible'],
    difficulty: 'beginner',
    estimatedTime: '12 minutes',
    popularity: 88,
    tags: ['minimal', 'modern', 'clean']
  },
  {
    id: 'executive-classic',
    name: 'Executive Classic',
    description: 'Traditional format preferred by senior-level positions',
    category: 'classic',
    previewUrl: '/templates/executive-classic/preview.png',
    markdownUrl: '/templates/executive-classic/template.md',
    thumbnail: '/templates/executive-classic/thumb.png',
    features: ['Executive Format', 'Achievement Focus', 'Traditional Layout'],
    difficulty: 'intermediate',
    estimatedTime: '20 minutes',
    popularity: 82,
    tags: ['executive', 'classic', 'senior']
  },
  {
    id: 'tech-optimized',
    name: 'Tech Optimized',
    description: 'Designed specifically for technical roles and skill showcasing',
    category: 'modern',
    previewUrl: '/templates/tech-optimized/preview.png',
    markdownUrl: '/templates/tech-optimized/template.md',
    thumbnail: '/templates/tech-optimized/thumb.png',
    features: ['Technical Skills Focus', 'Project Showcase', 'GitHub Integration'],
    difficulty: 'intermediate',
    estimatedTime: '18 minutes',
    popularity: 91,
    tags: ['tech', 'developer', 'skills']
  },
  {
    id: 'universal-format',
    name: 'Universal Format',
    description: 'Works across all industries with maximum ATS compatibility',
    category: 'classic',
    previewUrl: '/templates/universal-format/preview.png',
    markdownUrl: '/templates/universal-format/template.md',
    thumbnail: '/templates/universal-format/thumb.png',
    features: ['100% ATS Compatible', 'Industry Neutral', 'Standard Sections'],
    difficulty: 'beginner',
    estimatedTime: '10 minutes',
    popularity: 97,
    tags: ['universal', 'ats', 'compatible']
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

  // Use enhanced templates if props are empty (fallback)
  const templates = propTemplates.length > 0 ? propTemplates : enhancedTemplates;

  // Filter templates
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
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [templates, selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'minimal', name: 'Minimal' }
  ];

  const handleTemplateSelect = (template: CVTemplate) => {
    setSelectedTemplate(template.id);
    // Brief selection feedback before navigation
    setTimeout(() => {
      onTemplateSelect(template);
    }, 150);
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
      <div className="border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
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
              <p className="text-gray-600 mt-1">All templates are ATS-optimized and professionally designed</p>
            </div>
          </div>

          {/* Search */}
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

            {/* Category Filter */}
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

      {/* Templates Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-blue-600 hover:text-blue-700 mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={handleTemplateSelect}
                onPreview={onTemplatePreview}
              />
            ))}
          </div>
        )}
      </div>

      {/* ATS Information Footer */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ATS-Optimized for Maximum Success
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All templates are designed to pass through Applicant Tracking Systems 
              used by 95% of companies, ensuring your CV reaches human recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">ATS Compatible</h4>
              <p className="text-sm text-gray-600">Standard formatting that ATS systems can read perfectly</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Keyword Optimized</h4>
              <p className="text-sm text-gray-600">Structured to highlight your skills and experience effectively</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Recruiter Friendly</h4>
              <p className="text-sm text-gray-600">Clean, scannable design that recruiters can quickly evaluate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template Card Component
interface TemplateCardProps {
  template: CVTemplate;
  isSelected: boolean;
  onSelect: (template: CVTemplate) => void;
  onPreview?: (template: CVTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onPreview
}) => {
  return (
    <div 
      className={`
        bg-white border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer
        hover:shadow-lg hover:border-gray-300
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'}
      `}
      onClick={() => onSelect(template)}
    >
      {/* Template Preview */}
      <div className="aspect-[3/4] bg-gray-50 p-4">
        <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          {/* Mock CV Content */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-900 rounded w-3/4"></div>
            <div className="h-2 bg-gray-600 rounded w-1/2"></div>
            <div className="h-px bg-gray-200 my-3"></div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-400 rounded w-full"></div>
              <div className="h-2 bg-gray-400 rounded w-4/5"></div>
              <div className="h-2 bg-gray-400 rounded w-3/4"></div>
            </div>
            <div className="h-px bg-gray-200 my-3"></div>
            <div className="h-3 bg-gray-600 rounded w-1/3 mb-2"></div>
            <div className="space-y-1">
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          {template.popularity >= 95 && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Popular
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {template.description}
        </p>

        {/* Features */}
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

        {/* Template Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{template.estimatedTime}</span>
          <span className="flex items-center gap-1">
            {isSelected && <Check className="w-4 h-4 text-blue-600" />}
            {template.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
