import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface CVData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: number;
    category: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    verificationLink?: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: string;
  }>;
}

export interface TemplateStyle {
  primaryColor: [number, number, number];
  secondaryColor: [number, number, number];
  textColor: [number, number, number];
  accentColor: [number, number, number];
  layout: 'classic' | 'modern' | 'minimal' | 'executive';
}

const templateStyles: { [key: string]: TemplateStyle } = {
  'classic-ats': {
    primaryColor: [0.2, 0.2, 0.2],
    secondaryColor: [0.4, 0.4, 0.4],
    textColor: [0, 0, 0],
    accentColor: [0.2, 0.4, 0.8],
    layout: 'classic'
  },
  'modern-minimal': {
    primaryColor: [0.1, 0.1, 0.1],
    secondaryColor: [0.3, 0.3, 0.3],
    textColor: [0.2, 0.2, 0.2],
    accentColor: [0.4, 0.2, 0.8],
    layout: 'modern'
  },
  'tech-focus': {
    primaryColor: [0, 0.3, 0.6],
    secondaryColor: [0.2, 0.5, 0.8],
    textColor: [0.1, 0.1, 0.1],
    accentColor: [0, 0.6, 0.4],
    layout: 'minimal'
  },
  'executive': {
    primaryColor: [0.1, 0.1, 0.1],
    secondaryColor: [0.3, 0.3, 0.3],
    textColor: [0, 0, 0],
    accentColor: [0.6, 0.4, 0.2],
    layout: 'executive'
  }
};

export class PDFGenerator {
  private doc: PDFDocument;
  private currentY: number;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private style: TemplateStyle;
  private fonts: any = {};

  constructor() {
    this.currentY = 0;
    this.pageWidth = 595.28; // A4 width in points
    this.pageHeight = 841.89; // A4 height in points
    this.margin = 50;
    this.style = templateStyles['classic-ats'];
  }

  async initialize(templateId: string = 'classic-ats') {
    this.doc = await PDFDocument.create();
    this.style = templateStyles[templateId] || templateStyles['classic-ats'];
    
    // Load fonts
    this.fonts.regular = await this.doc.embedFont(StandardFonts.Helvetica);
    this.fonts.bold = await this.doc.embedFont(StandardFonts.HelveticaBold);
    this.fonts.italic = await this.doc.embedFont(StandardFonts.HelveticaOblique);
  }

  private addPage() {
    const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    this.currentY = this.pageHeight - this.margin;
    return page;
  }

  private checkPageSpace(requiredSpace: number) {
    if (this.currentY - requiredSpace < this.margin) {
      this.addPage();
    }
  }

  private drawText(page: any, text: string, x: number, y: number, options: any = {}) {
    const {
      font = this.fonts.regular,
      size = 10,
      color = this.style.textColor,
      maxWidth = this.pageWidth - 2 * this.margin
    } = options;

    // Handle text wrapping
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, size);
      
      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    // Draw each line
    let lineY = y;
    for (const line of lines) {
      page.drawText(line, {
        x,
        y: lineY,
        size,
        font,
        color: rgb(color[0], color[1], color[2])
      });
      lineY -= size + 2;
    }

