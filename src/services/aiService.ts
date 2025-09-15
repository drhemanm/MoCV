// src/services/aiService.ts
export interface AIAnalysisResult {
  atsScore: number;
  strengths: string[];
  improvements: string[];
  keywordOptimization: {
    missing: string[];
    density: { [key: string]: number };
  };
  sectionAnalysis: {
    [section: string]: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
  };
  industryMatch: number;
  competitiveAnalysis: {
    marketPosition: 'entry' | 'mid' | 'senior' | 'executive';
    salaryRange: { min: number; max: number };
    demandLevel: 'low' | 'medium' | 'high';
  };
}

export interface AIContentSuggestion {
  type: 'improve' | 'add' | 'rewrite';
  section: string;
  field?: string;
  original?: string;
  suggestion: string;
  reason: string;
  impact: 'low' | 'medium' | 'high';
  keywords?: string[];
}

export class AIService {
  private static instance: AIService;
  private apiUrl = process.env.REACT_APP_AI_API_URL || '/api/ai';
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Analyze CV content with AI
  async analyzeCVContent(cvData: any, targetMarket?: string): Promise<AIAnalysisResult> {
    try {
      // Simulate AI analysis - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: AIAnalysisResult = {
        atsScore: Math.floor(Math.random() * 30) + 70,
        strengths: [
          'Strong technical skills section',
          'Quantifiable achievements in experience',
          'Relevant educational background'
        ],
        improvements: [
          'Add more industry-specific keywords',
          'Expand project descriptions',
          'Include relevant certifications'
        ],
        keywordOptimization: {
          missing: ['agile', 'scrum', 'cloud computing', 'leadership'],
          density: {
            'javascript': 0.8,
            'react': 0.6,
            'node.js': 0.4
          }
        },
        sectionAnalysis: {
          summary: {
            score: 85,
            feedback: 'Strong professional summary with clear value proposition',
            suggestions: ['Add specific industry metrics', 'Mention years of experience']
          },
          experience: {
            score: 90,
            feedback: 'Excellent use of quantifiable achievements',
            suggestions: ['Add more action verbs', 'Include team leadership examples']
          },
          skills: {
            score: 75,
            feedback: 'Good technical skills coverage',
            suggestions: ['Add soft skills', 'Include proficiency levels']
          }
        },
        industryMatch: 88,
        competitiveAnalysis: {
          marketPosition: 'mid',
          salaryRange: { min: 75000, max: 95000 },
          demandLevel: 'high'
        }
      };

      return mockAnalysis;
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw new Error('Failed to analyze CV content');
    }
  }

  // Get content suggestions for specific sections
  async getContentSuggestions(
    sectionData: any, 
    sectionType: string, 
    context: { targetMarket?: string; jobTitle?: string }
  ): Promise<AIContentSuggestion[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const suggestions: AIContentSuggestion[] = [];
      
      if (sectionType === 'summary') {
        suggestions.push({
          type: 'improve',
          section: 'summary',
          original: sectionData,
          suggestion: `${sectionData} With 5+ years of experience driving digital transformation and leading cross-functional teams to deliver innovative solutions.`,
          reason: 'Adding specific experience duration and leadership keywords improves ATS matching',
          impact: 'high',
          keywords: ['digital transformation', 'cross-functional', 'innovative solutions']
        });
      }

      if (sectionType === 'experience') {
        suggestions.push({
          type: 'add',
          section: 'experience',
          suggestion: '• Collaborated with stakeholders to define project requirements and success metrics',
          reason: 'Demonstrates communication and analytical skills valued by employers',
          impact: 'medium',
          keywords: ['stakeholders', 'requirements', 'metrics']
        });
      }

      return suggestions;
    } catch (error) {
      console.error('Failed to get content suggestions:', error);
      throw new Error('Failed to generate content suggestions');
    }
  }

  // Generate industry-specific content
  async generateIndustryContent(
    contentType: 'summary' | 'experience' | 'skills',
    industry: string,
    role: string,
    context: any
  ): Promise<string> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const templates = {
        summary: {
          technology: `Innovative ${role} with expertise in modern web technologies and agile methodologies. Proven track record of delivering scalable applications and driving technical excellence across development teams.`,
          finance: `Results-driven ${role} with strong analytical skills and deep understanding of financial markets. Experienced in developing robust financial models and implementing regulatory compliance solutions.`,
          healthcare: `Dedicated ${role} committed to improving patient outcomes through technology innovation. Experienced in healthcare systems, regulatory compliance, and data privacy standards.`
        }
      };

      return templates[contentType]?.[industry as keyof typeof templates[typeof contentType]] || 
             `Professional ${role} with extensive experience in ${industry}.`;
    } catch (error) {
      console.error('Failed to generate industry content:', error);
      throw new Error('Failed to generate content');
    }
  }

  // Real-time writing assistance
  async getWritingAssistance(text: string, context: string): Promise<{
    score: number;
    suggestions: Array<{
      type: 'grammar' | 'style' | 'keyword' | 'structure';
      message: string;
      position?: { start: number; end: number };
      replacement?: string;
    }>;
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const suggestions = [];
      
      // Check for passive voice
      if (text.includes('was') || text.includes('were')) {
        suggestions.push({
          type: 'style' as const,
          message: 'Consider using active voice for stronger impact',
          replacement: text.replace(/was (\w+ing)/g, (match, verb) => verb.replace('ing', 'ed'))
        });
      }

      // Check for weak verbs
      const weakVerbs = ['did', 'made', 'worked on', 'helped'];
      weakVerbs.forEach(verb => {
        if (text.toLowerCase().includes(verb)) {
          suggestions.push({
            type: 'style' as const,
            message: `Replace "${verb}" with a stronger action verb`,
            replacement: text.replace(new RegExp(verb, 'gi'), '[strong action verb]')
          });
        }
      });

      return {
        score: Math.max(0, 100 - suggestions.length * 10),
        suggestions
      };
    } catch (error) {
      console.error('Writing assistance failed:', error);
      return { score: 100, suggestions: [] };
    }
  }
}

