// src/components/AIInsightsPanel.tsx
import React, { useState, useEffect } from 'react';
import { 
  Brain, X, TrendingUp, AlertTriangle, CheckCircle, Target, 
  BarChart3, Users, Clock, Award, FileText, Zap, Eye,
  ThumbsUp, ThumbsDown, RefreshCw, Copy, Download
} from 'lucide-react';
import { getServiceStatus } from '../services/openaiService';

interface CVData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    photo?: string;
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

interface AIInsight {
  id: string;
  type: 'strength' | 'improvement' | 'keyword' | 'ats' | 'market';
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  action?: string;
  example?: string;
  metrics?: {
    before: number;
    after: number;
    improvement: number;
  };
}

interface MarketAnalysis {
  overallScore: number;
  marketFit: number;
  atsCompatibility: number;
  keywordDensity: number;
  sections: {
    [key: string]: {
      score: number;
      feedback: string;
      keywords: string[];
    };
  };
}

interface AIInsightsPanelProps {
  cvData: CVData;
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
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'keywords' | 'ats'>('overview');
  const [serviceStatus, setServiceStatus] = useState(getServiceStatus());

  useEffect(() => {
    if (isVisible) {
      setServiceStatus(getServiceStatus());
      analyzeCV();
    }
  }, [cvData, targetMarket, isVisible]);

