import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { CVTemplate, CVAnalysis, GameData } from './types';
import { fetchCVTemplates } from './services/templateService';
import gamificationService from './services/gamificationService';

// Import the new configuration system
import { config } from './config/environment';

// Import components (keeping your existing ones)
import FlowStartScreen from './components/FlowStartScreen';
import ProfessionalTemplateGallery from './components/TemplateGallery'; // Updated import
import CVBuilder from './components/CVBuilder';
import CVAnalyzer from './components/CVAnalyzer';
import CVImprover from './components/CVImprover';
import JobDescriptionAnalyzer from './components/JobDescriptionAnalyzer';
import InterviewPrep from './components/InterviewPrep';
import MyCVsDashboard from './components/MyCVsDashboard';
import AIAssistant from './components/AIAssistant';
import TemplatePreview from './components/TemplatePreview';
import ChatAssistant from './components/ChatAssistant';
import Footer from './components/Layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';
import XPNotification from './components/XPNotification';

// Clean step types - no market selector
type AppStep = 'start' | 'my-cvs' | 'templates' | 'cv-builder' | 'analyzer' | 'improver' | 
              'job-analyzer' | 'interview-prep';

// Enhanced CVData interface
interface CVData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: number;
    category: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const App: React.FC = () => {
  // Clean core state
  const [currentStep, setCurrentStep] = useState<AppStep>('start');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Template and data state
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);
  
  // Analysis state (for improvement features only)
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [analyzedCVText, setAnalyzedCVText] = useState<string>('');
  
  // UI state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [gameData, setGameData] = useState<GameData>(gamificationService.getGameData());
  const [xpNotification, setXpNotification] = useState<any>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize configuration and log startup info
  useEffect(() => {
    // Log configuration on startup
    config.logConfiguration();
    
    // Add startup toast based on configuration
    if (config.isAIEnabled) {
      addToast('AI features are enabled and ready to use!', 'success', 3000);
    } else {
      addToast('Running in basic mode. Add OpenAI API key for AI features.', 'info', 5000);
    }

    // Log environment info for development
    if (config.isDevelopment) {
      console.group('🚀 MoCV Application Startup');
      console.log('Environment:', config.app.environment);
      console.log('Version:', config.app.version);
      console.log('AI Features:', config.isAIEnabled ? '✅ Enabled' : '❌ Disabled');
      console.log('Firebase:', config.isFirebaseEnabled ? '✅ Enabled' : '❌ Disabled');
      console.log('Debug Mode:', config.app.debugMode ? '✅ On' : '❌ Off');
      console.groupEnd();
    }
  }, []);

  // Toast management
  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: ToastMessage = { id, message, type, duration };
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Enhanced error handling with configuration awareness
  const handleError = useCallback((error: unknown, context: string) => {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    // Enhanced logging in development
    if (config.isDevelopment) {
      console.group(`❌ Error in ${context}`);
      console.error('Error details:', error);
      console.trace('Stack trace');
      console.groupEnd();
    } else {
      // Simple logging in production
      console.error(`Error in ${context}:`, errorMessage);
    }
    
    setError(errorMessage);
    addToast(`Error: ${errorMessage}`, 'error');

    // In development, you might want to break or show more details
    if (config.isDevelopment && config.app.debugMode) {
      // Could add additional debugging features here
    }
  }, [addToast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load templates when needed with enhanced error handling
  useEffect(() => {
    const loadTemplates = async () => {
      if (currentStep !== 'templates' || templates.length > 0) return;
      
      setIsLoading(true);
      clearError();
      
      try {
        const fetchedTemplates = await fetchCVTemplates();
        setTemplates(fetchedTemplates);
        addToast('Templates loaded successfully', 'success');
        
        // Development logging
        if (config.isDevelopment) {
          console.log(`📁 Loaded ${fetchedTemplates.length} templates`);
        }
      } catch (error) {
        handleError(error, 'loading templates');
        
        // Provide fallback in case of template loading failure
        if (config.isDevelopment) {
          addToast('Using fallback templates due to loading error', 'warning');
          // You could set some default templates here
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [currentStep, templates.length, handleError, addToast, clearError]);

  // Subscribe to gamification service
  useEffect(() => {
    const unsubscribe = gamificationService.subscribe(setGameData);
    return unsubscribe;
  }, []);

  // CLEAN NAVIGATION with enhanced logging
  const navigateToStep = useCallback((step: AppStep) => {
    if (config.isDevelopment) {
      console.log(`🧭 Navigation: ${currentStep} → ${step}`);
    }
    
    setCurrentStep(step);
    clearError();
  }, [currentStep, clearError]);

  const navigateBack = useCallback(() => {
    const backMap: Record<AppStep, AppStep> = {
      'my-cvs': 'start',
      'templates': 'start',
      'cv-builder': 'templates',
      'analyzer': 'start',
      'improver': 'analyzer',
      'job-analyzer': 'start',
      'interview-prep': 'start'
    };
    
    const previousStep = backMap[currentStep] || 'start';
    navigateToStep(previousStep);
  }, [currentStep, navigateToStep]);

  // PRIMARY HANDLERS with AI awareness
  
  // 1. CREATE NEW CV FLOW
  const handleCreateNew = useCallback(() => {
    console.log('Create New CV clicked - navigating to templates');
    navigateToStep('templates');
  }, [navigateToStep]);

  const handleTemplateSelect = useCallback((template: CVTemplate) => {
    console.log('Template selected:', template.name);
    setSelectedTemplate(template);
    
    // Award XP for template selection with error handling
    try {
      const result = gamificationService.trackTemplateSelection();
      if (result.levelUp || result.achievements) {
        setXpNotification({
          xpGain: 15,
          reason: 'Template selected',
          levelUp: result.levelUp,
          newLevel: result.newLevel,
          achievements: result.achievements
        });
      }
    } catch (error) {
      if (config.isDevelopment) {
        console.error('Gamification error:', error);
      }
      // Don't break the flow for gamification errors
    }
    
    // Store template data with error handling
    try {
      localStorage.setItem('mocv_selected_template', template.id);
      localStorage.setItem('mocv_selected_template_data', JSON.stringify(template));
    } catch (error) {
      console.warn('Failed to save template to localStorage:', error);
      addToast('Template selection may not persist across refreshes', 'warning');
    }
    
    // DIRECT navigation to CV builder
    navigateToStep('cv-builder');
    addToast(`Template "${template.name}" selected`, 'success');
    
    // Show AI availability info
    if (!config.isAIEnabled) {
      addToast('Add OpenAI API key in .env for AI enhancement features', 'info', 7000);
    }
  }, [navigateToStep, addToast]);

  // 2. OTHER FLOWS with AI awareness
  const handleImproveCV = useCallback(() => {
    if (!config.isAIEnabled) {
      addToast('AI analysis is limited without OpenAI API key. Basic analysis available.', 'warning');
    }
    navigateToStep('analyzer');
  }, [navigateToStep, addToast]);

  const handleAnalyzeVsJob = useCallback(() => {
    if (!config.isAIEnabled) {
      addToast('AI job matching is limited without OpenAI API key. Basic analysis available.', 'warning');
    }
    navigateToStep('job-analyzer');
  }, [navigateToStep, addToast]);

  const handleInterviewPrep = useCallback(() => {
    if (!config.isAIEnabled) {
      addToast('AI interview prep is limited without OpenAI API key. Basic questions available.', 'warning');
    }
    navigateToStep('interview-prep');
  }, [navigateToStep, addToast]);

  const handleMyCVs = useCallback(() => {
    navigateToStep('my-cvs');
  }, [navigateToStep]);

  // Analysis completion handler with enhanced error handling
  const handleAnalysisComplete = useCallback((analysis: CVAnalysis, cvText: string) => {
    try {
      setCvAnalysis(analysis);
      setAnalyzedCVText(cvText);
      navigateToStep('improver');
      addToast('Analysis completed successfully', 'success');
      
      if (config.isDevelopment) {
        console.log('📊 Analysis completed:', analysis);
      }
    } catch (error) {
      handleError(error, 'analysis completion');
    }
  }, [navigateToStep, addToast, handleError]);

  // CV editing handler with enhanced error handling
  const handleEditCV = useCallback((cv: any) => {
    try {
      const editingData = {
        cvData: cv.cvData,
        cvId: cv.id,
        isEditing: true
      };
      
      localStorage.setItem('mocv_editing_cv', JSON.stringify(editingData));
      navigateToStep('cv-builder');
      addToast('CV loaded for editing', 'info');
      
      if (config.isDevelopment) {
        console.log('📝 CV loaded for editing:', cv.id);
      }
    } catch (error) {
      handleError(error, 'CV editing');
    }
  }, [navigateToStep, addToast, handleError]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        {/* Clean Header with version info in development */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigateToStep('start')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">MoCV.mu</span>
                  {config.isDevelopment && (
                    <span className="text-xs text-gray-500">v{config.app.version} - {config.app.environment}</span>
                  )}
                </div>
              </button>
              
              <div className="flex items-center gap-3">
                {/* AI Status Indicator */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${config.isAIEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-600">
                    AI {config.isAIEnabled ? 'On' : 'Off'}
                  </span>
                </div>
                
                <button
                  onClick={() => navigateToStep('start')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={handleMyCVs}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  My CVs
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Loading Overlay */}
        {isLoading && <LoadingSpinner />}

        {/* Enhanced Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div className="flex-1">
                <p className="text-red-800">{error}</p>
                {config.isDevelopment && (
                  <p className="text-red-600 text-sm mt-1">
                    Check the console for more details (Development Mode)
                  </p>
                )}
                <button 
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800 text-sm underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CLEAN MAIN CONTENT - Enhanced with config awareness */}
        <main className="flex-1">
          {currentStep === 'start' && (
            <FlowStartScreen
              gameData={gameData}
              onImproveCV={handleImproveCV}
              onCreateNew={handleCreateNew}
              onAnalyzeVsJob={handleAnalyzeVsJob}
              onInterviewPrep={handleInterviewPrep}
              onMyCVs={handleMyCVs}
            />
          )}
          
          {currentStep === 'templates' && (
            <ProfessionalTemplateGallery
              onTemplateSelect={handleTemplateSelect}
              onBack={navigateBack}
            />
          )}
          
          {currentStep === 'cv-builder' && selectedTemplate && (
            <CVBuilder
              selectedTemplate={selectedTemplate}
              onBack={navigateBack}
              onChangeTemplate={() => navigateToStep('templates')}
            />
          )}
          
          {currentStep === 'my-cvs' && (
            <MyCVsDashboard
              onBack={navigateBack}
              onEditCV={handleEditCV}
              onCreateNew={handleCreateNew}
            />
          )}

          {currentStep === 'analyzer' && (
            <CVAnalyzer
              onAnalysisComplete={handleAnalysisComplete}
              onCreateNew={handleCreateNew}
              onBack={navigateBack}
            />
          )}

          {currentStep === 'job-analyzer' && (
            <JobDescriptionAnalyzer
              onAnalysisComplete={handleAnalysisComplete}
              onBack={navigateBack}
            />
          )}

          {currentStep === 'interview-prep' && (
            <InterviewPrep
              onBack={navigateBack}
            />
          )}

          {currentStep === 'improver' && cvAnalysis && (
            <CVImprover
              analysis={cvAnalysis}
              originalCV={analyzedCVText}
              onBack={navigateBack}
              onCreateNew={handleCreateNew}
            />
          )}

          {/* Template Preview Modal */}
          {previewTemplate && (
            <TemplatePreview
              templateName={previewTemplate.name}
              markdownUrl={previewTemplate.markdownUrl}
              onClose={() => setPreviewTemplate(null)}
              onUseTemplate={() => {
                handleTemplateSelect(previewTemplate);
                setPreviewTemplate(null);
              }}
            />
          )}
        </main>

        <Footer />

        {/* Chat Assistant with AI awareness */}
        <ChatAssistant 
          isOpen={isChatOpen} 
          onToggle={() => setIsChatOpen(!isChatOpen)}
        />
        
        {/* XP Notification */}
        {xpNotification && (
          <XPNotification
            xpGain={xpNotification.xpGain}
            reason={xpNotification.reason}
            levelUp={xpNotification.levelUp}
            newLevel={xpNotification.newLevel}
            achievements={xpNotification.achievements}
            onClose={() => setXpNotification(null)}
          />
        )}

        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>

        {/* Development Tools Panel (only in development) */}
        {config.isDevelopment && config.app.debugMode && (
          <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-3 rounded-lg text-xs z-50">
            <div className="font-bold mb-1">🛠️ Dev Tools</div>
            <div>Step: {currentStep}</div>
            <div>AI: {config.isAIEnabled ? '✅' : '❌'}</div>
            <div>Templates: {templates.length}</div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
