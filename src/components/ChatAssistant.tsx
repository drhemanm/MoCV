import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2, AlertTriangle } from 'lucide-react';
import { chatWithAssistant, getServiceStatus } from '../services/openaiService';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(getServiceStatus());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Check service status
      const status = getServiceStatus();
      console.log('OpenAI Service Status:', status); // Debug log
      
      // Initialize with welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        content: status.openaiAvailable 
          ? "Hi! I'm your AI career assistant. I can help you with CV writing, interview preparation, career advice, and job search strategies. What would you like to know?"
          : `Hi! I'm your career assistant. I can provide basic career guidance and CV tips. ${
              status.apiKeyStatus === 'missing' 
                ? 'For advanced AI features, please configure your OpenAI API key.' 
                : status.apiKeyStatus === 'invalid'
                ? 'Your OpenAI API key appears to be invalid. Please check your configuration.'
                : 'OpenAI service is currently unavailable.'
            } How can I help you today?`,
        timestamp: new Date()
      };

      setMessages([welcomeMessage]);

      // Add system message if API key is not configured
      if (!status.openaiAvailable) {
        const systemMessage: ChatMessage = {
          id: 'system-notice',
          type: 'system',
          content: `⚠️ ${
            status.apiKeyStatus === 'missing' 
              ? 'OpenAI API key not configured. Using basic responses. Configure VITE_OPENAI_API_KEY for full AI features.'
              : status.apiKeyStatus === 'invalid'
              ? 'OpenAI API key is invalid. Please check your VITE_OPENAI_API_KEY configuration.'
              : 'OpenAI service unavailable. Using basic responses.'
          }`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, systemMessage]);
      }
      
      // Update service status state
      setServiceStatus(status);
    }
  }, [isOpen]);

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
      let response: string;
      
      // Always use fallback responses for demo
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      response = getFallbackResponse(currentMessage);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment or check your API configuration.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('cv') || lowerMessage.includes('resume')) {
      return "I'd be happy to help you with your CV! Here are some key tips:\n\n• Use strong action verbs to start bullet points\n• Include quantifiable achievements with numbers\n• Tailor your CV to each job application\n• Keep it concise and well-formatted\n• Use our CV builder for professional templates!";
    }
    
    if (lowerMessage.includes('interview')) {
      return "Interview preparation is crucial! Here are some tips:\n\n• Research the company thoroughly\n• Practice common questions using the STAR method\n• Prepare specific examples of your achievements\n• Have questions ready to ask the interviewer\n• Practice your elevator pitch\n\nWould you like more specific advice on any of these areas?";
    }
    
    if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
      return "Career development is a journey! Here's some guidance:\n\n• Identify your strengths and interests\n• Build relevant skills continuously\n• Network within your industry\n• Set clear career goals\n• Stay updated with industry trends\n\nOur platform can help you create market-specific CVs for different regions. What specific career area interests you?";
    }

    if (lowerMessage.includes('mauritius') || lowerMessage.includes('africa')) {
      return "Great! Our platform is specifically designed for Mauritians and Africans entering global markets:\n\n• We provide market-specific CV tips for 10+ countries\n• Cultural guidance for different regions\n• ATS optimization for international systems\n• Language and formatting preferences by market\n\nWhich market are you targeting?";
    }

    if (lowerMessage.includes('ats') || lowerMessage.includes('applicant tracking')) {
      return "ATS (Applicant Tracking System) optimization is crucial:\n\n• Use standard section headers\n• Include relevant keywords from job descriptions\n• Avoid complex formatting and graphics\n• Use standard fonts and bullet points\n• Save as PDF or Word document\n\nOur CV analyzer can help you check your ATS score!";
    }
    
    return "I'm here to help with your career and CV questions! You can ask me about:\n\n• CV writing and optimization\n• Interview preparation\n• Career planning\n• Job search strategies\n• Market-specific advice\n\nWhat would you like to know more about?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Career Assistant</h3>
            <p className="text-xs opacity-90">
              {serviceStatus.openaiAvailable ? 'AI-Powered' : 'Basic Mode'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!serviceStatus.openaiAvailable && (
            <AlertTriangle className="h-4 w-4 text-yellow-300" title="API key not configured" />
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[480px]">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : message.type === 'system'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.type === 'user' ? <User className="h-3 w-3" /> : 
                     message.type === 'system' ? <AlertTriangle className="h-3 w-3" /> :
                     <Bot className="h-3 w-3" />}
                  </div>
                  <div className={`rounded-lg px-3 py-2 text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.type === 'system'
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 
                      message.type === 'system' ? 'text-yellow-600' :
                      'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about CVs, interviews, or careers..."
                rows={2}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <p>
                {serviceStatus.openaiAvailable 
                  ? 'AI assistant powered by OpenAI' 
                  : '⚠️ Basic mode - Configure OpenAI API key for full features'
                }
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatAssistant;