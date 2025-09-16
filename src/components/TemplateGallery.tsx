// TemplateGallery.tsx - Fixed Version with Proper Error Handling
import React, { useState, useMemo, memo, useCallback } from 'react';
import { 
  Search, ChevronLeft, Check, Zap, Palette, Type, Layout, Eye, 
  Heart, Clock, Star, TrendingUp, Download, Filter, Sparkles,
  MapPin, Phone, Mail, Linkedin, Award, Briefcase, GraduationCap,
  User, Code, Lightbulb, Target, BarChart3, X, ChevronRight
} from 'lucide-react';

// Types with proper defaults and validation
interface CVTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'creative' | 'traditional' | 'executive';
  previewUrl?: string;
  markdownUrl?: string;
  thumbnail?: string;
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  popularity: number;
  tags: string[];
}

interface TemplateCustomization {
  colorScheme: 'blue' | 'black' | 'green' | 'purple' | 'red' | 'teal' | 'orange';
  accentColor: string;
  fontStyle: 'modern' | 'classic' | 'minimal';
  headerStyle: 'standard' | 'centered' | 'sidebar';
  spacing: 'compact' | 'balanced' | 'spacious';
}

interface EnhancedCVTemplate extends CVTemplate {
  successRate?: number;
  isPopular?: boolean;
  isNew?: boolean;
  atsScore?: number;
  industryFit?: string[];
  layoutType: 'two-column' | 'single-column' | 'timeline' | 'creative' | 'executive' | 'modern';
  primaryColor: string;
  secondaryColor: string;
  sampleData: {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    linkedin?: string;
    summary: string;
    experiences: Array<{
      role: string;
      company: string;
      duration: string;
      achievements: string[];
    }>;
    skills: Array<{
      name: string;
      level: number;
      category: 'technical' | 'soft' | 'language' | 'tool';
    }>;
    education: Array<{
      degree: string;
      school: string;
      year: string;
      details?: string;
    }>;
  };
}

interface TemplateGalleryProps {
  templates?: CVTemplate[];
  isLoading?: boolean;
  onTemplateSelect: (template: CVTemplate, customization?: TemplateCustomization) => void;
  onTemplatePreview?: (template: CVTemplate) => void;
  onBack: () => void;
}

