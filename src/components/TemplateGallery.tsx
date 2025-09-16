import React, { useState, useMemo, memo, useCallback } from 'react';
import { 
  Search, ChevronLeft, Eye, Heart, Clock, Star, Download, Sparkles,
  MapPin, Phone, Mail, Linkedin, User, X, Award, Globe, CheckCircle,
  Calendar, ExternalLink, Shield, Zap, TrendingUp, Target, Briefcase,
  GraduationCap, Code, Palette, Building, Stethoscope, DollarSign
} from 'lucide-react';

// Ultimate template interface with industry specialization
interface UltimateTemplate {
  id: string;
  name: string;
  description: string;
  category: 'ats-killer' | 'executive' | 'creative' | 'tech' | 'finance' | 'healthcare' | 'marketing' | 'consulting';
  industry: string[];
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  popularity: number;
  atsScore: number; // 0-100 ATS compatibility score
  humanAppeal: number; // 0-100 visual appeal score
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
  isPremium?: boolean;
  isATSKiller?: boolean; // Templates specifically designed to beat ATS
  layoutType: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    surface: string;
    gradient: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    sizes: {
      h1: string;
      h2: string;
      body: string;
    }
  };
}

// Professional profiles with actual photos (using placeholder service that works)
const ultimateProfiles = [
  {
    name: "Sarah Chen",
    title: "Senior Product Manager",
    industry: "Technology",
    photo: `data:image/svg+xml;base64,${btoa(`
      <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="#3B82F6" rx="60"/>
        <text x="60" y="75" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="white">SC</text>
      </svg>
    `)}`,
    contact: {
      phone: "(555) 123-4567",
      email: "sarah.chen@email.com",
      address: "San Francisco, CA",
      linkedin: "linkedin.com/in/sarahchen",
      website: "sarahchen.dev"
    },
    summary: "Strategic product leader with 8+ years driving user-centric innovation at scale. Led products serving 10M+ users with proven track record of increasing engagement by 200% and revenue by $25M annually.",
    experience: [
      {
        position: "Senior Product Manager",
        company: "Meta",
        location: "Menlo Park, CA",
        period: "Jan 2021 - Present",
        achievements: [
          "Led cross-functional team of 15+ engineers and designers",
          "Launched 3 major features increasing user engagement by 45%",
          "Drove $25M ARR growth through strategic product initiatives",
          "Reduced customer acquisition cost by 30% via optimization"
        ]
      },
      {
        position: "Product Manager",
        company: "Google",
        location: "Mountain View, CA",
        period: "Mar 2019 - Dec 2020",
        achievements: [
          "Managed consumer products reaching 100M+ users globally",
          "Improved conversion rates by 60% through A/B testing",
          "Led international expansion across 15+ markets"
        ]
      }
    ],
    skills: [
      { name: "Product Strategy", level: 95, category: "Strategy" },
      { name: "Data Analysis", level: 90, category: "Technical" },
      { name: "User Research", level: 88, category: "Research" },
      { name: "SQL/Analytics", level: 85, category: "Technical" },
      { name: "A/B Testing", level: 92, category: "Analytics" },
      { name: "Team Leadership", level: 94, category: "Leadership" }
    ],
    education: [
      {
        degree: "MBA, Technology Management",
        school: "Stanford Graduate School of Business",
        year: "2019",
        details: "Dean's List, Product Management Fellow"
      },
      {
        degree: "BS, Computer Science",
        school: "UC Berkeley",
        year: "2017"
      }
    ]
  },
  {
    name: "Marcus Johnson",
    title: "Investment Banking Director",
    industry: "Finance",
    photo: `data:image/svg+xml;base64,${btoa(`
      <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="#1E40AF" rx="60"/>
        <text x="60" y="75" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="white">MJ</text>
      </svg>
    `)}`,
    contact: {
      phone: "(555) 987-6543",
      email: "marcus.johnson@finance.com",
      address: "New York, NY",
      linkedin: "linkedin.com/in/marcusjohnson"
    },
    summary: "Senior investment banking professional with 12+ years executing $50B+ in M&A transactions. Track record of leading deal teams and delivering exceptional client outcomes in complex financial environments.",
    experience: [
      {
        position: "Director, Investment Banking",
        company: "Goldman Sachs",
        location: "New York, NY",
        period: "2020 - Present",
        achievements: [
          "Led execution of 25+ M&A transactions totaling $12B in value",
          "Generated $45M in fees through strategic client relationships",
          "Managed teams of 8+ analysts and associates across multiple deals"
        ]
      }
    ],
    skills: [
      { name: "M&A Execution", level: 96, category: "Finance" },
      { name: "Financial Modeling", level: 94, category: "Technical" },
      { name: "Client Management", level: 92, category: "Business" },
      { name: "Team Leadership", level: 90, category: "Leadership" }
    ],
    education: [
      {
        degree: "MBA, Finance",
        school: "Wharton School",
        year: "2016",
        details: "Beta Gamma Sigma"
      }
    ]
  },
  {
    name: "Dr. Emily Rodriguez",
    title: "Emergency Medicine Physician",
    industry: "Healthcare", 
    photo: `data:image/svg+xml;base64,${btoa(`
      <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="#DC2626" rx="60"/>
        <text x="60" y="75" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="white">ER</text>
      </svg>
    `)}`,
    contact: {
      phone: "(555) 456-7890",
      email: "emily.rodriguez@hospital.com",
      address: "Chicago, IL",
      linkedin: "linkedin.com/in/emilyrodriguezmd"
    },
    summary: "Board-certified Emergency Medicine physician with 10+ years of critical care experience. Led quality improvement initiatives reducing patient wait times by 40% while maintaining 98% patient satisfaction scores.",
    experience: [
      {
        position: "Attending Physician, Emergency Medicine",
        company: "Northwestern Memorial Hospital",
        location: "Chicago, IL",
        period: "2019 - Present",
        achievements: [
          "Treated 3,000+ patients annually in Level I trauma center",
          "Led quality improvement reducing average wait time by 40%",
          "Mentored 25+ medical residents and students"
        ]
      }
    ],
    skills: [
      { name: "Emergency Medicine", level: 98, category: "Medical" },
      { name: "Critical Care", level: 96, category: "Medical" },
      { name: "Quality Improvement", level: 90, category: "Operations" },
      { name: "Medical Education", level: 88, category: "Teaching" }
    ],
    education: [
      {
        degree: "MD, Doctor of Medicine",
        school: "Johns Hopkins School of Medicine",
        year: "2014"
      }
    ]
  }
];

