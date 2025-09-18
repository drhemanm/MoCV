// src/services/openaiService.ts - Secure version using backend APIs
import { secureApiService } from './secureApiService';

export const getServiceStatus = (): { available: boolean; error?: string } => {
  // Always return available since we have fallback mechanisms
  return { available: true };
};

export const enhanceText = async (text: string, context?: string): Promise<string> => {
  try {
    if (!text || text.trim().length < 10) {
      throw new Error('Text is too short to enhance');
    }

    // Map context to our API types
    let contentType: 'summary' | 'experience' | 'skills' | 'education' | 'achievement' = 'summary';
    
    if (context) {
      const contextLower = context.toLowerCase();
      if (contextLower.includes('experience') || contextLower.includes('work')) {
        contentType = 'experience';
      } else if (contextLower.includes('skill')) {
        contentType = 'skills';
      } else if (contextLower.includes('education') || contextLower.includes('school')) {
        contentType = 'education';
      } else if (contextLower.includes('achievement') || contextLower.includes('accomplishment')) {
        contentType = 'achievement';
      }
    }

    const enhancedText = await secureApiService.enhanceContent(text, contentType);
    return enhancedText;
  } catch (error) {
    console.error('Text enhancement error:', error);
    
    // Fallback enhancement - basic improvements
    return text
      .replace(/\bi\b/gi, 'I')
      .replace(/\b(led|managed|created|developed|improved|achieved)\b/gi, (match) => 
        match.charAt(0).toUpperCase() + match.slice(1).toLowerCase())
      .replace(/\s+/g, ' ')
      .trim();
  }
};

export const getSuggestions = async (field: string, currentValue: string): Promise<string[]> => {
  try {
    if (!currentValue || currentValue.trim().length < 5) {
      return getFieldSpecificSuggestions(field);
    }

    // For now, return field-specific suggestions
    // We can enhance this with AI later if needed
    return getFieldSpecificSuggestions(field, currentValue);
  } catch (error) {
    console.error('Suggestions error:', error);
    return getFieldSpecificSuggestions(field);
  }
};

export const chatWithAssistant = async (
  message: string, 
  conversationHistory?: Array<{role: string; content: string}>
): Promise<string> => {
  try {
    if (!message || message.trim().length < 3) {
      throw new Error('Message is too short');
    }

    // Use our secure API service for chat
    const context = conversationHistory ? 
      conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n') : 
      '';
    
    const response = await secureApiService.chatWithAssistant(message, context);
    return response;
  } catch (error) {
    console.error('Chat assistant error:', error);
    
    // Fallback responses based on message content
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('cv') || messageLower.includes('resume')) {
      return "I'd be happy to help with your CV! I can assist with improving content, formatting suggestions, and ensuring your CV is ATS-friendly. What specific aspect would you like help with?";
    } else if (messageLower.includes('job') || messageLower.includes('career')) {
      return "For career guidance, I recommend focusing on highlighting your key achievements, tailoring your CV to specific job requirements, and ensuring your skills section matches what employers are looking for. What role are you targeting?";
    } else if (messageLower.includes('skill')) {
      return "When listing skills, organize them by category (technical, soft skills, etc.) and focus on those most relevant to your target role. Consider adding proficiency levels where appropriate.";
    } else {
      return "I'm here to help with your CV and career questions. Feel free to ask about content improvement, formatting, ATS optimization, or any other CV-related topics!";
    }
  }
};

// Helper function for field-specific suggestions
const getFieldSpecificSuggestions = (field: string, currentValue?: string): string[] => {
  const fieldLower = field.toLowerCase();
  
  const suggestions: { [key: string]: string[] } = {
    summary: [
      'Start with your years of experience and key expertise',
      'Include 2-3 major achievements or skills',
      'Mention your career goals or target role',
      'Keep it concise - 3-4 lines maximum',
      'Use active voice and strong action words'
    ],
    experience: [
      'Begin each bullet with a strong action verb',
      'Include specific metrics and quantifiable results',
      'Focus on achievements rather than just responsibilities',
      'Use the STAR method (Situation, Task, Action, Result)',
      'Tailor content to match your target job requirements'
    ],
    education: [
      'List your highest degree first',
      'Include relevant coursework if you\'re a recent graduate',
      'Mention academic honors or high GPA (3.5+)',
      'Add relevant projects or thesis topics',
      'Include professional certifications in this section'
    ],
    skills: [
      'Organize skills into categories (Technical, Soft Skills, etc.)',
      'List skills most relevant to your target job first',
      'Include proficiency levels where helpful',
      'Mix technical and soft skills appropriately',
      'Ensure skills match those mentioned in job postings'
    ],
    contact: [
      'Use a professional email address',
      'Include city and country for location context',
      'Add LinkedIn profile URL if professional',
      'Consider adding a portfolio or personal website',
      'Ensure phone number includes country code if applying internationally'
    ],
    projects: [
      'Include links to live projects or GitHub repositories',
      'Describe the problem your project solved',
      'Mention technologies and tools used',
      'Quantify the impact or results achieved',
      'Keep descriptions concise but informative'
    ]
  };

  // Find matching field suggestions
  for (const [key, fieldSuggestions] of Object.entries(suggestions)) {
    if (fieldLower.includes(key)) {
      return fieldSuggestions;
    }
  }

  // Default suggestions
  return [
    'Be specific and use concrete examples',
    'Include relevant keywords for your industry',
    'Keep content concise and easy to scan',
    'Use consistent formatting throughout',
    'Tailor content to your target role'
  ];
};

// Analyze CV function (uses secure backend)
export const analyzeCv = async (cvText: string, targetMarket: string = 'Global') => {
  try {
    return await secureApiService.analyzeCv(cvText, targetMarket);
  } catch (error) {
    console.error('CV analysis error:', error);
    throw error;
  }
};

// Generate interview questions
export const generateInterviewQuestions = async (cvText: string, jobRole: string = '') => {
  try {
    return await secureApiService.generateInterviewQuestions(cvText, jobRole);
  } catch (error) {
    console.error('Interview questions error:', error);
    throw error;
  }
};
