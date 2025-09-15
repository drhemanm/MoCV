import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sparkles, Download, Eye, ArrowRight, Zap, FileText, Users, Trophy, Star, ChevronRight, Bot, User, Wand2, Loader2, AlertCircle } from 'lucide-react';
import { CVTemplate, CVAnalysis, GameData, TargetMarket } from './types';
import { fetchCVTemplates } from './services/templateService';
import gamificationService from './services/gamificationService';
import XPNotification from './components/XPNotification';
import TemplatePreview from './components/TemplatePreview';
import TemplateGallery from './components/TemplateGallery';
import AIAssistant from './components/AIAssistant';
import CVAnalyzer from './components/CVAnalyzer';
import CVImprover from './components/CVImprover';
import FlowStartScreen from './components/FlowStartScreen';
import JobDescriptionAnalyzer from './components/JobDescriptionAnalyzer';
import InterviewPrep from './components/InterviewPrep';
import MyCVsDashboard from './components/MyCVsDashboard';
import TargetMarketSelector from './components/TargetMarketSelector';
import CVBuilder from './components/CVBuilder';
import ChatAssistant from './components/ChatAssistant';
import Footer from './components/Layout/Footer';
import BackButton from './components/BackButton';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';

// Enhanced CVData interface with validation
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

// Application steps type
type AppStep = 'start' | 'my-cvs' | 'market-selector' | 'analyzer' | 'improver' | 
              'job-analyzer' | 'interview-prep' | 'templates' | 'preview' | 
              'fill-method' | 'ai-assistant' | 'form' | 'final' | 'cv-builder';

// Flow types
type FlowType = 'analyze' | 'create' | 'job-match' | 'interview' | null;

// Notification types
interface NotificationData {
  xpGain: number;
  reason: string;
  levelUp?: boolean;
  newLevel?: number;
  achievements?: string[];
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const App: React.FC = () => {
  // Core application state
  const [currentStep, setCurrentStep] = useState<AppStep>('start');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Template and market state
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<TargetMarket | null>(null);
  
  // Flow management
  const [fillMethod, setFillMethod] = useState<'manual' | 'ai' | null>(null);
  const [pendingFlow, setPendingFlow] = useState<FlowType>(null);
  
  // Analysis and CV data
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [analyzedCVText, setAnalyzedCVText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });
  
