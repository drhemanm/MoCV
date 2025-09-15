// Advanced TemplateGallery - Section 1: Imports, Interfaces & Realistic Template Data
import React, { useState, useMemo, memo, useCallback } from 'react';
import { 
  Search, ChevronLeft, Check, Zap, Palette, Type, Layout, Eye, 
  Heart, Clock, Star, TrendingUp, Download, Filter, Sparkles,
  MapPin, Phone, Mail, Linkedin, Award, Briefcase, GraduationCap,
  User, Code, Lightbulb, Target, BarChart3
} from 'lucide-react';
import { CVTemplate } from '../types';

// Enhanced interfaces
interface TemplateGalleryProps {
  templates: CVTemplate[];
  isLoading: boolean;
  onTemplateSelect: (template: CVTemplate, customization?: TemplateCustomization) => void;
  onTemplatePreview?: (template: CVTemplate) => void;
  onBack: () => void;
}

interface TemplateCustomization {
  colorScheme: 'blue' | 'black' | 'green' | 'purple' | 'red' | 'teal' | 'orange';
  accentColor: string;
  fontStyle: 'modern' | 'classic' | 'minimal';
  headerStyle: 'standard' | 'centered' | 'sidebar';
  spacing: 'compact' | 'balanced' | 'spacious';
}

// Enhanced template type with realistic CV data
interface EnhancedCVTemplate extends CVTemplate {
  successRate?: number;
  isPopular?: boolean;
  isNew?: boolean;
  atsScore?: number;
  industryFit?: string[];
  // Realistic CV content for previews
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
      level: number; // 1-5 or percentage
      category: 'technical' | 'soft' | 'language' | 'tool';
    }>;
    education: Array<{
      degree: string;
      school: string;
      year: string;
      details?: string;
    }>;
  };
  layoutType: 'two-column' | 'single-column' | 'timeline' | 'creative' | 'executive' | 'modern';
  primaryColor: string;
  secondaryColor: string;
}

