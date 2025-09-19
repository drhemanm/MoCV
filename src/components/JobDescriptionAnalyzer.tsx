import React, { useState, useCallback } from 'react';
import { 
  ArrowLeft, Upload, FileText, Target, Brain, CheckCircle, 
  AlertCircle, TrendingUp, Users, Award, Clock 
} from 'lucide-react';

interface JobAnalysisResult {
  matchScore: number;
  company: string;
  position: string;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  salaryEstimate?: {
    min: number;
    max: number;
    currency: string;
  };
}

interface JobDescriptionAnalyzerProps {
  onAnalysisComplete: (analysis: any, cvText: string, jobDescription: string) => void;
  onBack: () => void;
}

const JobDescriptionAnalyzer: React.FC<JobDescriptionAnalyzerProps> = ({
  onAnalysisComplete,
  onBack
}) => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<JobAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clear any cached state when component mounts
  React.useEffect(() => {
    // Clear any cached analysis results
    setAnalysisResult(null);
    setError(null);
    setCvText('');
    setJobDescription('');
    console.log('🧹 JobAnalyzer: Cleared cached state');
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setCvFile(file);
    setError(null);
    
    try {
      let text = '';
      
      if (file.type === 'application/pdf') {
        // Handle PDF files - you might need a PDF parser library
        text = 'PDF content extraction would go here';
        setError('PDF parsing not implemented yet. Please use .txt or paste your CV content.');
        return;
      } else if (file.type === 'text/plain') {
        text = await file.text();
      } else if (file.name.endsWith('.docx')) {
        setError('DOCX parsing not implemented yet. Please use .txt or paste your CV content.');
        return;
      } else {
        setError('Unsupported file type. Please use PDF, DOCX, or TXT files.');
        return;
      }
      
      setCvText(text);
      console.log('📄 CV uploaded:', file.name, 'Length:', text.length);
    } catch (err) {
      setError('Failed to read file. Please try again.');
      console.error('File upload error:', err);
    }
  }, []);

  const performRealAnalysis = async (cvContent: string, jobDesc: string): Promise<JobAnalysisResult> => {
    console.log('🔍 Starting REAL job analysis...');
    console.log('CV Length:', cvContent.length);
    console.log('Job Description Length:', jobDesc.length);
    
    try {
      // Call your actual API endpoint
      const response = await fetch('/api/ai/analyze-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvText: cvContent,
          targetMarket: 'Global',
          jobDescription: jobDesc, // Pass job description for comparison
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.analysis) {
        throw new Error('Invalid analysis response');
      }

      // Transform the CV analysis into job matching format
      const cvAnalysis = data.analysis;
      
      // Extract job details from description
      const jobTitle = extractJobTitle(jobDesc);
      const company = extractCompany(jobDesc);
      const requiredSkills = extractSkills(jobDesc);
      
      // Calculate actual match score based on skill overlap
      const cvSkills = extractCVSkills(cvContent);
      const matchScore = calculateRealMatchScore(cvSkills, requiredSkills, cvContent, jobDesc);
      
      console.log('✅ Real analysis completed. Match score:', matchScore);
      
      return {
        matchScore,
        company: company || 'Unknown Company',
        position: jobTitle || 'Unknown Position',
        matchingSkills: findMatchingSkills(cvSkills, requiredSkills),
        missingSkills: findMissingSkills(cvSkills, requiredSkills),
        recommendations: generateRecommendations(matchScore, cvSkills, requiredSkills),
        strengths: cvAnalysis.strengths || [],
        weaknesses: cvAnalysis.improvements || [],
        salaryEstimate: estimateSalary(jobTitle, matchScore)
      };
    } catch (error) {
      console.error('❌ Real analysis failed:', error);
      throw error;
    }
  };

  // Helper functions for actual analysis
  const extractJobTitle = (jobDesc: string): string => {
    const patterns = [
      /job title[:\-\s]*(.*?)[\n\r]/i,
      /position[:\-\s]*(.*?)[\n\r]/i,
      /role[:\-\s]*(.*?)[\n\r]/i,
      /we are looking for a (.*?)[\n\r]/i
    ];
    
    for (const pattern of patterns) {
      const match = jobDesc.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return 'Unknown Position';
  };

  const extractCompany = (jobDesc: string): string => {
    const patterns = [
      /company[:\-\s]*(.*?)[\n\r]/i,
      /organization[:\-\s]*(.*?)[\n\r]/i,
      /at (.*?) we/i
    ];
    
    for (const pattern of patterns) {
      const match = jobDesc.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return 'Unknown Company';
  };

  const extractSkills = (text: string): string[] => {
    const skillKeywords = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
      'leadership', 'management', 'communication', 'teamwork', 'problem-solving',
      'steward', 'hospitality', 'customer service', 'food service', 'cleaning',
      'software engineer', 'developer', 'programming', 'coding', 'technical'
    ];
    
    const foundSkills = skillKeywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    return foundSkills;
  };

  const extractCVSkills = (cvText: string): string[] => {
    return extractSkills(cvText);
  };

  const calculateRealMatchScore = (cvSkills: string[], jobSkills: string[], cvText: string, jobDesc: string): number => {
    if (jobSkills.length === 0) return 50; // Default if no skills detected
    
    const matchingSkills = cvSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    const skillMatchRatio = matchingSkills.length / jobSkills.length;
    
    // Additional context matching
    const jobLower = jobDesc.toLowerCase();
    const cvLower = cvText.toLowerCase();
    
    // Check for industry mismatch (steward vs software engineer)
    const isHospitalityJob = jobLower.includes('steward') || jobLower.includes('hospitality') || jobLower.includes('restaurant');
    const isTechJob = jobLower.includes('software') || jobLower.includes('developer') || jobLower.includes('engineer');
    const isTechCV = cvLower.includes('software') || cvLower.includes('programming') || cvLower.includes('developer');
    const isHospitalityCV = cvLower.includes('steward') || cvLower.includes('hospitality') || cvLower.includes('restaurant');
    
    let contextPenalty = 0;
    if ((isHospitalityJob && isTechCV) || (isTechJob && isHospitalityCV)) {
      contextPenalty = 40; // Major penalty for industry mismatch
      console.log('⚠️ Detected industry mismatch, applying penalty');
    }
    
    const baseScore = (skillMatchRatio * 100) - contextPenalty;
    
    return Math.max(5, Math.min(95, Math.round(baseScore)));
  };

  const findMatchingSkills = (cvSkills: string[], jobSkills: string[]): string[] => {
    return cvSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  };

  const findMissingSkills = (cvSkills: string[], jobSkills: string[]): string[] => {
    return jobSkills.filter(skill => 
      !cvSkills.some(cvSkill => 
        cvSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(cvSkill.toLowerCase())
      )
    );
  };

  const generateRecommendations = (matchScore: number, cvSkills: string[], jobSkills: string[]): string[] => {
    const recommendations = [];
    
    if (matchScore < 30) {
      recommendations.push('Consider applying for roles that better match your current skill set');
      recommendations.push('Develop the key skills required for this position before applying');
    } else if (matchScore < 60) {
      recommendations.push('Highlight transferable skills in your CV');
      recommendations.push('Consider additional training in missing key areas');
      recommendations.push('Emphasize relevant experience even if from different industries');
    } else if (matchScore < 80) {
      recommendations.push('Tailor your CV to emphasize matching skills');
      recommendations.push('Add specific examples that demonstrate required competencies');
    } else {
      recommendations.push('You are well-qualified for this position');
      recommendations.push('Ensure your CV clearly highlights your relevant experience');
    }
    
    return recommendations;
  };

  const estimateSalary = (jobTitle: string, matchScore: number) => {
    // Basic salary estimation (you could make this more sophisticated)
    const baseSalaries: Record<string, { min: number; max: number }> = {
      'steward': { min: 20000, max: 35000 },
      'software engineer': { min: 60000, max: 120000 },
      'developer': { min: 55000, max: 100000 },
      'manager': { min: 50000, max: 90000 }
    };
    
    const titleLower = jobTitle.toLowerCase();
    let salary = baseSalaries['steward']; // default
    
    for (const [key, value] of Object.entries(baseSalaries)) {
      if (titleLower.includes(key)) {
        salary = value;
        break;
      }
    }
    
    // Adjust based on match score
    const adjustment = (matchScore - 50) / 100;
    return {
      min: Math.round(salary.min * (1 + adjustment)),
      max: Math.round(salary.max * (1 + adjustment)),
      currency: 'USD'
    };
  };

  const handleAnalyze = async () => {
    if (!cvText.trim() || !jobDescription.trim()) {
      setError('Please provide both your CV content and the job description.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);
    setAnalysisResult(null); // Clear previous results
    
    console.log('🚀 Starting job analysis...');

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);

      // Perform real analysis
      const result = await performRealAnalysis(cvText, jobDescription);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      setTimeout(() => {
        setAnalysisResult(result);
        setIsAnalyzing(false);
        
        // Create a compatible analysis object for the improver
        const compatibleAnalysis = {
          score: result.matchScore,
          strengths: result.strengths,
          improvements: result.recommendations,
          atsOptimization: ['Ensure ATS compatibility', 'Use relevant keywords'],
          keywords: result.matchingSkills,
          marketSpecific: [`Tailored for ${result.position} role`],
          summary: `${result.matchScore}% match with ${result.position} at ${result.company}`
        };
        
        // Call completion handler
        onAnalysisComplete(compatibleAnalysis, cvText, jobDescription);
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      setIsAnalyzing(false);
      console.error('Analysis error:', err);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-12 rounded-lg shadow-lg max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-white animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Job Match</h2>
          <p className="text-gray-600 mb-6">Comparing your CV with job requirements using real AI analysis</p>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          
          <div className="text-sm text-gray-500">
            {Math.round(analysisProgress)}% Complete
          </div>
        </div>
      </div>
    );
  }

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Job Match Results</h1>
                <p className="text-gray-600">{analysisResult.position} at {analysisResult.company}</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">Match Score</div>
                <div className={`text-4xl font-bold ${
                  analysisResult.matchScore >= 80 ? 'text-green-600' :
                  analysisResult.matchScore >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {analysisResult.matchScore}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Matching Skills */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Matching Skills ({analysisResult.matchingSkills.length})
              </h3>
              <div className="space-y-2">
                {analysisResult.matchingSkills.map((skill, index) => (
                  <div key={index} className="bg-green-50 text-green-800 px-3 py-2 rounded-lg">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Missing Skills ({analysisResult.missingSkills.length})
              </h3>
              <div className="space-y-2">
                {analysisResult.missingSkills.map((skill, index) => (
                  <div key={index} className="bg-orange-50 text-orange-800 px-3 py-2 rounded-lg">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recommendations
              </h3>
              <div className="space-y-3">
                {analysisResult.recommendations.map((rec, index) => (
                  <div key={index} className="bg-blue-50 text-blue-800 p-3 rounded-lg">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Match Analysis</h1>
              <p className="text-gray-600">Get accurate matching analysis for specific job descriptions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* CV Upload */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Step 1: Upload Your CV
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Upload your CV or paste content below
                </p>
                <p className="text-gray-500">PDF, DOCX, or TXT files accepted</p>
              </label>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or paste your CV content here:
              </label>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paste your CV content here..."
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Step 2: Add Job Description
            </h2>
            
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Paste the complete job description here..."
            />
          </div>

          {/* Analyze Button */}
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={!cvText.trim() || !jobDescription.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              Analyze Job Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionAnalyzer;
