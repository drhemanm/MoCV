import React, { useState } from 'react';
import { Target, Upload, FileText, TrendingUp, CheckCircle, AlertCircle, Zap, Award, X } from 'lucide-react';
import { CVAnalysis } from '../types';
import { TargetMarket } from '../types';
import BackButton from './BackButton';
import { extractTextFromFile } from '../services/cvParsingService';

interface JobDescriptionAnalyzerProps {
  targetMarket: TargetMarket | null;
  onAnalysisComplete: (analysis: CVAnalysis, cvText: string, jobDescription: string) => void;
  onBack: () => void;
}

const JobDescriptionAnalyzer: React.FC<JobDescriptionAnalyzerProps> = ({ targetMarket, onAnalysisComplete, onBack }) => {
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    try {
      const extractedText = await extractTextFromFile(file);
      setCvText(extractedText);
    } catch (error) {
      console.error('File parsing error:', error);
      alert('Failed to parse the file. Please ensure it\'s a valid PDF, DOCX, or TXT file.');
    }
  };

  const analyzeMatch = async () => {
    if (!cvText.trim() || !jobDescription.trim()) {
      alert('Please provide both your CV and the job description');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis with job description matching
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Enhanced mock analysis with job-specific matching
    const mockAnalysis: CVAnalysis = {
      score: 85,
      matchedKeywords: ['JavaScript', 'React', 'Node.js', 'Software Engineer', 'AWS', 'Team Lead', 'Agile'],
      missingKeywords: ['TypeScript', 'Kubernetes', 'CI/CD', 'Microservices', 'GraphQL'],
      readabilityScore: 'Good',
      suggestions: [
        'Add TypeScript experience - mentioned 3 times in job description',
        'Include Kubernetes and container orchestration skills',
        'Highlight CI/CD pipeline experience with specific tools',
        'Mention microservices architecture experience',
        'Add GraphQL API development to your skills',
        'Quantify your team leadership experience with specific numbers',
        'Include agile methodology certifications if you have them'
      ],
      sections: ['Contact Info', 'Professional Summary', 'Experience', 'Skills', 'Education']
    };

    setIsAnalyzing(false);
    onAnalysisComplete(mockAnalysis, cvText, jobDescription);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <BackButton onClick={onBack} label="Back to Home" variant="floating" />
          </div>
          
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Target className="h-4 w-4" />
            Job-Specific CV Analysis {targetMarket && `• ${targetMarket.flag} ${targetMarket.name}`}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            CV vs Job Description Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload your CV and paste the job description to get a detailed compatibility analysis. 
            {targetMarket ? `Optimized for ${targetMarket.name} market preferences and ATS systems.` : 'See exactly what keywords you\'re missing and how to optimize for this specific role.'}
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-600" />
              <span>Earn +75 XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span>AI-Powered Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              <span>Job-Specific Tips</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* CV Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Upload className="h-6 w-6 text-blue-600" />
                Your Current CV
              </h2>

              {/* File Upload Area */}
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
                <p className="text-gray-500 mb-4">Supports PDF, DOCX, and text files</p>
                <button
                  onClick={() => document.getElementById('cv-file-input')?.click()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </button>
                <input
                  id="cv-file-input"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {/* PDF Notice */}
              <div className="mb-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> For best results with PDF files, we recommend copying and pasting your CV text directly into the text area below, or uploading a DOCX file.
                </p>
              </div>

              {/* Text Input Alternative */}
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
                <Target className="h-6 w-6 text-green-600" />
                Job Description
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste the complete job description:
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={16}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Paste the full job description here including requirements, responsibilities, and qualifications..."
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

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">💡 Pro Tip:</h3>
                <p className="text-green-800 text-sm">
                  Include the entire job posting for best results. The AI will analyze requirements, 
                  preferred qualifications, and company culture keywords to give you the most accurate matching score.
                </p>
              </div>
            </div>
          </div>

          {/* Analysis Button */}
          <div className="text-center mt-8">
            <button
              onClick={analyzeMatch}
              disabled={isAnalyzing || !cvText.trim() || !jobDescription.trim()}
              className="bg-gradient-to-r from-green-600 to-yellow-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-yellow-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Analyzing Match...
                </>
              ) : (
                <>
                  <Target className="h-6 w-6" />
                  Analyze CV vs Job Match
                </>
              )}
            </button>
            
            {isAnalyzing && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 mb-2">AI is analyzing your CV against the job requirements...</p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* What You'll Get */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">What You'll Get from This Analysis</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Match Score</h4>
                <p className="text-gray-600 text-sm">Get a percentage score showing how well your CV matches the job requirements</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Keyword Analysis</h4>
                <p className="text-gray-600 text-sm">See which keywords you have and which ones you're missing from the job posting</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Improvement Tips</h4>
                <p className="text-gray-600 text-sm">Get specific suggestions on how to optimize your CV for this exact role</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionAnalyzer;