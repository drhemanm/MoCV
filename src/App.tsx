// App.tsx - Simplified Apple-style flow
import React, { useState, useCallback } from 'react';
import { CVTemplate, TargetMarket, CVData } from './types';

// Simplified state - only what we need
type AppView = 'home' | 'templates' | 'builder' | 'preview';

interface AppState {
  currentView: AppView;
  selectedTemplate: CVTemplate | null;
  selectedMarket: TargetMarket | null;
  cvData: CVData | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentView: 'home',
    selectedTemplate: null,
    selectedMarket: null,
    cvData: null
  });

  // Clean navigation functions
  const navigateToTemplates = useCallback(() => {
    setState(prev => ({ ...prev, currentView: 'templates' }));
  }, []);

  const navigateToBuilder = useCallback((template: CVTemplate) => {
    setState(prev => ({
      ...prev,
      currentView: 'builder',
      selectedTemplate: template
    }));
  }, []);

  const navigateToPreview = useCallback((cvData: CVData) => {
    setState(prev => ({
      ...prev,
      currentView: 'preview',
      cvData
    }));
  }, []);

  const navigateHome = useCallback(() => {
    setState(prev => ({ ...prev, currentView: 'home' }));
  }, []);

  // Apple-style: Direct template selection, skip market selector for now
  const handleTemplateSelect = useCallback((template: CVTemplate) => {
    console.log('Template selected:', template.name); // Debug log
    navigateToBuilder(template);
  }, [navigateToBuilder]);

  const handleCVComplete = useCallback((cvData: CVData) => {
    console.log('CV completed:', cvData); // Debug log
    navigateToPreview(cvData);
  }, [navigateToPreview]);

  return (
    <div className="min-h-screen bg-white">
      {/* Clean header */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={navigateHome}
              className="text-xl font-medium text-gray-900"
            >
              MoCV
            </button>
            <div className="text-sm text-gray-500">
              {state.currentView === 'templates' && 'Choose Template'}
              {state.currentView === 'builder' && 'Build CV'}
              {state.currentView === 'preview' && 'Preview'}
            </div>
          </div>
        </div>
      </nav>

      {/* Simple view rendering */}
      <main>
        {state.currentView === 'home' && (
          <FlowStartScreen
            onCreateNew={navigateToTemplates}
            onImproveCV={() => {}} // Simplified for now
            onAnalyzeVsJob={() => {}} // Simplified for now
            onInterviewPrep={() => {}} // Simplified for now
            onMyCVs={() => {}} // Simplified for now
          />
        )}

        {state.currentView === 'templates' && (
          <TemplateGallery
            templates={[]} // We'll fix template loading next
            onTemplateSelect={handleTemplateSelect}
            onBack={navigateHome}
            isLoading={false}
          />
        )}

        {state.currentView === 'builder' && state.selectedTemplate && (
          <CVBuilder
            selectedTemplate={state.selectedTemplate}
            targetMarket={null} // Simplified for now
            onBack={navigateToTemplates}
            onComplete={handleCVComplete}
          />
        )}

        {state.currentView === 'preview' && state.cvData && (
          <CVPreview
            cvData={state.cvData}
            template={state.selectedTemplate}
            onBack={() => setState(prev => ({ ...prev, currentView: 'builder' }))}
            onStartOver={navigateHome}
          />
        )}
      </main>
    </div>
  );
};
