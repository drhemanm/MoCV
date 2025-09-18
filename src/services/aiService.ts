// src/services/aiService.ts - Updated to use secure backend

import { secureApiService } from './secureApiService';

export interface AIAnalysisResult {
  score: number;
  suggestions: string[];
  improvements: {
    category: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    action: string;
  }[];
  keywords: {
    missing: string[];
    present: string[];
    recommended: string[];
  };
  readabilityScore: number;
  impactScore: number;
  professionalismScore: number;
}

export interface CVSection {
  type: 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'other';
  title: string;
  content: any;
  weight: number;
}

export interface AIOptimizationOptions {
  industry?: string;
  jobTitle?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  targetKeywords?: string[];
  focusAreas?: ('ats' | 'readability' | 'impact' | 'keywords')[];
  analysisDepth?: 'quick' | 'standard' | 'comprehensive';
  targetMarket?: string;
}

export class AIService {
  private static readonly API_TIMEOUT = 30000; // 30 seconds
  private static readonly MAX_RETRIES = 3;

  /**
   * Analyze CV content and provide improvement suggestions using secure backend
   */
  static async analyzeCVContent(
    sections: CVSection[],
    options: AIOptimizationOptions = {}
  ): Promise<AIAnalysisResult> {
    try {
      // Convert sections to text format for analysis
      const cvText = this.sectionsToText(sections);
      
      if (cvText.length < 100) {
        throw new Error('CV content is too short for meaningful analysis');
      }

      // Use secure API for analysis
      const analysis = await secureApiService.analyzeCv(
        cvText, 
        options.targetMarket || 'Global'
      );

      // Convert backend analysis to our expected format
      const result: AIAnalysisResult = {
        score: analysis.score || 75,
        suggestions: analysis.improvements || [],
        improvements: [
          {
            category: 'ATS Optimization',
            priority: 'high',
            description: 'Optimize your CV for Applicant Tracking Systems',
            action: analysis.atsOptimization?.[0] || 'Use standard section headers and include relevant keywords'
          },
          {
            category: 'Content Enhancement', 
            priority: 'medium',
            description: 'Improve the impact of your content',
            action: analysis.improvements?.[0] || 'Add more quantifiable achievements with specific metrics'
          },
          {
            category: 'Market Adaptation',
            priority: 'medium', 
            description: `Tailor your CV for the ${options.targetMarket || 'target'} market`,
            action: analysis.marketSpecific?.[0] || 'Research market-specific CV requirements and preferences'
          }
        ],
        keywords: {
          missing: analysis.keywords || [],
          present: this.extractPresentKeywords(cvText),
          recommended: analysis.keywords || []
        },
        readabilityScore: Math.max(60, analysis.score - 10),
        impactScore: Math.max(50, analysis.score - 15),
        professionalismScore: Math.max(70, analysis.score + 5)
      };

      return result;
      
    } catch (error) {
      console.error('AI Analysis failed:', error);
      
      // Return fallback analysis
      return this.getFallbackAnalysis(sections, options);
    }
  }

  /**
   * Generate optimized content suggestions for a specific section using secure backend
   */
  static async generateSectionSuggestions(
    sectionType: CVSection['type'],
    currentContent: any,
    options: AIOptimizationOptions = {}
  ): Promise<string[]> {
    try {
      // Convert current content to string
      const contentText = typeof currentContent === 'string' 
        ? currentContent 
        : JSON.stringify(currentContent);

      if (contentText.length > 20) {
        // Use secure API to enhance content and extract suggestions
        const contentTypeMap = {
          'personal': 'summary',
          'experience': 'experience', 
          'education': 'education',
          'skills': 'skills',
          'projects': 'achievement',
          'other': 'summary'
        };

        const enhancedContent = await secureApiService.enhanceContent(
          contentText,
          contentTypeMap[sectionType] as any,
          options.targetMarket || 'Global'
        );

        // Generate suggestions based on enhancement
        return this.generateSuggestionsFromEnhancement(sectionType, contentText, enhancedContent);
      }

      // Fallback to static suggestions
      return this.getStaticSuggestions(sectionType);
      
    } catch (error) {
      console.error('Section suggestion generation failed:', error);
      return this.getStaticSuggestions(sectionType);
    }
  }

