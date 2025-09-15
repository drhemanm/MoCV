import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  icon,
  variant = 'default',
  inputSize = 'md',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = "w-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: "border border-gray-300 bg-white focus:border-blue-500",
    filled: "border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500",
    outline: "border-2 border-gray-300 bg-transparent focus:border-blue-500"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-sm rounded-lg",
    lg: "h-12 px-4 text-base rounded-lg"
  };

  const errorClass = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";
  const iconPadding = icon ? "pl-10" : "";

  const combinedClasses = [
    baseClasses,
    variants[variant],
    sizes[inputSize],
    errorClass,
    iconPadding,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-4 w-4 text-gray-400">
              {icon}
            </div>
          </div>
        )}
        
        <input
          id={inputId}
          className={combinedClasses}
          {...props}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default Input;
