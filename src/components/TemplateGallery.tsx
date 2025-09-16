import React, { useState, useMemo, memo, useCallback } from 'react';
import { 
  Search, ChevronLeft, Eye, Heart, Clock, Star, Download, Sparkles,
  MapPin, Phone, Mail, Linkedin, User, X, Award, Globe, CheckCircle,
  Calendar, ExternalLink, Shield, Zap
} from 'lucide-react';

// Professional template interface
interface ProfessionalTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'creative' | 'executive' | 'minimal' | 'ats-optimized';
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  popularity: number;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
  isPremium?: boolean;
  isATSFriendly: boolean;
  layoutType: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    surface: string;
  };
}

// Realistic sample profile
const sampleProfile = {
  name: "Sarah Mitchell",
  title: "Senior Business Analyst",
  initials: "SM",
  contact: {
    phone: "(555) 123-4567",
    email: "sarah.mitchell@email.com",
    address: "New York, NY",
    linkedin: "linkedin.com/in/sarahmitchell"
  },
  summary: "Results-driven Business Analyst with 6+ years of experience optimizing business processes and driving data-driven decision making. Proven track record of reducing operational costs by 25% and improving efficiency across cross-functional teams.",
  experience: [
    {
      position: "Senior Business Analyst",
      company: "Goldman Sachs",
      period: "2021 - Present",
      achievements: [
        "Led process optimization initiatives reducing operational costs by 25%",
        "Managed cross-functional teams of 8+ members across 3 departments",
        "Implemented automated reporting systems saving 40+ hours monthly"
      ]
    },
    {
      position: "Business Analyst",
      company: "JPMorgan Chase", 
      period: "2019 - 2021",
      achievements: [
        "Developed automated reporting systems improving accuracy by 35%",
        "Collaborated with stakeholders to define business requirements",
        "Led data analysis projects resulting in $2M cost savings"
      ]
    }
  ],
  skills: [
    { name: "Business Analysis", level: 95 },
    { name: "Data Analysis", level: 90 },
    { name: "SQL", level: 85 },
    { name: "Project Management", level: 88 },
    { name: "Process Optimization", level: 92 },
    { name: "Stakeholder Management", level: 90 }
  ],
  education: [
    {
      degree: "MBA, Finance",
      school: "Wharton School",
      year: "2019",
      details: "Magna Cum Laude"
    },
    {
      degree: "BS, Economics", 
      school: "NYU Stern",
      year: "2017"
    }
  ]
};

// Professional template definitions with ATS focus
const professionalTemplates: ProfessionalTemplate[] = [
  {
    id: 'ats-professional',
    name: 'ATS Professional',
    description: 'Clean, ATS-optimized template designed to pass through applicant tracking systems',
    category: 'ats-optimized',
    features: ['ATS Optimized', 'Clean Layout', 'Standard Fonts', 'Simple Structure'],
    difficulty: 'beginner',
    estimatedTime: '10 minutes',
    popularity: 98,
    tags: ['ats', 'professional', 'clean', 'optimized'],
    isPopular: true,
    isATSFriendly: true,
    layoutType: 'ats-single-column',
    colorScheme: {
      primary: '#2563eb',
      secondary: '#1e40af', 
      accent: '#3b82f6',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f8fafc'
    }
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'Sophisticated executive template with professional styling and visual impact',
    category: 'executive',
    features: ['Executive Style', 'Professional Photo', 'Premium Design', 'Leadership Focus'],
    difficulty: 'intermediate',
    estimatedTime: '18 minutes',
    popularity: 94,
    tags: ['executive', 'premium', 'leadership', 'professional'],
    isPremium: true,
    isATSFriendly: false,
    layoutType: 'executive-two-column',
    colorScheme: {
      primary: '#1e293b',
      secondary: '#334155',
      accent: '#0ea5e9',
      text: '#0f172a', 
      background: '#ffffff',
      surface: '#f1f5f9'
    }
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Contemporary design perfect for technology and startup professionals',
    category: 'modern',
    features: ['Modern Design', 'Tech Optimized', 'Skills Focus', 'Project Showcase'],
    difficulty: 'intermediate',
    estimatedTime: '15 minutes',
    popularity: 91,
    tags: ['modern', 'tech', 'startup', 'skills'],
    isNew: true,
    isATSFriendly: true,
    layoutType: 'modern-hybrid',
    colorScheme: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f0fdf4'
    }
  },
  {
    id: 'creative-professional',
    name: 'Creative Professional',
    description: 'Balanced creative design that maintains professional standards',
    category: 'creative',
    features: ['Creative Elements', 'Professional Balance', 'Visual Appeal', 'Brand Integration'],
    difficulty: 'advanced',
    estimatedTime: '22 minutes',
    popularity: 86,
    tags: ['creative', 'design', 'marketing', 'visual'],
    isATSFriendly: false,
    layoutType: 'creative-balanced',
    colorScheme: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#a78bfa',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#faf5ff'
    }
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    description: 'Clean, minimal design focusing on content and readability',
    category: 'minimal',
    features: ['Minimal Design', 'Clean Typography', 'Content Focus', 'Elegant Spacing'],
    difficulty: 'beginner',
    estimatedTime: '12 minutes',
    popularity: 89,
    tags: ['minimal', 'clean', 'elegant', 'simple'],
    isATSFriendly: true,
    layoutType: 'minimal-single',
    colorScheme: {
      primary: '#374151',
      secondary: '#4b5563',
      accent: '#6b7280',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f9fafb'
    }
  }
];