// Realistic template data with actual CV content
const enhancedTemplates: EnhancedCVTemplate[] = [
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
        },
        {
          role: 'Business Analyst',
          company: 'JPMorgan Chase',
          duration: '2019 - 2021',
          achievements: [
            'Developed automated reporting systems saving 40+ hours monthly',
            'Collaborated with stakeholders to define business requirements'
          ]
        }
      ],
      skills: [
        { name: 'SQL', level: 90, category: 'technical' },
        { name: 'Python', level: 85, category: 'technical' },
        { name: 'Data Analysis', level: 95, category: 'technical' },
        { name: 'Project Management', level: 88, category: 'soft' },
        { name: 'Stakeholder Management', level: 92, category: 'soft' }
      ],
      education: [
        {
          degree: 'MBA, Finance',
          school: 'Wharton School',
          year: '2019',
          details: 'Magna Cum Laude, Beta Gamma Sigma'
        },
        {
          degree: 'BS, Economics',
          school: 'NYU Stern',
          year: '2017',
          details: 'Minor in Data Science'
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
            'Managed creative team of 12 designers and copywriters'
          ]
        },
        {
          role: 'Senior Art Director',
          company: 'BBDO Worldwide',
          duration: '2020 - 2022',
          achievements: [
            'Created award-winning campaigns for Fortune 500 clients',
            'Increased team creative output by 35% through process optimization'
          ]
        }
      ],
      skills: [
        { name: 'Adobe Creative Suite', level: 95, category: 'technical' },
        { name: 'Figma', level: 90, category: 'technical' },
        { name: 'Brand Strategy', level: 88, category: 'soft' },
        { name: 'Team Leadership', level: 92, category: 'soft' },
        { name: 'Campaign Development', level: 94, category: 'soft' }
      ],
      education: [
        {
          degree: 'MFA, Graphic Design',
          school: 'ArtCenter College',
          year: '2016',
          details: 'Thesis: "Digital Storytelling in Modern Branding"'
        }
      ]
    }
  },
  {
    id: 'executive-timeline',
    name: 'Executive Timeline',
    description: 'Achievement-focused layout emphasizing career progression and leadership impact',
    category: 'classic',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Timeline Layout', 'Achievement Focus', 'Executive Format', 'Leadership Emphasis'],
    difficulty: 'intermediate',
    estimatedTime: '20 minutes',
    popularity: 82,
    tags: ['executive', 'timeline', 'achievements', 'leadership'],
    successRate: 89,
    isPopular: false,
    isNew: true,
    atsScore: 92,
    industryFit: ['Executive', 'Management', 'Strategy', 'Consulting'],
    layoutType: 'timeline',
    primaryColor: '#1f2937',
    secondaryColor: '#f9fafb',
    sampleData: {
      name: 'Michael Chen',
      title: 'Chief Technology Officer',
      location: 'San Francisco, CA',
      email: 'michael.chen@email.com',
      phone: '(555) 456-7890',
      linkedin: 'linkedin.com/in/michaelchen',
      summary: 'Visionary technology leader with 15+ years driving digital transformation and scaling engineering teams.',
      experiences: [
        {
          role: 'Chief Technology Officer',
          company: 'TechFlow Solutions',
          duration: '2021 - Present',
          achievements: [
            'Led digital transformation initiative resulting in $50M revenue growth',
            'Scaled engineering team from 25 to 120+ professionals',
            'Implemented DevOps practices reducing deployment time by 85%'
          ]
        },
        {
          role: 'VP of Engineering',
          company: 'DataStream Inc.',
          duration: '2018 - 2021',
          achievements: [
            'Built high-performance team that delivered 12 major product releases',
            'Established architecture standards adopted across 4 product lines'
          ]
        }
      ],
      skills: [
        { name: 'Strategic Planning', level: 95, category: 'soft' },
        { name: 'Team Leadership', level: 98, category: 'soft' },
        { name: 'Cloud Architecture', level: 88, category: 'technical' },
        { name: 'Digital Transformation', level: 92, category: 'soft' }
      ],
      education: [
        {
          degree: 'Executive MBA',
          school: 'Stanford GSB',
          year: '2018',
          details: 'Leadership & Strategy Focus'
        },
        {
          degree: 'MS, Computer Science',
          school: 'MIT',
          year: '2008'
        }
      ]
    }
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean single-column design with subtle accents and maximum readability',
    category: 'minimal',
    previewUrl: '',
    markdownUrl: '',
    thumbnail: '',
    features: ['Single Column', 'Minimal Design', 'Clean Typography', 'Subtle Accents'],
    difficulty: 'beginner',
    estimatedTime: '12 minutes',
    popularity: 78,
    tags: ['minimal', 'clean', 'simple', 'modern'],
    successRate: 85,
    isPopular: false,
    isNew: false,
    atsScore: 96,
    industryFit: ['Design', 'Startups', 'Creative', 'Architecture'],
    layoutType: 'single-column',
    primaryColor: '#06b6d4',
    secondaryColor: '#e0f7fa',
    sampleData: {
      name: 'Emma Thompson',
      title: 'UX Designer',
      location: 'Seattle, WA',
      email: 'emma.thompson@email.com',
      phone: '(555) 234-5678',
      summary: 'Passionate UX Designer focused on creating intuitive digital experiences that solve real user problems.',
      experiences: [
        {
          role: 'Senior UX Designer',
          company: 'Microsoft',
          duration: '2022 - Present',
          achievements: [
            'Redesigned core user flows resulting in 40% increase in user satisfaction',
            'Led design system initiative across 5 product teams'
          ]
        },
        {
          role: 'UX Designer',
          company: 'Airbnb',
          duration: '2020 - 2022',
          achievements: [
            'Designed mobile experiences used by 10M+ users monthly',
            'Conducted user research that informed strategic product decisions'
          ]
        }
      ],
      skills: [
        { name: 'Figma', level: 95, category: 'tool' },
        { name: 'User Research', level: 88, category: 'soft' },
        { name: 'Prototyping', level: 92, category: 'technical' },
        { name: 'Design Systems', level: 90, category: 'technical' }
      ],
      education: [
        {
          degree: 'BFA, Interaction Design',
          school: 'RISD',
          year: '2020',
          details: 'Summa Cum Laude, Design Honor Society'
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
        },
        {
          role: 'Software Engineer',
          company: 'Shopify',
          duration: '2020 - 2022',
          achievements: [
            'Developed e-commerce features used by 500k+ merchants',
            'Led migration to microservices architecture'
          ]
        }
      ],
      skills: [
        { name: 'React', level: 95, category: 'technical' },
        { name: 'Node.js', level: 90, category: 'technical' },
        { name: 'TypeScript', level: 88, category: 'technical' },
        { name: 'AWS', level: 85, category: 'technical' },
        { name: 'GraphQL', level: 82, category: 'technical' }
      ],
      education: [
        {
          degree: 'BS, Computer Science',
          school: 'UT Austin',
          year: '2020',
          details: 'Dean\'s List, ACM Programming Contest Winner'
        }
      ]
    }
  }
];