  // UI state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [gameData, setGameData] = useState<GameData>(gamificationService.getGameData());
  const [xpNotification, setXpNotification] = useState<NotificationData | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Memoized values
  const isFlowInProgress = useMemo(() => pendingFlow !== null, [pendingFlow]);
  const canNavigateBack = useMemo(() => currentStep !== 'start', [currentStep]);

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

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Subscribe to gamification service
  useEffect(() => {
    const unsubscribe = gamificationService.subscribe(setGameData);
    return unsubscribe;
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

  // Navigation helpers
  const navigateToStep = useCallback((step: AppStep, flow?: FlowType) => {
    setCurrentStep(step);
    if (flow !== undefined) {
      setPendingFlow(flow);
    }
    clearError();
  }, [clearError]);

  const navigateBack = useCallback(() => {
    const stepHistory: Partial<Record<AppStep, AppStep>> = {
      'my-cvs': 'start',
      'market-selector': 'start',
      'analyzer': 'market-selector',
      'improver': 'analyzer',
      'job-analyzer': 'market-selector',
      'interview-prep': 'market-selector',
      'templates': 'market-selector',
      'cv-builder': 'templates',
      'fill-method': 'templates',
      'ai-assistant': 'fill-method',
      'form': fillMethod === 'ai' ? 'ai-assistant' : 'fill-method',
      'final': 'form'
    };
    
    const previousStep = stepHistory[currentStep] || 'start';
    navigateToStep(previousStep);
  }, [currentStep, fillMethod, navigateToStep]);

  // XP and gamification handlers
  const awardXP = useCallback((xpGain: number, reason: string, additionalData?: Partial<NotificationData>) => {
    const result = gamificationService.awardXP(xpGain);
    setXpNotification({
      xpGain,
      reason,
      levelUp: result.levelUp,
      newLevel: result.newLevel,
      achievements: result.achievements,
      ...additionalData
    });
  }, []);

  // Template selection handler
  const handleTemplateSelect = useCallback((template: CVTemplate) => {
    try {
      // Award XP for template selection
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
      
      console.log('Template selected in App:', template.name);
      setSelectedTemplate(template);
      
      // Store template data
      const templateInfo = {
        templateId: template.id,
        templateName: template.name,
        templateDescription: template.description,
        templateCategory: template.category,
        markdownUrl: template.markdownUrl,
        templateData: template
      };
      
      localStorage.setItem('mocv_selected_template', template.id);
      localStorage.setItem('mocv_selected_template_data', JSON.stringify(template));
      localStorage.setItem('mocv_selected_template_content', JSON.stringify(templateInfo));
      
      console.log('Template data stored:', templateInfo);
      setPendingFlow('create');
      navigateToStep('market-selector', 'create');
      addToast(`Template "${template.name}" selected`, 'success');
    } catch (error) {
      handleError(error, 'template selection');
    }
  }, [navigateToStep, addToast, handleError]);

  // Fill method selection handler
  const handleFillMethodSelect = useCallback((method: 'manual' | 'ai') => {
    setFillMethod(method);
    navigateToStep(method === 'ai' ? 'ai-assistant' : 'form');
    addToast(`${method === 'ai' ? 'AI-assisted' : 'Manual'} mode selected`, 'info');
  }, [navigateToStep, addToast]);

  // AI completion handler
  const handleAIComplete = useCallback((generatedData: Partial<CVData>) => {
    try {
      // Award XP for completing AI assistant
      const result = gamificationService.trackProfileCompletion();
      if (result.levelUp || result.achievements) {
        setXpNotification({
          xpGain: 30,
          reason: 'Profile completed with AI',
          levelUp: result.levelUp,
          newLevel: result.newLevel,
          achievements: result.achievements
        });
      }
      
      setCvData(prev => ({
        ...prev,
        ...generatedData
      }));
      navigateToStep('form');
      addToast('AI profile generation completed', 'success');
    } catch (error) {
      handleError(error, 'AI completion');
    }
  }, [navigateToStep, addToast, handleError]);

  // Analysis completion handler
  const handleAnalysisComplete = useCallback((analysis: CVAnalysis, cvText: string, jobDesc?: string) => {
    try {
      // Award XP for analysis
      const result = jobDesc 
        ? gamificationService.trackJobMatchAnalysis()
        : gamificationService.trackCVAnalysis(analysis.score);
      
      if (result.levelUp || result.achievements) {
        setXpNotification({
          xpGain: jobDesc ? 60 : 50,
          reason: jobDesc ? 'Job match analysis completed' : 'CV analyzed',
          levelUp: result.levelUp,
          newLevel: result.newLevel,
          achievements: result.achievements
        });
      }
      
      setCvAnalysis(analysis);
      setAnalyzedCVText(cvText);
      if (jobDesc) {
        setJobDescription(jobDesc);
      }
      navigateToStep('improver');
      addToast('Analysis completed successfully', 'success');
    } catch (error) {
      handleError(error, 'analysis completion');
    }
  }, [navigateToStep, addToast, handleError]);

  // Flow initiation handlers
  const handleCreateNew = useCallback(() => {
    setPendingFlow('create');
    navigateToStep('templates', 'create');
  }, [navigateToStep]);

  const handleImproveCV = useCallback(() => {
    setPendingFlow('analyze');
    navigateToStep('market-selector', 'analyze');
  }, [navigateToStep]);

  const handleAnalyzeVsJob = useCallback(() => {
    setPendingFlow('job-match');
    navigateToStep('market-selector', 'job-match');
  }, [navigateToStep]);

  const handleInterviewPrep = useCallback(() => {
    setPendingFlow('interview');
    navigateToStep('market-selector', 'interview');
  }, [navigateToStep]);

  const handleMyCVs = useCallback(() => {
    navigateToStep('my-cvs');
  }, [navigateToStep]);

  // CV editing handler
  const handleEditCV = useCallback((cv: any) => {
    try {
      // Store editing context and redirect to CV builder
      localStorage.setItem('mocv_editing_cv', JSON.stringify({
        cvData: cv.cvData,
        cvId: cv.id,
        isEditing: true
      }));
      setPendingFlow('create');
      navigateToStep('cv-builder', 'create');
      addToast('CV loaded for editing', 'info');
    } catch (error) {
      handleError(error, 'CV editing');
    }
  }, [navigateToStep, addToast, handleError]);

  // Market selection handler
  const handleMarketSelect = useCallback((market: TargetMarket) => {
    setSelectedMarket(market);
    
    // Route to appropriate flow based on pending action
    const flowRoutes: Record<NonNullable<FlowType>, AppStep> = {
      'analyze': 'analyzer',
      'create': selectedTemplate ? 'cv-builder' : 'templates',
      'job-match': 'job-analyzer',
      'interview': 'interview-prep'
    };
    
    const nextStep = pendingFlow ? flowRoutes[pendingFlow] : 'start';
    navigateToStep(nextStep);
    addToast(`Target market selected: ${market.name}`, 'success');
  }, [selectedTemplate, pendingFlow, navigateToStep, addToast]);

  // Fill method selection render function
  const renderFillMethodSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How would you like to fill this template?</h2>
          <p className="text-gray-600">Choose the method that works best for you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => handleFillMethodSelect('ai')}
            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-transparent hover:border-purple-200 transition-all duration-200 transform hover:scale-105 text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Wand2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">AI-Assisted</h3>
                <div className="inline-flex items-center gap-1 text-purple-600 text-sm font-medium">
                  <Star className="h-4 w-4" />
                  Recommended
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Tell us about your role and goals, and our AI will generate professional content for your CV sections.</p>
            <div className="flex items-center text-purple-600 font-medium">
              Get AI Help <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </button>

          <button
            onClick={() => handleFillMethodSelect('manual')}
            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-transparent hover:border-blue-200 transition-all duration-200 transform hover:scale-105 text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Fill Manually</h3>
                <div className="text-gray-500 text-sm">Traditional approach</div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Fill out the form fields yourself with complete control over every section and detail.</p>
            <div className="flex items-center text-blue-600 font-medium">
              Fill Manually <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </button>
        </div>

        <div className="text-center mt-8">
          <BackButton
            onClick={navigateBack}
            label="Back to Templates"
            variant="minimal"
          />
        </div>
      </div>
    </div>
  );

