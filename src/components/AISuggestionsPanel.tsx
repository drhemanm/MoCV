import React, { useState, useEffect } from 'react';
import { Lightbulb, X, TrendingUp, AlertTriangle, CheckCircle, Zap, User, Briefcase, GraduationCap, Award, Globe, Target, Star } from 'lucide-react';
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

interface AISuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'tip' | 'success';
  category: string;
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

interface AISuggestionsPanelProps {
  cvData: CVData;
  isVisible: boolean;
  onClose: () => void;
}

const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({ cvData, isVisible, onClose }) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [serviceStatus, setServiceStatus] = useState(getServiceStatus());
  const [completionScore, setCompletionScore] = useState(0);

  useEffect(() => {
    if (isVisible) {
      try {
        setServiceStatus(getServiceStatus());
        generateSuggestions();
        calculateCompletionScore();
      } catch (error) {
        console.error('Error generating suggestions:', error);
        setSuggestions([]);
      }
    }
  }, [cvData, isVisible]);

  const calculateCompletionScore = () => {
    let score = 0;
    const maxScore = 100;

    // Personal info (30 points)
    if (cvData.personalInfo?.fullName) score += 10;
    if (cvData.personalInfo?.email) score += 10;
    if (cvData.personalInfo?.phone) score += 5;
    if (cvData.personalInfo?.linkedin) score += 5;

    // Summary (20 points)
    if (cvData.summary && cvData.summary.length > 50) score += 20;

    // Experience (25 points)
    if (cvData.experience && cvData.experience.length > 0) score += 15;
    if (cvData.experience && cvData.experience.some(exp => exp.description && exp.description.length > 50)) score += 10;

    // Skills (15 points)
    if (cvData.skills && cvData.skills.length >= 3) score += 10;
    if (cvData.skills && cvData.skills.length >= 6) score += 5;

    // Education (10 points)
    if (cvData.education && cvData.education.length > 0) score += 10;

    setCompletionScore(Math.min(score, maxScore));
  };

  const generateSuggestions = () => {
    const newSuggestions: AISuggestion[] = [];

    try {
      // Personal Info Analysis
      if (!cvData.personalInfo?.fullName) {
        newSuggestions.push({
          id: 'name-missing',
          type: 'warning',
          category: 'Personal Info',
          title: 'Add Your Full Name',
          description: 'Your full name is essential for a professional CV',
          priority: 'high',
          icon: <User className="h-4 w-4" />
        });
      }

      if (!cvData.personalInfo?.email) {
        newSuggestions.push({
          id: 'email-missing',
          type: 'warning',
          category: 'Personal Info',
          title: 'Add Email Address',
          description: 'Employers need a way to contact you',
          priority: 'high',
          icon: <AlertTriangle className="h-4 w-4" />
        });
      }

      if (!cvData.personalInfo?.phone) {
        newSuggestions.push({
          id: 'phone-missing',
          type: 'improvement',
          category: 'Personal Info',
          title: 'Add Phone Number',
          description: 'Phone numbers make you more accessible to recruiters',
          priority: 'medium',
          icon: <TrendingUp className="h-4 w-4" />
        });
      }

      if (!cvData.personalInfo?.linkedin) {
        newSuggestions.push({
          id: 'linkedin-missing',
          type: 'improvement',
          category: 'Personal Info',
          title: 'Add LinkedIn Profile',
          description: 'LinkedIn profiles increase your visibility to recruiters by 70%',
          action: 'Add your LinkedIn URL in the Personal Info section',
          priority: 'medium',
          icon: <Target className="h-4 w-4" />
        });
      }

      // Summary Analysis
      if (!cvData.summary || cvData.summary.trim().length === 0) {
        newSuggestions.push({
          id: 'summary-missing',
          type: 'warning',
          category: 'Summary',
          title: 'Write a Professional Summary',
          description: 'A compelling summary is crucial for capturing recruiter attention',
          action: 'Go to Summary section and write 2-3 sentences about your experience',
          priority: 'high',
          icon: <User className="h-4 w-4" />
        });
      } else if (cvData.summary.length < 100) {
        newSuggestions.push({
          id: 'summary-short',
          type: 'improvement',
          category: 'Summary',
          title: 'Expand Your Summary',
          description: 'Your summary could be more detailed. Aim for 150-300 characters',
          action: 'Add more details about your experience and career goals',
          priority: 'medium',
          icon: <TrendingUp className="h-4 w-4" />
        });
      } else {
        newSuggestions.push({
          id: 'summary-good',
          type: 'success',
          category: 'Summary',
          title: 'Great Summary Length',
          description: 'Your summary has a good length and should capture attention',
          priority: 'low',
          icon: <CheckCircle className="h-4 w-4" />
        });
      }

      // Experience Analysis
      if (!cvData.experience || cvData.experience.length === 0) {
        newSuggestions.push({
          id: 'experience-missing',
          type: 'warning',
          category: 'Experience',
          title: 'Add Work Experience',
          description: 'Work experience is essential for most CV applications',
          action: 'Go to Experience section and add your work history',
          priority: 'high',
          icon: <Briefcase className="h-4 w-4" />
        });
      } else {
        // Check for quantifiable achievements
        const hasMetrics = cvData.experience.some(exp => 
          exp.description && /\d+%|\d+\s*(years?|months?|people|team|million|thousand|k\b)/i.test(exp.description)
        );

        if (!hasMetrics) {
          newSuggestions.push({
            id: 'metrics-missing',
            type: 'improvement',
            category: 'Experience',
            title: 'Add Quantifiable Achievements',
            description: 'Include specific numbers, percentages, and metrics to demonstrate impact',
            action: 'Use phrases like "increased sales by 25%" or "managed team of 8 people"',
            priority: 'high',
            icon: <TrendingUp className="h-4 w-4" />
          });
        }

        // Check for action verbs
        const hasWeakVerbs = cvData.experience.some(exp =>
          exp.description && /\b(worked|helped|did|was responsible|handled)\b/i.test(exp.description)
        );

        if (hasWeakVerbs) {
          newSuggestions.push({
            id: 'weak-verbs',
            type: 'improvement',
            category: 'Experience',
            title: 'Use Stronger Action Verbs',
            description: 'Replace weak verbs with powerful action words',
            action: 'Use "Led", "Implemented", "Achieved", "Optimized" instead of "worked", "helped"',
            priority: 'medium',
            icon: <Zap className="h-4 w-4" />
          });
        }

        if (cvData.experience.length >= 2) {
          newSuggestions.push({
            id: 'experience-good',
            type: 'success',
            category: 'Experience',
            title: 'Good Work History',
            description: 'You have a solid work experience section',
            priority: 'low',
            icon: <CheckCircle className="h-4 w-4" />
          });
        }
      }

      // Skills Analysis
      if (!cvData.skills || cvData.skills.length === 0) {
        newSuggestions.push({
          id: 'skills-missing',
          type: 'warning',
          category: 'Skills',
          title: 'Add Your Skills',
          description: 'Skills help ATS systems match you to relevant jobs',
          action: 'Add both technical and soft skills relevant to your field',
          priority: 'high',
          icon: <Award className="h-4 w-4" />
        });
      } else if (cvData.skills.length < 5) {
        newSuggestions.push({
          id: 'skills-few',
          type: 'improvement',
          category: 'Skills',
          title: 'Add More Skills',
          description: 'Aim for 5-10 relevant skills to improve ATS matching',
          action: 'Include both technical skills and soft skills',
          priority: 'medium',
          icon: <TrendingUp className="h-4 w-4" />
        });
      } else {
        newSuggestions.push({
          id: 'skills-good',
          type: 'success',
          category: 'Skills',
          title: 'Great Skills Section',
          description: 'You have a comprehensive skills list',
          priority: 'low',
          icon: <CheckCircle className="h-4 w-4" />
        });
      }

      // Education Analysis
      if (!cvData.education || cvData.education.length === 0) {
        newSuggestions.push({
          id: 'education-missing',
          type: 'tip',
          category: 'Education',
          title: 'Consider Adding Education',
          description: 'Educational background can strengthen your CV',
          action: 'Add your highest degree or relevant certifications',
          priority: 'medium',
          icon: <GraduationCap className="h-4 w-4" />
        });
      }

      // Projects Analysis
      if (!cvData.projects || cvData.projects.length === 0) {
        newSuggestions.push({
          id: 'projects-missing',
          type: 'tip',
          category: 'Projects',
          title: 'Showcase Your Projects',
          description: 'Projects demonstrate practical skills and initiative',
          action: 'Add personal, academic, or professional projects',
          priority: 'medium',
          icon: <Globe className="h-4 w-4" />
        });
      }

      // ATS Optimization Tips
      newSuggestions.push({
        id: 'ats-keywords',
        type: 'tip',
        category: 'ATS Optimization',
        title: 'Use Industry Keywords',
        description: 'Include relevant keywords from job descriptions to improve ATS compatibility',
        action: 'Review job postings and include matching terms naturally in your content',
        priority: 'medium',
        icon: <Target className="h-4 w-4" />
      });

      newSuggestions.push({
        id: 'ats-format',
        type: 'tip',
        category: 'ATS Optimization',
        title: 'Keep Formatting Simple',
        description: 'ATS systems prefer clean, simple formatting without complex layouts',
        action: 'Avoid tables, graphics, and unusual fonts in your final CV',
        priority: 'low',
        icon: <CheckCircle className="h-4 w-4" />
      });

      // AI Service Status
      if (!serviceStatus.openaiAvailable) {
        newSuggestions.push({
          id: 'ai-service-config',
          type: 'tip',
          category: 'AI Features',
          title: 'Unlock Advanced AI Features',
          description: 'Configure OpenAI API key to get AI-powered content enhancement',
          action: 'Add VITE_OPENAI_API_KEY to your environment variables',
          priority: 'low',
          icon: <Zap className="h-4 w-4" />
        });
      }

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      // Set fallback suggestions
      setSuggestions([
        {
          id: 'fallback-tip',
          type: 'tip',
          category: 'General',
          title: 'Keep Building Your CV',
          description: 'Continue adding content to get personalized suggestions',
          priority: 'low',
          icon: <Lightbulb className="h-4 w-4" />
        }
      ]);
    }
  };

  const getSuggestionColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'warning':
        return 'border-red-200 bg-red-50';
      case 'improvement':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'tip':
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  const getSuggestionTextColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'warning':
        return 'text-red-700';
      case 'improvement':
        return 'text-blue-700';
      case 'success':
        return 'text-green-700';
      case 'tip':
      default:
        return 'text-yellow-700';
    }
  };

  const getPriorityBadge = (priority: AISuggestion['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getCompletionColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 top-24 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 max-h-[calc(100vh-120px)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">AI Tips & Suggestions</h3>
            <p className="text-xs text-purple-100">
              {serviceStatus.openaiAvailable ? 'AI-Powered' : 'Smart Analysis'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Completion Score */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">CV Completion</span>
          <span className={`text-sm font-bold ${getCompletionColor(completionScore)}`}>
            {completionScore}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              completionScore >= 80 ? 'bg-green-500' : 
              completionScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${completionScore}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {completionScore >= 80 ? 'Excellent! Your CV is well-structured' :
           completionScore >= 60 ? 'Good progress! Add more details' :
           'Keep going! Your CV needs more content'}
        </p>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
        {suggestions.length === 0 ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Analyzing your CV...</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {/* Priority suggestions first */}
            {suggestions
              .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
              })
              .map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`p-3 rounded-lg border ${getSuggestionColor(suggestion.type)} transition-all hover:shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <div className={getSuggestionTextColor(suggestion.type)}>
                      {suggestion.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                          {suggestion.title}
                        </h4>
                        {getPriorityBadge(suggestion.priority)}
                      </div>
                      <p className="text-gray-700 text-xs mb-2 leading-relaxed">
                        {suggestion.description}
                      </p>
                      {suggestion.action && (
                        <div className="bg-white bg-opacity-50 rounded p-2 mt-2">
                          <p className="text-xs text-gray-600 italic">
                            💡 {suggestion.action}
                          </p>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {suggestion.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Star className="h-3 w-3 text-yellow-500" />
            <span>Tips update as you edit</span>
          </div>
          {!serviceStatus.openaiAvailable ? (
            <p className="text-yellow-600">
              ⚡ Basic mode - Configure OpenAI for advanced AI features
            </p>
          ) : (
            <p className="text-green-600">
              🤖 AI-powered suggestions active
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsPanel;