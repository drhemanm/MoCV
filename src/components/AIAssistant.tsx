import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Briefcase, Target, Award, Loader2, CheckCircle } from 'lucide-react';
import { CVTemplate } from '../types';
import { TargetMarket } from '../types';
import BackButton from './BackButton';

interface AIAssistantProps {
  targetMarket: TargetMarket | null;
  template: CVTemplate;
  onComplete: (data: any) => void;
  onBack: () => void;
}

interface AIResponse {
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    description: string;
  }>;
  skills: string[];
  achievements: string[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ targetMarket, template, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>(['', '', '', '']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIResponse | null>(null);

  const questions = [
    {
      icon: <User className="h-6 w-6" />,
      title: "Tell me about yourself",
      question: "What's your current role and professional background?",
      placeholder: "e.g., I'm a Senior Software Engineer with 5 years of experience in web development, specializing in React and Node.js..."
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Your experience",
      question: "What are your key work experiences and achievements?",
      placeholder: "e.g., Led a team of 5 developers, increased application performance by 40%, launched 3 major products..."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Career goals",
      question: "What are your career goals and what type of role are you seeking?",
      placeholder: "e.g., Looking to transition into a tech lead role where I can mentor junior developers and drive technical strategy..."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Skills & strengths",
      question: "What are your key skills, certifications, and what makes you unique?",
      placeholder: "e.g., Expert in React, AWS certified, strong problem-solving skills, experience with agile methodologies..."
    }
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateContent();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const updateResponse = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentStep] = value;
    setResponses(newResponses);
  };

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate AI content generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResponse: AIResponse = {
      summary: `${responses[0]} With a proven track record in ${responses[1].split(',')[0] || 'delivering results'}, I am seeking ${responses[2].toLowerCase().includes('lead') ? 'leadership opportunities' : 'new challenges'} where I can leverage my expertise in ${responses[3].split(',')[0] || 'key technologies'} to drive innovation and business growth.`,
      experience: [
        {
          title: "Senior Software Engineer",
          company: "Tech Company",
          description: `• ${responses[1].split('.')[0] || 'Led development of key features'}\n• Improved system performance and reliability\n• Collaborated with cross-functional teams to deliver high-quality solutions`
        },
        {
          title: "Software Engineer",
          company: "Previous Company",
          description: "• Developed and maintained web applications\n• Participated in code reviews and technical discussions\n• Contributed to system architecture decisions"
        }
      ],
      skills: responses[3].split(',').map(skill => skill.trim()).filter(Boolean).slice(0, 8),
      achievements: [
        "Increased application performance by 40%",
        "Led successful migration to cloud infrastructure",
        "Mentored 3 junior developers"
      ]
    };

    setGeneratedContent(mockResponse);
    setIsGenerating(false);
  };

  const handleComplete = () => {
    if (generatedContent) {
      const cvData = {
        personalInfo: {
          fullName: '',
          title: generatedContent.experience[0]?.title || '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          website: ''
        },
        summary: generatedContent.summary,
        experience: generatedContent.experience.map((exp, index) => ({
          id: `exp-${index}`,
          title: exp.title,
          company: exp.company,
          location: '',
          startDate: '',
          endDate: '',
          current: index === 0,
          description: exp.description
        })),
        skills: generatedContent.skills.map((skill, index) => ({
          id: `skill-${index}`,
          name: skill,
          level: 4,
          category: 'Technical'
        })),
        education: [],
        projects: [],
        certifications: []
      };
      
      onComplete(cvData);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI is crafting your content...</h2>
          <p className="text-gray-600 mb-6">Analyzing your responses and generating professional CV content tailored to your experience.</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (generatedContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Content Generated!</h2>
            <p className="text-gray-600">Review the generated content below. You can edit it in the next step.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="space-y-8">
              {/* Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Professional Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{generatedContent.summary}</p>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {generatedContent.experience.map((exp, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                      <p className="text-gray-600 mb-2">{exp.company}</p>
                      <div className="text-gray-700 whitespace-pre-line">{exp.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Key Skills
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Start Over
            </button>
            <button
              onClick={handleComplete}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Continue to Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
          <p className="text-gray-600">
            Let's create compelling content for your {template.name} CV
            {targetMarket && ` optimized for ${targetMarket.name}`}
          </p>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Step {currentStep + 1} of {questions.length}</span>
            <span className="text-sm text-gray-500">{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                {questions[currentStep].icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{questions[currentStep].title}</h2>
                <p className="text-gray-600">{questions[currentStep].question}</p>
              </div>
            </div>

            <textarea
              value={responses[currentStep]}
              onChange={(e) => updateResponse(e.target.value)}
              placeholder={questions[currentStep].placeholder}
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <BackButton 
              onClick={handleBack} 
              label={currentStep === 0 ? 'Back to Method' : 'Previous'} 
            />
            
            <button
              onClick={handleNext}
              disabled={!responses[currentStep].trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {currentStep === questions.length - 1 ? (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Content
                </>
              ) : (
                <>
                  Next
                  <Send className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;