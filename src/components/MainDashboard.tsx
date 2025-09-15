import React, { useState, useEffect } from 'react';
import { 
  Eye, Plus, Target, Sparkles, TrendingUp, FileText, Zap, Award, Users, Globe, 
  MessageCircle, FolderOpen, Brain, Crown, Rocket, Star, ChevronRight,
  BarChart3, Clock, CheckCircle, ArrowRight, Download, Edit3
} from 'lucide-react';
import GameProgress from './GameProgress';
import { GameData } from '../types';
import gamificationService from '../services/gamificationService';

interface MainDashboardProps {
  gameData: GameData;
  onImproveCV: () => void;
  onCreateNew: () => void;
  onAnalyzeVsJob: () => void;
  onInterviewPrep: () => void;
  onMyCVs: () => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({
  gameData,
  onImproveCV,
  onCreateNew,
  onAnalyzeVsJob,
  onInterviewPrep,
  onMyCVs
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [savedCVs, setSavedCVs] = useState([]);

  const tips = [
    "💡 Include quantifiable achievements to increase ATS scores by 40%",
    "🌍 Mauritians with international experience get 60% more interviews",
    "🤖 AI-optimized CVs have 3x higher success rates",
    "📊 Custom templates for each market boost application success"
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Load saved CVs
    const cvs = JSON.parse(localStorage.getItem('mocv_saved_cvs') || '[]');
    setSavedCVs(cvs.slice(0, 3)); // Show only first 3
    
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(tipInterval);
  }, []);

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This will clear all CVs, progress, and start fresh.')) {
      gamificationService.resetGameData();
      localStorage.removeItem('mocv_saved_cvs');
      window.location.reload();
    }
  };

  const ActionCard = ({ 
    icon: Icon, 
    title, 
    description, 
    features, 
    xp, 
    onClick, 
    gradient,
    badge,
    comingSoon = false 
  }) => (
    <div 
      className={`group relative overflow-hidden bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer ${comingSoon ? 'opacity-75' : ''}`}
      onClick={!comingSoon ? onClick : undefined}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold z-10">
          {badge}
        </div>
      )}

      {/* Coming Soon Badge */}
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
          Coming Soon
        </div>
      )}

      <div className="p-8 relative z-10">
        {/* Icon */}
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon className="h-8 w-8 text-white" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>

          {/* XP Badge */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-semibold text-yellow-600">+{xp} XP</span>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, change, color = "blue" }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        {change && (
          <div className={`flex items-center text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating tip banner */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-500">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">{tips[currentTip]}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium shadow-lg animate-pulse mb-8">
            <Crown className="h-4 w-4" />
            World's Most Advanced CV Platform for Africans
          </div>

          {/* Main heading */}
          <h1 className="text-6xl font-bold mb-6">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to MoCV.mu
            </div>
          </h1>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            The AI-powered career intelligence platform that helps Mauritians and Africans 
            <span className="font-semibold text-blue-600"> land jobs in global markets</span>. 
            Beat ATS systems, optimize for international standards, and get hired faster.
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <StatCard icon={Users} label="Success Stories" value="12K+" change={25} color="green" />
            <StatCard icon={Globe} label="Countries" value="15+" change={0} color="blue" />
            <StatCard icon={Brain} label="AI Accuracy" value="94%" change={8} color="purple" />
            <StatCard icon={Rocket} label="Job Success" value="3.2x" change={15} color="orange" />
          </div>

          {/* Demo reset - only in development */}
          <button
            onClick={handleResetData}
            className="group mb-8 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-red-50 hover:to-red-100 text-gray-600 hover:text-red-600 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200 hover:border-red-200"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg group-hover:animate-spin transition-transform duration-500">🔄</span>
              Reset Demo Data
            </span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main content - 3 columns */}
            <div className="lg:col-span-3 space-y-8">
              {/* My CVs Section - Show if user has CVs */}
              {savedCVs.length > 0 && (
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 flex items-center">
                        <FolderOpen className="h-6 w-6 mr-3" />
                        Your CVs ({savedCVs.length})
                      </h3>
                      <p className="text-orange-100 text-lg">
                        Manage and track your CV performance
                      </p>
                    </div>
                    <button
                      onClick={onMyCVs}
                      className="bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {savedCVs.map((cv, index) => (
                      <div key={index} className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white truncate">{cv.title || 'Untitled CV'}</h4>
                          <span className="bg-white bg-opacity-30 px-2 py-1 rounded-full text-xs">
                            {cv.atsScore || 85}%
                          </span>
                        </div>
                        <p className="text-orange-100 text-sm">{cv.templateName || 'Classic Template'}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-orange-200">
                            {cv.dateModified ? new Date(cv.dateModified).toLocaleDateString() : 'Recently'}
                          </span>
                          <div className="flex gap-1">
                            <button className="bg-white bg-opacity-20 p-1 rounded">
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button className="bg-white bg-opacity-20 p-1 rounded">
                              <Download className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Actions */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Choose Your Path to Success
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <ActionCard
                    icon={Plus}
                    title="Create Smart CV"
                    description="Build ATS-optimized CVs with AI assistance and market-specific templates"
                    features={[
                      "15+ professional templates",
                      "Real-time ATS scoring",
                      "AI content suggestions",
                      "Multi-market optimization"
                    ]}
                    xp={100}
                    onClick={onCreateNew}
                    gradient="from-blue-500 to-blue-600"
                    badge="Most Popular"
                  />

                  <ActionCard
                    icon={Eye}
                    title="Analyze & Improve"
                    description="Upload your existing CV for instant analysis and improvement suggestions"
                    features={[
                      "Instant ATS scoring",
                      "Keyword gap analysis",
                      "Market compatibility check",
                      "Detailed improvement plan"
                    ]}
                    xp={75}
                    onClick={onImproveCV}
                    gradient="from-purple-500 to-purple-600"
                  />

                  <ActionCard
                    icon={Target}
                    title="Job Match Analysis"
                    description="Compare your CV against specific job descriptions for perfect alignment"
                    features={[
                      "Job-specific matching",
                      "Missing keyword detection",
                      "Compatibility scoring",
                      "Tailored recommendations"
                    ]}
                    xp={85}
                    onClick={onAnalyzeVsJob}
                    gradient="from-green-500 to-green-600"
                  />

                  <ActionCard
                    icon={MessageCircle}
                    title="Interview Preparation"
                    description="Practice with AI interviewer and get personalized feedback"
                    features={[
                      "AI-powered mock interviews",
                      "Personalized questions",
                      "Performance analytics",
                      "Cultural preparation tips"
                    ]}
                    xp={120}
                    onClick={onInterviewPrep}
                    gradient="from-indigo-500 to-indigo-600"
                    badge="New!"
                  />
                </div>
              </div>

              {/* Success Stories */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Success Stories from Our Community
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { name: "Priya R.", role: "Software Engineer", country: "🇺🇸 USA", result: "Landed dream job at Google with 180% salary increase" },
                    { name: "Jean-Marc L.", role: "Data Scientist", country: "🇬🇧 UK", result: "3 interviews in first week, hired at fintech startup" },
                    { name: "Amara K.", role: "Product Manager", country: "🇸🇬 Singapore", result: "Relocated from Senegal, now leading team of 12" }
                  ].map((story, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {story.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{story.name}</div>
                          <div className="text-sm text-gray-600">{story.role}</div>
                        </div>
                      </div>
                      <div className="text-lg mb-2">{story.country}</div>
                      <p className="text-gray-700 text-sm leading-relaxed">"{story.result}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Game Progress */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <GameProgress gameData={gameData} />
                
                {/* Quick Tips */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-600" />
                    Pro Tips for Mauritians
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Include both English and French language skills to stand out globally</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Highlight remote work experience - highly valued by international employers</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Use metrics and numbers to quantify achievements - beats ATS systems</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
