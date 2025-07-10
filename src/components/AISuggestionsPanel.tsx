import React, { useState, useEffect } from 'react';
import { Lightbulb, X, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
    photo?: string;
  };
  summary: string;
  experience: any[];
  education: any[];
  skills: any[];
  languages: any[];
}

interface AISuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'tip';
  category: string;
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

interface AISuggestionsPanelProps {
  cvData: CVData;
  isVisible: boolean;
  onClose: () => void;
}

const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({ cvData, isVisible, onClose }) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  useEffect(() => {
    if (isVisible) {
      generateSuggestions();
    }
  }, [cvData, isVisible]);

  const generateSuggestions = () => {
    const newSuggestions: AISuggestion[] = [];

    // Analyze personal info
    if (!cvData.personalInfo.fullName) {
      newSuggestions.push({
        id: 'name-missing',
        type: 'warning',
        category: 'Personal Info',
        title: 'Missing Full Name',
        description: 'Your full name is required for a professional CV',
        priority: 'high'
      });
    }

    if (!cvData.personalInfo.email) {
      newSuggestions.push({
        id: 'email-missing',
        type: 'warning',
        category: 'Personal Info',
        title: 'Missing Email Address',
        description: 'Add a professional email address for employers to contact you',
        priority: 'high'
      });
    }

    if (!cvData.personalInfo.linkedin) {
      newSuggestions.push({
        id: 'linkedin-missing',
        type: 'improvement',
        category: 'Personal Info',
        title: 'Add LinkedIn Profile',
        description: 'LinkedIn profiles increase your chances of being contacted by recruiters',
        priority: 'medium'
      });
    }

    // Photo suggestions based on market
    if (!cvData.personalInfo.photo) {
      newSuggestions.push({
        id: 'photo-missing',
        type: 'tip',
        category: 'Personal Info',
        title: 'Consider Adding a Professional Photo',
        description: 'Professional photos are common in CVs for Mauritius, Germany, and European markets',
        priority: 'low'
      });
    }

    // Analyze summary
    if (!cvData.summary) {
      newSuggestions.push({
        id: 'summary-missing',
        type: 'warning',
        category: 'Summary',
        title: 'Missing Professional Summary',
        description: 'A compelling summary helps recruiters quickly understand your value proposition',
        priority: 'high'
      });
    } else if (cvData.summary.length < 100) {
      newSuggestions.push({
        id: 'summary-short',
        type: 'improvement',
        category: 'Summary',
        title: 'Expand Your Summary',
        description: 'Your summary is quite short. Consider adding more details about your experience and goals',
        priority: 'medium'
      });
    }

    // Analyze experience
    if (cvData.experience.length === 0) {
      newSuggestions.push({
        id: 'experience-missing',
        type: 'warning',
        category: 'Experience',
        title: 'No Work Experience Added',
        description: 'Add your work experience to showcase your professional background',
        priority: 'high'
      });
    } else if (cvData.experience.length < 2) {
      newSuggestions.push({
        id: 'experience-few',
        type: 'tip',
        category: 'Experience',
        title: 'Consider Adding More Experience',
        description: 'If you have more work experience, adding it can strengthen your CV',
        priority: 'low'
      });
    }

    // Check for quantifiable achievements
    const hasMetrics = cvData.experience.some(exp => 
      exp.description && /\d+%|\d+\s*(years?|months?|people|team|million|thousand|k\b)/i.test(exp.description)
    );

    if (!hasMetrics && cvData.experience.length > 0) {
      newSuggestions.push({
        id: 'metrics-missing',
        type: 'improvement',
        category: 'Experience',
        title: 'Add Quantifiable Achievements',
        description: 'Include specific numbers, percentages, and metrics to demonstrate your impact',
        action: 'Use AI Enhance to add metrics to your experience descriptions',
        priority: 'high'
      });
    }

    // Analyze skills
    if (cvData.skills.length === 0) {
      newSuggestions.push({
        id: 'skills-missing',
        type: 'warning',
        category: 'Skills',
        title: 'No Skills Listed',
        description: 'Add relevant skills to help ATS systems and recruiters find you',
        priority: 'high'
      });
    } else if (cvData.skills.length < 5) {
      newSuggestions.push({
        id: 'skills-few',
        type: 'improvement',
        category: 'Skills',
        title: 'Add More Skills',
        description: 'Consider adding more relevant skills. Aim for 5-10 key skills',
        priority: 'medium'
      });
    }

    // Analyze education
    if (cvData.education.length === 0) {
      newSuggestions.push({
        id: 'education-missing',
        type: 'tip',
        category: 'Education',
        title: 'Consider Adding Education',
        description: 'Educational background can be important for many roles',
        priority: 'low'
      });
    }

    // Language suggestions
    if (cvData.languages.length === 0) {
      newSuggestions.push({
        id: 'languages-missing',
        type: 'tip',
        category: 'Languages',
        title: 'Add Language Skills',
        description: 'Multilingual abilities are valuable in global markets like Mauritius',
        priority: 'medium'
      });
    }

    // ATS optimization tips
    newSuggestions.push({
      id: 'ats-keywords',
      type: 'tip',
      category: 'ATS Optimization',
      title: 'Use Industry Keywords',
      description: 'Include relevant keywords from job descriptions to improve ATS compatibility',
      priority: 'medium'
    });

    setSuggestions(newSuggestions);
  };

  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'improvement':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getSuggestionColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'warning':
        return 'border-red-200 bg-red-50';
      case 'improvement':
        return 'border-blue-200 bg-blue-50';
      case 'tip':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-green-200 bg-green-50';
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

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 top-24 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 max-h-[calc(100vh-120px)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          <h3 className="font-semibold">AI Suggestions</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {suggestions.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Great job!</h4>
            <p className="text-gray-600 text-sm">Your CV looks good. Keep adding content for more suggestions.</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {suggestions
              .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
              })
              .map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`p-4 rounded-lg border ${getSuggestionColor(suggestion.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">{suggestion.title}</h4>
                        {getPriorityBadge(suggestion.priority)}
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{suggestion.description}</p>
                      {suggestion.action && (
                        <p className="text-xs text-gray-600 italic">{suggestion.action}</p>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Category: {suggestion.category}
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
        <div className="text-xs text-gray-600 text-center">
          <p>💡 Suggestions update as you edit your CV</p>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsPanel;