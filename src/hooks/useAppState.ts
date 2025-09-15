// src/hooks/useAppState.ts - Simple state management for navigation

import { useState, useCallback } from 'react';
import { AppState, AppView, CVTemplate, TargetMarket, CVData, GameData } from '../types';

// Initial state
const createInitialState = (): AppState => ({
  currentView: AppView.HOME,
  selectedTemplate: null,
  selectedTargetMarket: null,
  cvData: null,
  gameData: {
    level: 1,
    xp: 100,
    xpToNextLevel: 150,
    stats: {
      cvsCreated: 0,
      downloadsTotal: 0
    },
    achievements: []
  }
});

export const useAppState = () => {
  const [state, setState] = useState<AppState>(createInitialState);

  // Navigation functions
  const navigateToView = useCallback((view: AppView) => {
    setState(prev => ({ ...prev, currentView: view }));
  }, []);

  const navigateToTemplates = useCallback(() => {
    navigateToView(AppView.TEMPLATE_GALLERY);
  }, [navigateToView]);

  const navigateToBuilder = useCallback((template: CVTemplate) => {
    setState(prev => ({
      ...prev,
      currentView: AppView.CV_BUILDER,
      selectedTemplate: template
    }));
  }, []);

  const navigateToPreview = useCallback((cvData: CVData) => {
    setState(prev => ({
      ...prev,
      currentView: AppView.CV_PREVIEW,
      cvData
    }));
  }, []);

  const navigateToHome = useCallback(() => {
    navigateToView(AppView.HOME);
  }, [navigateToView]);

  // Template selection
  const selectTemplate = useCallback((template: CVTemplate) => {
    setState(prev => ({
      ...prev,
      selectedTemplate: template
    }));
  }, []);

  // Target market selection
  const selectTargetMarket = useCallback((market: TargetMarket) => {
    setState(prev => ({
      ...prev,
      selectedTargetMarket: market
    }));
  }, []);

  // CV data updates
  const updateCVData = useCallback((cvData: CVData) => {
    setState(prev => ({
      ...prev,
      cvData
    }));
  }, []);

  // Clear selections (for starting fresh)
  const clearSelections = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedTemplate: null,
      selectedTargetMarket: null,
      cvData: null
    }));
  }, []);

  return {
    // State
    ...state,
    
    // Navigation
    navigateToView,
    navigateToTemplates,
    navigateToBuilder,
    navigateToPreview,
    navigateToHome,
    
    // Selections
    selectTemplate,
    selectTargetMarket,
    updateCVData,
    clearSelections
  };
};
