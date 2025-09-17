// src/services/storageService.ts

export interface StorageOptions {
  encrypt?: boolean;
  compress?: boolean;
  expiry?: number; // milliseconds
}

export interface StorageItem<T = any> {
  data: T;
  timestamp: number;
  expiry?: number;
  version?: string;
}

export class StorageService {
  private static readonly STORAGE_PREFIX = 'mocv_';
  private static readonly CURRENT_VERSION = '1.0.0';

  /**
   * Store data in localStorage with optional expiry and encryption
   */
  static setItem<T>(
    key: string, 
    value: T, 
    options: StorageOptions = {}
  ): boolean {
    try {
      const storageItem: StorageItem<T> = {
        data: value,
        timestamp: Date.now(),
        version: this.CURRENT_VERSION,
        ...(options.expiry && { expiry: Date.now() + options.expiry })
      };

      const serialized = JSON.stringify(storageItem);
      const finalData = options.encrypt ? this.encrypt(serialized) : serialized;
      
      localStorage.setItem(this.STORAGE_PREFIX + key, finalData);
      return true;
    } catch (error) {
      console.error('Storage setItem failed:', error);
      return false;
    }
  }

  /**
   * Retrieve data from localStorage with expiry checking
   */
  static getItem<T>(key: string, options: StorageOptions = {}): T | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_PREFIX + key);
      if (!stored) return null;

      const decrypted = options.encrypt ? this.decrypt(stored) : stored;
      const storageItem: StorageItem<T> = JSON.parse(decrypted);

      // Check expiry
      if (storageItem.expiry && Date.now() > storageItem.expiry) {
        this.removeItem(key);
        return null;
      }

      return storageItem.data;
    } catch (error) {
      console.error('Storage getItem failed:', error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key);
      return true;
    } catch (error) {
      console.error('Storage removeItem failed:', error);
      return false;
    }
  }

  /**
   * Clear all app-related items from localStorage
   */
  static clear(): boolean {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.STORAGE_PREFIX)
      );
      
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Storage clear failed:', error);
      return false;
    }
  }

  /**
   * Get all stored keys (without prefix)
   */
  static getAllKeys(): string[] {
    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(this.STORAGE_PREFIX))
        .map(key => key.replace(this.STORAGE_PREFIX, ''));
    } catch (error) {
      console.error('Storage getAllKeys failed:', error);
      return [];
    }
  }

  /**
   * Check if key exists and is not expired
   */
  static hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): {
    used: number;
    available: number;
    total: number;
    itemCount: number;
  } {
    try {
      let used = 0;
      const keys = this.getAllKeys();
      
      keys.forEach(key => {
        const item = localStorage.getItem(this.STORAGE_PREFIX + key);
        if (item) used += item.length;
      });

      // Rough estimate of localStorage limit (5MB for most browsers)
      const total = 5 * 1024 * 1024; // 5MB in characters
      const available = total - used;

      return {
        used,
        available,
        total,
        itemCount: keys.length
      };
    } catch (error) {
      console.error('Storage info failed:', error);
      return { used: 0, available: 0, total: 0, itemCount: 0 };
    }
  }

  /**
   * Store CV data with automatic versioning
   */
  static saveCVData(cvId: string, cvData: any): boolean {
    return this.setItem(`cv_${cvId}`, cvData, {
      expiry: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }

  /**
   * Retrieve CV data by ID
   */
  static getCVData(cvId: string): any | null {
    return this.getItem(`cv_${cvId}`);
  }

  /**
   * Get all saved CV IDs
   */
  static getAllCVIds(): string[] {
    return this.getAllKeys()
      .filter(key => key.startsWith('cv_'))
      .map(key => key.replace('cv_', ''));
  }

  /**
   * Delete CV data
   */
  static deleteCVData(cvId: string): boolean {
    return this.removeItem(`cv_${cvId}`);
  }

  /**
   * Store user preferences
   */
  static saveUserPreferences(preferences: any): boolean {
    return this.setItem('user_preferences', preferences);
  }

  /**
   * Get user preferences
   */
  static getUserPreferences(): any | null {
    return this.getItem('user_preferences');
  }

  /**
   * Store template customizations
   */
  static saveTemplateCustomizations(templateId: string, customizations: any): boolean {
    return this.setItem(`template_${templateId}`, customizations);
  }

  /**
   * Get template customizations
   */
  static getTemplateCustomizations(templateId: string): any | null {
    return this.getItem(`template_${templateId}`);
  }

  /**
   * Store recent activity/history
   */
  static addToHistory(action: string, data: any): boolean {
    const history = this.getItem('action_history') || [];
    const newEntry = {
      id: Date.now().toString(),
      action,
      data,
      timestamp: Date.now()
    };

    // Keep last 50 entries
    const updatedHistory = [newEntry, ...history.slice(0, 49)];
    return this.setItem('action_history', updatedHistory);
  }

  /**
   * Get action history
   */
  static getHistory(limit: number = 20): any[] {
    const history = this.getItem('action_history') || [];
    return history.slice(0, limit);
  }

  /**
   * Export all data for backup
   */
  static exportAllData(): string {
    try {
      const allData: Record<string, any> = {};
      const keys = this.getAllKeys();
      
      keys.forEach(key => {
        const value = this.getItem(key);
        if (value !== null) {
          allData[key] = value;
        }
      });

      return JSON.stringify({
        version: this.CURRENT_VERSION,
        exportDate: new Date().toISOString(),
        data: allData
      }, null, 2);
    } catch (error) {
      console.error('Export failed:', error);
      return '';
    }
  }

  /**
   * Import data from backup
   */
  static importData(backupData: string): boolean {
    try {
      const parsed = JSON.parse(backupData);
      
      if (!parsed.data || typeof parsed.data !== 'object') {
        throw new Error('Invalid backup format');
      }

      // Clear existing data
      this.clear();

      // Import all data
      Object.entries(parsed.data).forEach(([key, value]) => {
        this.setItem(key, value);
      });

      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  /**
   * Simple encryption (for basic obfuscation, not security)
   */
  private static encrypt(data: string): string {
    // Simple base64 encoding for basic obfuscation
    // In production, use proper encryption libraries
    return btoa(unescape(encodeURIComponent(data)));
  }

  /**
   * Simple decryption
   */
  private static decrypt(data: string): string {
    try {
      return decodeURIComponent(escape(atob(data)));
    } catch (error) {
      console.error('Decryption failed:', error);
      return data; // Return original if decryption fails
    }
  }

  /**
   * Clean expired items
   */
  static cleanExpiredItems(): number {
    let cleanedCount = 0;
    
    try {
      const keys = this.getAllKeys();
      
      keys.forEach(key => {
        const stored = localStorage.getItem(this.STORAGE_PREFIX + key);
        if (!stored) return;

        try {
          const storageItem: StorageItem = JSON.parse(stored);
          if (storageItem.expiry && Date.now() > storageItem.expiry) {
            this.removeItem(key);
            cleanedCount++;
          }
        } catch (error) {
          // If we can't parse it, it might be corrupted, so remove it
          this.removeItem(key);
          cleanedCount++;
        }
      });
    } catch (error) {
      console.error('Cleanup failed:', error);
    }

    return cleanedCount;
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default StorageService;
