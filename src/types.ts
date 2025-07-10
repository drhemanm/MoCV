export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  markdownUrl: string;
  previewImage?: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: Date;
  updatedAt: Date;
}

export interface CVAnalysis {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  readabilityScore: 'Good' | 'Moderate' | 'Needs Improvement';
  suggestions: string[];
  sections: string[];
}

export interface GameData {
  totalXP: number;
  currentLevel: number;
  uploadsCount: number;
  achievements: string[];
  consecutiveDays: number;
  lastUploadDate: string;
  highestScore: number;
}

export interface Badge {
  level: string;
  icon: string;
  color: string;
  message: string;
  nextLevel?: string;
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
  cvData: any; // The actual CV data
  previewUrl?: string;
  targetMarket?: string;
}

export interface TargetMarket {
  id: string;
  name: string;
  flag: string;
  region: string;
  cvTips: string[];
  atsPreferences: string[];
  culturalNotes: string[];
  commonFormats: string[];
  keywordFocus: string[];
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
  cvData: any; // The actual CV data
  previewUrl?: string;
  targetMarket?: string;
}

export interface GameData {
  totalXP: number;
  currentLevel: number;
  uploadsCount: number;
  achievements: string[];
  consecutiveDays: number;
  lastUploadDate: string;
  highestScore: number;
}

export interface Badge {
  level: string;
  icon: string;
  color: string;
  message: string;
  nextLevel?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'situational' | 'company-specific';
  difficulty: 'easy' | 'medium' | 'hard';
}