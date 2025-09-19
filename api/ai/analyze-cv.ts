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
    .substring(0, 15000); // Increased limit for job descriptions
};

// Rate limiting check
const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10; // Max 10 requests per 15 minutes

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

// Calculate real match score based on CV and job description content
const calculateMatchScore = (cvText: string, jobDescription: string): number => {
  const cvLower = cvText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // Define skill categories and keywords
  const skillCategories = {
    hospitality: ['steward', 'hospitality', 'restaurant', 'food service', 'customer service', 'cleaning', 'waiter', 'bartender'],
    tech: ['software', 'engineer', 'developer', 'programming', 'coding', 'javascript', 'python', 'react', 'node.js'],
    management: ['manager', 'lead', 'supervisor', 'director', 'coordinator'],
    sales: ['sales', 'marketing', 'business development', 'account'],
    finance: ['accounting', 'finance', 'analyst', 'bookkeeping'],
    healthcare: ['nurse', 'doctor', 'medical', 'healthcare', 'clinical'],
    education: ['teacher', 'instructor', 'educator', 'training']
  };
  
  // Detect primary categories for job and CV
  let jobCategory = '';
  let cvCategory = '';
  let maxJobMatches = 0;
  let maxCvMatches = 0;
  
  for (const [category, keywords] of Object.entries(skillCategories)) {
    const jobMatches = keywords.filter(keyword => jobLower.includes(keyword)).length;
    const cvMatches = keywords.filter(keyword => cvLower.includes(keyword)).length;
    
    if (jobMatches > maxJobMatches) {
      maxJobMatches = jobMatches;
      jobCategory = category;
    }
    
    if (cvMatches > maxCvMatches) {
      maxCvMatches = cvMatches;
      cvCategory = category;
    }
  }
  
  console.log(`Detected job category: ${jobCategory}, CV category: ${cvCategory}`);
  
  // If completely different industries, return low score
  if (jobCategory && cvCategory && jobCategory !== cvCategory) {
    const penalty = 50; // Major penalty for industry mismatch
    console.log(`Industry mismatch detected: ${cvCategory} CV for ${jobCategory} job`);
    return Math.max(5, 30 - penalty);
  }
  
  // Extract key skills from job description
  const commonSkills = [
    'communication', 'teamwork', 'leadership', 'problem solving', 'time management',
    'customer service', 'attention to detail', 'organizational', 'multitasking'
  ];
  
  const jobKeywords = [...skillCategories[jobCategory as keyof typeof skillCategories] || [], ...commonSkills];
  const matchingKeywords = jobKeywords.filter(keyword => cvLower.includes(keyword));
  
  // Calculate base score
  const keywordMatchRatio = jobKeywords.length > 0 ? matchingKeywords.length / jobKeywords.length : 0;
  const baseScore = keywordMatchRatio * 100;
  
  // Adjust for experience level indicators
  const experienceBonus = cvLower.includes('year') || cvLower.includes('experience') ? 10 : 0;
  
  return Math.max(5, Math.min(95, Math.round(baseScore + experienceBonus)));
};

// Generate fallback analysis with proper job matching
const generateFallbackAnalysis = (cvText: string, targetMarket: string, jobDescription?: string) => {
  const hasJobDescription = jobDescription && jobDescription.trim().length > 50;
  let matchScore = 75;
  
  if (hasJobDescription) {
    matchScore = calculateMatchScore(cvText, jobDescription);
    console.log(`Calculated match score: ${matchScore}% for job matching`);
  }
  
  const isLowMatch = matchScore < 40;
  const isMediumMatch = matchScore >= 40 && matchScore < 70;
  const isHighMatch = matchScore >= 70;
  
  return {
    score: matchScore,
    strengths: isHighMatch ? [
      'Good alignment with job requirements',
      'Relevant experience and skills',
      'Professional background matches role expectations',
      'Strong potential for success in this position'
    ] : isMediumMatch ? [
      'Some relevant experience and skills',
      'Transferable competencies identified',
      'Professional format and structure'
    ] : [
      'Professional CV format',
      'Clear contact information',
      'Work experience documented'
    ],
    improvements: isLowMatch ? [
      'Consider developing skills more relevant to this specific role',
      'Highlight any transferable skills that may apply',
      'Focus on roles that better match your current experience',
      'Consider additional training or certification in the target field'
    ] : isMediumMatch ? [
      'Tailor your CV to emphasize skills matching the job requirements',
      'Add specific examples demonstrating relevant competencies',
      'Include quantifiable achievements where possible',
      'Consider highlighting transferable skills from related experience'
    ] : [
      'Fine-tune your CV to emphasize the most relevant experience',
      'Add quantifiable achievements and specific metrics',
      'Include relevant keywords from the job description',
      'Ensure formatting is ATS-compatible'
    ],
    atsOptimization: [
      'Use standard section headings like "Experience", "Education", "Skills"',
      'Include relevant keywords from the job description naturally',
      'Avoid complex formatting that ATS systems might not read properly',
      'Use bullet points for easy scanning',
      'Save in both PDF and Word formats for different ATS systems'
    ],
    keywords: hasJobDescription ? extractKeywords(jobDescription) : [
      'professional', 'experienced', 'skilled', 'dedicated', 'results-oriented',
      'team player', 'communication', 'leadership', 'problem-solving'
    ],
    marketSpecific: [
      `CV optimized for ${targetMarket} market standards`,
      hasJobDescription ? 'Analysis includes job-specific requirements' : 'General market optimization applied',
      'Professional formatting and language used',
      'Industry-appropriate content structure'
    ],
    summary: hasJobDescription ? 
      `${matchScore}% compatibility with the target position. ${
        isHighMatch ? 'Strong match - you appear well-qualified for this role.' :
        isMediumMatch ? 'Moderate match - consider highlighting relevant transferable skills.' :
        'Limited match - this role may require different skills than your current background.'
      }` :
      `Your CV shows good professional structure with a score of ${matchScore}/100. Focus on adding quantifiable achievements and optimizing for ATS systems.`
  };
};

