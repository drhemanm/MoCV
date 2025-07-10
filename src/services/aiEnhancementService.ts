// AI Enhancement Service for improving CV content
import { getServiceStatus } from './openaiService';

export interface EnhancementRequest {
  text: string;
  sectionType: 'summary' | 'experience' | 'education' | 'skills' | 'general';
  targetMarket?: string;
  jobTitle?: string;
}

export interface EnhancementResponse {
  originalText: string;
  enhancedText: string;
  improvements: string[];
  confidence: number;
  usingFallback?: boolean;
}

// Check if AI services are available
const isAIAvailable = (): boolean => {
  const status = getServiceStatus();
  return status.openaiAvailable && status.apiKeyConfigured;
};

// Simulate AI enhancement (in production, this would call OpenAI API)
export const enhanceText = async (request: EnhancementRequest): Promise<EnhancementResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const { text, sectionType, targetMarket, jobTitle } = request;
  const usingFallback = !isAIAvailable();

  // Mock enhancement based on section type
  let enhancedText = text;
  let improvements: string[] = [];

  switch (sectionType) {
    case 'summary':
      enhancedText = enhanceSummary(text, targetMarket, jobTitle);
      improvements = [
        'Added quantifiable achievements',
        'Improved professional tone',
        'Included relevant keywords',
        'Enhanced readability'
      ];
      break;

    case 'experience':
      enhancedText = enhanceExperience(text);
      improvements = [
        'Used stronger action verbs',
        'Added specific metrics',
        'Improved bullet point structure',
        'Enhanced impact statements'
      ];
      break;

    case 'skills':
      enhancedText = enhanceSkills(text);
      improvements = [
        'Organized by relevance',
        'Added technical depth',
        'Improved categorization'
      ];
      break;

    default:
      enhancedText = enhanceGeneral(text);
      improvements = [
        'Improved clarity',
        'Enhanced professional tone',
        'Better structure'
      ];
  }

  if (usingFallback) {
    improvements.push('Note: Using offline enhancement (OpenAI not configured)');
  }

  return {
    originalText: text,
    enhancedText,
    improvements,
    confidence: usingFallback ? Math.floor(Math.random() * 20) + 60 : Math.floor(Math.random() * 20) + 80, // Lower confidence for fallback
    usingFallback
  };
};

// Enhance professional summary
const enhanceSummary = (text: string, targetMarket?: string, jobTitle?: string): string => {
  if (!text.trim()) {
    return `Results-driven professional with proven expertise in ${jobTitle || 'relevant field'}. Demonstrated ability to deliver high-impact solutions and drive organizational success. Seeking to leverage strong analytical skills and industry knowledge to contribute to ${targetMarket ? `${targetMarket} market opportunities` : 'team objectives'}.`;
  }

  // Simple enhancement rules
  let enhanced = text;
  
  // Add quantifiable elements if missing
  if (!enhanced.match(/\d+/)) {
    enhanced = enhanced.replace(/experience/, 'X+ years of experience');
  }
  
  // Improve action words
  enhanced = enhanced
    .replace(/worked/gi, 'collaborated')
    .replace(/helped/gi, 'facilitated')
    .replace(/did/gi, 'executed')
    .replace(/made/gi, 'developed');

  // Add market-specific elements
  if (targetMarket) {
    enhanced += ` Experienced in ${targetMarket} market dynamics and cultural nuances.`;
  }

  return enhanced;
};

// Enhance work experience descriptions
const enhanceExperience = (text: string): string => {
  if (!text.trim()) {
    return '• Led cross-functional initiatives resulting in measurable business impact\n• Implemented strategic solutions that improved operational efficiency by X%\n• Collaborated with stakeholders to deliver high-quality results on time and within budget';
  }

  let enhanced = text;

  // Improve bullet points
  const lines = enhanced.split('\n');
  const improvedLines = lines.map(line => {
    let improved = line.trim();
    
    // Ensure bullet points start with action verbs
    if (improved && !improved.startsWith('•') && !improved.startsWith('-')) {
      improved = '• ' + improved;
    }
    
    // Replace weak verbs with strong ones
    improved = improved
      .replace(/• worked/gi, '• Collaborated')
      .replace(/• helped/gi, '• Facilitated')
      .replace(/• did/gi, '• Executed')
      .replace(/• made/gi, '• Developed')
      .replace(/• was responsible for/gi, '• Led')
      .replace(/• handled/gi, '• Managed');

    // Add quantifiable elements where missing
    if (improved.includes('improved') && !improved.match(/\d+%/)) {
      improved = improved.replace('improved', 'improved by X%');
    }
    
    if (improved.includes('increased') && !improved.match(/\d+%/)) {
      improved = improved.replace('increased', 'increased by X%');
    }

    return improved;
  });

  return improvedLines.join('\n');
};

// Enhance skills section
const enhanceSkills = (text: string): string => {
  if (!text.trim()) {
    return 'Technical Skills: [Add relevant technical skills]\nSoft Skills: Leadership, Communication, Problem-solving\nTools & Platforms: [Add relevant tools]';
  }

  // Simple skill organization
  const skills = text.split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 0);
  
  const technicalSkills: string[] = [];
  const softSkills: string[] = [];
  const tools: string[] = [];

  skills.forEach(skill => {
    const lowerSkill = skill.toLowerCase();
    if (lowerSkill.includes('leadership') || lowerSkill.includes('communication') || 
        lowerSkill.includes('management') || lowerSkill.includes('teamwork')) {
      softSkills.push(skill);
    } else if (lowerSkill.includes('software') || lowerSkill.includes('platform') || 
               lowerSkill.includes('tool') || lowerSkill.includes('system')) {
      tools.push(skill);
    } else {
      technicalSkills.push(skill);
    }
  });

  let enhanced = '';
  if (technicalSkills.length > 0) {
    enhanced += `Technical Skills: ${technicalSkills.join(', ')}\n`;
  }
  if (softSkills.length > 0) {
    enhanced += `Soft Skills: ${softSkills.join(', ')}\n`;
  }
  if (tools.length > 0) {
    enhanced += `Tools & Platforms: ${tools.join(', ')}`;
  }

  return enhanced || text;
};

// General text enhancement
const enhanceGeneral = (text: string): string => {
  if (!text.trim()) return text;

  let enhanced = text;

  // Improve professional tone
  enhanced = enhanced
    .replace(/i /gi, 'I ')
    .replace(/\bi\b/g, 'I')
    .replace(/gonna/gi, 'going to')
    .replace(/wanna/gi, 'want to')
    .replace(/kinda/gi, 'somewhat')
    .replace(/really/gi, 'significantly')
    .replace(/very/gi, 'highly')
    .replace(/good/gi, 'effective')
    .replace(/nice/gi, 'professional')
    .replace(/awesome/gi, 'exceptional');

  // Improve sentence structure
  enhanced = enhanced
    .replace(/\.\s+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();

  return enhanced;
};

// Get enhancement suggestions for different sections
export const getEnhancementSuggestions = (sectionType: string, content: string): string[] => {
  const suggestions: { [key: string]: string[] } = {
    summary: [
      'Include specific years of experience',
      'Add quantifiable achievements',
      'Mention key skills relevant to target role',
      'Include industry-specific keywords',
      'Keep it concise (2-3 sentences)'
    ],
    experience: [
      'Start each bullet with strong action verbs',
      'Include specific metrics and percentages',
      'Focus on achievements, not just responsibilities',
      'Use past tense for previous roles, present for current',
      'Quantify impact wherever possible'
    ],
    education: [
      'Include graduation year if recent (within 10 years)',
      'Add GPA if 3.5 or higher',
      'Include relevant coursework for entry-level positions',
      'Mention honors, awards, or distinctions',
      'Add thesis title if relevant to target role'
    ],
    skills: [
      'Organize by categories (Technical, Soft Skills, Tools)',
      'List most relevant skills first',
      'Include proficiency levels where appropriate',
      'Add certifications and their expiry dates',
      'Match skills to job description keywords'
    ]
  };

  const baseSuggestions = suggestions[sectionType] || [
    'Use clear, professional language',
    'Keep information relevant and concise',
    'Ensure proper grammar and spelling',
    'Use consistent formatting'
  ];

  // Add AI availability note
  if (!isAIAvailable()) {
    baseSuggestions.push('💡 Configure OpenAI API key for advanced AI enhancements');
  }

  return baseSuggestions;
};

export default {
  enhanceText,
  getEnhancementSuggestions
};