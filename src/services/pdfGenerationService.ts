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
    backgroundColor: [0.98, 0.98, 0.98],
    headerColor: [0.4, 0.2, 0.8],
    layout: 'modern'
  },
  'tech-focus': {
    primaryColor: [0, 0.3, 0.6],
    secondaryColor: [0.2, 0.5, 0.8],
    textColor: [0.1, 0.1, 0.1],
    accentColor: [0, 0.6, 0.4],
    backgroundColor: [0.97, 0.99, 1],
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
  private lineHeight: number = 14;
  private sectionSpacing: number = 20;
  private itemSpacing: number = 12;

  constructor() {
    this.pageWidth = 595.28; // A4 width in points
    this.pageHeight = 841.89; // A4 height in points
    this.margin = 50;
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
    this.fonts.boldItalic = await this.doc.embedFont(StandardFonts.HelveticaBoldOblique);
    
    // Create first page
    this.addPage();
  }

  private addPage() {
    this.currentPage = this.doc.addPage([this.pageWidth, this.pageHeight]);
    this.currentY = this.pageHeight - this.margin;
    
    // Add subtle background
    this.currentPage.drawRectangle({
      x: 0,
      y: 0,
      width: this.pageWidth,
      height: this.pageHeight,
      color: rgb(this.style.backgroundColor[0], this.style.backgroundColor[1], this.style.backgroundColor[2])
    });
    
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

  private drawText(text: string, x: number, options: any = {}) {
    const {
      font = this.fonts.regular,
      size = 10,
      color = this.style.textColor,
      maxWidth = this.pageWidth - 2 * this.margin,
      indent = 0,
      align = 'left'
    } = options;

    if (!text || text.trim() === '') return this.currentY;

    const cleanText = text.replace(/[^\x20-\x7E\n\u00A0-\u017F\u0100-\u024F]/g, ' ').trim();
    const lines = this.wrapText(cleanText, font, size, maxWidth - indent);

    for (const line of lines) {
      this.checkPageSpace(size + 6);
      
      let textX = x + indent;
      if (align === 'center') {
        const textWidth = font.widthOfTextAtSize(line, size);
        textX = (this.pageWidth - textWidth) / 2;
      } else if (align === 'right') {
        const textWidth = font.widthOfTextAtSize(line, size);
        textX = this.pageWidth - this.margin - textWidth;
      }
      
      this.currentPage.drawText(line, {
        x: textX,
        y: this.currentY,
        size,
        font,
        color: rgb(color[0], color[1], color[2])
      });
      
      this.moveDown(size + 3);
    }

    return this.currentY;
  }

  private wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
    const words = text.split(/\s+/);
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

  private drawSectionHeader(title: string) {
    this.checkPageSpace(40);
    this.moveDown(this.sectionSpacing);
    
    // Draw section background
    this.currentPage.drawRectangle({
      x: this.margin - 5,
      y: this.currentY - 5,
      width: this.pageWidth - 2 * this.margin + 10,
      height: 25,
      color: rgb(this.style.accentColor[0], this.style.accentColor[1], this.style.accentColor[2]),
      opacity: 0.1
    });

    // Draw section title
    this.drawText(title.toUpperCase(), this.margin, {
      font: this.fonts.bold,
      size: 12,
      color: this.style.accentColor
    });

    // Draw underline
    this.currentPage.drawLine({
      start: { x: this.margin, y: this.currentY + 8 },
      end: { x: this.pageWidth - this.margin, y: this.currentY + 8 },
      thickness: 1,
      color: rgb(this.style.accentColor[0], this.style.accentColor[1], this.style.accentColor[2])
    });

    this.moveDown(8);
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

  private formatBulletPoints(text: string): string[] {
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
    this.checkPageSpace(100);

    // Header background
    this.currentPage.drawRectangle({
      x: 0,
      y: this.currentY - 15,
      width: this.pageWidth,
      height: 70,
      color: rgb(this.style.headerColor[0], this.style.headerColor[1], this.style.headerColor[2]),
      opacity: this.style.layout === 'modern' ? 1 : 0.1
    });

    // Name
    if (personalInfo.fullName) {
      this.drawText(personalInfo.fullName, this.margin, {
        font: this.fonts.bold,
        size: 24,
        color: this.style.layout === 'modern' ? [1, 1, 1] : this.style.primaryColor,
        align: 'center'
      });
      this.moveDown(6);
    }

    // Title
    if (personalInfo.title) {
      this.drawText(personalInfo.title, this.margin, {
        font: this.fonts.regular,
        size: 14,
        color: this.style.layout === 'modern' ? [0.9, 0.9, 0.9] : this.style.accentColor,
        align: 'center'
      });
      this.moveDown(15);
    }

    // Contact Information
    const contactInfo = [];
    if (personalInfo.email) contactInfo.push(personalInfo.email);
    if (personalInfo.phone) contactInfo.push(personalInfo.phone);
    if (personalInfo.location) contactInfo.push(personalInfo.location);
    if (personalInfo.linkedin) contactInfo.push(personalInfo.linkedin);

    if (contactInfo.length > 0) {
      const contactText = contactInfo.join(' | ');
      this.drawText(contactText, this.margin, {
        font: this.fonts.regular,
        size: 9,
        color: this.style.layout === 'modern' ? [0.8, 0.8, 0.8] : this.style.secondaryColor,
        align: 'center'
      });
      this.moveDown(20);
    }
  }

  private drawSummary(summary: string) {
    this.drawSectionHeader('Professional Summary');
    
    // Summary box
    const summaryLines = this.wrapText(summary, this.fonts.regular, 11, this.pageWidth - 2 * this.margin - 20);
    const boxHeight = summaryLines.length * 14 + 20;
    
    this.currentPage.drawRectangle({
      x: this.margin - 10,
      y: this.currentY - boxHeight + 10,
      width: this.pageWidth - 2 * this.margin + 20,
      height: boxHeight,
      color: rgb(0.97, 0.97, 0.97),
      borderColor: rgb(this.style.accentColor[0], this.style.accentColor[1], this.style.accentColor[2]),
      borderWidth: 1,
      opacity: 0.8
    });

    this.drawText(summary, this.margin, {
      size: 11,
      color: this.style.textColor,
      indent: 10
    });
  }

  private drawExperience(experience: any[]) {
    this.drawSectionHeader('Professional Experience');

    for (let i = 0; i < experience.length; i++) {
      const exp = experience[i];
      this.checkPageSpace(80);

      // Job title and company
      this.drawText(exp.title || 'Position', this.margin, {
        font: this.fonts.bold,
        size: 12,
        color: this.style.primaryColor
      });

      this.drawText(exp.company || 'Company', this.margin, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.accentColor
      });

      // Location and dates
      const dateRange = exp.current 
        ? `${this.formatDate(exp.startDate)} - Present`
        : `${this.formatDate(exp.startDate)} - ${this.formatDate(exp.endDate)}`;
      
      const locationDate = [exp.location, dateRange].filter(Boolean).join(' | ');
      if (locationDate) {
        this.drawText(locationDate, this.margin, {
          font: this.fonts.italic,
          size: 9,
          color: this.style.secondaryColor
        });
      }

      // Description
      if (exp.description && exp.description.trim()) {
        this.moveDown(4);
        const bulletPoints = this.formatBulletPoints(exp.description);
        for (const bullet of bulletPoints) {
          this.drawText(bullet, this.margin, {
            size: 10,
            indent: 15,
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
      const category = skill.category || 'Technical';
      if (!skillsByCategory[category]) {
        skillsByCategory[category] = [];
      }
      skillsByCategory[category].push(skill);
    });

    for (const [category, skillList] of Object.entries(skillsByCategory)) {
      this.checkPageSpace(30);

      // Category header
      this.drawText(`${category}:`, this.margin, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.accentColor
      });

      // Skills in rows
      const skillNames = skillList.map(skill => skill.name).join(' • ');
      this.drawText(skillNames, this.margin, {
        size: 10,
        indent: 15,
        color: this.style.textColor
      });

      this.moveDown(8);
    }
  }

  private drawProjects(projects: any[]) {
    this.drawSectionHeader('Key Projects');

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      this.checkPageSpace(60);

      // Project name
      this.drawText(project.name || 'Project', this.margin, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.primaryColor
      });

      // Technologies
      if (project.technologies && project.technologies.length > 0) {
        const techText = `Technologies: ${project.technologies.join(', ')}`;
        this.drawText(techText, this.margin, {
          font: this.fonts.italic,
          size: 9,
          color: this.style.accentColor,
          indent: 10
        });
      }

      // Description
      if (project.description) {
        this.drawText(project.description, this.margin, {
          size: 10,
          indent: 10,
          color: this.style.textColor
        });
      }

      // Link
      if (project.link) {
        this.drawText(`Link: ${project.link}`, this.margin, {
          size: 9,
          color: this.style.accentColor,
          indent: 10
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
      this.checkPageSpace(50);

      // Degree
      this.drawText(edu.degree || 'Degree', this.margin, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.primaryColor
      });

      // School
      this.drawText(edu.school || 'Institution', this.margin, {
        font: this.fonts.regular,
        size: 10,
        color: this.style.accentColor
      });

      // Location and date
      const locationDate = [edu.location, this.formatDate(edu.graduationDate)].filter(Boolean).join(' | ');
      if (locationDate) {
        this.drawText(locationDate, this.margin, {
          font: this.fonts.italic,
          size: 9,
          color: this.style.secondaryColor
        });
      }

      // GPA
      if (edu.gpa) {
        this.drawText(`GPA: ${edu.gpa}`, this.margin, {
          size: 9,
          color: this.style.textColor,
          indent: 10
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
      this.checkPageSpace(40);

      // Certification name and issuer
      const certLine = `${cert.name || 'Certification'} - ${cert.issuer || 'Issuer'}`;
      this.drawText(certLine, this.margin, {
        font: this.fonts.bold,
        size: 10,
        color: this.style.primaryColor
      });

      // Date
      if (cert.date) {
        this.drawText(`Issued: ${this.formatDate(cert.date)}`, this.margin, {
          size: 9,
          color: this.style.secondaryColor,
          indent: 10
        });
      }

      if (i < certifications.length - 1) {
        this.moveDown(this.itemSpacing);
      }
    }
  }

  private drawLanguages(languages: any[]) {
    this.drawSectionHeader('Languages');

    const languageTexts = languages.map(lang => 
      `${lang.name} (${lang.proficiency})`
    ).join(' • ');
    
    this.drawText(languageTexts, this.margin, {
      size: 10,
      color: this.style.textColor
    });
  }
}

// Main function to generate PDF
export async function generateCVPDF(cvData: CVData, templateId: string = 'classic-ats'): Promise<Uint8Array> {
  const generator = new PDFGenerator();
  return await generator.generatePDF(cvData, templateId);
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