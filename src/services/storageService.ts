// src/services/storageService.ts
import { CVData, StoredCV, TargetMarket, CVTemplate } from '../types';

class StorageService {
  private readonly CV_STORAGE_KEY = 'mocv_stored_cvs';
  private readonly USER_PREFERENCES_KEY = 'mocv_user_preferences';
  private readonly DRAFT_KEY = 'mocv_current_draft';
  
  // CV Management
  saveCV(cv: Omit<StoredCV, 'id' | 'createdAt' | 'updatedAt' | 'version'>): StoredCV {
    try {
      const existingCVs = this.getAllCVs();
      const now = new Date();
      
      // Generate unique ID
      const id = this.generateId();
      
      const newCV: StoredCV = {
        ...cv,
        id,
        createdAt: now,
        updatedAt: now,
        version: 1
      };
      
      const updatedCVs = [...existingCVs, newCV];
      localStorage.setItem(this.CV_STORAGE_KEY, JSON.stringify(updatedCVs));
      
      return newCV;
    } catch (error) {
      console.error('Error saving CV:', error);
      throw new Error('Failed to save CV');
    }
  }

  updateCV(id: string, updates: Partial<Omit<StoredCV, 'id' | 'createdAt'>>): StoredCV {
    try {
      const existingCVs = this.getAllCVs();
      const cvIndex = existingCVs.findIndex(cv => cv.id === id);
      
      if (cvIndex === -1) {
        throw new Error(`CV with id ${id} not found`);
      }
      
      const existingCV = existingCVs[cvIndex];
      const updatedCV: StoredCV = {
        ...existingCV,
        ...updates,
        id: existingCV.id, // Ensure ID doesn't change
        createdAt: existingCV.createdAt, // Preserve creation date
        updatedAt: new Date(),
        version: existingCV.version + 1
      };
      
      existingCVs[cvIndex] = updatedCV;
      localStorage.setItem(this.CV_STORAGE_KEY, JSON.stringify(existingCVs));
      
      return updatedCV;
    } catch (error) {
      console.error('Error updating CV:', error);
      throw new Error('Failed to update CV');
    }
  }

  deleteCV(id: string): boolean {
    try {
      const existingCVs = this.getAllCVs();
      const filteredCVs = existingCVs.filter(cv => cv.id !== id);
      
      if (filteredCVs.length === existingCVs.length) {
        return false; // CV not found
      }
      
      localStorage.setItem(this.CV_STORAGE_KEY, JSON.stringify(filteredCVs));
      return true;
    } catch (error) {
      console.error('Error deleting CV:', error);
      throw new Error('Failed to delete CV');
    }
  }

  getCV(id: string): StoredCV | null {
    try {
      const cvs = this.getAllCVs();
      return cvs.find(cv => cv.id === id) || null;
    } catch (error) {
      console.error('Error getting CV:', error);
      return null;
    }
  }

  getAllCVs(): StoredCV[] {
    try {
      const stored = localStorage.getItem(this.CV_STORAGE_KEY);
      if (!stored) return [];
      
      const cvs = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      return cvs.map((cv: any) => ({
        ...cv,
        createdAt: new Date(cv.createdAt),
        updatedAt: new Date(cv.updatedAt)
      }));
    } catch (error) {
      console.error('Error getting all CVs:', error);
      return [];
    }
  }

  // Search and filter CVs
  searchCVs(query: string): StoredCV[] {
    const allCVs = this.getAllCVs();
    const lowercaseQuery = query.toLowerCase();
    
    return allCVs.filter(cv => 
      cv.name.toLowerCase().includes(lowercaseQuery) ||
      cv.templateName.toLowerCase().includes(lowercaseQuery) ||
      cv.cvData.personalInfo.fullName.toLowerCase().includes(lowercaseQuery) ||
      cv.cvData.personalInfo.title.toLowerCase().includes(lowercaseQuery) ||
      cv.targetMarket.name.toLowerCase().includes(lowercaseQuery)
    );
  }

  getCVsByTemplate(templateId: string): StoredCV[] {
    const allCVs = this.getAllCVs();
    return allCVs.filter(cv => cv.templateId === templateId);
  }

  getCVsByMarket(marketId: string): StoredCV[] {
    const allCVs = this.getAllCVs();
    return allCVs.filter(cv => cv.targetMarket.id === marketId);
  }

  getRecentCVs(limit: number = 5): StoredCV[] {
    const allCVs = this.getAllCVs();
    return allCVs
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }

