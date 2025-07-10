import React, { useState } from 'react';
import { Eye, Filter, Search, Star, Zap, User, Briefcase, GraduationCap, Award, Mail, Phone, MapPin, Globe, Calendar } from 'lucide-react';
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
      'Universal': { bg: 'bg-slate-50', accent: 'bg-blue-600', text: 'text-gray-800' },
      'Modern': { bg: 'bg-gradient-to-br from-purple-50 to-pink-50', accent: 'bg-purple-600', text: 'text-gray-900' },
      'Technology': { bg: 'bg-green-50', accent: 'bg-green-600', text: 'text-gray-800' },
      'Consulting': { bg: 'bg-orange-50', accent: 'bg-orange-600', text: 'text-gray-800' },
      'Academic': { bg: 'bg-indigo-50', accent: 'bg-indigo-600', text: 'text-gray-800' },
      'Entry Level': { bg: 'bg-teal-50', accent: 'bg-teal-600', text: 'text-gray-800' },
      'Transition': { bg: 'bg-yellow-50', accent: 'bg-yellow-600', text: 'text-gray-800' },
      'Executive': { bg: 'bg-gray-100', accent: 'bg-gray-800', text: 'text-gray-900' },
      'Creative': { bg: 'bg-gradient-to-br from-pink-50 to-purple-50', accent: 'bg-pink-600', text: 'text-gray-900' },
      'AI-Optimized': { bg: 'bg-gradient-to-br from-cyan-50 to-blue-50', accent: 'bg-cyan-600', text: 'text-gray-900' }
    };

    const colorScheme = colors[template.category as keyof typeof colors] || colors['Universal'];

    // Different layouts based on template type
    const renderClassicLayout = () => (
      <div className={`w-full h-64 ${colorScheme.bg} rounded-lg p-4 text-xs ${colorScheme.text} relative overflow-hidden border border-gray-200`}>
        {/* Header */}
        <div className="text-center mb-3">
          <div className="font-bold text-sm mb-1">BENJAMIN WALKER</div>
          <div className="text-xs opacity-75">Graphic and Web Designer</div>
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
          <div className="w-1/3 space-y-3">
            <div>
              <div className="font-semibold text-xs mb-1">PERSONAL INFO</div>
              <div className="space-y-1">
                <div className="h-1 bg-gray-300 rounded w-full"></div>
                <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                <div className="h-1 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
            
            <div>
              <div className="font-semibold text-xs mb-1">SKILLS</div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="h-1 bg-gray-300 rounded w-12"></div>
                  <div className={`h-1 ${colorScheme.accent} rounded w-8`}></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 bg-gray-300 rounded w-12"></div>
                  <div className={`h-1 ${colorScheme.accent} rounded w-6`}></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 bg-gray-300 rounded w-12"></div>
                  <div className={`h-1 ${colorScheme.accent} rounded w-10`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="flex-1 space-y-3">
            <div>
              <div className="font-semibold text-xs mb-1">EXPERIENCE</div>
              <div className="space-y-2">
                <div>
                  <div className="h-1 bg-gray-400 rounded w-3/4 mb-1"></div>
                  <div className="h-1 bg-gray-300 rounded w-full"></div>
                  <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                </div>
                <div>
                  <div className="h-1 bg-gray-400 rounded w-2/3 mb-1"></div>
                  <div className="h-1 bg-gray-300 rounded w-full"></div>
                  <div className="h-1 bg-gray-300 rounded w-4/5"></div>
                </div>
              </div>
            </div>

            <div>
              <div className="font-semibold text-xs mb-1">EDUCATION</div>
              <div className="space-y-1">
                <div className="h-1 bg-gray-400 rounded w-3/4"></div>
                <div className="h-1 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const renderModernLayout = () => (
      <div className={`w-full h-64 ${colorScheme.bg} rounded-lg p-4 text-xs ${colorScheme.text} relative overflow-hidden border border-gray-200`}>
        {/* Modern header with accent */}
        <div className={`absolute top-0 left-0 right-0 h-16 ${colorScheme.accent}`}></div>
        
        <div className="relative z-10 pt-4">
          {/* Profile section */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div className="text-white">
              <div className="font-bold text-sm">SARAH JOHNSON</div>
              <div className="text-xs opacity-90">UX/UI Designer</div>
            </div>
          </div>

          {/* Content sections */}
          <div className="space-y-3 mt-6">
            <div>
              <div className="font-semibold text-xs mb-2 flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                EXPERIENCE
              </div>
              <div className="space-y-2">
                <div className="bg-white bg-opacity-50 rounded p-2">
                  <div className="h-1 bg-gray-400 rounded w-3/4 mb-1"></div>
                  <div className="h-1 bg-gray-300 rounded w-full"></div>
                </div>
                <div className="bg-white bg-opacity-30 rounded p-2">
                  <div className="h-1 bg-gray-400 rounded w-2/3 mb-1"></div>
                  <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <div className="font-semibold text-xs mb-1">SKILLS</div>
                <div className="space-y-1">
                  <div className={`h-1 ${colorScheme.accent} rounded w-full`}></div>
                  <div className={`h-1 ${colorScheme.accent} rounded w-4/5`}></div>
                  <div className={`h-1 ${colorScheme.accent} rounded w-3/4`}></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-xs mb-1">EDUCATION</div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-400 rounded w-full"></div>
                  <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const renderTechLayout = () => (
      <div className={`w-full h-64 ${colorScheme.bg} rounded-lg p-4 text-xs ${colorScheme.text} relative overflow-hidden border border-gray-200 font-mono`}>
        {/* Terminal-style header */}
        <div className="bg-gray-800 text-green-400 p-2 rounded-t mb-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="ml-2">alex_dev@portfolio:~$</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Name and title */}
          <div>
            <div className="font-bold text-sm">ALEX RODRIGUEZ</div>
            <div className="text-xs opacity-75">Full Stack Developer</div>
            <div className="flex gap-2 mt-1 text-xs">
              <span className="bg-blue-100 text-blue-800 px-1 rounded">React</span>
              <span className="bg-green-100 text-green-800 px-1 rounded">Node.js</span>
              <span className="bg-purple-100 text-purple-800 px-1 rounded">Python</span>
            </div>
          </div>

          {/* Projects section */}
          <div>
            <div className="font-semibold text-xs mb-2 flex items-center gap-1">
              <Award className="h-3 w-3" />
              PROJECTS
            </div>
            <div className="space-y-2">
              <div className="border-l-2 border-green-500 pl-2">
                <div className="h-1 bg-gray-400 rounded w-3/4 mb-1"></div>
                <div className="h-1 bg-gray-300 rounded w-full"></div>
                <div className="flex gap-1 mt-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                </div>
              </div>
              <div className="border-l-2 border-blue-500 pl-2">
                <div className="h-1 bg-gray-400 rounded w-2/3 mb-1"></div>
                <div className="h-1 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>

          {/* Skills grid */}
          <div>
            <div className="font-semibold text-xs mb-2">TECH STACK</div>
            <div className="grid grid-cols-3 gap-1">
              <div className="bg-gray-200 rounded p-1 text-center">JS</div>
              <div className="bg-gray-200 rounded p-1 text-center">React</div>
              <div className="bg-gray-200 rounded p-1 text-center">Node</div>
              <div className="bg-gray-200 rounded p-1 text-center">SQL</div>
              <div className="bg-gray-200 rounded p-1 text-center">AWS</div>
              <div className="bg-gray-200 rounded p-1 text-center">Git</div>
            </div>
          </div>
        </div>
      </div>
    );

    const renderExecutiveLayout = () => (
      <div className={`w-full h-64 ${colorScheme.bg} rounded-lg p-4 text-xs ${colorScheme.text} relative overflow-hidden border border-gray-200`}>
        {/* Executive header */}
        <div className="text-center mb-4 border-b border-gray-300 pb-3">
          <div className="font-bold text-lg mb-1">MICHAEL CHEN</div>
          <div className="text-sm opacity-75">Chief Technology Officer</div>
          <div className="flex justify-center items-center gap-3 mt-2 text-xs opacity-60">
            <span>michael.chen@company.com</span>
            <span>•</span>
            <span>+1 (555) 123-4567</span>
          </div>
        </div>

        {/* Executive summary */}
        <div className="mb-3">
          <div className="font-semibold text-xs mb-1">EXECUTIVE SUMMARY</div>
          <div className="space-y-1">
            <div className="h-1 bg-gray-400 rounded w-full"></div>
            <div className="h-1 bg-gray-300 rounded w-full"></div>
            <div className="h-1 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>

        {/* Leadership experience */}
        <div className="mb-3">
          <div className="font-semibold text-xs mb-1">LEADERSHIP EXPERIENCE</div>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-1 bg-gray-500 rounded w-3/4 mb-1"></div>
                <div className="h-1 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="text-xs opacity-60">2020-Present</div>
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-1 bg-gray-500 rounded w-2/3 mb-1"></div>
                <div className="h-1 bg-gray-300 rounded w-2/5"></div>
              </div>
              <div className="text-xs opacity-60">2018-2020</div>
            </div>
          </div>
        </div>

        {/* Key achievements */}
        <div>
          <div className="font-semibold text-xs mb-1">KEY ACHIEVEMENTS</div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading professional templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <BackButton onClick={onBack} label="Back" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Choose Your Template</h1>
              <p className="text-gray-600">
                Select a professional template that matches your industry
                {targetMarket && ` • Optimized for ${targetMarket.flag} ${targetMarket.name}`}
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
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No templates found</div>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {/* Realistic Thumbnail */}
                <div className="relative">
                  {generateRealisticThumbnail(template)}
                  
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
                        onClick={() => onTemplateSelect(template)}
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
                    <div className="flex items-center gap-3">
                      <div className="text-blue-600">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-500">{template.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>

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
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => onTemplateSelect(template)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Star className="h-4 w-4" />
                      Use Template
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