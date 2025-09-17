// src/components/CVBuilder/PreviewEngine/types.ts

export type ViewMode = 'desktop' | 'tablet' | 'mobile' | 'print';

export interface PreviewSettings {
  viewMode: ViewMode;
  scale: number;
  showGrid: boolean;
  showMargins: boolean;
  showSafeArea: boolean;
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
    photo?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: number;
    category: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
}

export interface SectionVisibility {
  header: boolean;
  summary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  projects: boolean;
  certifications: boolean;
}

export interface LayoutSettings {
  columns: 1 | 2 | 3;
  sectionOrder: string[];
  sectionSpacing: 'compact' | 'normal' | 'relaxed';
  pageMargins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface PreviewContextType {
  cvData: CVData;
  previewSettings: PreviewSettings;
  sectionVisibility: SectionVisibility;
  layoutSettings: LayoutSettings;
  updateCVData: (data: Partial<CVData>) => void;
  updatePreviewSettings: (settings: Partial<PreviewSettings>) => void;
  updateSectionVisibility: (visibility: Partial<SectionVisibility>) => void;
  updateLayoutSettings: (layout: Partial<LayoutSettings>) => void;
  exportHTML: () => string;
  resetToDefaults: () => void;
}

export interface SectionRendererProps {
  data: any;
  isVisible: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface ViewportDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

// Predefined viewport dimensions
export const VIEWPORT_DIMENSIONS: Record<ViewMode, ViewportDimensions> = {
  desktop: {
    width: 1200,
    height: 1600,
    aspectRatio: 0.75, // A4 ratio
  },
  tablet: {
    width: 768,
    height: 1024,
    aspectRatio: 0.75,
  },
  mobile: {
    width: 375,
    height: 667,
    aspectRatio: 0.56,
  },
  print: {
    width: 794, // A4 width in pixels at 96 DPI
    height: 1123, // A4 height in pixels at 96 DPI
    aspectRatio: 0.707,
  },
};

// Default CV data for new CVs
export const DEFAULT_CV_DATA: CVData = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    photo: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

// Default preview settings
export const DEFAULT_PREVIEW_SETTINGS: PreviewSettings = {
  viewMode: 'desktop',
  scale: 1,
  showGrid: false,
  showMargins: false,
  showSafeArea: false,
};

// Default section visibility
export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  header: true,
  summary: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  certifications: true,
};

// Default layout settings
export const DEFAULT_LAYOUT_SETTINGS: LayoutSettings = {
  columns: 1,
  sectionOrder: ['header', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
  sectionSpacing: 'normal',
  pageMargins: {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40,
  },
};