  const analyzeCV = async () => {
    setIsAnalyzing(true);
    
    try {
      // Generate insights based on CV data
      const generatedInsights = generateInsights();
      setInsights(generatedInsights);
      
      // Generate market analysis
      const analysis = generateMarketAnalysis();
      setMarketAnalysis(analysis);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error('Error analyzing CV:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    // Analyze CV completeness and quality
    const wordCount = calculateWordCount();
    const sectionScores = analyzeSections();
    
    // Experience insights
    if (cvData.experience && cvData.experience.length > 0) {
      const hasMetrics = cvData.experience.some(exp => 
        exp.description && /\d+%|\d+\s*(years?|months?|people|team|million|thousand|k\b)/i.test(exp.description)
      );
      
      if (!hasMetrics) {
        insights.push({
          id: 'metrics-missing',
          type: 'improvement',
          category: 'Experience',
          title: 'Add Quantifiable Achievements',
          description: 'Your experience lacks specific metrics and numbers that recruiters love to see.',
          impact: 'high',
          confidence: 90,
          action: 'Add percentages, dollar amounts, team sizes, or project timelines',
          example: 'Instead of "improved sales", write "increased sales by 25% over 6 months"',
          metrics: { before: 40, after: 85, improvement: 45 }
        });
      } else {
        insights.push({
          id: 'metrics-good',
          type: 'strength',
          category: 'Experience',
          title: 'Strong Quantified Results',
          description: 'Your experience section includes specific metrics and achievements.',
          impact: 'high',
          confidence: 95
        });
      }
      
      // Check for action verbs
      const hasWeakVerbs = cvData.experience.some(exp =>
        exp.description && /\b(worked|helped|did|was responsible|handled)\b/i.test(exp.description)
      );
      
      if (hasWeakVerbs) {
        insights.push({
          id: 'weak-verbs',
          type: 'improvement',
          category: 'Experience',
          title: 'Upgrade Your Action Verbs',
          description: 'Some descriptions use weak verbs that don\'t showcase your impact.',
          impact: 'medium',
          confidence: 85,
          action: 'Replace weak verbs with power words',
          example: 'Use "Led", "Implemented", "Optimized" instead of "worked on", "helped with"'
        });
      }
    }

    // Skills analysis
    if (cvData.skills && cvData.skills.length > 0) {
      if (cvData.skills.length >= 8) {
        insights.push({
          id: 'skills-comprehensive',
          type: 'strength',
          category: 'Skills',
          title: 'Comprehensive Skills Profile',
          description: 'You have a well-rounded skills section that covers multiple areas.',
          impact: 'medium',
          confidence: 80
        });
      } else {
        insights.push({
          id: 'skills-expand',
          type: 'improvement',
          category: 'Skills',
          title: 'Expand Your Skills Section',
          description: 'Adding more relevant skills could improve your ATS matching score.',
          impact: 'medium',
          confidence: 75,
          action: 'Add 3-5 more skills relevant to your target role'
        });
      }
      
      // Check for skill categorization
      const categories = new Set(cvData.skills.map(skill => skill.category));
      if (categories.size >= 3) {
        insights.push({
          id: 'skills-organized',
          type: 'strength',
          category: 'Skills',
          title: 'Well-Organized Skills',
          description: 'Your skills are properly categorized, making them easy to scan.',
          impact: 'low',
          confidence: 85
        });
      }
    }

    // Summary analysis
    if (cvData.summary) {
      if (cvData.summary.length > 200) {
        insights.push({
          id: 'summary-detailed',
          type: 'strength',
          category: 'Summary',
          title: 'Detailed Professional Summary',
          description: 'Your summary provides a comprehensive overview of your background.',
          impact: 'medium',
          confidence: 80
        });
      } else if (cvData.summary.length < 100) {
        insights.push({
          id: 'summary-short',
          type: 'improvement',
          category: 'Summary',
          title: 'Expand Your Summary',
          description: 'Your summary could be more detailed to better capture attention.',
          impact: 'medium',
          confidence: 85,
          action: 'Aim for 150-300 characters with specific achievements and goals'
        });
      }
    }

    // ATS optimization insights
    const keywordDensity = calculateKeywordDensity();
    if (keywordDensity < 0.02) {
      insights.push({
        id: 'ats-keywords',
        type: 'ats',
        category: 'ATS Optimization',
        title: 'Increase Keyword Density',
        description: 'Your CV may not have enough industry-specific keywords for ATS systems.',
        impact: 'high',
        confidence: 80,
        action: 'Include more job-relevant keywords naturally throughout your CV'
      });
    }

    // Market-specific insights
    if (targetMarket) {
      insights.push({
        id: 'market-fit',
        type: 'market',
        category: 'Market Alignment',
        title: `${targetMarket} Market Insights`,
        description: `Your CV is being optimized for the ${targetMarket} job market.`,
        impact: 'medium',
        confidence: 70,
        action: 'Consider adding market-specific keywords and formatting preferences'
      });
    }

    // Length analysis
    if (wordCount > 800) {
      insights.push({
        id: 'length-long',
        type: 'improvement',
        category: 'Format',
        title: 'CV Length Optimization',
        description: 'Your CV might be too long for quick recruiter scanning.',
        impact: 'medium',
        confidence: 75,
        action: 'Consider condensing to 1-2 pages for better readability'
      });
    }

    return insights.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  };

  const generateMarketAnalysis = (): MarketAnalysis => {
    const overallScore = calculateOverallScore();
    const marketFit = calculateMarketFit();
    const atsCompatibility = calculateATSCompatibility();
    const keywordDensity = calculateKeywordDensity();

    return {
      overallScore,
      marketFit,
      atsCompatibility,
      keywordDensity,
      sections: {
        experience: {
          score: cvData.experience?.length > 0 ? 85 : 40,
          feedback: cvData.experience?.length > 0 ? 'Strong experience section' : 'Add work experience',
          keywords: ['leadership', 'management', 'development', 'implementation']
        },
        skills: {
          score: cvData.skills?.length >= 5 ? 80 : 60,
          feedback: cvData.skills?.length >= 5 ? 'Good skills coverage' : 'Add more relevant skills',
          keywords: ['technical', 'communication', 'problem-solving', 'teamwork']
        },
        education: {
          score: cvData.education?.length > 0 ? 75 : 50,
          feedback: cvData.education?.length > 0 ? 'Educational background present' : 'Consider adding education',
          keywords: ['degree', 'certification', 'training', 'course']
        }
      }
    };
  };

  const calculateWordCount = (): number => {
    let count = 0;
    if (cvData.summary) count += cvData.summary.split(/\s+/).length;
    if (cvData.experience) {
      count += cvData.experience.reduce((acc, exp) => 
        acc + (exp.description ? exp.description.split(/\s+/).length : 0), 0
      );
    }
    return count;
  };

  const calculateOverallScore = (): number => {
    let score = 0;
    let factors = 0;

    // Personal info completeness (20 points)
    if (cvData.personalInfo?.fullName) score += 5, factors++;
    if (cvData.personalInfo?.email) score += 5, factors++;
    if (cvData.personalInfo?.phone) score += 3, factors++;
    if (cvData.personalInfo?.linkedin) score += 7, factors++;

    // Summary (20 points)
    if (cvData.summary && cvData.summary.length > 100) score += 20, factors++;

    // Experience (30 points)
    if (cvData.experience && cvData.experience.length > 0) score += 20, factors++;
    if (cvData.experience && cvData.experience.some(exp => exp.description && exp.description.length > 50)) {
      score += 10, factors++;
    }

    // Skills (15 points)
    if (cvData.skills && cvData.skills.length >= 3) score += 10, factors++;
    if (cvData.skills && cvData.skills.length >= 6) score += 5, factors++;

    // Education (10 points)
    if (cvData.education && cvData.education.length > 0) score += 10, factors++;

    // Projects (5 points)
    if (cvData.projects && cvData.projects.length > 0) score += 5, factors++;

    return Math.min(Math.round(score), 100);
  };

  const calculateMarketFit = (): number => {
    // Simplified market fit calculation
    let fit = 70; // Base score
    
    if (cvData.skills && cvData.skills.length >= 5) fit += 10;
    if (cvData.experience && cvData.experience.length >= 2) fit += 15;
    if (cvData.summary && cvData.summary.length > 150) fit += 5;
    
    return Math.min(fit, 100);
  };

  const calculateATSCompatibility = (): number => {
    let ats = 60; // Base ATS score
    
    // Standard sections present
    if (cvData.personalInfo?.fullName) ats += 10;
    if (cvData.experience && cvData.experience.length > 0) ats += 15;
    if (cvData.skills && cvData.skills.length > 0) ats += 10;
    if (cvData.education && cvData.education.length > 0) ats += 5;
    
    return Math.min(ats, 100);
  };

  const calculateKeywordDensity = (): number => {
    const wordCount = calculateWordCount();
    if (wordCount === 0) return 0;
    
    // Count industry keywords (simplified)
    const commonKeywords = ['managed', 'led', 'developed', 'implemented', 'achieved', 'improved'];
    let keywordCount = 0;
    
    const allText = [
      cvData.summary || '',
      ...(cvData.experience?.map(exp => exp.description) || [])
    ].join(' ').toLowerCase();
    
    commonKeywords.forEach(keyword => {
      const matches = (allText.match(new RegExp(keyword, 'g')) || []).length;
      keywordCount += matches;
    });
    
    return keywordCount / wordCount;
  };

  const analyzeSections = () => {
    return {
      personal: cvData.personalInfo?.fullName ? 90 : 40,
      summary: cvData.summary && cvData.summary.length > 100 ? 85 : 50,
      experience: cvData.experience && cvData.experience.length > 0 ? 80 : 30,
      skills: cvData.skills && cvData.skills.length >= 5 ? 85 : 60,
      education: cvData.education && cvData.education.length > 0 ? 80 : 50
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'strength':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'improvement':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'keyword':
        return <Target className="h-4 w-4 text-purple-600" />;
      case 'ats':
        return <BarChart3 className="h-4 w-4 text-orange-600" />;
      case 'market':
        return <Users className="h-4 w-4 text-indigo-600" />;
      default:
        return <Eye className="h-4 w-4 text-gray-600" />;
    }
  };

  const copyInsightToClipboard = (insight: AIInsight) => {
    const text = `${insight.title}\n${insight.description}\n${insight.action ? `Action: ${insight.action}` : ''}`;
    navigator.clipboard.writeText(text);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">AI CV Analysis</h2>
              <p className="text-purple-100 text-sm">
                {serviceStatus.openaiAvailable ? 'Advanced AI-Powered Insights' : 'Smart Analysis Engine'}
                {targetMarket && ` • ${targetMarket} Market`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={analyzeCV}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              Refresh Analysis
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
            { id: 'insights', label: 'AI Insights', icon: <Brain className="h-4 w-4" /> },
            { id: 'keywords', label: 'Keywords', icon: <Target className="h-4 w-4" /> },
            { id: 'ats', label: 'ATS Score', icon: <Award className="h-4 w-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your CV</h3>
                <p className="text-gray-600">Our AI is reviewing your content for insights...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && marketAnalysis && (
                <div className="space-y-6">
                  {/* Score Cards */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-blue-900">Overall Score</h3>
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(marketAnalysis.overallScore)}`}>
                        {marketAnalysis.overallScore}%
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getScoreBgColor(marketAnalysis.overallScore)}`}
                          style={{ width: `${marketAnalysis.overallScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-green-900">Market Fit</h3>
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(marketAnalysis.marketFit)}`}>
                        {marketAnalysis.marketFit}%
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getScoreBgColor(marketAnalysis.marketFit)}`}
                          style={{ width: `${marketAnalysis.marketFit}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-purple-900">ATS Score</h3>
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(marketAnalysis.atsCompatibility)}`}>
                        {marketAnalysis.atsCompatibility}%
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getScoreBgColor(marketAnalysis.atsCompatibility)}`}
                          style={{ width: `${marketAnalysis.atsCompatibility}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-orange-900">Keywords</h3>
                        <Target className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(marketAnalysis.keywordDensity * 1000)}`}>
                        {(marketAnalysis.keywordDensity * 100).toFixed(1)}%
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getScoreBgColor(marketAnalysis.keywordDensity * 1000)}`}
                          style={{ width: `${Math.min(marketAnalysis.keywordDensity * 1000, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Section Analysis */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Analysis</h3>
                    <div className="space-y-4">
                      {Object.entries(marketAnalysis.sections).map(([section, data]) => (
                        <div key={section} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 capitalize">{section}</h4>
                            <p className="text-sm text-gray-600">{data.feedback}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {data.keywords.slice(0, 3).map(keyword => (
                                <span key={keyword} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <div className={`text-xl font-bold ${getScoreColor(data.score)}`}>
                              {data.score}%
                            </div>
                            <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${getScoreBgColor(data.score)}`}
                                style={{ width: `${data.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Insights Tab */}
              {activeTab === 'insights' && (
                <div className="space-y-4">
                  {insights.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Complete</h3>
                      <p className="text-gray-600">Your CV analysis is ready. Check other tabs for detailed insights.</p>
                    </div>
                  ) : (
                    insights.map(insight => (
                      <div key={insight.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getInsightIcon(insight.type)}
                            <div>
                              <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                                  insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {insight.impact.toUpperCase()} IMPACT
                                </span>
                                <span className="text-xs text-gray-500">
                                  {insight.confidence}% confidence
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => copyInsightToClipboard(insight)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy insight"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>

                        <p className="text-gray-700 mb-3">{insight.description}</p>

                        {insight.action && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <p className="text-sm text-blue-800">
                              <strong>Action:</strong> {insight.action}
                            </p>
                          </div>
                        )}

                        {insight.example && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700">
                              <strong>Example:</strong> {insight.example}
                            </p>
                          </div>
                        )}

                        {insight.metrics && (
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-gray-600">
                              Impact: <span className="text-red-600 font-medium">{insight.metrics.before}%</span>
                              {' → '}
                              <span className="text-green-600 font-medium">{insight.metrics.after}%</span>
                            </div>
                            <div className="text-green-600 font-medium">
                              +{insight.metrics.improvement}% improvement
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Keywords Tab */}
              {activeTab === 'keywords' && marketAnalysis && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Keyword Analysis</h3>
                    <p className="text-gray-600">Keywords found in your CV that help with ATS systems</p>
                  </div>
                  
                  {Object.entries(marketAnalysis.sections).map(([section, data]) => (
                    <div key={section} className="bg-white rounded-xl border border-gray-200 p-6">
                      <h4 className="font-semibold text-gray-900 capitalize mb-3">{section} Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {data.keywords.map(keyword => (
                          <span key={keyword} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ATS Tab */}
              {activeTab === 'ats' && marketAnalysis && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">ATS Compatibility</h3>
                    <p className="text-gray-600">How well your CV works with Applicant Tracking Systems</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                    <div className="text-center mb-6">
                      <div className={`text-4xl font-bold ${getScoreColor(marketAnalysis.atsCompatibility)} mb-2`}>
                        {marketAnalysis.atsCompatibility}%
                      </div>
                      <p className="text-gray-600">ATS Compatibility Score</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">ATS-Friendly Elements</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700">Standard section headings</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700">Clear contact information</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700">Chronological format</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-700">Add more industry keywords</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-700">Include skills section</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-700">Use standard date formats</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {serviceStatus.openaiAvailable ? (
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                AI-powered analysis active
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                Smart analysis mode
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const analysisData = {
                  insights,
                  marketAnalysis,
                  generatedAt: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(analysisData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cv-analysis-report.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