// Default template data with proper structure
const defaultTemplates: EnhancedCVTemplate[] = [
  {
    id: 'professional-standard',
    name: 'Professional Standard',
    description: 'Traditional two-column layout with clear hierarchy and optimal ATS structure',
    category: 'modern',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Two-Column Layout', 'ATS Optimized', 'Skills Sidebar', 'Clean Typography'],
    difficulty: 'beginner',
    estimatedTime: '15 minutes',
    popularity: 95,
    tags: ['professional', 'ats', 'two-column', 'business'],
    successRate: 94,
    isPopular: true,
    isNew: false,
    atsScore: 98,
    industryFit: ['Finance', 'Consulting', 'Technology', 'Healthcare'],
    layoutType: 'two-column',
    primaryColor: '#2563eb',
    secondaryColor: '#e0e7ff',
    sampleData: {
      name: 'Sarah Mitchell',
      title: 'Senior Business Analyst',
      location: 'New York, NY',
      email: 'sarah.mitchell@email.com',
      phone: '(555) 123-4567',
      linkedin: 'linkedin.com/in/sarahmitchell',
      summary: 'Results-driven Business Analyst with 6+ years of experience in financial services and process optimization.',
      experiences: [
        {
          role: 'Senior Business Analyst',
          company: 'Goldman Sachs',
          duration: '2021 - Present',
          achievements: [
            'Led process optimization initiatives that reduced operational costs by 25%',
            'Managed cross-functional teams of 8+ members across 3 departments'
          ]
        }
      ],
      skills: [
        { name: 'SQL', level: 90, category: 'technical' },
        { name: 'Python', level: 85, category: 'technical' },
        { name: 'Data Analysis', level: 95, category: 'technical' }
      ],
      education: [
        {
          degree: 'MBA, Finance',
          school: 'Wharton School',
          year: '2019',
          details: 'Magna Cum Laude'
        }
      ]
    }
  },
  {
    id: 'creative-professional',
    name: 'Creative Professional',
    description: 'Visually striking design with portfolio integration for creative industries',
    category: 'creative',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Portfolio Showcase', 'Visual Skills Display', 'Creative Layout', 'Brand Integration'],
    difficulty: 'intermediate',
    estimatedTime: '25 minutes',
    popularity: 87,
    tags: ['creative', 'portfolio', 'visual', 'design'],
    successRate: 91,
    isPopular: true,
    isNew: true,
    atsScore: 85,
    industryFit: ['Design', 'Marketing', 'Advertising', 'Media'],
    layoutType: 'creative',
    primaryColor: '#7c3aed',
    secondaryColor: '#f3e8ff',
    sampleData: {
      name: 'Alex Rivera',
      title: 'Creative Director',
      location: 'Los Angeles, CA',
      email: 'alex.rivera@email.com',
      phone: '(555) 987-6543',
      linkedin: 'linkedin.com/in/alexrivera',
      summary: 'Award-winning Creative Director with 8+ years creating compelling visual narratives for global brands.',
      experiences: [
        {
          role: 'Creative Director',
          company: 'Ogilvy & Mather',
          duration: '2022 - Present',
          achievements: [
            'Led creative campaigns that increased client engagement by 150%',
            'Won 3 Cannes Lions for innovative advertising campaigns'
          ]
        }
      ],
      skills: [
        { name: 'Adobe Creative Suite', level: 95, category: 'technical' },
        { name: 'Brand Strategy', level: 88, category: 'soft' }
      ],
      education: [
        {
          degree: 'MFA, Graphic Design',
          school: 'ArtCenter College',
          year: '2016'
        }
      ]
    }
  },
  {
    id: 'tech-focused',
    name: 'Tech Specialist',
    description: 'Developer-optimized layout with prominent technical skills and project showcases',
    category: 'modern',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Technical Skills Grid', 'Project Showcase', 'GitHub Integration', 'Code-Friendly'],
    difficulty: 'intermediate',
    estimatedTime: '18 minutes',
    popularity: 91,
    tags: ['tech', 'developer', 'projects', 'skills'],
    successRate: 93,
    isPopular: true,
    isNew: false,
    atsScore: 97,
    industryFit: ['Technology', 'Engineering', 'Startups', 'Software'],
    layoutType: 'modern',
    primaryColor: '#059669',
    secondaryColor: '#ecfdf5',
    sampleData: {
      name: 'David Kumar',
      title: 'Full Stack Developer',
      location: 'Austin, TX',
      email: 'david.kumar@email.com',
      phone: '(555) 345-6789',
      linkedin: 'linkedin.com/in/davidkumar',
      summary: 'Passionate Full Stack Developer with expertise in React, Node.js, and cloud architecture.',
      experiences: [
        {
          role: 'Senior Full Stack Developer',
          company: 'Stripe',
          duration: '2022 - Present',
          achievements: [
            'Built payment processing features handling $2B+ in transactions',
            'Optimized API performance reducing response time by 60%'
          ]
        }
      ],
      skills: [
        { name: 'React', level: 95, category: 'technical' },
        { name: 'Node.js', level: 90, category: 'technical' }
      ],
      education: [
        {
          degree: 'BS, Computer Science',
          school: 'UT Austin',
          year: '2020'
        }
      ]
    }
  }
];

