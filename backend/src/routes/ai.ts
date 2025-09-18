// backend/src/routes/ai.ts
import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import OpenAI from 'openai';

const router = express.Router();

// Rate limiting
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many AI requests, please try again later'
});

// Input sanitization middleware
const sanitizeInput = (req: any, res: any, next: any) => {
  if (req.body.text) {
    // Remove potential XSS content
    req.body.text = req.body.text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .substring(0, 10000); // Limit input length
  }
  next();
};

// OpenAI client initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// CV Analysis endpoint
router.post('/analyze-cv', 
  aiLimiter,
  sanitizeInput,
  [
    body('cvText').isLength({ min: 50, max: 10000 }).trim().escape(),
    body('targetMarket').isIn(['US', 'UK', 'CA', 'AU', 'MU', 'ZA', 'DE', 'SG', 'AE', 'Global']),
  ],
  async (req, res) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: errors.array() 
        });
      }

      const { cvText, targetMarket } = req.body;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert CV analyzer for the ${targetMarket} job market. Analyze the CV and provide detailed feedback in JSON format.`
          },
          {
            role: "user",
            content: `Analyze this CV: ${cvText}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const analysis = completion.choices[0].message.content;
      
      res.json({
        success: true,
        analysis: JSON.parse(analysis || '{}'),
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('AI Analysis Error:', error);
      res.status(500).json({ 
        error: 'Analysis failed', 
        message: 'Unable to process CV analysis at this time' 
      });
    }
  }
);

// Content enhancement endpoint
router.post('/enhance-content',
  aiLimiter,
  sanitizeInput,
  [
    body('content').isLength({ min: 10, max: 5000 }).trim().escape(),
    body('type').isIn(['summary', 'experience', 'skills', 'education']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: errors.array() 
        });
      }

      const { content, type } = req.body;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Enhance this ${type} section for a professional CV. Make it more impactful and ATS-friendly.`
          },
          {
            role: "user",
            content: content
          }
        ],
        max_tokens: 1000,
        temperature: 0.8,
      });

      res.json({
        success: true,
        enhancedContent: completion.choices[0].message.content,
        originalLength: content.length,
        enhancedLength: completion.choices[0].message.content?.length || 0
      });

    } catch (error) {
      console.error('Content Enhancement Error:', error);
      res.status(500).json({ 
        error: 'Enhancement failed',
        message: 'Unable to enhance content at this time'
      });
    }
  }
);

export default router;