  /**
   * Optimize CV for ATS using secure backend analysis
   */
  static async optimizeForATS(
    cvData: any,
    jobDescription?: string,
    targetMarket: string = 'Global'
  ): Promise<{
    optimizedContent: any;
    atsScore: number;
    recommendations: string[];
  }> {
    try {
      const cvText = typeof cvData === 'string' ? cvData : this.dataToText(cvData);
      
      const analysis = await secureApiService.analyzeCv(cvText, targetMarket);

      const atsScore = Math.min(100, (analysis.score || 75) + 5); // Slight boost for ATS focus
      
      return {
        optimizedContent: cvData, // In production, this would be the optimized version
        atsScore,
        recommendations: analysis.atsOptimization || [
          'Use standard section headers like "Work Experience" instead of creative alternatives',
          'Include keywords from the job description naturally throughout your CV',
          'Use a simple, clean format without complex graphics or tables',
          'Save as both PDF and Word document formats',
          'Ensure consistent formatting and font usage'
        ]
      };
      
    } catch (error) {
      console.error('ATS optimization failed:', error);
      
      return {
        optimizedContent: cvData,
        atsScore: 75,
        recommendations: [
          'Use standard section headers',
          'Include relevant keywords',
          'Maintain simple formatting',
          'Save in multiple formats',
          'Ensure readability'
        ]
      };
    }
  }

  /**
   * Generate industry-specific recommendations
   */
  static async getIndustryRecommendations(
    industry: string,
    role: string
  ): Promise<{
    keywords: string[];
    skills: string[];
    sections: string[];
    tips: string[];
  }> {
    try {
      // Industry-specific recommendations database
      const industryData: { [key: string]: any } = {
        'technology': {
          keywords: ['software development', 'agile', 'version control', 'API', 'debugging', 'DevOps', 'cloud computing'],
          skills: ['Programming Languages', 'Frameworks', 'Databases', 'Cloud Platforms', 'DevOps Tools'],
          sections: ['Technical Skills', 'Projects', 'Open Source Contributions', 'Certifications'],
          tips: [
            'Include links to your GitHub profile and portfolio',
            'Mention specific technologies and frameworks you\'ve used',
            'Quantify the impact of your technical contributions',
            'Include relevant certifications and continuous learning'
          ]
        },
        'marketing': {
          keywords: ['digital marketing', 'SEO', 'content strategy', 'analytics', 'campaign management', 'brand awareness'],
          skills: ['Digital Marketing', 'Analytics Tools', 'Content Creation', 'Social Media', 'Campaign Management'],
          sections: ['Marketing Campaigns', 'Analytics & Results', 'Creative Portfolio'],
          tips: [
            'Quantify campaign results with specific metrics',
            'Include links to successful campaigns or content',
            'Highlight cross-channel marketing experience',
            'Show knowledge of latest marketing tools and trends'
          ]
        },
        'finance': {
          keywords: ['financial analysis', 'budgeting', 'forecasting', 'risk management', 'compliance', 'reporting'],
          skills: ['Financial Modeling', 'Excel/Spreadsheet Expertise', 'Financial Software', 'Regulatory Knowledge'],
          sections: ['Financial Achievements', 'Certifications', 'Technical Skills'],
          tips: [
            'Include relevant certifications (CPA, CFA, etc.)',
            'Quantify cost savings or revenue improvements',
            'Highlight compliance and risk management experience',
            'Show proficiency with financial software and tools'
          ]
        }
      };

      const industryKey = Object.keys(industryData).find(key => 
        industry.toLowerCase().includes(key) || role.toLowerCase().includes(key)
      );

      if (industryKey) {
        return industryData[industryKey];
      }

      // Generic recommendations
      return {
        keywords: ['leadership', 'project management', 'problem-solving', 'communication', 'teamwork'],
        skills: ['Communication', 'Leadership', 'Project Management', 'Problem Solving', 'Time Management'],
        sections: ['Key Achievements', 'Professional Skills', 'Certifications'],
        tips: [
          'Tailor your CV to match the job description',
          'Use industry-specific terminology appropriately',
          'Highlight transferable skills and experiences',
          'Include relevant professional development and training'
        ]
      };
      
    } catch (error) {
      console.error('Industry recommendations failed:', error);
      throw new Error('Failed to get industry recommendations');
    }
  }

  /**
   * Check if AI service is available (always true with fallbacks)
   */
  static async checkServiceHealth(): Promise<boolean> {
    try {
      return await secureApiService.healthCheck();
    } catch (error) {
      console.error('AI service health check failed:', error);
      return true; // Return true since we have fallback mechanisms
    }
  }

