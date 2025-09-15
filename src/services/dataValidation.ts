// src/services/dataValidation.ts
import { z } from 'zod';

// Personal Info Schema
export const PersonalInfoSchema = z.object({
  fullName: z.string()
    .min(1, 'Full name is required')
    .max(100, 'Full name is too long'),
  title: z.string()
    .min(1, 'Professional title is required')
    .max(150, 'Title is too long'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  location: z.string()
    .max(100, 'Location is too long')
    .optional(),
  linkedin: z.string()
    .url('Please enter a valid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  website: z.string()
    .url('Please enter a valid website URL')
    .optional()
    .or(z.literal('')),
  photo: z.string().optional()
});

// Experience Schema
export const ExperienceSchema = z.object({
  id: z.string(),
  title: z.string()
    .min(1, 'Job title is required')
    .max(100, 'Job title is too long'),
  company: z.string()
    .min(1, 'Company name is required')
    .max(100, 'Company name is too long'),
  location: z.string()
    .max(100, 'Location is too long')
    .optional(),
  startDate: z.string()
    .min(1, 'Start date is required')
    .regex(/^\d{4}-\d{2}$/, 'Start date must be in YYYY-MM format'),
  endDate: z.string()
    .regex(/^\d{4}-\d{2}$/, 'End date must be in YYYY-MM format')
    .optional()
    .or(z.literal('')),
  current: z.boolean(),
  description: z.string()
    .min(10, 'Description should be at least 10 characters')
    .max(2000, 'Description is too long')
}).refine((data) => {
  if (!data.current && !data.endDate) {
    return false;
  }
  if (data.current && data.endDate) {
    return false;
  }
  if (data.endDate && data.startDate && data.endDate < data.startDate) {
    return false;
  }
  return true;
}, {
  message: "Please provide a valid date range",
  path: ["endDate"]
});

// Education Schema
export const EducationSchema = z.object({
  id: z.string(),
  degree: z.string()
    .min(1, 'Degree is required')
    .max(150, 'Degree is too long'),
  school: z.string()
    .min(1, 'School/University is required')
    .max(150, 'School name is too long'),
  location: z.string()
    .max(100, 'Location is too long')
    .optional(),
  graduationDate: z.string()
    .regex(/^\d{4}-\d{2}$/, 'Graduation date must be in YYYY-MM format')
    .optional()
    .or(z.literal('')),
  gpa: z.string()
    .regex(/^([0-4]\.?\d?|[0-4])\/[0-4]$|^([0-9]|[0-9]\.[0-9])\/10$|^[0-4]\.[0-9]+$/, 'Invalid GPA format')
    .optional()
    .or(z.literal(''))
});

// Skills Schema
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(1, 'Skill name is required')
    .max(50, 'Skill name is too long'),
  level: z.number()
    .min(1, 'Skill level must be between 1-5')
    .max(5, 'Skill level must be between 1-5'),
  category: z.enum(['Technical', 'Soft Skills', 'Languages', 'Tools'], {
    errorMap: () => ({ message: 'Please select a valid category' })
  })
});

// Projects Schema
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name is too long'),
  description: z.string()
    .min(10, 'Project description should be at least 10 characters')
    .max(1000, 'Project description is too long'),
  technologies: z.array(z.string())
    .min(1, 'Please add at least one technology')
    .max(20, 'Too many technologies listed'),
  link: z.string()
    .url('Please enter a valid project URL')
    .optional()
    .or(z.literal(''))
});

// Certifications Schema
export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(1, 'Certification name is required')
    .max(150, 'Certification name is too long'),
  issuer: z.string()
    .min(1, 'Issuer is required')
    .max(100, 'Issuer name is too long'),
  date: z.string()
    .regex(/^\d{4}-\d{2}$/, 'Date must be in YYYY-MM format')
    .min(1, 'Certification date is required')
});