// Ultimate template collection with industry focus and ATS intelligence
const ultimateTemplates: UltimateTemplate[] = [
  {
    id: 'ats-killer-pro',
    name: 'ATS Killer Pro',
    description: 'Scientifically designed to beat 99% of ATS systems while maintaining professional appearance',
    category: 'ats-killer',
    industry: ['All Industries', 'Corporate', 'Government'],
    features: ['99% ATS Pass Rate', 'Keyword Optimization', 'Clean Parse', 'Standard Fonts'],
    difficulty: 'beginner',
    estimatedTime: '8 minutes',
    popularity: 99,
    atsScore: 99,
    humanAppeal: 75,
    tags: ['ats-killer', 'professional', 'universal', 'optimized'],
    isPopular: true,
    isATSKiller: true,
    layoutType: 'ats-killer-single',
    colorScheme: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f8fafc',
      gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)'
    },
    typography: {
      headingFont: 'Arial, sans-serif',
      bodyFont: 'Arial, sans-serif',
      sizes: { h1: '18px', h2: '14px', body: '11px' }
    }
  },
  {
    id: 'tech-innovator',
    name: 'Tech Innovator',
    description: 'Modern template for software engineers, product managers, and tech leaders',
    category: 'tech',
    industry: ['Technology', 'Startups', 'Software', 'AI/ML'],
    features: ['Code-Friendly', 'Project Showcase', 'Skills Matrix', 'GitHub Integration'],
    difficulty: 'intermediate',
    estimatedTime: '15 minutes',
    popularity: 94,
    atsScore: 85,
    humanAppeal: 95,
    tags: ['tech', 'modern', 'projects', 'engineering'],
    isNew: true,
    layoutType: 'tech-modern',
    colorScheme: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f0fdf4',
      gradient: 'linear-gradient(135deg, #059669, #10b981)'
    },
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      sizes: { h1: '24px', h2: '16px', body: '12px' }
    }
  },
  {
    id: 'executive-platinum',
    name: 'Executive Platinum',
    description: 'Premium executive template for C-suite, directors, and senior leadership roles',
    category: 'executive',
    industry: ['Executive', 'Finance', 'Consulting', 'Legal'],
    features: ['Executive Photo', 'Leadership Focus', 'Premium Design', 'Board Experience'],
    difficulty: 'advanced',
    estimatedTime: '22 minutes',
    popularity: 96,
    atsScore: 70,
    humanAppeal: 98,
    tags: ['executive', 'premium', 'leadership', 'sophisticated'],
    isPremium: true,
    layoutType: 'executive-premium',
    colorScheme: {
      primary: '#1e293b',
      secondary: '#334155',
      accent: '#0ea5e9',
      text: '#0f172a',
      background: '#ffffff',
      surface: '#f1f5f9',
      gradient: 'linear-gradient(135deg, #1e293b, #0ea5e9)'
    },
    typography: {
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Inter, sans-serif',
      sizes: { h1: '28px', h2: '18px', body: '12px' }
    }
  },
  {
    id: 'finance-professional',
    name: 'Finance Professional',
    description: 'Sophisticated design for investment banking, private equity, and financial services',
    category: 'finance',
    industry: ['Investment Banking', 'Private Equity', 'Asset Management', 'Corporate Finance'],
    features: ['Deal Experience', 'Quantitative Focus', 'Professional Photo', 'Executive Format'],
    difficulty: 'intermediate',
    estimatedTime: '18 minutes',
    popularity: 92,
    atsScore: 82,
    humanAppeal: 90,
    tags: ['finance', 'investment-banking', 'quantitative', 'professional'],
    layoutType: 'finance-executive',
    colorScheme: {
      primary: '#1e40af',
      secondary: '#1d4ed8',
      accent: '#3b82f6',
      text: '#1e293b',
      background: '#ffffff',
      surface: '#f8fafc',
      gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)'
    },
    typography: {
      headingFont: 'Montserrat, sans-serif',
      bodyFont: 'Open Sans, sans-serif',
      sizes: { h1: '22px', h2: '16px', body: '11px' }
    }
  },
  {
    id: 'healthcare-professional',
    name: 'Healthcare Professional',
    description: 'Clean, trustworthy design for physicians, nurses, and healthcare administrators',
    category: 'healthcare',
    industry: ['Healthcare', 'Medical', 'Pharmaceutical', 'Biotech'],
    features: ['Medical Credentials', 'Patient Focus', 'Clean Design', 'Certification Showcase'],
    difficulty: 'beginner',
    estimatedTime: '14 minutes',
    popularity: 88,
    atsScore: 90,
    humanAppeal: 85,
    tags: ['healthcare', 'medical', 'trustworthy', 'credentials'],
    layoutType: 'healthcare-clean',
    colorScheme: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#f87171',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#fef2f2',
      gradient: 'linear-gradient(135deg, #dc2626, #f87171)'
    },
    typography: {
      headingFont: 'Source Sans Pro, sans-serif',
      bodyFont: 'Source Sans Pro, sans-serif',
      sizes: { h1: '20px', h2: '15px', body: '11px' }
    }
  },
  {
    id: 'creative-director',
    name: 'Creative Director',
    description: 'Bold, visually striking template for creative professionals and agencies',
    category: 'creative',
    industry: ['Design', 'Marketing', 'Advertising', 'Media', 'Creative Agencies'],
    features: ['Portfolio Integration', 'Visual Impact', 'Creative Layout', 'Brand Showcase'],
    difficulty: 'advanced',
    estimatedTime: '25 minutes',
    popularity: 89,
    atsScore: 60,
    humanAppeal: 98,
    tags: ['creative', 'design', 'visual', 'portfolio'],
    layoutType: 'creative-bold',
    colorScheme: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#a78bfa',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#faf5ff',
      gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)'
    },
    typography: {
      headingFont: 'Oswald, sans-serif',
      bodyFont: 'Source Sans Pro, sans-serif',
      sizes: { h1: '32px', h2: '20px', body: '12px' }
    }
  },
  {
    id: 'marketing-growth',
    name: 'Marketing Growth',
    description: 'Dynamic template highlighting growth metrics and marketing achievements',
    category: 'marketing',
    industry: ['Digital Marketing', 'Growth', 'E-commerce', 'SaaS'],
    features: ['Metrics Focus', 'Campaign Showcase', 'Growth Stories', 'ROI Highlights'],
    difficulty: 'intermediate',
    estimatedTime: '16 minutes',
    popularity: 91,
    atsScore: 78,
    humanAppeal: 92,
    tags: ['marketing', 'growth', 'metrics', 'digital'],
    isNew: true,
    layoutType: 'marketing-dynamic',
    colorScheme: {
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#f97316',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#fff7ed',
      gradient: 'linear-gradient(135deg, #ea580c, #f97316)'
    },
    typography: {
      headingFont: 'Poppins, sans-serif',
      bodyFont: 'Inter, sans-serif',
      sizes: { h1: '26px', h2: '17px', body: '12px' }
    }
  },
  {
    id: 'consulting-strategy',
    name: 'Consulting Strategy',
    description: 'Professional template for management consultants and strategy professionals',
    category: 'consulting',
    industry: ['Management Consulting', 'Strategy', 'Business Analysis'],
    features: ['Case Study Format', 'Problem-Solving Focus', 'Client Results', 'Analytical Skills'],
    difficulty: 'intermediate',
    estimatedTime: '20 minutes',
    popularity: 93,
    atsScore: 88,
    humanAppeal: 87,
    tags: ['consulting', 'strategy', 'analytical', 'client-focused'],
    layoutType: 'consulting-structured',
    colorScheme: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#0ea5e9',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f8fafc',
      gradient: 'linear-gradient(135deg, #0f172a, #0ea5e9)'
    },
    typography: {
      headingFont: 'Merriweather, serif',
      bodyFont: 'Open Sans, sans-serif',
      sizes: { h1: '24px', h2: '16px', body: '11px' }
    }
  }
];

