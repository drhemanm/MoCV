// src/components/JobDescriptionAnalyzer.tsx
import React, { useState } from 'react';
import { 
  Target, Upload, FileText, Zap, BarChart3, CheckCircle, 
  AlertTriangle, TrendingUp, Users, Clock, DollarSign,
  Star, Brain, Lightbulb, ArrowRight, Copy, Download
} from 'lucide-react';
import { TargetMarket, CVAnalysis } from '../types';
import { BackButton } from './BackButton';
import { Card } from './UI/Card';
import { Button } from './UI/Button';
import { ButtonSpinner } from './LoadingSpinner';

interface JobDescriptionAnalyzerProps {
  targetMarket: TargetMarket | null;
  onAnalysisComplete: (analysis: CVAnalysis, cvText: string, jobDescription: string) => void;
  onBack: () => void;
}

interface JobAnalysis {
  matchScore: number;
  salaryRange: string;
  experienceLevel: string;
  companySize: string;
  jobType: string;
  remoteOptions: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  keyPhrases: string[];
  industryFocus: string[];
}

const JobDescriptionAnalyzer: React.FC<JobDescriptionAnalyzerProps> = ({
  targetMarket,
  onAnalysisComplete,
  onBack
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [cvText, setCvText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'input' | 'analysis' | 'results'>('input');
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);

  const analyzeJobDescription = async () => {
    if (!jobDescription.trim() || !cvText.trim()) return;

    setIsAnalyzing(true);
    setCurrentStep('analysis');
    setAnalysisProgress(0);

    // Simulate analysis steps
    const steps = [
      { message: 'Parsing job description...', duration: 1000 },
      { message: 'Extracting key requirements...', duration: 1200 },
      { message: 'Analyzing your CV...', duration: 1500 },
      { message: 'Comparing skills and experience...', duration: 1000 },
      { message: 'Calculating match score...', duration: 800 },
      { message: 'Generating recommendations...', duration: 500 }
    ];

    let progress = 0;
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.duration));
      progress += 100 / steps.length;
      setAnalysisProgress(Math.min(progress, 100));
    }

    // Generate mock analysis
    const mockJobAnalysis: JobAnalysis = {
      matchScore: 78 + Math.floor(Math.random() * 15),
      salaryRange: '$75,000 - $95,000',
      experienceLevel: 'Mid-level (3-5 years)',
      companySize: 'Medium (100-500 employees)',
      jobType: 'Full-time',
      remoteOptions: 'Hybrid (2-3 days remote)',
      requiredSkills: [
        'JavaScript', 'React', 'Node.js', 'SQL', 'Git',
        'Problem Solving', 'Team Collaboration'
      ],
      preferredSkills: [
        'TypeScript', 'AWS', 'Docker', 'Agile/Scrum',
        'Test-Driven Development', 'CI/CD'
      ],
      responsibilities: [
        'Develop and maintain web applications using React and Node.js',
        'Collaborate with cross-functional teams to deliver high-quality software',
        'Participate in code reviews and maintain coding standards',
        'Debug and resolve technical issues in production systems',
        'Contribute to architecture decisions and technical planning'
      ],
      qualifications: [
        "Bachelor's degree in Computer Science or related field",
        '3+ years of experience in web development',
        'Strong proficiency in JavaScript and modern frameworks',
        'Experience with database design and SQL',
        'Excellent communication and problem-solving skills'
      ],
      benefits: [
        'Health, dental, and vision insurance',
        'Flexible PTO policy',
        'Remote work options',
        '$3,000 annual learning budget',
        'Stock options',
        '401(k) with company match'
      ],
      keyPhrases: [
        'full-stack development', 'agile methodology', 'scalable solutions',
        'user experience', 'technical leadership', 'continuous learning'
      ],
      industryFocus: ['Technology', 'SaaS', 'B2B Software']
    };

    const mockCVAnalysis: CVAnalysis = {
      score: mockJobAnalysis.matchScore,
      strengths: [
        'Strong technical skills alignment with job requirements',
        'Relevant experience in web development technologies',
        'Good match for required programming languages',
        'Professional experience level fits job requirements'
      ],
      weaknesses: [
        'Missing some preferred skills like TypeScript and AWS',
        'Could emphasize more leadership and mentoring experience',
        'Limited cloud deployment experience mentioned',
        'Could highlight more specific project outcomes'
      ],
      suggestions: [
        'Add specific metrics and achievements from previous roles',
        'Highlight any TypeScript or cloud platform experience',
        'Emphasize collaborative and leadership experiences',
        'Include relevant certifications or continuous learning efforts',
        'Tailor your summary to match the job\'s key requirements'
      ],
      sections: {
        summary: {
          score: mockJobAnalysis.matchScore - 5,
          feedback: 'Good alignment with role requirements',
          suggestions: ['Customize summary to mention specific technologies', 'Add relevant metrics']
        },
        experience: {
          score: mockJobAnalysis.matchScore + 3,
          feedback: 'Strong relevant experience',
          suggestions: ['Quantify achievements', 'Highlight team collaboration']
        },
        skills: {
          score: mockJobAnalysis.matchScore - 8,
          feedback: 'Good skill match with room for improvement',
          suggestions: ['Add missing preferred skills', 'Group skills by category']
        }
      },
      atsCompatibility: mockJobAnalysis.matchScore - 5,
      keywordMatches: mockJobAnalysis.requiredSkills.slice(0, 4),
      missingKeywords: mockJobAnalysis.preferredSkills.slice(0, 3)
    };

    setJobAnalysis(mockJobAnalysis);
    setIsAnalyzing(false);
    setCurrentStep('results');

    // Call the completion handler
    setTimeout(() => {
      onAnalysisComplete(mockCVAnalysis, cvText, jobDescription);
    }, 1000);
  };

  const handleJobDescriptionPaste = (text: string) => {
    setJobDescription(text);
    
    // Auto-extract job details from pasted text (simplified)
    const lines = text.toLowerCase();
    
    // Try to detect company and role
    const titleMatch = text.match(/job title[:\-\s]*(.*?)[\n\r]/i) || 
                      text.match(/position[:\-\s]*(.*?)[\n\r]/i) ||
                      text.match(/role[:\-\s]*(.*?)[\n\r]/i);
    
    if (titleMatch) {
      console.log('Detected job title:', titleMatch[1].trim());
    }
  };

  if (currentStep === 'analysis') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-12 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-white animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Job Match</h2>
          <p className="text-gray-600 mb-6">Our AI is comparing your CV with the job requirements</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${analysisProgress}%` }}
            ></div>
          </div>
          
          <div className="text-sm text-gray-500">
            {Math.round(analysisProgress)}% Complete
          </div>
        </Card>
      </div>
    );
  }

  if (currentStep === 'results' && jobAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} variant="minimal" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Job Match Analysis</h1>
                <p className="text-gray-600">Detailed analysis of how your CV matches this position</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">Match Score</div>
                <div className={`text-4xl font-bold ${
                  jobAnalysis.matchScore >= 80 ? 'text-green-600' :
                  jobAnalysis.matchScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {jobAnalysis.matchScore}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-lg font-bold text-gray-900">{jobAnalysis.salaryRange}</div>
              <div className="text-gray-600 text-sm">Salary Range</div>
            </Card>
            
            <Card className="p-6 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-lg font-bold text-gray-900">{jobAnalysis.experienceLevel}</div>
              <div className="text-gray-600 text-sm">Experience Level</div>
            </Card>
            
            <Card className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-lg font-bold text-gray-900">{jobAnalysis.companySize}</div>
              <div className="text-gray-600 text-sm">Company Size</div>
            </Card>
            
            <Card className="p-6 text-center">
              <Target className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <div className="text-lg font-bold text-gray-900">{jobAnalysis.remoteOptions}</div>
              <div className="text-gray-600 text-sm">Work Style</div>
            </Card>
          </div>

          {/* Skills Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Required Skills Match
              </h3>
              <div className="space-y-2">
                {jobAnalysis.requiredSkills.map((skill, index) => {
                  const hasSkill = Math.random() > 0.3; // Mock skill matching
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{skill}</span>
                      {hasSkill ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Preferred Skills
              </h3>
              <div className="space-y-2">
                {jobAnalysis.preferredSkills.map((skill, index) => {
                  const hasSkill = Math.random() > 0.6; // Mock skill matching
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{skill}</span>
                      {hasSkill ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="text-gray-400 text-xs">Missing</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h3>
              <ul className="space-y-2">
                {jobAnalysis.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits & Perks</h3>
              <ul className="space-y-2">
                {jobAnalysis.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Action Items */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Recommendations to Improve Your Match
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Skills to Highlight</h4>
                <div className="flex flex-wrap gap-2">
                  {jobAnalysis.requiredSkills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Skills to Learn</h4>
                <div className="flex flex-wrap gap-2">
                  {jobAnalysis.preferredSkills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button
              onClick={() => onAnalysisComplete({
                score: jobAnalysis.matchScore,
                strengths: [
                  'Strong technical skills alignment',
                  'Relevant experience level',
                  'Good cultural fit indicators'
                ],
                weaknesses: [
                  'Missing some preferred qualifications',
                  'Could emphasize more achievements'
                ],
                suggestions: [
                  'Tailor CV to highlight matching skills',
                  'Add relevant project examples',
                  'Emphasize quantifiable achievements'
                ],
                sections: {},
                atsCompatibility: jobAnalysis.matchScore - 5,
                keywordMatches: jobAnalysis.requiredSkills.slice(0, 4),
                missingKeywords: jobAnalysis.preferredSkills.slice(0, 3)
              }, cvText, jobDescription)}
              icon={<ArrowRight className="h-4 w-4" />}
              size="lg"
            >
              Get Detailed Improvement Suggestions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <BackButton onClick={onBack} variant="minimal" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Match Analysis</h1>
              <p className="text-gray-600">
                {targetMarket 
                  ? `Analyze how your CV matches ${targetMarket.name} job requirements`
                  : 'Compare your CV against specific job descriptions'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Instructions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Paste Job Description</h3>
                <p className="text-gray-600 text-sm">Copy the full job posting you're interested in</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Add Your CV</h3>
                <p className="text-gray-600 text-sm">Paste your current CV content for comparison</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Get Analysis</h3>
                <p className="text-gray-600 text-sm">Receive detailed match analysis and suggestions</p>
              </div>
            </div>
          </Card>

          {/* Job Description Input */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
            <div className="space-y-4">
              <textarea
                value={jobDescription}
                onChange={(e) => handleJobDescriptionPaste(e.target.value)}
                placeholder="Paste the complete job description here, including requirements, responsibilities, qualifications, and benefits..."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{jobDescription.length} characters</span>
                <span>Include full job posting for best analysis</span>
              </div>
            </div>
          </Card>

          {/* CV Input */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your CV Content</h2>
            <div className="space-y-4">
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your CV content here, including all sections: summary, experience, education, skills, etc..."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{cvText.length} characters</span>
                <span>Include all relevant sections for comprehensive analysis</span>
              </div>
            </div>
          </Card>

          {/* Analysis Button */}
          <div className="text-center">
            <Button
              onClick={analyzeJobDescription}
              disabled={!jobDescription.trim() || !cvText.trim() || isAnalyzing}
              icon={isAnalyzing ? <ButtonSpinner /> : <Zap className="h-5 w-5" />}
              size="lg"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Job Match'}
            </Button>
            
            {(!jobDescription.trim() || !cvText.trim()) && (
              <p className="text-gray-500 text-sm mt-2">
                Please provide both job description and CV content to start analysis
              </p>
            )}
          </div>

          {/* Sample Job Description */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Need a sample job description?</h3>
            <p className="text-blue-800 text-sm mb-4">
              Use this example to test the analysis feature:
            </p>
            <button
              onClick={() => setJobDescription(`Software Engineer - Frontend
Company: TechCorp Inc.
Location: San Francisco, CA (Remote friendly)
Salary: $80,000 - $120,000

We are looking for a passionate Frontend Developer to join our team...

Requirements:
• 3+ years of experience with React and JavaScript
• Strong knowledge of HTML, CSS, and modern web technologies
• Experience with REST APIs and state management
• Bachelor's degree in Computer Science or related field
• Excellent problem-solving and communication skills

Preferred:
• TypeScript experience
• Knowledge of Next.js or similar frameworks
• Experience with testing frameworks (Jest, Cypress)
• Familiarity with cloud platforms (AWS, Azure)

Benefits:
• Competitive salary and equity
• Health, dental, and vision insurance
• Flexible PTO and remote work options
• $2,000 annual learning budget`)}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Use this sample job description
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionAnalyzer;
