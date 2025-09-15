// ==============================================
// UI COMPONENTS LIBRARY FOR MoCV
// ==============================================
// File: src/components/UI/index.ts
// This is your main export file for all UI components

export { Card, CardHeader, CardContent, CardFooter } from './Card';
export { Button } from './Button';
export { Input } from './Input';
export { TextArea } from './TextArea';
export { Select } from './Select';
export { Badge } from './Badge';
export { Avatar } from './Avatar';
export { Progress } from './Progress';
export { Modal } from './Modal';
export { Tooltip } from './Tooltip';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
export { Alert } from './Alert';
export { Skeleton } from './Skeleton';
export { Dropdown } from './Dropdown';
export { Switch } from './Switch';
export { Checkbox } from './Checkbox';
export { RadioGroup, RadioGroupItem } from './RadioGroup';

// ==============================================
// CARD COMPONENT
// ==============================================
// File: src/components/UI/Card.tsx

import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  size = 'md',
  hover = false,
  onClick
}) => {
  const baseClasses = "rounded-xl border transition-all duration-200";
  
  const variantClasses = {
    default: "bg-white border-gray-200 shadow-sm",
    outline: "bg-transparent border-gray-300",
    ghost: "bg-gray-50 border-transparent",
    elevated: "bg-white border-gray-200 shadow-lg"
  };
  
  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  };
  
  const hoverClasses = hover ? "hover:shadow-md hover:scale-[1.02] cursor-pointer" : "";
  
  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], hoverClasses, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={cn("mb-4 pb-2 border-b border-gray-100", className)}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={cn("", className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={cn("mt-4 pt-2 border-t border-gray-100", className)}>
    {children}
  </div>
);

// ==============================================
// BUTTON COMPONENT
// ==============================================
// File: src/components/UI/Button.tsx

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'default',
  loading = false,
  icon,
  children,
  disabled,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    link: "text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500",
    gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-sm"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 py-1 text-xs",
    lg: "h-12 px-6 py-3 text-base",
    icon: "h-10 w-10"
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

// ==============================================
// INPUT COMPONENT
// ==============================================
// File: src/components/UI/Input.tsx

import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
}

export const Input: React.FC<InputProps> = ({
  className = '',
  label,
  error,
  helperText,
  icon,
  variant = 'default',
  id,
  ...props
}) => {
  const baseClasses = "w-full px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500",
    filled: "border-0 rounded-lg bg-gray-100 focus:ring-blue-500 focus:bg-white",
    outline: "border-2 border-gray-200 rounded-lg bg-transparent focus:ring-blue-500 focus:border-blue-500"
  };
  
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
  
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        <input
          id={id}
          className={cn(baseClasses, variants[variant], errorClasses, icon ? "pl-10" : "", className)}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

// ==============================================
// TEXTAREA COMPONENT
// ==============================================
// File: src/components/UI/TextArea.tsx

import React from 'react';
import { cn } from '../../lib/utils';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outline';
}

export const TextArea: React.FC<TextAreaProps> = ({
  className = '',
  label,
  error,
  helperText,
  variant = 'default',
  id,
  ...props
}) => {
  const baseClasses = "w-full px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed resize-none";
  
  const variants = {
    default: "border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500",
    filled: "border-0 rounded-lg bg-gray-100 focus:ring-blue-500 focus:bg-white",
    outline: "border-2 border-gray-200 rounded-lg bg-transparent focus:ring-blue-500 focus:border-blue-500"
  };
  
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
  
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(baseClasses, variants[variant], errorClasses, className)}
        rows={4}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

// ==============================================
// SELECT COMPONENT
// ==============================================
// File: src/components/UI/Select.tsx

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'filled' | 'outline';
}

export const Select: React.FC<SelectProps> = ({
  className = '',
  label,
  error,
  helperText,
  options,
  placeholder,
  variant = 'default',
  id,
  ...props
}) => {
  const baseClasses = "w-full px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-right pr-10";
  
  const variants = {
    default: "border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500",
    filled: "border-0 rounded-lg bg-gray-100 focus:ring-blue-500 focus:bg-white",
    outline: "border-2 border-gray-200 rounded-lg bg-transparent focus:ring-blue-500 focus:border-blue-500"
  };
  
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
  
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={cn(baseClasses, variants[variant], errorClasses, className)}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

// ==============================================
// BADGE COMPONENT
// ==============================================
// File: src/components/UI/Badge.tsx

import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    outline: "border border-gray-300 text-gray-700"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };
  
  return (
    <span className={cn(baseClasses, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

// ==============================================
// AVATAR COMPONENT
// ==============================================
// File: src/components/UI/Avatar.tsx

import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  };
  
  const baseClasses = "rounded-full bg-gray-100 flex items-center justify-center overflow-hidden";
  
  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={cn(baseClasses, sizeClasses[size], className)}
      />
    );
  }
  
  return (
    <div className={cn(baseClasses, sizeClasses[size], "text-gray-500", className)}>
      {fallback ? (
        <span className="font-medium">{fallback}</span>
      ) : (
        <User className="h-1/2 w-1/2" />
      )}
    </div>
  );
};

