// src/services/storageService.ts - Updated to use cloud storage
import { cloudStorageService } from './cloudStorageService';

export interface SavedCV {
  id: string;
  name: string;
  data: any;
  templateId: string;
  targetMarket: string;
  lastModified: Date | string;
  createdAt?: Date | string;
  version?: number;
  tags?: string[];
  isPublic?: boolean;
}

class StorageService {
  private migrationCompleted: boolean;

  constructor() {
    this.migrationCompleted = localStorage.getItem('mocv_migration_completed') === 'true';
    
    // Auto-migrate on first use
    if (!this.migrationCompleted) {
      this.migrateToCloud();
    }
  }

  // CV Management
  async saveCV(cvData: {
    data: any;
    templateId: string;
    targetMarket: string;
    name: string;
    lastModified: Date;
    tags?: string[];
    isPublic?: boolean;
  }): Promise<SavedCV> {
    try {
      const id = await cloudStorageService.saveCV({
        name: cvData.name,
        data: cvData.data,
        templateId: cvData.templateId,
        targetMarket: cvData.targetMarket,
        tags: cvData.tags,
        isPublic: cvData.isPublic
      });

      return {
        id,
        ...cvData,
        createdAt: new Date(),
        version: 1
      };
    } catch (error) {
      console.error('Failed to save CV to cloud, using local fallback:', error);
      
      // Fallback to localStorage
      return this.saveToLocalStorage(cvData);
    }
  }

  async updateCV(id: string, updates: Partial<SavedCV>): Promise<SavedCV> {
    try {
      await cloudStorageService.updateCV(id, {
        ...updates,
        updatedAt: new Date()
      });

      const updatedCV = await cloudStorageService.getCV(id);
      return updatedCV as SavedCV;
    } catch (error) {
      console.error('Failed to update CV in cloud:', error);
      throw new Error('Failed to update CV. Please try again.');
    }
  }

  async getCV(id: string): Promise<SavedCV | null> {
    try {
      const cv = await cloudStorageService.getCV(id);
      return cv as SavedCV;
    } catch (error) {
      console.error('Failed to get CV from cloud:', error);
      return null;
    }
  }

  async getAllCVs(): Promise<SavedCV[]> {
    try {
      const cvs = await cloudStorageService.getUserCVs();
      return cvs.map(cv => ({
        id: cv.id!,
        name: cv.name,
        data: cv.data,
        templateId: cv.templateId,
        targetMarket: cv.targetMarket,
        lastModified: cv.updatedAt instanceof Date ? cv.updatedAt : new Date(cv.updatedAt),
        createdAt: cv.createdAt instanceof Date ? cv.createdAt : new Date(cv.createdAt),
        version: cv.version,
        tags: cv.tags,
        isPublic: cv.isPublic
      }));
    } catch (error) {
      console.error('Failed to get CVs from cloud:', error);
      
      // Fallback to local storage
      return this.getLocalCVs();
    }
  }

  async deleteCV(id: string): Promise<void> {
    try {
      await cloudStorageService.deleteCV(id);
    } catch (error) {
      console.error('Failed to delete CV from cloud:', error);
      throw new Error('Failed to delete CV. Please try again.');
    }
  }

  // Draft Management
  async saveDraft(data: any, cvId?: string): Promise<void> {
    try {
      await cloudStorageService.saveDraft(data, cvId);
    } catch (error) {
      console.error('Failed to save draft to cloud:', error);
      
      // Fallback to localStorage
      localStorage.setItem('mocv_current_draft', JSON.stringify({ data, cvId }));
    }
  }

  async getDraft(cvId?: string): Promise<any> {
    try {
      const draft = await cloudStorageService.getDraft(cvId);
      return draft?.data || null;
    } catch (error) {
      console.error('Failed to get draft from cloud:', error);
      
      // Fallback to localStorage
      const localDraft = localStorage.getItem('mocv_current_draft');
      return localDraft ? JSON.parse(localDraft).data : null;
    }
  }

  async clearDraft(cvId?: string): Promise<void> {
    try {
      await cloudStorageService.clearDraft(cvId);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }

  // Real-time updates
  subscribeToChanges(callback: (cvs: SavedCV[]) => void): () => void {
    return cloudStorageService.subscribeToUserCVs((cloudCVs) => {
      const cvs = cloudCVs.map(cv => ({
        id: cv.id!,
        name: cv.name,
        data: cv.data,
        templateId: cv.templateId,
        targetMarket: cv.targetMarket,
        lastModified: cv.updatedAt instanceof Date ? cv.updatedAt : new Date(cv.updatedAt),
        createdAt: cv.createdAt instanceof Date ? cv.createdAt : new Date(cv.createdAt),
        version: cv.version,
        tags: cv.tags,
        isPublic: cv.isPublic
      }));
      callback(cvs);
    });
  }

  // Migration from localStorage
  private async migrateToCloud(): Promise<void> {
    try {
      console.log('🔄 Migrating local data to cloud...');
      
      const result = await cloudStorageService.migrateLocalData();
      
      console.log(`✅ Migration completed: ${result.success} successful, ${result.failed} failed`);
      
      if (result.success > 0) {
        // Show user notification about migration
        this.showMigrationNotification(result.success, result.failed);
      }
      
      this.migrationCompleted = true;
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }

  private showMigrationNotification(success: number, failed: number): void {
    const message = failed > 0 
      ? `Migrated ${success} CVs to cloud. ${failed} failed to migrate.`
      : `Successfully migrated ${success} CVs to cloud storage!`;
    
    // You can replace this with your toast notification system
    if ('Notification' in window) {
      new Notification('MoCV Migration', { body: message });
    } else {
      console.log('Migration:', message);
    }
  }

  // Legacy localStorage methods (fallback)
  private saveToLocalStorage(cvData: any): SavedCV {
    const savedCVs = this.getLocalCVs();
    const newCV: SavedCV = {
      id: `local_${Date.now()}`,
      ...cvData,
      createdAt: new Date(),
      version: 1
    };
    
    savedCVs.push(newCV);
    localStorage.setItem('mocv_saved_cvs', JSON.stringify(savedCVs));
    
    return newCV;
  }

  private getLocalCVs(): SavedCV[] {
    const saved = localStorage.getItem('mocv_saved_cvs');
    return saved ? JSON.parse(saved) : [];
  }

  // Utility methods
  isCloudEnabled(): boolean {
    return cloudStorageService.isConnected();
  }

  getDeviceId(): string {
    return cloudStorageService.getDeviceId();
  }

  // Export/Import functionality
  async exportAllData(): Promise<string> {
    const cvs = await this.getAllCVs();
    return JSON.stringify({
      cvs,
      exportDate: new Date().toISOString(),
      deviceId: this.getDeviceId()
    }, null, 2);
  }

  async importData(jsonData: string): Promise<{ success: number; failed: number }> {
    try {
      const data = JSON.parse(jsonData);
      const cvs = data.cvs || [];
      
      let success = 0;
      let failed = 0;
      
      for (const cv of cvs) {
        try {
          await this.saveCV({
            data: cv.data,
            templateId: cv.templateId,
            targetMarket: cv.targetMarket,
            name: `${cv.name} (Imported)`,
            lastModified: new Date(),
            tags: [...(cv.tags || []), 'imported']
          });
          success++;
        } catch {
          failed++;
        }
      }
      
      return { success, failed };
    } catch (error) {
      throw new Error('Invalid import data format');
    }
  }
}

// Create singleton instance
const storageServiceInstance = new StorageService();

// Export both named and default exports for compatibility
export { StorageService };
export const storageService = storageServiceInstance;
export default storageServiceInstance;
