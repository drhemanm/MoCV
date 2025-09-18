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
    .substring(0, 2000);
};

// Rate limiting check
const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 20; // Max 20 requests per 15 minutes

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
    const { content, type, targetMarket = 'Global' } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ 
        error: 'Content is required and must be a string' 
      });
    }

    if (!type || typeof type !== 'string') {
      return res.status(400).json({ 
        error: 'Content type is required' 
      });
    }

    // Validate content type
    const validTypes = ['summary', 'experience', 'skills', 'education', 'achievement'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid content type' 
      });
    }

    // Sanitize input
    const sanitizedContent = sanitizeInput(content);
    
    if (sanitizedContent.length < 10) {
      return res.status(400).json({ 
        error: 'Content is too short to enhance' 
      });
    }

    // Initialize OpenAI
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'AI service is temporarily unavailable' 
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create enhancement prompts based on type
    const enhancementPrompts = {
      summary: `Enhance this professional summary for a CV targeting the ${targetMarket} market. Make it more compelling, ATS-friendly, and impactful while keeping the core message. Use action words and quantifiable achievements where possible.`,
      
      experience: `Enhance this work experience description for a CV. Focus on achievements, use strong action verbs, include metrics where possible, and make it ATS-optimized for the ${targetMarket} market.`,
      
      skills: `Enhance this skills section for a CV. Organize skills by category, add relevant technical skills, and optimize for ATS systems in the ${targetMarket} market.`,
      
      education: `Enhance this education section for a CV. Include relevant coursework, achievements, and format it professionally for the ${targetMarket} market.`,
      
      achievement: `Enhance this achievement description for a CV. Quantify the impact, use strong action words, and make it compelling for the ${targetMarket} market.`
    };

    const systemPrompt = `You are a professional CV writer with expertise in the ${targetMarket} job market. Enhance the provided content to be more impactful, professional, and ATS-friendly. Return only the enhanced content without explanations or additional formatting.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `${enhancementPrompts[type as keyof typeof enhancementPrompts]}\n\nOriginal content:\n${sanitizedContent}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.8,
    });

    const enhancedContent = completion.choices[0].message.content;
    
    if (!enhancedContent) {
      throw new Error('No response from OpenAI');
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      data: {
        originalContent: sanitizedContent,
        enhancedContent: enhancedContent.trim(),
        type,
        targetMarket,
        improvementMade: true
      },
      metadata: {
        originalLength: sanitizedContent.length,
        enhancedLength: enhancedContent.trim().length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Content Enhancement Error:', error);
    
    // Return original content with basic improvements as fallback
    const originalContent = req.body?.content || '';
    const fallbackContent = originalContent
      .replace(/\b(i|I)\b/g, 'I')
      .replace(/\b(led|managed|created|developed|improved)\b/gi, (match) => 
        match.charAt(0).toUpperCase() + match.slice(1).toLowerCase())
      .trim();

    return res.status(200).json({
      success: true,
      data: {
        originalContent,
        enhancedContent: fallbackContent,
        type: req.body?.type || 'unknown',
        targetMarket: req.body?.targetMarket || 'Global',
        improvementMade: false
      },
      fallback: true,
      metadata: {
        originalLength: originalContent.length,
        enhancedLength: fallbackContent.length,
        timestamp: new Date().toISOString(),
        error: 'AI service temporarily unavailable - minor improvements applied'
      }
    });
  }
}
