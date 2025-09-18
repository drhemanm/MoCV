// src/services/cloudStorageService.ts
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Types for cloud storage
interface CloudCV {
  id?: string;
  name: string;
  data: any; // CV form data
  templateId: string;
  targetMarket: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  version: number;
  isPublic: boolean;
  tags?: string[];
  deviceId: string; // For anonymous users
}

interface CloudCVDraft {
  id?: string;
  cvId?: string; // If editing existing CV
  data: any;
  deviceId: string;
  lastSaved: Timestamp | Date;
  autoSave: boolean;
}

class CloudStorageService {
  private deviceId: string;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    // Generate unique device ID for anonymous users
    this.deviceId = this.getOrCreateDeviceId();
    
    // Listen for online/offline changes
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingChanges();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem('mocv_device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('mocv_device_id', deviceId);
    }
    return deviceId;
  }

  // CV Management
  async saveCV(cvData: {
    name: string;
    data: any;
    templateId: string;
    targetMarket: string;
    tags?: string[];
    isPublic?: boolean;
  }): Promise<string> {
    try {
      const cv: Omit<CloudCV, 'id'> = {
        ...cvData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        version: 1,
        isPublic: cvData.isPublic || false,
        deviceId: this.deviceId
      };

      const docRef = await addDoc(collection(db, 'cvs'), cv);
      
      // Save to localStorage as backup
      this.saveToLocalBackup('cvs', docRef.id, cv);
      
      return docRef.id;
    } catch (error) {
      console.error('Failed to save CV to cloud:', error);
      
      // Fallback to localStorage
      const localId = `local_${Date.now()}`;
      this.saveToLocalStorage('cvs', localId, cvData);
      throw new Error('CV saved locally. Will sync when online.');
    }
  }

  async updateCV(id: string, updates: Partial<CloudCV>): Promise<void> {
    try {
      const cvRef = doc(db, 'cvs', id);
      
      await updateDoc(cvRef, {
        ...updates,
        updatedAt: serverTimestamp(),
        version: (updates.version || 0) + 1
      });

      // Update local backup
      const existingLocal = this.getFromLocalBackup('cvs', id);
      if (existingLocal) {
        this.saveToLocalBackup('cvs', id, { ...existingLocal, ...updates });
      }
    } catch (error) {
      console.error('Failed to update CV:', error);
      
      // Save update for later sync
      this.savePendingUpdate('cvs', id, updates);
      throw new Error('Update saved locally. Will sync when online.');
    }
  }

  async getCV(id: string): Promise<CloudCV | null> {
    try {
      const cvRef = doc(db, 'cvs', id);
      const cvSnap = await getDoc(cvRef);
      
      if (cvSnap.exists()) {
        return { id: cvSnap.id, ...cvSnap.data() } as CloudCV;
      }
      
      // Fallback to local backup
      return this.getFromLocalBackup('cvs', id);
    } catch (error) {
      console.error('Failed to get CV from cloud:', error);
      
      // Try local backup
      return this.getFromLocalBackup('cvs', id);
    }
  }

  async getUserCVs(limitCount: number = 50): Promise<CloudCV[]> {
    try {
      const q = query(
        collection(db, 'cvs'),
        where('deviceId', '==', this.deviceId),
        orderBy('updatedAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const cvs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CloudCV[];

      // Merge with local backups
      const localCVs = this.getAllFromLocalStorage('cvs');
      const mergedCVs = this.mergeWithLocal(cvs, localCVs);
      
      return mergedCVs;
    } catch (error) {
      console.error('Failed to get CVs from cloud:', error);
      
      // Fallback to local storage
      return this.getAllFromLocalStorage('cvs');
    }
  }

  async deleteCV(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'cvs', id));
      
      // Remove from local backup
      this.removeFromLocalBackup('cvs', id);
    } catch (error) {
      console.error('Failed to delete CV from cloud:', error);
      
      // Mark for deletion when online
      this.markForDeletion('cvs', id);
      throw new Error('CV marked for deletion. Will sync when online.');
    }
  }

  // Draft Management (Auto-save)
  async saveDraft(data: any, cvId?: string): Promise<void> {
    try {
      const draftData: Omit<CloudCVDraft, 'id'> = {
        data,
        cvId,
        deviceId: this.deviceId,
        lastSaved: serverTimestamp(),
        autoSave: true
      };

      // Check if draft exists
      const existingDraft = await this.getDraft(cvId);
      
      if (existingDraft) {
        await updateDoc(doc(db, 'drafts', existingDraft.id!), draftData);
      } else {
        await addDoc(collection(db, 'drafts'), draftData);
      }

      // Always save to local as backup
      localStorage.setItem('mocv_current_draft', JSON.stringify(draftData));
    } catch (error) {
      console.error('Failed to save draft to cloud:', error);
      
      // Save locally
      localStorage.setItem('mocv_current_draft', JSON.stringify({ data, cvId }));
    }
  }

  async getDraft(cvId?: string): Promise<CloudCVDraft | null> {
    try {
      let q;
      if (cvId) {
        q = query(
          collection(db, 'drafts'),
          where('deviceId', '==', this.deviceId),
          where('cvId', '==', cvId),
          orderBy('lastSaved', 'desc'),
          limit(1)
        );
      } else {
        q = query(
          collection(db, 'drafts'),
          where('deviceId', '==', this.deviceId),
          orderBy('lastSaved', 'desc'),
          limit(1)
        );
      }

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as CloudCVDraft;
      }
      
      // Fallback to local draft
      const localDraft = localStorage.getItem('mocv_current_draft');
      return localDraft ? JSON.parse(localDraft) : null;
    } catch (error) {
      console.error('Failed to get draft from cloud:', error);
      
      // Try local draft
      const localDraft = localStorage.getItem('mocv_current_draft');
      return localDraft ? JSON.parse(localDraft) : null;
    }
  }

  async clearDraft(cvId?: string): Promise<void> {
    try {
      const draft = await this.getDraft(cvId);
      if (draft?.id) {
        await deleteDoc(doc(db, 'drafts', draft.id));
      }
      
      localStorage.removeItem('mocv_current_draft');
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }

  // Real-time listeners
  subscribeToUserCVs(callback: (cvs: CloudCV[]) => void): () => void {
    const q = query(
      collection(db, 'cvs'),
      where('deviceId', '==', this.deviceId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, 
      (snapshot) => {
        const cvs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CloudCV[];
        callback(cvs);
      },
      (error) => {
        console.error('CV subscription error:', error);
        // Fallback to local data
        callback(this.getAllFromLocalStorage('cvs'));
      }
    );
  }

  // Migration from localStorage
  async migrateLocalData(): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    try {
      // Migrate existing CVs
      const localCVs = JSON.parse(localStorage.getItem('mocv_saved_cvs') || '[]');
      
      const batch = writeBatch(db);
      
      for (const localCV of localCVs) {
        try {
          const cvRef = doc(collection(db, 'cvs'));
          batch.set(cvRef, {
            ...localCV,
            deviceId: this.deviceId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            version: 1,
            isPublic: false
          });
          success++;
        } catch {
          failed++;
        }
      }

      await batch.commit();
      
      // Keep local backup but mark as migrated
      localStorage.setItem('mocv_migration_completed', 'true');
      
    } catch (error) {
      console.error('Migration failed:', error);
      failed = localCVs?.length || 0;
    }

    return { success, failed };
  }

  // Sync pending changes when coming back online
  private async syncPendingChanges(): Promise<void> {
    try {
      const pendingUpdates = JSON.parse(localStorage.getItem('mocv_pending_updates') || '[]');
      
      for (const update of pendingUpdates) {
        await this.updateCV(update.id, update.data);
      }
      
      localStorage.removeItem('mocv_pending_updates');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  // Helper methods for local storage fallbacks
  private saveToLocalBackup(collection: string, id: string, data: any): void {
    const backups = JSON.parse(localStorage.getItem(`mocv_${collection}_backup`) || '{}');
    backups[id] = { ...data, id };
    localStorage.setItem(`mocv_${collection}_backup`, JSON.stringify(backups));
  }

  private getFromLocalBackup(collection: string, id: string): any {
    const backups = JSON.parse(localStorage.getItem(`mocv_${collection}_backup`) || '{}');
    return backups[id] || null;
  }

  private getAllFromLocalStorage(collection: string): any[] {
    const backups = JSON.parse(localStorage.getItem(`mocv_${collection}_backup`) || '{}');
    return Object.values(backups);
  }

  private removeFromLocalBackup(collection: string, id: string): void {
    const backups = JSON.parse(localStorage.getItem(`mocv_${collection}_backup`) || '{}');
    delete backups[id];
    localStorage.setItem(`mocv_${collection}_backup`, JSON.stringify(backups));
  }

  private saveToLocalStorage(collection: string, id: string, data: any): void {
    this.saveToLocalBackup(collection, id, data);
  }

  private savePendingUpdate(collection: string, id: string, data: any): void {
    const pending = JSON.parse(localStorage.getItem('mocv_pending_updates') || '[]');
    pending.push({ collection, id, data, timestamp: Date.now() });
    localStorage.setItem('mocv_pending_updates', JSON.stringify(pending));
  }

  private markForDeletion(collection: string, id: string): void {
    const pending = JSON.parse(localStorage.getItem('mocv_pending_deletions') || '[]');
    pending.push({ collection, id, timestamp: Date.now() });
    localStorage.setItem('mocv_pending_deletions', JSON.stringify(pending));
  }

  private mergeWithLocal(cloudData: any[], localData: any[]): any[] {
    const merged = [...cloudData];
    
    localData.forEach(local => {
      if (!merged.find(cloud => cloud.id === local.id)) {
        merged.push(local);
      }
    });
    
    return merged.sort((a, b) => new Date(b.updatedAt || b.lastModified || 0).getTime() - new Date(a.updatedAt || a.lastModified || 0).getTime());
  }

  // Status methods
  isConnected(): boolean {
    return this.isOnline;
  }

  getDeviceId(): string {
    return this.deviceId;
  }
}

// Export singleton instance
export const cloudStorageService = new CloudStorageService();
export default cloudStorageService;