  // Draft Management
  saveDraft(cvData: Partial<CVData>, templateId?: string, targetMarket?: TargetMarket): void {
    try {
      const draft = {
        cvData,
        templateId,
        targetMarket,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }

  getDraft(): { cvData: Partial<CVData>; templateId?: string; targetMarket?: TargetMarket; savedAt: string } | null {
    try {
      const stored = localStorage.getItem(this.DRAFT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting draft:', error);
      return null;
    }
  }

  clearDraft(): void {
    localStorage.removeItem(this.DRAFT_KEY);
  }

  hasDraft(): boolean {
    return this.getDraft() !== null;
  }

  // User Preferences
  saveUserPreferences(preferences: any): void {
    try {
      localStorage.setItem(this.USER_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  getUserPreferences(): any {
    try {
      const stored = localStorage.getItem(this.USER_PREFERENCES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {};
    }
  }

  // Analytics and Statistics
  getCVStatistics(): {
    totalCVs: number;
    cvsByTemplate: Record<string, number>;
    cvsByMarket: Record<string, number>;
    recentActivity: { date: string; count: number }[];
  } {
    const allCVs = this.getAllCVs();
    
    // CVs by template
    const cvsByTemplate = allCVs.reduce((acc, cv) => {
      acc[cv.templateName] = (acc[cv.templateName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // CVs by market
    const cvsByMarket = allCVs.reduce((acc, cv) => {
      acc[cv.targetMarket.name] = (acc[cv.targetMarket.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Recent activity (last 7 days)
    const recentActivity = this.getRecentActivity(allCVs, 7);
    
    return {
      totalCVs: allCVs.length,
      cvsByTemplate,
      cvsByMarket,
      recentActivity
    };
  }

  private getRecentActivity(cvs: StoredCV[], days: number): { date: string; count: number }[] {
    const now = new Date();
    const activity: { date: string; count: number }[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const count = cvs.filter(cv => {
        const cvDate = cv.updatedAt.toISOString().split('T')[0];
        return cvDate === dateString;
      }).length;
      
      activity.push({ date: dateString, count });
    }
    
    return activity.reverse();
  }

  // Export/Import functionality
  exportAllData(): string {
    try {
      const data = {
        cvs: this.getAllCVs(),
        preferences: this.getUserPreferences(),
        draft: this.getDraft(),
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  importData(jsonData: string): { success: boolean; imported: { cvs: number; preferences: boolean }; errors: string[] } {
    const result = {
      success: false,
      imported: { cvs: 0, preferences: false },
      errors: [] as string[]
    };
    
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.version) {
        result.errors.push('Invalid export format - missing version');
        return result;
      }
      
      // Import CVs
      if (data.cvs && Array.isArray(data.cvs)) {
        const existingCVs = this.getAllCVs();
        const importedCVs = data.cvs.map((cv: any) => ({
          ...cv,
          id: this.generateId(), // Generate new IDs to avoid conflicts
          createdAt: new Date(cv.createdAt),
          updatedAt: new Date(cv.updatedAt)
        }));
        
        const allCVs = [...existingCVs, ...importedCVs];
        localStorage.setItem(this.CV_STORAGE_KEY, JSON.stringify(allCVs));
        result.imported.cvs = importedCVs.length;
      }
      
      // Import preferences
      if (data.preferences) {
        this.saveUserPreferences(data.preferences);
        result.imported.preferences = true;
      }
      
      result.success = true;
      return result;
    } catch (error) {
      console.error('Error importing data:', error);
      result.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  // Utility methods
  private generateId(): string {
    return `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Storage management
  getStorageUsage(): { used: number; total: number; percentage: number } {
    try {
      let totalSize = 0;
      
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith('mocv_')) {
          totalSize += localStorage.getItem(key)?.length || 0;
        }
      }
      
      // Estimate total available storage (5MB is typical for localStorage)
      const totalAvailable = 5 * 1024 * 1024; // 5MB in characters
      
      return {
        used: totalSize,
        total: totalAvailable,
        percentage: (totalSize / totalAvailable) * 100
      };
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return { used: 0, total: 0, percentage: 0 };
    }
  }

  clearAllData(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('mocv_'));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear data');
    }
  }

  // Backup functionality
  createBackup(): string {
    return this.exportAllData();
  }

  restoreFromBackup(backupData: string): boolean {
    try {
      const result = this.importData(backupData);
      return result.success;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return false;
    }
  }

  // Validation helpers
  validateCVData(cvData: Partial<CVData>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!cvData.personalInfo?.fullName?.trim()) {
      errors.push('Full name is required');
    }
    
    if (!cvData.personalInfo?.email?.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(cvData.personalInfo.email)) {
      errors.push('Valid email is required');
    }
    
    if (!cvData.personalInfo?.phone?.trim()) {
      errors.push('Phone number is required');
    }
    
    if (!cvData.summary?.trim()) {
      errors.push('Professional summary is required');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Create and export singleton instance
const storageService = new StorageService();

// Export individual functions for easier use
export const saveCV = (cv: Omit<StoredCV, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => 
  storageService.saveCV(cv);

export const updateCV = (id: string, updates: Partial<Omit<StoredCV, 'id' | 'createdAt'>>) => 
  storageService.updateCV(id, updates);

export const deleteCV = (id: string) => storageService.deleteCV(id);

export const getCV = (id: string) => storageService.getCV(id);

export const getAllCVs = () => storageService.getAllCVs();

export const searchCVs = (query: string) => storageService.searchCVs(query);

export const saveDraft = (cvData: Partial<CVData>, templateId?: string, targetMarket?: TargetMarket) => 
  storageService.saveDraft(cvData, templateId, targetMarket);

export const getDraft = () => storageService.getDraft();

export const clearDraft = () => storageService.clearDraft();

export const getCVStatistics = () => storageService.getCVStatistics();

export default storageService;
