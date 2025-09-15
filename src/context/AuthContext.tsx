// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authService, { UserProfile } from '../services/authService';
import { User } from 'firebase/auth';

interface AuthContextType {
  // User state
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Profile methods
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateStats: (stats: Partial<UserProfile['stats']>) => Promise<void>;
  resendEmailVerification: () => Promise<void>;
  
  // Utility methods
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  hasPremiumAccess: boolean;
  subscriptionStatus: 'free' | 'premium' | 'enterprise';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((authUser, profile) => {
      setUser(authUser);
      setUserProfile(profile);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Authentication methods
  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await authService.signIn({ email, password });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string): Promise<void> => {
    setLoading(true);
    try {
      await authService.signUp({ email, password, displayName });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.signOut();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    await authService.resetPassword(email);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    await authService.updateUserProfile(updates);
  };

  const updateStats = async (stats: Partial<UserProfile['stats']>): Promise<void> => {
    await authService.updateUserStats(stats);
  };

  const resendEmailVerification = async (): Promise<void> => {
    await authService.resendEmailVerification();
  };

  // Computed values
  const isAuthenticated = !!user;
  const isEmailVerified = user?.emailVerified ?? false;
  const hasPremiumAccess = authService.hasPremiumAccess();
  const subscriptionStatus = authService.getSubscriptionStatus();

  const value: AuthContextType = {
    // State
    user,
    userProfile,
    loading,
    
    // Authentication methods
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    
    // Profile methods
    updateProfile,
    updateStats,
    resendEmailVerification,
    
    // Computed values
    isAuthenticated,
    isEmailVerified,
    hasPremiumAccess,
    subscriptionStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// HOC for components that require authentication
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600">
              Please sign in to access this feature.
            </p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

export default AuthContext;