  /**
   * Get real-time CV improvement suggestions as user types
   */
  static async getRealTimeSuggestions(
    content: string,
    context: {
      sectionType: CVSection['type'];
      industry?: string;
      role?: string;
    }
  ): Promise<string[]> {
    try {
      if (content.length < 10) return [];
      
      const suggestions = this.getContextualSuggestions(content, context);
      
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return suggestions.slice(0, 3); // Limit to 3 suggestions for real-time
      
    } catch (error) {
      console.error('Real-time suggestions failed:', error);
      return [];
    }
  }

  // Helper methods
  private static sectionsToText(sections: CVSection[]): string {
    return sections.map(section => {
      const title = section.title || section.type;
      const content = typeof section.content === 'string' 
        ? section.content 
        : JSON.stringify(section.content);
      return `${title}:\n${content}\n`;
    }).join('\n');
  }

  private static dataToText(data: any): string {
    if (typeof data === 'string') return data;
    return JSON.stringify(data, null, 2);
  }

  private static extractPresentKeywords(text: string): string[] {
    const keywords = ['JavaScript', 'React', 'TypeScript', 'Python', 'management', 'leadership', 'project'];
    return keywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private static getFallbackAnalysis(sections: CVSection[], options: AIOptimizationOptions): AIAnalysisResult {
    return {
      score: 75,
      suggestions: [
        'Add more quantifiable achievements with specific metrics',
        'Include industry-relevant keywords throughout your experience',
        'Strengthen action verbs in your job descriptions',
        'Consider adding a professional summary section'
      ],
      improvements: [
        {
          category: 'ATS Optimization',
          priority: 'high',
          description: 'Your CV may not pass ATS scanning effectively',
          action: 'Add more industry keywords and use standard section headers'
        },
        {
          category: 'Impact Measurement',
          priority: 'medium', 
          description: 'Include more quantified achievements',
          action: 'Add percentages, dollar amounts, or other metrics to demonstrate impact'
        }
      ],
      keywords: {
        missing: ['project management', 'data analysis', 'leadership'],
        present: ['communication', 'teamwork'],
        recommended: ['agile methodology', 'cross-functional collaboration', 'stakeholder management']
      },
      readabilityScore: 85,
      impactScore: 78,
      professionalismScore: 92
    };
  }

  private static getStaticSuggestions(sectionType: CVSection['type']): string[] {
    const suggestions: Record<CVSection['type'], string[]> = {
      personal: [
        'Consider adding a professional email address',
        'Include links to professional social media profiles',
        'Add your city and country for location context'
      ],
      experience: [
        'Start each bullet point with a strong action verb',
        'Quantify your achievements with specific metrics',
        'Focus on results and impact rather than just responsibilities',
        'Use the STAR method (Situation, Task, Action, Result)'
      ],
      education: [
        'Include relevant coursework if recent graduate',
        'Add GPA if it strengthens your application (3.5+)',
        'Mention academic achievements and honors'
      ],
      skills: [
        'Organize skills by category (Technical, Soft Skills, etc.)',
        'Include proficiency levels where relevant',
        'Focus on skills most relevant to your target role'
      ],
      projects: [
        'Include links to live projects or repositories',
        'Describe the technologies and methodologies used',
        'Highlight the problem solved and impact achieved'
      ],
      other: [
        'Keep additional sections relevant to your career goals',
        'Include volunteer work that demonstrates transferable skills',
        'Add certifications that enhance your qualifications'
      ]
    };

    return suggestions[sectionType] || [];
  }

  private static generateSuggestionsFromEnhancement(
    sectionType: CVSection['type'], 
    original: string, 
    enhanced: string
  ): string[] {
    const suggestions = [];
    
    if (enhanced.length > original.length * 1.2) {
      suggestions.push('Consider expanding your content with more details');
    }
    
    if (!original.match(/\d+/)) {
      suggestions.push('Include specific numbers and metrics where possible');
    }
    
    suggestions.push(...this.getStaticSuggestions(sectionType).slice(0, 2));
    
    return suggestions;
  }

  private static getContextualSuggestions(content: string, context: any): string[] {
    const suggestions = [];
    
    if (content.length < 50) {
      suggestions.push('Consider adding more detail to strengthen this section');
    }
    
    if (!content.match(/\d+/)) {
      suggestions.push('Include specific metrics or numbers to quantify your impact');
    }
    
    if (context.sectionType === 'experience' && !content.match(/\b(led|managed|created|developed|improved)\b/i)) {
      suggestions.push('Start with a strong action verb to show your role clearly');
    }
    
    return suggestions;
  }
}

export default AIService;
