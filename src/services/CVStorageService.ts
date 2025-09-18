// src/services/CVStorageService.ts
export interface SavedCV {
  id: string;
  name: string;
  data: any;
  tags?: string[];
  isPublic?: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deviceId: string;
  version: number;
  syncStatus: 'synced' | 'pending' | 'error';
  wordCount: number;
  completionScore: number;
}

export class CVStorageService {
  private static instance: CVStorageService;
  private deviceId: string;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.deviceId = this.getOrCreateDeviceId();
    this.setupOfflineHandling();
  }

  static getInstance(): CVStorageService {
    if (!CVStorageService.instance) {
      CVStorageService.instance = new CVStorageService();
    }
    return CVStorageService.instance;
  }

  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem('mocv_device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('mocv_device_id', deviceId);
    }
    return deviceId;
  }

  private setupOfflineHandling() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineChanges();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Save CV with enhanced metadata
  async saveCV(cvData: any, metadata: {
    name: string;
    tags?: string[];
    isPublic?: boolean;
    description?: string;
  }): Promise<string> {
    const cvId = `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const savedCV: SavedCV = {
      id: cvId,
      ...metadata,
      data: cvData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deviceId: this.deviceId,
      version: 1,
      syncStatus: this.isOnline ? 'synced' : 'pending',
      wordCount: this.calculateWordCount(cvData),
      completionScore: this.calculateCompletion(cvData)
    };

    // Save to localStorage
    const existingCVs = this.getAllCVs();
    const updatedCVs = [savedCV, ...existingCVs];
    localStorage.setItem('mocv_saved_cvs', JSON.stringify(updatedCVs));

    // If online, sync to cloud (mock implementation)
    if (this.isOnline) {
      try {
        await this.syncToCloud(savedCV);
        savedCV.syncStatus = 'synced';
        // Update the saved CV with synced status
        const finalCVs = [savedCV, ...existingCVs];
        localStorage.setItem('mocv_saved_cvs', JSON.stringify(finalCVs));
      } catch (error) {
        console.error('Failed to sync to cloud:', error);
        savedCV.syncStatus = 'error';
      }
    }

    return cvId;
  }

  // Update existing CV
  async updateCV(cvId: string, cvData: any, metadata?: Partial<{
    name: string;
    tags: string[];
    isPublic: boolean;
    description: string;
  }>): Promise<void> {
    const existingCVs = this.getAllCVs();
    const cvIndex = existingCVs.findIndex(cv => cv.id === cvId);
    
    if (cvIndex === -1) {
      throw new Error('CV not found');
    }

    const updatedCV: SavedCV = {
      ...existingCVs[cvIndex],
      ...metadata,
      data: cvData,
      updatedAt: new Date().toISOString(),
      version: existingCVs[cvIndex].version + 1,
      syncStatus: this.isOnline ? 'synced' : 'pending',
      wordCount: this.calculateWordCount(cvData),
      completionScore: this.calculateCompletion(cvData)
    };

    existingCVs[cvIndex] = updatedCV;
    localStorage.setItem('mocv_saved_cvs', JSON.stringify(existingCVs));

    if (this.isOnline) {
      try {
        await this.syncToCloud(updatedCV);
        updatedCV.syncStatus = 'synced';
        localStorage.setItem('mocv_saved_cvs', JSON.stringify(existingCVs));
      } catch (error) {
        console.error('Failed to sync to cloud:', error);
        updatedCV.syncStatus = 'error';
      }
    }
  }

  // Get all saved CVs
  getAllCVs(): SavedCV[] {
    try {
      const saved = localStorage.getItem('mocv_saved_cvs');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading CVs:', error);
      return [];
    }
  }

  // Get specific CV
  getCV(cvId: string): SavedCV | null {
    const cvs = this.getAllCVs();
    return cvs.find(cv => cv.id === cvId) || null;
  }

  // Delete CV
  async deleteCV(cvId: string): Promise<void> {
    const existingCVs = this.getAllCVs();
    const filteredCVs = existingCVs.filter(cv => cv.id !== cvId);
    localStorage.setItem('mocv_saved_cvs', JSON.stringify(filteredCVs));

    if (this.isOnline) {
      try {
        await this.deleteFromCloud(cvId);
      } catch (error) {
        console.error('Failed to delete from cloud:', error);
      }
    }
  }

  // Duplicate CV
  async duplicateCV(cvId: string): Promise<string> {
    const originalCV = this.getCV(cvId);
    if (!originalCV) {
      throw new Error('CV not found');
    }

    return await this.saveCV(originalCV.data, {
      name: `${originalCV.name} (Copy)`,
      tags: originalCV.tags,
      isPublic: false,
      description: originalCV.description
    });
  }

  // Calculate completion score
  private calculateCompletion(cvData: any): number {
    let score = 0;
    const weights = {
      personalInfo: 20,
      summary: 15,
      experience: 25,
      education: 20,
      skills: 15,
      projects: 3,
      certifications: 2
    };

    // Check personal info completion
    const personalInfo = cvData.personalInfo || {};
    const requiredPersonalFields = ['fullName', 'email', 'phone'];
    const completedPersonalFields = requiredPersonalFields.filter(field => 
      personalInfo[field] && personalInfo[field].trim().length > 0
    );
    score += (completedPersonalFields.length / requiredPersonalFields.length) * weights.personalInfo;

    // Check summary
    if (cvData.summary && cvData.summary.trim().length >= 50) {
      score += weights.summary;
    }

    // Check experience
    if (cvData.experience && cvData.experience.length > 0) {
      score += weights.experience;
    }

    // Check education
    if (cvData.education && cvData.education.length > 0) {
      score += weights.education;
    }

    // Check skills
    if (cvData.skills && cvData.skills.length >= 3) {
      score += weights.skills;
    }

    // Check optional sections
    if (cvData.projects && cvData.projects.length > 0) {
      score += weights.projects;
    }

    if (cvData.certifications && cvData.certifications.length > 0) {
      score += weights.certifications;
    }

    return Math.round(score);
  }

  // Calculate word count
  private calculateWordCount(cvData: any): number {
    let wordCount = 0;
    
    // Count summary words
    if (cvData.summary) {
      wordCount += cvData.summary.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    // Count experience descriptions
    if (cvData.experience) {
      cvData.experience.forEach((exp: any) => {
        if (exp.description) {
          wordCount += exp.description.trim().split(/\s+/).filter(word => word.length > 0).length;
        }
      });
    }

    // Count education descriptions
    if (cvData.education) {
      cvData.education.forEach((edu: any) => {
        if (edu.description) {
          wordCount += edu.description.trim().split(/\s+/).filter(word => word.length > 0).length;
        }
      });
    }

    // Count project descriptions
    if (cvData.projects) {
      cvData.projects.forEach((project: any) => {
        if (project.description) {
          wordCount += project.description.trim().split(/\s+/).filter(word => word.length > 0).length;
        }
      });
    }

    return wordCount;
  }

  // Mock cloud sync - replace with real API calls
  private async syncToCloud(cvData: SavedCV): Promise<void> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          console.log('CV synced to cloud:', cvData.id);
          resolve();
        } else {
          reject(new Error('Cloud sync failed'));
        }
      }, 1000);
    });
  }

  // Mock cloud deletion - replace with real API calls
  private async deleteFromCloud(cvId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('CV deleted from cloud:', cvId);
        resolve();
      }, 500);
    });
  }

  // Sync offline changes when back online
  private async syncOfflineChanges(): Promise<void> {
    const cvs = this.getAllCVs();
    const pendingCVs = cvs.filter(cv => cv.syncStatus === 'pending' || cv.syncStatus === 'error');

    console.log(`Syncing ${pendingCVs.length} pending CVs...`);

    for (const cv of pendingCVs) {
      try {
        await this.syncToCloud(cv);
        cv.syncStatus = 'synced';
      } catch (error) {
        cv.syncStatus = 'error';
        console.error(`Failed to sync CV ${cv.id}:`, error);
      }
    }

    if (pendingCVs.length > 0) {
      localStorage.setItem('mocv_saved_cvs', JSON.stringify(cvs));
    }
  }
}
