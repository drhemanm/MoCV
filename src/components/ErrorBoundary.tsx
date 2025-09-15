// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: ''
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you'd send this to an error reporting service like Sentry
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.log('Error report that would be sent to service:', errorReport);
    
    // Example: Sentry.captureException(error, { extra: errorReport });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: ''
      });
    } else {
      // Too many retries, suggest page reload
      this.handleReload();
    }
  };

  private handleReportError = () => {
    const subject = encodeURIComponent(`Bug Report: ${this.state.error?.message || 'Unknown Error'}`);
    const body = encodeURIComponent(
      `Error ID: ${this.state.errorId}\n` +
      `Timestamp: ${new Date().toISOString()}\n` +
      `Error: ${this.state.error?.message || 'Unknown'}\n` +
      `Stack: ${this.state.error?.stack || 'Not available'}\n` +
      `Component Stack: ${this.state.errorInfo?.componentStack || 'Not available'}\n` +
      `URL: ${window.location.href}\n` +
      `User Agent: ${navigator.userAgent}\n\n` +
      `Steps to reproduce:\n1. \n2. \n3. \n\n` +
      `Additional details:\n`
    );
    
    window.open(`mailto:support@mocv.mu?subject=${subject}&body=${body}`);
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.retryCount < this.maxRetries;

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              {/* Error Icon */}
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              
              {/* Error Message */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h1>
              
              <p className="text-gray-600 mb-2">
                We're sorry for the inconvenience. An unexpected error occurred while loading the application.
              </p>

              {this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-left">
                  <p className="text-red-800 font-medium text-sm">
                    Error: {this.state.error.message}
                  </p>
                  <p className="text-red-600 text-xs mt-1">
                    Error ID: {this.state.errorId}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                {canRetry ? (
                  <button
                    onClick={this.handleRetry}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Try Again ({this.maxRetries - this.retryCount} attempts left)
                  </button>
                ) : (
                  <button
                    onClick={this.handleReload}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Reload Page
                  </button>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={this.handleGoHome}
                    className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Go Home
                  </button>
                  
                  <button
                    onClick={this.handleReload}
                    className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reload
                  </button>

                  <button
                    onClick={this.handleReportError}
                    className="border border-blue-300 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Bug className="h-4 w-4" />
                    Report Bug
                  </button>
                </div>
              </div>

              {/* Help Text */}
              <div className="text-sm text-gray-500 mb-6">
                <p>If this problem persists, please:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Clear your browser cache and cookies</li>
                  <li>Try using a different browser</li>
                  <li>Contact our support team with the error ID above</li>
                </ul>
              </div>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-gray-50 rounded-lg p-4 mt-6">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2 hover:text-gray-900">
                    🔧 Development Error Details
                  </summary>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-red-600">Error Message:</strong>
                      <pre className="text-sm text-gray-600 mt-1 whitespace-pre-wrap bg-white p-2 rounded border">
                        {this.state.error.message}
                      </pre>
                    </div>
                    
                    {this.state.error.stack && (
                      <div>
                        <strong className="text-red-600">Stack Trace:</strong>
                        <pre className="text-xs text-gray-500 mt-1 whitespace-pre-wrap overflow-auto max-h-40 bg-white p-2 rounded border">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {this.state.errorInfo && (
                      <div>
                        <strong className="text-red-600">Component Stack:</strong>
                        <pre className="text-xs text-gray-500 mt-1 whitespace-pre-wrap overflow-auto max-h-40 bg-white p-2 rounded border">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}

                    <div>
                      <strong className="text-red-600">Debug Info:</strong>
                      <pre className="text-xs text-gray-500 mt-1 whitespace-pre-wrap bg-white p-2 rounded border">
                        Error ID: {this.state.errorId}{'\n'}
                        Timestamp: {new Date().toISOString()}{'\n'}
                        Retry Count: {this.retryCount}/{this.maxRetries}{'\n'}
                        User Agent: {navigator.userAgent}
                      </pre>
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