// ATS Killer Preview Component - Scientifically optimized
const ATSKillerPreview = ({ profile, template }) => (
  <div className="w-full h-full bg-white border border-gray-300 overflow-hidden" 
       style={{ fontFamily: template.typography.bodyFont, fontSize: template.typography.sizes.body, lineHeight: '1.4' }}>
    <div className="p-4 space-y-3">
      {/* Header - Perfect ATS format */}
      <div className="text-center border-b-2 border-gray-400 pb-2">
        <h1 className="font-bold mb-1" 
            style={{ fontSize: template.typography.sizes.h1, color: template.colorScheme.primary }}>
          {profile.name.toUpperCase()}
        </h1>
        <div className="font-semibold mb-1" style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.secondary }}>
          {profile.title}
        </div>
        <div className="text-xs text-gray-700">
          {profile.contact.email} | {profile.contact.phone} | {profile.contact.address}
          <br />
          {profile.contact.linkedin} | {profile.contact.website}
        </div>
      </div>

      {/* Professional Summary - ATS Optimized */}
      <div>
        <h2 className="font-bold mb-1" 
            style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
          PROFESSIONAL SUMMARY
        </h2>
        <p className="text-xs leading-relaxed text-gray-800">{profile.summary}</p>
      </div>

      {/* Core Competencies - Keyword Rich */}
      <div>
        <h2 className="font-bold mb-1" 
            style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
          CORE COMPETENCIES
        </h2>
        <div className="text-xs text-gray-800">
          {profile.skills.map(skill => skill.name).join(' • ')}
        </div>
      </div>

      {/* Professional Experience - ATS Perfect */}
      <div>
        <h2 className="font-bold mb-2" 
            style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
          PROFESSIONAL EXPERIENCE
        </h2>
        <div className="space-y-2">
          {profile.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-xs">{exp.position}</h3>
                  <div className="font-semibold text-xs">{exp.company}, {exp.location}</div>
                </div>
                <div className="text-xs font-medium">{exp.period}</div>
              </div>
              <ul className="text-xs text-gray-700 mt-1 space-y-0.5 ml-2">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="list-disc ml-3">{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="font-bold mb-1" 
            style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
          EDUCATION
        </h2>
        <div className="space-y-1">
          {profile.education.map((edu, idx) => (
            <div key={idx} className="text-xs">
              <div className="font-semibold">{edu.degree}</div>
              <div>{edu.school}, {edu.year}</div>
              {edu.details && <div className="text-gray-600">{edu.details}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Executive Platinum Preview with Professional Photo
const ExecutivePlatinumPreview = ({ profile, template }) => (
  <div className="w-full h-full bg-white shadow-xl overflow-hidden border" 
       style={{ fontFamily: template.typography.bodyFont, fontSize: template.typography.sizes.body, lineHeight: '1.3' }}>
    {/* Premium header with photo */}
    <div className="relative h-20" style={{ background: template.colorScheme.gradient }}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative flex items-center h-full px-6 text-white">
        <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-3 border-white/30 shadow-lg">
          <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold mb-1" 
              style={{ fontSize: template.typography.sizes.h1, fontFamily: template.typography.headingFont }}>
            {profile.name}
          </h1>
          <h2 className="opacity-90" style={{ fontSize: template.typography.sizes.h2 }}>
            {profile.title}
          </h2>
        </div>
        <div className="text-right text-xs opacity-80">
          <div>{profile.contact.phone}</div>
          <div>{profile.contact.email}</div>
          <div>{profile.contact.address}</div>
        </div>
      </div>
    </div>

    <div className="flex">
      {/* Main content */}
      <div className="flex-1 p-4 space-y-4">
        <div>
          <h3 className="font-bold mb-2 pb-1 border-b" 
              style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
            EXECUTIVE SUMMARY
          </h3>
          <p className="text-xs leading-relaxed text-gray-700">{profile.summary}</p>
        </div>

        <div>
          <h3 className="font-bold mb-2 pb-1 border-b" 
              style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
            LEADERSHIP EXPERIENCE
          </h3>
          <div className="space-y-3">
            {profile.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-xs" style={{ color: template.colorScheme.text }}>
                      {exp.position}
                    </h4>
                    <p className="text-xs font-semibold" style={{ color: template.colorScheme.accent }}>
                      {exp.company} | {exp.location}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full text-white" 
                        style={{ backgroundColor: template.colorScheme.primary }}>
                    {exp.period}
                  </span>
                </div>
                <ul className="text-xs text-gray-700 space-y-0.5">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40"></div>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-72 p-4 space-y-4" style={{ backgroundColor: template.colorScheme.surface }}>
        <div>
          <h3 className="font-bold mb-2" 
              style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
            CORE COMPETENCIES
          </h3>
          <div className="space-y-2">
            {profile.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-xs font-medium">{skill.name}</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-1 rounded-full ${
                        i < Math.floor(skill.level / 20) ? 'opacity-100' : 'opacity-30'
                      }`}
                      style={{ backgroundColor: template.colorScheme.accent }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2" 
              style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
            EDUCATION
          </h3>
          <div className="space-y-2">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="text-xs">
                <h4 className="font-bold" style={{ color: template.colorScheme.text }}>
                  {edu.degree}
                </h4>
                <p className="text-gray-600">{edu.school}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-500">{edu.year}</span>
                  {edu.details && (
                    <span className="px-2 py-1 rounded-full text-white text-xs" 
                          style={{ backgroundColor: template.colorScheme.accent }}>
                      {edu.details.split(',')[0]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2" 
              style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
            CONNECT
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2" style={{ color: template.colorScheme.accent }}>
              <Linkedin className="w-3 h-3" />
              <span className="text-gray-700">{profile.contact.linkedin}</span>
            </div>
            {profile.contact.website && (
              <div className="flex items-center gap-2" style={{ color: template.colorScheme.accent }}>
                <Globe className="w-3 h-3" />
                <span className="text-gray-700">{profile.contact.website}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Tech Innovator Preview
const TechInnovatorPreview = ({ profile, template }) => (
  <div className="w-full h-full bg-white shadow-lg overflow-hidden border" 
       style={{ fontFamily: template.typography.bodyFont, fontSize: template.typography.sizes.body, lineHeight: '1.4' }}>
    {/* Tech header */}
    <div className="h-3" style={{ background: template.colorScheme.gradient }}></div>
    
    <div className="p-4 space-y-4">
      {/* Header with avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg" style={{ backgroundColor: template.colorScheme.surface }}>
          <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold mb-1" 
              style={{ fontSize: template.typography.sizes.h1, color: template.colorScheme.primary }}>
            {profile.name}
          </h1>
          <h2 className="font-medium mb-2" 
              style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.secondary }}>
            {profile.title}
          </h2>
          <div className="flex items-center gap-4 text-xs text-gray-600">
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

      <div className="grid grid-cols-5 gap-4">
        {/* Main content */}
        <div className="col-span-3 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" 
                   style={{ backgroundColor: template.colorScheme.primary }}>
                <User className="w-3 h-3 text-white" />
              </div>
              <h3 className="font-bold" 
                  style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
                ABOUT ME
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-gray-700 ml-8">{profile.summary}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" 
                   style={{ backgroundColor: template.colorScheme.secondary }}>
                <Briefcase className="w-3 h-3 text-white" />
              </div>
              <h3 className="font-bold" 
                  style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
                EXPERIENCE
              </h3>
            </div>
            <div className="ml-8 space-y-3">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full" 
                       style={{ backgroundColor: template.colorScheme.accent }}></div>
                  <div className="pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-bold text-xs" style={{ color: template.colorScheme.text }}>
                          {exp.position}
                        </h4>
                        <p className="text-xs font-medium" style={{ color: template.colorScheme.secondary }}>
                          {exp.company} • {exp.location}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-md text-white" 
                            style={{ backgroundColor: template.colorScheme.primary }}>
                        {exp.period}
                      </span>
                    </div>
                    <ul className="text-xs text-gray-700 space-y-0.5 mt-1">
                      {exp.achievements.slice(0, 2).map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Code className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" style={{ color: template.colorScheme.accent }} />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-2 space-y-3">
          <div className="p-3 rounded-xl" style={{ backgroundColor: template.colorScheme.surface }}>
            <h3 className="font-bold mb-2 flex items-center gap-2" 
                style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
              <Zap className="w-4 h-4" />
              TECH STACK
            </h3>
            <div className="space-y-2">
              {profile.skills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <span style={{ color: template.colorScheme.primary }}>{skill.level}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all" 
                      style={{ 
                        background: template.colorScheme.gradient,
                        width: `${skill.level}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl" style={{ backgroundColor: template.colorScheme.surface }}>
            <h3 className="font-bold mb-2 flex items-center gap-2" 
                style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
              <GraduationCap className="w-4 h-4" />
              EDUCATION
            </h3>
            <div className="space-y-2">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="text-xs">
                  <h4 className="font-bold" style={{ color: template.colorScheme.text }}>
                    {edu.degree}
                  </h4>
                  <p className="text-gray-600">{edu.school}</p>
                  <p className="text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl" style={{ backgroundColor: template.colorScheme.surface }}>
            <h3 className="font-bold mb-2 flex items-center gap-2" 
                style={{ fontSize: template.typography.sizes.h2, color: template.colorScheme.primary }}>
              <ExternalLink className="w-4 h-4" />
              LINKS
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Linkedin className="w-3 h-3" style={{ color: template.colorScheme.accent }} />
                <span className="text-gray-700">{profile.contact.linkedin}</span>
              </div>
              {profile.contact.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3" style={{ color: template.colorScheme.accent }} />
                  <span className="text-gray-700">{profile.contact.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
// Enhanced Template Card with value indicators
const UltimateTemplateCard = memo(({ template, profile, onSelect, onPreview }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const renderPreview = () => {
    const props = { profile, template };
    
    switch (template.layoutType) {
      case 'ats-killer-single':
        return <ATSKillerPreview {...props} />;
      case 'executive-premium':
        return <ExecutivePlatinumPreview {...props} />;
      case 'tech-modern':
        return <TechInnovatorPreview {...props} />;
      default:
        return <ATSKillerPreview {...props} />;
    }
  };

  const getIndustryIcon = (category) => {
    switch (category) {
      case 'tech': return <Code className="w-4 h-4" />;
      case 'finance': return <DollarSign className="w-4 h-4" />;
      case 'healthcare': return <Stethoscope className="w-4 h-4" />;
      case 'creative': return <Palette className="w-4 h-4" />;
      case 'consulting': return <TrendingUp className="w-4 h-4" />;
      case 'marketing': return <Target className="w-4 h-4" />;
      case 'executive': return <Building className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className={`group relative bg-white border-2 rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer
        hover:shadow-2xl hover:-translate-y-3 hover:border-transparent
        ${isHovered ? 'transform -translate-y-3 shadow-2xl border-transparent' : 'border-gray-200 shadow-lg'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(template)}
    >
      {/* Template Preview */}
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="w-full h-full transform transition-all duration-500 group-hover:scale-110">
          {renderPreview()}
        </div>
        
        {/* Enhanced overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 backdrop-blur-sm flex items-center justify-center transition-all duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPreview(template);
              }}
              className="bg-white/95 backdrop-blur text-gray-900 px-6 py-3 rounded-2xl font-semibold flex items-center space-x-2 hover:bg-white transition-all transform hover:scale-105 shadow-xl"
            >
              <Eye className="w-4 h-4" />
              <span>Full Preview</span>
            </button>
            <button 
              onClick={() => onSelect(template)}
              className="px-6 py-3 rounded-2xl font-semibold flex items-center space-x-2 transition-all transform hover:scale-105 text-white shadow-xl"
              style={{ 
                background: template.colorScheme.gradient
              }}
            >
              <Download className="w-4 h-4" />
              <span>Use Template</span>
            </button>
          </div>
        </div>

        {/* Premium badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {template.isATSKiller && (
            <span className="bg-green-600 text-white text-xs px-3 py-2 rounded-full font-bold flex items-center space-x-1 shadow-lg">
              <Shield className="w-3 h-3" />
              <span>ATS KILLER</span>
            </span>
          )}
          {template.isPremium && (
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 text-xs px-3 py-2 rounded-full font-bold flex items-center space-x-1 shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              <span>PREMIUM</span>
            </span>
          )}
          {template.isPopular && !template.isPremium && !template.isATSKiller && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-2 rounded-full font-bold flex items-center space-x-1 shadow-lg">
              <Sparkles className="w-3 h-3" />
              <span>POPULAR</span>
            </span>
          )}
          {template.isNew && (
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-2 rounded-full font-bold shadow-lg">
              NEW
            </span>
          )}
        </div>

        {/* ATS & Appeal scores */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <div className="bg-black/70 backdrop-blur text-white px-2 py-1 rounded-lg text-xs font-medium">
            ATS: {template.atsScore}%
          </div>
          <div className="bg-black/70 backdrop-blur text-white px-2 py-1 rounded-lg text-xs font-medium">
            Visual: {template.humanAppeal}%
          </div>
        </div>

        {/* Industry indicator */}
        <div className="absolute top-4 right-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" 
               style={{ backgroundColor: template.colorScheme.primary }}>
            <span className="text-white">
              {getIndustryIcon(template.category)}
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced template info */}
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-xl text-gray-900" 
                  style={{ fontFamily: template.typography.headingFont }}>
                {template.name}
              </h3>
              {template.industry.slice(0, 1).map((ind, idx) => (
                <span key={idx} className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ 
                        backgroundColor: `${template.colorScheme.primary}15`,
                        color: template.colorScheme.primary 
                      }}>
                  {ind}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>

        {/* Value metrics */}
        <div className="flex items-center justify-between mb-4 p-3 rounded-xl" 
             style={{ backgroundColor: template.colorScheme.surface }}>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: template.colorScheme.primary }}>
                {template.atsScore}
              </div>
              <div className="text-xs text-gray-600">ATS Score</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-500" />
                <span className="font-bold">{(template.popularity / 10).toFixed(1)}</span>
              </div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="font-medium">{template.estimatedTime}</span>
              </div>
              <div className="text-xs text-gray-600">Setup Time</div>
            </div>
          </div>
          <span className={`px-3 py-2 rounded-xl font-semibold text-xs ${
            template.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {template.difficulty}
          </span>
        </div>

        {/* Key features */}
        <div className="flex flex-wrap gap-2">
          {template.features.slice(0, 4).map((feature, index) => (
            <span
              key={index}
              className="text-xs px-3 py-2 rounded-xl font-medium border transition-all hover:scale-105"
              style={{ 
                backgroundColor: `${template.colorScheme.primary}08`,
                color: template.colorScheme.primary,
                borderColor: `${template.colorScheme.primary}20`
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

// Preview Modal with Enhanced Features
const UltimatePreviewModal = ({ template, profile, isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const renderFullPreview = () => {
    const props = { profile, template };
    
    switch (template.layoutType) {
      case 'ats-killer-single':
        return <ATSKillerPreview {...props} />;
      case 'executive-premium':
        return <ExecutivePlatinumPreview {...props} />;
      case 'tech-modern':
        return <TechInnovatorPreview {...props} />;
      default:
        return <ATSKillerPreview {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Enhanced Modal Header */}
        <div className="flex items-center justify-between p-8 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900" 
                  style={{ fontFamily: template.typography.headingFont }}>
                {template.name}
              </h2>
              <div className="flex items-center gap-2">
                {template.isATSKiller && (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                    <Shield className="w-4 h-4" />
                    ATS Killer
                  </span>
                )}
                {template.isPremium && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                    <Star className="w-4 h-4 fill-current" />
                    Premium
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-lg">{template.description}</p>
            <div className="flex items-center gap-6 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: template.colorScheme.primary }}></div>
                <span>ATS Score: <strong>{template.atsScore}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: template.colorScheme.accent }}></div>
                <span>Visual Appeal: <strong>{template.humanAppeal}%</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{template.estimatedTime}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelect(template)}
              className="px-8 py-3 rounded-2xl font-semibold flex items-center gap-2 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              style={{ background: template.colorScheme.gradient }}
            >
              <Download className="w-5 h-5" />
              Use This Template
            </button>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-4xl mx-auto" style={{ aspectRatio: '8.5/11' }}>
            {renderFullPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Ultimate Gallery Component
const UltimateTemplateGallery = ({ onTemplateSelect, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState(ultimateProfiles[0]);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [sortBy, setSortBy] = useState('recommended'); // recommended, ats-score, popularity
  
  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = ultimateTemplates;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.industry.some(ind => ind.toLowerCase().includes(query)) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Smart sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ats-score':
          return b.atsScore - a.atsScore;
        case 'popularity':
          return b.popularity - a.popularity;
        case 'recommended':
        default:
          // ATS killers first, then by combined score
          if (a.isATSKiller && !b.isATSKiller) return -1;
          if (!a.isATSKiller && b.isATSKiller) return 1;
          const scoreA = (a.atsScore * 0.6) + (a.humanAppeal * 0.4);
          const scoreB = (b.atsScore * 0.6) + (b.humanAppeal * 0.4);
          return scoreB - scoreA;
      }
    });
  }, [searchQuery, selectedCategory, sortBy]);

  const categories = [
    { id: 'all', name: 'All Templates', count: ultimateTemplates.length, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'ats-killer', name: 'ATS Killer', count: ultimateTemplates.filter(t => t.category === 'ats-killer').length, icon: <Shield className="w-4 h-4" /> },
    { id: 'executive', name: 'Executive', count: ultimateTemplates.filter(t => t.category === 'executive').length, icon: <Building className="w-4 h-4" /> },
    { id: 'tech', name: 'Technology', count: ultimateTemplates.filter(t => t.category === 'tech').length, icon: <Code className="w-4 h-4" /> },
    { id: 'finance', name: 'Finance', count: ultimateTemplates.filter(t => t.category === 'finance').length, icon: <DollarSign className="w-4 h-4" /> },
    { id: 'healthcare', name: 'Healthcare', count: ultimateTemplates.filter(t => t.category === 'healthcare').length, icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'creative', name: 'Creative', count: ultimateTemplates.filter(t => t.category === 'creative').length, icon: <Palette className="w-4 h-4" /> },
    { id: 'marketing', name: 'Marketing', count: ultimateTemplates.filter(t => t.category === 'marketing').length, icon: <Target className="w-4 h-4" /> },
    { id: 'consulting', name: 'Consulting', count: ultimateTemplates.filter(t => t.category === 'consulting').length, icon: <TrendingUp className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Ultimate Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold bg-blue-50 px-6 py-3 rounded-2xl hover:bg-blue-100 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-3">World-Class CV Templates</h1>
              <p className="text-gray-600 text-xl">Industry-specific designs engineered to beat ATS systems and impress recruiters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
            <div className="xl:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates by name, industry, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur text-lg shadow-sm"
              />
            </div>
            <div className="xl:col-span-3">
              <select 
                value={selectedProfile.name}
                onChange={(e) => setSelectedProfile(ultimateProfiles.find(p => p.name === e.target.value) || ultimateProfiles[0])}
                className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur text-lg shadow-sm"
              >
                {ultimateProfiles.map(profile => (
                  <option key={profile.name} value={profile.name}>
                    Preview as: {profile.name} ({profile.industry})
                  </option>
                ))}
              </select>
            </div>
            <div className="xl:col-span-3">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur text-lg shadow-sm"
              >
                <option value="recommended">Recommended</option>
                <option value="ats-score">Best ATS Score</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-xl transform scale-105'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg border border-gray-200'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
                <span className={`text-xs px-3 py-1 rounded-full ${
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

      {/* Value Proposition Banner */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-3">The Ultimate CV Value Proposition</h2>
              <div className="grid grid-cols-3 gap-8 text-sm">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 bg-white/20 p-2 rounded-full" />
                  <div>
                    <div className="font-semibold">ATS-Beating Technology</div>
                    <div className="opacity-90">99% pass rate through tracking systems</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 bg-white/20 p-2 rounded-full" />
                  <div>
                    <div className="font-semibold">Industry-Specific Design</div>
                    <div className="opacity-90">Templates tailored for your field</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 bg-white/20 p-2 rounded-full" />
                  <div>
                    <div className="font-semibold">Professional Photos</div>
                    <div className="opacity-90">Perfect image integration & sizing</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-2">{filteredAndSortedTemplates.length}</div>
              <div className="text-lg opacity-90">Premium Templates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Enhanced Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredAndSortedTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all templates</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Show All Templates
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredAndSortedTemplates.map((template) => (
              <UltimateTemplateCard
                key={template.id}
                template={template}
                profile={selectedProfile}
                onSelect={onTemplateSelect}
                onPreview={setPreviewTemplate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Showing {filteredAndSortedTemplates.length} templates
              </h3>
              <p className="text-sm text-gray-600">
                {selectedCategory !== 'all' ? `Filtered by ${categories.find(c => c.id === selectedCategory)?.name}` : 'All categories'} • 
                Sorted by {sortBy.replace('-', ' ')}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{ultimateTemplates.filter(t => t.atsScore >= 90).length} ATS Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>{ultimateTemplates.filter(t => t.isPremium).length} Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>{ultimateTemplates.filter(t => t.isNew).length} New</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <UltimatePreviewModal
          template={previewTemplate}
          profile={selectedProfile}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={onTemplateSelect}
        />
      )}
    </div>
  );
};

export default UltimateTemplateGallery;
