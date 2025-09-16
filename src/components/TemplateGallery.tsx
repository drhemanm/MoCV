// World-Class Professional Template Gallery
import React, { useState, useMemo, memo, useCallback } from 'react';
import { 
  Search, ChevronLeft, Eye, Heart, Clock, Star, Download, Sparkles,
  MapPin, Phone, Mail, Linkedin, User, X, ChevronRight, Award, Globe,
  Calendar, ExternalLink
} from 'lucide-react';

// Enhanced template system with world-class designs
interface WorldClassTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'creative' | 'executive' | 'minimal' | 'bold';
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  popularity: number;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
  isPremium?: boolean;
  layoutType: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    surface: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    accentFont: string;
  };
}

// Premium sample profiles with more realistic data
const premiumProfiles = [
  {
    name: "Alexandra Chen",
    title: "Senior Product Manager",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b9e10cf0?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    contact: {
      phone: "+1 (555) 123-4567",
      email: "alexandra.chen@gmail.com",
      address: "San Francisco, CA",
      linkedin: "linkedin.com/in/alexandrachen",
      website: "alexandrachen.com"
    },
    summary: "Strategic product leader with 8+ years driving user-centric innovation at scale. Led products serving 10M+ users with proven track record of increasing engagement by 200% and revenue by $50M annually.",
    experience: [
      {
        position: "Senior Product Manager",
        company: "Meta",
        location: "Menlo Park, CA",
        period: "Jan 2021 - Present",
        achievements: [
          "Led cross-functional team of 15+ engineers, designers, and analysts",
          "Launched 3 major features increasing user engagement by 45%",
          "Drove $25M ARR growth through strategic product initiatives",
          "Reduced customer acquisition cost by 30% via product optimization"
        ]
      },
      {
        position: "Product Manager",
        company: "Airbnb",
        location: "San Francisco, CA", 
        period: "Mar 2019 - Dec 2020",
        achievements: [
          "Managed host onboarding flow serving 500K+ new hosts annually",
          "Improved conversion rates by 60% through data-driven A/B testing",
          "Collaborated with international teams across 15+ countries"
        ]
      },
      {
        position: "Associate Product Manager",
        company: "Google",
        location: "Mountain View, CA",
        period: "Jun 2018 - Feb 2019", 
        achievements: [
          "Shipped 5 consumer features reaching 100M+ users globally",
          "Reduced load times by 40% through performance optimization"
        ]
      }
    ],
    skills: [
      { name: "Product Strategy", level: 95, category: "Leadership" },
      { name: "Data Analysis", level: 90, category: "Technical" },
      { name: "User Research", level: 85, category: "Research" },
      { name: "SQL", level: 80, category: "Technical" },
      { name: "A/B Testing", level: 90, category: "Analytics" },
      { name: "Agile/Scrum", level: 85, category: "Process" },
      { name: "Cross-functional Leadership", level: 95, category: "Leadership" },
      { name: "Market Research", level: 80, category: "Strategy" }
    ],
    education: [
      {
        degree: "MBA, Technology Management",
        school: "Stanford Graduate School of Business",
        year: "2018",
        details: "Dean's List, Product Management Fellow"
      },
      {
        degree: "BS, Computer Science",
        school: "UC Berkeley",
        year: "2016", 
        details: "Summa Cum Laude, Phi Beta Kappa"
      }
    ],
    certifications: [
      "Certified Product Manager (CPM)",
      "Google Analytics Certified",
      "AWS Cloud Practitioner"
    ]
  },
  {
    name: "Marcus Rodriguez",
    title: "Creative Director & Brand Strategist", 
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    contact: {
      phone: "+1 (555) 987-6543",
      email: "marcus.rodriguez@creative.co",
      address: "New York, NY",
      linkedin: "linkedin.com/in/marcusrodriguez",
      website: "marcusdesigns.co"
    },
    summary: "Award-winning creative director with 10+ years crafting compelling brand narratives for Fortune 500 companies. Specialized in digital-first campaigns that drive measurable business impact and cultural resonance.",
    experience: [
      {
        position: "Creative Director",
        company: "Ogilvy & Mather",
        location: "New York, NY",
        period: "Mar 2020 - Present",
        achievements: [
          "Led creative vision for 20+ global brands including Nike, Coca-Cola",
          "Won 5 Cannes Lions and 3 D&AD Pencils for breakthrough campaigns",
          "Increased client retention rate by 40% through innovative solutions",
          "Managed creative team of 25+ designers, copywriters, and strategists"
        ]
      },
      {
        position: "Senior Art Director",
        company: "BBDO Worldwide",
        location: "New York, NY",
        period: "Jan 2018 - Feb 2020",
        achievements: [
          "Created integrated campaigns generating $100M+ in media value",
          "Led digital transformation initiatives for traditional clients",
          "Increased social engagement by 300% through viral content strategy"
        ]
      }
    ],
    skills: [
      { name: "Brand Strategy", level: 95, category: "Strategy" },
      { name: "Creative Direction", level: 95, category: "Creative" },
      { name: "Adobe Creative Suite", level: 90, category: "Technical" },
      { name: "Campaign Development", level: 90, category: "Marketing" },
      { name: "Team Leadership", level: 85, category: "Leadership" },
      { name: "Digital Marketing", level: 85, category: "Marketing" }
    ],
    education: [
      {
        degree: "MFA, Graphic Design",
        school: "Parsons School of Design",
        year: "2014",
        details: "Outstanding Achievement Award"
      }
    ],
    certifications: [
      "Google Ads Certified",
      "Facebook Blueprint Certified"
    ]
  }
];

