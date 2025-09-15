// src/services/authService.ts
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import app from '../firebase';

const auth = getAuth(app);

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  subscription: 'free' | 'premium' | 'enterprise';
  preferences: {
    language: string;
    defaultMarket: string;
    emailNotifications: boolean;
    autoSave: boolean;
  };
  stats: {
    cvsCreated: number;
    templatesUsed: number;
    analysisCompleted: number;
    lastActiveAt: Date;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  private currentUser: User | null = null;
  private userProfile: UserProfile | null = null;
  private listeners: Set<(user: User | null, profile: UserProfile | null) => void> = new Set();

  constructor() {
    this.initializeAuthListener();
  }

  private initializeAuthListener() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      
      if (user) {
        // Load user profile from Firestore
        await this.loadUserProfile(user);
        // Update last login
        await this.updateLastLogin(user.uid);
      } else {
        this.userProfile = null;
      }
      
      // Notify all listeners
      this.notifyListeners();
    });
  }

  private async loadUserProfile(user: User): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        this.userProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || data.displayName || '',
          photoURL: user.photoURL || data.photoURL,
          emailVerified: user.emailVerified,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
          subscription: data.subscription || 'free',
          preferences: {
            language: data.preferences?.language || 'en',
            defaultMarket: data.preferences?.defaultMarket || 'mauritius',
            emailNotifications: data.preferences?.emailNotifications ?? true,
            autoSave: data.preferences?.autoSave ?? true,
            ...data.preferences
          },
          stats: {
            cvsCreated: data.stats?.cvsCreated || 0,
            templatesUsed: data.stats?.templatesUsed || 0,
            analysisCompleted: data.stats?.analysisCompleted || 0,
            lastActiveAt: data.stats?.lastActiveAt?.toDate() || new Date(),
            ...data.stats
          }
        };
      } else {
        // Create new user profile
        await this.createUserProfile(user);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  private async createUserProfile(user: User): Promise<void> {
    const newProfile: Omit<UserProfile, 'uid'> = {
      email: user.email!,
      displayName: user.displayName || '',
      photoURL: user.photoURL || undefined,
      emailVerified: user.emailVerified,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      subscription: 'free',
      preferences: {
        language: 'en',
        defaultMarket: 'mauritius',
        emailNotifications: true,
        autoSave: true
      },
      stats: {
        cvsCreated: 0,
        templatesUsed: 0,
        analysisCompleted: 0,
        lastActiveAt: new Date()
      }
    };

    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...newProfile,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        stats: {
          ...newProfile.stats,
          lastActiveAt: serverTimestamp()
        }
      });

      this.userProfile = {
        uid: user.uid,
        ...newProfile
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  private async updateLastLogin(uid: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        lastLoginAt: serverTimestamp(),
        'stats.lastActiveAt': serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener(this.currentUser, this.userProfile);
    });
  }

  // Public methods
  public subscribe(callback: (user: User | null, profile: UserProfile | null) => void): () => void {
    this.listeners.add(callback);
    
    // Immediately call with current state
    callback(this.currentUser, this.userProfile);
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  public async signUp({ email, password, displayName }: SignUpData): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName });

      // Send email verification
      await sendEmailVerification(user);

      return user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  public async signIn({ email, password }: SignInData): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  public async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential.user;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  public async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  public async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  public async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    if (!this.currentUser || !this.userProfile) {
      throw new Error('No authenticated user');
    }

    try {
      // Update Firebase Auth profile if needed
      if (updates.displayName && updates.displayName !== this.currentUser.displayName) {
        await updateProfile(this.currentUser, { displayName: updates.displayName });
      }

      // Update Firestore document
      const userDocRef = doc(db, 'users', this.currentUser.uid);
      await updateDoc(userDocRef, {
        ...updates,
        'stats.lastActiveAt': serverTimestamp()
      });

      // Update local profile
      this.userProfile = {
        ...this.userProfile,
        ...updates
      };

      this.notifyListeners();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  public async updateUserStats(stats: Partial<UserProfile['stats']>): Promise<void> {
    if (!this.currentUser || !this.userProfile) {
      throw new Error('No authenticated user');
    }

    try {
      const userDocRef = doc(db, 'users', this.currentUser.uid);
      const updates: any = {
        'stats.lastActiveAt': serverTimestamp()
      };

      // Add specific stat updates
      Object.entries(stats).forEach(([key, value]) => {
        if (key !== 'lastActiveAt') {
          updates[`stats.${key}`] = value;
        }
      });

      await updateDoc(userDocRef, updates);

      // Update local profile
      this.userProfile = {
        ...this.userProfile,
        stats: {
          ...this.userProfile.stats,
          ...stats,
          lastActiveAt: new Date()
        }
      };

      this.notifyListeners();
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public isEmailVerified(): boolean {
    return this.currentUser?.emailVerified ?? false;
  }

  public async resendEmailVerification(): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      await sendEmailVerification(this.currentUser);
    } catch (error) {
      console.error('Error resending email verification:', error);
      throw error;
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Pop-up was blocked. Please allow pop-ups and try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Method to sync gamification data with user stats
  public async syncGameData(gameData: any): Promise<void> {
    if (!this.isAuthenticated()) return;

    try {
      await this.updateUserStats({
        cvsCreated: gameData.stats?.cvsCreated || 0,
        templatesUsed: gameData.stats?.templatesUsed || 0,
        analysisCompleted: gameData.stats?.analysisCompleted || 0
      });
    } catch (error) {
      console.error('Error syncing game data:', error);
    }
  }

  // Method to get user's subscription status
  public getSubscriptionStatus(): 'free' | 'premium' | 'enterprise' {
    return this.userProfile?.subscription || 'free';
  }

  // Method to check if user has premium features
  public hasPremiumAccess(): boolean {
    const subscription = this.getSubscriptionStatus();
    return subscription === 'premium' || subscription === 'enterprise';
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