// src/components/AIInsightsPanel.tsx
import React, { useState, useEffect } from 'react';
import { 
  Brain, TrendingUp, Target, Lightbulb, Star, AlertCircle, 
  CheckCircle, BarChart3, Zap, Award, Users, DollarSign,
  ArrowUp, ArrowDown, Sparkles, RefreshCw
} from 'lucide-react';
import { AIService, AIAnalysisResult } from '../services/aiService';
import { AnimatedCounter } from './ui/AnimatedCounter';

interface AIInsightsPanelProps {
  cvData: any;
  targetMarket?: string;
  isVisible: boolean;
  onClose: () => void;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  cvData,
  targetMarket,
  isVisible,
  onClose
}) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'improvements' | 'market'>('overview');
  const aiService = AIService.getInstance();

  useEffect(() => {
    if (isVisible && cvData) {
      analyzeCV();
    }
  }, [isVisible, cvData]);

  const analyzeCV = async () => {
    setIsLoading(true);
    try {
      const result = await aiService.analyzeCVContent(cvData, targetMarket);
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze CV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Career Insights</h2>
                <p className="text-purple-100">Advanced analysis powered by AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex mt-6 space-x-1 bg-white/10 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'improvements', label: 'Improvements', icon: TrendingUp },
              { id: 'market', label: 'Market Analysis', icon: Target }
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your CV with AI...</p>
            </div>
          ) : analysis ? (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 font-medium">ATS Score</p>
                          <p className="text-3xl font-bold text-green-700">
                            <AnimatedCounter from={0} to={analysis.atsScore} />
                          </p>
                        </div>
                        <div className="p-3 bg-green-200 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <p className="text-sm text-green-600 mt-2">Excellent match for ATS systems</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 font-medium">Industry Match</p>
                          <p className="text-3xl font-bold text-blue-700">
                            <AnimatedCounter from={0} to={analysis.industryMatch} suffix="%" />
                          </p>
                        </div>
                        <div className="p-3 bg-blue-200 rounded-lg">
                          <Target className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <p className="text-sm text-blue-600 mt-2">Strong alignment with {targetMarket}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 font-medium">Market Position</p>
                          <p className="text-xl font-bold text-purple-700 capitalize">
                            {analysis.competitiveAnalysis.marketPosition} Level
                          </p>
                        </div>
                        <div className="p-3 bg-purple-200 rounded-lg">
                          <Star className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <p className="text-sm text-purple-600 mt-2">
                        Demand: {analysis.competitiveAnalysis.demandLevel}
                      </p>
                    </div>
                  </div>

                  {/* Section Analysis */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Analysis</h3>
                    <div className="space-y-4">
                      {Object.entries(analysis.sectionAnalysis).map(([section, data]) => (
                        <div key={section} className="bg-white rounded-lg p-4 border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 capitalize">{section}</h4>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${data.score}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-600">{data.score}%</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{data.feedback}</p>
                          <div className="flex flex-wrap gap-2">
                            {data.suggestions.map((suggestion, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {suggestion}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-900">Strengths</h3>
                      </div>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="h-5 w-5 text-amber-600" />
                        <h3 className="font-semibold text-amber-900">Areas for Improvement</h3>
                      </div>
                      <ul className="space-y-2">
                        {analysis.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Improvements Tab */}
              {activeTab === 'improvements' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-4">Keyword Optimization</h3>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-blue-800 mb-2">Missing Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywordOptimization.missing.map((keyword, index) => (
                          <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Current Keyword Density</h4>
                      <div className="space-y-2">
                        {Object.entries(analysis.keywordOptimization.density).map(([keyword, density]) => (
                          <div key={keyword} className="flex items-center justify-between">
                            <span className="text-sm text-blue-700">{keyword}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-blue-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${density * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-blue-600">{(density * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Market Analysis Tab */}
              {activeTab === 'market' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-900">Salary Insights</h3>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-700">
                          ${analysis.competitiveAnalysis.salaryRange.min.toLocaleString()} - ${analysis.competitiveAnalysis.salaryRange.max.toLocaleString()}
                        </p>
                        <p className="text-sm text-green-600">Expected salary range</p>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-900">Market Demand</h3>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-700 capitalize">
                          {analysis.competitiveAnalysis.demandLevel}
                        </p>
                        <p className="text-sm text-purple-600">Current market demand</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Click "Analyze" to get AI insights</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4" />
              <span>Analysis powered by AI • Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={analyzeCV}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Re-analyze
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