// Complete CV Data Schema
export const CVDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  summary: z.string()
    .min(50, 'Summary should be at least 50 characters')
    .max(1000, 'Summary is too long'),
  experience: z.array(ExperienceSchema)
    .min(1, 'Please add at least one work experience'),
  education: z.array(EducationSchema)
    .min(1, 'Please add at least one education entry'),
  skills: z.array(SkillSchema)
    .min(3, 'Please add at least 3 skills')
    .max(50, 'Too many skills listed'),
  projects: z.array(ProjectSchema)
    .max(10, 'Too many projects listed'),
  certifications: z.array(CertificationSchema)
    .max(20, 'Too many certifications listed')
});

// Validation helper function
export const validateSection = (sectionName: string, data: any) => {
  try {
    switch (sectionName) {
      case 'personalInfo':
        PersonalInfoSchema.parse(data);
        break;
      case 'summary':
        z.string().min(50).max(1000).parse(data);
        break;
      case 'experience':
        z.array(ExperienceSchema).parse(data);
        break;
      case 'education':
        z.array(EducationSchema).parse(data);
        break;
      case 'skills':
        z.array(SkillSchema).parse(data);
        break;
      case 'projects':
        z.array(ProjectSchema).parse(data);
        break;
      case 'certifications':
        z.array(CertificationSchema).parse(data);
        break;
      default:
        throw new Error('Unknown section');
    }
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      };
    }
    return { isValid: false, errors: [{ field: 'unknown', message: 'Validation error' }] };
  }
};

