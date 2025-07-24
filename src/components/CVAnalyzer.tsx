import React, { useState, useRef } from 'react';
import { Upload, FileText, Target, TrendingUp, AlertCircle, CheckCircle, Zap, ArrowRight, Download, Eye, Lightbulb, ArrowLeft, X } from 'lucide-react';
import { CVAnalysis } from '../types';
import { TargetMarket } from '../types';
import BackButton from './BackButton';
import { extractTextFromFile } from '../services/cvParsingService';

interface CVAnalyzerProps {
  targetMarket: TargetMarket | null;
  onAnalysisComplete: (analysis: CVAnalysis, cvText: string) => void;
  onCreateNew: () => void;
  onBack: () => void;
}

const CVAnalyzer: React.FC<CVAnalyzerProps> = ({ targetMarket, onAnalysisComplete, onCreateNew, onBack }) => {
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    try {
      // Show loading state
      const loadingMessage = document.createElement('div');
      loadingMessage.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      loadingMessage.textContent = 'Processing your CV...';
      document.body.appendChild(loadingMessage);
      
      const extractedText = await extractTextFromFile(file);
      
      // Remove loading message
      if (document.body.contains(loadingMessage)) {
        document.body.removeChild(loadingMessage);
      }
      
      // Check if we got actual content or fallback
      if (extractedText && extractedText.trim() && 
          !extractedText.includes('John Doe') && 
          !extractedText.includes('john.doe@email.com')) {
        setCvText(extractedText);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        successMessage.textContent = 'CV uploaded and processed successfully!';
        document.body.appendChild(successMessage);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
          if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
          }
        }, 3000);
      } else {
        // Show warning for fallback content
        const warningMessage = document.createElement('div');
        warningMessage.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        warningMessage.innerHTML = `
          <div>CV uploaded but text extraction limited.</div>
          <div class="text-xs mt-1">Please paste your CV text manually for best results.</div>
        `;
        document.body.appendChild(warningMessage);
        
        // Set empty text to encourage manual input
        setCvText('');
        
        // Remove warning message after 5 seconds
        setTimeout(() => {
          if (document.body.contains(warningMessage)) {
            document.body.removeChild(warningMessage);
          }
        }, 5000);
      }
      
    } catch (error) {
      console.error('File parsing error:', error);
      
      // Remove loading message if it exists
      const loadingMessage = document.querySelector('.fixed.top-4.right-4.bg-blue-500');
      if (loadingMessage && document.body.contains(loadingMessage)) {
        document.body.removeChild(loadingMessage);
      }
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorMessage.innerHTML = `
        <div>Failed to parse CV file.</div>
        <div class="text-xs mt-1">Please try pasting your CV text directly below.</div>
      `;
      document.body.appendChild(errorMessage);
      
      // Remove error message after 5 seconds
      setTimeout(() => {
        if (document.body.contains(errorMessage)) {
          document.body.removeChild(errorMessage);
        }
      }, 5000);
    }
  };

  const analyzeCV = async () => {
    if (!cvText.trim()) {
      alert('Please upload a CV or paste CV text');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results
    const mockAnalysis: CVAnalysis = {
      score: 78,
      matchedKeywords: ['JavaScript', 'React', 'Node.js', 'Software Engineer', 'Team Lead'],
      missingKeywords: ['TypeScript', 'AWS', 'Docker', 'Agile', 'CI/CD'],
      readabilityScore: 'Good',
      suggestions: [
        'Add more quantifiable achievements (e.g., "Increased performance by 40%")',
        'Include missing keywords: TypeScript, AWS, Docker',
        'Strengthen your professional summary with specific metrics',
        'Add more technical skills relevant to the job description',
        'Consider adding a projects section to showcase your work'
      ],
      sections: ['Contact Info', 'Professional Summary', 'Experience', 'Skills', 'Education']
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    onAnalysisComplete(mockAnalysis, cvText);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="mb-6">
            <BackButton onClick={onBack} label="Back to Market Selection" variant="floating" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload your CV to get instant ATS scoring, keyword analysis, and personalized improvement suggestions. 
            {targetMarket ? `Optimized for ${targetMarket.name} job market standards.` : 'Or create a new professional CV from scratch.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <Zap className="h-5 w-5" />
              Create New CV
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Upload className="h-6 w-6 text-blue-600" />
                Upload Your CV
              </h2>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
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
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* PDF Notice */}
              <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <strong>PDF Upload Tip:</strong> If you see garbled text after uploading a PDF, please copy and paste your CV text directly into the text area below instead. DOCX files typically work better for automatic text extraction.
                </p>
              </div>

              {/* Text Input Alternative */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or paste your CV text here:
                </label>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  rows={8}
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

              {/* Job Description Input */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description (Optional - for better keyword matching):
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Paste the job description you're applying for..."
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

              <button
                onClick={analyzeCV}
                disabled={isAnalyzing || !cvText.trim()}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing CV...
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5" />
                    Analyze CV
                  </>
                )}
              </button>
            </div>

            {/* Analysis Results */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
                Analysis Results
              </h2>

              {!analysis && !isAnalyzing && (
                <div className="text-center py-12 text-gray-500">
                  <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">Upload your CV to get started</p>
                  <p className="text-sm">Get instant ATS scoring and improvement suggestions</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-lg font-medium text-gray-700 mb-2">Analyzing your CV...</p>
                  <p className="text-gray-500">This may take a few moments</p>
                </div>
              )}

              {analysis && (
                <div className="space-y-6">
                  {/* ATS Score */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">ATS Score</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.score)}`}>
                        {analysis.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${getScoreBarColor(analysis.score)}`}
                        style={{ width: `${analysis.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {analysis.score >= 80 ? 'Excellent! Your CV is well-optimized for ATS systems.' :
                       analysis.score >= 60 ? 'Good score, but there\'s room for improvement.' :
                       'Your CV needs optimization to pass ATS screening.'}
                    </p>
                  </div>

                  {/* Keywords Analysis */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Keyword Analysis
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">Matched Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.matchedKeywords.map((keyword, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-red-700 mb-2">Missing Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missingKeywords.map((keyword, index) => (
                            <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      Improvement Suggestions
                    </h3>
                    <div className="space-y-3">
                      {analysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Report
                    </button>
                    <button 
                      onClick={onCreateNew}
                      className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Create New CV
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVAnalyzer;