import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';

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
  languages?: Array<{
    id: string;
    name: string;
    proficiency: string;
    written: string;
    spoken: string;
  }>;
}

export interface TemplateStyle {
  primaryColor: [number, number, number];
  secondaryColor: [number, number, number];
  textColor: [number, number, number];
  accentColor: [number, number, number];
  backgroundColor: [number, number, number];
  headerColor: [number, number, number];
  layout: 'modern' | 'classic' | 'professional' | 'creative';
}

const templateStyles: { [key: string]: TemplateStyle } = {
  'classic-ats': {
    primaryColor: [0.1, 0.1, 0.1],
    secondaryColor: [0.4, 0.4, 0.4],
    textColor: [0.2, 0.2, 0.2],
    accentColor: [0.2, 0.4, 0.8],
    backgroundColor: [1, 1, 1],
    headerColor: [0.95, 0.95, 0.95],
    layout: 'professional'
  },
  'modern-minimal': {
    primaryColor: [0.1, 0.1, 0.1],
    secondaryColor: [0.3, 0.3, 0.3],
    textColor: [0.15, 0.15, 0.15],
    accentColor: [0.4, 0.2, 0.8],
    backgroundColor: [1, 1, 1],
    headerColor: [0.4, 0.2, 0.8],
    layout: 'modern'
  },
  'tech-focus': {
    primaryColor: [0, 0.3, 0.6],
    secondaryColor: [0.2, 0.5, 0.8],
    textColor: [0.1, 0.1, 0.1],
    accentColor: [0, 0.6, 0.4],
    backgroundColor: [1, 1, 1],
    headerColor: [0, 0.3, 0.6],
    layout: 'modern'
  },
  'leadership': {
    primaryColor: [0.1, 0.1, 0.1],
    secondaryColor: [0.3, 0.3, 0.3],
    textColor: [0, 0, 0],
    accentColor: [0.6, 0.4, 0.2],
    backgroundColor: [1, 1, 1],
    headerColor: [0.6, 0.4, 0.2],
    layout: 'professional'
  }
};

export class PDFGenerator {
  private doc: PDFDocument;
  private currentPage: any;
  private currentY: number;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private style: TemplateStyle;
  private fonts: any = {};
  private lineHeight: number = 16;
  private sectionSpacing: number = 24;
  private itemSpacing: number = 16;

  constructor() {
    this.pageWidth = 595.28; // A4 width in points
    this.pageHeight = 841.89; // A4 height in points
    this.margin = 60;
    this.style = templateStyles['classic-ats'];
    this.currentY = this.pageHeight - this.margin;
  }

  async initialize(templateId: string = 'classic-ats') {
    this.doc = await PDFDocument.create();
    this.style = templateStyles[templateId] || templateStyles['classic-ats'];
    
    // Load fonts
    this.fonts.regular = await this.doc.embedFont(StandardFonts.Helvetica);
    this.fonts.bold = await this.doc.embedFont(StandardFonts.HelveticaBold);
    this.fonts.italic = await this.doc.embedFont(StandardFonts.HelveticaOblique);
    
    // Create first page
    this.addPage();
  }

  private addPage() {
    this.currentPage = this.doc.addPage([this.pageWidth, this.pageHeight]);
    this.currentY = this.pageHeight - this.margin;
    return this.currentPage;
  }

  private checkPageSpace(requiredSpace: number) {
    if (this.currentY - requiredSpace < this.margin + 50) {
      this.addPage();
    }
  }

  private moveDown(space: number = this.lineHeight) {
    this.currentY -= space;
    this.checkPageSpace(60);
  }

