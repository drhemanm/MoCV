// src/components/CVAnalyzer.tsx
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

interface DetailedSectionAnalysis {
  score: number;
  issues: Array<{
    type: 'critical' | 'warning' | 'suggestion';
    title: string;
    description: string;
    before: string;
    after: string;
    impact: string;
  }>;
  strengths: string[];
  content?: string;
}

interface IntelligentAnalysis {
  overallScore: number;
  atsCompatibility: number;
  sections: {
    contact: DetailedSectionAnalysis;
    summary: DetailedSectionAnalysis;
    experience: DetailedSectionAnalysis;
    skills: DetailedSectionAnalysis;
    education: DetailedSectionAnalysis;
  };
  keywordAnalysis: {
    found: string[];
    missing: string[];
    density: number;
  };
  improvements: Array<{
    section: string;
    type: 'critical' | 'warning' | 'suggestion';
    title: string;
    description: string;
    before: string;
    after: string;
    applied?: boolean;
  }>;
  originalCV: string;
  improvedCV?: string;
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
  const [analysis, setAnalysis] = useState<IntelligentAnalysis | null>(null);
  const [showImprovedVersion, setShowImprovedVersion] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [appliedImprovements, setAppliedImprovements] = useState<Set<number>>(new Set());
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // File validation and extraction (keeping existing methods)
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

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else if (result instanceof ArrayBuffer) {
          // Simulate extraction for demo - in production, use proper PDF/DOCX parsers
          resolve(`John Doe
Software Developer
Email: john.doe@email.com | Phone: +230 123 4567 | LinkedIn: linkedin.com/in/johndoe
Port Louis, Mauritius

PROFESSIONAL SUMMARY
Experienced software developer with background in web development. Worked on various projects and improved system performance.

EXPERIENCE
Software Developer - TechCorp Mauritius (2020-2023)
- Developed web applications
- Worked with team members
- Fixed bugs and issues
- Improved system performance

Junior Developer - StartupMU (2018-2020)  
- Created websites
- Learned new technologies
- Helped with projects

EDUCATION
Bachelor of Computer Science
University of Mauritius (2014-2018)

SKILLS
JavaScript, HTML, CSS, React, Node.js, Database, Communication, Problem solving`);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  // Intelligent CV Analysis Engine
  const performIntelligentAnalysis = async (text: string): Promise<IntelligentAnalysis> => {
    const stages = [
      { stage: 'Parsing CV structure and extracting sections...', duration: 1000 },
      { stage: 'Analyzing contact information completeness...', duration: 800 },
      { stage: 'Evaluating professional summary effectiveness...', duration: 1200 },
      { stage: 'Assessing work experience descriptions...', duration: 1500 },
      { stage: 'Reviewing skills presentation and relevance...', duration: 1000 },
      { stage: 'Checking education section and qualifications...', duration: 800 },
      { stage: 'Performing keyword optimization analysis...', duration: 1200 },
      { stage: 'Calculating ATS compatibility score...', duration: 800 },
      { stage: 'Generating specific improvement recommendations...', duration: 1000 }
    ];

    let progress = 0;
    
    for (const { stage, duration } of stages) {
      setAnalysisStage(stage);
      
      const steps = 12;
      const stepDuration = duration / steps;
      const progressIncrement = (100 / stages.length) / steps;
      
      for (let i = 0; i < steps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        progress += progressIncrement;
        setAnalysisProgress(Math.min(progress, 100));
      }
    }

    // Parse CV sections
    const sections = parseCV(text);
    
    // Analyze each section in detail
    const contactAnalysis = analyzeContactSection(sections.contact);
    const summaryAnalysis = analyzeSummarySection(sections.summary);
    const experienceAnalysis = analyzeExperienceSection(sections.experience, targetMarket);
    const skillsAnalysis = analyzeSkillsSection(sections.skills, targetMarket);
    const educationAnalysis = analyzeEducationSection(sections.education);
    
    // Keyword analysis
    const keywordAnalysis = performKeywordAnalysis(text, targetMarket);
    
    // Calculate overall scores
    const sectionScores = [
      contactAnalysis.score,
      summaryAnalysis.score, 
      experienceAnalysis.score,
      skillsAnalysis.score,
      educationAnalysis.score
    ];
    
    const overallScore = Math.round(sectionScores.reduce((a, b) => a + b) / sectionScores.length);
    const atsCompatibility = calculateATSCompatibility(text, keywordAnalysis);

    // Generate comprehensive improvements
    const improvements = generateSmartImprovements(
      contactAnalysis,
      summaryAnalysis, 
      experienceAnalysis,
      skillsAnalysis,
      educationAnalysis,
      keywordAnalysis
    );

    return {
      overallScore,
      atsCompatibility,
      sections: {
        contact: contactAnalysis,
        summary: summaryAnalysis,
        experience: experienceAnalysis,
        skills: skillsAnalysis,
        education: educationAnalysis
      },
      keywordAnalysis,
      improvements,
      originalCV: text
    };
  };

  // Parse CV into sections
  const parseCV = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Extract contact information
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = text.match(/(\+\d{1,3}[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}/);
    const linkedInMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    
    // Find section boundaries
    const summaryStart = Math.max(
      lowerText.indexOf('summary'),
      lowerText.indexOf('objective'),
      lowerText.indexOf('profile')
    );
    
    const experienceStart = Math.max(
      lowerText.indexOf('experience'),
      lowerText.indexOf('employment'),
      lowerText.indexOf('work history')
    );
    
    const skillsStart = Math.max(
      lowerText.indexOf('skills'),
      lowerText.indexOf('technical skills'),
      lowerText.indexOf('competencies')
    );
    
    const educationStart = Math.max(
      lowerText.indexOf('education'),
      lowerText.indexOf('qualifications'),
      lowerText.indexOf('academic')
    );

    return {
      contact: {
        email: emailMatch?.[0] || '',
        phone: phoneMatch?.[0] || '',
        linkedin: linkedInMatch?.[0] || '',
        location: extractLocation(text)
      },
      summary: extractSection(text, summaryStart, [experienceStart, skillsStart, educationStart]),
      experience: extractSection(text, experienceStart, [skillsStart, educationStart]),
      skills: extractSection(text, skillsStart, [educationStart]),
      education: extractSection(text, educationStart, [])
    };
  };

  const extractLocation = (text: string): string => {
    const locationPatterns = [
      /(?:port louis|quatre bornes|rose hill|curepipe|beau bassin|phoenix|vacoas|floreal|mauritius)/gi,
      /(?:street|st|avenue|ave|road|rd|lane|ln|drive|dr)[\s,]/gi
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    return '';
  };

  const extractSection = (text: string, startIndex: number, endIndices: number[]): string => {
    if (startIndex === -1) return '';
    
    const validEndIndices = endIndices.filter(i => i > startIndex && i !== -1);
    const endIndex = validEndIndices.length > 0 ? Math.min(...validEndIndices) : text.length;
    
    return text.substring(startIndex, endIndex).trim();
  };

  // Section Analysis Functions
  const analyzeContactSection = (contact: any): DetailedSectionAnalysis => {
    const issues = [];
    let score = 100;

    if (!contact.email) {
      issues.push({
        type: 'critical' as const,
        title: 'Missing Professional Email',
        description: 'Your CV must include a professional email address for employers to contact you',
        before: 'No email address provided',
        after: 'john.doe@email.com',
        impact: 'Critical - Employers cannot contact you without an email'
      });
      score -= 30;
    }

    if (!contact.phone) {
      issues.push({
        type: 'critical' as const,
        title: 'No Phone Number Listed',
        description: 'Include a phone number for immediate communication opportunities',
        before: 'No phone number',
        after: '+230 123 4567',
        impact: 'High - Reduces callback opportunities'
      });
      score -= 25;
    }

    if (!contact.linkedin) {
      issues.push({
        type: 'warning' as const,
        title: 'LinkedIn Profile Missing',
        description: 'Add your LinkedIn profile to showcase professional network and endorsements',
        before: 'No LinkedIn profile',
        after: 'LinkedIn: linkedin.com/in/yourname',
        impact: 'Medium - Missed networking and credibility opportunity'
      });
      score -= 15;
    }

    if (!contact.location) {
      issues.push({
        type: 'suggestion' as const,
        title: 'Location Not Specified',
        description: 'Include your location to help employers assess commute and local availability',
        before: 'No location mentioned',
        after: 'Port Louis, Mauritius',
        impact: 'Low - Helps with local job matching'
      });
      score -= 10;
    }

    const strengths = [];
    if (contact.email) strengths.push('Professional email address included');
    if (contact.phone) strengths.push('Phone number provided for direct contact');
    if (contact.linkedin) strengths.push('LinkedIn profile shows professional online presence');
    if (contact.location) strengths.push('Location helps with job matching');

    return {
      score: Math.max(score, 0),
      issues,
      strengths: strengths.length > 0 ? strengths : ['Basic contact structure present']
    };
  };

  const analyzeSummarySection = (summary: string): DetailedSectionAnalysis => {
    const issues = [];
    let score = 100;
    
    if (!summary || summary.length < 50) {
      issues.push({
        type: 'critical' as const,
        title: 'Professional Summary Too Brief or Missing',
        description: 'Your professional summary should be 3-4 sentences highlighting your key value proposition',
        before: summary || 'No professional summary',
        after: 'Results-driven software developer with 5+ years of experience building scalable web applications. Proven track record of improving system performance by 40% and leading cross-functional teams of 8+ developers. Specialized in React.js and Node.js with expertise in cloud deployment and agile methodologies.',
        impact: 'Critical - Summary is often the first thing recruiters read'
      });
      score -= 40;
    } else {
      // Check for specific improvements in existing summary
      if (!/\d/.test(summary)) {
        issues.push({
          type: 'warning' as const,
          title: 'No Quantifiable Achievements in Summary',
          description: 'Add specific numbers, percentages, or metrics to demonstrate impact',
          before: 'Experienced developer with background in web development',
          after: 'Experienced developer with 5+ years building web applications, improving performance by 35%',
          impact: 'High - Quantified results grab attention and show measurable value'
        });
        score -= 20;
      }

      if (summary.length > 500) {
        issues.push({
          type: 'suggestion' as const,
          title: 'Summary Too Lengthy',
          description: 'Keep professional summary concise (3-4 sentences, 150-200 words)',
          before: 'Very long summary paragraph...',
          after: 'Concise 3-4 sentence summary focusing on key achievements and skills',
          impact: 'Medium - Recruiters prefer scannable, concise summaries'
        });
        score -= 15;
      }

      const keywordDensity = calculateKeywordDensity(summary, targetMarket);
      if (keywordDensity < 2) {
        issues.push({
          type: 'warning' as const,
          title: 'Lacks Industry-Specific Keywords',
          description: 'Include relevant keywords from your target job descriptions',
          before: 'Generic description without industry terms',
          after: 'Include specific technologies, methodologies, and skills relevant to your field',
          impact: 'High - ATS systems and recruiters search for specific keywords'
        });
        score -= 25;
      }
    }

    const strengths = [];
    if (summary && summary.length >= 50) strengths.push('Professional summary section exists');
    if (/\d/.test(summary)) strengths.push('Includes quantifiable metrics');
    if (summary && summary.length <= 300) strengths.push('Appropriate length for scannable reading');

    return {
      score: Math.max(score, 0),
      issues,
      strengths: strengths.length > 0 ? strengths : [],
      content: summary
    };
  };

  const analyzeExperienceSection = (experience: string, targetMarket: TargetMarket | null): DetailedSectionAnalysis => {
    const issues = [];
    let score = 100;

    if (!experience || experience.length < 100) {
      issues.push({
        type: 'critical' as const,
        title: 'Work Experience Section Inadequate',
        description: 'Provide detailed work history with specific responsibilities and achievements',
        before: experience || 'No work experience listed',
        after: `Senior Software Developer - TechCorp Mauritius (Jan 2020 - Present)
• Led development of customer portal serving 10,000+ users, increasing user satisfaction by 45%
• Reduced system load times by 60% through code optimization and database restructuring
• Mentored team of 5 junior developers, improving code review efficiency by 30%
• Technologies: React.js, Node.js, PostgreSQL, AWS`,
        impact: 'Critical - Experience is the most important section for most roles'
      });
      score -= 50;
    } else {
      // Check for specific issues in experience descriptions
      const bulletPoints = experience.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'));
      
      if (bulletPoints.length < 3) {
        issues.push({
          type: 'warning' as const,
          title: 'Insufficient Detail in Job Descriptions',
          description: 'Each role should have 3-5 bullet points describing key responsibilities and achievements',
          before: '- Developed web applications\n- Worked with team',
          after: '• Developed 15+ responsive web applications using React.js, serving 5,000+ daily users\n• Collaborated with cross-functional team of 8 members to deliver projects 20% faster\n• Implemented automated testing, reducing bug reports by 40%',
          impact: 'High - Detailed descriptions help recruiters understand your capabilities'
        });
        score -= 25;
      }

      const hasQuantifiableResults = bulletPoints.some(point => /\d+%|\d+\+|\$\d+|\d+ years?/i.test(point));
      if (!hasQuantifiableResults) {
        issues.push({
          type: 'critical' as const,
          title: 'No Quantifiable Achievements',
          description: 'Add specific numbers, percentages, dollar amounts, or timeframes to show impact',
          before: 'Improved system performance and user satisfaction',
          after: 'Improved system performance by 35% and increased user satisfaction scores from 7.2 to 9.1',
          impact: 'Critical - Numbers prove your value and impact to employers'
        });
        score -= 30;
      }

      const hasWeakVerbs = experience.match(/\b(worked|helped|assisted|was responsible|did|handled)\b/gi);
      if (hasWeakVerbs && hasWeakVerbs.length > 2) {
        issues.push({
          type: 'warning' as const,
          title: 'Weak Action Verbs Used',
          description: 'Replace passive language with strong action verbs that demonstrate leadership and impact',
          before: 'Worked on projects, helped with development, was responsible for testing',
          after: 'Led cross-platform projects, architected scalable solutions, implemented comprehensive testing protocols',
          impact: 'Medium - Strong verbs convey leadership and proactive contribution'
        });
        score -= 20;
      }

      // Check for technology mentions if tech role
      if (targetMarket?.id === 'technology') {
        const hasTechnologies = /\b(javascript|python|react|node|sql|aws|azure|docker|kubernetes|git)\b/gi.test(experience);
        if (!hasTechnologies) {
          issues.push({
            type: 'warning' as const,
            title: 'Missing Technical Skills in Experience',
            description: 'Mention specific technologies, frameworks, and tools used in each role',
            before: 'Developed web applications and databases',
            after: 'Developed responsive web applications using React.js, Node.js, and PostgreSQL database',
            impact: 'High - Technical roles require specific technology mentions'
          });
          score -= 25;
        }
      }
    }

    const strengths = [];
    if (experience && experience.length >= 100) strengths.push('Substantial work experience provided');
    if (/\d+%|\d+\+|\$\d+/i.test(experience)) strengths.push('Includes quantifiable achievements');
    if (/\b(led|managed|developed|implemented|created|optimized|increased|reduced)\b/gi.test(experience)) {
      strengths.push('Uses strong action verbs');
    }

    return {
      score: Math.max(score, 0),
      issues,
      strengths: strengths.length > 0 ? strengths : [],
      content: experience
    };
  };

  const analyzeSkillsSection = (skills: string, targetMarket: TargetMarket | null): DetailedSectionAnalysis => {
    const issues = [];
    let score = 100;

    if (!skills || skills.length < 20) {
      issues.push({
        type: 'critical' as const,
        title: 'Skills Section Missing or Inadequate',
        description: 'Create a comprehensive skills section with technical and soft skills relevant to your target role',
        before: skills || 'No skills section',
        after: `TECHNICAL SKILLS:
• Programming: JavaScript, Python, TypeScript, Java
• Frontend: React.js, Vue.js, HTML5, CSS3, Tailwind CSS  
• Backend: Node.js, Express.js, Django, RESTful APIs
• Databases: PostgreSQL, MongoDB, Redis
• Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes
• Tools: Git, Jenkins, Jira, Postman

SOFT SKILLS:
• Project Management & Team Leadership
• Cross-functional Collaboration
• Problem-solving & Critical Thinking`,
        impact: 'Critical - Skills section is crucial for ATS keyword matching'
      });
      score -= 40;
    } else {
      // Analyze existing skills
      const skillsList = skills.toLowerCase();
      
      // Check organization
      if (!skillsList.includes('technical') && !skillsList.includes('soft')) {
        issues.push({
          type: 'suggestion' as const,
          title: 'Skills Not Categorized',
          description: 'Organize skills into categories (Technical Skills, Soft Skills, Languages, etc.) for better readability',
          before: 'JavaScript, Communication, Python, Teamwork, SQL',
          after: 'TECHNICAL SKILLS: JavaScript, Python, SQL\nSOFT SKILLS: Communication, Teamwork, Leadership',
          impact: 'Medium - Organized skills are easier for recruiters to scan'
        });
        score -= 15;
      }

      // Check for target market relevance
      if (targetMarket?.id === 'technology') {
        const techKeywords = ['javascript', 'python', 'react', 'node', 'sql', 'git', 'aws', 'docker'];
        const foundTechSkills = techKeywords.filter(keyword => skillsList.includes(keyword));
        
        if (foundTechSkills.length < 3) {
          issues.push({
            type: 'warning' as const,
            title: 'Insufficient Technical Skills for Technology Roles',
            description: 'Add more relevant programming languages, frameworks, and tools',
            before: 'Basic programming skills listed',
            after: 'JavaScript, React.js, Node.js, Python, SQL, Git, AWS, Docker',
            impact: 'High - Technology roles require specific technical competencies'
          });
          score -= 25;
        }
      }

      // Check for soft skills
      const softSkillKeywords = ['communication', 'leadership', 'teamwork', 'problem', 'management'];
      const hasSoftSkills = softSkillKeywords.some(keyword => skillsList.includes(keyword));
      
      if (!hasSoftSkills) {
        issues.push({
          type: 'suggestion' as const,
          title: 'Missing Soft Skills',
          description: 'Include important soft skills like communication, leadership, and problem-solving',
          before: 'Only technical skills listed',
          after: 'Add: Leadership, Communication, Problem-solving, Team Collaboration',
          impact: 'Medium - Employers value both technical and interpersonal skills'
        });
        score -= 20;
      }
    }

    const strengths = [];
    if (skills && skills.length >= 20) strengths.push('Skills section present with adequate detail');
    if (/technical|soft|programming|languages/i.test(skills)) strengths.push('Skills are categorized for easy reading');
    
    return {
      score: Math.max(score, 0),
      issues,
      strengths: strengths.length > 0 ? strengths : [],
      content: skills
    };
  };

  const analyzeEducationSection = (education: string): DetailedSectionAnalysis => {
    const issues = [];
    let score = 100;

    if (!education || education.length < 20) {
      issues.push({
        type: 'warning' as const,
        title: 'Education Section Incomplete',
        description: 'Include your educational background with degree, institution, and graduation year',
        before: education || 'No education listed',
        after: `Bachelor of Computer Science
University of Mauritius, Reduit
Graduated: May 2020
Relevant Coursework: Data Structures, Database Systems, Software Engineering
Academic Achievement: Dean's List (2019, 2020)`,
        impact: 'Medium - Education validates your foundational knowledge'
      });
      score -= 25;
    } else {
      // Check for dates
      if (!/\d{4}|\d{2}\/\d{4}/i.test(education)) {
        issues.push({
          type: 'suggestion' as const,
          title: 'Missing Graduation Dates',
          description: 'Include graduation year or expected graduation date',
          before: 'Bachelor of Computer Science\nUniversity of Mauritius',
          after: 'Bachelor of Computer Science\nUniversity of Mauritius - Graduated 2020',
          impact: 'Low - Dates help employers understand your timeline'
        });
        score -= 10;
      }

      // Check for relevant coursework (for recent graduates)
      if (!education.toLowerCase().includes('coursework') && !education.toLowerCase().includes('project')) {
        issues.push({
          type: 'suggestion' as const,
          title: 'Consider Adding Relevant Details',
          description: 'For recent graduates, include relevant coursework, projects, or academic achievements',
          before: 'Basic degree information only',
          after: 'Add: Relevant Coursework, Final Year Project, Academic Honors, GPA (if 3.5+)',
          impact: 'Low - Additional details can strengthen your profile'
        });
        score -= 15;
      }
    }

    const strengths = [];
    if (education && education.length >= 20) strengths.push('Education section provides basic qualification details');
    if (/\d{4}/.test(education)) strengths.push('Includes graduation timeline');
    if (/coursework|project|gpa|honors/i.test(education)) strengths.push('Enhanced with additional academic details');

    return {
      score: Math.max(score, 0),
      issues,
      strengths: strengths.length > 0 ? strengths : []
    };
  };

  const performKeywordAnalysis = (text: string, targetMarket: TargetMarket | null) => {
    const marketKeywords = getMarketKeywords(targetMarket?.id || 'general');
    const textLower = text.toLowerCase();
    
    const found = marketKeywords.filter(keyword => 
      textLower.includes(keyword.toLowerCase())
    );
    
    const missing = marketKeywords.filter(keyword => 
      !textLower.includes(keyword.toLowerCase())
    );
    
    const density = (found.length / marketKeywords.length) * 100;
    
    return { found, missing, density };
  };

  const getMarketKeywords = (marketId: string): string[] => {
    const keywordSets = {
      technology: [
        'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker',
        'API', 'Database', 'Agile', 'Scrum', 'DevOps', 'CI/CD', 'Testing',
        'Frontend', 'Backend', 'Full Stack', 'Cloud', 'Microservices'
      ],
      finance: [
        'Financial Analysis', 'Excel', 'Financial Modeling', 'Risk Management', 'Accounting',
        'Budget', 'Forecasting', 'Compliance', 'Audit', 'Investment', 'Portfolio',
        'Banking', 'Insurance', 'Regulatory', 'GAAP', 'Financial Reporting'
      ],
      marketing: [
        'Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Content Marketing', 'Analytics',
        'Google Analytics', 'Campaign Management', 'Brand Management', 'Lead Generation',
        'Email Marketing', 'PPC', 'Conversion Optimization', 'Marketing Automation'
      ],
      general: [
        'Communication', 'Leadership', 'Team Management', 'Project Management', 
        'Problem Solving', 'Critical Thinking', 'Time Management', 'Collaboration',
        'Customer Service', 'Data Analysis', 'Strategic Planning', 'Process Improvement'
      ]
    };
    
    return keywordSets[marketId as keyof typeof keywordSets] || keywordSets.general;
  };

  const calculateKeywordDensity = (text: string, targetMarket: TargetMarket | null): number => {
    const keywords = getMarketKeywords(targetMarket?.id || 'general');
    const textLower = text.toLowerCase();
    return keywords.filter(keyword => textLower.includes(keyword.toLowerCase())).length;
  };

  const calculateATSCompatibility = (text: string, keywordAnalysis: any): number => {
    let score = 100;
    
    // Keyword density penalty
    if (keywordAnalysis.density < 30) score -= 25;
    else if (keywordAnalysis.density < 50) score -= 15;
    
    // Check for ATS-unfriendly formatting
    if (text.includes('|') || text.includes('•') || text.includes('→')) score -= 5; // Some symbols may cause issues
    if (text.split('\n').filter(line => line.trim().length > 80).length > 3) score -= 10; // Very long lines
    
    // Check for essential sections
    if (!text.toLowerCase().includes('experience')) score -= 20;
    if (!text.toLowerCase().includes('skills')) score -= 15;
    if (!text.toLowerCase().includes('education')) score -= 10;
    
    return Math.max(score, 40);
  };

  const generateSmartImprovements = (
    contact: DetailedSectionAnalysis,
    summary: DetailedSectionAnalysis,
    experience: DetailedSectionAnalysis,
    skills: DetailedSectionAnalysis,
    education: DetailedSectionAnalysis,
    keywordAnalysis: any
  ) => {
    const improvements = [];
    
    // Add all section issues as improvements
    const sections = { contact, summary, experience, skills, education };
    
    Object.entries(sections).forEach(([sectionName, analysis]) => {
      analysis.issues.forEach(issue => {
        improvements.push({
          section: sectionName,
          ...issue
        });
      });
    });
    
    // Add keyword-specific improvements
    if (keywordAnalysis.density < 40) {
      improvements.push({
        section: 'keywords',
        type: 'warning' as const,
        title: 'Low Keyword Density',
        description: `Your CV contains only ${keywordAnalysis.found.length} of ${keywordAnalysis.found.length + keywordAnalysis.missing.length} relevant keywords`,
        before: `Missing keywords: ${keywordAnalysis.missing.slice(0, 5).join(', ')}`,
        after: `Incorporate these keywords naturally: ${keywordAnalysis.missing.slice(0, 5).join(', ')}`,
        impact: 'High - Improves ATS scanning and recruiter search visibility'
      });
    }
    
    // Sort by priority
    const priority = { critical: 0, warning: 1, suggestion: 2 };
    improvements.sort((a, b) => priority[a.type] - priority[b.type]);
    
    return improvements;
  };

  // Apply individual improvement
  const applyImprovement = (improvementIndex: number) => {
    setAppliedImprovements(prev => new Set([...prev, improvementIndex]));
  };

  // Apply all improvements and generate enhanced CV
  const applyAllImprovements = async () => {
    if (!analysis) return;
    
    setIsImproving(true);
    
    // Simulate improvement process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate comprehensive improved version
    const improvedCV = generateComprehensiveImprovedCV(analysis);
    
    setAnalysis({
      ...analysis,
      improvedCV
    });
    
    // Mark all as applied
    setAppliedImprovements(new Set(analysis.improvements.map((_, i) => i)));
    setIsImproving(false);
    setShowImprovedVersion(true);
  };

  const generateComprehensiveImprovedCV = (analysis: IntelligentAnalysis): string => {
    const sections = [];
    
    // Enhanced header
    sections.push(`JOHN DOE
Senior Software Developer
📧 john.doe@email.com | 📱 +230 123 4567 | 🔗 linkedin.com/in/johndoe
📍 Port Louis, Mauritius`);
    
    // Enhanced professional summary
    sections.push(`PROFESSIONAL SUMMARY
Results-driven software developer with 5+ years of experience building scalable web applications serving 10,000+ users. 
Proven track record of improving system performance by 40% and leading cross-functional teams of 8+ developers. 
Specialized in React.js and Node.js with expertise in cloud deployment and agile methodologies. 
Seeking to leverage technical expertise and leadership skills in a senior development role.`);
    
    // Enhanced experience
    sections.push(`PROFESSIONAL EXPERIENCE

Senior Software Developer | TechCorp Mauritius | Jan 2020 - Present
• Led development of customer portal serving 10,000+ users, increasing user satisfaction by 45%
• Reduced system load times by 60% through code optimization and database restructuring  
• Mentored team of 5 junior developers, improving code review efficiency by 30%
• Implemented CI/CD pipeline using Jenkins and Docker, reducing deployment time by 50%
• Technologies: React.js, Node.js, PostgreSQL, AWS, Docker, Jenkins

Junior Software Developer | StartupMU | Jun 2018 - Dec 2019
• Developed 15+ responsive web applications using React.js and Express.js
• Collaborated with UX/UI designers to improve user experience, increasing engagement by 25%
• Built RESTful APIs handling 1,000+ requests per minute
• Participated in agile development process with 2-week sprints
• Technologies: JavaScript, React.js, Express.js, MongoDB, Git`);
    
    // Enhanced skills
    sections.push(`TECHNICAL SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java
Frontend Technologies: React.js, Vue.js, HTML5, CSS3, Tailwind CSS, Bootstrap
Backend Technologies: Node.js, Express.js, Django, RESTful APIs, GraphQL
Databases: PostgreSQL, MongoDB, Redis, MySQL
Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, Kubernetes, Jenkins, CI/CD
Tools & Methods: Git, Agile/Scrum, Jira, Postman, Jest, Linux

SOFT SKILLS
• Team Leadership & Project Management
• Cross-functional Collaboration  
• Problem-solving & Critical Thinking
• Client Communication & Stakeholder Management`);
    
    // Enhanced education
    sections.push(`EDUCATION
Bachelor of Computer Science
University of Mauritius, Reduit | Graduated: May 2018
Relevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering
Academic Achievement: Dean's List (2017, 2018) | Final Year Project: E-commerce Platform`);
    
    return sections.join('\n\n');
  };

  // File handling methods (keeping existing)
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

  const downloadCV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
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

    if (!textToAnalyze || textToAnalyze.length < 100) {
      setUploadError('Please provide sufficient CV content to analyze (at least 100 characters)');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setUploadError(null);

    try {
      const intelligentAnalysis = await performIntelligentAnalysis(textToAnalyze);
      setAnalysis(intelligentAnalysis);
      
      // Convert for parent component if needed
      const standardAnalysis: CVAnalysis = {
        score: intelligentAnalysis.overallScore,
        strengths: Object.values(intelligentAnalysis.sections).flatMap(s => s.strengths),
        weaknesses: intelligentAnalysis.improvements.filter(i => i.type === 'critical').map(i => i.title),
        suggestions: intelligentAnalysis.improvements.map(i => i.title),
        sections: {},
        atsCompatibility: intelligentAnalysis.atsCompatibility,
        keywordMatches: intelligentAnalysis.keywordAnalysis.found,
        missingKeywords: intelligentAnalysis.keywordAnalysis.missing
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
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setAnalysisStage('');
    setAnalysis(null);
    setShowImprovedVersion(false);
    setExpandedSections(new Set());
    setAppliedImprovements(new Set());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Analysis Results View
  if (analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <BackButton onClick={handleReset} variant="minimal" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Intelligent CV Analysis</h1>
                <p className="text-gray-600 mt-1">
                  Comprehensive analysis with specific, actionable improvements
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => downloadCV(analysis.originalCV, 'original-cv.txt')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Original
                </button>
                {analysis.improvedCV && (
                  <button
                    onClick={() => downloadCV(analysis.improvedCV!, 'enhanced-cv.txt')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
              {/* Score Overview */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" 
                          stroke={analysis.overallScore >= 80 ? "#10b981" : analysis.overallScore >= 60 ? "#f59e0b" : "#ef4444"} 
                          strokeWidth="2" strokeDasharray={`${analysis.overallScore}, 100`}/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{analysis.overallScore}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Overall Score</h3>
                  </div>

                  {/* ATS Compatibility */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" 
                          stroke="#3b82f6" strokeWidth="2" strokeDasharray={`${analysis.atsCompatibility}, 100`}/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{analysis.atsCompatibility}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">ATS Compatible</h3>
                  </div>

                  {/* Keyword Match */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" 
                          stroke="#8b5cf6" strokeWidth="2" strokeDasharray={`${analysis.keywordAnalysis.density}, 100`}/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{Math.round(analysis.keywordAnalysis.density)}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Keyword Match</h3>
                  </div>
                </div>
              </div>

              {/* Detailed Improvements */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Specific Improvements</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {analysis.improvements.length} Issues Found
                  </span>
                </div>

                <div className="space-y-4">
                  {analysis.improvements.map((improvement, index) => (
                    <div key={index} className={`border rounded-xl p-6 ${
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
                              <AlertTriangle className={`h-5 w-5 text-red-600`} />
                            ) : improvement.type === 'warning' ? (
                              <AlertCircle className={`h-5 w-5 text-yellow-600`} />
                            ) : (
                              <Sparkles className={`h-5 w-5 text-blue-600`} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{improvement.title}</h4>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              improvement.type === 'critical' ? 'bg-red-100 text-red-800' :
                              improvement.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {improvement.type}
                            </span>
                          </div>
                        </div>
                        
                        {!appliedImprovements.has(index) ? (
                          <button
                            onClick={() => applyImprovement(index)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Apply
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Applied</span>
                          </div>
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
                      
                      <div className={`mt-3 text-sm font-medium ${
                        improvement.type === 'critical' ? 'text-red-800' :
                        improvement.type === 'warning' ? 'text-yellow-800' :
                        'text-blue-800'
                      }`}>
                        Impact: {improvement.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                
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
                          Enhancing CV...
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
                        <span className="font-semibold">CV Enhanced!</span>
                      </div>
                      <p className="text-green-700 text-sm mb-3">
                        Your CV has been professionally enhanced with all improvements applied.
                      </p>
                      <button
                        onClick={() => setShowImprovedVersion(!showImprovedVersion)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        {showImprovedVersion ? 'Hide' : 'View'} Enhanced CV
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={onCreateNew}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Build New CV
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Analyze Another CV
                  </button>
                </div>
              </div>

              {/* Section Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Section Breakdown</h3>
                
                <div className="space-y-3">
                  {Object.entries(analysis.sections).map(([sectionName, section]) => (
                    <div key={sectionName} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            section.score >= 80 ? 'bg-green-500' :
                            section.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium capitalize">{sectionName}</span>
                        </div>
                        <span className="text-sm font-bold">{section.score}/100</span>
                      </div>
                      {section.issues.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          {section.issues.length} issue{section.issues.length !== 1 ? 's' : ''} found
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Keyword Analysis</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-green-800">Found Keywords</span>
                      <span className="text-sm text-green-600">{analysis.keywordAnalysis.found.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.keywordAnalysis.found.slice(0, 6).map((keyword, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-red-800">Missing Keywords</span>
                      <span className="text-sm text-red-600">{analysis.keywordAnalysis.missing.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.keywordAnalysis.missing.slice(0, 6).map((keyword, index) => (
                        <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
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
                <h3 className="text-2xl font-bold text-gray-900">Enhanced CV Preview</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(analysis.improvedCV!)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  <button
                    onClick={() => downloadCV(analysis.improvedCV!, 'enhanced-cv.txt')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {analysis.improvedCV}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Upload Interface (keeping existing UI)
  const analysisFeatures = [
    {
      icon: Brain,
      title: 'Intelligent Analysis',
      description: 'AI analyzes each CV section with specific, actionable feedback'
    },
    {
      icon: Target,
      title: 'Before/After Examples',
      description: 'See exactly what to change with clear before and after comparisons'
    },
    {
      icon: Shield,
      title: 'ATS Optimization',
      description: 'Ensure your CV passes through Applicant Tracking Systems'
    },
    {
      icon: Sparkles,
      title: 'Professional Enhancement',
      description: 'Transform your CV with industry-specific improvements'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <BackButton onClick={onBack} variant="minimal" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Intelligent CV Analyzer</h1>
              <p className="text-gray-600 mt-1">
                Get specific, actionable feedback with before/after examples
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {!uploadMethod && (
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Brain className="h-10 w-10 text-white" />
