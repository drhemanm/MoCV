// src/types/index.ts - Simplified without target market complexity

// Core CV Template (no market dependencies)
export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'creative' | 'classic' | 'minimal';
  previewUrl: string;
  markdownUrl: string;
  thumbnail: string;
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  popularity: number;
  tags: string[];
}

// Optional target market (if needed for analysis features only)
export interface TargetMarket {
  id: string;
  name: string;
  description: string;
}

// CV Data Structure (clean, no market assumptions)
export interface CVData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
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
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  honors?: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

// CV Analysis (simplified)
export interface CVAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  sections: {
    [key: string]: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
  };
  atsCompatibility: number;
  keywordMatches: string[];
  missingKeywords: string[];
}

// Minimal game data (if keeping gamification)
export interface GameData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: {
    cvsCreated: number;
    downloadsTotal: number;
  };
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  unlockedAt?: Date;
  reward: {
    xp: number;
    badge?: string;
  };
}

// App State (clean)
export interface AppState {
  currentView: AppView;
  selectedTemplate: CVTemplate | null;
  cvData: CVData | null;
  gameData: GameData;
}

export enum AppView {
  HOME = 'home',
  TEMPLATES = 'templates',
  CV_BUILDER = 'builder',
  CV_PREVIEW = 'preview',
  CV_IMPROVER = 'improver',
  JOB_ANALYZER = 'job-analyzer',
  INTERVIEW_PREP = 'interview',
  MY_CVS = 'my-cvs'
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
