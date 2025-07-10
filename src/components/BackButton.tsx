import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  variant?: 'default' | 'minimal' | 'floating';
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  label = 'Back', 
  variant = 'default',
  className = '' 
}) => {
  const baseClasses = "inline-flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg";
  
  const variants = {
    default: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 font-medium",
    minimal: "text-gray-500 hover:text-gray-700 p-2",
    floating: "bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 shadow-md border border-gray-200 hover:shadow-lg transform hover:scale-105"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <ArrowLeft className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm">{label}</span>
    </button>
  );
};

export default BackButton;