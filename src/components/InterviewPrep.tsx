// src/components/InterviewPrep.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Play, Pause, RotateCcw, CheckCircle, Clock, 
  Star, Brain, Mic, MicOff, Volume2, VolumeX, ChevronRight,
  ChevronLeft, Award, Target, Lightbulb, BarChart3, Timer,
  BookOpen, Users, Briefcase, Heart, Zap, RefreshCw
} from 'lucide-react';
import { TargetMarket } from '../types';
import { BackButton } from './BackButton';
import { Card } from './UI/Card';
import { Button } from './UI/Button';

interface InterviewPrepProps {
  targetMarket: TargetMarket | null;
  onBack: () => void;
}

interface Question {
  id: string;
  category: string;
  question: string;
  tips: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit?: number; // in seconds
  followUp?: string[];
}

interface PracticeSession {
  questionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  rating?: number;
  notes?: string;
}

const InterviewPrep: React.FC<InterviewPrepProps> = ({ targetMarket, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [practiceMode, setPracticeMode] = useState<'guided' | 'timed' | 'free'>('guided');
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [completedSessions, setCompletedSessions] = useState<PracticeSession[]>([]);
  const [showTips, setShowTips] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const timerRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>();

  // Interview questions database
  const questionDatabase: Question[] = [
    // General Questions
    {
      id: 'general-1',
      category: 'general',
      question: 'Tell me about yourself and your professional background.',
      tips: [
        'Keep it concise (2-3 minutes)',
        'Focus on professional achievements',
        'Connect your experience to the role',
        'End with why you\'re interested in this position'
      ],
      difficulty: 'beginner',
      timeLimit: 180,
      followUp: ['What motivates you in your work?', 'How do you handle stress?']
    },
    {
      id: 'general-2',
      category: 'general',
      question: 'Why are you interested in this role and our company?',
      tips: [
        'Research the company beforehand',
        'Mention specific company values or projects',
        'Explain how your skills align with their needs',
        'Show genuine enthusiasm'
      ],
      difficulty: 'beginner',
      timeLimit: 120
    },
    {
      id: 'general-3',
      category: 'general',
      question: 'What are your greatest strengths and how do they apply to this role?',
      tips: [
        'Choose 2-3 relevant strengths',
        'Provide specific examples',
        'Connect to job requirements',
        'Avoid generic answers'
      ],
      difficulty: 'beginner',
      timeLimit: 150
    },
    {
      id: 'general-4',
      category: 'general',
      question: 'Describe a challenging situation you faced at work and how you handled it.',
      tips: [
        'Use the STAR method (Situation, Task, Action, Result)',
        'Choose a relevant example',
        'Focus on your problem-solving process',
        'Highlight positive outcomes'
      ],
      difficulty: 'intermediate',
      timeLimit: 300
    },
    {
      id: 'general-5',
      category: 'general',
      question: 'Where do you see yourself in 5 years?',
      tips: [
        'Show ambition but be realistic',
        'Align with company growth opportunities',
        'Demonstrate commitment to the field',
        'Avoid mentioning other companies'
      ],
      difficulty: 'beginner',
      timeLimit: 120
    },

    // Technical Questions (adaptable to different fields)
    {
      id: 'technical-1',
      category: 'technical',
      question: 'Describe your experience with the key technologies/tools mentioned in the job description.',
      tips: [
        'Be specific about your experience level',
        'Mention relevant projects',
        'Discuss learning and adaptation',
        'Be honest about areas for growth'
      ],
      difficulty: 'intermediate',
      timeLimit: 240
    },
    {
      id: 'technical-2',
      category: 'technical',
      question: 'How do you stay updated with industry trends and best practices?',
      tips: [
        'Mention specific resources (blogs, courses, conferences)',
        'Show continuous learning mindset',
        'Discuss recent trends you\'ve followed',
        'Explain how you apply new knowledge'
      ],
      difficulty: 'intermediate',
      timeLimit: 180
    },
    {
      id: 'technical-3',
      category: 'technical',
      question: 'Walk me through your problem-solving process when faced with a complex technical challenge.',
      tips: [
        'Outline your systematic approach',
        'Mention research and collaboration',
        'Discuss testing and validation',
        'Show persistence and creativity'
      ],
      difficulty: 'advanced',
      timeLimit: 300
    },

    // Behavioral Questions
    {
      id: 'behavioral-1',
      category: 'behavioral',
      question: 'Tell me about a time when you had to work with a difficult team member.',
      tips: [
        'Focus on your actions, not blame',
        'Show empathy and professionalism',
        'Describe the resolution process',
        'Highlight positive outcomes'
      ],
      difficulty: 'intermediate',
      timeLimit: 240
    },
    {
      id: 'behavioral-2',
      category: 'behavioral',
      question: 'Describe a time when you had to meet a tight deadline.',
      tips: [
        'Explain your planning and prioritization',
        'Mention any help you sought',
        'Describe how you maintained quality',
        'Share lessons learned'
      ],
      difficulty: 'intermediate',
      timeLimit: 210
    },
    {
      id: 'behavioral-3',
      category: 'behavioral',
      question: 'Give an example of when you took initiative to improve a process or solve a problem.',
      tips: [
        'Choose a significant example',
        'Explain your motivation',
        'Detail the steps you took',
        'Quantify the impact if possible'
      ],
      difficulty: 'advanced',
      timeLimit: 270
    },

    // Leadership Questions
    {
      id: 'leadership-1',
      category: 'leadership',
      question: 'Describe your leadership style and provide an example of when you led a team.',
      tips: [
        'Define your leadership approach',
        'Provide a specific example',
        'Explain how you motivated others',
        'Discuss challenges and outcomes'
      ],
      difficulty: 'advanced',
      timeLimit: 300
    },
    {
      id: 'leadership-2',
      category: 'leadership',
      question: 'How do you handle conflicts within your team?',
      tips: [
        'Show diplomatic approach',
        'Mention active listening',
        'Describe mediation techniques',
        'Focus on resolution and learning'
      ],
      difficulty: 'advanced',
      timeLimit: 240
    }
  ];

  // Filter questions based on category and difficulty
  const filteredQuestions = questionDatabase.filter(q => {
    const categoryMatch = selectedCategory === 'all' || q.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const categories = [
    { id: 'all', name: 'All Questions', icon: BookOpen },
    { id: 'general', name: 'General', icon: MessageSquare },
    { id: 'technical', name: 'Technical', icon: Brain },
    { id: 'behavioral', name: 'Behavioral', icon: Users },
    { id: 'leadership', name: 'Leadership', icon: Award }
  ];

  // Timer functionality
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const startPractice = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    setCurrentSession({
      questionId: currentQuestion.id,
      startTime: new Date()
    });
  };

  const pausePractice = () => {
    setIsPaused(!isPaused);
  };

  const stopPractice = () => {
    setIsRecording(false);
    setIsPaused(false);
    
    if (currentSession) {
      const endTime = new Date();
      const duration = recordingTime;
      const completedSession: PracticeSession = {
        ...currentSession,
        endTime,
        duration
      };
      setCompletedSessions(prev => [...prev, completedSession]);
    }
    
    setCurrentSession(null);
    setRecordingTime(0);
  };

  const resetPractice = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setCurrentSession(null);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetPractice();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetPractice();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeWarning = () => {
    if (!currentQuestion?.timeLimit) return null;
    const timeLeft = currentQuestion.timeLimit - recordingTime;
    if (timeLeft <= 30 && timeLeft > 0) {
      return 'warning'; // 30 seconds left
    } else if (timeLeft <= 0) {
      return 'danger'; // time's up
    }
    return null;
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">No questions available</h2>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more questions.</p>
            <Button onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}>
              Reset Filters
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <BackButton onClick={onBack} variant="minimal" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Interview Preparation</h1>
              <p className="text-gray-600">
                Practice interview questions for {targetMarket?.name || 'your target role'}
              </p>
            </div>
            
            {/* Practice Stats */}
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">Session Progress</div>
              <div className="text-2xl font-bold text-blue-600">
                {currentQuestionIndex + 1} / {filteredQuestions.length}
              </div>
              <div className="text-sm text-gray-500">
                {completedSessions.length} completed
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setCurrentQuestionIndex(0);
                      resetPractice();
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value as any);
                setCurrentQuestionIndex(0);
                resetPractice();
              }}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Current Question Card */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Practice Question</h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className="text-gray-500 text-sm">{currentQuestion.category}</span>
                    {currentQuestion.timeLimit && (
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(currentQuestion.timeLimit)} suggested
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowTips(!showTips)}
                icon={<Lightbulb className="h-4 w-4" />}
                size="sm"
              >
                {showTips ? 'Hide Tips' : 'Show Tips'}
              </Button>
            </div>

            {/* Question */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentQuestion.question}
              </h3>
              
              {currentQuestion.timeLimit && (
                <div className="text-sm text-gray-600">
                  Suggested response time: {formatTime(currentQuestion.timeLimit)}
                </div>
              )}
            </div>

            {/* Tips */}
            {showTips && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Tips for answering this question:
                </h4>
                <ul className="space-y-1">
                  {currentQuestion.tips.map((tip, index) => (
                    <li key={index} className="text-yellow-700 text-sm flex items-start gap-2">
                      <div className="w-1 h-1 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recording Controls */}
            <div className="text-center">
              {/* Timer Display */}
              <div className="mb-6">
                <div className={`text-6xl font-bold mb-2 ${
                  getTimeWarning() === 'danger' ? 'text-red-600' :
                  getTimeWarning() === 'warning' ? 'text-yellow-600' : 'text-gray-900'
                }`}>
                  {formatTime(recordingTime)}
                </div>
                
                {currentQuestion.timeLimit && (
                  <div className="text-sm text-gray-500">
                    {getTimeWarning() === 'danger' ? 'Time is up!' :
                     getTimeWarning() === 'warning' ? 'Wrap up your answer' :
                     `${formatTime(currentQuestion.timeLimit - recordingTime)} remaining`}
                  </div>
                )}
                
                {isRecording && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 text-sm font-medium">Recording...</span>
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-4 mb-6">
                {!isRecording ? (
                  <Button
                    onClick={startPractice}
                    icon={<Play className="h-5 w-5" />}
                    size="lg"
                  >
                    Start Practice
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={pausePractice}
                      variant="outline"
                      icon={isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                      size="lg"
                    >
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button
                      onClick={stopPractice}
                      variant="danger"
                      icon={<CheckCircle className="h-5 w-5" />}
                      size="lg"
                    >
                      Finish Answer
                    </Button>
                  </>
                )}
                
                <Button
                  onClick={resetPractice}
                  variant="outline"
                  icon={<RotateCcw className="h-5 w-5" />}
                  size="lg"
                  disabled={!isRecording && recordingTime === 0}
                >
                  Reset
                </Button>
              </div>

              {/* Progress Bar */}
              {currentQuestion.timeLimit && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getTimeWarning() === 'danger' ? 'bg-red-500' :
                      getTimeWarning() === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((recordingTime / currentQuestion.timeLimit) * 100, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          </Card>

          {/* Navigation */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                Previous Question
              </Button>

              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Question</div>
                <div className="text-lg font-bold text-gray-900">
                  {currentQuestionIndex + 1} of {filteredQuestions.length}
                </div>
              </div>

              <Button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === filteredQuestions.length - 1}
                icon={<ChevronRight className="h-4 w-4" />}
              >
                Next Question
              </Button>
            </div>
          </Card>

          {/* Follow-up Questions */}
          {currentQuestion.followUp && currentQuestion.followUp.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Potential Follow-up Questions
              </h3>
              <div className="space-y-2">
                {currentQuestion.followUp.map((followUp, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{followUp}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Practice Statistics */}
          {completedSessions.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Practice Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedSessions.length}</div>
                  <div className="text-gray-600 text-sm">Questions Practiced</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(Math.round(completedSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / completedSessions.length))}
                  </div>
                  <div className="text-gray-600 text-sm">Average Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatTime(completedSessions.reduce((sum, session) => sum + (session.duration || 0), 0))}
                  </div>
                  <div className="text-gray-600 text-sm">Total Practice Time</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