// World-class template definitions
const worldClassTemplates: WorldClassTemplate[] = [
  {
    id: 'executive-sapphire',
    name: 'Executive Sapphire',
    description: 'Premium executive template with sophisticated navy design and elegant gold accents',
    category: 'executive',
    features: ['Premium Design', 'Executive Layout', 'Gold Accents', 'Photo Integration'],
    difficulty: 'intermediate',
    estimatedTime: '20 minutes',
    popularity: 98,
    tags: ['executive', 'premium', 'sophisticated', 'corporate'],
    isPopular: true,
    isPremium: true,
    layoutType: 'executive-premium',
    colorScheme: {
      primary: '#1e2a4a',
      secondary: '#2c3e60',
      accent: '#d4af37',
      text: '#2c3e60',
      background: '#ffffff',
      surface: '#f8f9fb'
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Inter',
      accentFont: 'Montserrat'
    }
  },
  {
    id: 'modern-aurora',
    name: 'Modern Aurora',
    description: 'Contemporary design with gradient accents and clean typography for tech professionals',
    category: 'modern',
    features: ['Gradient Design', 'Modern Layout', 'Tech Optimized', 'ATS Friendly'],
    difficulty: 'beginner',
    estimatedTime: '15 minutes',
    popularity: 94,
    tags: ['modern', 'tech', 'gradient', 'contemporary'],
    isPopular: true,
    layoutType: 'modern-gradient',
    colorScheme: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      text: '#2d3748',
      background: '#ffffff',
      surface: '#f7fafc'
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      accentFont: 'Inter'
    }
  },
  {
    id: 'creative-prism',
    name: 'Creative Prism',
    description: 'Bold creative template with vibrant colors and asymmetric design for creative professionals',
    category: 'creative',
    features: ['Vibrant Colors', 'Asymmetric Layout', 'Portfolio Focus', 'Creative Sections'],
    difficulty: 'advanced',
    estimatedTime: '25 minutes',
    popularity: 89,
    tags: ['creative', 'colorful', 'asymmetric', 'portfolio'],
    isNew: true,
    layoutType: 'creative-asymmetric',
    colorScheme: {
      primary: '#e53e3e',
      secondary: '#dd6b20',
      accent: '#38b2ac',
      text: '#2d3748',
      background: '#ffffff',
      surface: '#fff5f5'
    },
    typography: {
      headingFont: 'Oswald',
      bodyFont: 'Source Sans Pro',
      accentFont: 'Poppins'
    }
  },
  {
    id: 'minimal-zen',
    name: 'Minimal Zen',
    description: 'Ultra-clean minimalist design focusing on typography and whitespace',
    category: 'minimal',
    features: ['Ultra Clean', 'Typography Focus', 'Whitespace Design', 'Elegant'],
    difficulty: 'beginner',
    estimatedTime: '12 minutes',
    popularity: 91,
    tags: ['minimal', 'clean', 'typography', 'elegant'],
    layoutType: 'minimal-clean',
    colorScheme: {
      primary: '#2d3748',
      secondary: '#4a5568',
      accent: '#718096',
      text: '#2d3748',
      background: '#ffffff',
      surface: '#fafafa'
    },
    typography: {
      headingFont: 'Crimson Text',
      bodyFont: 'Source Sans Pro',
      accentFont: 'Lato'
    }
  },
  {
    id: 'bold-impact',
    name: 'Bold Impact',
    description: 'High-impact design with strong visual hierarchy for competitive industries',
    category: 'bold',
    features: ['High Impact', 'Strong Hierarchy', 'Competitive Edge', 'Results Focus'],
    difficulty: 'intermediate',
    estimatedTime: '18 minutes',
    popularity: 87,
    tags: ['bold', 'impact', 'competitive', 'strong'],
    isNew: true,
    layoutType: 'bold-hierarchy',
    colorScheme: {
      primary: '#1a202c',
      secondary: '#2d3748',
      accent: '#ed8936',
      text: '#1a202c',
      background: '#ffffff',
      surface: '#f7fafc'
    },
    typography: {
      headingFont: 'Montserrat',
      bodyFont: 'Open Sans',
      accentFont: 'Roboto'
    }
  }
];

