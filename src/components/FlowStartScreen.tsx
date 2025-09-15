// src/components/FlowStartScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Zap, Target, MessageSquare, FileText, TrendingUp, 
  Users, Award, Clock, ArrowRight, ChevronRight, Play,
  BarChart3, Brain, Rocket, Shield, Star, Globe, Crown,
  PlusCircle, Search, RotateCcw, Briefcase, GraduationCap,
  Code, Palette, Stethoscope, Calculator, Hammer, Mic
} from 'lucide-react';
import { GameData } from '../types';

interface FlowStartScreenProps {
  gameData: GameData;
  onImproveCV: () => void;
  onCreateNew: () => void;
  onAnalyzeVsJob: () => void;
  onInterviewPrep: () => void;
  onMyCVs: () => void;
}

const FlowStartScreen: React.FC<FlowStartScreenProps> = ({
  gameData,
  onImproveCV,
  onCreateNew,
  onAnalyzeVsJob,
  onInterviewPrep,
  onMyCVs
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🌅 Good morning';
    if (hour < 17) return '☀️ Good afternoon';
    return '🌙 Good evening';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Your dream job is just one great CV away!",
      "Every professional journey begins with a perfect CV.",
      "Today's the day to level up your career game!",
      "Transform your experience into opportunity.",
      "Your next career breakthrough starts here."
    ];
    return messages[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % messages.length];
  };

  // Primary action cards with stunning designs
  const primaryActions = [
    {
      id: 'create',
      title: 'Create New CV',
      subtitle: 'Build from scratch with AI guidance',
      description: 'Choose from 50+ professional templates and let our AI help you craft the perfect CV',
      icon: PlusCircle,
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
      iconColor: 'text-white',
      stats: ['50+ Templates', 'AI-Powered', '5 min setup'],
      onClick: onCreateNew,
      featured: true,
      badge: 'Most Popular'
    },
    {
      id: 'improve',
      title: 'Improve Existing CV',
      subtitle: 'Get AI-powered suggestions',
      description: 'Upload your current CV and receive detailed feedback with actionable improvements',
      icon: TrendingUp,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      iconColor: 'text-white',
      stats: ['Instant Analysis', 'ATS Check', 'Score Boost'],
      onClick: onImproveCV,
      featured: false
    },
    {
      id: 'job-match',
      title: 'Job Match Analysis',
      subtitle: 'Compare CV with job requirements',
      description: 'Paste a job description and see how well your CV matches the requirements',
      icon: Target,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      iconColor: 'text-white',
      stats: ['Smart Matching', 'Gap Analysis', 'Success Rate'],
      onClick: onAnalyzeVsJob,
      featured: false
    },
    {
      id: 'interview',
      title: 'Interview Preparation',
      subtitle: 'Practice with AI interviewer',
      description: 'Get ready for interviews with personalized questions based on your role and industry',
      icon: MessageSquare,
      gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
      iconColor: 'text-white',
      stats: ['Role-Specific', 'Practice Sessions', 'Feedback'],
      onClick: onInterviewPrep,
      featured: false,
      badge: 'New'
    }
  ];

  // Quick access actions
  const quickActions = [
    { icon: FileText, label: 'My CVs', onClick: onMyCVs, color: 'text-blue-600' },
    { icon: Search, label: 'Browse Templates', onClick: onCreateNew, color: 'text-purple-600' },
    { icon: BarChart3, label: 'Analytics', onClick: () => {}, color: 'text-green-600' },
    { icon: Users, label: 'Community', onClick: () => {}, color: 'text-orange-600' }
  ];

  // Industry icons for visual appeal
  const industryIcons = [
    { icon: Code, label: 'Tech', color: 'text-blue-500' },
    { icon: Palette, label: 'Design', color: 'text-purple-500' },
    { icon: Stethoscope, label: 'Healthcare', color: 'text-red-500' },
    { icon: Calculator, label: 'Finance', color: 'text-green-500' },
    { icon: Hammer, label: 'Engineering', color: 'text-orange-500' },
    { icon: Mic, label: 'Marketing', color: 'text-pink-500' },
    { icon: GraduationCap, label: 'Education', color: 'text-indigo-500' },
    { icon: Briefcase, label: 'Business', color: 'text-gray-500' }
  ];

  // Success statistics (animated counters would be even better)
  const stats = [
    { value: '50,000+', label: 'CVs Created', icon: FileText, color: 'text-blue-600' },
    { value: '98%', label: 'Success Rate', icon: TrendingUp, color: 'text-green-600' },
    { value: '150+', label: 'Countries', icon: Globe, color: 'text-purple-600' },
    { value: '4.9/5', label: 'User Rating', icon: Star, color: 'text-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div ref={heroRef} className="container mx-auto px-4 pt-8 pb-12">
          {/* Header with Level Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {getGreeting()}! 👋
              </h1>
              <p className="text-xl text-gray-600 mb-4">{getMotivationalMessage()}</p>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            {/* Gamification Panel */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 min-w-[280px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Level {gameData.level}</h3>
                  <p className="text-sm text-gray-600">{gameData.xp} / {gameData.xp + gameData.xpToNextLevel} XP</p>
                </div>
              </div>
              
              {/* XP Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(gameData.xp / (gameData.xp + gameData.xpToNextLevel)) * 100}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-blue-600">{gameData.stats.cvsCreated}</div>
                  <div className="text-xs text-blue-500">CVs Created</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-purple-600">{gameData.achievements.filter(a => a.unlockedAt).length}</div>
                  <div className="text-xs text-purple-500">Achievements</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap gap-3 mb-8">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 group"
              >
                <action.icon className={`h-4 w-4 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-gray-700 font-medium">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Primary Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {primaryActions.map((action) => (
              <div
                key={action.id}
                className={`
                  relative group cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-2
                  ${activeCard === action.id ? 'scale-[1.02] -translate-y-2' : ''}
                `}
                onMouseEnter={() => setActiveCard(action.id)}
                onMouseLeave={() => setActiveCard(null)}
                onClick={action.onClick}
              >
                {/* Card Background with Gradient Border */}
                <div className={`
                  relative p-[2px] rounded-2xl bg-gradient-to-r ${action.gradient}
                  ${action.featured ? 'ring-4 ring-blue-200/50' : ''}
                `}>
                  <div className={`
                    relative ${action.bgColor} rounded-2xl p-8 h-full
                    backdrop-blur-sm border border-white/20
                    group-hover:bg-white/90 transition-all duration-300
                  `}>
                    {/* Featured Badge */}
                    {action.badge && (
                      <div className="absolute -top-3 -right-3">
                        <div className={`
                          bg-gradient-to-r ${action.gradient} text-white px-3 py-1 rounded-full text-xs font-bold
                          shadow-lg animate-pulse
                        `}>
                          {action.badge}
                        </div>
                      </div>
                    )}

                    {/* Icon with Gradient Background */}
                    <div className={`
                      w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-2xl 
                      flex items-center justify-center mb-6 
                      group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                      shadow-xl
                    `}>
                      <action.icon className={`h-8 w-8 ${action.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 font-medium mb-3">{action.subtitle}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{action.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {action.stats.map((stat, index) => (
                        <span
                          key={index}
                          className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-white/40"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                      <span>Get Started</span>
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Industry Focus Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/30">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Built for Every Industry
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI understands the unique requirements of different industries and creates 
                tailored CVs that speak the language of your field.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {industryIcons.map((industry, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 rounded-2xl hover:bg-white/80 transition-all duration-200 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow mb-2 group-hover:scale-110 transition-transform">
                    <industry.icon className={`h-6 w-6 ${industry.color}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{industry.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Success Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-12 h-12 ${stat.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/10 to-blue-600/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Join thousands of professionals who have already created stunning CVs with our AI-powered platform.
                </p>
                <button
                  onClick={onCreateNew}
                  className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <Rocket className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Start Creating Now
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowStartScreen;