    return lineY - 5; // Return the Y position after the text
  }

  private drawSectionHeader(page: any, title: string) {
    this.checkPageSpace(30);
    
    // Draw section line
    page.drawLine({
      start: { x: this.margin, y: this.currentY - 5 },
      end: { x: this.pageWidth - this.margin, y: this.currentY - 5 },
      thickness: 1,
      color: rgb(this.style.accentColor[0], this.style.accentColor[1], this.style.accentColor[2])
    });

    // Draw section title
    this.currentY = this.drawText(page, title.toUpperCase(), this.margin, this.currentY - 15, {
      font: this.fonts.bold,
      size: 12,
      color: this.style.primaryColor
    });

    this.currentY -= 10;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  }

  private cleanText(text: string): string {
    return text
      .replace(/[•\-\*]\s*/g, '• ') // Normalize bullet points
      .replace(/\n\s*\n/g, '\n') // Remove extra line breaks
      .trim();
  }

  async generatePDF(cvData: CVData, templateId: string = 'classic-ats'): Promise<Uint8Array> {
    await this.initialize(templateId);
    const page = this.addPage();

    // Header Section
    this.drawHeader(page, cvData.personalInfo);

    // Professional Summary
    if (cvData.summary) {
      this.drawSummary(page, cvData.summary);
    }

    // Experience Section
    if (cvData.experience.length > 0) {
      this.drawExperience(page, cvData.experience);
    }

    // Education Section
    if (cvData.education.length > 0) {
      this.drawEducation(page, cvData.education);
    }

    // Skills Section
    if (cvData.skills.length > 0) {
      this.drawSkills(page, cvData.skills);
    }

    // Projects Section
    if (cvData.projects.length > 0) {
      this.drawProjects(page, cvData.projects);
    }

    // Certifications Section
    if (cvData.certifications.length > 0) {
      this.drawCertifications(page, cvData.certifications);
    }

    // Languages Section
    if (cvData.languages.length > 0) {
      this.drawLanguages(page, cvData.languages);
    }

    return await this.doc.save();
  }

  private drawHeader(page: any, personalInfo: any) {
    // Name
    this.currentY = this.drawText(page, personalInfo.fullName, this.margin, this.currentY, {
      font: this.fonts.bold,
      size: 20,
      color: this.style.primaryColor
    });

    // Title
    if (personalInfo.title) {
      this.currentY = this.drawText(page, personalInfo.title, this.margin, this.currentY - 5, {
        font: this.fonts.regular,
        size: 14,
        color: this.style.secondaryColor
      });
    }

    // Contact Information
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
      personalInfo.website
    ].filter(Boolean).join(' | ');

    if (contactInfo) {
      this.currentY = this.drawText(page, contactInfo, this.margin, this.currentY - 10, {
        size: 9,
        color: this.style.secondaryColor
      });
    }

    this.currentY -= 20;
  }

  private drawSummary(page: any, summary: string) {
    this.drawSectionHeader(page, 'Professional Summary');
    this.currentY = this.drawText(page, this.cleanText(summary), this.margin, this.currentY, {
      size: 10
    });
    this.currentY -= 15;
  }

  private drawExperience(page: any, experience: any[]) {
    this.drawSectionHeader(page, 'Professional Experience');

    for (const exp of experience) {
      this.checkPageSpace(80);

      // Job title and company
      const titleLine = `${exp.title} | ${exp.company}`;
      this.currentY = this.drawText(page, titleLine, this.margin, this.currentY, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.primaryColor
      });

      // Location and dates
      const dateRange = exp.current 
        ? `${this.formatDate(exp.startDate)} - Present`
        : `${this.formatDate(exp.startDate)} - ${this.formatDate(exp.endDate)}`;
      
      const locationDate = [exp.location, dateRange].filter(Boolean).join(' | ');
      this.currentY = this.drawText(page, locationDate, this.margin, this.currentY - 5, {
        size: 9,
        color: this.style.secondaryColor
      });

      // Description
      if (exp.description) {
        this.currentY = this.drawText(page, this.cleanText(exp.description), this.margin, this.currentY - 5, {
          size: 10
        });
      }

      this.currentY -= 15;
    }
  }

  private drawEducation(page: any, education: any[]) {
    this.drawSectionHeader(page, 'Education');

    for (const edu of education) {
      this.checkPageSpace(50);

      // Degree and school
      const degreeLine = `${edu.degree} | ${edu.school}`;
      this.currentY = this.drawText(page, degreeLine, this.margin, this.currentY, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.primaryColor
      });

      // Location and graduation date
      const locationDate = [edu.location, this.formatDate(edu.graduationDate)].filter(Boolean).join(' | ');
      if (locationDate) {
        this.currentY = this.drawText(page, locationDate, this.margin, this.currentY - 5, {
          size: 9,
          color: this.style.secondaryColor
        });
      }

      // GPA if provided
      if (edu.gpa) {
        this.currentY = this.drawText(page, `GPA: ${edu.gpa}`, this.margin, this.currentY - 5, {
          size: 9
        });
      }

      this.currentY -= 15;
    }
  }

  private drawSkills(page: any, skills: any[]) {
    this.drawSectionHeader(page, 'Skills');

    // Group skills by category
    const skillsByCategory: { [key: string]: string[] } = {};
    skills.forEach(skill => {
      const category = skill.category || 'General';
      if (!skillsByCategory[category]) {
        skillsByCategory[category] = [];
      }
      skillsByCategory[category].push(skill.name);
    });

    for (const [category, skillList] of Object.entries(skillsByCategory)) {
      this.checkPageSpace(30);

      // Category header
      this.currentY = this.drawText(page, `${category}:`, this.margin, this.currentY, {
        font: this.fonts.bold,
        size: 10,
        color: this.style.primaryColor
      });

      // Skills list
      const skillsText = skillList.join(' • ');
      this.currentY = this.drawText(page, skillsText, this.margin + 80, this.currentY + 12, {
        size: 10,
        maxWidth: this.pageWidth - this.margin - 100
      });

      this.currentY -= 10;
    }

    this.currentY -= 5;
  }

  private drawProjects(page: any, projects: any[]) {
    this.drawSectionHeader(page, 'Projects');

    for (const project of projects) {
      this.checkPageSpace(60);

      // Project name
      this.currentY = this.drawText(page, project.name, this.margin, this.currentY, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.primaryColor
      });

      // Technologies
      if (project.technologies && project.technologies.length > 0) {
        const techText = `Technologies: ${project.technologies.join(', ')}`;
        this.currentY = this.drawText(page, techText, this.margin, this.currentY - 5, {
          size: 9,
          color: this.style.secondaryColor
        });
      }

      // Description
      if (project.description) {
        this.currentY = this.drawText(page, this.cleanText(project.description), this.margin, this.currentY - 5, {
          size: 10
        });
      }

      // Link
      if (project.link) {
        this.currentY = this.drawText(page, `Link: ${project.link}`, this.margin, this.currentY - 5, {
          size: 9,
          color: this.style.accentColor
        });
      }

      this.currentY -= 15;
    }
  }

  private drawCertifications(page: any, certifications: any[]) {
    this.drawSectionHeader(page, 'Certifications');

    for (const cert of certifications) {
      this.checkPageSpace(40);

      // Certification name and issuer
      const certLine = `${cert.name} | ${cert.issuer}`;
      this.currentY = this.drawText(page, certLine, this.margin, this.currentY, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.primaryColor
      });

      // Date
      if (cert.date) {
        this.currentY = this.drawText(page, this.formatDate(cert.date), this.margin, this.currentY - 5, {
          size: 9,
          color: this.style.secondaryColor
        });
      }

      this.currentY -= 15;
    }
  }

  private drawLanguages(page: any, languages: any[]) {
    this.drawSectionHeader(page, 'Languages');

    const languageList = languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ');
    this.currentY = this.drawText(page, languageList, this.margin, this.currentY, {
      size: 10
    });

    this.currentY -= 15;
  }
}

// Main function to generate PDF
export async function generateCVPDF(cvData: CVData, templateId: string = 'classic-ats'): Promise<Uint8Array> {
  const generator = new PDFGenerator();
  return await generator.generatePDF(cvData, templateId);
}

// Function to trigger PDF download
export function downloadPDF(pdfBytes: Uint8Array, filename: string) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}