// src/hooks/usePerformanceMonitor.ts
import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  renderCount: number;
  memoryUsage?: number;
  timestamp: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef(performance.now());
  const renderCount = useRef(0);
  const lastLogTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;

    // Only log every 10 renders or if render time is > 100ms
    const shouldLog = renderCount.current % 10 === 0 || renderTime > 100;

    if (shouldLog && Date.now() - lastLogTime.current > 5000) {
      const metrics: PerformanceMetrics = {
        componentName,
        renderTime,
        renderCount: renderCount.current,
        memoryUsage: (performance as any).memory?.usedJSHeapSize,
        timestamp: Date.now()
      };

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 Performance [${componentName}]:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          renderCount: renderCount.current,
          memoryMB: metrics.memoryUsage ? `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB` : 'N/A'
        });
      }

      // Store for analytics
      try {
        const perfData = JSON.parse(localStorage.getItem('mocv_performance') || '{}');
        if (!perfData[componentName]) {
          perfData[componentName] = [];
        }
        perfData[componentName].push(metrics);
        
        // Keep only last 20 entries per component
        perfData[componentName] = perfData[componentName].slice(-20);
        localStorage.setItem('mocv_performance', JSON.stringify(perfData));
      } catch (error) {
        console.warn('Failed to store performance metrics:', error);
      }

      lastLogTime.current = Date.now();
    }

    // Reset start time for next render
    startTime.current = performance.now();
  });

  const recordCustomMetric = useCallback((metricName: string, value: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Custom Metric [${componentName}] ${metricName}:`, `${value.toFixed(2)}ms`);
    }
  }, [componentName]);

  return {
    renderCount: renderCount.current,
    recordCustomMetric
  };
};

// src/services/enhancedDataManager.ts
import { CVDataSchema, validateSection } from './dataValidation';

export interface SaveResult {
  success: boolean;
  errors?: Array<{ field: string; message: string }>;
  warnings?: string[];
}

export class EnhancedDataManager {
  private static instance: EnhancedDataManager;
  private readonly STORAGE_VERSION = '2.0';
  private readonly CV_STORAGE_KEY = 'mocv_saved_cvs';
  private readonly BACKUP_KEY = 'mocv_backup_cvs';
  private readonly MAX_CVS = 50;
  private readonly MAX_BACKUPS = 10;

  static getInstance(): EnhancedDataManager {
    if (!EnhancedDataManager.instance) {
      EnhancedDataManager.instance = new EnhancedDataManager();
    }
    return EnhancedDataManager.instance;
  }

  constructor() {
    this.migrateDataIfNeeded();
  }

  // Enhanced save with comprehensive validation
  saveCVWithValidation(cvData: any, metadata: any): SaveResult {
    try {
      // Validate the entire CV data
      const validation = this.validateCVData(cvData);
      
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Create backup before saving
      this.createBackup();

      const existingCVs = this.getAllCVs();
      const cvWithMetadata = {
        ...metadata,
        cvData,
        version: this.STORAGE_VERSION,
        lastModified: new Date().toISOString(),
        checksum: this.generateChecksum(cvData)
      };

      // Check for existing CV with same ID
      const existingIndex = existingCVs.findIndex(cv => cv.id === metadata.id);
      let updatedCVs;

      if (existingIndex !== -1) {
        // Update existing CV
        updatedCVs = [...existingCVs];
        updatedCVs[existingIndex] = cvWithMetadata;
      } else {
        // Add new CV
        updatedCVs = [cvWithMetadata, ...existingCVs.slice(0, this.MAX_CVS - 1)];
      }

      localStorage.setItem(this.CV_STORAGE_KEY, JSON.stringify(updatedCVs));

      return {
        success: true,
        warnings: this.generateWarnings(cvData)
      };

    } catch (error) {
      console.error('Enhanced save error:', error);
      return {
        success: false,
        errors: [{ field: 'system', message: 'Failed to save CV. Please try again.' }]
      };
    }
  }

  // Validate entire CV data
  private validateCVData(cvData: any): { isValid: boolean; errors: Array<{ field: string; message: string }> } {
    try {
      CVDataSchema.parse(cvData);
      return { isValid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        };
      }
      return {
        isValid: false,
        errors: [{ field: 'unknown', message: 'Unknown validation error' }]
      };
    }
  }

  // Generate content warnings (not errors, but suggestions)
  private generateWarnings(cvData: any): string[] {
    const warnings: string[] = [];

    // Check summary length
    if (cvData.summary && cvData.summary.length < 100) {
      warnings.push('Consider expanding your professional summary to 2-3 sentences');
    }

    // Check experience descriptions
    cvData.experience?.forEach((exp: any, index: number) => {
      if (exp.description && exp.description.length < 100) {
        warnings.push(`Experience #${index + 1}: Consider adding more details about your achievements`);
      }
      if (!exp.description.includes('•') && !exp.description.includes('-')) {
        warnings.push(`Experience #${index + 1}: Consider using bullet points for better readability`);
      }
    });

    // Check skills count
    if (cvData.skills && cvData.skills.length < 5) {
      warnings.push('Consider adding more skills to strengthen your profile');
    }

    // Check for missing sections
    if (!cvData.projects || cvData.projects.length === 0) {
      warnings.push('Adding projects can help showcase your practical experience');
    }

    return warnings;
  }

  // Create backup before major operations
  private createBackup(): void {
    try {
      const currentCVs = this.getAllCVs();
      if (currentCVs.length === 0) return;

      const backups = JSON.parse(localStorage.getItem(this.BACKUP_KEY) || '[]');
      const newBackup = {
        timestamp: new Date().toISOString(),
        data: currentCVs,
        version: this.STORAGE_VERSION
      };

      const updatedBackups = [newBackup, ...backups.slice(0, this.MAX_BACKUPS - 1)];
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(updatedBackups));
    } catch (error) {
      console.warn('Failed to create backup:', error);
    }
  }

  // Generate checksum for data integrity
  private generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // Get all CVs with error recovery
  getAllCVs(): any[] {
    try {
      const stored = localStorage.getItem(this.CV_STORAGE_KEY);
      if (!stored) return [];
      
      const cvs = JSON.parse(stored);
      return Array.isArray(cvs) ? cvs : [];
    } catch (error) {
      console.error('Error loading CVs, attempting recovery:', error);
      return this.recoverFromBackup();
    }
  }

  // Recover data from backup
  private recoverFromBackup(): any[] {
    try {
      const backups = JSON.parse(localStorage.getItem(this.BACKUP_KEY) || '[]');
      if (backups.length > 0) {
        console.log('Recovering from backup...');
        const latestBackup = backups[0];
        localStorage.setItem(this.CV_STORAGE_KEY, JSON.stringify(latestBackup.data));
        return latestBackup.data;
      }
    } catch (error) {
      console.error('Backup recovery failed:', error);
    }
    return [];
  }

  // Data migration
  private migrateDataIfNeeded(): void {
    const currentVersion = localStorage.getItem('mocv_data_version');
    
    if (currentVersion !== this.STORAGE_VERSION) {
      console.log('Migrating data from version', currentVersion, 'to', this.STORAGE_VERSION);
      
      // Perform any necessary migrations here
      if (currentVersion === '1.0') {
        this.migrateFromV1ToV2();
      }
      
      localStorage.setItem('mocv_data_version', this.STORAGE_VERSION);
    }
  }

  private migrateFromV1ToV2(): void {
    // Example migration logic
    const cvs = this.getAllCVs();
    const migratedCVs = cvs.map(cv => ({
      ...cv,
      version: this.STORAGE_VERSION,
      checksum: this.generateChecksum(cv.cvData)
    }));
    localStorage.setItem(this.CV_STORAGE_KEY, JSON.stringify(migratedCVs));
  }

  // Enhanced export with metadata
  exportUserData(): string {
    const data = {
      cvs: this.getAllCVs(),
      backups: JSON.parse(localStorage.getItem(this.BACKUP_KEY) || '[]'),
      preferences: JSON.parse(localStorage.getItem('mocv_user_preferences') || '{}'),
      performance: JSON.parse(localStorage.getItem('mocv_performance') || '{}'),
      exportDate: new Date().toISOString(),
      version: this.STORAGE_VERSION,
      exportId: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    return JSON.stringify(data, null, 2);
  }

  // Validate section in real-time
  validateSectionData(sectionName: string, data: any) {
    return validateSection(sectionName, data);
  }
}

