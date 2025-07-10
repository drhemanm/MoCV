import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Eye, ArrowRight, Zap, FileText, Users, Trophy, Star, ChevronRight, Bot, User, Wand2 } from 'lucide-react';
import { CVTemplate, CVAnalysis } from './types';
import { fetchCVTemplates } from './services/templateService';
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
  const [gameData, setGameData] = useState<GameData>({
    totalXP: 250,
    currentLevel: 2,
    uploadsCount: 3,
    achievements: ['First CV Created', 'ATS Score 80+', 'Template Master'],
    consecutiveDays: 5,
    lastUploadDate: new Date().toISOString(),
    highestScore: 87
  });
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
    setSelectedTemplate(template);
    setCurrentStep('fill-method');
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
    setCvData(prev => ({
      ...prev,
      ...generatedData
    }));
    setCurrentStep('form');
  };

  const handleAnalysisComplete = (analysis: CVAnalysis, cvText: string, jobDesc?: string) => {
    setCvAnalysis(analysis);
    setAnalyzedCVText(cvText);
    if (jobDesc) {
      setJobDescription(jobDesc);
    }
    setCurrentStep('improver');
    
    // Award XP for analysis
    setGameData(prev => ({
      ...prev,
      totalXP: prev.totalXP + (jobDesc ? 75 : 50),
      currentLevel: Math.floor((prev.totalXP + (jobDesc ? 75 : 50)) / 100),
      achievements: [...prev.achievements, jobDesc ? 'Job Matcher' : 'CV Analyzer']
    }));
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
    // For now, redirect to CV builder since we don't have the full form flow
    // In the future, this would load the specific CV data into the form
    console.log('Editing CV:', cv);
    // Load CV data into the builder
    if (cv.cvData) {
      setCvData(cv.cvData);
    }
    setPendingFlow('create');
    setCurrentStep('cv-builder');
  };

  // Function to save CV when user completes the form
  const saveCVToStorage = (cvData: CVData, template: CVTemplate, targetMarket: TargetMarket | null) => {
    const newCV = {
      id: Date.now().toString(),
      title: `${cvData.personalInfo.title || 'Professional'} CV - ${new Date().toLocaleDateString()}`,
      templateName: template.name,
      templateId: template.id,
      dateCreated: new Date(),
      dateModified: new Date(),
      atsScore: Math.floor(Math.random() * 20) + 75, // Random score between 75-95
      status: 'completed' as const,
      cvData: cvData,
      targetMarket: targetMarket?.id || 'global'
    };

    // Get existing CVs from localStorage
    const existingCVs = localStorage.getItem('mocv_saved_cvs');
    let cvList = [];
    
    if (existingCVs) {
      try {
        cvList = JSON.parse(existingCVs);
      } catch (error) {
        console.error('Error parsing existing CVs:', error);
        cvList = [];
      }
    }

    // Add new CV to the beginning of the list
    cvList.unshift(newCV);
    
    // Save back to localStorage
    localStorage.setItem('mocv_saved_cvs', JSON.stringify(cvList));
    
    return newCV;
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
    </div>
  );
};

export default App;