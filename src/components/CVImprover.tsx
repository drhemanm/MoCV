// src/components/CVImprover.tsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, CheckCircle, AlertTriangle, Target, Lightbulb, 
  BarChart3, Star, Zap, ArrowRight, Download, RefreshCw,
  Eye, Edit3, Copy, ThumbsUp, ThumbsDown, Sparkles
} from 'lucide-react';
import { TargetMarket, CVAnalysis } from '../types';
import { BackButton } from './BackButton';
import { Card } from './UI/Card';
import { Button } from './UI/Button';

interface CVImproverProps {
  targetMarket: TargetMarket | null;
  analysis: CVAnalysis;
  originalCV: string;
  onBack: () => void;
  onCreateNew: () => void;
}

interface ImprovementSuggestion {
  id: string;
  section: string;
  type: 'critical' | 'important' | 'nice-to-have';
  title: string;
  description: string;
  before: string;
  after: string;
  impact: 'high' | 'medium' | 'low';
  applied: boolean;
}

const CVImprover: React.FC<CVImproverProps> = ({
  targetMarket,
  analysis,
  originalCV,
  onBack,
  onCreateNew
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'improvements' | 'comparison'>('overview');
  const [improvements, setImprovements] = useState<ImprovementSuggestion[]>([]);
  const [isGeneratingImprovements, setIsGeneratingImprovements] = useState(false);
  const [appliedImprovements, setAppliedImprovements] = useState<Set<string>>(new Set());

  // Generate improvement suggestions based on analysis
  useEffect(() => {
    generateImprovements();
  }, [analysis, targetMarket]);

  const generateImprovements = async () => {
    setIsGeneratingImprovements(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockImprovements: ImprovementSuggestion[] = [
      {
        id: '1',
        section: 'Professional Summary',
        type: 'critical',
        title: 'Add quantifiable achievements',
        description: 'Include specific metrics and numbers to demonstrate your impact',
        before: 'Experienced software engineer with strong programming skills',
        after: 'Software engineer with 5+ years experience, delivering 20+ projects that improved system efficiency by 40%',
        impact: 'high',
        applied: false
      },
      {
        id: '2',
        section: 'Experience',
        type: 'important',
        title: 'Use stronger action verbs',
        description: 'Replace weak verbs with powerful action words that showcase leadership',
        before: 'Worked on developing new features',
        after: 'Spearheaded development of innovative features that increased user engagement by 25%',
        impact: 'medium',
        applied: false
      },
      {
        id: '3',
        section: 'Skills',
        type: 'important',
        title: 'Add industry-specific keywords',
        description: `Include relevant ${targetMarket?.name || 'industry'} keywords to improve ATS compatibility`,
        before: 'Programming, databases, web development',
        after: 'JavaScript, React, Node.js, MongoDB, RESTful APIs, Microservices Architecture',
        impact: 'high',
        applied: false
      },
      {
        id: '4',
        section: 'Experience',
        type: 'nice-to-have',
        title: 'Highlight collaborative achievements',
        description: 'Emphasize teamwork and cross-functional collaboration',
        before: 'Developed software solutions',
        after: 'Collaborated with cross-functional teams of 8+ members to develop scalable software solutions',
        impact: 'medium',
        applied: false
      },
      {
        id: '5',
        section: 'Overall',
        type: 'critical',
        title: 'Improve ATS compatibility',
        description: 'Optimize formatting and keywords for Applicant Tracking Systems',
        before: 'Complex formatting with graphics',
        after: 'Clean, simple formatting with relevant keywords strategically placed',
        impact: 'high',
        applied: false
      }
    ];

    setImprovements(mockImprovements);
    setIsGeneratingImprovements(false);
  };

  const applyImprovement = (improvementId: string) => {
    setAppliedImprovements(prev => new Set([...prev, improvementId]));
    setImprovements(prev => prev.map(imp => 
      imp.id === improvementId ? { ...imp, applied: true } : imp
    ));
  };

  const revertImprovement = (improvementId: string) => {
    setAppliedImprovements(prev => {
      const newSet = new Set(prev);
      newSet.delete(improvementId);
      return newSet;
    });
    setImprovements(prev => prev.map(imp => 
      imp.id === improvementId ? { ...imp, applied: false } : imp
    ));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getImprovementTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'important': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'nice-to-have': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const criticalImprovements = improvements.filter(imp => imp.type === 'critical');
  const importantImprovements = improvements.filter(imp => imp.type === 'important');
  const niceToHaveImprovements = improvements.filter(imp => imp.type === 'nice-to-have');

  const projectedScore = analysis.score + (appliedImprovements.size * 8); // Estimate improvement

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <BackButton onClick={onBack} variant="minimal" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">CV Improvement Suggestions</h1>
              <p className="text-gray-600">
                {targetMarket 
                  ? `AI-powered recommendations for ${targetMarket.name} roles`
                  : 'Personalized suggestions to enhance your CV'
                }
              </p>
            </div>
            
            {/* Score Display */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">Current Score</div>
              <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}%
              </div>
              {appliedImprovements.size > 0 && (
                <div className="text-sm text-green-600 mt-1">
                  Projected: {Math.min(100, projectedScore)}%
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'improvements', label: 'Improvements', icon: TrendingUp },
              { id: 'comparison', label: 'Before/After', icon: Eye }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <div className={`w-12 h-12 ${getScoreBgColor(analysis.score)} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Star className={`h-6 w-6 ${getScoreColor(analysis.score)}`} />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}%
                </div>
                <div className="text-gray-600 text-sm">Overall Score</div>
              </Card>

              <Card className="p-6 text-center">
                <div className={`w-12 h-12 ${getScoreBgColor(analysis.atsCompatibility)} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Target className={`h-6 w-6 ${getScoreColor(analysis.atsCompatibility)}`} />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(analysis.atsCompatibility)}`}>
                  {analysis.atsCompatibility}%
                </div>
                <div className="text-gray-600 text-sm">ATS Compatible</div>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {analysis.strengths.length}
                </div>
                <div className="text-gray-600 text-sm">Strengths</div>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {improvements.filter(imp => imp.type === 'critical').length}
                </div>
                <div className="text-gray-600 text-sm">Critical Issues</div>
              </Card>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setSelectedTab('improvements')}
                  icon={<TrendingUp className="h-4 w-4" />}
                  fullWidth
                >
                  View Improvements
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTab('comparison')}
                  icon={<Eye className="h-4 w-4" />}
                  fullWidth
                >
                  See Before/After
                </Button>
                <Button
                  variant="outline"
                  onClick={onCreateNew}
                  icon={<Sparkles className="h-4 w-4" />}
                  fullWidth
                >
                  Create New CV
                </Button>
              </div>
            </Card>
          </div>
        )}

        {selectedTab === 'improvements' && (
          <div className="space-y-8">
            {isGeneratingImprovements ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Generating Improvements</h3>
                <p className="text-gray-600">Our AI is analyzing your CV and creating personalized suggestions...</p>
              </Card>
            ) : (
              <>
                {/* Critical Improvements */}
                {criticalImprovements.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                      Critical Improvements
                    </h2>
                    <div className="space-y-4">
                      {criticalImprovements.map((improvement) => (
                        <Card key={improvement.id} className="p-6 border-l-4 border-l-red-500">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImprovementTypeColor(improvement.type)}`}>
                                  {improvement.type.replace('-', ' ')}
                                </span>
                                <span className="text-sm text-gray-500">{improvement.section}</span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">{improvement.title}</h3>
                              <p className="text-gray-600">{improvement.description}</p>
                            </div>
                            <div className="flex gap-2">
                              {improvement.applied ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => revertImprovement(improvement.id)}
                                  icon={<RefreshCw className="h-4 w-4" />}
                                >
                                  Revert
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => applyImprovement(improvement.id)}
                                  icon={<CheckCircle className="h-4 w-4" />}
                                >
                                  Apply
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">Before:</div>
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                                {improvement.before}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">After:</div>
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                                {improvement.after}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Improvements */}
                {importantImprovements.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Zap className="h-6 w-6 text-yellow-600" />
                      Important Improvements
                    </h2>
                    <div className="space-y-4">
                      {importantImprovements.map((improvement) => (
                        <Card key={improvement.id} className="p-6 border-l-4 border-l-yellow-500">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImprovementTypeColor(improvement.type)}`}>
                                  {improvement.type.replace('-', ' ')}
                                </span>
                                <span className="text-sm text-gray-500">{improvement.section}</span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">{improvement.title}</h3>
                              <p className="text-gray-600">{improvement.description}</p>
                            </div>
                            <div className="flex gap-2">
                              {improvement.applied ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => revertImprovement(improvement.id)}
                                  icon={<RefreshCw className="h-4 w-4" />}
                                >
                                  Revert
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => applyImprovement(improvement.id)}
                                  icon={<CheckCircle className="h-4 w-4" />}
                                >
                                  Apply
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">Before:</div>
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                                {improvement.before}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">After:</div>
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                                {improvement.after}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nice to Have Improvements */}
                {niceToHaveImprovements.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-blue-600" />
                      Nice to Have
                    </h2>
                    <div className="space-y-4">
                      {niceToHaveImprovements.map((improvement) => (
                        <Card key={improvement.id} className="p-6 border-l-4 border-l-blue-500">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImprovementTypeColor(improvement.type)}`}>
                                  {improvement.type.replace('-', ' ')}
                                </span>
                                <span className="text-sm text-gray-500">{improvement.section}</span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">{improvement.title}</h3>
                              <p className="text-gray-600">{improvement.description}</p>
                            </div>
                            <div className="flex gap-2">
                              {improvement.applied ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => revertImprovement(improvement.id)}
                                  icon={<RefreshCw className="h-4 w-4" />}
                                >
                                  Revert
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => applyImprovement(improvement.id)}
                                  icon={<CheckCircle className="h-4 w-4" />}
                                >
                                  Apply
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">Before:</div>
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                                {improvement.before}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">After:</div>
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                                {improvement.after}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {selectedTab === 'comparison' && (
          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Before vs After Comparison</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    Original CV (Score: {analysis.score}%)
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {originalCV || 'Original CV content would appear here...'}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    Improved CV (Projected: {Math.min(100, projectedScore)}%)
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {appliedImprovements.size > 0 
                        ? 'Improved CV with applied suggestions would appear here...'
                        : 'Apply improvements to see the enhanced version...'
                      }
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <Button
                  icon={<Download className="h-4 w-4" />}
                  disabled={appliedImprovements.size === 0}
                >
                  Download Improved CV
                </Button>
                <Button
                  variant="outline"
                  onClick={onCreateNew}
                  icon={<Edit3 className="h-4 w-4" />}
                >
                  Create New CV
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVImprover;
