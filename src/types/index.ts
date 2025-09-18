// src/types/index.ts - Corrected for CV Builder compatibility

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

// Personal Info - Enhanced for CV Builder
export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  github: string;        // Added for CV Builder
  portfolio: string;     // Added for CV Builder
  photo: string;         // Added for CV Builder
}

// Experience - Enhanced for CV Builder
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
  skills: string[];      // Added for CV Builder
  companyUrl?: string;   // Added for CV Builder
  salary?: string;       // Added for CV Builder
}

// Education - Enhanced for CV Builder
export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  honors?: string[];
  courses?: string[];    // Added for CV Builder
  thesis?: string;       // Added for CV Builder
}

// Skill - Enhanced for CV Builder
export interface Skill {
  id: string;
  name: string;
  level: number;
  category: 'Technical' | 'Soft Skills' | 'Languages' | 'Tools' | 'Frameworks';
  endorsed?: boolean;         // Added for CV Builder
  yearsOfExperience?: number; // Added for CV Builder
}

// Project - Enhanced for CV Builder
export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
  status: 'Completed' | 'In Progress' | 'Planned';  // Added for CV Builder
  teamSize?: number;      // Added for CV Builder
  role?: string;          // Added for CV Builder
}

// Certification - Enhanced for CV Builder
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;  // Added for CV Builder
  skills?: string[];         // Added for CV Builder
}

// Reference - New for CV Builder
export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
  permissionGranted: boolean;
}

// Additional Section - New for CV Builder
export interface AdditionalSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'achievements' | 'awards';
  icon?: string;
}

// CV Data Structure - CORRECTED naming for CV Builder compatibility
export interface CVData {
  id?: string;                    // Added for CV Builder
  personalInfo: PersonalInfo;
  summary: string;                // CHANGED from 'professionalSummary' to 'summary'
  experience: Experience[];       // CHANGED from 'experiences' to 'experience'
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  references: Reference[];        // Added for CV Builder
  additionalSections: AdditionalSection[];  // Added for CV Builder
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
