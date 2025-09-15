// src/components/Layout/index.ts
export { default as Footer } from './Footer';
export { default as BackButton, Breadcrumb, NavigationHeader, FloatingBackButton, ProgressBackButton } from '../BackButton';

// Header component for consistency
// src/components/Layout/Header.tsx
import React from 'react';
import { Bell, User, Settings, LogOut, Menu, X } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
  showMobileMenu?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  notifications?: number;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  showMobileMenu = false,
  user,
  notifications = 0,
  className = ''
}) => {
  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-40 ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}

            {/* Logo */}
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MoCV.mu</span>
            </div>
          </div>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Home
            </a>
            <a href="#templates" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Templates
            </a>
            <a href="#my-cvs" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              My CVs
            </a>
            <a href="#help" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Help
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  
                  <a href="#profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="h-4 w-4" />
                    Profile
                  </a>
                  
                  <a href="#settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="h-4 w-4" />
                    Settings
                  </a>
                  
                  <hr className="my-1" />
                  
                  <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Sign In
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && onMenuToggle && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <a href="#home" className="py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Home
              </a>
              <a href="#templates" className="py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Templates
              </a>
              <a href="#my-cvs" className="py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium">
                My CVs
              </a>
              <a href="#help" className="py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Help
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Layout wrapper component
interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  showFooter?: boolean;
  showHeader?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  header,
  footer,
  className = '',
  showFooter = true,
  showHeader = true
}) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {showHeader && header}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && footer}
    </div>
  );
};

export default Layout;
