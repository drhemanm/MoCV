// src/components/CVAnalyzer.tsx
import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, FileText, Scan, BarChart3, CheckCircle, AlertTriangle, 
  X, Download, Eye, Zap, Target, Brain, Award, TrendingUp,
  Clock, Users, Star, ArrowRight, RefreshCw, AlertCircle,
  FileCheck, Sparkles, Shield, Globe, Layers, Code
} from 'lucide-react';
import { TargetMarket, CVAnalysis } from '../types';
import { BackButton } from './BackButton';
import { LoadingSpinner, ButtonSpinner } from './LoadingSpinner';

interface CVAnalyzerProps {
  targetMarket: TargetMarket | null;
  onAnalysisComplete: (analysis: CVAnalysis, cvText: string) => void;
  onCreateNew: () => void;
  onBack: () => void;
}

const CVAnalyzer: React.FC<CVAnalyzerProps> = ({
  targetMarket,
  onAnalysisComplete,
  onCreateNew,
  onBack
}) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text' | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // File validation
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a PDF, Word document, or text file';
    }

    return null;
  };

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    setUploadError(null);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1) {
      setUploadError('Please upload only one file at a time');
      return;
    }

    const file = files[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }
      setCvFile(file);
      setUploadMethod('file');
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }
      setCvFile(file);
      setUploadMethod('file');
    }
  };

  // Mock AI analysis with realistic progress
  const performAnalysis = async (text: string): Promise<CVAnalysis> => {
    const stages = [
      { stage: 'Parsing document structure...', duration: 800 },
      { stage: 'Extracting key information...', duration: 1200 },
      { stage: 'Analyzing content quality...', duration: 1500 },
      { stage: 'Checking ATS compatibility...', duration: 1000 },
      { stage: 'Comparing with industry standards...', duration: 1200 },
      { stage: 'Generating recommendations...', duration: 800 }
    ];

    let progress = 0;
    
    for (const { stage, duration } of stages) {
      setAnalysisStage(stage);
      
      const steps = 20;
      const stepDuration = duration / steps;
      const progressIncrement = (100 / stages.length) / steps;
      
      for (let i = 0; i < steps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        progress += progressIncrement;
        setAnalysisProgress(Math.min(progress, 100));
      }
    }

    // Generate realistic analysis based on target market
    const baseScore = 65 + Math.random() * 25; // 65-90 range
    const marketMultiplier = targetMarket?.id === 'technology' ? 1.1 : 
                           targetMarket?.id === 'design' ? 1.05 : 1.0;
    const finalScore = Math.min(95, Math.round(baseScore * marketMultiplier));

    const analysis: CVAnalysis = {
      score: finalScore,
      strengths: [
        'Clear professional summary highlighting key qualifications',
        'Well-structured work experience with quantifiable achievements',
        'Relevant technical skills aligned with industry standards',
        'Professional formatting with good visual hierarchy'
      ],
      weaknesses: [
        'Could benefit from more specific metrics and numbers',
        'Missing keywords commonly found in job descriptions',
        'Some sections could be more concise and impactful',
        'Consider adding relevant certifications or projects'
      ],
      suggestions: [
        'Add 2-3 quantifiable achievements per role (e.g., "Increased sales by 25%")',
        'Include industry-specific keywords from job postings',
        'Consider adding a "Key Achievements" or "Notable Projects" section',
        'Ensure consistent formatting and professional typography',
        'Tailor content more specifically to target role requirements'
      ],
      sections: {
        summary: {
          score: finalScore + Math.random() * 10 - 5,
          feedback: 'Professional summary effectively highlights key qualifications',
          suggestions: ['Make it more specific to target role', 'Add 1-2 key achievements']
        },
        experience: {
          score: finalScore + Math.random() * 8 - 4,
          feedback: 'Good structure with relevant experience listed',
          suggestions: ['Add more quantifiable results', 'Use stronger action verbs']
        },
        skills: {
          score: finalScore + Math.random() * 12 - 6,
          feedback: 'Skills section covers relevant technical competencies',
          suggestions: ['Prioritize skills most relevant to target role', 'Consider skill proficiency levels']
        },
        education: {
          score: finalScore + Math.random() * 6 - 3,
          feedback: 'Education section is properly formatted',
          suggestions: ['Highlight relevant coursework or projects', 'Include GPA if 3.5+']
        }
      },
      atsCompatibility: Math.round(finalScore * 0.9),
      keywordMatches: [
        'project management', 'leadership', 'data analysis', 'team collaboration',
        'problem solving', 'communication', 'strategic planning'
      ],
      missingKeywords: [
        'agile methodology', 'stakeholder management', 'process improvement',
        'cross-functional', 'digital transformation', 'analytics'
      ]
    };

    return analysis;
  };

  // Handle analysis submission
  const handleAnalyze = async () => {
    let textToAnalyze = '';
    
    if (uploadMethod === 'file' && cvFile) {
      // In a real app, you'd extract text from the file
      textToAnalyze = `Mock extracted text from ${cvFile.name}`;
    } else if (uploadMethod === 'text') {
      textToAnalyze = cvText.trim();
    }

    if (!textToAnalyze) {
      setUploadError('Please provide CV content to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setUploadError(null);

    try {
      const analysis = await performAnalysis(textToAnalyze);
      onAnalysisComplete(analysis, textToAnalyze);
    } catch (error) {
      setUploadError('Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setUploadMethod(null);
    setCvFile(null);
    setCvText('');
    setUploadError(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setAnalysisStage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Sample CV features for showcase
  const analysisFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze content quality, structure, and industry relevance'
    },
    {
      icon: Shield,
      title: 'ATS Compatibility',
      description: 'Ensure your CV passes through Applicant Tracking Systems successfully'
    },
    {
      icon: Target,
      title: 'Industry Optimization',
      description: 'Tailored feedback based on your target market and role requirements'
    },
    {
      icon: BarChart3,
      title: 'Detailed Scoring',
      description: 'Comprehensive scoring across multiple CV sections with actionable insights'
    }
  ];

  const supportedFormats = [
    { name: 'PDF', extension: '.pdf', icon: FileText, popular: true },
    { name: 'Word', extension: '.doc/.docx', icon: FileText, popular: true },
    { name: 'Text', extension: '.txt', icon: FileCheck, popular: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <BackButton onClick={onBack} variant="minimal" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">CV Analysis</h1>
              <p className="text-gray-600 mt-1">
                {targetMarket 
                  ? `Get AI-powered insights optimized for ${targetMarket.name} roles`
                  : 'Upload your CV for comprehensive AI analysis and improvement suggestions'
                }
              </p>
            </div>
            
            {/* Market Badge */}
            {targetMarket && (
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="font-medium">{targetMarket.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Analysis in Progress */}
        {isAnalyzing && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-white animate-pulse" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Your CV</h2>
              <p className="text-gray-600 mb-6">{analysisStage}</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
              
              <div className="text-sm text-gray-500 mb-6">
                {Math.round(analysisProgress)}% Complete
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Content Structure</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Grammar Check</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Scan className="h-4 w-4 animate-spin" />
                  <span>ATS Compatibility</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Industry Analysis</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Interface */}
        {!isAnalyzing && (
          <div className="max-w-4xl mx-auto">
            {/* Features Overview */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  AI-Powered CV Analysis
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Get instant feedback on your CV with our advanced AI system. 
                  Receive detailed insights, ATS compatibility scores, and actionable recommendations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {analysisFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Methods */}
            {!uploadMethod && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Choose how to submit your CV
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* File Upload */}
                  <button
                    onClick={() => setUploadMethod('file')}
                    className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Upload className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Upload File</h4>
                        <div className="flex items-center gap-1 text-blue-600 text-sm">
                          <Sparkles className="h-4 w-4" />
                          <span>Recommended</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      Upload your CV as a PDF, Word document, or text file for the most accurate analysis.
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {supportedFormats.map((format, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            format.popular 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <format.icon className="h-3 w-3" />
                          {format.extension}
                        </span>
                      ))}
                    </div>

                    <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform absolute top-8 right-8" />
                  </button>

                  {/* Text Input */}
                  <button
                    onClick={() => setUploadMethod('text')}
                    className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-dashed border-green-200 hover:border-green-400 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Paste Text</h4>
                        <span className="text-green-600 text-sm">Quick & Easy</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      Copy and paste your CV content directly into our text editor for instant analysis.
                    </p>
                    
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <Zap className="h-4 w-4" />
                      <span>No file upload required</span>
                    </div>

                    <ArrowRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform absolute top-8 right-8" />
                  </button>
                </div>
              </div>
            )}

            {/* File Upload Interface */}
            {uploadMethod === 'file' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Upload Your CV</h3>
                  <button
                    onClick={handleReset}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {!cvFile ? (
                  <div
                    className={`
                      relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                      ${dragActive 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Drop your CV here or click to browse
                    </h4>
                    <p className="text-gray-500 mb-6">
                      Supports PDF, Word documents (.doc, .docx), and text files up to 10MB
                    </p>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Select File
                    </button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* File Preview */}
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{cvFile.name}</div>
                          <div className="text-sm text-gray-500">
                            {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setCvFile(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Analysis Button */}
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <ButtonSpinner />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Brain className="h-5 w-5" />
                          <span>Analyze CV</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Text Input Interface */}
            {uploadMethod === 'text' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Paste Your CV Content</h3>
                  <button
                    onClick={handleReset}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <textarea
                    ref={textAreaRef}
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    placeholder="Copy and paste your CV content here. Include all sections: personal info, summary, experience, education, skills, etc."
                    className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{cvText.length} characters</span>
                    <span>Minimum 200 characters recommended</span>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={cvText.trim().length < 50 || isAnalyzing}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <ButtonSpinner />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5" />
                        <span>Analyze CV</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {uploadError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <span className="text-red-800">{uploadError}</span>
                <button
                  onClick={() => setUploadError(null)}
                  className="ml-auto text-red-600 hover:text-red-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Don't have a CV yet?</h3>
                <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                  Create a professional CV from scratch using our AI-powered builder with industry-optimized templates.
                </p>
                <button
                  onClick={onCreateNew}
                  className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Create New CV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVAnalyzer;
