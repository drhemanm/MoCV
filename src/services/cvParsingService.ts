// CV Parsing Service for extracting structured data from uploaded files
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';

export interface ParsedCVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
    photo?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    year: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: number;
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: 'Basic' | 'Intermediate' | 'Fluent';
  }>;
}

// Extract text from PDF using a simple approach (in production, use proper PDF parsing)
const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const text = await extractPDFText(arrayBuffer);
    return text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to extract text from PDF file');
  }
};

// Enhanced PDF text extraction
const extractPDFText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const uint8Array = new Uint8Array(arrayBuffer);
  const decoder = new TextDecoder('utf-8', { fatal: false });
  const pdfData = decoder.decode(uint8Array);
  
  // Method 1: Extract text from PDF text objects
  let extractedText = '';
  
  // Look for text between BT (Begin Text) and ET (End Text) operators
  const textBlocks = pdfData.match(/BT\s+.*?ET/gs) || [];
  
  for (const block of textBlocks) {
    // Extract text from Tj and TJ operators
    const tjMatches = block.match(/\((.*?)\)\s*Tj/g) || [];
    const tjArrayMatches = block.match(/\[(.*?)\]\s*TJ/g) || [];
    
    // Process Tj matches
    tjMatches.forEach(match => {
      const text = match.match(/\((.*?)\)/)?.[1];
      if (text) {
        extractedText += decodeTextString(text) + ' ';
      }
    });
    
    // Process TJ array matches
    tjArrayMatches.forEach(match => {
      const arrayContent = match.match(/\[(.*?)\]/)?.[1];
      if (arrayContent) {
        const textParts = arrayContent.match(/\((.*?)\)/g) || [];
        textParts.forEach(part => {
          const text = part.replace(/[()]/g, '');
          extractedText += decodeTextString(text) + ' ';
        });
      }
    });
  }
  
  // Method 2: If Method 1 didn't work, try extracting from parentheses
  if (extractedText.trim().length < 50) {
    const parenthesesMatches = pdfData.match(/\(([^)]+)\)/g) || [];
    let fallbackText = '';
    
    parenthesesMatches.forEach(match => {
      const text = match.replace(/[()]/g, '').trim();
      // Filter out PDF commands and keep only readable text
      if (text.length > 2 && 
          !text.match(/^[0-9\s.]+$/) && // Skip pure numbers
          !text.includes('endobj') &&
          !text.includes('stream') &&
          !text.includes('FlateDecode') &&
          /[a-zA-Z]/.test(text)) { // Must contain letters
        fallbackText += text + ' ';
      }
    });
    
    if (fallbackText.trim().length > extractedText.trim().length) {
      extractedText = fallbackText;
    }
  }
  
  // Method 3: Try to extract from stream objects
  if (extractedText.trim().length < 50) {
    const streamMatches = pdfData.match(/stream\s+(.*?)\s+endstream/gs) || [];
    let streamText = '';
    
    streamMatches.forEach(match => {
      const content = match.replace(/stream\s+|\s+endstream/g, '');
      // Try to find readable text in streams
      const readableText = content.match(/[a-zA-Z][a-zA-Z0-9\s@.,\-_]{3,}/g) || [];
      readableText.forEach(text => {
        if (text.length > 3 && !text.includes('obj') && !text.includes('endobj')) {
          streamText += text + ' ';
        }
      });
    });
    
    if (streamText.trim().length > extractedText.trim().length) {
      extractedText = streamText;
    }
  }
  
  // Clean up the extracted text
  extractedText = extractedText
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Remove non-printable characters
    .trim();
  
  // Validate the extracted text
  if (extractedText.length < 20) {
    throw new Error('Could not extract sufficient text from PDF');
  }
  
  // Check if it looks like meaningful content
  const hasEmail = /\S+@\S+\.\S+/.test(extractedText);
  const hasWords = extractedText.split(' ').filter(word => word.length > 2).length > 5;
  const hasPersonalInfo = /\b(experience|education|skills|work|job|company)\b/i.test(extractedText);
  
  if (!hasWords && !hasEmail && !hasPersonalInfo) {
    throw new Error('Extracted text does not appear to be CV content');
  }
  
  return extractedText;
};

// Decode PDF text strings (handle escape sequences)
const decodeTextString = (text: string): string => {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\')
    .replace(/\\([0-7]{3})/g, (match, octal) => String.fromCharCode(parseInt(octal, 8)));
};
// Extract text from DOCX files
const extractTextFromDOCX = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting DOCX text:', error);
    throw new Error('Failed to extract text from DOCX file');
  }
};

// Extract text from plain text files
const extractTextFromTXT = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Main function to extract text from various file types
export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      return await extractTextFromDOCX(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await extractTextFromTXT(file);
    } else {
      throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
    }
  } catch (error) {
    console.error('File extraction error:', error);
    throw error;
  }
};

// Parse extracted text into structured CV data
export const parseTextToStructuredData = (text: string): ParsedCVData => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Initialize the parsed data structure
  const parsedData: ParsedCVData = {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: '',
      photo: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    languages: []
  };

  // Extract personal information
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;
  const linkedinRegex = /(linkedin\.com\/in\/[A-Za-z0-9-]+)/i;
  const websiteRegex = /(https?:\/\/[^\s]+)/;

  // Find name (usually the first line or largest text)
  if (lines.length > 0) {
    parsedData.personalInfo.fullName = lines[0];
  }

  // Extract contact information
  for (const line of lines) {
    const emailMatch = line.match(emailRegex);
    if (emailMatch && !parsedData.personalInfo.email) {
      parsedData.personalInfo.email = emailMatch[0];
    }

    const phoneMatch = line.match(phoneRegex);
    if (phoneMatch && !parsedData.personalInfo.phone) {
      parsedData.personalInfo.phone = phoneMatch[0];
    }

    const linkedinMatch = line.match(linkedinRegex);
    if (linkedinMatch && !parsedData.personalInfo.linkedin) {
      parsedData.personalInfo.linkedin = linkedinMatch[0];
    }

    const websiteMatch = line.match(websiteRegex);
    if (websiteMatch && !parsedData.personalInfo.website && !line.includes('linkedin')) {
      parsedData.personalInfo.website = websiteMatch[0];
    }
  }

  // Extract sections based on common keywords
  let currentSection = '';
  let sectionContent: string[] = [];

  const sectionKeywords = {
    summary: ['summary', 'profile', 'objective', 'about'],
    experience: ['experience', 'employment', 'work history', 'career'],
    education: ['education', 'academic', 'qualifications'],
    skills: ['skills', 'competencies', 'technical skills'],
    languages: ['languages', 'linguistic']
  };

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Check if this line is a section header
    let foundSection = '';
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.some(keyword => lowerLine.includes(keyword) && lowerLine.length < 50)) {
        foundSection = section;
        break;
      }
    }

    if (foundSection) {
      // Process previous section
      if (currentSection && sectionContent.length > 0) {
        processSection(currentSection, sectionContent, parsedData);
      }
      
      currentSection = foundSection;
      sectionContent = [];
    } else if (currentSection) {
      sectionContent.push(line);
    }
  }

  // Process the last section
  if (currentSection && sectionContent.length > 0) {
    processSection(currentSection, sectionContent, parsedData);
  }

  return parsedData;
};

// Process individual sections
const processSection = (section: string, content: string[], parsedData: ParsedCVData) => {
  switch (section) {
    case 'summary':
      parsedData.summary = content.join(' ').slice(0, 300);
      break;

    case 'experience':
      const experiences = extractExperiences(content);
      parsedData.experience = experiences;
      break;

    case 'education':
      const education = extractEducation(content);
      parsedData.education = education;
      break;

    case 'skills':
      const skills = extractSkills(content);
      parsedData.skills = skills;
      break;

    case 'languages':
      const languages = extractLanguages(content);
      parsedData.languages = languages;
      break;
  }
};

