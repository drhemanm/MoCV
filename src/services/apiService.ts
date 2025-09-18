// src/services/apiService.ts
import { config } from '../config/environment';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseUrl: string;
  private requestCount: number = 0;
  private lastRequestTime: number = 0;

  constructor() {
    this.baseUrl = config.app.apiBaseUrl;
  }

  // Rate limiting check
  private checkRateLimit(): boolean {
    const now = Date.now();
    const timeWindow = 60000; // 1 minute
    
    if (now - this.lastRequestTime > timeWindow) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }
    
    this.requestCount++;
    return this.requestCount <= 30; // Max 30 requests per minute
  }

  // Input sanitization
  private sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim()
      .substring(0, 10000);
  }

  // Generic API call method
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Rate limiting
      if (!this.checkRateLimit()) {
        throw new Error('Rate limit exceeded. Please wait before making more requests.');
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
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
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
  async analyzeCv(cvText: string, targetMarket: string): Promise<ApiResponse<any>> {
    const sanitizedText = this.sanitizeInput(cvText);
    
    return this.makeRequest('/ai/analyze-cv', {
      method: 'POST',
      body: JSON.stringify({
        cvText: sanitizedText,
        targetMarket
      })
    });
  }

  // Content Enhancement
  async enhanceContent(content: string, type: string): Promise<ApiResponse<any>> {
    const sanitizedContent = this.sanitizeInput(content);
    
    return this.makeRequest('/ai/enhance-content', {
      method: 'POST',
      body: JSON.stringify({
        content: sanitizedContent,
        type
      })
    });
  }

  // Fallback service for when API is unavailable
  getFallbackAnalysis(cvText: string): any {
    return {
      score: 75,
      strengths: [
        'Professional format and structure',
        'Clear contact information',
        'Relevant work experience'
      ],
      improvements: [
        'Add more quantifiable achievements',
        'Include relevant keywords for ATS optimization',
        'Consider adding a professional summary'
      ],
      suggestions: {
        summary: 'Add a compelling professional summary highlighting your key strengths',
        keywords: ['leadership', 'project management', 'results-driven'],
        formatting: 'Use consistent bullet points and spacing'
      }
    };
  }
}

// Updated OpenAI Service to use backend proxy
export class SecureOpenAIService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  async analyzeCV(cvText: string, targetMarket: string = 'Global'): Promise<any> {
    try {
      const response = await this.apiService.analyzeCv(cvText, targetMarket);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        // Fallback to basic analysis
        console.warn('API analysis failed, using fallback:', response.error);
        return this.apiService.getFallbackAnalysis(cvText);
      }
    } catch (error) {
      console.error('CV Analysis error:', error);
      return this.apiService.getFallbackAnalysis(cvText);
    }
  }

  async enhanceText(text: string, type: 'summary' | 'experience' | 'skills' | 'education' = 'summary'): Promise<string> {
    try {
      const response = await this.apiService.enhanceContent(text, type);
      
      if (response.success && response.data) {
        return response.data.enhancedContent;
      } else {
        console.warn('Text enhancement failed, returning original:', response.error);
        return text;
      }
    } catch (error) {
      console.error('Text enhancement error:', error);
      return text;
    }
  }

  async generateInterviewQuestions(cvText: string, jobRole: string): Promise<string[]> {
    // Fallback questions when API is unavailable
    const fallbackQuestions = [
      'Tell me about your most significant professional achievement.',
      'How do you handle challenging situations at work?',
      'What motivates you in your career?',
      'Describe a time when you had to learn something new quickly.',
      'How do you stay updated with industry trends?'
    ];

    try {
      const response = await this.apiService.makeRequest('/ai/generate-questions', {
        method: 'POST',
        body: JSON.stringify({
          cvText: this.apiService['sanitizeInput'](cvText),
          jobRole: this.apiService['sanitizeInput'](jobRole)
        })
      });

      if (response.success && response.data) {
        return response.data.questions;
      } else {
        return fallbackQuestions;
      }
    } catch (error) {
      console.error('Interview questions generation error:', error);
      return fallbackQuestions;
    }
  }
}

export const secureOpenAIService = new SecureOpenAIService();
