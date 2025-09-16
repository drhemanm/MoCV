// src/components/TemplateGallery.tsx - Compatible with your existing App.tsx
import React, { useState, useMemo, memo, useCallback } from 'react';
import { 
  Search, ChevronLeft, Eye, Heart, Clock, Star, Download, Sparkles,
  MapPin, Phone, Mail, Linkedin, User, X, ChevronRight
} from 'lucide-react';
import { CVTemplate } from '../types'; // Import your existing types

// Props interface compatible with your current App.tsx
interface TemplateGalleryProps {
  templates?: CVTemplate[];
  isLoading?: boolean;
  onTemplateSelect: (template: CVTemplate) => void;
  onTemplatePreview?: (template: CVTemplate) => void;
  onBack: () => void;
}

// Enhanced template interface for internal use
interface EnhancedCVTemplate extends CVTemplate {
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  layoutType: 'two-column' | 'single-column' | 'creative' | 'executive';
  isPopular?: boolean;
  isNew?: boolean;
}

// Sample data for realistic previews
const sampleProfiles = [
  {
    name: "Jack M. Johnson",
    title: "Computer Software Developer",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    contact: {
      phone: "555-123-4567",
      email: "jack.johnson@email.com",
      address: "New York, NY",
      linkedin: "linkedin.com/in/jackjohnson"
    },
    summary: "Experienced software developer with 8+ years creating scalable web applications and mobile solutions.",
    experience: [
      {
        position: "Senior Software Developer",
        company: "Tech Solutions Inc",
        period: "2020-Present",
        achievements: [
          "Led development of microservices architecture serving 1M+ users",
          "Reduced application load time by 40% through optimization"
        ]
      },
      {
        position: "Full Stack Developer", 
        company: "Digital Innovations",
        period: "2018-2020",
        achievements: [
          "Built responsive web applications using React and Node.js",
          "Collaborated with cross-functional teams on 15+ projects"
        ]
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
    education: [
      {
        degree: "Master in Computer Science",
        school: "MIT",
        year: "2018"
      }
    ]
  },
  {
    name: "Emma Watson",
    title: "Business Development Manager", 
    photo: "https://images.unsplash.com/photo-1494790108755-2616b9e10cf0?w=150&h=150&fit=crop&crop=face",
    contact: {
      phone: "555-987-6543",
      email: "emma.watson@email.com",
      address: "London, UK",
      linkedin: "linkedin.com/in/emmawatson"
    },
    summary: "Strategic business development professional with proven track record of driving growth in competitive markets.",
    experience: [
      {
        position: "Business Development Manager",
        company: "Global Enterprises",
        period: "2021-Present",
        achievements: [
          "Generated $2.5M in new revenue through strategic partnerships",
          "Expanded market presence across 5 new geographic regions"
        ]
      }
    ],
    skills: ["Strategic Planning", "Market Analysis", "Negotiation", "CRM", "Sales", "Leadership"],
    education: [
      {
        degree: "MBA in Business Administration",
        school: "Harvard Business School",
        year: "2020"
      }
    ]
  }
];

// Default professional templates with enhanced properties
const defaultEnhancedTemplates: EnhancedCVTemplate[] = [
  {
    id: 'modern-blue-column',
    name: 'Modern Professional Blue',
    description: 'Clean two-column design with blue accent and professional photo placement',
    category: 'modern',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['ATS Optimized', 'Photo Integration', 'Two-Column Layout', 'Skill Bars'],
    difficulty: 'beginner',
    estimatedTime: '15 minutes',
    popularity: 95,
    tags: ['professional', 'blue', 'modern', 'photo'],
    isPopular: true,
    layoutType: 'two-column',
    colorScheme: {
      primary: '#1e3a8a',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      text: '#1f2937',
      background: '#ffffff'
    }
  },
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    description: 'Minimalist single-column design focusing on content and readability',
    category: 'modern',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Clean Typography', 'Single Column', 'Timeline Layout', 'Minimal Design'],
    difficulty: 'beginner',
    estimatedTime: '12 minutes',
    popularity: 88,
    tags: ['minimal', 'clean', 'simple', 'timeline'],
    layoutType: 'single-column',
    colorScheme: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#6b7280',
      text: '#111827',
      background: '#ffffff'
    }
  },
  {
    id: 'creative-teal',
    name: 'Creative Teal Professional',
    description: 'Modern creative design with teal accents and asymmetric layout',
    category: 'creative',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Creative Layout', 'Color Blocks', 'Modern Typography', 'Visual Impact'],
    difficulty: 'intermediate',
    estimatedTime: '20 minutes',
    popularity: 82,
    tags: ['creative', 'teal', 'modern', 'asymmetric'],
    isNew: true,
    layoutType: 'creative',
    colorScheme: {
      primary: '#0d9488',
      secondary: '#14b8a6',
      accent: '#5eead4',
      text: '#1f2937',
      background: '#ffffff'
    }
  },
  {
    id: 'executive-navy',
    name: 'Executive Navy',
    description: 'Professional executive template with navy header and elegant typography',
    category: 'executive',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Executive Style', 'Navy Header', 'Professional Layout', 'Clean Sections'],
    difficulty: 'intermediate',
    estimatedTime: '18 minutes',
    popularity: 91,
    tags: ['executive', 'navy', 'professional', 'elegant'],
    isPopular: true,
    layoutType: 'executive',
    colorScheme: {
      primary: '#1e293b',
      secondary: '#334155',
      accent: '#64748b',
      text: '#0f172a',
      background: '#ffffff'
    }
  }
];

