// src/components/BackButton.tsx
import React from 'react';
import { ArrowLeft, ChevronLeft, Home, X } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  variant?: 'default' | 'minimal' | 'icon' | 'pill' | 'ghost' | 'close';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  icon?: 'arrow' | 'chevron' | 'home' | 'close';
  showIcon?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = 'Back',
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  icon = 'arrow',
  showIcon = true
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'chevron':
        return <ChevronLeft className="h-4 w-4" />;
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'close':
        return <X className="h-4 w-4" />;
      case 'arrow':
      default:
        return <ArrowLeft className="h-4 w-4" />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'md':
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'minimal':
        return `${baseClasses} text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-500`;
      
      case 'icon':
        return `${baseClasses} p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-500`;
      
      case 'pill':
        return `${baseClasses} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-blue-500 shadow-sm`;
      
      case 'ghost':
        return `${baseClasses} text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-gray-500`;
      
      case 'close':
        return `${baseClasses} p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-500 rounded-full`;
      
      case 'default':
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500`;
    }
  };

  const getDisabledClasses = () => {
    if (disabled) {
      return 'opacity-50 cursor-not-allowed pointer-events-none';
    }
    return 'cursor-pointer';
  };

  // Icon-only variant
  if (variant === 'icon' || variant === 'close') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${getVariantClasses()} ${getDisabledClasses()} ${className}`}
        aria-label={label}
        title={label}
      >
        {getIcon()}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${getVariantClasses()} ${getSizeClasses()} ${getDisabledClasses()} ${className}`}
      aria-label={label}
    >
      {showIcon && getIcon()}
      {label}
    </button>
  );
};

// Breadcrumb navigation component
interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  separator = <ChevronLeft className="h-4 w-4 text-gray-400 rotate-180" />
}) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="flex items-center">{separator}</span>
          )}
          
          {item.active ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </button>
          ) : item.href ? (
            <a
              href={item.href}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-gray-600">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Navigation header with back button and title
interface NavigationHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  className?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  subtitle,
  onBack,
  backLabel = 'Back',
  className = '',
  actions,
  breadcrumbs
}) => {
  return (
    <div className={`border-b border-gray-200 bg-white ${className}`}>
      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <BackButton
                onClick={onBack}
                label={backLabel}
                variant="minimal"
                size="sm"
              />
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Floating back button for overlay situations
export const FloatingBackButton: React.FC<{
  onClick: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({
  onClick,
  position = 'top-left',
  className = ''
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'top-left':
      default:
        return 'top-4 left-4';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed z-50 ${getPositionClasses()}
        w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200
        flex items-center justify-center
        text-gray-600 hover:text-gray-900 hover:bg-gray-50
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
};

// Progress indicator with back navigation
interface ProgressBackButtonProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  stepNames?: string[];
  className?: string;
}

export const ProgressBackButton: React.FC<ProgressBackButtonProps> = ({
  currentStep,
  totalSteps,
  onBack,
  stepNames = [],
  className = ''
}) => {
  const progress = (currentStep / totalSteps) * 100;
  const currentStepName = stepNames[currentStep - 1];

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <BackButton
            onClick={onBack}
            variant="minimal"
            size="sm"
          />
          
          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
            {currentStepName && ` • ${currentStepName}`}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BackButton;
