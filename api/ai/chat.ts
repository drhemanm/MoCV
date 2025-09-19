// api/ai/chat.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Input sanitization
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
    .substring(0, 1000);
};

// Rate limiting check
const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 30; // Max 30 chat requests per 15 minutes

  const userLimit = rateLimitStore.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
};

// Fallback responses when AI is unavailable
const getFallbackResponse = (message: string): string => {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('cv') || messageLower.includes('resume')) {
    return "I'd be happy to help with your CV! Here are some key tips: Start with a compelling professional summary, use action verbs to describe your achievements, include quantifiable results where possible, and tailor your CV to each job application. Make sure your contact information is clear and your formatting is clean and ATS-friendly. What specific aspect of your CV would you like to improve?";
  }
  
  if (messageLower.includes('interview')) {
    return "Interview preparation is crucial for success! Here's what I recommend: Research the company thoroughly, practice common questions like 'Tell me about yourself' and 'Why do you want this role?', prepare STAR method examples for behavioral questions, and have thoughtful questions ready about the role and company. Practice your responses out loud and consider doing mock interviews. What type of interview are you preparing for?";
  }
  
  if (messageLower.includes('job') || messageLower.includes('career')) {
    return "Career development is a journey! Focus on these key areas: Identify your strengths and interests, set clear short and long-term goals, build a strong professional network, and continuously develop relevant skills. The job market offers many opportunities, especially if you're willing to adapt and learn. Consider what industries excite you most and research the skills they value. What career goals are you working towards?";
  }
  
  if (messageLower.includes('skill') || messageLower.includes('learn')) {
    return "Skills development is essential in today's job market! Focus on both technical skills relevant to your field and soft skills like communication, leadership, and problem-solving. Consider online courses, certifications, practical projects, and networking to demonstrate your abilities. LinkedIn Learning, Coursera, and industry-specific platforms offer great options. What skills are you looking to develop?";
  }

  if (messageLower.includes('mauritius') || messageLower.includes('africa')) {
    return "The job market in Mauritius and across Africa is evolving rapidly, with growing opportunities in technology, financial services, and international business. Focus on highlighting your unique strengths, consider remote work opportunities with global companies, and emphasize your multicultural background and language skills. These are valuable assets in today's global economy. What industry interests you most?";
  }
  
  return "Thank you for reaching out! I'm here to help with CV optimization, career advice, interview preparation, and job search strategies. I can offer practical guidance on making your CV stand out, preparing for interviews, and advancing your career. What specific area would you like help with today?";
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting
    const clientIp = req.headers['x-forwarded-for'] as string || 
                     req.headers['x-real-ip'] as string || 
                     'unknown';
    
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.' 
      });
    }

    // Validate request body
    const { message, context = '' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
    }

    // Sanitize input
    const sanitizedMessage = sanitizeInput(message);
    
    if (sanitizedMessage.length < 3) {
      return res.status(400).json({ 
        error: 'Message is too short' 
      });
    }

    let response: string;

    try {
      // Initialize OpenAI if available
      if (process.env.OPENAI_API_KEY) {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const systemPrompt = `You are MoCV AI Assistant, a helpful career advisor specializing in CV optimization, job search strategies, and career development for professionals in Mauritius and Africa seeking global opportunities.

Key guidelines:
- Be helpful, encouraging, and provide actionable advice
- Keep responses concise but informative (2-3 paragraphs max)
- Focus on CV improvement, career advice, interview prep, and job search strategies
- Provide specific, practical suggestions
- Be supportive and motivational
- If asked about technical CV issues, provide clear step-by-step guidance

Context from previous conversation:
${context}`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: sanitizedMessage
            }
          ],
          max_tokens: 600,
          temperature: 0.8,
        });

        response = completion.choices[0].message.content?.trim() || getFallbackResponse(sanitizedMessage);
      } else {
        // Use fallback if no API key
        response = getFallbackResponse(sanitizedMessage);
      }
    } catch (aiError) {
      console.error('AI chat failed:', aiError);
      // Use fallback response
      response = getFallbackResponse(sanitizedMessage);
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
}