// World-class preview components
const ExecutiveSapphirePreview = ({ profile, template }) => (
  <div className="w-full h-full bg-white shadow-2xl overflow-hidden" style={{ fontFamily: template.typography.bodyFont, fontSize: '9px', lineHeight: '1.4' }}>
    {/* Header with photo and name */}
    <div className="relative" style={{ background: `linear-gradient(135deg, ${template.colorScheme.primary} 0%, ${template.colorScheme.secondary} 100%)` }}>
      <div className="flex items-center p-6 text-white">
        <div className="w-20 h-20 rounded-full overflow-hidden mr-6 border-4" style={{ borderColor: template.colorScheme.accent }}>
          <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: template.typography.headingFont, color: template.colorScheme.accent }}>
            {profile.name}
          </h1>
          <h2 className="text-lg opacity-90 mb-2">{profile.title}</h2>
          <div className="flex items-center gap-4 text-xs opacity-75">
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
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="w-full h-full border-4 rounded-full" style={{ borderColor: template.colorScheme.accent }}></div>
      </div>
    </div>

    <div className="flex">
      {/* Left column */}
      <div className="w-2/3 p-6 space-y-6">
        {/* Executive Summary */}
        <div>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" 
              style={{ color: template.colorScheme.primary, fontFamily: template.typography.headingFont }}>
            <div className="w-1 h-4" style={{ backgroundColor: template.colorScheme.accent }}></div>
            EXECUTIVE SUMMARY
          </h3>
          <p className="text-xs leading-relaxed text-gray-700">{profile.summary}</p>
        </div>

        {/* Professional Experience */}
        <div>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" 
              style={{ color: template.colorScheme.primary, fontFamily: template.typography.headingFont }}>
            <div className="w-1 h-4" style={{ backgroundColor: template.colorScheme.accent }}></div>
            PROFESSIONAL EXPERIENCE
          </h3>
          <div className="space-y-4">
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-4">
                <div className="absolute left-0 top-1 w-2 h-2 rounded-full" 
                     style={{ backgroundColor: template.colorScheme.accent }}></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-xs" style={{ color: template.colorScheme.primary }}>
                      {exp.position}
                    </h4>
                    <p className="text-xs font-semibold" style={{ color: template.colorScheme.accent }}>
                      {exp.company}
                    </p>
                    <p className="text-xs text-gray-600">{exp.location}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded" 
                        style={{ backgroundColor: template.colorScheme.surface, color: template.colorScheme.primary }}>
                    {exp.period}
                  </span>
                </div>
                <ul className="text-xs text-gray-700 space-y-1">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="leading-relaxed">• {achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-1/3 p-6 space-y-6" style={{ backgroundColor: template.colorScheme.surface }}>
        {/* Skills */}
        <div>
          <h3 className="text-sm font-bold mb-3" 
              style={{ color: template.colorScheme.primary, fontFamily: template.typography.headingFont }}>
            CORE COMPETENCIES
          </h3>
          <div className="space-y-3">
            {profile.skills.slice(0, 8).map((skill, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{skill.name}</span>
                  <span style={{ color: template.colorScheme.accent }}>{skill.level}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(90deg, ${template.colorScheme.accent} 0%, ${template.colorScheme.primary} 100%)`,
                      width: `${skill.level}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="text-sm font-bold mb-3" 
              style={{ color: template.colorScheme.primary, fontFamily: template.typography.headingFont }}>
            EDUCATION
          </h3>
          <div className="space-y-3">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg shadow-sm border-l-4" 
                   style={{ borderColor: template.colorScheme.accent }}>
                <h4 className="font-bold text-xs" style={{ color: template.colorScheme.primary }}>
                  {edu.degree}
                </h4>
                <p className="text-xs text-gray-600">{edu.school}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">{edu.year}</span>
                  {edu.details && (
                    <span className="text-xs px-2 py-1 rounded-full" 
                          style={{ backgroundColor: template.colorScheme.accent, color: 'white' }}>
                      {edu.details.split(',')[0]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        {profile.certifications && (
          <div>
            <h3 className="text-sm font-bold mb-3" 
                style={{ color: template.colorScheme.primary, fontFamily: template.typography.headingFont }}>
              CERTIFICATIONS
            </h3>
            <div className="space-y-2">
              {profile.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Award className="w-3 h-3" style={{ color: template.colorScheme.accent }} />
                  <span className="text-xs text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Links */}
        <div>
          <h3 className="text-sm font-bold mb-3" 
              style={{ color: template.colorScheme.primary, fontFamily: template.typography.headingFont }}>
            CONNECT
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Linkedin className="w-3 h-3" style={{ color: template.colorScheme.accent }} />
              <span className="text-xs text-gray-700">{profile.contact.linkedin}</span>
            </div>
            {profile.contact.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3" style={{ color: template.colorScheme.accent }} />
                <span className="text-xs text-gray-700">{profile.contact.website}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ModernAuroraPreview = ({ profile, template }) => (
  <div className="w-full h-full bg-white shadow-2xl overflow-hidden" style={{ fontFamily: template.typography.bodyFont, fontSize: '9px', lineHeight: '1.4' }}>
    {/* Gradient header */}
    <div className="relative h-16" style={{ 
      background: `linear-gradient(135deg, ${template.colorScheme.primary} 0%, ${template.colorScheme.secondary} 100%)` 
    }}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
    </div>

    <div className="relative -mt-8 mx-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-1" 
                style={{ color: template.colorScheme.primary, fontFamily: template.typography.headingFont }}>
              {profile.name}
            </h1>
            <h2 className="text-sm font-medium mb-2" 
                style={{ color: template.colorScheme.secondary }}>
              {profile.title}
            </h2>
            <div className="flex flex-wrap gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {profile.contact.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {profile.contact.phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profile.contact.address}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="flex mt-6 gap-6 px-6 pb-6">
      {/* Main content */}
      <div className="flex-1 space-y-6">
        {/* Summary */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                 style={{ background: `linear-gradient(135deg, ${template.colorScheme.primary}, ${template.colorScheme.accent})` }}>
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold" 
                style={{ color: template.colorScheme.primary, fontFamily: template.typography.headingFont }}>
              PROFILE OVERVIEW
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-gray-700 pl-11">{profile.summary}</p>
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                 style={{ background: `linear-gradient(135deg, ${template.colorScheme.secondary}, ${template.colorScheme.accent})` }}>
              <Award className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold" 
                style={{ color: template.colorScheme.primary, fontFamily: template.typography.headingFont }}>
              PROFESSIONAL EXPERIENCE
            </h3>
          </div>
          <div className="pl-11 space-y-4">
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-xs mb-1" style={{ color: template.colorScheme.primary }}>
                      {exp.position}
                    </h4>
                    <p className="text-xs font-semibold" style={{ color: template.colorScheme.secondary }}>
                      {exp.company} • {exp.location}
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full text-white"
                        style={{ background: `linear-gradient(135deg, ${template.colorScheme.primary}, ${template.colorScheme.accent})` }}>
                    {exp.period}
                  </span>
                </div>
                <ul className="text-xs text-gray-700 space-y-1 mt-3">
                  {exp.achievements.slice(0, 3).map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                           style={{ backgroundColor: template.colorScheme.accent }}></div>
                      <span className="leading-relaxed">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 space-y-6">
        {/* Skills */}
        <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-100">
          <h3 className="text-sm font-bold mb-4" 
              style={{ color: template.colorScheme.primary, fontFamily: template.typography.headingFont }}>
            TECHNICAL EXPERTISE
          </h3>
          <div className="space-y-3">
            {profile.skills.slice(0, 6).map((skill, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span style={{ color: template.colorScheme.primary }}>{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      background: `linear-gradient(90deg, ${template.colorScheme.primary}, ${template.colorScheme.accent})`,
                      width: `${skill.level}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-100">
          <h3 className="text-sm font-bold mb-4" 
              style={{ color: template.colorScheme.primary, fontFamily: template.typography.headingFont }}>
            EDUCATION
          </h3>
          <div className="space-y-4">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="relative">
                <div className="absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-white"
                     style={{ backgroundColor: template.colorScheme.accent }}></div>
                <div className="pl-5">
                  <h4 className="font-bold text-xs" style={{ color: template.colorScheme.primary }}>
                    {edu.degree}
                  </h4>
                  <p className="text-xs text-gray-600">{edu.school}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{edu.year}</span>
                    {edu.details && (
                      <span className="text-xs px-2 py-1 rounded-full" 
                            style={{ backgroundColor: `${template.colorScheme.accent}20`, color: template.colorScheme.primary }}>
                        {edu.details.split(',')[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Template Card Component with enhanced previews
const WorldClassTemplateCard = memo(({ template, profile, onSelect, onPreview }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const renderPreview = () => {
    const props = { profile, template };
    
    switch (template.layoutType) {
      case 'executive-premium':
        return <ExecutiveSapphirePreview {...props} />;
      case 'modern-gradient':
        return <ModernAuroraPreview {...props} />;
      default:
        return <ExecutiveSapphirePreview {...props} />;
    }
  };

  return (
    <div 
      className={`group relative bg-white border-2 rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer
        hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-2 
        ${isHovered ? 'transform -translate-y-2 shadow-2xl border-gray-300' : 'border-gray-100 shadow-lg'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(template)}
    >
      {/* Template Preview */}
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="w-full h-full transform transition-all duration-500 group-hover:scale-110">
          {renderPreview()}
        </div>
        
        {/* Premium overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Enhanced hover overlay */}
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-4">
            {onPreview && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(template);
                }}
                className="bg-white/90 backdrop-blur text-gray-900 px-6 py-3 rounded-xl font-medium flex items-center space-x-2 hover:bg-white transition-all transform hover:scale-105 shadow-lg"
              >
                <Eye className="w-4 h-4" />
                <span>Full Preview</span>
              </button>
            )}
            <button 
              onClick={() => onSelect(template)}
              className="px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all transform hover:scale-105 text-white shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${template.colorScheme.primary}, ${template.colorScheme.accent})` 
              }}
            >
              <Download className="w-4 h-4" />
              <span>Use Template</span>
            </button>
          </div>
        </div>

        {/* Enhanced badges */}
        <div className="absolute top-4 left-4 flex space-x-2">
          {template.isPremium && (
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 text-xs px-3 py-2 rounded-full font-bold flex items-center space-x-1 shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              <span>PREMIUM</span>
            </span>
          )}
          {template.isPopular && !template.isPremium && (
            <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-3 py-2 rounded-full font-bold flex items-center space-x-1 shadow-lg">
              <Sparkles className="w-3 h-3" />
              <span>POPULAR</span>
            </span>
          )}
          {template.isNew && (
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-3 py-2 rounded-full font-bold shadow-lg">
              NEW
            </span>
          )}
        </div>

        {/* Category indicator */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-black/70 backdrop-blur text-white text-xs px-3 py-2 rounded-full font-medium capitalize shadow-lg">
            {template.category}
          </span>
        </div>
      </div>

      {/* Enhanced template info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2" style={{ fontFamily: template.typography.headingFont }}>
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>

        {/* Enhanced metadata */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              {template.estimatedTime}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current text-yellow-500" />
              <span className="text-gray-700 font-medium">{(template.popularity / 10).toFixed(1)}</span>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full font-medium text-xs ${
            template.difficulty === 'beginner' ? 'bg-green-100 text-green-700 border border-green-200' :
            template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
            'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {template.difficulty}
          </span>
        </div>

        {/* Enhanced features */}
        <div className="flex flex-wrap gap-2">
          {template.features.slice(0, 4).map((feature, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1.5 rounded-full font-medium border transition-colors hover:scale-105"
              style={{ 
                backgroundColor: `${template.colorScheme.primary}10`,
                color: template.colorScheme.primary,
                borderColor: `${template.colorScheme.primary}30`
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
const WorldClassTemplateGallery = ({ onTemplateSelect, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState(premiumProfiles[0]);
  
  const filteredTemplates = useMemo(() => {
    let filtered = worldClassTemplates;
    
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
    
    return filtered.sort((a, b) => {
      // Sort by premium first, then popularity
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      return b.popularity - a.popularity;
    });
  }, [searchQuery, selectedCategory]);

  const categories = [
    { id: 'all', name: 'All Templates', count: worldClassTemplates.length },
    { id: 'executive', name: 'Executive', count: worldClassTemplates.filter(t => t.category === 'executive').length },
    { id: 'modern', name: 'Modern', count: worldClassTemplates.filter(t => t.category === 'modern').length },
    { id: 'creative', name: 'Creative', count: worldClassTemplates.filter(t => t.category === 'creative').length },
    { id: 'minimal', name: 'Minimal', count: worldClassTemplates.filter(t => t.category === 'minimal').length },
    { id: 'bold', name: 'Bold', count: worldClassTemplates.filter(t => t.category === 'bold').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">World-Class CV Templates</h1>
              <p className="text-gray-600 text-lg">Professional templates designed to make you stand out</p>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-6 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates by name, style, or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur text-lg"
              />
            </div>
            <select 
              value={selectedProfile.name}
              onChange={(e) => setSelectedProfile(premiumProfiles.find(p => p.name === e.target.value) || premiumProfiles[0])}
              className="px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur text-lg min-w-64"
            >
              {premiumProfiles.map(profile => (
                <option key={profile.name} value={profile.name}>
                  Preview as: {profile.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
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

      {/* Main Content with enhanced spacing */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <WorldClassTemplateCard
              key={template.id}
              template={template}
              profile={selectedProfile}
              onSelect={onTemplateSelect}
              onPreview={() => {}} // Can implement modal preview later
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorldClassTemplateGallery;