  private cleanText(text: string): string {
    if (!text) return '';
    // Remove problematic characters and normalize text
    return text
      .replace(/[^\x20-\x7E\n\u00A0-\u017F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
    const cleanedText = this.cleanText(text);
    const words = cleanedText.split(/\s+/);
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
          // Word is too long, break it
          lines.push(word);
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  private drawText(text: string, x: number, options: any = {}) {
    const {
      font = this.fonts.regular,
      size = 11,
      color = this.style.textColor,
      maxWidth = this.pageWidth - 2 * this.margin,
      indent = 0,
      align = 'left'
    } = options;

    if (!text || text.trim() === '') return this.currentY;

    const cleanText = this.cleanText(text);
    const lines = this.wrapText(cleanText, font, size, maxWidth - indent);

    for (const line of lines) {
      this.checkPageSpace(size + 8);
      
      let textX = x + indent;
      if (align === 'center') {
        const textWidth = font.widthOfTextAtSize(line, size);
        textX = (this.pageWidth - textWidth) / 2;
      }
      
      this.currentPage.drawText(line, {
        x: textX,
        y: this.currentY,
        size,
        font,
        color: rgb(color[0], color[1], color[2])
      });
      
      this.moveDown(size + 4);
    }

    return this.currentY;
  }

  private drawSectionHeader(title: string) {
    this.checkPageSpace(50);
    this.moveDown(this.sectionSpacing);
    
    // Draw section title
    this.drawText(title.toUpperCase(), this.margin, {
      font: this.fonts.bold,
      size: 14,
      color: this.style.accentColor
    });

    // Draw underline
    this.currentPage.drawLine({
      start: { x: this.margin, y: this.currentY + 10 },
      end: { x: this.pageWidth - this.margin, y: this.currentY + 10 },
      thickness: 2,
      color: rgb(this.style.accentColor[0], this.style.accentColor[1], this.style.accentColor[2])
    });

    this.moveDown(12);
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      // Handle various date formats
      if (dateString.includes('/')) {
        const [month, year] = dateString.split('/');
        return `${month}/${year}`;
      }
      if (dateString.includes('-')) {
        const [year, month] = dateString.split('-');
        return `${month}/${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  }

  private formatBulletPoints(text: string): string[] {
    if (!text) return [];
    
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        if (!line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
          return `• ${line}`;
        }
        return line.replace(/^[\-\*]\s*/, '• ');
      });
  }

  async generatePDF(cvData: CVData, templateId: string = 'classic-ats'): Promise<Uint8Array> {
    await this.initialize(templateId);

    try {
      // Header Section
      this.drawHeader(cvData.personalInfo);

      // Professional Summary
      if (cvData.summary && cvData.summary.trim()) {
        this.drawSummary(cvData.summary);
      }

      // Professional Experience
      if (cvData.experience && cvData.experience.length > 0) {
        this.drawExperience(cvData.experience);
      }

      // Skills
      if (cvData.skills && cvData.skills.length > 0) {
        this.drawSkills(cvData.skills);
      }

      // Projects
      if (cvData.projects && cvData.projects.length > 0) {
        this.drawProjects(cvData.projects);
      }

      // Education
      if (cvData.education && cvData.education.length > 0) {
        this.drawEducation(cvData.education);
      }

      // Certifications
      if (cvData.certifications && cvData.certifications.length > 0) {
        this.drawCertifications(cvData.certifications);
      }

      // Languages
      if (cvData.languages && cvData.languages.length > 0) {
        this.drawLanguages(cvData.languages);
      }

      return await this.doc.save();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error('Failed to generate PDF. Please check your data and try again.');
    }
  }

  private drawHeader(personalInfo: any) {
    this.checkPageSpace(120);

    // Name
    if (personalInfo.fullName) {
      this.drawText(personalInfo.fullName, this.margin, {
        font: this.fonts.bold,
        size: 28,
        color: this.style.primaryColor,
        align: 'center'
      });
      this.moveDown(8);
    }

    // Title
    if (personalInfo.title) {
      this.drawText(personalInfo.title, this.margin, {
        font: this.fonts.regular,
        size: 16,
        color: this.style.accentColor,
        align: 'center'
      });
      this.moveDown(20);
    }

    // Contact Information
    const contactInfo = [];
    if (personalInfo.email) contactInfo.push(`Email: ${personalInfo.email}`);
    if (personalInfo.phone) contactInfo.push(`Phone: ${personalInfo.phone}`);
    if (personalInfo.location) contactInfo.push(`Location: ${personalInfo.location}`);
    if (personalInfo.linkedin) contactInfo.push(`LinkedIn: ${personalInfo.linkedin}`);

    if (contactInfo.length > 0) {
      // Draw contact info in a centered block
      for (const contact of contactInfo) {
        this.drawText(contact, this.margin, {
          font: this.fonts.regular,
          size: 10,
          color: this.style.secondaryColor,
          align: 'center'
        });
      }
      this.moveDown(20);
    }

    // Draw separator line
    this.currentPage.drawLine({
      start: { x: this.margin, y: this.currentY },
      end: { x: this.pageWidth - this.margin, y: this.currentY },
      thickness: 1,
      color: rgb(this.style.accentColor[0], this.style.accentColor[1], this.style.accentColor[2])
    });
    this.moveDown(20);
  }

  private drawSummary(summary: string) {
    this.drawSectionHeader('Professional Summary');
    
    this.drawText(summary, this.margin, {
      size: 11,
      color: this.style.textColor,
      maxWidth: this.pageWidth - 2 * this.margin
    });
    
    this.moveDown(10);
  }

  private drawExperience(experience: any[]) {
    this.drawSectionHeader('Professional Experience');

    for (let i = 0; i < experience.length; i++) {
      const exp = experience[i];
      this.checkPageSpace(100);

      // Job title
      if (exp.title) {
        this.drawText(exp.title, this.margin, {
          font: this.fonts.bold,
          size: 13,
          color: this.style.primaryColor
        });
      }

      // Company
      if (exp.company) {
        this.drawText(exp.company, this.margin, {
          font: this.fonts.bold,
          size: 12,
          color: this.style.accentColor
        });
      }

      // Location and dates
      const locationParts = [];
      if (exp.location) locationParts.push(exp.location);
      
      const dateRange = exp.current 
        ? `${this.formatDate(exp.startDate)} - Present`
        : `${this.formatDate(exp.startDate)} - ${this.formatDate(exp.endDate)}`;
      
      if (dateRange.trim() !== ' - ') locationParts.push(dateRange);
      
      if (locationParts.length > 0) {
        this.drawText(locationParts.join(' | '), this.margin, {
          font: this.fonts.italic,
          size: 10,
          color: this.style.secondaryColor
        });
      }

      // Description
      if (exp.description && exp.description.trim()) {
        this.moveDown(6);
        const bulletPoints = this.formatBulletPoints(exp.description);
        for (const bullet of bulletPoints) {
          this.drawText(bullet, this.margin, {
            size: 10,
            indent: 20,
            color: this.style.textColor
          });
        }
      }

      if (i < experience.length - 1) {
        this.moveDown(this.itemSpacing);
      }
    }
  }

  private drawSkills(skills: any[]) {
    this.drawSectionHeader('Skills & Competencies');

    // Group skills by category
    const skillsByCategory: { [key: string]: any[] } = {};
    skills.forEach(skill => {
      const category = skill.category || 'Technical Skills';
      if (!skillsByCategory[category]) {
        skillsByCategory[category] = [];
      }
      skillsByCategory[category].push(skill);
    });

    for (const [category, skillList] of Object.entries(skillsByCategory)) {
      this.checkPageSpace(40);

      // Category header
      this.drawText(`${category}:`, this.margin, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.accentColor
      });

      // Skills in a readable format
      const skillNames = skillList.map(skill => skill.name).join(' • ');
      this.drawText(skillNames, this.margin, {
        size: 10,
        indent: 20,
        color: this.style.textColor
      });

      this.moveDown(12);
    }
  }

  private drawProjects(projects: any[]) {
    this.drawSectionHeader('Key Projects');

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      this.checkPageSpace(80);

      // Project name
      if (project.name) {
        this.drawText(project.name, this.margin, {
          font: this.fonts.bold,
          size: 12,
          color: this.style.primaryColor
        });
      }

      // Technologies
      if (project.technologies && project.technologies.length > 0) {
        const techText = `Technologies: ${project.technologies.join(', ')}`;
        this.drawText(techText, this.margin, {
          font: this.fonts.italic,
          size: 10,
          color: this.style.accentColor,
          indent: 15
        });
      }

      // Description
      if (project.description) {
        this.drawText(project.description, this.margin, {
          size: 10,
          indent: 15,
          color: this.style.textColor
        });
      }

      // Link
      if (project.link) {
        this.drawText(`Project Link: ${project.link}`, this.margin, {
          size: 9,
          color: this.style.accentColor,
          indent: 15
        });
      }

      if (i < projects.length - 1) {
        this.moveDown(this.itemSpacing);
      }
    }
  }

  private drawEducation(education: any[]) {
    this.drawSectionHeader('Education');

    for (let i = 0; i < education.length; i++) {
      const edu = education[i];
      this.checkPageSpace(60);

      // Degree
      if (edu.degree) {
        this.drawText(edu.degree, this.margin, {
          font: this.fonts.bold,
          size: 12,
          color: this.style.primaryColor
        });
      }

      // School
      if (edu.school) {
        this.drawText(edu.school, this.margin, {
          font: this.fonts.regular,
          size: 11,
          color: this.style.accentColor
        });
      }

      // Location and date
      const eduDetails = [];
      if (edu.location) eduDetails.push(edu.location);
      if (edu.graduationDate) eduDetails.push(this.formatDate(edu.graduationDate));
      
      if (eduDetails.length > 0) {
        this.drawText(eduDetails.join(' | '), this.margin, {
          font: this.fonts.italic,
          size: 10,
          color: this.style.secondaryColor
        });
      }

      // GPA
      if (edu.gpa) {
        this.drawText(`GPA: ${edu.gpa}`, this.margin, {
          size: 10,
          color: this.style.textColor,
          indent: 15
        });
      }

      if (i < education.length - 1) {
        this.moveDown(this.itemSpacing);
      }
    }
  }

  private drawCertifications(certifications: any[]) {
    this.drawSectionHeader('Certifications');

    for (let i = 0; i < certifications.length; i++) {
      const cert = certifications[i];
      this.checkPageSpace(50);

      // Certification name
      if (cert.name) {
        this.drawText(cert.name, this.margin, {
          font: this.fonts.bold,
          size: 11,
          color: this.style.primaryColor
        });
      }

      // Issuer and date
      const certDetails = [];
      if (cert.issuer) certDetails.push(`Issued by: ${cert.issuer}`);
      if (cert.date) certDetails.push(`Date: ${this.formatDate(cert.date)}`);
      
      if (certDetails.length > 0) {
        this.drawText(certDetails.join(' | '), this.margin, {
          size: 10,
          color: this.style.secondaryColor,
          indent: 15
        });
      }

      if (i < certifications.length - 1) {
        this.moveDown(this.itemSpacing);
      }
    }
  }

  private drawLanguages(languages: any[]) {
    this.drawSectionHeader('Languages');

    for (let i = 0; i < languages.length; i++) {
      const lang = languages[i];
      this.checkPageSpace(40);

      // Language name
      if (lang.name) {
        this.drawText(lang.name, this.margin, {
          font: this.fonts.bold,
          size: 11,
          color: this.style.primaryColor
        });
      }

      // Proficiency levels
      const proficiencyParts = [];
      if (lang.proficiency) proficiencyParts.push(`Overall: ${lang.proficiency}`);
      if (lang.written) proficiencyParts.push(`Written: ${lang.written}`);
      if (lang.spoken) proficiencyParts.push(`Spoken: ${lang.spoken}`);
      
      if (proficiencyParts.length > 0) {
        this.drawText(proficiencyParts.join(' | '), this.margin, {
          size: 10,
          color: this.style.secondaryColor,
          indent: 15
        });
      }

      if (i < languages.length - 1) {
        this.moveDown(this.itemSpacing);
      }
    }
  }
}

// Main function to generate PDF
export async function generateCVPDF(cvData: CVData, templateId: string = 'classic-ats'): Promise<Uint8Array> {
  try {
    const generator = new PDFGenerator();
    return await generator.generatePDF(cvData, templateId);
  } catch (error) {
    console.error('PDF Generation failed:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

// Function to trigger PDF download
export function downloadPDF(pdfBytes: Uint8Array, filename: string) {
  try {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Download error:', error);
    throw new Error('Failed to download PDF. Please try again.');
  }
}