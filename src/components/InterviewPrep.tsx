import React, { useState } from 'react';
import { MessageCircle, Upload, FileText, Send, Bot, User, Trophy, Target, CheckCircle, AlertCircle, Lightbulb, X, ArrowLeft } from 'lucide-react';
import { CVAnalysis } from '../types';
import BackButton from './BackButton';

interface InterviewPrepProps {
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'situational' | 'company-specific';
  difficulty: 'easy' | 'medium' | 'hard';
}

const InterviewPrep: React.FC<InterviewPrepProps> = ({ onBack }) => {
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [currentStep, setCurrentStep] = useState<'upload' | 'interview' | 'results'>('upload');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string; score: number; feedback: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [readinessScore, setReadinessScore] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type === 'application/pdf') {
      setCvText("John Doe\nSenior Software Engineer\n\nExperience:\n- Led development team of 8 engineers at TechCorp (2020-2023)\n- Implemented microservices architecture reducing system downtime by 40%\n- Mentored junior developers and conducted technical interviews\n\nSkills: JavaScript, React, Node.js, Python, AWS, Docker, Kubernetes, Team Leadership");
    } else if (file.type === 'text/plain') {
      const text = await file.text();
      setCvText(text);
    } else {
      alert('Please upload a PDF or text file');
    }
  };

  const generateQuestions = async () => {
    if (!cvText.trim() || !jobDescription.trim()) {
      alert('Please provide both your CV and the job description');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI question generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockQuestions: InterviewQuestion[] = [
      {
        id: '1',
        question: "Tell me about your experience leading a development team. How do you handle conflicts within your team?",
        category: 'behavioral',
        difficulty: 'medium'
      },
      {
        id: '2',
        question: "You mentioned implementing microservices architecture. Can you walk me through your approach and the challenges you faced?",
        category: 'technical',
        difficulty: 'hard'
      },
      {
        id: '3',
        question: "How would you handle a situation where a critical production system goes down during peak hours?",
        category: 'situational',
        difficulty: 'hard'
      },
      {
        id: '4',
        question: "Why are you interested in joining our company specifically, and how do you see yourself contributing to our engineering culture?",
        category: 'company-specific',
        difficulty: 'medium'
      },
      {
        id: '5',
        question: "Describe a time when you had to learn a new technology quickly to meet a project deadline.",
        category: 'behavioral',
        difficulty: 'easy'
      }
    ];

    setQuestions(mockQuestions);
    setCurrentStep('interview');
    setIsGenerating(false);

    // Add initial AI message
    const initialMessage: ChatMessage = {
      id: 'init',
      type: 'ai',
      content: `Great! I've analyzed your CV and the job description. I've prepared 5 customized interview questions that are likely to come up based on your background and the role requirements. Let's start with the first question. Take your time to think through your answer.`,
      timestamp: new Date()
    };

    setMessages([initialMessage]);
    
    // Add first question
    setTimeout(() => {
      const questionMessage: ChatMessage = {
        id: 'q1',
        type: 'ai',
        content: `**Question 1 (Behavioral - Medium):**\n\n${mockQuestions[0].question}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, questionMessage]);
    }, 1000);
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // Add user answer to chat
    const userMessage: ChatMessage = {
      id: `answer-${currentQuestionIndex}`,
      type: 'user',
      content: currentAnswer,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI feedback generation
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock feedback and score
    const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
    const mockFeedback = generateFeedback(currentQuestion, mockScore);

    const feedbackMessage: ChatMessage = {
      id: `feedback-${currentQuestionIndex}`,
      type: 'ai',
      content: `**Score: ${mockScore}/100**\n\n${mockFeedback}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, feedbackMessage]);

    // Store answer and feedback
    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      answer: currentAnswer,
      score: mockScore,
      feedback: mockFeedback
    }]);

    setCurrentAnswer('');
    setIsGenerating(false);

    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        
        const nextQuestionMessage: ChatMessage = {
          id: `q${nextIndex + 1}`,
          type: 'ai',
          content: `**Question ${nextIndex + 1} (${questions[nextIndex].category} - ${questions[nextIndex].difficulty}):**\n\n${questions[nextIndex].question}`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, nextQuestionMessage]);
      }, 2000);
    } else {
      // Calculate overall readiness score
      const avgScore = answers.reduce((sum, a) => sum + a.score, mockScore) / (answers.length + 1);
      setReadinessScore(Math.round(avgScore));
      
      setTimeout(() => {
        setCurrentStep('results');
      }, 2000);
    }
  };

  const generateFeedback = (question: InterviewQuestion, score: number): string => {
    const feedbacks = {
      high: [
        "Excellent answer! You demonstrated strong leadership skills and provided specific examples.",
        "Great response! You showed technical depth and practical problem-solving approach.",
        "Outstanding! You clearly articulated your thought process and showed genuine interest.",
        "Very strong answer! You provided concrete examples and showed self-awareness."
      ],
      medium: [
        "Good answer, but could be improved by adding more specific examples or metrics.",
        "Solid response, but try to be more concise and focus on the key points.",
        "Nice approach, but consider mentioning the impact or results of your actions.",
        "Good foundation, but could benefit from more details about your specific role."
      ],
      low: [
        "Your answer needs more structure. Try using the STAR method (Situation, Task, Action, Result).",
        "Consider providing more specific examples to support your points.",
        "Try to be more confident in your delivery and provide concrete examples.",
        "Focus on highlighting your achievements and the value you brought to the situation."
      ]
    };

    const category = score >= 85 ? 'high' : score >= 70 ? 'medium' : 'low';
    const randomFeedback = feedbacks[category][Math.floor(Math.random() * feedbacks[category].length)];
    
    return randomFeedback;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (currentStep === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <BackButton onClick={onBack} label="Back to Home" variant="floating" />
            </div>
            
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageCircle className="h-4 w-4" />
              AI Interview Preparation
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Prepare for Your Interview
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Upload your CV and paste the job description to get personalized mock interview questions. 
              Practice with our AI interviewer and get instant feedback to improve your performance.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* CV Upload Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Upload className="h-6 w-6 text-blue-600" />
                  Your CV
                </h2>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 mb-6 ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drop your CV here or click to browse
                  </p>
                  <p className="text-gray-500 mb-4">Supports PDF and text files</p>
                  <button
                    onClick={() => document.getElementById('cv-file-input')?.click()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </button>
                  <input
                    id="cv-file-input"
                    type="file"
                    accept=".pdf,.txt"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or paste your CV text here:
                  </label>
                  <textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    rows={12}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Paste your CV content here..."
                  />
                </div>
                
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setCvText('')}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear CV Text
                  </button>
                </div>
              </div>

              {/* Job Description Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Target className="h-6 w-6 text-indigo-600" />
                  Job Description
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste the job description you're interviewing for:
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={16}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Paste the complete job description here..."
                  />
                </div>
                
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setJobDescription('')}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear Job Description
                  </button>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <h3 className="font-semibold text-indigo-900 mb-2">🎯 What You'll Get:</h3>
                  <ul className="text-indigo-800 text-sm space-y-1">
                    <li>• 5 personalized interview questions</li>
                    <li>• Real-time feedback on your answers</li>
                    <li>• Interview readiness score</li>
                    <li>• Specific improvement suggestions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Generate Questions Button */}
            <div className="text-center mt-8">
              <button
                onClick={generateQuestions}
                disabled={isGenerating || !cvText.trim() || !jobDescription.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-6 w-6" />
                    Start Interview Practice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'interview') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mock Interview Session</h1>
                  <p className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg">
              {/* Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                          <span className="text-sm text-gray-600">AI is analyzing your answer...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex gap-4">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here... Take your time to think through your response."
                    rows={3}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    disabled={isGenerating}
                  />
                  <button
                    onClick={submitAnswer}
                    disabled={!currentAnswer.trim() || isGenerating}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Submit
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Tip: Use the STAR method (Situation, Task, Action, Result) for behavioral questions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Trophy className="h-4 w-4" />
              Interview Complete!
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Your Interview Performance
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Great job completing the mock interview! Here's your detailed performance analysis and suggestions for improvement.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Overall Score */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Interview Readiness Score</h2>
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeDasharray={`${readinessScore}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{readinessScore}%</span>
                </div>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getScoreColor(readinessScore)}`}>
                {readinessScore >= 85 ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Excellent - You're interview ready!
                  </>
                ) : readinessScore >= 70 ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    Good - Some areas to improve
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    Needs work - Practice more
                  </>
                )}
              </div>
            </div>

            {/* Question Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Question-by-Question Analysis</h2>
              <div className="space-y-6">
                {answers.map((answer, index) => {
                  const question = questions.find(q => q.id === answer.questionId);
                  return (
                    <div key={answer.questionId} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Question {index + 1}: {question?.category} ({question?.difficulty})
                          </h3>
                          <p className="text-gray-700 mb-3">{question?.question}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(answer.score)}`}>
                          {answer.score}/100
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Your Answer:</h4>
                        <p className="text-gray-700 text-sm">{answer.answer}</p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Feedback:
                        </h4>
                        <p className="text-blue-800 text-sm">{answer.feedback}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Improvement Areas</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                  <h3 className="font-semibold text-yellow-900 mb-3">Structure Your Answers</h3>
                  <p className="text-yellow-800 text-sm mb-3">
                    Use the STAR method (Situation, Task, Action, Result) for behavioral questions to provide clear, structured responses.
                  </p>
                  <div className="text-xs text-yellow-700">
                    Practice tip: Write down 3-5 STAR stories you can adapt to different questions.
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Quantify Your Impact</h3>
                  <p className="text-blue-800 text-sm mb-3">
                    Include specific numbers, percentages, and metrics to demonstrate the impact of your work.
                  </p>
                  <div className="text-xs text-blue-700">
                    Practice tip: Prepare metrics for your top 5 achievements.
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3">Show Enthusiasm</h3>
                  <p className="text-green-800 text-sm mb-3">
                    Demonstrate genuine interest in the role and company through your tone and specific examples.
                  </p>
                  <div className="text-xs text-green-700">
                    Practice tip: Research the company's recent news and achievements.
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-3">Ask Smart Questions</h3>
                  <p className="text-purple-800 text-sm mb-3">
                    Prepare thoughtful questions about the role, team, and company culture to show your interest.
                  </p>
                  <div className="text-xs text-purple-700">
                    Practice tip: Prepare 5-7 questions about different aspects of the role.
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setCurrentStep('upload');
                  setMessages([]);
                  setAnswers([]);
                  setCurrentQuestionIndex(0);
                  setCvText('');
                  setJobDescription('');
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Practice Again
              </button>
              <button
                onClick={onBack}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default InterviewPrep;