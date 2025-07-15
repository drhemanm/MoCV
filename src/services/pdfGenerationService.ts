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
  'leadership': {
    primaryColor: [0.1, 0.1, 0.1],
    secondaryColor: [0.3, 0.3, 0.3],
    textColor: [0, 0, 0],
    accentColor: [0.6, 0.4, 0.2],
    layout: 'executive'
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
    this.currentY = this.pageHeight - this.margin; // Start from top
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
    this.currentY = this.pageHeight - this.margin; // Reset to top of new page
    return this.currentPage;
  }

  private checkPageSpace(requiredSpace: number) {
    if (this.currentY - requiredSpace < this.margin + 50) { // Leave more space at bottom
      this.addPage();
    }
  }

  private moveDown(space: number = this.lineHeight) {
    this.currentY -= space;
    this.checkPageSpace(50); // Check if we need a new page
  }

  private drawText(text: string, x: number, options: any = {}) {
    const {
      font = this.fonts.regular,
      size = 10,
      color = this.style.textColor,
      maxWidth = this.pageWidth - 2 * this.margin,
      indent = 0
    } = options;

    if (!text || text.trim() === '') return this.currentY;

    // Clean and prepare text
    const cleanText = text.replace(/[^\x20-\x7E\n]/g, ' ').trim();
    
    // Handle text wrapping
    const words = cleanText.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, size);
      
      if (textWidth <= maxWidth - indent) {
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

    // Draw each line with proper Y positioning
    for (const line of lines) {
      this.checkPageSpace(size + 5);
      
      this.currentPage.drawText(line, {
        x: x + indent,
        y: this.currentY,
        size,
        font,
        color: rgb(color[0], color[1], color[2])
      });
      
      this.moveDown(size + 3); // Move down for next line
    }

    return this.currentY;
  }

  private drawSectionHeader(title: string) {
    this.checkPageSpace(40);
    
    // Add extra space before section
    this.moveDown(this.sectionSpacing);
    
    // Draw section line
    this.currentPage.drawLine({
      start: { x: this.margin, y: this.currentY + 5 },
      end: { x: this.pageWidth - this.margin, y: this.currentY + 5 },
      thickness: 1,
      color: rgb(this.style.accentColor[0], this.style.accentColor[1], this.style.accentColor[2])
    });

    // Draw section title
    this.drawText(title.toUpperCase(), this.margin, {
      font: this.fonts.bold,
      size: 12,
      color: this.style.primaryColor
    });

    this.moveDown(8); // Space after section header
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

  private cleanBulletPoints(text: string): string {
    return text
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('•') && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
          return `• ${trimmed}`;
        }
        return trimmed.replace(/^[\-\*]\s*/, '• ');
      })
      .filter(line => line.length > 0)
      .join('\n');
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

      // Experience Section
      if (cvData.experience && cvData.experience.length > 0) {
        this.drawExperience(cvData.experience);
      }

      // Education Section
      if (cvData.education && cvData.education.length > 0) {
        this.drawEducation(cvData.education);
      }

      // Skills Section
      if (cvData.skills && cvData.skills.length > 0) {
        this.drawSkills(cvData.skills);
      }

      // Projects Section
      if (cvData.projects && cvData.projects.length > 0) {
        this.drawProjects(cvData.projects);
      }

      // Certifications Section
      if (cvData.certifications && cvData.certifications.length > 0) {
        this.drawCertifications(cvData.certifications);
      }

      // Languages Section
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

    // Name - larger, bold, centered
    if (personalInfo.fullName) {
      const nameWidth = this.fonts.bold.widthOfTextAtSize(personalInfo.fullName, 24);
      const nameX = (this.pageWidth - nameWidth) / 2;
      
      this.currentPage.drawText(personalInfo.fullName, {
        x: nameX,
        y: this.currentY,
        size: 24,
        font: this.fonts.bold,
        color: rgb(this.style.primaryColor[0], this.style.primaryColor[1], this.style.primaryColor[2])
      });
      this.moveDown(30);
    }

    // Title - centered, medium size
    if (personalInfo.title) {
      const titleWidth = this.fonts.regular.widthOfTextAtSize(personalInfo.title, 16);
      const titleX = (this.pageWidth - titleWidth) / 2;
      
      this.currentPage.drawText(personalInfo.title, {
        x: titleX,
        y: this.currentY,
        size: 16,
        font: this.fonts.regular,
        color: rgb(this.style.secondaryColor[0], this.style.secondaryColor[1], this.style.secondaryColor[2])
      });
      this.moveDown(25);
    }

    // Contact Information - centered, smaller
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
      personalInfo.website
    ].filter(Boolean);

    if (contactInfo.length > 0) {
      const contactText = contactInfo.join(' | ');
      const contactWidth = this.fonts.regular.widthOfTextAtSize(contactText, 10);
      const contactX = (this.pageWidth - contactWidth) / 2;
      
      this.currentPage.drawText(contactText, {
        x: contactX,
        y: this.currentY,
        size: 10,
        font: this.fonts.regular,
        color: rgb(this.style.secondaryColor[0], this.style.secondaryColor[1], this.style.secondaryColor[2])
      });
      this.moveDown(20);
    }

    // Add separator line
    this.currentPage.drawLine({
      start: { x: this.margin, y: this.currentY },
      end: { x: this.pageWidth - this.margin, y: this.currentY },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8)
    });
    this.moveDown(10);
  }

  private drawSummary(summary: string) {
    this.drawSectionHeader('Professional Summary');
    this.drawText(summary, this.margin, {
      size: 11,
      maxWidth: this.pageWidth - 2 * this.margin
    });
  }

  private drawExperience(experience: any[]) {
    this.drawSectionHeader('Professional Experience');

    for (let i = 0; i < experience.length; i++) {
      const exp = experience[i];
      this.checkPageSpace(80);

      // Job title and company - bold
      const titleLine = `${exp.title || 'Position'} | ${exp.company || 'Company'}`;
      this.drawText(titleLine, this.margin, {
        font: this.fonts.bold,
        size: 12,
        color: this.style.primaryColor
      });

      // Location and dates - smaller, secondary color
      const dateRange = exp.current 
        ? `${this.formatDate(exp.startDate)} - Present`
        : `${this.formatDate(exp.startDate)} - ${this.formatDate(exp.endDate)}`;
      
      const locationDate = [exp.location, dateRange].filter(Boolean).join(' | ');
      if (locationDate) {
        this.drawText(locationDate, this.margin, {
          size: 10,
          color: this.style.secondaryColor
        });
      }

      // Description with bullet points
      if (exp.description && exp.description.trim()) {
        const cleanDescription = this.cleanBulletPoints(exp.description);
        this.drawText(cleanDescription, this.margin, {
          size: 10,
          indent: 15, // Indent bullet points
          maxWidth: this.pageWidth - 2 * this.margin - 15
        });
      }

      // Add space between experience items
      if (i < experience.length - 1) {
        this.moveDown(this.itemSpacing);
      }
    }
  }

  private drawEducation(education: any[]) {
    this.drawSectionHeader('Education');

    for (let i = 0; i < education.length; i++) {
      const edu = education[i];
      this.checkPageSpace(60);

      // Degree and school - bold
      const degreeLine = `${edu.degree || 'Degree'} | ${edu.school || 'Institution'}`;
      this.drawText(degreeLine, this.margin, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.primaryColor
      });

      // Location and graduation date
      const locationDate = [edu.location, this.formatDate(edu.graduationDate)].filter(Boolean).join(' | ');
      if (locationDate) {
        this.drawText(locationDate, this.margin, {
          size: 10,
          color: this.style.secondaryColor
        });
      }

      // GPA if provided
      if (edu.gpa) {
        this.drawText(`GPA: ${edu.gpa}`, this.margin, {
          size: 10
        });
      }

      // Add space between education items
      if (i < education.length - 1) {
        this.moveDown(this.itemSpacing);
      }
    }
  }

  private drawSkills(skills: any[]) {
    this.drawSectionHeader('Skills');

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

      // Category header - bold
      this.drawText(`${category}:`, this.margin, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.primaryColor
      });

      // Skills list - indented
      const skillsText = skillList.join(' • ');
      this.drawText(skillsText, this.margin, {
        size: 10,
        indent: 20,
        maxWidth: this.pageWidth - 2 * this.margin - 20
      });

      this.moveDown(8);
    }
  }

  private drawProjects(projects: any[]) {
    this.drawSectionHeader('Projects');

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      this.checkPageSpace(70);

      // Project name - bold
      this.drawText(project.name || 'Project', this.margin, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.primaryColor
      });

      // Technologies
      if (project.technologies && project.technologies.length > 0) {
        const techText = `Technologies: ${project.technologies.join(', ')}`;
        this.drawText(techText, this.margin, {
          size: 10,
          color: this.style.secondaryColor
        });
      }

      // Description
      if (project.description) {
        this.drawText(project.description, this.margin, {
          size: 10,
          indent: 10
        });
      }

      // Link
      if (project.link) {
        this.drawText(`Link: ${project.link}`, this.margin, {
          size: 9,
          color: this.style.accentColor
        });
      }

      // Add space between projects
      if (i < projects.length - 1) {
        this.moveDown(this.itemSpacing);
      }
    }
  }

  private drawCertifications(certifications: any[]) {
    this.drawSectionHeader('Certifications');

    for (let i = 0; i < certifications.length; i++) {
      const cert = certifications[i];
      this.checkPageSpace(40);

      // Certification name and issuer - bold
      const certLine = `${cert.name || 'Certification'} | ${cert.issuer || 'Issuer'}`;
      this.drawText(certLine, this.margin, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.primaryColor
      });

      // Date
      if (cert.date) {
        this.drawText(this.formatDate(cert.date), this.margin, {
          size: 10,
          color: this.style.secondaryColor
        });
      }

      // Add space between certifications
      if (i < certifications.length - 1) {
        this.moveDown(this.itemSpacing);
      }
    }
  }

  private drawLanguages(languages: any[]) {
    this.drawSectionHeader('Languages');

    const languageList = languages
      .map(lang => `${lang.name} (${lang.proficiency})`)
      .join(' • ');
    
    this.drawText(languageList, this.margin, {
      size: 10
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