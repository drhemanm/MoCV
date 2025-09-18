// src/services/secureApiService.ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  analysis?: T;
  error?: string;
  fallback?: boolean;
  metadata?: {
    timestamp: string;
    targetMarket?: string;
    error?: string;
  };
}

interface CVAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  atsOptimization: string[];
  keywords: string[];
  marketSpecific: string[];
  summary: string;
}

interface ContentEnhancement {
  originalContent: string;
  enhancedContent: string;
  type: string;
  targetMarket: string;
  improvementMade: boolean;
}

class SecureApiService {
  private baseUrl: string;
  private requestCount: number = 0;
  private lastRequestTime: number = 0;

  constructor() {
    // Use relative URLs for same-origin requests
    this.baseUrl = '/api';
  }

  // Client-side rate limiting
  private checkRateLimit(): boolean {
    const now = Date.now();
    const timeWindow = 60000; // 1 minute
    
    if (now - this.lastRequestTime > timeWindow) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }
    
    this.requestCount++;
    return this.requestCount <= 20; // Max 20 requests per minute
  }

  // Input sanitization
  private sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim()
      .substring(0, 15000);
  }

  // Generic API call method with error handling
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Client-side rate limiting
      if (!this.checkRateLimit()) {
        throw new Error('Please wait before making more requests.');
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // CV Analysis
  async analyzeCv(cvText: string, targetMarket: string = 'Global'): Promise<CVAnalysis> {
    try {
      const sanitizedText = this.sanitizeInput(cvText);
      
      if (sanitizedText.length < 50) {
        throw new Error('CV text is too short. Please provide more details.');
      }

      const response = await this.makeRequest<CVAnalysis>('/ai/analyze-cv', {
        method: 'POST',
        body: JSON.stringify({
          cvText: sanitizedText,
          targetMarket
        })
      });

      if (response.success && response.analysis) {
        return response.analysis;
      } else {
        throw new Error(response.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('CV Analysis error:', error);
      
      // Fallback analysis
      return this.getFallbackAnalysis(targetMarket);
    }
  }

  // Content Enhancement
  async enhanceContent(
    content: string, 
    type: 'summary' | 'experience' | 'skills' | 'education' | 'achievement' = 'summary',
    targetMarket: string = 'Global'
  ): Promise<string> {
    try {
      const sanitizedContent = this.sanitizeInput(content);
      
      if (sanitizedContent.length < 10) {
        return content; // Return original if too short
      }

      const response = await this.makeRequest<ContentEnhancement>('/ai/enhance-content', {
        method: 'POST',
        body: JSON.stringify({
          content: sanitizedContent,
          type,
          targetMarket
        })
      });

      if (response.success && response.data) {
        return response.data.enhancedContent;
      } else {
        console.warn('Content enhancement failed, returning original:', response.error);
        return content;
      }
    } catch (error) {
      console.error('Content enhancement error:', error);
      return content; // Return original content on error
    }
  }

  // Generate Interview Questions
  async generateInterviewQuestions(cvText: string, jobRole: string = ''): Promise<string[]> {
    // For now, return fallback questions
    // We can add a dedicated endpoint later if needed
    return this.getFallbackQuestions(jobRole);
  }

  // Chat with Assistant (placeholder)
  async chatWithAssistant(message: string, context?: string): Promise<string> {
    try {
      // For now, return a helpful response
      // We can add a dedicated chat endpoint later
      return `I understand you're asking about: "${message}". Based on your CV context, I'd recommend focusing on highlighting your key achievements and ensuring your skills match the job requirements. Would you like me to help analyze specific sections of your CV?`;
    } catch (error) {
      console.error('Chat error:', error);
      return 'I apologize, but I\'m having trouble processing your request right now. Please try again later.';
    }
  }

  // Fallback analysis when API fails
  private getFallbackAnalysis(targetMarket: string): CVAnalysis {
    return {
      score: 75,
      strengths: [
        'CV has a clear structure and professional format',
        'Contact information is clearly visible',
        'Work experience is documented with job titles and companies',
        'Education background is included'
      ],
      improvements: [
        'Add more quantifiable achievements with specific numbers and percentages',
        'Include relevant keywords from your target job descriptions',
        'Consider adding a compelling professional summary at the top',
        'Ensure consistent formatting and spacing throughout',
        'Add relevant technical skills if applicable to your field'
      ],
      atsOptimization: [
        'Use standard section headings like "Experience", "Education", "Skills"',
        'Include relevant industry keywords naturally in your descriptions',
        'Save your CV in both PDF and Word formats for different ATS systems',
        'Avoid complex formatting, tables, or graphics that ATS might not read',
        'Use bullet points for easy scanning'
      ],
      keywords: [
        'leadership', 'project management', 'results-driven', 
        'team collaboration', 'problem-solving', 'analytical thinking',
        'communication skills', 'adaptability', 'time management'
      ],
      marketSpecific: [
        `Research common CV formats and expectations in the ${targetMarket} market`,
        `Consider cultural preferences for CV length and content in ${targetMarket}`,
        'Include relevant certifications or qualifications valued in your target market',
        'Adapt your language and terminology to match local business customs'
      ],
      summary: 'Your CV shows good professional structure and includes essential information. Focus on adding quantifiable achievements, optimizing for ATS systems, and tailoring content for your target market to significantly improve your chances.'
    };
  }

  // Fallback interview questions
  private getFallbackQuestions(jobRole: string): string[] {
    const baseQuestions = [
      'Tell me about your most significant professional achievement.',
      'How do you handle challenging situations or tight deadlines at work?',
      'What motivates you in your career, and what are your long-term goals?',
      'Describe a time when you had to learn something new quickly for work.',
      'How do you stay updated with trends and developments in your industry?',
      'Give an example of a time when you worked effectively as part of a team.',
      'Describe a situation where you had to solve a complex problem.',
      'How do you prioritize tasks when managing multiple projects?'
    ];

    const roleSpecificQuestions: { [key: string]: string[] } = {
      'software': [
        'Walk me through your development process for a recent project.',
        'How do you ensure code quality and handle technical debt?',
        'Describe your experience with version control and team collaboration.'
      ],
      'management': [
        'How do you motivate and develop your team members?',
        'Describe a difficult management decision you had to make.',
        'How do you handle conflicts within your team?'
      ],
      'sales': [
        'Describe your approach to building relationships with new clients.',
        'How do you handle rejection and maintain motivation?',
        'Walk me through your sales process from lead to close.'
      ],
      'marketing': [
        'How do you measure the success of your marketing campaigns?',
        'Describe a creative marketing solution you developed.',
        'How do you stay current with digital marketing trends?'
      ]
    };

    // Add role-specific questions if job role matches
    const roleKey = Object.keys(roleSpecificQuestions).find(key => 
      jobRole.toLowerCase().includes(key)
    );

    if (roleKey) {
      return [...baseQuestions.slice(0, 5), ...roleSpecificQuestions[roleKey]];
    }

    return baseQuestions;
  }

  // Health check for API
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch('/api/health');
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const secureApiService = new SecureApiService();
export default secureApiService;