  // Enhanced final step with better success feedback
  const renderFinalStep = () => {
    if (!selectedTemplate) return null;

    // Award XP for CV completion (only once)
    useEffect(() => {
      const result = gamificationService.trackCVCreation();
      if (result.levelUp || result.achievements) {
        setTimeout(() => {
          setXpNotification({
            xpGain: 100,
            reason: 'CV created successfully!',
            levelUp: result.levelUp,
            newLevel: result.newLevel,
            achievements: result.achievements
          });
        }, 500);
      }
    }, []);

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Trophy className="h-4 w-4" />
              +100 XP Earned!
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your CV is Ready!</h2>
            <p className="text-gray-600">Download your professional CV or share it with potential employers</p>
            <p className="text-sm text-green-600 mt-2">✓ CV saved to your dashboard</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Preview & Export</h3>
              <div className="flex gap-3">
                <button 
                  onClick={handleMyCVs}
                  className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View in My CVs
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 min-h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p>CV Preview will be rendered here</p>
                <p className="text-sm mt-2">Template: {selectedTemplate.name}</p>
                <p className="text-xs mt-1 text-green-600">Automatically saved to your dashboard</p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <BackButton 
                onClick={() => navigateToStep('start')} 
                label="Back to Home" 
                variant="minimal"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
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
                {isFlowInProgress && (
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    Flow in progress
                  </div>
                )}
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

        {/* Main Content */}
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

          {currentStep === 'market-selector' && pendingFlow && (
            <TargetMarketSelector
              selectedFlow={pendingFlow}
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

          {currentStep === 'fill-method' && renderFillMethodSelection()}

          {currentStep === 'ai-assistant' && selectedTemplate && (
            <AIAssistant
              targetMarket={selectedMarket}
              template={selectedTemplate}
              onComplete={handleAIComplete}
              onBack={navigateBack}
            />
          )}

          {currentStep === 'final' && renderFinalStep()}

          {previewTemplate && (
            <TemplatePreview
              templateName={previewTemplate.name}
              markdownUrl={previewTemplate.markdownUrl}
              onClose={() => setPreviewTemplate(null)}
              onUseTemplate={() => {
                setSelectedTemplate(previewTemplate);
                setPreviewTemplate(null);
                navigateToStep('fill-method');
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
