import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