// src/hooks/useEnhancedAutoSave.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { EnhancedDataManager } from '../services/enhancedDataManager';

export const useEnhancedAutoSave = (
  data: any, 
  metadata: any, 
  options = {
    delay: 5000,
    validateBeforeSave: true,
    showSaveStatus: true
  }
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const dataManager = EnhancedDataManager.getInstance();
  const lastSaveRef = useRef<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  const saveData = useCallback(async () => {
    const dataString = JSON.stringify(data);
    
    // Only save if data has actually changed
    if (dataString === lastSaveRef.current) return;
    
    if (options.showSaveStatus) {
      setSaveStatus('saving');
    }

    try {
      const result = dataManager.saveCVWithValidation(data, metadata);
      
      if (result.success) {
        lastSaveRef.current = dataString;
        setLastSaveTime(new Date());
        
        if (options.showSaveStatus) {
          setSaveStatus('saved');
          // Reset to idle after 3 seconds
          setTimeout(() => setSaveStatus('idle'), 3000);
        }
        
        console.log('✅ Auto-saved CV successfully');
        
        if (result.warnings && result.warnings.length > 0) {
          console.log('⚠️ Save warnings:', result.warnings);
        }
      } else {
        console.error('❌ Auto-save failed:', result.errors);
        if (options.showSaveStatus) {
          setSaveStatus('error');
        }
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      if (options.showSaveStatus) {
        setSaveStatus('error');
      }
    }
  }, [data, metadata, dataManager, options.showSaveStatus]);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(saveData, options.delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveData, options.delay]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await saveData();
  }, [saveData]);

  return { 
    saveNow, 
    saveStatus, 
    lastSaveTime,
    isAutoSaveEnabled: true 
  };
};
