// src/types/index.ts

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  previewUrl: string;
  markdownUrl: string;
  thumbnail: string;
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  popularity: number;
  tags: string[];
}

export interface TargetMarket {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  industries: string[];
  skillFocus: string[];
  salaryRange: string;
  popularRoles: string[];
}

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

export interface GameData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
  achievements: Achievement[];
  streaks: {
    daily: number;
    weekly: number;
  };
  stats: {
    cvsCreated: number;
    templatesUsed: number;
    analysisCompleted: number;
    interviewsPrepped: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
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
  technologies?: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  honors?: string[];
  relevantCourses?: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5 scale
  category: string;
  endorsed?: boolean;
  years?: number;
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
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages?: Language[];
  volunteer?: VolunteerExperience[];
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface VolunteerExperience {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface JobDescription {
  title: string;
  company: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experience: string;
  education: string;
  location: string;
  salary?: string;
}

export interface JobMatchAnalysis {
  overallMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  recommendations: string[];
  missingSkills: string[];
  strongPoints: string[];
}

// Application State Types
export type AppStep = 
  | 'start' 
  | 'my-cvs' 
  | 'market-selector' 
  | 'analyzer' 
  | 'improver' 
  | 'job-analyzer' 
  | 'interview-prep' 
  | 'templates' 
  | 'preview' 
  | 'fill-method' 
  | 'ai-assistant' 
  | 'form' 
  | 'final' 
  | 'cv-builder';

export type FlowType = 'analyze' | 'create' | 'job-match' | 'interview' | null;

export type FillMethod = 'manual' | 'ai' | null;

// Notification Types
export interface NotificationData {
  xpGain: number;
  reason: string;
  levelUp?: boolean;
  newLevel?: number;
  achievements?: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Service Types
export interface TemplateService {
  fetchTemplates(): Promise<CVTemplate[]>;
  getTemplate(id: string): Promise<CVTemplate>;
  downloadTemplate(id: string): Promise<Blob>;
}

export interface AIService {
  generateContent(prompt: string, context?: any): Promise<string>;
  analyzeCV(cvText: string, targetMarket?: TargetMarket): Promise<CVAnalysis>;
  improveSection(section: string, feedback: string): Promise<string>;
  generateJobMatch(cv: CVData, job: JobDescription): Promise<JobMatchAnalysis>;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface NavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
}

export interface FormStepProps extends NavigationProps {
  data: Partial<CVData>;
  onChange: (data: Partial<CVData>) => void;
  errors?: Record<string, string>;
}

// Storage Types
export interface StoredCV {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  targetMarket: TargetMarket;
  cvData: CVData;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
  userId?: string;
}

export default {};