// Function to enhance templates with visual properties
const enhanceTemplate = (template: CVTemplate): EnhancedCVTemplate => {
  // Find matching enhanced template or use defaults
  const enhanced = defaultEnhancedTemplates.find(t => t.id === template.id);
  if (enhanced) {
    return { ...template, ...enhanced };
  }

  // Default enhancement for unknown templates
  return {
    ...template,
    layoutType: 'single-column',
    colorScheme: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#6b7280',
      text: '#111827',
      background: '#ffffff'
    }
  };
};

// Preview components for different layouts
const ModernBluePreview = ({ profile, template }) => (
  <div className="w-full h-full bg-white shadow-lg overflow-hidden" style={{ fontSize: '10px', lineHeight: '1.2' }}>
    <div className="flex h-full">
      {/* Left sidebar */}
      <div className="w-2/5" style={{ backgroundColor: template.colorScheme.primary }}>
        <div className="p-4 text-white text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 bg-white/20">
            <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <h1 className="font-bold text-lg mb-1 leading-tight">{profile.name}</h1>
          <p className="text-xs opacity-90 mb-3 leading-tight">{profile.title.toUpperCase()}</p>
          <div className="flex justify-center mb-4">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xs">★</span>
            ))}
          </div>
        </div>
        
        <div className="px-4 text-white space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-sm">ABOUT ME</h3>
            <p className="text-xs leading-relaxed opacity-90">{profile.summary}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2 text-sm">CONTACT</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span>{profile.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>{profile.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>{profile.contact.address}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2 text-sm">KEY SKILLS</h3>
            <div className="space-y-2">
              {profile.skills.slice(0, 5).map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{skill}</span>
                    <span>{90 - idx * 5}%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-1">
                    <div 
                      className="bg-white h-1 rounded-full" 
                      style={{ width: `${90 - idx * 5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right content */}
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold text-sm mb-3" style={{ color: template.colorScheme.primary }}>
              WORK EXPERIENCE
            </h2>
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-xs">{exp.position}</h3>
                  <span className="text-xs text-gray-600">{exp.period}</span>
                </div>
                <p className="text-xs font-medium text-gray-700 mb-2">{exp.company}</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="leading-relaxed">• {achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div>
            <h2 className="font-semibold text-sm mb-3" style={{ color: template.colorScheme.primary }}>
              EDUCATION
            </h2>
            {profile.education.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <h3 className="font-semibold text-xs">{edu.degree}</h3>
                <p className="text-xs text-gray-600">{edu.school} • {edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CleanMinimalPreview = ({ profile, template }) => (
  <div className="w-full h-full bg-white shadow-lg overflow-hidden p-6" style={{ fontSize: '10px', lineHeight: '1.3' }}>
    <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: template.colorScheme.primary }}>
      <h1 className="font-bold text-2xl mb-1" style={{ color: template.colorScheme.primary }}>{profile.name.toUpperCase()}</h1>
      <p className="text-sm font-medium text-gray-600 mb-3">{profile.title}</p>
      <div className="flex justify-center items-center gap-6 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <Phone className="w-3 h-3" />
          {profile.contact.phone}
        </span>
        <span className="flex items-center gap-1">
          <Mail className="w-3 h-3" />
          {profile.contact.email}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {profile.contact.address}
        </span>
      </div>
    </div>
    
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: template.colorScheme.primary }}>
          OBJECTIVE
        </h2>
        <p className="text-xs text-gray-700 leading-relaxed">{profile.summary}</p>
      </div>
      
      <div>
        <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: template.colorScheme.primary }}>
          WORK EXPERIENCE
        </h2>
        <div className="space-y-4">
          {profile.experience.map((exp, idx) => (
            <div key={idx} className="relative pl-4">
              <div className="absolute left-0 top-2 w-2 h-2 rounded-full" style={{ backgroundColor: template.colorScheme.accent }}></div>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-xs">{exp.position}</h3>
                  <p className="text-xs text-gray-600">{exp.company}</p>
                </div>
                <span className="text-xs text-gray-500">{exp.period}</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1 mt-2">
                {exp.achievements.map((achievement, i) => (
                  <li key={i}>• {achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: template.colorScheme.primary }}>
            EDUCATION
          </h2>
          {profile.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <h3 className="font-semibold text-xs">{edu.degree}</h3>
              <p className="text-xs text-gray-600">{edu.school}</p>
              <p className="text-xs text-gray-500">{edu.year}</p>
            </div>
          ))}
        </div>
        
        <div>
          <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: template.colorScheme.primary }}>
            SKILLS
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {profile.skills.map((skill, idx) => (
              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Template card component
const TemplateCard = memo(({ template, profile, onSelect, onPreview }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const renderPreview = () => {
    const props = { profile, template };
    
    switch (template.layoutType) {
      case 'two-column':
        return <ModernBluePreview {...props} />;
      case 'single-column':
        return <CleanMinimalPreview {...props} />;
      case 'creative':
        return <CleanMinimalPreview {...props} />; // Fallback for now
      case 'executive':
        return <CleanMinimalPreview {...props} />; // Fallback for now
      default:
        return <ModernBluePreview {...props} />;
    }
  };

  return (
    <div 
      className={`group relative bg-white border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-300
        ${isHovered ? 'transform -translate-y-1 shadow-lg' : 'border-gray-200'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(template)}
    >
      {/* Template Preview */}
      <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
        <div className="w-full h-full transform transition-transform duration-300 group-hover:scale-105">
          {renderPreview()}
        </div>
        
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
            <button 
              onClick={() => onSelect(template)}
              className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-colors text-white"
              style={{ backgroundColor: template.colorScheme?.primary || '#2563eb' }}
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
          {template.features?.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded"
              style={{ 
                backgroundColor: template.colorScheme?.background || '#f8fafc',
                color: template.colorScheme?.primary || '#2563eb',
                border: `1px solid ${template.colorScheme?.accent || '#e2e8f0'}`
              }}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

// Main Gallery Component
const ProfessionalTemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates: propTemplates = [],
  isLoading = false,
  onTemplateSelect,
  onTemplatePreview,
  onBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState(sampleProfiles[0]);
  
  // Use provided templates or fallback to defaults, enhance them with visual properties
  const enhancedTemplates = useMemo(() => {
    const templatesToUse = propTemplates.length > 0 ? propTemplates : defaultEnhancedTemplates;
    return templatesToUse.map(template => enhanceTemplate(template));
  }, [propTemplates]);
  
  const filteredTemplates = useMemo(() => {
    let filtered = enhancedTemplates;
    
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
  }, [enhancedTemplates, searchQuery, selectedCategory]);

  const categories = useMemo(() => [
    { id: 'all', name: 'All Templates', count: enhancedTemplates.length },
    { id: 'modern', name: 'Modern', count: enhancedTemplates.filter(t => t.category === 'modern').length },
    { id: 'creative', name: 'Creative', count: enhancedTemplates.filter(t => t.category === 'creative').length },
    { id: 'traditional', name: 'Traditional', count: enhancedTemplates.filter(t => t.category === 'traditional').length },
    { id: 'executive', name: 'Executive', count: enhancedTemplates.filter(t => t.category === 'executive').length }
  ], [enhancedTemplates]);

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
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Professional CV Templates</h1>
              <p className="text-gray-600 mt-1">Choose from our collection of professionally designed templates</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-4">
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
            <select 
              value={selectedProfile.name}
              onChange={(e) => setSelectedProfile(sampleProfiles.find(p => p.name === e.target.value) || sampleProfiles[0])}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sampleProfiles.map(profile => (
                <option key={profile.name} value={profile.name}>
                  Preview as: {profile.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              profile={selectedProfile}
              onSelect={onTemplateSelect}
              onPreview={onTemplatePreview}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplateGallery;
