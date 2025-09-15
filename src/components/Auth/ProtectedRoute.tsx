// src/components/Auth/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Loader2 } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: ReactNode;
  requireEmailVerification?: boolean;
  requirePremium?: boolean;
  fallback?: ReactNode;
  showAuthModal?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireEmailVerification = false,
  requirePremium = false,
  fallback,
  showAuthModal = true
}) => {
  const { 
    isAuthenticated, 
    isEmailVerified, 
    hasPremiumAccess, 
    loading, 
    user,
    resendEmailVerification 
  } = useAuth();

  const [showAuth, setShowAuth] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [resendSuccess, setResendSuccess] = React.useState(false);

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showAuthModal) {
      return (
        <>
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full mx-4">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Authentication Required
                </h2>
                <p className="text-gray-600 mb-6">
                  Please sign in to access your CV dashboard and continue building professional CVs.
                </p>
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign In / Sign Up
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Why sign up?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Save and manage multiple CVs
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Track your progress and earn XP
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Access AI-powered suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Get market-specific optimizations
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <AuthModal
            isOpen={showAuth}
            onClose={() => setShowAuth(false)}
          />
        </>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please sign in to access this feature.
          </p>
        </div>
      </div>
    );
  }

  // Handle email verification requirement
  if (requireEmailVerification && !isEmailVerified) {
    const handleResendVerification = async () => {
      setIsResending(true);
      try {
        await resendEmailVerification();
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } catch (error) {
        console.error('Failed to resend verification email:', error);
      } finally {
        setIsResending(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-yellow-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            
            <p className="text-gray-600 mb-6">
              We've sent a verification email to <strong>{user?.email}</strong>. 
              Please check your inbox and click the verification link to continue.
            </p>

            {resendSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg mb-4 text-sm">
                Verification email sent successfully! Check your inbox.
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={isResending || resendSuccess}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendSuccess ? (
                  'Email Sent!'
                ) : (
                  'Resend Verification Email'
                )}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                I've Verified My Email
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Can't find the email? Check your spam folder or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle premium requirement
  if (requirePremium && !hasPremiumAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Premium Feature
            </h2>
            
            <p className="text-gray-600 mb-6">
              This feature is only available to premium subscribers. 
              Upgrade your account to unlock advanced CV optimization tools.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Premium Benefits:</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Advanced AI content suggestions</li>
                <li>• Unlimited CV exports</li>
                <li>• Priority customer support</li>
                <li>• Exclusive premium templates</li>
                <li>• Advanced analytics and insights</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium">
                Upgrade to Premium
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // All checks passed - render the protected content
  return <>{children}</>;
};

// Higher-order component for easy wrapping
export const withProtection = (
  options: Omit<ProtectedRouteProps, 'children'> = {}
) => {
  return <T extends object>(Component: React.ComponentType<T>) => {
    const ProtectedComponent: React.FC<T> = (props) => {
      return (
        <ProtectedRoute {...options}>
          <Component {...props} />
        </ProtectedRoute>
      );
    };

    ProtectedComponent.displayName = `withProtection(${Component.displayName || Component.name})`;
    
    return ProtectedComponent;
  };
};

// Specific protection HOCs for common use cases
export const requireAuth = withProtection();
export const requireVerifiedEmail = withProtection({ requireEmailVerification: true });
export const requirePremium = withProtection({ requirePremium: true });
export const requireVerifiedPremium = withProtection({ 
  requireEmailVerification: true, 
  requirePremium: true 
});

export default ProtectedRoute;
