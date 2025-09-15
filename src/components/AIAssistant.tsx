// src/components/AIAssistant.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Sparkles, MessageSquare, CheckCircle, 
  ArrowRight, Clock, Target, Brain, Lightbulb, FileText,
  Star, Zap, Mic, MicOff, Volume2, VolumeX, RefreshCw,
  Copy, ThumbsUp, ThumbsDown, MoreHorizontal, Edit3
} from 'lucide-react';
import { TargetMarket, CVTemplate } from '../types';
import { BackButton } from './BackButton';
import { ButtonSpinner } from './LoadingSpinner';

interface AIAssistantProps {
  targetMarket: TargetMarket | null;
  template: CVTemplate;
  onComplete: (cvData: any) => void;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  suggestions?: string[];
  metadata?: {
    section?: string;
    confidence?: number;
    hasFollowUp?: boolean;
  };
}

interface CVSection {
  id: string;
  name: string;
  icon: any;
  description: string;
  completed: boolean;
  order: number;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  targetMarket,
  template,
  onComplete,
  onBack
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<CVSection | null>(null);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [cvData, setCvData] = useState<any>({});
  const [conversationStage, setConversationStage] = useState<'intro' | 'collecting' | 'reviewing' | 'complete'>('intro');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // CV sections to complete
  const cvSections: CVSection[] = [
    { id: 'personal', name: 'Personal Information', icon: User, description: 'Name, contact details, location', completed: false, order: 1 },
    { id: 'summary', name: 'Professional Summary', icon: FileText, description: 'Brief overview of your background', completed: false, order: 2 },
    { id: 'experience', name: 'Work Experience', icon: Briefcase, description: 'Your professional history', completed: false, order: 3 },
    { id: 'education', name: 'Education', icon: GraduationCap, description: 'Academic background', completed: false, order: 4 },
    { id: 'skills', name: 'Skills', icon: Star, description: 'Technical and soft skills', completed: false, order: 5 },
    { id: 'projects', name: 'Projects', icon: Lightbulb, description: 'Notable projects and achievements', completed: false, order: 6 }
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    const initMessage: ChatMessage = {
      id: '1',
      type: 'assistant',
      content: `Hi! I'm your AI assistant, here to help you create an amazing CV for ${targetMarket?.name || 'your target role'}. We'll work together to build your professional story step by step.\n\nI'll ask you questions about your background, and you can answer naturally - no need for formal formatting. Ready to get started?`,
      timestamp: new Date(),
      suggestions: ['Yes, let\'s start!', 'Tell me more about the process', 'What information do you need?']
    };
    
    setMessages([initMessage]);
    setConversationStage('intro');
  }, [targetMarket]);

  // Mock AI response generation
  const generateAIResponse = async (userMessage: string, context: any): Promise<ChatMessage> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const stage = conversationStage;
    const currentSectionData = currentSection;

    let response = '';
    let suggestions: string[] = [];
    let metadata: any = {};

    if (stage === 'intro') {
      if (userMessage.toLowerCase().includes('start') || userMessage.toLowerCase().includes('yes')) {
        response = `Great! Let's start with your personal information. This helps employers know how to contact you and gives a professional first impression.\n\nWhat's your full name?`;
        suggestions = ['[Enter your full name]'];
        setCurrentSection(cvSections[0]);
        setConversationStage('collecting');
        metadata = { section: 'personal', hasFollowUp: true };
      } else if (userMessage.toLowerCase().includes('process')) {
        response = `Here's how this works:\n\n1. **Personal Info** - Contact details and basic information\n2. **Professional Summary** - A compelling overview of your background\n3. **Experience** - Your work history with achievements\n4. **Education** - Academic background\n5. **Skills** - Technical and soft skills\n6. **Projects** - Notable work and achievements\n\nI'll guide you through each section with personalized questions. Ready to begin?`;
        suggestions = ['Yes, let\'s start!', 'Can you explain more about each section?'];
      } else {
        response = `I'll need to know about your background across several key areas to create your CV. We'll go through:\n\n• Personal information and contact details\n• Your professional experience and achievements\n• Education and qualifications\n• Skills and competencies\n• Notable projects or accomplishments\n\nShall we begin with your personal information?`;
        suggestions = ['Yes, let\'s start!', 'I have questions first'];
      }
    } else if (stage === 'collecting' && currentSectionData) {
      // Simulate section-specific responses
      if (currentSectionData.id === 'personal') {
        if (!cvData.name) {
          // Collecting name
          setCvData(prev => ({ ...prev, name: userMessage }));
          response = `Thanks ${userMessage}! Now, what's your professional title or the role you're targeting? For example: "Software Engineer", "Marketing Manager", "Data Scientist"`;
          suggestions = ['Software Engineer', 'Marketing Manager', 'Project Manager'];
          metadata = { section: 'personal' };
        } else if (!cvData.title) {
          // Collecting title
          setCvData(prev => ({ ...prev, title: userMessage }));
          response = `Perfect! What's the best email address to reach you at?`;
          suggestions = ['[Enter your email]'];
          metadata = { section: 'personal' };
        } else if (!cvData.email) {
          // Collecting email
          setCvData(prev => ({ ...prev, email: userMessage }));
          response = `Great! What's your phone number?`;
          suggestions = ['[Enter your phone number]'];
          metadata = { section: 'personal' };
        } else if (!cvData.phone) {
          // Collecting phone
          setCvData(prev => ({ ...prev, phone: userMessage }));
          response = `Excellent! What city and country are you located in?`;
          suggestions = ['London, UK', 'New York, USA', 'Port Louis, Mauritius'];
          metadata = { section: 'personal' };
        } else {
          // Complete personal section
          setCvData(prev => ({ ...prev, location: userMessage }));
          setCompletedSections(prev => new Set([...prev, 'personal']));
          response = `Perfect! Now let's create your professional summary. This is a brief, compelling overview of who you are professionally.\n\nTell me about your background: What's your experience level? What are your key strengths? What kind of ${targetMarket?.name.toLowerCase() || 'role'} position are you targeting?`;
          suggestions = [
            'I have 3+ years of experience...',
            'I\'m a recent graduate looking to...',
            'I\'m an experienced professional with...'
          ];
          setCurrentSection(cvSections[1]);
          metadata = { section: 'summary', hasFollowUp: true };
        }
      } else if (currentSectionData.id === 'summary') {
        setCvData(prev => ({ ...prev, summary: userMessage }));
        setCompletedSections(prev => new Set([...prev, 'summary']));
        response = `Excellent summary! Now let's talk about your work experience. \n\nLet's start with your most recent or current position. What's your job title, company name, and how long have you been there?`;
        suggestions = [
          'Software Engineer at TechCorp, 2 years',
          'Marketing Specialist at StartupXYZ, 1.5 years',
          'I\'m a recent graduate with internship experience'
        ];
        setCurrentSection(cvSections[2]);
        metadata = { section: 'experience', hasFollowUp: true };
      } else if (currentSectionData.id === 'experience') {
        // Simulate experience collection (simplified)
        setCvData(prev => ({ 
          ...prev, 
          experience: [
            {
              title: userMessage.split(' at ')[0] || 'Professional Role',
              company: userMessage.split(' at ')[1]?.split(',')[0] || 'Company Name',
              duration: userMessage.split(',')[1] || '1+ years',
              description: `Responsible for key duties in ${targetMarket?.name.toLowerCase() || 'the role'}`
            }
          ]
        }));
        setCompletedSections(prev => new Set([...prev, 'experience']));
        response = `Great! Now let's add your education. What's your highest level of education? Include the degree, institution, and graduation year.`;
        suggestions = [
          'Bachelor\'s in Computer Science, MIT, 2020',
          'Master\'s in Business, Harvard, 2019',
          'High School Diploma, 2018'
        ];
        setCurrentSection(cvSections[3]);
        metadata = { section: 'education', hasFollowUp: true };
      } else if (currentSectionData.id === 'education') {
        setCvData(prev => ({ 
          ...prev, 
          education: [{
            degree: userMessage.split(',')[0] || 'Degree',
            school: userMessage.split(',')[1] || 'Institution',
            year: userMessage.split(',')[2] || '2020'
          }]
        }));
        setCompletedSections(prev => new Set([...prev, 'education']));
        response = `Perfect! Now let's list your key skills. What are the main technical skills, tools, or technologies you're proficient in? ${targetMarket ? `Focus on skills relevant to ${targetMarket.name.toLowerCase()}.` : ''}`;
        suggestions = [
          'JavaScript, React, Node.js, Python',
          'Digital Marketing, Google Analytics, SEO',
          'Project Management, Agile, Scrum'
        ];
        setCurrentSection(cvSections[4]);
        metadata = { section: 'skills', hasFollowUp: true };
      } else if (currentSectionData.id === 'skills') {
        setCvData(prev => ({ 
          ...prev, 
          skills: userMessage.split(',').map(skill => skill.trim())
        }));
        setCompletedSections(prev => new Set([...prev, 'skills']));
        response = `Excellent! Finally, do you have any notable projects, achievements, or accomplishments you'd like to highlight? This could be work projects, personal projects, or achievements.`;
        suggestions = [
          'Built a web application that increased user engagement by 40%',
          'Led a team project that delivered $100K in savings',
          'Skip this section'
        ];
        setCurrentSection(cvSections[5]);
        metadata = { section: 'projects', hasFollowUp: true };
      } else if (currentSectionData.id === 'projects') {
        if (!userMessage.toLowerCase().includes('skip')) {
          setCvData(prev => ({ 
            ...prev, 
            projects: [{ 
              name: 'Notable Project',
              description: userMessage 
            }]
          }));
        }
        setCompletedSections(prev => new Set([...prev, 'projects']));
        setConversationStage('reviewing');
        response = `Amazing! We've collected all the information needed for your CV. Let me review what we have:\n\n✅ Personal Information\n✅ Professional Summary\n✅ Work Experience\n✅ Education\n✅ Skills\n✅ Projects\n\nYour CV is ready to be created! Should I proceed with generating your professional CV using the ${template.name} template?`;
        suggestions = ['Yes, create my CV!', 'Let me review the information first', 'I want to make changes'];
        metadata = { section: 'review', confidence: 95 };
      }
    } else if (stage === 'reviewing') {
      if (userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('create')) {
        setConversationStage('complete');
        response = `Perfect! I'm creating your professional CV now. This will be optimized for ${targetMarket?.name || 'your target industry'} and formatted using the ${template.name} template.\n\nYour CV will include all the information we discussed, professionally formatted and ready to impress employers!`;
        suggestions = [];
        metadata = { section: 'complete', confidence: 100 };
        
        // Complete the CV creation
        setTimeout(() => {
          onComplete(cvData);
        }, 2000);
      } else if (userMessage.toLowerCase().includes('review')) {
        response = `Here's a summary of your information:\n\n**Personal:** ${cvData.name} - ${cvData.title}\n**Contact:** ${cvData.email}, ${cvData.phone}\n**Location:** ${cvData.location}\n**Summary:** ${cvData.summary?.substring(0, 100)}...\n**Experience:** ${cvData.experience?.[0]?.title} at ${cvData.experience?.[0]?.company}\n**Education:** ${cvData.education?.[0]?.degree}\n**Skills:** ${cvData.skills?.join(', ')}\n\nWould you like to modify any section or create the CV?`;
        suggestions = ['Create my CV!', 'Modify my summary', 'Change my skills'];
      } else {
        response = `I can help you modify any section. Which part would you like to change?\n\n• Personal information\n• Professional summary\n• Work experience\n• Education\n• Skills\n• Projects\n\nJust let me know what you'd like to update!`;
        suggestions = ['Modify my summary', 'Update my skills', 'Change experience details'];
      }
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions,
      metadata
    };
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(currentMessage, { cvData, currentSection });
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Could you please try again?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
    inputRef.current?.focus();
  };

  // Progress calculation
  const progress = (completedSections.size / cvSections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} variant="minimal" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI CV Assistant</h1>
                <p className="text-gray-600">
                  {targetMarket ? `Creating CV for ${targetMarket.name}` : 'Building your professional CV'}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Progress: {completedSections.size}/{cvSections.length} sections
              </div>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex">
        {/* Sidebar - Progress */}
        <div className="hidden lg:block w-80 bg-white/60 backdrop-blur-sm border-r border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4">CV Sections</h3>
            <div className="space-y-3">
              {cvSections.map((section) => {
                const IconComponent = section.icon;
                const isCompleted = completedSections.has(section.id);
                const isCurrent = currentSection?.id === section.id;
                
                return (
                  <div
                    key={section.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                      ${isCompleted 
                        ? 'bg-green-50 border border-green-200' 
                        : isCurrent 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isCurrent 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <IconComponent className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${isCompleted ? 'text-green-800' : isCurrent ? 'text-blue-800' : 'text-gray-700'}`}>
                        {section.name}
                      </div>
                      <div className="text-xs text-gray-500">{section.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Template Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">Selected Template</h4>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="text-purple-800 font-medium">{template.name}</span>
            </div>
            <p className="text-purple-700 text-sm">{template.description}</p>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'assistant' && (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-2xl ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`
                      p-4 rounded-2xl shadow-sm
                      ${message.type === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-white border border-gray-200'
                      }
                    `}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {message.metadata?.confidence && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <Target className="h-3 w-3" />
                        <span>{message.metadata.confidence}% confidence</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your response here..."
                  disabled={isLoading || conversationStage === 'complete'}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <ButtonSpinner size="sm" />
                  </div>
                )}
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading || conversationStage === 'complete'}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            
            {conversationStage === 'complete' && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  <CheckCircle className="h-4 w-4" />
                  CV creation in progress...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