// ==============================================
// PROGRESS COMPONENT
// ==============================================
// File: src/components/UI/Progress.tsx

import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className = '',
  variant = 'default',
  size = 'md',
  showLabel = false
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };
  
  const variants = {
    default: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500"
  };
  
  return (
    <div className="space-y-1">
      <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", sizeClasses[size], className)}>
        <div
          className={cn("h-full transition-all duration-300 ease-out rounded-full", variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-600">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

// ==============================================
// MODAL COMPONENT
// ==============================================
// File: src/components/UI/Modal.tsx

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4"
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      <div className={cn("relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto", sizeClasses[size])}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// ==============================================
// UTILS HELPER
// ==============================================
// File: src/lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==============================================
// ADDITIONAL COMPONENTS
// ==============================================

// TOOLTIP
export const Tooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}> = ({ children, content, position = 'top' }) => (
  <div className="relative group">
    {children}
    <div className={cn(
      "absolute z-10 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none",
      position === 'top' && "bottom-full left-1/2 transform -translate-x-1/2 mb-1",
      position === 'bottom' && "top-full left-1/2 transform -translate-x-1/2 mt-1",
      position === 'left' && "right-full top-1/2 transform -translate-y-1/2 mr-1",
      position === 'right' && "left-full top-1/2 transform -translate-y-1/2 ml-1"
    )}>
      {content}
    </div>
  </div>
);

// ALERT
export const Alert: React.FC<{
  variant?: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}> = ({ variant = 'info', children, className = '' }) => {
  const variants = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };
  
  return (
    <div className={cn("p-4 border rounded-lg", variants[variant], className)}>
      {children}
    </div>
  );
};

// SKELETON
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
);

// SWITCH
export const Switch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}> = ({ checked, onChange, disabled = false, className = '' }) => (
  <button
    type="button"
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      checked ? "bg-blue-600" : "bg-gray-200",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
  >
    <span
      className={cn(
        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
        checked ? "translate-x-6" : "translate-x-1"
      )}
    />
  </button>
);

// CHECKBOX
export const Checkbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}> = ({ checked, onChange, label, disabled = false, className = '' }) => (
  <label className={cn("flex items-center space-x-2 cursor-pointer", disabled && "cursor-not-allowed opacity-50", className)}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
);

// TABS
export const Tabs: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}> = ({ value, onValueChange, children, className = '' }) => (
  <div className={className}>
    {React.Children.map(children, child =>
      React.isValidElement(child)
        ? React.cloneElement(child as React.ReactElement, { value, onValueChange })
        : child
    )}
  </div>
);

export const TabsList: React.FC<{
  children: React.ReactNode;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}> = ({ children, className = '', value, onValueChange }) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1", className)}>
    {React.Children.map(children, child =>
      React.isValidElement(child)
        ? React.cloneElement(child as React.ReactElement, { value, onValueChange })
        : child
    )}
  </div>
);

export const TabsTrigger: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
  value?: string;
}> = ({ value: triggerValue, children, className = '', onValueChange, value: selectedValue }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
      selectedValue === triggerValue
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-600 hover:text-gray-900",
      className
    )}
    onClick={() => onValueChange?.(triggerValue)}
  >
    {children}
  </button>
);

export const TabsContent: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
  value?: string;
}> = ({ value: contentValue, children, className = '', value: selectedValue }) => {
  if (selectedValue !== contentValue) return null;
  
  return (
    <div className={cn("mt-2", className)}>
      {children}
    </div>
  );
};

// RADIO GROUP
export const RadioGroup: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}> = ({ value, onValueChange, children, className = '' }) => (
  <div className={className}>
    {React.Children.map(children, child =>
      React.isValidElement(child)
        ? React.cloneElement(child as React.ReactElement, { selectedValue: value, onValueChange })
        : child
    )}
  </div>
);

export const RadioGroupItem: React.FC<{
  value: string;
  label?: string;
  disabled?: boolean;
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}> = ({ value, label, disabled = false, selectedValue, onValueChange }) => (
  <label className={cn("flex items-center space-x-2 cursor-pointer", disabled && "cursor-not-allowed opacity-50")}>
    <input
      type="radio"
      value={value}
      checked={selectedValue === value}
      onChange={() => onValueChange?.(value)}
      disabled={disabled}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
    />
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
);

// DROPDOWN
export const Dropdown: React.FC<{
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ trigger, children, className = '' }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className={cn(
            "absolute z-20 mt-2 py-1 bg-white border border-gray-200 rounded-lg shadow-lg",
            className
          )}>
            {children}
          </div>
        </>
      )}
    </div>
  );
};