// Extract work experiences
const extractExperiences = (content: string[]): ParsedCVData['experience'] => {
  const experiences: ParsedCVData['experience'] = [];
  let currentExp: Partial<ParsedCVData['experience'][0]> = {};

  for (const line of content) {
    // Look for job titles and companies
    if (line.includes('|') || line.includes('-') || line.includes('at ')) {
      if (currentExp.role) {
        experiences.push({
          id: Date.now().toString() + Math.random(),
          company: currentExp.company || '',
          role: currentExp.role || '',
          startDate: currentExp.startDate || '',
          endDate: currentExp.endDate || '',
          current: currentExp.current || false,
          description: currentExp.description || ''
        });
      }

      // Parse new experience entry
      const parts = line.split(/[|\-]|at /);
      currentExp = {
        role: parts[0]?.trim() || '',
        company: parts[1]?.trim() || '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      };
    } else if (line.match(/\d{4}/)) {
      // Extract dates
      const dateMatch = line.match(/(\d{4})\s*-\s*(\d{4}|present|current)/i);
      if (dateMatch) {
        currentExp.startDate = dateMatch[1];
        currentExp.endDate = dateMatch[2].toLowerCase() === 'present' || dateMatch[2].toLowerCase() === 'current' ? '' : dateMatch[2];
        currentExp.current = dateMatch[2].toLowerCase() === 'present' || dateMatch[2].toLowerCase() === 'current';
      }
    } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      // Add to description
      currentExp.description = (currentExp.description || '') + line + '\n';
    }
  }

  // Add the last experience
  if (currentExp.role) {
    experiences.push({
      id: Date.now().toString() + Math.random(),
      company: currentExp.company || '',
      role: currentExp.role || '',
      startDate: currentExp.startDate || '',
      endDate: currentExp.endDate || '',
      current: currentExp.current || false,
      description: currentExp.description || ''
    });
  }

  return experiences;
};

// Extract education information
const extractEducation = (content: string[]): ParsedCVData['education'] => {
  const education: ParsedCVData['education'] = [];
  
  for (const line of content) {
    if (line.length > 10) { // Skip short lines
      const yearMatch = line.match(/\d{4}/);
      education.push({
        id: Date.now().toString() + Math.random(),
        institution: line.split(',')[1]?.trim() || line.split('|')[1]?.trim() || '',
        degree: line.split(',')[0]?.trim() || line.split('|')[0]?.trim() || line,
        year: yearMatch ? yearMatch[0] : '',
        gpa: ''
      });
    }
  }

  return education;
};

// Extract skills
const extractSkills = (content: string[]): ParsedCVData['skills'] => {
  const skills: ParsedCVData['skills'] = [];
  const skillText = content.join(' ');
  
  // Common skill separators
  const skillList = skillText.split(/[,•\-\n]/).map(s => s.trim()).filter(s => s.length > 1);
  
  skillList.forEach(skill => {
    if (skill.length > 1 && skill.length < 50) {
      skills.push({
        id: Date.now().toString() + Math.random(),
        name: skill,
        level: 3 // Default level
      });
    }
  });

  return skills;
};

// Extract languages
const extractLanguages = (content: string[]): ParsedCVData['languages'] => {
  const languages: ParsedCVData['languages'] = [];
  
  for (const line of content) {
    const parts = line.split(/[,\-\(]/).map(p => p.trim());
    if (parts.length >= 1) {
      const proficiency = line.toLowerCase().includes('fluent') ? 'Fluent' :
                         line.toLowerCase().includes('basic') ? 'Basic' : 'Intermediate';
      
      languages.push({
        id: Date.now().toString() + Math.random(),
        name: parts[0],
        proficiency
      });
    }
  }

  return languages;
};

// Main parsing function that combines file extraction and text parsing
export const parseCV = async (file: File): Promise<ParsedCVData> => {
  try {
    const extractedText = await extractTextFromFile(file);
    const parsedData = parseTextToStructuredData(extractedText);
    return parsedData;
  } catch (error) {
    console.error('CV parsing error:', error);
    throw new Error('Failed to parse CV. Please check the file format and try again.');
  }
};

export default {
  parseCV,
  extractTextFromFile,
  parseTextToStructuredData
};