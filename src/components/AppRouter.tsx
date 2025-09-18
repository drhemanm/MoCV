// src/components/AppRouter.tsx - Updated for new CV Builder
import React, { useState, useEffect } from 'react';
import MainDashboard from './MainDashboard';
import TemplateGallery from './TemplateGallery';
import CVBuilder from './CVBuilder';
import { CVTemplate, TargetMarket, GameData, CVData } from '../types';  // Added CVData import
import gamificationService from '../services/gamificationService';

type AppView = 
  | 'dashboard' 
  | 'templates' 
  | 'cv-builder' 
  | 'my-cvs' 
  | 'analyzer' 
  | 'job-analyzer' 
  | 'interview-prep'
  | 'market-selector';

const AppRouter: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<TargetMarket | null>(null);
  const [editingCVId, setEditingCVId] = useState<string | null>(null);
  const [editingCVData, setEditingCVData] = useState<CVData | null>(null); // Added for CV editing
  const [gameData, setGameData] = useState<GameData | null>(null);

  useEffect(() => {
    // Load game data
    const data = gamificationService.getGameData();
    setGameData(data);

    // Subscribe to game data changes
    const unsubscribe = gamificationService.subscribe((newData) => {
      setGameData(newData);
    });

    return unsubscribe;
  }, []);

  // Navigation handlers
  const handleCreateNew = () => {
    // Clear any editing data when creating new
    setEditingCVId(null);
    setEditingCVData(null);
    setCurrentView('templates');
    gamificationService.trackProfileCompletion();
  };

  const handleImproveCV = () => {
    setCurrentView('analyzer');
  };

  const handleAnalyzeVsJob = () => {
    setCurrentView('job-analyzer');
  };

  const handleInterviewPrep = () => {
    setCurrentView('interview-prep');
  };

  const handleMyCVs = () => {
    setCurrentView('my-cvs');
  };

  const handleTemplateSelect = (template: CVTemplate) => {
    setSelectedTemplate(template);
    setCurrentView('cv-builder');
    gamificationService.trackTemplateSelection();
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTemplate(null);
    setSelectedMarket(null);
    setEditingCVId(null);
    setEditingCVData(null);
  };

  const handleBackToTemplates = () => {
    setCurrentView('templates');
    setSelectedTemplate(null);
  };

  // Enhanced CV editing handler
  const handleEditCV = (cvId: string) => {
    setEditingCVId(cvId);
    
    // Load the CV data from storage
    const savedCVs = JSON.parse(localStorage.getItem('mocv_saved_cvs') || '[]');
    const cv = savedCVs.find((c: any) => c.id === cvId);
    
    if (cv) {
      // Set the CV data for editing
      setEditingCVData(cv.cvData);
      
      // Set template for editing
      const template: CVTemplate = {
        id: cv.templateId || 'classic-ats',
        name: cv.templateName || 'Classic Template',
        description: 'Professional template',
        category: 'modern',
        previewUrl: '',
        markdownUrl: '',
        thumbnail: '',
        features: [],
        difficulty: 'beginner',
        estimatedTime: '15 minutes',
        popularity: 80,
        tags: []
      };
      setSelectedTemplate(template);
      
      // Set target market if available
      if (cv.targetMarket) {
        const market: TargetMarket = {
          id: cv.targetMarket.toLowerCase(),
          name: cv.targetMarket,
          description: `${cv.targetMarket} job market`
        };
        setSelectedMarket(market);
      }
      
      setCurrentView('cv-builder');
    }
  };

  // Mock target markets - in production these would come from an API
  const mockMarkets: TargetMarket[] = [
    {
      id: 'mauritius',
      name: 'Mauritius',
      description: 'Local Mauritian job market'
    },
    {
      id: 'usa',
      name: 'United States',
      description: 'US job market with ATS optimization'
    },
    {
      id: 'uk',
      name: 'United Kingdom',
      description: 'UK market focusing on experience and qualifications'
    },
    {
      id: 'canada',
      name: 'Canada',
      description: 'Canadian job market with multicultural focus'
    },
    {
      id: 'australia',
      name: 'Australia',
      description: 'Australian market with work-life balance focus'
    },
    {
      id: 'global',
      name: 'Global',
      description: 'International remote opportunities'
    }
  ];

  // Render different views based on current state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'templates':
        return (
          <TemplateGallery
            onSelectTemplate={handleTemplateSelect}
            onBack={handleBackToDashboard}
            selectedTemplateId={selectedTemplate?.id}
          />
        );

      case 'cv-builder':
        return (
          <CVBuilder
            onBack={handleBackToTemplates}
            targetMarket={selectedMarket?.name || 'Global'}
            selectedTemplate={selectedTemplate}
            initialData={editingCVData || undefined} // Pass editing data if available
          />
        );

      case 'my-cvs':
        return <MyCVsView onBack={handleBackToDashboard} onEditCV={handleEditCV} />;

      case 'analyzer':
        return <CVAnalyzerView onBack={handleBackToDashboard} />;

      case 'job-analyzer':
        return <JobAnalyzerView onBack={handleBackToDashboard} />;

      case 'interview-prep':
        return <InterviewPrepView onBack={handleBackToDashboard} />;

      case 'market-selector':
        return <MarketSelectorView onBack={handleBackToDashboard} markets={mockMarkets} />;

      case 'dashboard':
      default:
        return (
          <MainDashboard
            gameData={gameData || {
              level: 1,
              xp: 0,
              xpToNextLevel: 100,
              achievements: [],
              stats: { cvsCreated: 0, downloadsTotal: 0 }
            }}
            onCreateNew={handleCreateNew}
            onImproveCV={handleImproveCV}
            onAnalyzeVsJob={handleAnalyzeVsJob}
            onInterviewPrep={handleInterviewPrep}
            onMyCVs={handleMyCVs}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
    </div>
  );
};

// Placeholder components for views we haven't built yet
const MyCVsView: React.FC<{ onBack: () => void; onEditCV: (id: string) => void }> = ({ onBack, onEditCV }) => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        ← Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My CVs</h1>
      
      <div className="bg-white rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">CV Management Coming Soon</h2>
        <p className="text-gray-600">This feature will allow you to manage all your saved CVs in one place.</p>
      </div>
    </div>
  </div>
);

const CVAnalyzerView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        ← Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">CV Analyzer</h1>
      
      <div className="bg-white rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">CV Analysis Coming Soon</h2>
        <p className="text-gray-600">Upload your existing CV to get detailed analysis and improvement suggestions.</p>
      </div>
    </div>
  </div>
);

const JobAnalyzerView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        ← Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Match Analyzer</h1>
      
      <div className="bg-white rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Matching Coming Soon</h2>
        <p className="text-gray-600">Compare your CV against specific job descriptions for perfect alignment.</p>
      </div>
    </div>
  </div>
);

const InterviewPrepView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        ← Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Interview Preparation</h1>
      
      <div className="bg-white rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Prep Coming Soon</h2>
        <p className="text-gray-600">Practice with AI interviewer and get personalized feedback.</p>
      </div>
    </div>
  </div>
);

const MarketSelectorView: React.FC<{ onBack: () => void; markets: TargetMarket[] }> = ({ onBack, markets }) => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        ← Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Select Target Market</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {markets.map(market => (
          <div key={market.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{market.name}</h3>
            <p className="text-gray-600 mb-4">{market.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AppRouter;
