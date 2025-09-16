// src/services/openaiService.ts
import OpenAI from 'openai';

// Initialize OpenAI client with proper error handling
let openaiClient: OpenAI | null = null;

try {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  
  if (apiKey && apiKey !== 'your_openai_api_key_here' && !apiKey.includes('placeholder')) {
    openaiClient = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    console.log('OpenAI client initialized successfully');
  } else {
    console.warn('OpenAI API key not properly configured. AI features will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

export const getServiceStatus = (): { available: boolean; error?: string } => {
  if (!openaiClient) {
    return { 
      available: false, 
      error: 'OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.' 
    };
  }
  return { available: true };
};

export const enhanceText = async (text: string, context?: string): Promise<string> => {
  const status = getServiceStatus();
  if (!status.available) {
    throw new Error(status.error);
  }

  if (!openaiClient) {
    throw new Error('OpenAI client not initialized');
  }

  try {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional CV writing assistant. Improve the given text to be more professional, impactful, and ATS-friendly while maintaining accuracy."
        },
        {
          role: "user",
          content: `Please enhance this ${context || 'text'} for a professional CV: ${text}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    return completion.choices[0]?.message?.content || text;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to enhance text. Please try again later.');
  }
};

export const getSuggestions = async (field: string, currentValue: string): Promise<string[]> => {
  const status = getServiceStatus();
  if (!status.available) {
    return [];
  }

  if (!openaiClient) {
    return [];
  }

  try {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a CV writing assistant. Provide 3-5 brief suggestions for improving CV content."
        },
        {
          role: "user",
          content: `Suggest improvements for this ${field}: ${currentValue}`
        }
      ],
      max_tokens: 200,
      temperature: 0.8
    });

    const response = completion.choices[0]?.message?.content || '';
    return response.split('\n').filter(s => s.trim()).slice(0, 5);
  } catch (error) {
    console.error('OpenAI suggestions error:', error);
    return [];
  }
};
