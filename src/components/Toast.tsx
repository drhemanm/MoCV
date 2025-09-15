// src/components/Toast.tsx
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Zap } from 'lucide-react';

export interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  showIcon?: boolean;
  closable?: boolean;
  animate?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  type = 'info',
  message,
  duration = 5000,
  onClose,
  position = 'bottom-right',
  showIcon = true,
  closable = true,
  animate = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-dismiss after duration
    let dismissTimer: NodeJS.Timeout;
    if (duration > 0) {
      dismissTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(enterTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [duration]);

  const handleClose = () => {
    if (animate) {
      setIsExiting(true);
      setTimeout(() => {
        onClose();
      }, 300); // Match animation duration
    } else {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          background: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
          button: 'text-green-500 hover:text-green-700'
        };
      case 'error':
        return {
          background: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          button: 'text-red-500 hover:text-red-700'
        };
      case 'warning':
        return {
          background: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          button: 'text-yellow-500 hover:text-yellow-700'
        };
      case 'info':
      default:
        return {
          background: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          button: 'text-blue-500 hover:text-blue-700'
        };
    }
  };

  const getAnimationClasses = () => {
    if (!animate) return '';
    
    const baseClasses = 'transition-all duration-300 ease-in-out';
    
    if (isExiting) {
      return `${baseClasses} transform translate-x-full opacity-0`;
    }
    
    if (isVisible) {
      return `${baseClasses} transform translate-x-0 opacity-100`;
    }
    
    return `${baseClasses} transform translate-x-full opacity-0`;
  };

  const colors = getColors();

  return (
    <div
      className={`
        max-w-sm w-full ${colors.background} border rounded-lg shadow-lg p-4
        ${getAnimationClasses()}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        {showIcon && (
          <div className={`flex-shrink-0 ${colors.icon} mr-3 mt-0.5`}>
            {getIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${colors.text}`}>
            {message}
          </p>
        </div>
        
        {closable && (
          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 ml-3 inline-flex rounded-md 
              ${colors.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
              transition-colors duration-200
            `}
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Toast Container Component
export interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = 'bottom-right',
  maxToasts = 5
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  // Limit the number of visible toasts
  const visibleToasts = toasts.slice(-maxToasts);

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      <div className="space-y-2">
        {visibleToasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Custom hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>>([]);

  const addToast = (
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info', 
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, type, message, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // Convenience methods
  const success = (message: string, duration?: number) => addToast(message, 'success', duration);
  const error = (message: string, duration?: number) => addToast(message, 'error', duration);
  const warning = (message: string, duration?: number) => addToast(message, 'warning', duration);
  const info = (message: string, duration?: number) => addToast(message, 'info', duration);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  };
};

// Special toast variants for CV app
export const CVToast: React.FC<{
  type: 'cv-created' | 'cv-saved' | 'cv-analyzed' | 'xp-gained';
  message: string;
  onClose: () => void;
  xpGain?: number;
}> = ({ type, message, onClose, xpGain }) => {
  const getSpecialIcon = () => {
    switch (type) {
      case 'cv-created':
        return <CheckCircle className="h-5 w-5" />;
      case 'cv-saved':
        return <CheckCircle className="h-5 w-5" />;
      case 'cv-analyzed':
        return <Info className="h-5 w-5" />;
      case 'xp-gained':
        return <Zap className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getSpecialColors = () => {
    switch (type) {
      case 'cv-created':
        return {
          background: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600'
        };
      case 'xp-gained':
        return {
          background: 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200',
          text: 'text-purple-800',
          icon: 'text-purple-600'
        };
      default:
        return {
          background: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600'
        };
    }
  };

  const colors = getSpecialColors();

  return (
    <div
      className={`
        max-w-sm w-full ${colors.background} border rounded-lg shadow-lg p-4
        transform transition-all duration-300 ease-in-out
      `}
      role="alert"
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${colors.icon} mr-3 mt-0.5`}>
          {getSpecialIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${colors.text}`}>
            {message}
          </p>
          {type === 'xp-gained' && xpGain && (
            <p className={`text-xs ${colors.text} opacity-75 mt-1`}>
              +{xpGain} XP earned!
            </p>
          )}
        </div>
        
        <button
          onClick={onClose}
          className={`
            flex-shrink-0 ml-3 inline-flex rounded-md 
            ${colors.text} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
            transition-opacity duration-200
          `}
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
