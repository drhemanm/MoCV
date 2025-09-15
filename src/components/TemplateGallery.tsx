// src/components/TemplateGallery.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Grid, List, Eye, Download, Star, Clock, 
  Zap, Crown, Sparkles, TrendingUp, Award, ChevronDown,
  ArrowRight, Heart, Share2, Bookmark, Users, BarChart3,
  Palette, Code, Briefcase, GraduationCap, Stethoscope,
  Calculator, Hammer, Mic, Target, CheckCircle, X,
  SortAsc, SortDesc, RefreshCw, Layout, FileText
} from 'lucide-react';
import { CVTemplate, TargetMarket } from '../types';
import { BackButton } from './BackButton';
import { LoadingSpinner, LoadingSkeleton } from './LoadingSpinner';

interface TemplateGalleryProps {
  targetMarket: TargetMarket | null;
  templates: CVTemplate[];
  isLoading: boolean;
  onTemplateSelect: (template: CVTemplate) => void;
  onTemplatePreview: (template: CVTemplate) => void;
  onBack: () => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  targetMarket,
  templates,
  isLoading,
  onTemplateSelect,
  onTemplatePreview,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'newest'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('mocv_favorite_templates');
    if (stored) {
      try {
        setFavoriteTemplates(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading favorite templates:', error);
      }
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (templateId: string) => {
    const newFavorites = favoriteTemplates.includes(templateId)
      ? favoriteTemplates.filter(id => id !== templateId)
      : [...favoriteTemplates, templateId];
    
    setFavoriteTemplates(newFavorites);
    localStorage.setItem('mocv_favorite_templates', JSON.stringify(newFavorites));
  };

  // Filter and sort templates
  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = [...templates];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(template => template.difficulty === selectedDifficulty);
    }

    // Sort templates
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        // In real app, you'd sort by creation date
        filtered.reverse();
        break;
    }

