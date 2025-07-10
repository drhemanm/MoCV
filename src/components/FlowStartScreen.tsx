import React from 'react';
import { Eye, Plus, Target, Sparkles, TrendingUp, FileText, Zap, Award, Users, Globe, MessageCircle, FolderOpen } from 'lucide-react';
import GameProgress from './GameProgress';
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered CV Assistant for Mauritius & Africa
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> MoCV.mu</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your intelligent CV companion designed to help Mauritians and Africans compete in global job markets. 
            Get ATS-optimized CVs, AI-powered content, and beat international recruitment systems.
          </p>
          
          {/* Key Benefits */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">ATS Optimized</h3>
              <p className="text-xs text-gray-600">Beat applicant tracking systems</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">AI-Powered</h3>
              <p className="text-xs text-gray-600">Smart content generation</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Global Ready</h3>
              <p className="text-xs text-gray-600">Compete internationally</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Gamified</h3>
              <p className="text-xs text-gray-600">Earn XP and badges</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* My CVs Dashboard */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FolderOpen className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">My CVs Dashboard</h3>
                    <p className="text-gray-600 mb-4">
                      View, edit, and manage all your saved CVs in one place. Track ATS scores, 
                      download PDFs, and organize your CV collection efficiently.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Manage CVs
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Track Scores
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        Quick Access
                      </span>
                    </div>
                    <button
                      onClick={onMyCVs}
                      className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
                    >
                      View My CVs
                    </button>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Path</h2>
              
              {/* Improve Existing CV */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Eye className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Improve Existing CV</h3>
                    <p className="text-gray-600 mb-4">
                      Upload your current CV and get instant ATS scoring, keyword analysis, and AI-powered improvement suggestions. 
                      Perfect for optimizing what you already have.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        ATS Analysis
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4" />
                        AI Suggestions
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        +50 XP
                      </span>
                    </div>
                    <button
                      onClick={onImproveCV}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                    >
                      Analyze My CV
                    </button>
                  </div>
                </div>
              </div>

              {/* Create New CV */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Create New CV from Template</h3>
                    <p className="text-gray-600 mb-4">
                      Choose from professionally designed templates optimized for different industries. 
                      Use AI assistance or fill manually - your choice.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        15+ Templates
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        AI Assistant
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        +100 XP
                      </span>
                    </div>
                    <button
                      onClick={onCreateNew}
                      className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
                    >
                      Browse Templates
                    </button>
                  </div>
                </div>
              </div>

              {/* Analyze vs Job Description */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-yellow-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Analyze CV vs Job Description</h3>
                    <p className="text-gray-600 mb-4">
                      Compare your CV against a specific job posting. Get keyword matching analysis, 
                      compatibility scores, and tailored suggestions to beat the competition.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Job Matching
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Keyword Analysis
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        +75 XP
                      </span>
                    </div>
                    <button
                      onClick={onAnalyzeVsJob}
                      className="bg-gradient-to-r from-green-600 to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105"
                    >
                      Compare with Job
                    </button>
                  </div>
                </div>
              </div>

              {/* Interview Preparation */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Prepare for Interviews</h3>
                    <p className="text-gray-600 mb-4">
                      Practice with AI-generated interview questions tailored to your CV and the job description. 
                      Get instant feedback and improve your interview performance.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        Mock Interview
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Performance Score
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        +100 XP
                      </span>
                    </div>
                    <button
                      onClick={onInterviewPrep}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                    >
                      Start Interview Practice
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Progress Sidebar */}
            <div className="lg:col-span-1">
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
                    <p>Include both English and French language skills to stand out in global markets</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Highlight remote work experience - it's highly valued by international employers</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Use metrics and numbers to quantify your achievements - this beats ATS systems</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Success Stories from Mauritius & Africa</h2>
            <p className="text-gray-600">Real people who landed international jobs using MoCV.mu</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Priya R.</div>
                  <div className="text-sm text-gray-500">Software Engineer</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">"Got my dream job at a UK tech company! The ATS optimization made all the difference."</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Jean-Marc L.</div>
                  <div className="text-sm text-gray-500">Marketing Manager</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">"The AI assistant helped me rewrite my experience section. Landed 3 interviews in one week!"</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Amara K.</div>
                  <div className="text-sm text-gray-500">Data Analyst</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">"From Senegal to Silicon Valley! MoCV helped me create a CV that actually gets noticed."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowStartScreen;