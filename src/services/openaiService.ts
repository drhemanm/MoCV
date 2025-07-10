import OpenAI from 'openai';

// Get API key from environment variables
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your environment variables.');
  }
  
  if (apiKey.startsWith('your_') || apiKey === 'your_openai_api_key_here' || apiKey.trim() === '') {
    throw new Error('Please replace the placeholder OpenAI API key with your actual API key.');
  }
  
  return apiKey;
};

// Initialize OpenAI client with error handling
const initializeOpenAI = (): OpenAI => {
  try {
    const apiKey = getApiKey();
    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
    });
  } catch (error) {
    console.error('OpenAI initialization failed:', error);
    throw error;
  }
};

let openai: OpenAI;

try {
  openai = initializeOpenAI();
} catch (error) {
  console.warn('OpenAI service unavailable:', error);
}

const ASSISTANT_ID = 'asst_GT8tRXlOXGABJtX5x7il3OOs';

export interface CVAnalysisRequest {
  cvText: string;
  jobDescription?: string;
  targetMarket?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'situational' | 'company-specific';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedPoints: string[];
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

// Check if OpenAI is available
const isOpenAIAvailable = (): boolean => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    return !!openai && !!apiKey && !apiKey.startsWith('your_') && apiKey !== 'your_openai_api_key_here' && apiKey.trim() !== '';
  } catch {
    return false;
  }
};

// CV Analysis with OpenAI
export const analyzeCV = async (request: CVAnalysisRequest) => {
  if (!isOpenAIAvailable()) {
    console.warn('OpenAI service not available, using fallback analysis');
    return getFallbackAnalysis(request);
  }

  try {
    const prompt = `
    Analyze this CV for ATS optimization and provide detailed feedback:
    
    CV Content:
    ${request.cvText}
    
    ${request.jobDescription ? `Job Description: ${request.jobDescription}` : ''}
    ${request.targetMarket ? `Target Market: ${request.targetMarket}` : ''}
    
    Please provide:
    1. ATS Score (0-100)
    2. Matched keywords from job description
    3. Missing important keywords
    4. Specific improvement suggestions
    5. Readability assessment
    6. Market-specific recommendations
    
    Format as JSON with fields: score, matchedKeywords, missingKeywords, suggestions, readabilityScore, marketRecommendations
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert CV analyst and ATS optimization specialist. Provide detailed, actionable feedback to help job seekers improve their CVs."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const response = completion.choices[0].message.content;
    
    try {
      return JSON.parse(response || '{}');
    } catch {
      return getFallbackAnalysis(request);
    }
  } catch (error) {
    console.error('OpenAI CV Analysis Error:', error);
    return getFallbackAnalysis(request);
  }
};

// Fallback analysis when OpenAI is not available
const getFallbackAnalysis = (request: CVAnalysisRequest) => {
  const cvText = request.cvText.toLowerCase();
  const jobDesc = request.jobDescription?.toLowerCase() || '';
  
  // Simple keyword matching
  const commonKeywords = ['javascript', 'react', 'node.js', 'python', 'management', 'leadership', 'communication'];
  const matchedKeywords = commonKeywords.filter(keyword => cvText.includes(keyword));
  const missingKeywords = ['typescript', 'aws', 'docker', 'agile', 'ci/cd'];
  
  const score = Math.min(95, Math.max(60, matchedKeywords.length * 10 + (cvText.length > 500 ? 20 : 0)));
  
  return {
    score,
    matchedKeywords,
    missingKeywords,
    suggestions: [
      'Add more quantifiable achievements with specific numbers',
      'Include missing technical keywords relevant to your field',
      'Improve professional summary with concrete examples',
      'Use action verbs to start bullet points',
      'Ensure consistent formatting throughout the document'
    ],
    readabilityScore: 'Good',
    marketRecommendations: request.targetMarket ? 
      [`Optimize for ${request.targetMarket} market standards`] : 
      ['Use standard international CV format']
  };
};

// Generate Interview Questions
export const generateInterviewQuestions = async (cvText: string, jobDescription: string): Promise<InterviewQuestion[]> => {
  if (!isOpenAIAvailable()) {
    return getFallbackQuestions();
  }

  try {
    const prompt = `
    Based on this CV and job description, generate 5 realistic interview questions:
    
    CV: ${cvText}
    Job Description: ${jobDescription}
    
    Create questions that:
    1. Test relevant skills mentioned in the job description
    2. Explore experiences from the CV
    3. Include behavioral, technical, and situational questions
    4. Vary in difficulty
    
    Format as JSON array with fields: id, question, category, difficulty, expectedPoints
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer who creates realistic, relevant interview questions based on job requirements and candidate backgrounds."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
    });

    const response = completion.choices[0].message.content;
    
    try {
      return JSON.parse(response || '[]');
    } catch {
      return getFallbackQuestions();
    }
  } catch (error) {
    console.error('OpenAI Question Generation Error:', error);
    return getFallbackQuestions();
  }
};

const getFallbackQuestions = (): InterviewQuestion[] => [
  {
    id: '1',
    question: 'Tell me about your experience with the technologies mentioned in your CV.',
    category: 'technical',
    difficulty: 'medium',
    expectedPoints: ['Technical depth', 'Practical application', 'Problem-solving']
  },
  {
    id: '2',
    question: 'Describe a challenging project you worked on and how you overcame obstacles.',
    category: 'behavioral',
    difficulty: 'medium',
    expectedPoints: ['Problem-solving', 'Resilience', 'Learning ability']
  },
  {
    id: '3',
    question: 'How do you handle working under pressure and tight deadlines?',
    category: 'situational',
    difficulty: 'easy',
    expectedPoints: ['Time management', 'Stress handling', 'Prioritization']
  },
  {
    id: '4',
    question: 'Why are you interested in this role and our company?',
    category: 'company-specific',
    difficulty: 'easy',
    expectedPoints: ['Research', 'Motivation', 'Cultural fit']
  },
  {
    id: '5',
    question: 'Where do you see yourself in 5 years?',
    category: 'behavioral',
    difficulty: 'medium',
    expectedPoints: ['Career planning', 'Ambition', 'Alignment with role']
  }
];

// Evaluate Interview Answer
export const evaluateAnswer = async (question: string, answer: string, expectedPoints: string[]): Promise<InterviewFeedback> => {
  if (!isOpenAIAvailable()) {
    return getFallbackFeedback(answer);
  }

  try {
    const prompt = `
    Evaluate this interview answer:
    
    Question: ${question}
    Answer: ${answer}
    Expected Points: ${expectedPoints.join(', ')}
    
    Provide:
    1. Score (0-100)
    2. Strengths in the answer
    3. Areas for improvement
    4. Specific suggestions for better answers
    
    Format as JSON with fields: score, strengths, improvements, suggestions
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach providing constructive feedback on interview answers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    const response = completion.choices[0].message.content;
    
    try {
      return JSON.parse(response || '{}');
    } catch {
      return getFallbackFeedback(answer);
    }
  } catch (error) {
    console.error('OpenAI Answer Evaluation Error:', error);
    return getFallbackFeedback(answer);
  }
};

const getFallbackFeedback = (answer: string): InterviewFeedback => {
  const wordCount = answer.split(' ').length;
  const hasExamples = answer.toLowerCase().includes('example') || answer.toLowerCase().includes('instance');
  const hasMetrics = /\d+/.test(answer);
  
  let score = 60;
  if (wordCount > 50) score += 10;
  if (hasExamples) score += 15;
  if (hasMetrics) score += 15;
  
  return {
    score: Math.min(100, score),
    strengths: [
      wordCount > 50 ? 'Detailed response' : 'Clear communication',
      hasExamples ? 'Provided specific examples' : 'Direct answer'
    ],
    improvements: [
      !hasExamples ? 'Add specific examples to support your points' : 'Consider more concrete details',
      !hasMetrics ? 'Include quantifiable results where possible' : 'Expand on the impact'
    ],
    suggestions: [
      'Use the STAR method (Situation, Task, Action, Result)',
      'Practice articulating your achievements with specific metrics',
      'Prepare 3-5 detailed examples you can adapt to different questions'
    ]
  };
};

// Generate CV Content with AI
export const generateCVContent = async (userInput: {
  background: string;
  experience: string;
  goals: string;
  skills: string;
  targetMarket?: string;
}) => {
  if (!isOpenAIAvailable()) {
    return getFallbackContent(userInput);
  }

  try {
    const prompt = `
    Generate professional CV content based on this information:
    
    Background: ${userInput.background}
    Experience: ${userInput.experience}
    Career Goals: ${userInput.goals}
    Skills: ${userInput.skills}
    ${userInput.targetMarket ? `Target Market: ${userInput.targetMarket}` : ''}
    
    Create:
    1. Professional summary (2-3 sentences)
    2. 2-3 work experience entries with bullet points
    3. Skills list organized by category
    4. Key achievements with metrics
    
    Make it ATS-friendly and tailored to the target market.
    Format as JSON with fields: summary, experience, skills, achievements
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert CV writer who creates compelling, ATS-optimized content that highlights candidates' strengths and achievements."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const response = completion.choices[0].message.content;
    
    try {
      return JSON.parse(response || '{}');
    } catch {
      return getFallbackContent(userInput);
    }
  } catch (error) {
    console.error('OpenAI Content Generation Error:', error);
    return getFallbackContent(userInput);
  }
};

const getFallbackContent = (userInput: any) => {
  return {
    summary: `Experienced ${userInput.background || 'professional'} with strong expertise in ${userInput.skills || 'relevant areas'}. Proven track record of delivering results and seeking to leverage skills in ${userInput.goals || 'new opportunities'}.`,
    experience: [
      {
        title: "Professional Role",
        company: "Previous Company",
        description: `• Applied ${userInput.skills || 'relevant skills'} to deliver business value\n• Collaborated with teams to achieve project objectives\n• Contributed to organizational success through dedicated work`
      }
    ],
    skills: userInput.skills ? userInput.skills.split(',').map((s: string) => s.trim()) : ['Communication', 'Problem-solving', 'Teamwork'],
    achievements: [
      "Successfully completed assigned projects",
      "Contributed to team objectives",
      "Maintained professional standards"
    ]
  };
};

// Improve CV Section
export const improveCVSection = async (sectionContent: string, sectionType: string, targetMarket?: string) => {
  if (!isOpenAIAvailable()) {
    return getFallbackImprovement(sectionContent, sectionType);
  }

  try {
    const prompt = `
    Improve this CV section:
    
    Section Type: ${sectionType}
    Current Content: ${sectionContent}
    ${targetMarket ? `Target Market: ${targetMarket}` : ''}
    
    Make it more:
    1. ATS-friendly
    2. Quantifiable with metrics
    3. Action-oriented
    4. Relevant to the target market
    
    Return the improved version maintaining the same format.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert CV optimizer who enhances content to be more impactful, quantifiable, and ATS-friendly."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 800
    });

    return completion.choices[0].message.content || sectionContent;
  } catch (error) {
    console.error('OpenAI Section Improvement Error:', error);
    return getFallbackImprovement(sectionContent, sectionType);
  }
};

const getFallbackImprovement = (content: string, sectionType: string): string => {
  if (!content.trim()) return content;
  
  let improved = content;
  
  // Basic improvements based on section type
  if (sectionType === 'experience') {
    improved = improved
      .replace(/worked/gi, 'collaborated')
      .replace(/helped/gi, 'facilitated')
      .replace(/did/gi, 'executed')
      .replace(/made/gi, 'developed');
  }
  
  return improved;
};

// Chat Assistant
export const chatWithAssistant = async (message: string, conversationHistory: any[] = []) => {
  if (!isOpenAIAvailable()) {
    return getFallbackChatResponse(message);
  }

  try {
    // Create a thread
    const thread = await openai.beta.threads.create();
    
    // Add the user message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });
    
    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID
    });
    
    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed');
      }
    }
    
    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data[0];
    
    if (assistantMessage.content[0].type === 'text') {
      return assistantMessage.content[0].text.value;
    }
    
    return getFallbackChatResponse(message);
  } catch (error) {
    console.error('OpenAI Assistant Error:', error);
    return getFallbackChatResponse(message);
  }
};

const getFallbackChatResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('cv') || lowerMessage.includes('resume')) {
    return "I'd be happy to help you with your CV! For the best experience, please ensure your OpenAI API key is configured. In the meantime, you can use our CV builder and templates to create a professional CV.";
  }
  
  if (lowerMessage.includes('interview')) {
    return "Interview preparation is crucial for success! Practice common questions, research the company, and prepare specific examples using the STAR method (Situation, Task, Action, Result).";
  }
  
  if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
    return "Career development is a journey! Focus on building relevant skills, networking, and tailoring your applications to each role. Our platform can help you optimize your CV for different markets.";
  }
  
  return "I'm here to help with your career and CV questions! For the full AI experience, please configure your OpenAI API key in the environment variables.";
};

// Service status check
export const getServiceStatus = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const isValidKey = apiKey && !apiKey.startsWith('your_') && apiKey !== 'your_openai_api_key_here' && apiKey.trim() !== '';
  
  return {
    openaiAvailable: isOpenAIAvailable(),
    apiKeyConfigured: isValidKey,
    apiKeyStatus: !apiKey ? 'missing' : !isValidKey ? 'invalid' : 'valid',
    environment: import.meta.env.VITE_APP_ENV || 'development'
  };
};

export default {
  analyzeCV,
  generateInterviewQuestions,
  evaluateAnswer,
  generateCVContent,
  improveCVSection,
  chatWithAssistant,
  getServiceStatus
};