// ATS-Optimized Preview Component
const ATSProfessionalPreview = ({ profile, template }) => (
  <div className="w-full h-full bg-white shadow-lg border border-gray-200 overflow-hidden" style={{ fontSize: '8px', lineHeight: '1.3' }}>
    <div className="p-4 space-y-4">
      {/* Header - ATS Friendly */}
      <div className="text-center border-b border-gray-300 pb-3">
        <h1 className="text-lg font-bold mb-1" style={{ color: template.colorScheme.primary }}>
          {profile.name.toUpperCase()}
        </h1>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">{profile.title}</h2>
        <div className="text-xs text-gray-600 space-y-1">
          <div>{profile.contact.phone} | {profile.contact.email}</div>
          <div>{profile.contact.address} | {profile.contact.linkedin}</div>
        </div>
      </div>

      {/* Professional Summary */}
      <div>
        <h3 className="text-sm font-bold mb-2" style={{ color: template.colorScheme.primary }}>
          PROFESSIONAL SUMMARY
        </h3>
        <p className="text-xs leading-relaxed text-gray-700">{profile.summary}</p>
      </div>

      {/* Professional Experience */}
      <div>
        <h3 className="text-sm font-bold mb-2" style={{ color: template.colorScheme.primary }}>
          PROFESSIONAL EXPERIENCE
        </h3>
        <div className="space-y-3">
          {profile.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h4 className="font-bold text-xs">{exp.position}</h4>
                  <p className="text-xs font-semibold text-gray-700">{exp.company}</p>
                </div>
                <span className="text-xs text-gray-600">{exp.period}</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-0.5 ml-3">
                {exp.achievements.slice(0, 2).map((achievement, i) => (
                  <li key={i} className="list-disc">• {achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Skills - ATS Friendly List */}
      <div>
        <h3 className="text-sm font-bold mb-2" style={{ color: template.colorScheme.primary }}>
          CORE COMPETENCIES
        </h3>
        <div className="text-xs text-gray-700">
          {profile.skills.map(skill => skill.name).join(' • ')}
        </div>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-sm font-bold mb-2" style={{ color: template.colorScheme.primary }}>
          EDUCATION
        </h3>
        <div className="space-y-1">
          {profile.education.map((edu, idx) => (
            <div key={idx} className="text-xs">
              <div className="font-semibold">{edu.degree}</div>
              <div className="text-gray-700">{edu.school}, {edu.year}</div>
              {edu.details && <div className="text-gray-600">{edu.details}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Executive Two-Column Preview
const ExecutivePremiumPreview = ({ profile, template }) => (
  <div className="w-full h-full bg-white shadow-lg overflow-hidden" style={{ fontSize: '8px', lineHeight: '1.3' }}>
    <div className="flex h-full">
      {/* Left sidebar */}
      <div className="w-1/3 p-3 text-white" style={{ backgroundColor: template.colorScheme.primary }}>
        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold" 
               style={{ backgroundColor: template.colorScheme.accent }}>
            {profile.initials}
          </div>
          <h1 className="font-bold text-sm leading-tight">{profile.name}</h1>
          <p className="text-xs opacity-90 mt-1">{profile.title}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-xs mb-2">CONTACT</h3>
            <div className="text-xs space-y-1 opacity-90">
              <div className="flex items-center gap-1">
                <Phone className="w-2 h-2" />
                <span>{profile.contact.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-2 h-2" />
                <span className="break-all">{profile.contact.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-2 h-2" />
                <span>{profile.contact.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-xs mb-2">SKILLS</h3>
            <div className="space-y-2">
              {profile.skills.slice(0, 6).map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-1">
                    <div 
                      className="h-1 rounded-full" 
                      style={{ backgroundColor: template.colorScheme.accent, width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 p-3 space-y-4">
        <div>
          <h3 className="font-bold text-xs mb-2" style={{ color: template.colorScheme.primary }}>
            EXECUTIVE SUMMARY
          </h3>
          <p className="text-xs leading-relaxed text-gray-700">{profile.summary}</p>
        </div>

        <div>
          <h3 className="font-bold text-xs mb-2" style={{ color: template.colorScheme.primary }}>
            PROFESSIONAL EXPERIENCE
          </h3>
          <div className="space-y-3">
            {profile.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-xs">{exp.position}</h4>
                    <p className="text-xs font-semibold" style={{ color: template.colorScheme.accent }}>
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600">{exp.period}</span>
                </div>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {exp.achievements.slice(0, 2).map((achievement, i) => (
                    <li key={i}>• {achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-xs mb-2" style={{ color: template.colorScheme.primary }}>
            EDUCATION
          </h3>
          <div className="space-y-1">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="text-xs">
                <div className="font-semibold">{edu.degree}</div>
                <div className="text-gray-700">{edu.school} • {edu.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Modern Tech Preview
const ModernTechPreview = ({ profile, template }) => (
  <div className="w-full h-full bg-white shadow-lg overflow-hidden" style={{ fontSize: '8px', lineHeight: '1.3' }}>
    <div className="h-2" style={{ background: `linear-gradient(90deg, ${template.colorScheme.primary}, ${template.colorScheme.accent})` }}></div>
    
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold text-white"
             style={{ backgroundColor: template.colorScheme.primary }}>
          {profile.initials}
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold" style={{ color: template.colorScheme.primary }}>
            {profile.name}
          </h1>
          <h2 className="text-sm text-gray-700">{profile.title}</h2>
          <div className="text-xs text-gray-600 mt-1">
            {profile.contact.email} | {profile.contact.phone} | {profile.contact.address}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main content */}
        <div className="col-span-2 space-y-3">
          <div>
            <h3 className="font-bold text-xs mb-2 flex items-center gap-2" style={{ color: template.colorScheme.primary }}>
              <User className="w-3 h-3" />
              PROFESSIONAL SUMMARY
            </h3>
            <p className="text-xs leading-relaxed text-gray-700">{profile.summary}</p>
          </div>

          <div>
            <h3 className="font-bold text-xs mb-2 flex items-center gap-2" style={{ color: template.colorScheme.primary }}>
              <Award className="w-3 h-3" />
              EXPERIENCE
            </h3>
            <div className="space-y-2">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 pl-3" style={{ borderColor: template.colorScheme.accent }}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-xs">{exp.position}</h4>
                      <p className="text-xs text-gray-700">{exp.company}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: template.colorScheme.primary }}>
                      {exp.period}
                    </span>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {exp.achievements.slice(0, 2).map((achievement, i) => (
                      <li key={i}>• {achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          <div className="p-3 rounded-lg" style={{ backgroundColor: template.colorScheme.surface }}>
            <h3 className="font-bold text-xs mb-2" style={{ color: template.colorScheme.primary }}>
              TECHNICAL SKILLS
            </h3>
            <div className="space-y-2">
              {profile.skills.slice(0, 5).map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="h-1 rounded-full" 
                      style={{ backgroundColor: template.colorScheme.accent, width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: template.colorScheme.surface }}>
            <h3 className="font-bold text-xs mb-2" style={{ color: template.colorScheme.primary }}>
              EDUCATION
            </h3>
            <div className="space-y-2">
              {profile.education.map((edu, idx) => (
                <div key={idx}>
                  <h4 className="font-bold text-xs">{edu.degree}</h4>
                  <p className="text-xs text-gray-600">{edu.school}</p>
                  <p className="text-xs text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Preview Modal Component
const PreviewModal = ({ template, isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const renderFullPreview = () => {
    const props = { profile: sampleProfile, template };
    
    switch (template.layoutType) {
      case 'ats-single-column':
        return <ATSProfessionalPreview {...props} />;
      case 'executive-two-column':
        return <ExecutivePremiumPreview {...props} />;
      case 'modern-hybrid':
        return <ModernTechPreview {...props} />;
      default:
        return <ATSProfessionalPreview {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              {template.name}
              {template.isATSFriendly && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  ATS Friendly
                </span>
              )}
            </h2>
            <p className="text-gray-600">{template.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelect(template)}
              className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 text-white"
              style={{ backgroundColor: template.colorScheme.primary }}
            >
              <Download className="w-4 h-4" />
              Use This Template
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-100">
          <div className="max-w-2xl mx-auto" style={{ aspectRatio: '8.5/11' }}>
            {renderFullPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Template Card Component
const ProfessionalTemplateCard = memo(({ template, onSelect, onPreview }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const renderPreview = () => {
    const props = { profile: sampleProfile, template };
    
    switch (template.layoutType) {
      case 'ats-single-column':
        return <ATSProfessionalPreview {...props} />;
      case 'executive-two-column':
        return <ExecutivePremiumPreview {...props} />;
      case 'modern-hybrid':
        return <ModernTechPreview {...props} />;
      default:
        return <ATSProfessionalPreview {...props} />;
    }
  };

  return (
    <div 
      className={`group relative bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:-translate-y-2 
        ${isHovered ? 'transform -translate-y-2 shadow-xl border-gray-300' : 'border-gray-200 shadow-md'}`}
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
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPreview(template);
              }}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Full Preview</span>
            </button>
            <button 
              onClick={() => onSelect(template)}
              className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-colors text-white"
              style={{ backgroundColor: template.colorScheme.primary }}
            >
              <Download className="w-4 h-4" />
              <span>Use Template</span>
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {template.isATSFriendly && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>ATS</span>
            </span>
          )}
          {template.isPremium && (
            <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
              <Star className="w-3 h-3 fill-current" />
              <span>Premium</span>
            </span>
          )}
          {template.isPopular && !template.isPremium && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Popular</span>
            </span>
          )}
          {template.isNew && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
        </div>
      </div>

      {/* Template Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">{template.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
          </div>
        </div>

        {/* Features and Metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {template.estimatedTime}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current text-yellow-500" />
              <span className="text-sm font-medium">{(template.popularity / 10).toFixed(1)}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full font-medium text-xs ${
            template.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
            template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {template.difficulty}
          </span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {template.features.slice(0, 4).map((feature, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full font-medium"
              style={{ 
                backgroundColor: `${template.colorScheme.primary}15`,
                color: template.colorScheme.primary
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
const ProfessionalTemplateGallery = ({ onTemplateSelect, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  
  const filteredTemplates = useMemo(() => {
    let filtered = professionalTemplates;
    
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
    
    // Sort ATS-friendly templates first, then by popularity
    return filtered.sort((a, b) => {
      if (a.isATSFriendly && !b.isATSFriendly) return -1;
      if (!a.isATSFriendly && b.isATSFriendly) return 1;
      return b.popularity - a.popularity;
    });
  }, [searchQuery, selectedCategory]);

  const categories = [
    { id: 'all', name: 'All Templates', count: professionalTemplates.length },
    { id: 'ats-optimized', name: 'ATS Optimized', count: professionalTemplates.filter(t => t.category === 'ats-optimized').length },
    { id: 'executive', name: 'Executive', count: professionalTemplates.filter(t => t.category === 'executive').length },
    { id: 'modern', name: 'Modern', count: professionalTemplates.filter(t => t.category === 'modern').length },
    { id: 'creative', name: 'Creative', count: professionalTemplates.filter(t => t.category === 'creative').length },
    { id: 'minimal', name: 'Minimal', count: professionalTemplates.filter(t => t.category === 'minimal').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Professional CV Templates</h1>
              <p className="text-gray-600 mt-1">Choose from ATS-optimized and visually stunning templates</p>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
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

      {/* ATS Notice */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">ATS Compatibility Guide</h3>
              <p className="text-sm text-gray-700 mb-2">
                Applicant Tracking Systems (ATS) scan resumes before human recruiters see them. Templates marked with 
                <span className="inline-flex items-center gap-1 mx-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  <Shield className="w-3 h-3" />
                  ATS
                </span> 
                are optimized for maximum compatibility.
              </p>
              <p className="text-xs text-gray-600">
                <strong>ATS-Friendly:</strong> Simple layouts, standard fonts, clear section headers • 
                <strong>Creative:</strong> Visual appeal but may have parsing issues
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <ProfessionalTemplateCard
              key={template.id}
              template={template}
              onSelect={onTemplateSelect}
              onPreview={setPreviewTemplate}
            />
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={onTemplateSelect}
        />
      )}
    </div>
  );
};

export default ProfessionalTemplateGallery;
