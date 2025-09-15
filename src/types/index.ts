// src/types/index.ts

export interface CVTemplate {
  id: string;
  name: string;
  category: 'Professional' | 'Creative' | 'Academic' | 'Technical' | 'Executive';
  description: string;
  preview: string;
  isPremium: boolean;
  price?: number;
  features: string[];
  marketSuitability: string[];
  atsOptimized: boolean;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layout: 'single-column' | 'two-column' | 'modern-grid' | 'timeline';
  sections: string[];
}

export interface TargetMarket {
  id: string;
  name: string;
  region: string;
  preferences: {
    photoRequired: boolean;
    preferredLength: number; // in pages
    commonSections: string[];
    culturalNotes: string[];
    atsImportance: number; // 1-10 scale
  };
  templates: string[]; // template IDs that work well for this market
  description: string;
  flag?: string; // country flag emoji or icon
}

export interface CVData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    photo: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5 scale
  category: 'Technical' | 'Soft Skills' | 'Languages' | 'Tools';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface SavedCV {
  id: string;
  title: string;
  templateName: string;
  templateId: string;
  dateCreated: Date;
  dateModified: Date;
  atsScore: number;
  status: 'draft' | 'completed' | 'published';
  cvData: CVData;
  targetMarket?: string;
}

export interface AIAnalysis {
  score: number;
  suggestions: AISuggestion[];
  strengths: string[];
  improvements: string[];
  keywords: string[];
  readabilityScore: number;
  lengthAnalysis: {
    currentLength: number;
    recommendedLength: number;
    status: 'too_short' | 'optimal' | 'too_long';
  };
}

export interface AISuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'tip';
  section: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  example?: string;
}

export interface GamificationData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  badges: Badge[];
  achievements: Achievement[];
  streak: number;
  totalCVsCreated: number;
  totalDownloads: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  dateEarned: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: {
    xp: number;
    badge?: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: 'free' | 'premium' | 'enterprise';
  preferences: {
    language: string;
    defaultMarket: string;
    emailNotifications: boolean;
    autoSave: boolean;
  };
  gamification: GamificationData;
  createdAt: Date;
  lastLogin: Date;
}

// Enums for better type safety
export enum CVSection {
  PERSONAL_INFO = 'personal',
  SUMMARY = 'summary',
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  SKILLS = 'skills',
  PROJECTS = 'projects',
  CERTIFICATIONS = 'certifications'
}

export enum AIEnhancementType {
  GRAMMAR_CHECK = 'grammar',
  TONE_IMPROVEMENT = 'tone',
  KEYWORD_OPTIMIZATION = 'keywords',
  LENGTH_OPTIMIZATION = 'length',
  ATS_OPTIMIZATION = 'ats'
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PDFGenerationOptions {
  templateId: string;
  format: 'A4' | 'Letter';
  quality: 'standard' | 'high';
  includePhoto: boolean;
  colorMode: 'color' | 'grayscale';
}

// Navigation and UI types
export interface NavigationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  optional: boolean;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}
