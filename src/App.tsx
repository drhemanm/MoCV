import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Eye, ArrowRight, Zap, FileText, Users, Trophy, Star, ChevronRight, Bot, User, Wand2 } from 'lucide-react';
import { CVTemplate, CVAnalysis } from './types';
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
import { GameData } from './types';
import { TargetMarket } from './types';

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

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'start' | 'my-cvs' | 'market-selector' | 'analyzer' | 'improver' | 'job-analyzer' | 'interview-prep' | 'templates' | 'preview' | 'fill-method' | 'ai-assistant' | 'form' | 'final' | 'cv-builder'>('start');
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);
  const [fillMethod, setFillMethod] = useState<'manual' | 'ai' | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<TargetMarket | null>(null);
  const [pendingFlow, setPendingFlow] = useState<'analyze' | 'create' | 'job-match' | 'interview' | null>(null);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [analyzedCVText, setAnalyzedCVText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [gameData, setGameData] = useState<GameData>(gamificationService.getGameData());
  const [xpNotification, setXpNotification] = useState<{
    xpGain: number;
    reason: string;
    levelUp?: boolean;
    newLevel?: number;
    achievements?: string[];
  } | null>(null);
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
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to gamification service
  useEffect(() => {
    const unsubscribe = gamificationService.subscribe(setGameData);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const fetchedTemplates = await fetchCVTemplates();
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentStep === 'templates') {
      loadTemplates();
    }
  }, [currentStep]);
  const handleTemplateSelect = (template: CVTemplate) => {
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
    
    // Navigate directly to CV builder with selected template
    localStorage.setItem('mocv_selected_template', template.id);
    localStorage.setItem('mocv_selected_template_data', JSON.stringify(template));
    localStorage.setItem('mocv_selected_template_content', JSON.stringify({
      templateId: template.id,
      templateName: template.name,
      markdownUrl: template.markdownUrl
    }));
    setCurrentStep('cv-builder');
  };

  const handleFillMethodSelect = (method: 'manual' | 'ai') => {
    setFillMethod(method);
    if (method === 'ai') {
      setCurrentStep('ai-assistant');
    } else {
      setCurrentStep('form');
    }
  };

  const handleAIComplete = (generatedData: Partial<CVData>) => {
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
    setCurrentStep('form');
  };

  const handleAnalysisComplete = (analysis: CVAnalysis, cvText: string, jobDesc?: string) => {
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
    setCurrentStep('improver');
  };

  const handleCreateNew = () => {
    setPendingFlow('create');
    setCurrentStep('market-selector');
  };

  const handleImproveCV = () => {
    setPendingFlow('analyze');
    setCurrentStep('market-selector');
  };

  const handleAnalyzeVsJob = () => {
    setPendingFlow('job-match');
    setCurrentStep('market-selector');
  };

  const handleInterviewPrep = () => {
    setPendingFlow('interview');
    setCurrentStep('market-selector');
  };

  const handleMyCVs = () => {
    setCurrentStep('my-cvs');
  };

  const handleEditCV = (cv: any) => {
    // Store editing context and redirect to CV builder
    localStorage.setItem('mocv_editing_cv', JSON.stringify({
      cvData: cv.cvData,
      cvId: cv.id,
      isEditing: true
    }));
    setPendingFlow('create');
    setCurrentStep('cv-builder');
  };

  const handleMarketSelect = (market: TargetMarket) => {
    setSelectedMarket(market);
    
    // Route to appropriate flow based on pending action
    switch (pendingFlow) {
      case 'analyze':
        setCurrentStep('analyzer');
        break;
      case 'create':
        setCurrentStep('cv-builder');
        break;
      case 'job-match':
        setCurrentStep('job-analyzer');
        break;
      case 'interview':
        setCurrentStep('interview-prep');
        break;
      default:
        setCurrentStep('start');
    }
  };

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
          <button
            onClick={() => setCurrentStep('start')}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Templates
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentStep('start')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MoCV.mu</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentStep('start')}
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
            onBack={() => setCurrentStep('start')}
          />
        )}
        
        {currentStep === 'my-cvs' && (
          <MyCVsDashboard
            onBack={() => setCurrentStep('start')}
            onEditCV={handleEditCV}
            onCreateNew={handleCreateNew}
          />
        )}

        {currentStep === 'market-selector' && pendingFlow && (
          <TargetMarketSelector
            selectedFlow={pendingFlow}
            onMarketSelect={handleMarketSelect}
            onBack={() => setCurrentStep('start')}
          />
        )}

        {currentStep === 'analyzer' && (
          <CVAnalyzer
            targetMarket={selectedMarket}
            onAnalysisComplete={handleAnalysisComplete}
            onCreateNew={handleCreateNew}
            onBack={() => setCurrentStep('market-selector')}
          />
        )}

        {currentStep === 'job-analyzer' && (
          <JobDescriptionAnalyzer
            targetMarket={selectedMarket}
            onAnalysisComplete={handleAnalysisComplete}
            onBack={() => setCurrentStep('market-selector')}
          />
        )}

        {currentStep === 'interview-prep' && (
          <InterviewPrep
            targetMarket={selectedMarket}
            onBack={() => setCurrentStep('market-selector')}
          />
        )}

        {currentStep === 'improver' && cvAnalysis && (
          <CVImprover
            targetMarket={selectedMarket}
            analysis={cvAnalysis}
            originalCV={analyzedCVText}
            onBack={() => setCurrentStep('market-selector')}
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
            onBack={() => setCurrentStep('market-selector')}
          />
        )}

        {currentStep === 'fill-method' && renderFillMethodSelection()}

        {currentStep === 'ai-assistant' && selectedTemplate && (
          <AIAssistant
            targetMarket={selectedMarket}
            template={selectedTemplate}
            onComplete={handleAIComplete}
            onBack={() => setCurrentStep('fill-method')}
          />
        )}

        {currentStep === 'final' && selectedTemplate && (
          <div className="min-h-screen bg-gray-50 py-8">
            {/* Award XP for CV completion */}
            {(() => {
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
              return null;
            })()}
            
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
                    onClick={() => setCurrentStep('start')} 
                    label="Back to Home" 
                    variant="minimal"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {previewTemplate && (
          <TemplatePreview
            templateName={previewTemplate.name}
            markdownUrl={previewTemplate.markdownUrl}
            onClose={() => setPreviewTemplate(null)}
            onUseTemplate={() => {
              setSelectedTemplate(previewTemplate);
              setPreviewTemplate(null);
              setCurrentStep('fill-method');
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
    </div>
  );
};

export default App;