import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, CheckCircle, AlertTriangle, Target, Lightbulb, 
  BarChart3, Star, Zap, ArrowRight, Download, RefreshCw,
  Eye, Edit3, Copy, ThumbsUp, ThumbsDown, Sparkles
} from 'lucide-react';

interface CVImproverProps {
  analysis: any; // The actual analysis from job analyzer
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
  priority: number;
}

const CVImprover: React.FC<CVImproverProps> = ({
  analysis,
  originalCV,
  onBack,
  onCreateNew
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'improvements' | 'comparison'>('overview');
  const [improvements, setImprovements] = useState<ImprovementSuggestion[]>([]);
  const [isGeneratingImprovements, setIsGeneratingImprovements] = useState(true);
  const [appliedImprovements, setAppliedImprovements] = useState<Set<string>>(new Set());

  // Generate REAL improvement suggestions based on actual analysis
  useEffect(() => {
    generateRealImprovements();
  }, [analysis, originalCV]);

  const generateRealImprovements = async () => {
    setIsGeneratingImprovements(true);
    console.log('🔄 Generating real improvements based on analysis:', analysis);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const realImprovements = await createDynamicSuggestions(analysis, originalCV);
      setImprovements(realImprovements);
      console.log('✅ Generated', realImprovements.length, 'dynamic improvements');
    } catch (error) {
      console.error('❌ Error generating improvements:', error);
      // Fallback to basic suggestions
      setImprovements(getBasicImprovements(analysis));
    } finally {
      setIsGeneratingImprovements(false);
    }
  };

  const createDynamicSuggestions = async (analysisData: any, cvText: string): Promise<ImprovementSuggestion[]> => {
    const suggestions: ImprovementSuggestion[] = [];
    let suggestionId = 1;

    // Analyze the actual CV content and analysis
    const score = analysisData.score || 0;
    const strengths = analysisData.strengths || [];
    const improvements = analysisData.improvements || [];
    const keywords = analysisData.keywords || [];
    
    console.log('📊 Analysis data:', { score, strengths: strengths.length, improvements: improvements.length });

    // 1. Score-based critical improvements
    if (score < 40) {
      suggestions.push({
        id: (suggestionId++).toString(),
        section: 'Overall',
        type: 'critical',
        title: 'Significant CV restructuring needed',
        description: `Your CV score of ${score}% indicates major improvements are needed`,
        before: 'Current CV structure and content',
        after: 'Completely restructured CV with better formatting, stronger content, and relevant keywords',
        impact: 'high',
        applied: false,
        priority: 1
      });
    } else if (score < 60) {
      suggestions.push({
        id: (suggestionId++).toString(),
        section: 'Content',
        type: 'critical',
        title: 'Strengthen core content',
        description: `Score of ${score}% suggests content needs significant enhancement`,
        before: 'Generic descriptions and weak impact statements',
        after: 'Specific, quantified achievements with clear business impact',
        impact: 'high',
        applied: false,
        priority: 1
      });
    }

    // 2. Generate suggestions from analysis improvements
    improvements.forEach((improvement: string, index: number) => {
      if (improvement && improvement.length > 10) {
        const priority = index < 2 ? 'critical' : index < 4 ? 'important' : 'nice-to-have';
        
        suggestions.push({
          id: (suggestionId++).toString(),
          section: detectSection(improvement),
          type: priority as 'critical' | 'important' | 'nice-to-have',
          title: extractTitle(improvement),
          description: improvement,
          before: generateBeforeExample(improvement, cvText),
          after: generateAfterExample(improvement, cvText),
          impact: priority === 'critical' ? 'high' : priority === 'important' ? 'medium' : 'low',
          applied: false,
          priority: index + 2
        });
      }
    });

    // 3. Keyword-based suggestions
    if (keywords.length > 0) {
      const missingKeywords = keywords.filter((keyword: string) => 
        !cvText.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (missingKeywords.length > 0) {
        suggestions.push({
          id: (suggestionId++).toString(),
          section: 'Keywords',
          type: 'important',
          title: 'Add missing industry keywords',
          description: `Include these relevant keywords: ${missingKeywords.slice(0, 5).join(', ')}`,
          before: 'Generic skill descriptions without industry-specific terms',
          after: `Enhanced descriptions including: ${missingKeywords.slice(0, 3).join(', ')}`,
          impact: 'medium',
          applied: false,
          priority: 10
        });
      }
    }

    // 4. CV length-based suggestions
    if (cvText.length < 500) {
      suggestions.push({
        id: (suggestionId++).toString(),
        section: 'Content',
        type: 'critical',
        title: 'Expand CV content',
        description: 'Your CV appears too brief and may lack important details',
        before: 'Brief, minimal descriptions',
        after: 'Detailed descriptions of achievements, responsibilities, and impact',
        impact: 'high',
        applied: false,
        priority: 2
      });
    } else if (cvText.length > 3000) {
      suggestions.push({
        id: (suggestionId++).toString(),
        section: 'Content',
        type: 'important',
        title: 'Condense CV content',
        description: 'Your CV may be too lengthy - focus on most relevant information',
        before: 'Lengthy descriptions with unnecessary details',
        after: 'Concise, impactful statements focusing on key achievements',
        impact: 'medium',
        applied: false,
        priority: 8
      });
    }

    // 5. Experience-specific suggestions
    if (cvText.toLowerCase().includes('responsible for') || cvText.toLowerCase().includes('duties included')) {
      suggestions.push({
        id: (suggestionId++).toString(),
        section: 'Experience',
        type: 'important',
        title: 'Replace passive language with action verbs',
        description: 'Transform responsibility statements into achievement-focused content',
        before: 'Responsible for managing team projects',
        after: 'Led cross-functional team of 8 members, delivering 15+ projects on time and 20% under budget',
        impact: 'medium',
        applied: false,
        priority: 5
      });
    }

    // 6. Quantification suggestions
    const hasNumbers = /\d+/.test(cvText);
    if (!hasNumbers || cvText.match(/\d+/g)?.length < 3) {
      suggestions.push({
        id: (suggestionId++).toString(),
        section: 'Achievements',
        type: 'critical',
        title: 'Add quantifiable metrics',
        description: 'Include specific numbers, percentages, and measurable results',
        before: 'Improved system performance and user satisfaction',
        after: 'Improved system performance by 35% and increased user satisfaction scores from 7.2 to 9.1',
        impact: 'high',
        applied: false,
        priority: 3
      });
    }

    // Sort by priority
    return suggestions.sort((a, b) => a.priority - b.priority).slice(0, 8); // Limit to 8 suggestions
  };

  // Helper functions for dynamic generation
  const detectSection = (improvement: string): string => {
    const text = improvement.toLowerCase();
    if (text.includes('summary') || text.includes('profile')) return 'Professional Summary';
    if (text.includes('experience') || text.includes('work') || text.includes('job')) return 'Experience';
    if (text.includes('skill') || text.includes('technical')) return 'Skills';
    if (text.includes('education') || text.includes('degree')) return 'Education';
    if (text.includes('achievement') || text.includes('accomplish')) return 'Achievements';
    if (text.includes('keyword') || text.includes('ats')) return 'ATS Optimization';
    return 'Overall';
  };

  const extractTitle = (improvement: string): string => {
    // Extract a concise title from the improvement text
    const words = improvement.split(' ');
    if (words.length <= 6) return improvement;
    
    // Look for action words at the beginning
    const actionWords = ['add', 'include', 'improve', 'enhance', 'optimize', 'strengthen', 'develop'];
    const firstWord = words[0].toLowerCase();
    
    if (actionWords.includes(firstWord)) {
      return words.slice(0, 6).join(' ') + '...';
    }
    
    return words.slice(0, 5).join(' ') + '...';
  };

  const generateBeforeExample = (improvement: string, cvText: string): string => {
    const text = improvement.toLowerCase();
    
    if (text.includes('quantif') || text.includes('metric')) {
      return 'Managed team and improved processes';
    }
    if (text.includes('action verb') || text.includes('stronger')) {
      return 'Was responsible for developing new features';
    }
    if (text.includes('keyword') || text.includes('ats')) {
      return 'Programming experience with various technologies';
    }
    if (text.includes('achievement') || text.includes('accomplish')) {
      return 'Worked on several important projects';
    }
    
    // Extract a relevant snippet from CV if possible
    const sentences = cvText.split(/[.!?]/).filter(s => s.trim().length > 20);
    if (sentences.length > 0) {
      return sentences[0].trim().substring(0, 100) + '...';
    }
    
    return 'Current CV content that needs improvement';
  };

  const generateAfterExample = (improvement: string, cvText: string): string => {
    const text = improvement.toLowerCase();
    
    if (text.includes('quantif') || text.includes('metric')) {
      return 'Led team of 12 members and improved processes, resulting in 40% efficiency increase and $200K cost savings';
    }
    if (text.includes('action verb') || text.includes('stronger')) {
      return 'Spearheaded development of 5 new features that increased user engagement by 35%';
    }
    if (text.includes('keyword') || text.includes('ats')) {
      return 'Advanced programming experience in JavaScript, React, Node.js, Python, and cloud technologies (AWS, Docker)';
    }
    if (text.includes('achievement') || text.includes('accomplish')) {
      return 'Successfully delivered 15+ high-impact projects, including a customer portal that increased satisfaction by 45%';
    }
    
    return 'Enhanced version with specific details, metrics, and stronger impact language';
  };

  // Fallback basic improvements
  const getBasicImprovements = (analysisData: any): ImprovementSuggestion[] => {
    const score = analysisData.score || 0;
    
    return [
      {
        id: '1',
        section: 'Content',
        type: score < 50 ? 'critical' : 'important',
        title: 'Improve overall content quality',
        description: `Based on your score of ${score}%, focus on strengthening your CV content`,
        before: 'Current CV content',
        after: 'Enhanced CV with improved formatting and stronger content',
        impact: 'high',
        applied: false,
        priority: 1
      },
      {
        id: '2',
        section: 'ATS Optimization',
        type: 'important',
        title: 'Optimize for ATS systems',
        description: 'Ensure your CV is compatible with Applicant Tracking Systems',
        before: 'Complex formatting that ATS cannot read',
        after: 'Clean, ATS-friendly formatting with relevant keywords',
        impact: 'medium',
        applied: false,
        priority: 2
      }
    ];
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

  const currentScore = analysis.score || 0;
  const projectedScore = Math.min(100, currentScore + (appliedImprovements.size * 8));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowRight className="h-4 w-4 transform rotate-180" />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">CV Improvement Suggestions</h1>
              <p className="text-gray-600">Personalized suggestions based on your CV analysis</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">Current Score</div>
              <div className={`text-4xl font-bold ${getScoreColor(currentScore)}`}>
                {currentScore}%
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'improvements', label: 'Improvements' },
              { key: 'comparison', label: 'Before/After' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Score Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Score</span>
                  <span className={`font-bold ${getScoreColor(currentScore)}`}>{currentScore}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Potential Score</span>
                  <span className="font-bold text-green-600">{projectedScore}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Improvements Available</span>
                  <span className="font-bold text-blue-600">{improvements.length}</span>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Strengths
              </h3>
              <div className="space-y-2">
                {(analysis.strengths || []).slice(0, 4).map((strength: string, index: number) => (
                  <div key={index} className="text-sm text-gray-700">
                    • {strength}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Improvement Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-600">{criticalImprovements.length} Critical fixes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">{importantImprovements.length} Important updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">{niceToHaveImprovements.length} Nice-to-have enhancements</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Improvements Tab */}
        {selectedTab === 'improvements' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {isGeneratingImprovements ? (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your CV</h3>
                <p className="text-gray-600">Creating personalized improvement suggestions based on your content...</p>
              </div>
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
                        <div key={improvement.id} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-l-red-500">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImprovementTypeColor(improvement.type)}`}>
                                  {improvement.type.replace('-', ' ')}
                                </span>
                                <span className="text-sm text-gray-500">{improvement.section}</span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{improvement.title}</h3>
                              <p className="text-gray-600 mb-4">{improvement.description}</p>
                            </div>
                            <button
                              onClick={() => improvement.applied ? revertImprovement(improvement.id) : applyImprovement(improvement.id)}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                improvement.applied
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {improvement.applied ? 'Applied' : 'Apply'}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Before:</h4>
                              <div className="bg-red-50 border border-red-200 rounded p-3">
                                <p className="text-sm text-gray-700">{improvement.before}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">After:</h4>
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <p className="text-sm text-gray-700">{improvement.after}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Improvements */}
                {importantImprovements.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-6 w-6 text-yellow-600" />
                      Important Improvements
                    </h2>
                    <div className="space-y-4">
                      {importantImprovements.map((improvement) => (
                        <div key={improvement.id} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-l-yellow-500">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImprovementTypeColor(improvement.type)}`}>
                                  {improvement.type.replace('-', ' ')}
                                </span>
                                <span className="text-sm text-gray-500">{improvement.section}</span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{improvement.title}</h3>
                              <p className="text-gray-600 mb-4">{improvement.description}</p>
                            </div>
                            <button
                              onClick={() => improvement.applied ? revertImprovement(improvement.id) : applyImprovement(improvement.id)}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                improvement.applied
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {improvement.applied ? 'Applied' : 'Apply'}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Before:</h4>
                              <div className="bg-red-50 border border-red-200 rounded p-3">
                                <p className="text-sm text-gray-700">{improvement.before}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">After:</h4>
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <p className="text-sm text-gray-700">{improvement.after}</p>
                              </div>
                            </div>
                          </div>
                        </div>
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
                        <div key={improvement.id} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-l-blue-500">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImprovementTypeColor(improvement.type)}`}>
                                  {improvement.type.replace('-', ' ')}
                                </span>
                                <span className="text-sm text-gray-500">{improvement.section}</span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{improvement.title}</h3>
                              <p className="text-gray-600 mb-4">{improvement.description}</p>
                            </div>
                            <button
                              onClick={() => improvement.applied ? revertImprovement(improvement.id) : applyImprovement(improvement.id)}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                improvement.applied
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {improvement.applied ? 'Applied' : 'Apply'}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Before:</h4>
                              <div className="bg-red-50 border border-red-200 rounded p-3">
                                <p className="text-sm text-gray-700">{improvement.before}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">After:</h4>
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <p className="text-sm text-gray-700">{improvement.after}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Before/After Comparison Tab */}
        {selectedTab === 'comparison' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Before vs After Comparison</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    Original CV (Score: {currentScore}%)
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
                    Improved CV (Projected: {projectedScore}%)
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
                <button
                  disabled={appliedImprovements.size === 0}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Improved CV
                </button>
                <button
                  onClick={onCreateNew}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  Create New CV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVImprover;