    return filtered;
  }, [templates, searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  // Category counts
  const categoryStats = useMemo(() => {
    const stats = {
      all: templates.length,
      modern: 0,
      classic: 0,
      creative: 0,
      minimal: 0
    };

    templates.forEach(template => {
      if (template.category in stats) {
        stats[template.category as keyof typeof stats]++;
      }
    });

    return stats;
  }, [templates]);

  const categories = [
    { id: 'all', name: 'All Templates', icon: Layout, count: categoryStats.all },
    { id: 'modern', name: 'Modern', icon: Zap, count: categoryStats.modern },
    { id: 'classic', name: 'Classic', icon: Crown, count: categoryStats.classic },
    { id: 'creative', name: 'Creative', icon: Palette, count: categoryStats.creative },
    { id: 'minimal', name: 'Minimal', icon: Target, count: categoryStats.minimal }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const sortOptions = [
    { id: 'popularity', name: 'Most Popular', icon: TrendingUp },
    { id: 'name', name: 'Name (A-Z)', icon: SortAsc },
    { id: 'newest', name: 'Newest First', icon: Clock }
  ];

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'modern': return Zap;
      case 'classic': return Crown;
      case 'creative': return Palette;
      case 'minimal': return Target;
      default: return FileText;
    }
  };

  // Industry-specific recommendations
  const getIndustryRecommendations = () => {
    if (!targetMarket) return [];
    
    // Simple recommendation logic based on target market
    const recommendations = templates.filter(template => {
      if (targetMarket.id === 'technology') {
        return template.tags.includes('tech') || template.category === 'modern';
      }
      if (targetMarket.id === 'design') {
        return template.category === 'creative' || template.tags.includes('creative');
      }
      if (targetMarket.id === 'finance' || targetMarket.id === 'business') {
        return template.category === 'classic' || template.tags.includes('professional');
      }
      return template.popularity > 80;
    });

    return recommendations.slice(0, 3);
  };

  const recommendedTemplates = getIndustryRecommendations();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <BackButton onClick={onBack} variant="minimal" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingSkeleton key={index} card className="h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <BackButton onClick={onBack} variant="minimal" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {targetMarket ? `Templates for ${targetMarket.name}` : 'Choose Your Template'}
              </h1>
              <p className="text-gray-600 mt-1">
                {targetMarket 
                  ? `Professional templates optimized for ${targetMarket.name.toLowerCase()} roles`
                  : 'Select from our collection of professional CV templates'
                }
              </p>
            </div>
            
            {/* Stats */}
            <div className="hidden lg:flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{templates.length} Templates</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>50K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.9 Rating</span>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates by name, style, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white/80 text-gray-700 rounded-xl hover:bg-white transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`
                            w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left
                            ${selectedCategory === category.id
                              ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                              : 'bg-white hover:bg-gray-50 border border-gray-200'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{category.count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty</label>
                  <div className="space-y-2">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty.id}
                        onClick={() => setSelectedDifficulty(difficulty.id)}
                        className={`
                          w-full p-3 rounded-lg transition-colors text-left
                          ${selectedDifficulty === difficulty.id
                            ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                            : 'bg-white hover:bg-gray-50 border border-gray-200'
                          }
                        `}
                      >
                        <span className="font-medium">{difficulty.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
                  <div className="space-y-2">
                    {sortOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setSortBy(option.id as any)}
                          className={`
                            w-full flex items-center gap-2 p-3 rounded-lg transition-colors text-left
                            ${sortBy === option.id
                              ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                              : 'bg-white hover:bg-gray-50 border border-gray-200'
                            }
                          `}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="font-medium">{option.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setSortBy('popularity');
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Recommended Templates */}
        {targetMarket && recommendedTemplates.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended for {targetMarket.name}
              </h2>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                AI Selected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {recommendedTemplates.map((template, index) => {
                const CategoryIcon = getCategoryIcon(template.category);
                return (
                  <div
                    key={`rec-${template.id}`}
                    className="relative group cursor-pointer transition-all duration-300 transform hover:scale-105"
                    onClick={() => onTemplateSelect(template)}
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                  >
                    {/* Recommended Badge */}
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ⭐ Recommended
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-blue-200">
                      {/* Template Preview */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <FileText className="h-16 w-16 text-gray-400" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        {/* Quick Actions */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTemplatePreview(template);
                            }}
                            className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                          >
                            <Eye className="h-4 w-4 text-gray-700" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(template.id);
                            }}
                            className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                          >
                            <Heart className={`h-4 w-4 ${
                              favoriteTemplates.includes(template.id) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-700'
                            }`} />
                          </button>
                        </div>
                      </div>

                      {/* Template Info */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{template.name}</h3>
                            <p className="text-gray-600 text-sm">{template.description}</p>
                          </div>
                          <CategoryIcon className="h-5 w-5 text-gray-400" />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">{template.popularity}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-600">{template.estimatedTime}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                            {template.difficulty}
                          </span>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.features.slice(0, 2).map((feature, featureIndex) => (
                            <span
                              key={featureIndex}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                          {template.features.length > 2 && (
                            <span className="text-gray-500 text-xs">+{template.features.length - 2} more</span>
                          )}
                        </div>

                        {/* Action Button */}
                        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium flex items-center justify-center gap-2">
                          <span>Use This Template</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchTerm ? `Search Results (${filteredAndSortedTemplates.length})` : 'All Templates'}
          </h2>
          <div className="text-sm text-gray-500">
            {filteredAndSortedTemplates.length} of {templates.length} templates
          </div>
        </div>

        {/* Templates Grid/List */}
        {filteredAndSortedTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No templates found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your search terms or filters to find the perfect template for your needs.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }
          `}>
            {filteredAndSortedTemplates.map((template, index) => {
              const CategoryIcon = getCategoryIcon(template.category);
              const isHovered = hoveredTemplate === template.id;
              
              if (viewMode === 'list') {
                return (
                  <div
                    key={template.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border border-gray-100"
                    onClick={() => onTemplateSelect(template)}
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                  >
                    <div className="flex items-center gap-6">
                      {/* Preview Thumbnail */}
                      <div className="w-24 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{template.name}</h3>
                            <p className="text-gray-600">{template.description}</p>
                          </div>
                          <CategoryIcon className="h-5 w-5 text-gray-400" />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">{template.popularity}% popularity</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-600">{template.estimatedTime}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                            {template.difficulty}
                          </span>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.features.map((feature, featureIndex) => (
                            <span
                              key={featureIndex}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTemplatePreview(template);
                          }}
                          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Eye className="h-5 w-5 text-gray-700" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(template.id);
                          }}
                          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Heart className={`h-5 w-5 ${
                            favoriteTemplates.includes(template.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-700'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // Grid view
              return (
                <div
                  key={template.id}
                  className="relative group cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  onClick={() => onTemplateSelect(template)}
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full border border-gray-100">
                    {/* Template Preview */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <FileText className="h-16 w-16 text-gray-400" />
                      
                      {/* Popularity Badge */}
                      {template.popularity >= 90 && (
                        <div className="absolute top-3 left-3">
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Hot
                          </div>
                        </div>
                      )}
                      
                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTemplatePreview(template);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-sm"
                        >
                          <Eye className="h-4 w-4 text-gray-700" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(template.id);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-sm"
                        >
                          <Heart className={`h-4 w-4 ${
                            favoriteTemplates.includes(template.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-700'
                          }`} />
                        </button>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Template Info */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {template.name}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{template.description}</p>
                        </div>
                        <CategoryIcon className="h-5 w-5 text-gray-400 ml-2" />
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">{template.popularity}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{template.estimatedTime}</span>
                        </div>
                      </div>

                      {/* Difficulty and Category */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">{template.category}</span>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.features.slice(0, 2).map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 2 && (
                          <span className="text-gray-500 text-xs">+{template.features.length - 2}</span>
                        )}
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2 group">
                        <span>Use Template</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* Hover Effect */}
                    {isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl transition-opacity duration-300"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredAndSortedTemplates.length >= 12 && (
          <div className="text-center mt-12">
            <button className="bg-white text-gray-700 px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
              Load More Templates
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;
