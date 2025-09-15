import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { CVTemplate, CVAnalysis, GameData, TargetMarket } from './types';
import { fetchCVTemplates } from './services/templateService';
import gamificationService from './services/gamificationService';

// Import components (keeping your existing ones)
import FlowStartScreen from './components/FlowStartScreen';
import TemplateGallery from './components/TemplateGallery';
import CVBuilder from './components/CVBuilder';
import CVAnalyzer from './components/CVAnalyzer';
import CVImprover from './components/CVImprover';
import JobDescriptionAnalyzer from './components/JobDescriptionAnalyzer';
import InterviewPrep from './components/InterviewPrep';
import MyCVsDashboard from './components/MyCVsDashboard';
import TargetMarketSelector from './components/TargetMarketSelector';
import AIAssistant from './components/AIAssistant';
import TemplatePreview from './components/TemplatePreview';
import ChatAssistant from './components/ChatAssistant';
import Footer from './components/Layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';
import XPNotification from './components/XPNotification';

// Simplified step types - focus on core flows
type AppStep = 'start' | 'my-cvs' | 'templates' | 'cv-builder' | 'analyzer' | 'improver' | 
              'job-analyzer' | 'interview-prep' | 'target-market';

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
  // Simplified core state
  const [currentStep, setCurrentStep] = useState<AppStep>('start');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Template and data state
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<TargetMarket | null>(null);
  
  // Analysis state
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [analyzedCVText, setAnalyzedCVText] = useState<string>('');
  
  // UI state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [gameData, setGameData] = useState<GameData>(gamificationService.getGameData());
  const [xpNotification, setXpNotification] = useState<any>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  // Error handling
  const handleError = useCallback((error: unknown, context: string) => {
    console.error(`Error in ${context}:`, error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    setError(message);
    addToast(`Error: ${message}`, 'error');
  }, [addToast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load templates when needed
  useEffect(() => {
    const loadTemplates = async () => {
      if (currentStep !== 'templates' || templates.length > 0) return;
      
      setIsLoading(true);
      clearError();
      
      try {
        const fetchedTemplates = await fetchCVTemplates();
        setTemplates(fetchedTemplates);
        addToast('Templates loaded successfully', 'success');
      } catch (error) {
        handleError(error, 'loading templates');
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

  // SIMPLIFIED NAVIGATION - Core flows only
  const navigateToStep = useCallback((step: AppStep) => {
    setCurrentStep(step);
    clearError();
  }, [clearError]);

  const navigateBack = useCallback(() => {
    // Simple back navigation
    const backMap: Record<AppStep, AppStep> = {
      'my-cvs': 'start',
      'templates': 'start',
      'cv-builder': 'templates',
      'analyzer': 'start',
      'improver': 'analyzer',
      'job-analyzer': 'target-market',
      'interview-prep': 'target-market',
      'target-market': 'start'
    };
    
    const previousStep = backMap[currentStep] || 'start';
    navigateToStep(previousStep);
  }, [currentStep, navigateToStep]);

  // CORE HANDLERS - Streamlined
  
  // 1. CREATE NEW CV FLOW (Simplified - no market selector interruption)
  const handleCreateNew = useCallback(() => {
    console.log('Create New CV clicked - navigating to templates');
    navigateToStep('templates');
  }, [navigateToStep]);

  const handleTemplateSelect = useCallback((template: CVTemplate) => {
    console.log('Template selected:', template.name);
    setSelectedTemplate(template);
    
    // Award XP for template selection
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
      console.error('Gamification error:', error);
    }
    
    // Store template data
    localStorage.setItem('mocv_selected_template', template.id);
    localStorage.setItem('mocv_selected_template_data', JSON.stringify(template));
    
    // DIRECT navigation to CV builder - no market selector interruption
    navigateToStep('cv-builder');
    addToast(`Template "${template.name}" selected`, 'success');
  }, [navigateToStep, addToast]);

  // 2. OTHER FLOWS (Keep existing logic but add market selector step)
  const handleImproveCV = useCallback(() => {
    navigateToStep('target-market');
    // Store intended next step
    sessionStorage.setItem('mocv_pending_flow', 'analyzer');
  }, [navigateToStep]);

  const handleAnalyzeVsJob = useCallback(() => {
    navigateToStep('target-market');
    sessionStorage.setItem('mocv_pending_flow', 'job-analyzer');
  }, [navigateToStep]);

  const handleInterviewPrep = useCallback(() => {
    navigateToStep('target-market');
    sessionStorage.setItem('mocv_pending_flow', 'interview-prep');
  }, [navigateToStep]);

  const handleMyCVs = useCallback(() => {
    navigateToStep('my-cvs');
  }, [navigateToStep]);

  // Market selection handler
  const handleMarketSelect = useCallback((market: TargetMarket) => {
    setSelectedMarket(market);
    
    // Get intended flow from session storage
    const pendingFlow = sessionStorage.getItem('mocv_pending_flow');
    const flowMap: Record<string, AppStep> = {
      'analyzer': 'analyzer',
      'job-analyzer': 'job-analyzer',
      'interview-prep': 'interview-prep'
    };
    
    const nextStep = pendingFlow && flowMap[pendingFlow] ? flowMap[pendingFlow] : 'start';
    navigateToStep(nextStep);
    
    // Clear pending flow
    sessionStorage.removeItem('mocv_pending_flow');
    addToast(`Target market selected: ${market.name}`, 'success');
  }, [navigateToStep, addToast]);

  // Analysis completion handler
  const handleAnalysisComplete = useCallback((analysis: CVAnalysis, cvText: string, jobDesc?: string) => {
    try {
      setCvAnalysis(analysis);
      setAnalyzedCVText(cvText);
      navigateToStep('improver');
      addToast('Analysis completed successfully', 'success');
    } catch (error) {
      handleError(error, 'analysis completion');
    }
  }, [navigateToStep, addToast, handleError]);

  // CV editing handler
  const handleEditCV = useCallback((cv: any) => {
    try {
      localStorage.setItem('mocv_editing_cv', JSON.stringify({
        cvData: cv.cvData,
        cvId: cv.id,
        isEditing: true
      }));
      navigateToStep('cv-builder');
      addToast('CV loaded for editing', 'info');
    } catch (error) {
      handleError(error, 'CV editing');
    }
  }, [navigateToStep, addToast, handleError]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        {/* Simplified Header */}
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
                <span className="text-xl font-bold text-gray-900">MoCV.mu</span>
              </button>
              
              <div className="flex items-center gap-3">
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

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div>
                <p className="text-red-800">{error}</p>
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

        {/* SIMPLIFIED MAIN CONTENT */}
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
            <TemplateGallery
              targetMarket={selectedMarket}
              templates={templates}
              isLoading={isLoading}
              onTemplateSelect={handleTemplateSelect}
              onTemplatePreview={setPreviewTemplate}
              onBack={navigateBack}
            />
          )}
          
          {currentStep === 'cv-builder' && (
            <CVBuilder
              targetMarket={selectedMarket}
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

          {currentStep === 'target-market' && (
            <TargetMarketSelector
              selectedFlow={sessionStorage.getItem('mocv_pending_flow') as any}
              onMarketSelect={handleMarketSelect}
              onBack={navigateBack}
            />
          )}

          {currentStep === 'analyzer' && (
            <CVAnalyzer
              targetMarket={selectedMarket}
              onAnalysisComplete={handleAnalysisComplete}
              onCreateNew={handleCreateNew}
              onBack={navigateBack}
            />
          )}

          {currentStep === 'job-analyzer' && (
            <JobDescriptionAnalyzer
              targetMarket={selectedMarket}
              onAnalysisComplete={handleAnalysisComplete}
              onBack={navigateBack}
            />
          )}

          {currentStep === 'interview-prep' && (
            <InterviewPrep
              targetMarket={selectedMarket}
              onBack={navigateBack}
            />
          )}

          {currentStep === 'improver' && cvAnalysis && (
            <CVImprover
              targetMarket={selectedMarket}
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

        {/* Chat Assistant */}
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
      </div>
    </ErrorBoundary>
  );
};

export default App;