// Enhanced color scheme configuration
const colorSchemes = [
  { id: 'blue', name: 'Professional Blue', color: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-700', secondary: '#e0e7ff' },
  { id: 'black', name: 'Classic Black', color: '#1f2937', bg: 'bg-gray-50', text: 'text-gray-700', secondary: '#f9fafb' },
  { id: 'green', name: 'Success Green', color: '#059669', bg: 'bg-green-50', text: 'text-green-700', secondary: '#ecfdf5' },
  { id: 'purple', name: 'Creative Purple', color: '#7c3aed', bg: 'bg-purple-50', text: 'text-purple-700', secondary: '#f3e8ff' },
  { id: 'red', name: 'Bold Red', color: '#dc2626', bg: 'bg-red-50', text: 'text-red-700', secondary: '#fef2f2' },
  { id: 'teal', name: 'Modern Teal', color: '#0891b2', bg: 'bg-cyan-50', text: 'text-cyan-700', secondary: '#ecfeff' },
  { id: 'orange', name: 'Creative Orange', color: '#ea580c', bg: 'bg-orange-50', text: 'text-orange-700', secondary: '#fff7ed' }
];
// Advanced TemplateGallery - Section 2: Main Component Logic & Realistic Preview Rendering
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
    accentColor: '#2563eb',
    fontStyle: 'modern',
    headerStyle: 'standard',
    spacing: 'balanced'
  });

  const templates = propTemplates.length > 0 ? propTemplates : enhancedTemplates;

  // Advanced filtering and sorting logic
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
        template.tags.some(tag => tag.toLowerCase().includes(query)) ||
        template.features.some(feature => feature.toLowerCase().includes(query)) ||
        (template as EnhancedCVTemplate).industryFit?.some(industry => 
          industry.toLowerCase().includes(query)
        ) ||
        (template as EnhancedCVTemplate).sampleData.name.toLowerCase().includes(query) ||
        (template as EnhancedCVTemplate).sampleData.title.toLowerCase().includes(query)
      );
    }
    
    filtered = [...filtered].sort((a, b) => {
      const aEnhanced = a as EnhancedCVTemplate;
      const bEnhanced = b as EnhancedCVTemplate;
      
      switch (sortBy) {
        case 'popular':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'newest':
          return (bEnhanced.isNew ? 1 : 0) - (aEnhanced.isNew ? 1 : 0);
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

  const categories = useMemo(() => [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'modern', name: 'Modern', count: templates.filter(t => t.category === 'modern').length },
    { id: 'classic', name: 'Classic', count: templates.filter(t => t.category === 'classic').length },
    { id: 'minimal', name: 'Minimal', count: templates.filter(t => t.category === 'minimal').length },
    { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length }
  ], [templates]);

  // Optimized callback functions
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
    if (showCustomization === template.id) {
      onTemplateSelect(template, customization);
    } else {
      setShowCustomization(template.id);
      setSelectedTemplate(template.id);
    }
  }, [showCustomization, customization, onTemplateSelect]);

  const handleUseTemplate = useCallback((template: CVTemplate) => {
    onTemplateSelect(template, customization);
  }, [customization, onTemplateSelect]);

  // Realistic CV Preview Rendering Functions
  const renderRealisticPreview = useCallback((template: EnhancedCVTemplate) => {
    const { sampleData, layoutType } = template;
    const currentScheme = colorSchemes.find(s => s.id === customization.colorScheme) || colorSchemes[0];
    const accentColor = customization.accentColor;
    const secondaryColor = currentScheme.secondary;

    // Professional Standard Template (Two-Column)
    if (layoutType === 'two-column') {
      return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex h-full">
            {/* Main Content */}
            <div className="flex-1 p-4">
              {/* Header */}
              <div className="mb-4">
                <div className="h-5 rounded font-semibold mb-1" style={{ backgroundColor: '#1f2937', width: '70%' }}></div>
                <div className="text-xs text-gray-600 mb-1" style={{ width: '50%', height: '12px', backgroundColor: '#6b7280' }}></div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-2 h-2" />
                  <div style={{ width: '40%', height: '8px', backgroundColor: '#9ca3af' }}></div>
                </div>
              </div>
              
              {/* Professional Summary */}
              <div className="mb-4">
                <div className="h-3 mb-2" style={{ backgroundColor: accentColor, width: '35%' }}></div>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-400 rounded" style={{ width: '100%' }}></div>
                  <div className="h-2 bg-gray-400 rounded" style={{ width: '95%' }}></div>
                  <div className="h-2 bg-gray-400 rounded" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              {/* Experience */}
              <div className="mb-4">
                <div className="h-3 mb-3" style={{ backgroundColor: accentColor, width: '40%' }}></div>
                <div className="space-y-3">
                  <div>
                    <div className="h-3 bg-gray-700 rounded mb-1" style={{ width: '60%' }}></div>
                    <div className="h-2 bg-gray-500 rounded mb-2" style={{ width: '45%' }}></div>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-300 rounded" style={{ width: '90%' }}></div>
                      <div className="h-2 bg-gray-300 rounded" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="h-3 bg-gray-700 rounded mb-1" style={{ width: '55%' }}></div>
                    <div className="h-2 bg-gray-500 rounded mb-2" style={{ width: '40%' }}></div>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-300 rounded" style={{ width: '95%' }}></div>
                      <div className="h-2 bg-gray-300 rounded" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="w-1/3 p-4 border-l border-gray-200" style={{ backgroundColor: secondaryColor }}>
              {/* Contact */}
              <div className="mb-4">
                <div className="h-3 mb-3" style={{ backgroundColor: accentColor, width: '60%' }}></div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-2 h-2 text-gray-600" />
                    <div className="h-2 bg-gray-400 rounded" style={{ width: '70%' }}></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-2 h-2 text-gray-600" />
                    <div className="h-2 bg-gray-400 rounded" style={{ width: '80%' }}></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-2 h-2 text-gray-600" />
                    <div className="h-2 bg-gray-400 rounded" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div className="mb-4">
                <div className="h-3 mb-3" style={{ backgroundColor: accentColor, width: '50%' }}></div>
                <div className="space-y-2">
                  {[95, 88, 90, 85, 82].map((width, idx) => (
                    <div key={idx}>
                      <div className="h-2 bg-gray-400 rounded mb-1" style={{ width: '60%' }}></div>
                      <div className="h-1 bg-gray-200 rounded">
                        <div className="h-full rounded" style={{ backgroundColor: accentColor, width: `${width}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Education */}
              <div>
                <div className="h-3 mb-3" style={{ backgroundColor: accentColor, width: '55%' }}></div>
                <div className="space-y-2">
                  <div>
                    <div className="h-2 bg-gray-600 rounded mb-1" style={{ width: '80%' }}></div>
                    <div className="h-2 bg-gray-400 rounded" style={{ width: '70%' }}></div>
                  </div>
                  <div>
                    <div className="h-2 bg-gray-600 rounded mb-1" style={{ width: '75%' }}></div>
                    <div className="h-2 bg-gray-400 rounded" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Creative Professional Template
    if (layoutType === 'creative') {
      return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
          {/* Creative Header with geometric elements */}
          <div className="h-16 relative p-3" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${secondaryColor} 100%)` }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="h-4 bg-white rounded mb-1" style={{ width: '80px' }}></div>
                <div className="h-2 bg-white/70 rounded" style={{ width: '60px' }}></div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-2 right-3 w-6 h-6 rounded-full bg-white/10"></div>
            <div className="absolute bottom-2 right-8 w-4 h-4 rounded-full bg-white/15"></div>
          </div>
          
          <div className="p-3">
            {/* Portfolio Grid */}
            <div className="grid grid-cols-3 gap-1 mb-3">
              <div className="aspect-square bg-gray-100 rounded"></div>
              <div className="aspect-square bg-gray-100 rounded"></div>
              <div className="aspect-square bg-gray-100 rounded"></div>
            </div>
            
            {/* Skills with visual indicators */}
            <div className="mb-3">
              <div className="h-2 mb-2" style={{ backgroundColor: accentColor, width: '40%' }}></div>
              <div className="flex flex-wrap gap-1">
                {['Adobe CC', 'Figma', 'Branding', 'UI/UX'].map((skill, idx) => (
                  <div key={idx} className="px-2 py-1 text-xs rounded" style={{ backgroundColor: secondaryColor }}>
                    <div className="h-2 bg-gray-400 rounded" style={{ width: `${30 + idx * 5}px` }}></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Experience */}
            <div>
              <div className="h-2 mb-2" style={{ backgroundColor: accentColor, width: '45%' }}></div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-600 rounded mb-1" style={{ width: '70%' }}></div>
                    <div className="h-1 bg-gray-400 rounded" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-600 rounded mb-1" style={{ width: '65%' }}></div>
                    <div className="h-1 bg-gray-400 rounded" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Timeline Executive Template
    if (layoutType === 'timeline') {
      return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Executive Header */}
          <div className="h-12 bg-gradient-to-r from-gray-900 to-gray-700 p-3 flex items-center">
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-white" />
              <div>
                <div className="h-3 bg-white rounded mb-1" style={{ width: '70px' }}></div>
                <div className="h-2 bg-white/70 rounded" style={{ width: '50px' }}></div>
              </div>
            </div>
            <div className="ml-auto">
              <div className="h-2 bg-white/50 rounded" style={{ width: '40px' }}></div>
            </div>
          </div>
          
          <div className="p-3">
            {/* Executive Summary */}
            <div className="mb-3">
              <div className="h-3 mb-2" style={{ backgroundColor: accentColor, width: '50%' }}></div>
              <div className="space-y-1">
                <div className="h-2 bg-gray-400 rounded w-full"></div>
                <div className="h-2 bg-gray-400 rounded" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            {/* Timeline Experience */}
            <div className="relative">
              <div className="absolute left-2 top-0 bottom-0 w-px" style={{ backgroundColor: accentColor }}></div>
              
              <div className="space-y-3">
                {/* Current Role */}
                <div className="relative pl-6">
                  <div className="absolute -left-1 top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                  <div className="flex justify-between items-start mb-1">
                    <div className="h-2 bg-gray-700 rounded" style={{ width: '60%' }}></div>
                    <div className="h-2 bg-gray-500 rounded" style={{ width: '30%' }}></div>
                  </div>
                  <div className="h-2 bg-gray-500 rounded mb-2" style={{ width: '45%' }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-300 rounded" style={{ width: '90%' }}></div>
                    <div className="h-1 bg-gray-300 rounded" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                {/* Previous Role */}
                <div className="relative pl-6">
                  <div className="absolute -left-1 top-1 w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="flex justify-between items-start mb-1">
                    <div className="h-2 bg-gray-600 rounded" style={{ width: '55%' }}></div>
                    <div className="h-2 bg-gray-400 rounded" style={{ width: '25%' }}></div>
                  </div>
                  <div className="h-2 bg-gray-400 rounded mb-2" style={{ width: '40%' }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-300 rounded" style={{ width: '85%' }}></div>
                    <div className="h-1 bg-gray-300 rounded" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Modern Tech Template
    if (layoutType === 'modern') {
      return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Tech Header with accent border */}
          <div className="border-b-2 p-3" style={{ borderColor: accentColor }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-900 rounded mb-1" style={{ width: '70px' }}></div>
                <div className="h-2 bg-gray-600 rounded" style={{ width: '60px' }}></div>
              </div>
              <div className="flex gap-1">
                <Code className="w-3 h-3 text-gray-400" />
                <Lightbulb className="w-3 h-3 text-gray-400" />
                <Target className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="p-3">
            {/* Tech Skills Grid */}
            <div className="mb-3">
              <div className="h-2 mb-2" style={{ backgroundColor: accentColor, width: '35%' }}></div>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({length: 8}).map((_, idx) => (
                  <div key={idx} className="text-center">
                    <div 
                      className="h-3 rounded mb-1" 
                      style={{ 
                        backgroundColor: idx < 4 ? accentColor : '#e5e7eb',
                        opacity: idx < 4 ? 1 : 0.7
                      }}
                    ></div>
                    <div className="h-1 bg-gray-300 rounded" style={{ width: '100%' }}></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Projects Section */}
            <div className="mb-3">
              <div className="h-2 mb-2" style={{ backgroundColor: accentColor, width: '40%' }}></div>
              <div className="space-y-2">
                <div className="border border-gray-200 rounded p-2">
                  <div className="h-2 bg-gray-600 rounded mb-1" style={{ width: '80%' }}></div>
                  <div className="h-1 bg-gray-400 rounded" style={{ width: '60%' }}></div>
                </div>
                <div className="border border-gray-200 rounded p-2">
                  <div className="h-2 bg-gray-600 rounded mb-1" style={{ width: '75%' }}></div>
                  <div className="h-1 bg-gray-400 rounded" style={{ width: '55%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Experience */}
            <div>
              <div className="h-2 mb-2" style={{ backgroundColor: accentColor, width: '45%' }}></div>
              <div className="space-y-2">
                <div>
                  <div className="h-2 bg-gray-700 rounded mb-1" style={{ width: '65%' }}></div>
                  <div className="h-1 bg-gray-500 rounded mb-1" style={{ width: '40%' }}></div>
                  <div className="h-1 bg-gray-300 rounded" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Single Column Minimal Template
    return (
      <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4">
          {/* Centered Header */}
          <div className="text-center mb-4">
            <div className="h-5 bg-gray-900 rounded mb-2 mx-auto" style={{ width: '60%' }}></div>
            <div className="h-2 bg-gray-600 rounded mx-auto" style={{ width: '40%' }}></div>
            <div className="flex justify-center items-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <Mail className="w-2 h-2" />
                <div className="h-1 bg-gray-400 rounded" style={{ width: '30px' }}></div>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-2 h-2" />
                <div className="h-1 bg-gray-400 rounded" style={{ width: '25px' }}></div>
              </div>
            </div>
          </div>
          
          <div className="h-px bg-gray-200 mb-4"></div>
          
          {/* Clean Sections */}
          <div className="space-y-4">
            <div>
              <div className="h-2 rounded mb-2" style={{ backgroundColor: accentColor, width: '30%' }}></div>
              <div className="space-y-1">
                <div className="h-2 bg-gray-400 rounded w-full"></div>
                <div className="h-2 bg-gray-400 rounded" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="h-2 rounded mb-2" style={{ backgroundColor: accentColor, width: '35%' }}></div>
              <div className="space-y-2">
                <div>
                  <div className="h-2 bg-gray-700 rounded mb-1" style={{ width: '70%' }}></div>
                  <div className="h-2 bg-gray-500 rounded mb-1" style={{ width: '50%' }}></div>
                  <div className="h-1 bg-gray-300 rounded" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="h-2 rounded mb-2" style={{ backgroundColor: accentColor, width: '25%' }}></div>
              <div className="flex flex-wrap gap-1">
                {Array.from({length: 5}).map((_, idx) => (
                  <div key={idx} className="px-2 py-1 text-xs rounded bg-gray-100">
                    <div className="h-1 bg-gray-400 rounded" style={{ width: `${20 + idx * 5}px` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [customization]);

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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
              aria-label="Go back"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div className="h-6 border-l border-gray-300" aria-hidden="true"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Choose your template</h1>
              <p className="text-gray-600 mt-1">Professional templates with world-class customization</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search templates, features, or industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                aria-label="Search templates"
              />
            </div>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Sort templates by"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="difficulty">Easiest First</option>
              <option value="time">Quick Setup</option>
            </select>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto" role="tablist">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                role="tab"
                aria-selected={selectedCategory === category.id}
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
        <div className="flex gap-8">
          <div className="flex-1">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" role="grid">
              {filteredTemplates.map((template) => (
                <RealisticTemplateCard
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
                  renderPreview={renderRealisticPreview}
                />
              ))}
            </div>
          </div>
		  {/* Enhanced Customization Panel */}
          {showCustomization && (
            <div className="w-80 bg-white rounded-2xl border border-gray-200 p-6 sticky top-32 h-fit shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Customize Template</h3>
              </div>

              {/* Enhanced Template Info */}
              {(() => {
                const template = templates.find(t => t.id === showCustomization) as EnhancedCVTemplate;
                return template ? (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      {template.isPopular && (
                        <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                          Popular
                        </span>
                      )}
                      {template.isNew && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {template.atsScore}% ATS
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {template.successRate}% success
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Perfect for:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.industryFit?.slice(0, 3).map((industry, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Enhanced Color Scheme */}
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
                      className={`p-3 rounded-lg border-2 transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        customization.colorScheme === scheme.id
                          ? 'border-blue-500 bg-blue-50 scale-105 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-label={`Select ${scheme.name} color scheme`}
                    >
                      <div 
                        className="w-6 h-6 rounded-full mx-auto mb-2 shadow-sm border border-white"
                        style={{ backgroundColor: scheme.color }}
                      />
                      <div className="text-xs font-medium text-center text-gray-700">
                        {scheme.name.split(' ')[1] || scheme.name.split(' ')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Typography */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Typography
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'modern', name: 'Modern Sans-serif', desc: 'Clean and contemporary', example: 'Aa', fontClass: 'font-sans' },
                    { id: 'classic', name: 'Classic Serif', desc: 'Traditional and formal', example: 'Aa', fontClass: 'font-serif' },
                    { id: 'minimal', name: 'Minimal', desc: 'Simple and unobtrusive', example: 'Aa', fontClass: 'font-mono' }
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setCustomization(prev => ({ ...prev, fontStyle: font.id as any }))}
                      className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        customization.fontStyle === font.id
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-label={`Select ${font.name} typography`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{font.name}</div>
                          <div className="text-xs text-gray-600">{font.desc}</div>
                        </div>
                        <div className={`text-2xl font-semibold text-gray-400 ${font.fontClass}`}>
                          {font.example}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Spacing */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Spacing & Layout
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'compact', name: 'Compact', desc: 'More content, less space', visual: '|||', spacing: 'space-x-0' },
                    { id: 'balanced', name: 'Balanced', desc: 'Perfect readability', visual: '| | |', spacing: 'space-x-1' },
                    { id: 'spacious', name: 'Spacious', desc: 'Generous white space', visual: '|  |  |', spacing: 'space-x-2' }
                  ].map((spacing) => (
                    <button
                      key={spacing.id}
                      onClick={() => setCustomization(prev => ({ ...prev, spacing: spacing.id as any }))}
                      className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        customization.spacing === spacing.id
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-label={`Select ${spacing.name} spacing`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{spacing.name}</div>
                          <div className="text-xs text-gray-600">{spacing.desc}</div>
                        </div>
                        <div className={`flex ${spacing.spacing} text-sm font-mono text-gray-400`}>
                          <div className="w-1 h-4 bg-gray-400"></div>
                          <div className="w-1 h-4 bg-gray-400"></div>
                          <div className="w-1 h-4 bg-gray-400"></div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Use Template Button */}
              <button
                onClick={() => handleUseTemplate(templates.find(t => t.id === showCustomization)!)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                aria-label="Use this template with current customizations"
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

// Enhanced Template Card Component with Error Boundary
interface RealisticTemplateCardProps {
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
  renderPreview: (template: EnhancedCVTemplate) => React.ReactNode;
}

const RealisticTemplateCard = memo<RealisticTemplateCardProps>(({
  template,
  isSelected,
  isCustomizing,
  isHovered,
  isFavorited,
  customization,
  onSelect,
  onPreview,
  onHover,
  onToggleFavorite,
  renderPreview
}) => {
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

  const handleMouseEnter = useCallback(() => {
    onHover(template.id);
  }, [onHover, template.id]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  return (
    <div 
      className={`
        group relative bg-white border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-300
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg transform -translate-y-1' : 'border-gray-200'}
      `}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="gridcell"
      tabIndex={0}
      aria-label={`${template.name} template - ${template.description}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Enhanced Template Preview */}
      <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
        <div className="w-full h-full transform transition-transform duration-300 group-hover:scale-105">
          {renderPreview(template)}
        </div>
        
        {/* Enhanced Hover Overlay */}
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-3">
            {onPreview && (
              <button 
                onClick={handlePreviewClick}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={`Preview ${template.name} template`}
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            )}
            <button 
              onClick={handleCardClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={`Select ${template.name} template`}
            >
              <Download className="w-4 h-4" />
              <span>Use Template</span>
            </button>
          </div>
        </div>

        {/* Enhanced Badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {template.isPopular && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Popular</span>
            </span>
          )}
          {template.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              New
            </span>
          )}
          {template.atsScore && template.atsScore >= 95 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              ATS+
            </span>
          )}
        </div>

        {/* Enhanced Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            isFavorited
              ? 'bg-red-500 text-white shadow-md focus:ring-red-500'
              : 'bg-white/80 text-gray-700 hover:bg-white shadow-sm focus:ring-gray-500'
          }`}
          aria-label={isFavorited ? `Remove ${template.name} from favorites` : `Add ${template.name} to favorites`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorited ? 'fill-current scale-110' : ''}`} />
        </button>

        {/* Layout Type Indicator */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">
            {template.layoutType.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Enhanced Template Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {template.name}
              </h3>
              {isCustomizing && (
                <span className="text-blue-600 font-medium flex items-center gap-1" aria-label="Currently customizing">
                  <Palette className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {template.description}
            </p>
          </div>
        </div>

        {/* Enhanced Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1" title="Setup time">
              <Clock className="w-3 h-3" />
              <span>{template.estimatedTime}</span>
            </span>
            {template.atsScore && (
              <span className="flex items-center space-x-1" title="ATS compatibility score">
                <TrendingUp className="w-3 h-3" />
                <span>{template.atsScore}%</span>
              </span>
            )}
            {template.successRate && (
              <span className="flex items-center space-x-1" title="Success rate">
                <BarChart3 className="w-3 h-3" />
                <span>{template.successRate}%</span>
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
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium hover:bg-gray-200 transition-colors"
              title={feature}
            >
              {feature}
            </span>
          ))}
          {template.features.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1" title={`${template.features.length - 3} more features`}>
              +{template.features.length - 3} more
            </span>
          )}
        </div>

        {/* Enhanced Industry Fit */}
        {template.industryFit && template.industryFit.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-500 mb-2 font-medium">Perfect for:</p>
            <div className="flex flex-wrap gap-1">
              {template.industryFit.slice(0, 2).map((industry, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium hover:bg-blue-100 transition-colors"
                >
                  {industry}
                </span>
              ))}
              {template.industryFit.length > 2 && (
                <span className="text-xs text-gray-500 px-2 py-1" title={template.industryFit.slice(2).join(', ')}>
                  +{template.industryFit.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sample Data Preview */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1 font-medium">Sample professional:</p>
          <div className="text-xs text-gray-600">
            <span className="font-medium">{template.sampleData.name}</span>
            <span className="mx-1">•</span>
            <span>{template.sampleData.title}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

RealisticTemplateCard.displayName = 'RealisticTemplateCard';

// Error Boundary Component for Template Rendering
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class TemplatePreviewErrorBoundary extends React.Component<
  { children: React.ReactNode; templateName?: string },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; templateName?: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Template preview error:', error, errorInfo);
    // In production, you might want to send this to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-gray-500 text-sm">!</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">Preview unavailable</p>
            <p className="text-xs text-gray-400">
              {this.props.templateName || 'Template'} preview
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced Template Card with Error Boundary
const SafeRealisticTemplateCard = memo<RealisticTemplateCardProps>(({
  template,
  isSelected,
  isCustomizing,
  isHovered,
  isFavorited,
  customization,
  onSelect,
  onPreview,
  onHover,
  onToggleFavorite,
  renderPreview
}) => {
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

  const handleMouseEnter = useCallback(() => {
    onHover(template.id);
  }, [onHover, template.id]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  return (
    <div 
      className={`
        group relative bg-white border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-300
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg transform -translate-y-1' : 'border-gray-200'}
      `}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="gridcell"
      tabIndex={0}
      aria-label={`${template.name} template - ${template.description}`}
      onKeyDown={handleKeyDown}
    >
      {/* Enhanced Template Preview with Error Boundary */}
      <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
        <div className="w-full h-full transform transition-transform duration-300 group-hover:scale-105">
          <TemplatePreviewErrorBoundary templateName={template.name}>
            {renderPreview(template)}
          </TemplatePreviewErrorBoundary>
        </div>
        
        {/* Enhanced Hover Overlay */}
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-3">
            {onPreview && (
              <button 
                onClick={handlePreviewClick}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={`Preview ${template.name} template`}
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            )}
            <button 
              onClick={handleCardClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={`Select ${template.name} template`}
            >
              <Download className="w-4 h-4" />
              <span>Use Template</span>
            </button>
          </div>
        </div>

        {/* Enhanced Badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {template.isPopular && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Popular</span>
            </span>
          )}
          {template.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              New
            </span>
          )}
          {template.atsScore && template.atsScore >= 95 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              ATS+
            </span>
          )}
        </div>

        {/* Enhanced Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            isFavorited
              ? 'bg-red-500 text-white shadow-md focus:ring-red-500'
              : 'bg-white/80 text-gray-700 hover:bg-white shadow-sm focus:ring-gray-500'
          }`}
          aria-label={isFavorited ? `Remove ${template.name} from favorites` : `Add ${template.name} to favorites`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorited ? 'fill-current scale-110' : ''}`} />
        </button>

        {/* Layout Type Indicator */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">
            {template.layoutType.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Enhanced Template Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {template.name}
              </h3>
              {isCustomizing && (
                <span className="text-blue-600 font-medium flex items-center gap-1" aria-label="Currently customizing">
                  <Palette className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {template.description}
            </p>
          </div>
        </div>

        {/* Enhanced Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1" title="Setup time">
              <Clock className="w-3 h-3" />
              <span>{template.estimatedTime}</span>
            </span>
            {template.atsScore && (
              <span className="flex items-center space-x-1" title="ATS compatibility score">
                <TrendingUp className="w-3 h-3" />
                <span>{template.atsScore}%</span>
              </span>
            )}
            {template.successRate && (
              <span className="flex items-center space-x-1" title="Success rate">
                <BarChart3 className="w-3 h-3" />
                <span>{template.successRate}%</span>
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
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium hover:bg-gray-200 transition-colors"
              title={feature}
            >
              {feature}
            </span>
          ))}
          {template.features.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1" title={`${template.features.length - 3} more features`}>
              +{template.features.length - 3} more
            </span>
          )}
        </div>

        {/* Enhanced Industry Fit */}
        {template.industryFit && template.industryFit.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-500 mb-2 font-medium">Perfect for:</p>
            <div className="flex flex-wrap gap-1">
              {template.industryFit.slice(0, 2).map((industry, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium hover:bg-blue-100 transition-colors"
                >
                  {industry}
                </span>
              ))}
              {template.industryFit.length > 2 && (
                <span className="text-xs text-gray-500 px-2 py-1" title={template.industryFit.slice(2).join(', ')}>
                  +{template.industryFit.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sample Data Preview */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1 font-medium">Sample professional:</p>
          <div className="text-xs text-gray-600">
            <span className="font-medium">{template.sampleData.name}</span>
            <span className="mx-1">•</span>
            <span>{template.sampleData.title}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

SafeRealisticTemplateCard.displayName = 'SafeRealisticTemplateCard';

// Utility functions for template operations
const templateUtils = {
  /**
   * Get template by ID with type safety
   */
  getTemplateById: (templates: EnhancedCVTemplate[], id: string): EnhancedCVTemplate | undefined => {
    return templates.find(template => template.id === id);
  },

  /**
   * Filter templates by multiple criteria
   */
  filterTemplates: (
    templates: EnhancedCVTemplate[], 
    filters: {
      category?: string;
      difficulty?: string;
      industryFit?: string[];
      atsScore?: number;
      isPopular?: boolean;
      isNew?: boolean;
    }
  ): EnhancedCVTemplate[] => {
    return templates.filter(template => {
      if (filters.category && filters.category !== 'all' && template.category !== filters.category) {
        return false;
      }
      if (filters.difficulty && template.difficulty !== filters.difficulty) {
        return false;
      }
      if (filters.industryFit && filters.industryFit.length > 0) {
        const hasIndustryMatch = filters.industryFit.some(industry =>
          template.industryFit?.some(templateIndustry =>
            templateIndustry.toLowerCase().includes(industry.toLowerCase())
          )
        );
        if (!hasIndustryMatch) return false;
      }
      if (filters.atsScore && template.atsScore && template.atsScore < filters.atsScore) {
        return false;
      }
      if (filters.isPopular !== undefined && template.isPopular !== filters.isPopular) {
        return false;
      }
      if (filters.isNew !== undefined && template.isNew !== filters.isNew) {
        return false;
      }
      return true;
    });
  },

  /**
   * Get recommended templates based on user preferences
   */
  getRecommendedTemplates: (
    templates: EnhancedCVTemplate[],
    userPreferences: {
      industry?: string;
      experienceLevel?: 'entry' | 'mid' | 'senior';
      designPreference?: 'minimal' | 'modern' | 'creative' | 'traditional';
    }
  ): EnhancedCVTemplate[] => {
    const difficultyMap = {
      'entry': 'beginner',
      'mid': 'intermediate',
      'senior': 'intermediate'
    };

    const categoryMap = {
      'minimal': 'minimal',
      'modern': 'modern',
      'creative': 'creative',
      'traditional': 'classic'
    };

    return templates
      .filter(template => {
        // Filter by industry if specified
        if (userPreferences.industry) {
          const industryMatch = template.industryFit?.some(industry =>
            industry.toLowerCase().includes(userPreferences.industry!.toLowerCase())
          );
          if (!industryMatch) return false;
        }

        // Filter by experience level
        if (userPreferences.experienceLevel) {
          const preferredDifficulty = difficultyMap[userPreferences.experienceLevel];
          if (template.difficulty !== preferredDifficulty) return false;
        }

        // Filter by design preference
        if (userPreferences.designPreference) {
          const preferredCategory = categoryMap[userPreferences.designPreference];
          if (template.category !== preferredCategory) return false;
        }

        return true;
      })
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 3);
  },

  /**
   * Generate analytics data for templates
   */
  getTemplateAnalytics: (templates: EnhancedCVTemplate[]) => {
    const totalTemplates = templates.length;
    const popularTemplates = templates.filter(t => t.isPopular).length;
    const newTemplates = templates.filter(t => t.isNew).length;
    const highATSTemplates = templates.filter(t => t.atsScore && t.atsScore >= 95).length;
    
    const avgSuccessRate = templates.reduce((sum, t) => sum + (t.successRate || 0), 0) / totalTemplates;
    const avgATSScore = templates.reduce((sum, t) => sum + (t.atsScore || 0), 0) / totalTemplates;

    const categoryDistribution = templates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const industryDistribution = templates.reduce((acc, template) => {
      template.industryFit?.forEach(industry => {
        acc[industry] = (acc[industry] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTemplates,
      popularTemplates,
      newTemplates,
      highATSTemplates,
      avgSuccessRate: Math.round(avgSuccessRate),
      avgATSScore: Math.round(avgATSScore),
      categoryDistribution,
      industryDistribution
    };
  }
};

// Export enhanced template gallery with all improvements
export default TemplateGallery;
export { 
  enhancedTemplates, 
  colorSchemes, 
  templateUtils,
  type EnhancedCVTemplate,
  type TemplateCustomization,
  type TemplateGalleryProps 
};