// Color schemes
const colorSchemes = [
  { id: 'blue', name: 'Professional Blue', color: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-700', secondary: '#e0e7ff' },
  { id: 'black', name: 'Classic Black', color: '#1f2937', bg: 'bg-gray-50', text: 'text-gray-700', secondary: '#f9fafb' },
  { id: 'green', name: 'Success Green', color: '#059669', bg: 'bg-green-50', text: 'text-green-700', secondary: '#ecfdf5' },
  { id: 'purple', name: 'Creative Purple', color: '#7c3aed', bg: 'bg-purple-50', text: 'text-purple-700', secondary: '#f3e8ff' },
  { id: 'red', name: 'Bold Red', color: '#dc2626', bg: 'bg-red-50', text: 'text-red-700', secondary: '#fef2f2' }
];

// Template Card Component
interface TemplateCardProps {
  template: EnhancedCVTemplate;
  isSelected: boolean;
  isFavorited: boolean;
  customization: TemplateCustomization;
  onSelect: (template: CVTemplate) => void;
  onPreview?: (template: CVTemplate) => void;
  onToggleFavorite: (templateId: string) => void;
}

const TemplateCard = memo<TemplateCardProps>(({
  template,
  isSelected,
  isFavorited,
  customization,
  onSelect,
  onPreview,
  onToggleFavorite
}) => {
  // Validate template data before rendering
  if (!template || !template.name || !template.id) {
    console.warn('Invalid template data:', template);
    return null;
  }

  const handleCardClick = useCallback(() => {
    onSelect(template);
  }, [onSelect, template]);

  const handlePreviewClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(template);
  }, [onPreview, template]);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(template.id);
  }, [onToggleFavorite, template.id]);

  const renderPreview = () => {
    const accentColor = customization.accentColor;
    
    return (
      <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4">
          <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: '#1f2937' }}></div>
          <div className="h-2 bg-gray-500 rounded w-1/2 mb-3"></div>
          <div className="h-px bg-gray-200 mb-3"></div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-400 rounded w-full"></div>
            <div className="h-2 bg-gray-400 rounded w-4/5"></div>
            <div className="h-2 bg-gray-400 rounded w-3/4"></div>
          </div>
          <div className="mt-4">
            <div className="h-3 mb-2" style={{ backgroundColor: accentColor, width: '35%' }}></div>
            <div className="space-y-1">
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`
        group relative bg-white border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-300
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg transform -translate-y-1' : 'border-gray-200'}
      `}
      onClick={handleCardClick}
    >
      {/* Template Preview */}
      <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
        <div className="w-full h-full transform transition-transform duration-300 group-hover:scale-105">
          {renderPreview()}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3">
            {onPreview && (
              <button 
                onClick={handlePreviewClick}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            )}
            <button 
              onClick={handleCardClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Use Template</span>
            </button>
          </div>
        </div>

        {/* Badges */}
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
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
            isFavorited
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Template Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{template.estimatedTime}</span>
          <span className={`px-2 py-1 rounded-full font-medium ${
            template.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
            template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {template.difficulty}
          </span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {template.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

TemplateCard.displayName = 'TemplateCard';

// Main TemplateGallery Component
const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates: propTemplates = [],
  isLoading = false,
  onTemplateSelect,
  onTemplatePreview,
  onBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const [customization, setCustomization] = useState<TemplateCustomization>({
    colorScheme: 'blue',
    accentColor: '#2563eb',
    fontStyle: 'modern',
    headerStyle: 'standard',
    spacing: 'balanced'
  });

  // Use provided templates or fallback to defaults with validation
  const templates = useMemo(() => {
    const templatesToUse = propTemplates.length > 0 ? propTemplates : defaultTemplates;
    
    // Validate templates and filter out invalid ones
    return templatesToUse.filter(template => 
      template && 
      template.id && 
      template.name && 
      template.description &&
      template.category
    );
  }, [propTemplates]);

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
        (template.tags && template.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    return filtered;
  }, [templates, selectedCategory, searchQuery]);

  const categories = useMemo(() => [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'modern', name: 'Modern', count: templates.filter(t => t.category === 'modern').length },
    { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length },
    { id: 'traditional', name: 'Traditional', count: templates.filter(t => t.category === 'traditional').length },
    { id: 'executive', name: 'Executive', count: templates.filter(t => t.category === 'executive').length }
  ], [templates]);

  const toggleFavorite = useCallback((templateId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  }, []);

  const handleTemplateSelect = useCallback((template: CVTemplate) => {
    setSelectedTemplate(template.id);
    onTemplateSelect(template, customization);
  }, [customization, onTemplateSelect]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Choose your template</h1>
              <p className="text-gray-600 mt-1">Professional templates with preview and customization</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
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
          </div>

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No templates found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template as EnhancedCVTemplate}
                isSelected={selectedTemplate === template.id}
                isFavorited={favorites.has(template.id)}
                customization={customization}
                onSelect={handleTemplateSelect}
                onPreview={onTemplatePreview}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;
