// src/components/TemplateGallery.tsx
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Star, Eye, Download, ArrowLeft, 
  Grid, List, Zap, Crown, CheckCircle, Heart,
  Palette, Layout, Target, Users, Briefcase
} from 'lucide-react';
import { CVTemplate } from '../types';
import BackButton from './BackButton';

interface TemplateGalleryProps {
  onSelectTemplate: (template: CVTemplate) => void;
  onBack: () => void;
  selectedTemplateId?: string;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  onBack,
  selectedTemplateId
}) => {
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<CVTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'newest'>('popularity');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock template data - in production, this would come from an API
  const mockTemplates: CVTemplate[] = [
    {
      id: 'modern-professional',
      name: 'Modern Professional',
      description: 'Clean and contemporary design perfect for corporate roles',
      category: 'modern',
      previewUrl: '/templates/modern-professional-preview.jpg',
      markdownUrl: '/templates/modern-professional.md',
      thumbnail: '/templates/modern-professional-thumb.jpg',
      features: ['ATS Optimized', 'Two Column Layout', 'Professional Colors', 'Icon Support'],
      difficulty: 'beginner',
      estimatedTime: '15 minutes',
      popularity: 95,
      tags: ['corporate', 'business', 'executive', 'finance', 'consulting']
    },
    {
      id: 'creative-designer',
      name: 'Creative Designer',
      description: 'Bold and artistic layout for creative professionals',
      category: 'creative',
      previewUrl: '/templates/creative-designer-preview.jpg',
      markdownUrl: '/templates/creative-designer.md',
      thumbnail: '/templates/creative-designer-thumb.jpg',
      features: ['Visual Appeal', 'Portfolio Section', 'Color Customization', 'Graphics Support'],
      difficulty: 'intermediate',
      estimatedTime: '25 minutes',
      popularity: 88,
      tags: ['design', 'creative', 'marketing', 'advertising', 'media']
    },
    {
      id: 'tech-minimal',
      name: 'Tech Minimal',
      description: 'Streamlined design focused on technical skills and achievements',
      category: 'minimal',
      previewUrl: '/templates/tech-minimal-preview.jpg',
      markdownUrl: '/templates/tech-minimal.md',
      thumbnail: '/templates/tech-minimal-thumb.jpg',
      features: ['Skills Focused', 'GitHub Integration', 'Project Showcase', 'Code-Friendly'],
      difficulty: 'beginner',
      estimatedTime: '12 minutes',
      popularity: 92,
      tags: ['technology', 'software', 'engineering', 'startup', 'development']
    },
    {
      id: 'classic-academic',
      name: 'Classic Academic',
      description: 'Traditional format ideal for academic and research positions',
      category: 'classic',
      previewUrl: '/templates/classic-academic-preview.jpg',
      markdownUrl: '/templates/classic-academic.md',
      thumbnail: '/templates/classic-academic-thumb.jpg',
      features: ['Publication Ready', 'Research Focus', 'Bibliography Support', 'Academic Standards'],
      difficulty: 'advanced',
      estimatedTime: '30 minutes',
      popularity: 78,
      tags: ['academic', 'research', 'education', 'science', 'university']
    },
    {
      id: 'executive-premium',
      name: 'Executive Premium',
      description: 'Sophisticated design for C-level and senior management roles',
      category: 'modern',
      previewUrl: '/templates/executive-premium-preview.jpg',
      markdownUrl: '/templates/executive-premium.md',
      thumbnail: '/templates/executive-premium-thumb.jpg',
      features: ['Leadership Focus', 'Achievement Highlights', 'Premium Layout', 'Executive Summary'],
      difficulty: 'intermediate',
      estimatedTime: '20 minutes',
      popularity: 85,
      tags: ['executive', 'management', 'leadership', 'ceo', 'director']
    },
    {
      id: 'fresh-graduate',
      name: 'Fresh Graduate',
      description: 'Entry-level friendly template highlighting education and potential',
      category: 'minimal',
      previewUrl: '/templates/fresh-graduate-preview.jpg',
      markdownUrl: '/templates/fresh-graduate.md',
      thumbnail: '/templates/fresh-graduate-thumb.jpg',
      features: ['Education Focus', 'Skills Emphasis', 'Clean Layout', 'Entry-Level Optimized'],
      difficulty: 'beginner',
      estimatedTime: '10 minutes',
      popularity: 90,
      tags: ['graduate', 'entry-level', 'student', 'internship', 'junior']
    }
  ];

  useEffect(() => {
    // Simulate loading templates
    const loadTemplates = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setTemplates(mockTemplates);
      setFilteredTemplates(mockTemplates);
      setIsLoading(false);
    };

    loadTemplates();

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('mocv_favorite_templates');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy, templates]);

  const filterTemplates = () => {
    let filtered = [...templates];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(template => template.difficulty === selectedDifficulty);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return a.id.localeCompare(b.id); // Mock newest sort
        default:
          return 0;
      }
    });

    setFilteredTemplates(filtered);
  };

  const toggleFavorite = (templateId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('mocv_favorite_templates', JSON.stringify([...newFavorites]));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'modern': return <Zap className="h-4 w-4" />;
      case 'creative': return <Palette className="h-4 w-4" />;
      case 'minimal': return <Layout className="h-4 w-4" />;
      case 'classic': return <Briefcase className="h-4 w-4" />;
      default: return <Layout className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'modern', name: 'Modern', count: templates.filter(t => t.category === 'modern').length },
    { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length },
    { id: 'minimal', name: 'Minimal', count: templates.filter(t => t.category === 'minimal').length },
    { id: 'classic', name: 'Classic', count: templates.filter(t => t.category === 'classic').length }
  ];

  const TemplateCard: React.FC<{ template: CVTemplate; isCompact?: boolean }> = ({ 
    template, 
    isCompact = false 
  }) => (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group ${
      selectedTemplateId === template.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
    }`}>
      {/* Template Preview */}
      <div className="relative">
        <div className={`bg-gray-100 ${isCompact ? 'h-32' : 'h-48'} flex items-center justify-center`}>
          <div className="text-center text-gray-500">
            <Layout className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Template Preview</p>
          </div>
        </div>
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
            <button
              onClick={() => setPreviewTemplate(template)}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Preview Template"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSelectTemplate(template)}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              title="Use Template"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(template.id)}
          className="absolute top-3 right-3 p-1.5 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
        >
          <Heart 
            className={`h-4 w-4 ${
              favorites.has(template.id) 
                ? 'text-red-500 fill-current' 
                : 'text-gray-400'
            }`} 
          />
        </button>

        {/* Popularity Badge */}
        {template.popularity > 90 && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Popular
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className={`p-${isCompact ? '3' : '4'}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold text-gray-900 ${isCompact ? 'text-sm' : 'text-base'}`}>
            {template.name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-xs text-gray-600">{template.popularity}</span>
          </div>
        </div>

        <p className={`text-gray-600 mb-3 ${isCompact ? 'text-xs' : 'text-sm'}`}>
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, isCompact ? 2 : 3).map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {template.tags.length > (isCompact ? 2 : 3) && (
            <span className="text-gray-500 text-xs">+{template.tags.length - (isCompact ? 2 : 3)}</span>
          )}
        </div>

        {/* Features */}
        {!isCompact && (
          <div className="space-y-1 mb-3">
            {template.features.slice(0, 2).map(feature => (
              <div key={feature} className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {feature}
              </div>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {getCategoryIcon(template.category)}
            <span className="capitalize">{template.category}</span>
          </div>
          <div className={`px-2 py-1 rounded-full ${getDifficultyColor(template.difficulty)}`}>
            {template.difficulty}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setPreviewTemplate(template)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Preview
          </button>
          <button
            onClick={() => onSelectTemplate(template)}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} label="Back" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CV Templates</h1>
                <p className="text-gray-600">Choose a professional template to get started</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="popularity">Most Popular</option>
                <option value="name">Name A-Z</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-28">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Templates</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or tag..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        selectedCategory === category.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category.id)}
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty</label>
                <div className="space-y-2">
                  {['all', 'beginner', 'intermediate', 'advanced'].map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`w-full text-left p-2 rounded-lg border transition-colors capitalize ${
                        selectedDifficulty === difficulty
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{difficulty}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                </h2>
                {searchTerm && (
                  <p className="text-sm text-gray-600">
                    Results for "{searchTerm}"
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              /* No Results */
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              /* Templates Grid/List */
              <div className={
                viewMode === 'grid' 
                  ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredTemplates.map(template => (
                  <TemplateCard 
                    key={template.id} 
                    template={template}
                    isCompact={viewMode === 'list'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{previewTemplate.name}</h3>
                <p className="text-gray-600">{previewTemplate.description}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center text-gray-500">
                  <Layout className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">Template Preview</p>
                  <p className="text-sm">Full preview coming soon</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onSelectTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