// Extract keywords from job description
const extractKeywords = (jobDescription: string): string[] => {
  const commonKeywords = [
    'experience', 'skills', 'knowledge', 'ability', 'responsible', 'manage',
    'develop', 'implement', 'coordinate', 'leadership', 'communication',
    'teamwork', 'problem-solving', 'analytical', 'detail-oriented'
  ];
  
  const text = jobDescription.toLowerCase();
  return commonKeywords.filter(keyword => text.includes(keyword));
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
    const { cvText, targetMarket = 'Global', jobDescription } = req.body;

    if (!cvText || typeof cvText !== 'string') {
      return res.status(400).json({ 
        error: 'CV text is required and must be a string' 
      });
    }

    // Sanitize inputs
    const sanitizedCvText = sanitizeInput(cvText);
    const sanitizedJobDescription = jobDescription ? sanitizeInput(jobDescription) : '';
    
    if (sanitizedCvText.length < 50) {
      return res.status(400).json({ 
        error: 'CV text is too short. Please provide more details.' 
      });
    }

    console.log(`📊 Analysis request: CV length: ${sanitizedCvText.length}, Job description: ${sanitizedJobDescription ? 'Yes' : 'No'}`);

    let analysis;

    try {
      // Try AI analysis if OpenAI is available
      if (process.env.OPENAI_API_KEY) {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const systemPrompt = `You are an expert CV analyzer specializing in job matching and ATS optimization. Analyze the CV and provide detailed feedback. ${
          sanitizedJobDescription ? 'Compare the CV against the provided job description and calculate an accurate match percentage.' : ''
        }

Return a JSON object with this EXACT structure:
{
  "score": number (0-100 representing overall quality or job match percentage),
  "strengths": string[],
  "improvements": string[],
  "atsOptimization": string[],
  "keywords": string[],
  "marketSpecific": string[],
  "summary": "string"
}`;

        const userContent = sanitizedJobDescription ? 
          `CV Content:\n${sanitizedCvText}\n\nJob Description:\n${sanitizedJobDescription}\n\nProvide detailed job match analysis with accurate scoring.` :
          `CV Content:\n${sanitizedCvText}\n\nProvide detailed CV analysis and improvement suggestions.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user", 
              content: userContent
            }
          ],
          max_tokens: 1500,
          temperature: 0.3, // Lower temperature for more consistent analysis
        });

        const responseContent = completion.choices[0].message.content;
        if (responseContent) {
          try {
            analysis = JSON.parse(responseContent);
            console.log(`✅ AI analysis completed with score: ${analysis.score}`);
          } catch (parseError) {
            console.error('Failed to parse AI response, using fallback');
            analysis = generateFallbackAnalysis(sanitizedCvText, targetMarket, sanitizedJobDescription);
          }
        } else {
          throw new Error('No response from OpenAI');
        }
      } else {
        throw new Error('OpenAI API key not configured');
      }
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      // Use enhanced fallback analysis
      analysis = generateFallbackAnalysis(sanitizedCvText, targetMarket, sanitizedJobDescription);
      console.log(`📋 Using fallback analysis with calculated score: ${analysis.score}`);
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      analysis,
      metadata: {
        timestamp: new Date().toISOString(),
        targetMarket,
        hasJobDescription: !!sanitizedJobDescription,
        analysisType: sanitizedJobDescription ? 'job-match' : 'cv-only',
        cvLength: sanitizedCvText.length,
        jobDescriptionLength: sanitizedJobDescription.length
      }
    });

  } catch (error: any) {
    console.error('CV Analysis API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Analysis temporarily unavailable. Please try again later.',
      metadata: {
        timestamp: new Date().toISOString(),
        errorType: 'server_error'
      }
    });
  }
}
