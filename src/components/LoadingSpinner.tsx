// src/components/LoadingSpinner.tsx
import React from 'react';
import { Loader2, Sparkles, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  overlay?: boolean;
  message?: string;
  className?: string;
  variant?: 'default' | 'dots' | 'pulse' | 'bouncing' | 'gradient';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  overlay = true,
  message = 'Loading...',
  className = '',
  variant = 'default',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const containerSizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const messageSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${containerSizeClasses[size]} bg-blue-100 rounded-full flex items-center justify-center animate-pulse`}>
            <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-ping`}></div>
          </div>
        );
      
      case 'bouncing':
        return (
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      
      case 'gradient':
        return (
          <div className="relative">
            <div className={`${containerSizeClasses[size]} bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-spin`}>
              <div className="w-3/4 h-3/4 bg-white rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={`${containerSizeClasses[size]} bg-blue-50 rounded-full flex items-center justify-center`}>
            <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
          </div>
        );
    }
  };

  const content = (
    <div className="flex flex-col items-center">
      {renderSpinner()}
      
      {message && (
        <p className={`text-gray-700 font-medium text-center mt-4 ${messageSize[size]}`}>
          {message}
        </p>
      )}
      
      {variant === 'default' && (
        <div className="mt-3 flex space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      )}
    </div>
  );

  if (overlay || fullScreen) {
    return (
      <div className={`${fullScreen ? 'fixed' : 'absolute'} inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4 min-w-[200px]">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {content}
    </div>
  );
};

// Inline loading spinner for buttons
export const ButtonSpinner: React.FC<{ size?: 'sm' | 'md'; className?: string }> = ({ 
  size = 'sm', 
  className = '' 
}) => {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  
  return (
    <Loader2 className={`${sizeClass} animate-spin ${className}`} />
  );
};

// Loading skeleton for content
export const LoadingSkeleton: React.FC<{ 
  lines?: number; 
  className?: string;
  avatar?: boolean;
  card?: boolean;
}> = ({ 
  lines = 3, 
  className = '',
  avatar = false,
  card = false 
}) => {
  const skeletonContent = (
    <div className="animate-pulse">
      {avatar && (
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 bg-gray-200 rounded ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );

  if (card) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        {skeletonContent}
      </div>
    );
  }

  return (
    <div className={className}>
      {skeletonContent}
    </div>
  );
};

// Loading dots animation
export const LoadingDots: React.FC<{ 
  className?: string; 
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}> = ({ 
  className = '', 
  size = 'md',
  color = 'text-current'
}) => {
  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const dotSize = dotSizes[size];

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className={`${dotSize} ${color} bg-current rounded-full animate-bounce`}></div>
      <div className={`${dotSize} ${color} bg-current rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`${dotSize} ${color} bg-current rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
};

// Loading bar for progress
export const LoadingBar: React.FC<{ 
  progress?: number; 
  indeterminate?: boolean;
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ 
  progress = 0, 
  indeterminate = false,
  className = '',
  color = 'bg-blue-500',
  size = 'md'
}) => {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  if (indeterminate) {
    return (
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heights[size]} ${className}`}>
        <div className={`${heights[size]} ${color} rounded-full animate-pulse`} style={{
          width: '30%',
          animation: 'slide 2s infinite'
        }}>
          <style jsx>{`
            @keyframes slide {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(400%); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-gray-200 rounded-full ${heights[size]} ${className}`}>
      <div 
        className={`${heights[size]} ${color} rounded-full transition-all duration-300 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  );
};

// Card loading state
export const LoadingCard: React.FC<{ 
  className?: string;
  height?: string;
}> = ({ 
  className = '', 
  height = 'h-64'
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${height} ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="mt-6 flex justify-between">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

// CV-specific loading spinner
export const CVLoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = 'Creating your professional CV...' 
}) => {
  return (
    <LoadingSpinner
      size="lg"
      variant="gradient"
      message={message}
      overlay={true}
    />
  );
};

export default LoadingSpinner;
