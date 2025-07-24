import React, { useState } from 'react';
import { Eye, Filter, Search, Star, Zap, User, Briefcase, GraduationCap, Award, Mail, Phone, MapPin, Globe, Calendar, FileText, Code, Target, BookOpen, RefreshCw, Crown, Palette, Brain, Sparkles } from 'lucide-react';
import { CVTemplate } from '../types';
import { TargetMarket } from '../types';
import BackButton from './BackButton';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleTemplateSelect = (template: CVTemplate) => {
    // Store selected template for PDF generation
    localStorage.setItem('mocv_selected_template', template.id);
    localStorage.setItem('mocv_selected_template_data', JSON.stringify(template));
    
    // Store complete template information
    const templateInfo = {
      templateId: template.id,
      templateName: template.name,
      templateDescription: template.description,
      templateCategory: template.category,
      markdownUrl: template.markdownUrl,
      templateData: template
    };
    localStorage.setItem('mocv_selected_template_content', JSON.stringify(templateInfo));
    
    console.log('Template selected in gallery:', template.name, template);
    onTemplateSelect(template);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const generateRealisticThumbnail = (template: CVTemplate) => {
    const colors = {
      'Universal': { bg: 'bg-slate-50', accent: 'bg-blue-600', text: 'text-gray-800', border: 'border-blue-200' },
      'Modern': { bg: 'bg-gradient-to-br from-purple-50 to-pink-50', accent: 'bg-purple-600', text: 'text-gray-900', border: 'border-purple-200' },
      'Technology': { bg: 'bg-green-50', accent: 'bg-green-600', text: 'text-gray-800', border: 'border-green-200' },
      'Consulting': { bg: 'bg-orange-50', accent: 'bg-orange-600', text: 'text-gray-800', border: 'border-orange-200' },
      'Academic': { bg: 'bg-indigo-50', accent: 'bg-indigo-600', text: 'text-gray-800', border: 'border-indigo-200' },
      'Entry Level': { bg: 'bg-teal-50', accent: 'bg-teal-600', text: 'text-gray-800', border: 'border-teal-200' },
      'Transition': { bg: 'bg-yellow-50', accent: 'bg-yellow-600', text: 'text-gray-800', border: 'border-yellow-200' },
      'Executive': { bg: 'bg-gray-100', accent: 'bg-gray-800', text: 'text-gray-900', border: 'border-gray-300' },
      'Creative': { bg: 'bg-gradient-to-br from-pink-50 to-purple-50', accent: 'bg-pink-600', text: 'text-gray-900', border: 'border-pink-200' },
      'AI-Optimized': { bg: 'bg-gradient-to-br from-cyan-50 to-blue-50', accent: 'bg-cyan-600', text: 'text-gray-900', border: 'border-cyan-200' }
    };

    const colorScheme = colors[template.category as keyof typeof colors] || colors['Universal'];

    // Different layouts based on template type
    const renderClassicLayout = () => (
      <div className={`w-full h-64 ${colorScheme.bg} rounded-lg p-4 text-xs ${colorScheme.text} relative overflow-hidden border-2 ${colorScheme.border} shadow-sm`}>
        {/* Header */}
        <div className="text-center mb-3">
          <div className="font-bold text-sm mb-1 text-gray-900">JOHN SMITH</div>
          <div className="text-xs opacity-75">Professional Title</div>
          <div className="flex justify-center items-center gap-2 mt-2 text-xs opacity-60">
            <Mail className="h-3 w-3" />
            <Phone className="h-3 w-3" />
            <MapPin className="h-3 w-3" />
            <Globe className="h-3 w-3" />
          </div>
        </div>

        {/* Two column layout */}
        <div className="flex gap-3 h-40">
          {/* Left sidebar */}
          <div className="w-2/5 space-y-3">
            <div>
              <div className="font-semibold text-xs mb-2 text-gray-700">CONTACT</div>
              <div className="space-y-1">
                <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-1.5 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
            
            <div>
              <div className="font-semibold text-xs mb-2 text-gray-700">SKILLS</div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 bg-gray-300 rounded w-16"></div>
                  <div className={`h-1.5 ${colorScheme.accent} rounded w-10`}></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 bg-gray-300 rounded w-16"></div>
                  <div className={`h-1.5 ${colorScheme.accent} rounded w-8`}></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 bg-gray-300 rounded w-16"></div>
                  <div className={`h-1.5 ${colorScheme.accent} rounded w-12`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="flex-1 space-y-3">
            <div>
              <div className="font-semibold text-xs mb-2 text-gray-700">EXPERIENCE</div>
              <div className="space-y-2">
                <div>
                  <div className="h-1.5 bg-gray-600 rounded w-3/4 mb-1"></div>
                  <div className="h-1 bg-gray-400 rounded w-1/2 mb-1"></div>
                  <div className="h-1 bg-gray-300 rounded w-full"></div>
                  <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                </div>
                <div>
                  <div className="h-1.5 bg-gray-600 rounded w-2/3 mb-1"></div>
                  <div className="h-1 bg-gray-400 rounded w-2/5 mb-1"></div>
                  <div className="h-1 bg-gray-300 rounded w-full"></div>
                  <div className="h-1 bg-gray-300 rounded w-4/5"></div>
                </div>
              </div>
            </div>

            <div>
              <div className="font-semibold text-xs mb-2 text-gray-700">EDUCATION</div>
              <div className="space-y-1">
                <div className="h-1.5 bg-gray-600 rounded w-3/4"></div>
                <div className="h-1 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const renderModernLayout = () => (
      <div className={`w-full h-64 ${colorScheme.bg} rounded-lg p-4 text-xs ${colorScheme.text} relative overflow-hidden border-2 ${colorScheme.border} shadow-sm`}>
        {/* Modern header with accent */}
        <div className={`absolute top-0 left-0 right-0 h-16 ${colorScheme.accent} rounded-t-lg`}></div>
        
        <div className="relative z-10 pt-4">
          {/* Profile section */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div className="text-white">
              <div className="font-bold text-sm">JANE DOE</div>
              <div className="text-xs opacity-90">Modern Professional</div>
            </div>
          </div>

          {/* Content sections */}
          <div className="space-y-3 mt-6">
            <div>
              <div className="font-semibold text-xs mb-2 flex items-center gap-1 text-white">
                <Briefcase className="h-3 w-3" />
                EXPERIENCE
              </div>
              <div className="space-y-2">
                <div className="bg-white bg-opacity-20 rounded p-2">
                  <div className="h-1.5 bg-white bg-opacity-80 rounded w-3/4 mb-1"></div>
                  <div className="h-1 bg-white bg-opacity-60 rounded w-full"></div>
                </div>
                <div className="bg-white bg-opacity-15 rounded p-2">
                  <div className="h-1.5 bg-white bg-opacity-80 rounded w-2/3 mb-1"></div>
                  <div className="h-1 bg-white bg-opacity-60 rounded w-5/6"></div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <div className="font-semibold text-xs mb-1 text-white">SKILLS</div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-white bg-opacity-80 rounded w-full"></div>
                  <div className="h-1.5 bg-white bg-opacity-70 rounded w-4/5"></div>
                  <div className="h-1.5 bg-white bg-opacity-60 rounded w-3/4"></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-xs mb-1 text-white">EDUCATION</div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-white bg-opacity-80 rounded w-full"></div>
                  <div className="h-1 bg-white bg-opacity-60 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const renderTechLayout = () => (
      <div className={`w-full h-64 ${colorScheme.bg} rounded-lg p-4 text-xs ${colorScheme.text} relative overflow-hidden border-2 ${colorScheme.border} shadow-sm font-mono`}>
        {/* Terminal-style header */}
        <div className="bg-gray-900 text-green-400 p-2 rounded mb-3 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="ml-2">developer@portfolio:~$</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Name and title */}
          <div>
            <div className="font-bold text-sm text-gray-900">ALEX DEVELOPER</div>
            <div className="text-xs opacity-75">Full Stack Developer</div>
            <div className="flex gap-2 mt-1 text-xs">
              <span className="bg-blue-100 text-blue-800 px-1 rounded">React</span>
              <span className="bg-green-100 text-green-800 px-1 rounded">Node.js</span>
              <span className="bg-purple-100 text-purple-800 px-1 rounded">Python</span>
            </div>
          </div>

          {/* Projects section */}
          <div>
            <div className="font-semibold text-xs mb-2 flex items-center gap-1 text-gray-700">
              <Award className="h-3 w-3" />
              PROJECTS
            </div>
            <div className="space-y-2">
              <div className="border-l-2 border-green-500 pl-2">
                <div className="h-1.5 bg-gray-600 rounded w-3/4 mb-1"></div>
                <div className="h-1 bg-gray-300 rounded w-full"></div>
                <div className="flex gap-1 mt-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                </div>
              </div>
              <div className="border-l-2 border-blue-500 pl-2">
                <div className="h-1.5 bg-gray-600 rounded w-2/3 mb-1"></div>
                <div className="h-1 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>

          {/* Skills grid */}
          <div>
            <div className="font-semibold text-xs mb-2 text-gray-700">TECH STACK</div>
            <div className="grid grid-cols-3 gap-1">
              <div className="bg-gray-200 rounded p-1 text-center text-xs font-medium">JS</div>
              <div className="bg-gray-200 rounded p-1 text-center text-xs font-medium">React</div>
              <div className="bg-gray-200 rounded p-1 text-center text-xs font-medium">Node</div>
              <div className="bg-gray-200 rounded p-1 text-center text-xs font-medium">SQL</div>
              <div className="bg-gray-200 rounded p-1 text-center text-xs font-medium">AWS</div>
              <div className="bg-gray-200 rounded p-1 text-center text-xs font-medium">Git</div>
            </div>
          </div>
        </div>
      </div>
    );

    const renderExecutiveLayout = () => (
      <div className={`w-full h-64 ${colorScheme.bg} rounded-lg p-4 text-xs ${colorScheme.text} relative overflow-hidden border-2 ${colorScheme.border} shadow-sm`}>
        {/* Executive header */}
        <div className="text-center mb-4 border-b-2 border-gray-300 pb-3">
          <div className="font-bold text-lg mb-1 text-gray-900">EXECUTIVE NAME</div>
          <div className="text-sm opacity-75">Chief Executive Officer</div>
          <div className="flex justify-center items-center gap-3 mt-2 text-xs opacity-60">
            <span>executive@company.com</span>
            <span>•</span>
            <span>+1 (555) 123-4567</span>
          </div>
        </div>

        {/* Executive summary */}
        <div className="mb-3">
          <div className="font-semibold text-xs mb-2 text-gray-700">EXECUTIVE SUMMARY</div>
          <div className="space-y-1">
            <div className="h-1.5 bg-gray-500 rounded w-full"></div>
            <div className="h-1 bg-gray-300 rounded w-full"></div>
            <div className="h-1 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>

        {/* Leadership experience */}
        <div className="mb-3">
          <div className="font-semibold text-xs mb-2 text-gray-700">LEADERSHIP EXPERIENCE</div>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-1.5 bg-gray-600 rounded w-3/4 mb-1"></div>
                <div className="h-1 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="text-xs opacity-60">2020-Present</div>
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-1.5 bg-gray-600 rounded w-2/3 mb-1"></div>
                <div className="h-1 bg-gray-300 rounded w-2/5"></div>
              </div>
              <div className="text-xs opacity-60">2018-2020</div>
            </div>
          </div>
        </div>

        {/* Key achievements */}
        <div>
          <div className="font-semibold text-xs mb-2 text-gray-700">KEY ACHIEVEMENTS</div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div className="h-1 bg-gray-300 rounded flex-1"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div className="h-1 bg-gray-300 rounded flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    );

    // Choose layout based on template category
    switch (template.category) {
      case 'Modern':
      case 'Creative':
        return renderModernLayout();
      case 'Technology':
      case 'AI-Optimized':
        return renderTechLayout();
      case 'Executive':
        return renderExecutiveLayout();
      default:
        return renderClassicLayout();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Templates</h2>
          <p className="text-gray-600 mb-6">Preparing professional CV templates optimized for global markets...</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <BackButton onClick={onBack} label="Back" />
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Choose Your CV Template
                {targetMarket && (
                  <span className="block text-lg text-blue-600 font-normal mt-1">
                    for {targetMarket.flag} {targetMarket.name}
                  </span>
                )}
              </h1>
              <p className="text-gray-600">
                Select a professional template optimized for your industry and career level.
                After selecting a template, you'll proceed to the CV builder.
              </p>
            </div>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="container mx-auto px-4 py-8">
        {/* Template Stats */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-6 bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{filteredTemplates.length}</div>
                <div className="text-xs text-gray-500">Templates</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">ATS</div>
                <div className="text-xs text-gray-500">Optimized</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">Global</div>
                <div className="text-xs text-gray-500">Ready</div>
              </div>
            </div>
          </div>
        </div>
        
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No templates found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search terms or filter criteria to find the perfect template for your needs.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100"
              >
                {/* Realistic Thumbnail */}
                <div className="relative">
                  {generateRealisticThumbnail(template)}
                  
                  {/* Template Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                      {template.category}
                    </span>
                  </div>
                  
                  {/* Overlay buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-3">
                      <button
                        onClick={() => onTemplatePreview(template)}
                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                      >
                        <Zap className="h-4 w-4" />
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-600 mt-1">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{template.name}</h3>
                        <p className="text-sm text-gray-500">{template.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{template.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{template.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onTemplatePreview(template)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Template selected:', template.name);
                        handleTemplateSelect(template);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;