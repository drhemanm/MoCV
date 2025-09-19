import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, FileText, Scan, BarChart3, CheckCircle, AlertTriangle, 
  X, Download, Eye, Zap, Target, Brain, Award, TrendingUp,
  Clock, Users, Star, ArrowRight, RefreshCw, AlertCircle,
  FileCheck, Sparkles, Shield, Globe, Layers, Code, Edit,
  Save, Check, Copy, ExternalLink, ChevronRight, ChevronDown,
  User, Briefcase, GraduationCap, Wrench, FileType, MapPin
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

interface DetailedAnalysis {
  originalCV: string;
  improvedCV: string | null;
  score: number;
  atsCompatibility: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  sections: {
    contact: { score: number; issues: string[]; content: string };
    summary: { score: number; issues: string[]; content: string };
    experience: { score: number; issues: string[]; content: string };
    skills: { score: number; issues: string[]; content: string };
    education: { score: number; issues: string[]; content: string };
  };
  keywordMatches: string[];
  missingKeywords: string[];
  improvements: Array<{
    id: string;
    section: string;
    type: 'critical' | 'warning' | 'suggestion';
    title: string;
    description: string;
    before: string;
    after: string;
    applied: boolean;
  }>;
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
  const [analysis, setAnalysis] = useState<DetailedAnalysis | null>(null);
  const [showImprovedVersion, setShowImprovedVersion] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File validation
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (file.size > maxSize) return 'File size must be less than 10MB';
    if (!allowedTypes.includes(file.type)) return 'Please upload a PDF, Word document, or text file';
    return null;
  };

  // Extract text from file (mock implementation for demo)
  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          // For demo purposes - in production, use proper PDF/DOCX parsers
          resolve(`John Doe
Software Developer
Email: john.doe@email.com | Phone: +230 123 4567 | LinkedIn: linkedin.com/in/johndoe
Port Louis, Mauritius

PROFESSIONAL SUMMARY
Experienced software developer with background in web development. Worked on various projects.

EXPERIENCE
Software Developer - TechCorp Mauritius (2020-2023)
- Developed web applications
- Worked with team members
- Fixed bugs and issues

Junior Developer - StartupMU (2018-2020)  
- Created websites
- Learned new technologies

EDUCATION
Bachelor of Computer Science
University of Mauritius (2014-2018)

SKILLS
JavaScript, HTML, CSS, React, Communication`);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Detailed CV Analysis Engine
  const performDetailedAnalysis = async (cvText: string): Promise<DetailedAnalysis> => {
    const stages = [
      'Parsing CV structure...',
      'Analyzing contact information...',
      'Evaluating professional summary...',
      'Assessing work experience...',
      'Reviewing skills section...',
      'Checking education details...',
      'Performing keyword analysis...',
      'Calculating ATS compatibility...',
      'Generating improvement recommendations...'
    ];

    let progress = 0;
    for (const stage of stages) {
      setAnalysisStage(stage);
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        progress += 100 / (stages.length * 10);
        setAnalysisProgress(Math.min(progress, 100));
      }
    }

    // Parse CV sections
    const sections = parseCV(cvText);
    
    // Analyze each section
    const contactAnalysis = analyzeContact(sections.contact);
    const summaryAnalysis = analyzeSummary(sections.summary);
    const experienceAnalysis = analyzeExperience(sections.experience, targetMarket);
    const skillsAnalysis = analyzeSkills(sections.skills, targetMarket);
    const educationAnalysis = analyzeEducation(sections.education);
    
    // Calculate scores
    const sectionScores = [
      contactAnalysis.score,
      summaryAnalysis.score,
      experienceAnalysis.score,
      skillsAnalysis.score,
      educationAnalysis.score
    ];
    const overallScore = Math.round(sectionScores.reduce((a, b) => a + b) / sectionScores.length);

    // Keyword analysis
    const keywordAnalysis = performKeywordAnalysis(cvText, targetMarket);
    const atsCompatibility = calculateATSScore(cvText, keywordAnalysis);

    // Generate improvements
    const improvements = generateImprovements(
      contactAnalysis,
      summaryAnalysis,
      experienceAnalysis,
      skillsAnalysis,
      educationAnalysis,
      keywordAnalysis
    );

    // Compile strengths and weaknesses
    const strengths = [
      ...contactAnalysis.score > 70 ? ['Professional contact information'] : [],
      ...summaryAnalysis.score > 70 ? ['Clear professional summary'] : [],
      ...experienceAnalysis.score > 70 ? ['Detailed work experience'] : [],
      ...skillsAnalysis.score > 70 ? ['Comprehensive skills section'] : [],
      ...educationAnalysis.score > 70 ? ['Educational background provided'] : []
    ];

    const weaknesses = improvements.filter(imp => imp.type === 'critical').map(imp => imp.title);
    const suggestions = improvements.filter(imp => imp.type !== 'critical').map(imp => imp.title);

    return {
      originalCV: cvText,
      improvedCV: null,
      score: overallScore,
      atsCompatibility,
      strengths,
      weaknesses,
      suggestions,
      sections: {
        contact: contactAnalysis,
        summary: summaryAnalysis,
        experience: experienceAnalysis,
        skills: skillsAnalysis,
        education: educationAnalysis
      },
      keywordMatches: keywordAnalysis.found,
      missingKeywords: keywordAnalysis.missing,
      improvements
    };
  };

  // Parse CV into sections
  const parseCV = (text: string) => {
    const lowerText = text.toLowerCase();
    
    const contactInfo = {
      email: text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)?.[0] || '',
      phone: text.match(/(\+\d{1,3}[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}/)?.[0] || '',
      linkedin: text.match(/linkedin\.com\/in\/[\w-]+/i)?.[0] || '',
      location: text.match(/(mauritius|port louis|quatre bornes|rose hill|curepipe)/gi)?.[0] || ''
    };
    
    const summaryStart = Math.max(
      lowerText.indexOf('summary'),
      lowerText.indexOf('objective'),
      lowerText.indexOf('profile')
    );
    
    const experienceStart = Math.max(
      lowerText.indexOf('experience'),
      lowerText.indexOf('employment'),
      lowerText.indexOf('work')
    );
    
    const skillsStart = Math.max(
      lowerText.indexOf('skills'),
      lowerText.indexOf('technical skills')
    );
    
    const educationStart = Math.max(
      lowerText.indexOf('education'),
      lowerText.indexOf('qualifications')
    );

    return {
      contact: contactInfo,
      summary: extractSection(text, summaryStart, experienceStart),
      experience: extractSection(text, experienceStart, skillsStart),
      skills: extractSection(text, skillsStart, educationStart),
      education: extractSection(text, educationStart, text.length)
    };
  };

  const extractSection = (text: string, start: number, end: number): string => {
    if (start === -1) return '';
    const endPos = end === -1 ? text.length : end;
    return text.substring(start, endPos).trim();
  };

  // Section analyzers
  const analyzeContact = (contact: any) => {
    let score = 100;
    const issues = [];
    
    if (!contact.email) {
      issues.push('Missing professional email address');
      score -= 30;
    }
    if (!contact.phone) {
      issues.push('No phone number provided');
      score -= 25;
    }
    if (!contact.linkedin) {
      issues.push('LinkedIn profile not included');
      score -= 20;
    }
    if (!contact.location) {
      issues.push('Location not specified');
      score -= 15;
    }

    return {
      score: Math.max(score, 0),
      issues,
      content: `${contact.email} | ${contact.phone} | ${contact.linkedin} | ${contact.location}`
    };
  };

  const analyzeSummary = (summary: string) => {
    let score = 100;
    const issues = [];
    
    if (!summary || summary.length < 50) {
      issues.push('Professional summary too brief or missing');
      score -= 40;
    } else {
      if (!/\d/.test(summary)) {
        issues.push('No quantifiable achievements mentioned');
        score -= 20;
      }
      if (summary.length > 300) {
        issues.push('Summary too lengthy - keep it concise');
        score -= 15;
      }
    }

    return { score: Math.max(score, 0), issues, content: summary };
  };

  const analyzeExperience = (experience: string, targetMarket: TargetMarket | null) => {
    let score = 100;
    const issues = [];
    
    if (!experience || experience.length < 100) {
      issues.push('Work experience section inadequate');
      score -= 50;
    } else {
      const bulletPoints = experience.split('\n').filter(line => 
        line.trim().startsWith('-') || line.trim().startsWith('•')
      );
      
      if (bulletPoints.length < 3) {
        issues.push('Insufficient detail in job descriptions');
        score -= 25;
      }
      
      if (!/\d+%|\d+ years?|\d+\+|\$\d+/i.test(experience)) {
        issues.push('No quantifiable achievements');
        score -= 30;
      }
      
      if (/\b(worked|helped|assisted|was responsible)\b/gi.test(experience)) {
        issues.push('Uses weak action verbs');
        score -= 20;
      }
    }

    return { score: Math.max(score, 0), issues, content: experience };
  };

  const analyzeSkills = (skills: string, targetMarket: TargetMarket | null) => {
    let score = 100;
    const issues = [];
    
    if (!skills || skills.length < 20) {
      issues.push('Skills section missing or inadequate');
      score -= 40;
    } else {
      const skillsLower = skills.toLowerCase();
      
      if (targetMarket?.id === 'technology') {
        const techSkills = ['javascript', 'python', 'react', 'node', 'sql'];
        const foundTechSkills = techSkills.filter(skill => skillsLower.includes(skill));
        if (foundTechSkills.length < 2) {
          issues.push('Insufficient technical skills for technology role');
          score -= 25;
        }
      }
      
      if (!skillsLower.includes('communication') && !skillsLower.includes('leadership')) {
        issues.push('Missing soft skills');
        score -= 20;
      }
    }

    return { score: Math.max(score, 0), issues, content: skills };
  };

  const analyzeEducation = (education: string) => {
    let score = 100;
    const issues = [];
    
    if (!education || education.length < 20) {
      issues.push('Education section incomplete');
      score -= 25;
    } else {
      if (!/\d{4}/.test(education)) {
        issues.push('Missing graduation dates');
        score -= 15;
      }
    }

    return { score: Math.max(score, 0), issues, content: education };
  };

  // Keyword analysis
  const performKeywordAnalysis = (text: string, targetMarket: TargetMarket | null) => {
    const getMarketKeywords = (marketId: string) => {
      const keywords = {
        technology: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'API'],
        finance: ['Financial Analysis', 'Excel', 'Budget', 'Compliance', 'Risk Management'],
        marketing: ['Digital Marketing', 'SEO', 'Analytics', 'Campaign', 'Brand Management'],
        general: ['Communication', 'Leadership', 'Project Management', 'Problem Solving']
      };
      return keywords[marketId as keyof typeof keywords] || keywords.general;
    };

    const marketKeywords = getMarketKeywords(targetMarket?.id || 'general');
    const textLower = text.toLowerCase();
    
    const found = marketKeywords.filter(keyword => 
      textLower.includes(keyword.toLowerCase())
    );
    
    const missing = marketKeywords.filter(keyword => 
      !textLower.includes(keyword.toLowerCase())
    );

    return { found, missing };
  };

  const calculateATSScore = (text: string, keywordAnalysis: any) => {
    let score = 100;
    
    const keywordDensity = (keywordAnalysis.found.length / 
      (keywordAnalysis.found.length + keywordAnalysis.missing.length)) * 100;
    
    if (keywordDensity < 30) score -= 25;
    if (!text.toLowerCase().includes('experience')) score -= 20;
    if (!text.toLowerCase().includes('skills')) score -= 15;
    
    return Math.max(score, 40);
  };

  // Generate improvements
  const generateImprovements = (contact: any, summary: any, experience: any, skills: any, education: any, keywordAnalysis: any) => {
    const improvements = [];
    let id = 1;

    // Contact improvements
    contact.issues.forEach((issue: string) => {
      improvements.push({
        id: `contact-${id++}`,
        section: 'contact',
        type: 'critical' as const,
        title: issue,
        description: getImprovementDescription(issue),
        before: getBeforeExample(issue),
        after: getAfterExample(issue),
        applied: false
      });
    });

    // Summary improvements
    summary.issues.forEach((issue: string) => {
      improvements.push({
        id: `summary-${id++}`,
        section: 'summary',
        type: 'warning' as const,
        title: issue,
        description: getImprovementDescription(issue),
        before: getBeforeExample(issue),
        after: getAfterExample(issue),
        applied: false
      });
    });

    // Experience improvements
    experience.issues.forEach((issue: string) => {
      improvements.push({
        id: `experience-${id++}`,
        section: 'experience',
        type: 'critical' as const,
        title: issue,
        description: getImprovementDescription(issue),
        before: getBeforeExample(issue),
        after: getAfterExample(issue),
        applied: false
      });
    });

    return improvements;
  };

  const getImprovementDescription = (issue: string): string => {
    const descriptions: { [key: string]: string } = {
      'Missing professional email address': 'Add a professional email address for employers to contact you',
      'No phone number provided': 'Include a phone number for direct communication',
      'LinkedIn profile not included': 'Add your LinkedIn profile to show professional network',
      'Professional summary too brief or missing': 'Write a compelling 3-4 sentence professional summary',
      'No quantifiable achievements mentioned': 'Add specific numbers and percentages to show impact',
      'Work experience section inadequate': 'Provide detailed job descriptions with achievements',
      'No quantifiable achievements': 'Include metrics like percentages, dollar amounts, or timeframes',
      'Uses weak action verbs': 'Replace passive language with strong action verbs'
    };
    return descriptions[issue] || 'Improve this section for better impact';
  };

  const getBeforeExample = (issue: string): string => {
    const examples: { [key: string]: string } = {
      'Missing professional email address': 'No email provided',
      'Professional summary too brief or missing': 'Experienced developer.',
      'No quantifiable achievements mentioned': 'Improved system performance and helped team',
      'Uses weak action verbs': 'Worked on projects, helped with development'
    };
    return examples[issue] || 'Current content needs improvement';
  };

  const getAfterExample = (issue: string): string => {
    const examples: { [key: string]: string } = {
      'Missing professional email address': 'john.doe@email.com',
      'Professional summary too brief or missing': 'Results-driven software developer with 5+ years experience building scalable applications serving 10,000+ users',
      'No quantifiable achievements mentioned': 'Improved system performance by 35% and led team of 8 developers',
      'Uses weak action verbs': 'Led cross-platform projects, architected scalable solutions'
    };
    return examples[issue] || 'Improved content with specific examples';
  };

  // Apply improvements
  const applyAllImprovements = async () => {
    if (!analysis) return;

    setIsImproving(true);
    
    // Simulate improvement process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setAnalysisProgress(i);
    }

    // Generate improved CV
    const improvedCV = generateImprovedCV(analysis);
    
    // Mark all improvements as applied
    const updatedImprovements = analysis.improvements.map(imp => ({
      ...imp,
      applied: true
    }));

    setAnalysis({
      ...analysis,
      improvedCV,
      improvements: updatedImprovements
    });

    setIsImproving(false);
    setShowImprovedVersion(true);
  };

  // Generate improved CV
  const generateImprovedCV = (analysis: DetailedAnalysis): string => {
    let improved = analysis.originalCV;

    // Add missing contact info
    if (!improved.includes('@')) {
      improved = 'john.doe@email.com | +230 123 4567 | linkedin.com/in/johndoe | Port Louis, Mauritius\n\n' + improved;
    }

    // Enhance summary
    if (analysis.sections.summary.score < 70) {
      const summaryRegex = /(professional summary|summary|objective)([\s\S]*?)(?=\n[A-Z]|\nEXPERIENCE|\nSKILLS|$)/i;
      improved = improved.replace(summaryRegex, 
        'PROFESSIONAL SUMMARY\nResults-driven professional with 5+ years of experience. Proven track record of improving performance by 35% and leading cross-functional teams. Specialized in delivering high-quality solutions and exceeding targets by 20%.'
      );
    }

    // Enhance experience bullets
    improved = improved.replace(
      /^- (.*)/gm,
      (match, content) => {
        if (content.toLowerCase().includes('developed') || content.toLowerCase().includes('worked')) {
          return `- ${content} (improved efficiency by 25% and increased user satisfaction by 40%)`;
        }
        return match;
      }
    );

    // Add missing keywords
    const missingKeywords = analysis.missingKeywords.slice(0, 3);
    if (missingKeywords.length > 0) {
      improved += `\n\nADDITIONAL SKILLS\n${missingKeywords.join(' • ')} • Project Management • Team Leadership`;
    }

    return improved;
  };

  // Download functionality
  const downloadCV = (content: string, filename: string) => {
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      setUploadError('Failed to download file. Please try again.');
    }
  };

  // File handling
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

  const handleAnalyze = async () => {
    let textToAnalyze = '';
    
    if (uploadMethod === 'file' && cvFile) {
      try {
        textToAnalyze = await extractTextFromFile(cvFile);
      } catch (error) {
        setUploadError('Failed to extract text from file. Please try again.');
        return;
      }
    } else if (uploadMethod === 'text') {
      textToAnalyze = cvText.trim();
    }

    if (!textToAnalyze || textToAnalyze.length < 50) {
      setUploadError('Please provide sufficient CV content to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setUploadError(null);

    try {
      const detailedAnalysis = await performDetailedAnalysis(textToAnalyze);
      setAnalysis(detailedAnalysis);
      
      // Convert for parent component
      const standardAnalysis: CVAnalysis = {
        score: detailedAnalysis.score,
        strengths: detailedAnalysis.strengths,
        weaknesses: detailedAnalysis.weaknesses,
        suggestions: detailedAnalysis.suggestions,
        sections: detailedAnalysis.sections,
        atsCompatibility: detailedAnalysis.atsCompatibility,
        keywordMatches: detailedAnalysis.keywordMatches,
        missingKeywords: detailedAnalysis.missingKeywords
      };
      
      onAnalysisComplete(standardAnalysis, textToAnalyze);
    } catch (error) {
      setUploadError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadMethod(null);
    setCvFile(null);
    setCvText('');
    setUploadError(null);
    setAnalysis(null);
    setShowImprovedVersion(false);
    setIsImproving(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Analysis Results Display
  if (analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <BackButton onClick={handleReset} variant="minimal" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">CV Analysis Results</h1>
                <p className="text-gray-600 mt-1">Detailed analysis with specific improvements</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => downloadCV(analysis.originalCV, 'original-cv.txt')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Original CV
                </button>
                {analysis.improvedCV && (
                  <button
                    onClick={() => downloadCV(analysis.improvedCV!, 'improved-cv.txt')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Enhanced CV
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3">
              {/* Scores Overview */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" 
                          fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" 
                          fill="none" stroke={analysis.score >= 80 ? "#10b981" : analysis.score >= 60 ? "#f59e0b" : "#ef4444"} 
                          strokeWidth="2" strokeDasharray={`${analysis.score}, 100`}/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{analysis.score}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold">Overall Score</h3>
                  </div>

                  {/* ATS Compatibility */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" 
                          fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" 
                          fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray={`${analysis.atsCompatibility}, 100`}/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{analysis.atsCompatibility}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold">ATS Compatible</h3>
                  </div>

                  {/* Keywords */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" 
                          fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" 
                          fill="none" stroke="#8b5cf6" strokeWidth="2" 
                          strokeDasharray={`${(analysis.keywordMatches.length / (analysis.keywordMatches.length + analysis.missingKeywords.length)) * 100}, 100`}/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{analysis.keywordMatches.length}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold">Keywords Found</h3>
                  </div>
                </div>
              </div>

              {/* Improvements Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Specific Improvements</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {analysis.improvements.length} Issues Found
                  </span>
                </div>

                <div className="space-y-6">
                  {analysis.improvements.map((improvement) => (
                    <div key={improvement.id} className={`border rounded-xl p-6 ${
                      improvement.type === 'critical' ? 'border-red-200 bg-red-50' :
                      improvement.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            improvement.type === 'critical' ? 'bg-red-100' :
                            improvement.type === 'warning' ? 'bg-yellow-100' :
                            'bg-blue-100'
                          }`}>
                            {improvement.type === 'critical' ? (
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            ) : improvement.type === 'warning' ? (
                              <AlertCircle className="h-5 w-5 text-yellow-600" />
                            ) : (
                              <Sparkles className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{improvement.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              improvement.type === 'critical' ? 'bg-red-100 text-red-800' :
                              improvement.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {improvement.section} • {improvement.type}
                            </span>
                          </div>
                        </div>
                        
                        {improvement.applied ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Applied</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Not applied</span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4">{improvement.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-red-800 mb-2">Before:</h5>
                          <div className="bg-white border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-gray-700 italic">{improvement.before}</p>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-green-800 mb-2">After:</h5>
                          <div className="bg-white border border-green-200 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{improvement.after}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Actions</h3>
                <div className="space-y-3">
                  {!analysis.improvedCV ? (
                    <button
                      onClick={applyAllImprovements}
                      disabled={isImproving}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
                    >
                      {isImproving ? (
                        <>
                          <ButtonSpinner />
                          Applying Improvements...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Apply All Improvements
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-800 mb-2">
                        <Check className="h-5 w-5" />
                        <span className="font-semibold">Improvements Applied!</span>
                      </div>
                      <p className="text-green-700 text-sm mb-3">
                        Your CV has been enhanced with all recommendations.
                      </p>
                      <button
                        onClick={() => setShowImprovedVersion(!showImprovedVersion)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                      >
                        {showImprovedVersion ? 'Hide' : 'View'} Enhanced CV
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={onCreateNew}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Build New CV
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Analyze Another CV
                  </button>
                </div>
              </div>

              {/* Section Scores */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Section Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(analysis.sections).map(([section, data]) => (
                    <div key={section} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium capitalize">{section}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          data.score >= 80 ? 'bg-green-500' :
                          data.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="font-bold">{data.score}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Keywords</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">
                      Found ({analysis.keywordMatches.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywordMatches.slice(0, 6).map((keyword, i) => (
                        <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">
                      Missing ({analysis.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.slice(0, 6).map((keyword, i) => (
                        <span key={i} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced CV Preview */}
          {showImprovedVersion && analysis.improvedCV && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Enhanced CV</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(analysis.improvedCV!)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  <button
                    onClick={() => downloadCV(analysis.improvedCV!, 'enhanced-cv.txt')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                  {analysis.improvedCV}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Upload Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <BackButton onClick={onBack} variant="minimal" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">CV Analyzer</h1>
              <p className="text-gray-600 mt-1">
                Get detailed analysis and specific improvements for your CV
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6">
                  <LoadingSpinner />
                </div>
                <h3 className="text-xl font-bold mb-2">Analyzing Your CV</h3>
                <p className="text-gray-600 mb-6">{analysisStage}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">{Math.round(analysisProgress)}% complete</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Methods */}
        {!uploadMethod && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Intelligent CV Analysis</h2>
              <p className="text-xl text-gray-600 mb-8">
                Upload your CV and get detailed feedback with specific improvements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* File Upload */}
              <button
                onClick={() => setUploadMethod('file')}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Upload File</h3>
                <p className="text-gray-600 mb-4">
                  Upload your CV as PDF, Word document, or text file
                </p>
                <div className="text-blue-600 font-semibold flex items-center gap-2">
                  Choose file <ArrowRight className="h-4 w-4" />
                </div>
              </button>

              {/* Text Input */}
              <button
                onClick={() => setUploadMethod('text')}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Paste Text</h3>
                <p className="text-gray-600 mb-4">
                  Copy and paste your CV text directly into the analyzer
                </p>
                <div className="text-green-600 font-semibold flex items-center gap-2">
                  Enter text <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Brain, title: 'AI Analysis', desc: 'Intelligent content analysis' },
                { icon: Target, title: 'Specific Feedback', desc: 'Actionable improvements' },
                { icon: Shield, title: 'ATS Optimized', desc: 'Pass applicant systems' },
                { icon: Award, title: 'Professional', desc: 'Industry standards' }
              ].map((feature, index) => (
                <div key={index} className="bg-white/70 rounded-xl p-6 text-center">
                  <feature.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Upload Interface */}
        {uploadMethod === 'file' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Upload Your CV</h3>
                <button
                  onClick={() => setUploadMethod(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : cvFile 
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                />
                
                {cvFile ? (
                  <div>
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-green-800 mb-2">File Selected</p>
                    <p className="text-green-600">{cvFile.name}</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold mb-2">Drop your CV here</p>
                    <p className="text-gray-500 mb-4">or click to browse</p>
                    <p className="text-sm text-gray-400">
                      Supports PDF, Word documents, and text files (Max 10MB)
                    </p>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">{uploadError}</span>
                  </div>
                </div>
              )}

              {cvFile && (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Scan className="h-5 w-5" />
                  Analyze CV
                </button>
              )}
            </div>
          </div>
        )}

        {/* Text Input Interface */}
        {uploadMethod === 'text' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Paste Your CV Text</h3>
                <button
                  onClick={() => setUploadMethod(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your complete CV text here..."
                className="w-full h-96 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  {cvText.length} characters
                </p>
                {cvText.length >= 50 && (
                  <span className="text-green-600 text-sm font-medium">
                    Ready to analyze
                  </span>
                )}
              </div>

              {uploadError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">{uploadError}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || cvText.length < 50}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Scan className="h-5 w-5" />
                Analyze CV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVAnalyzer;
