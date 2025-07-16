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
  backgroundColor: [number, number, number];
  layout: 'classic' | 'modern' | 'minimal' | 'executive';
}

const templateStyles: { [key: string]: TemplateStyle } = {
  'classic-ats': {
    primaryColor: [0.15, 0.15, 0.15],
    secondaryColor: [0.4, 0.4, 0.4],
    textColor: [0.2, 0.2, 0.2],
    accentColor: [0.2, 0.4, 0.8],
    backgroundColor: [1, 1, 1],
    layout: 'classic'
  },
  'modern-minimal': {
    primaryColor: [0.1, 0.1, 0.1],
    secondaryColor: [0.3, 0.3, 0.3],
    textColor: [0.2, 0.2, 0.2],
    accentColor: [0.4, 0.2, 0.8],
    backgroundColor: [0.98, 0.98, 0.98],
    layout: 'modern'
  },
  'tech-focus': {
    primaryColor: [0, 0.3, 0.6],
    secondaryColor: [0.2, 0.5, 0.8],
    textColor: [0.1, 0.1, 0.1],
    accentColor: [0, 0.6, 0.4],
    backgroundColor: [0.97, 0.99, 1],
    layout: 'minimal'
  },
  'leadership': {
    primaryColor: [0.1, 0.1, 0.1],
    secondaryColor: [0.3, 0.3, 0.3],
    textColor: [0, 0, 0],
    accentColor: [0.6, 0.4, 0.2],
    backgroundColor: [1, 1, 1],
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
    this.fonts.boldItalic = await this.doc.embedFont(StandardFonts.HelveticaBoldOblique);
    
    // Create first page
    this.addPage();
  }

  private addPage() {
    this.currentPage = this.doc.addPage([this.pageWidth, this.pageHeight]);
    this.currentY = this.pageHeight - this.margin;
    
    // Add subtle background
    if (this.style.backgroundColor[0] < 1 || this.style.backgroundColor[1] < 1 || this.style.backgroundColor[2] < 1) {
      this.currentPage.drawRectangle({
        x: 0,
        y: 0,
        width: this.pageWidth,
        height: this.pageHeight,
        color: rgb(this.style.backgroundColor[0], this.style.backgroundColor[1], this.style.backgroundColor[2])
      });
    }
    
    return this.currentPage;
  }

  private checkPageSpace(requiredSpace: number) {
    if (this.currentY - requiredSpace < this.margin + 80) {
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
      size = 11,
      color = this.style.textColor,
      maxWidth = this.pageWidth - 2 * this.margin,
      indent = 0,
      align = 'left'
    } = options;

    if (!text || text.trim() === '') return this.currentY;

    const cleanText = text.replace(/[^\x20-\x7E\n]/g, ' ').trim();
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
          lines.push(word);
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    for (const line of lines) {
      this.checkPageSpace(size + 8);
      
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
      
      this.moveDown(size + 4);
    }

    return this.currentY;
  }

  private drawSectionHeader(title: string) {
    this.checkPageSpace(50);
    this.moveDown(this.sectionSpacing);
    
    // Draw decorative line before section
    this.currentPage.drawRectangle({
      x: this.margin,
      y: this.currentY + 8,
      width: 40,
      height: 3,
      color: rgb(this.style.accentColor[0], this.style.accentColor[1], this.style.accentColor[2])
    });

    // Draw section title with enhanced styling
    this.drawText(title.toUpperCase(), this.margin, {
      font: this.fonts.bold,
      size: 14,
      color: this.style.primaryColor
    });

    // Draw full-width line under section
    this.currentPage.drawLine({
      start: { x: this.margin, y: this.currentY + 5 },
      end: { x: this.pageWidth - this.margin, y: this.currentY + 5 },
      thickness: 0.8,
      color: rgb(this.style.accentColor[0], this.style.accentColor[1], this.style.accentColor[2]),
      opacity: 0.3
    });

    this.moveDown(12);
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
      // Enhanced Header Section
      this.drawEnhancedHeader(cvData.personalInfo);

      // Professional Summary with better styling
      if (cvData.summary && cvData.summary.trim()) {
        this.drawEnhancedSummary(cvData.summary);
      }

      // Experience Section with improved layout
      if (cvData.experience && cvData.experience.length > 0) {
        this.drawEnhancedExperience(cvData.experience);
      }

      // Skills Section with visual elements
      if (cvData.skills && cvData.skills.length > 0) {
        this.drawEnhancedSkills(cvData.skills);
      }

      // Projects Section
      if (cvData.projects && cvData.projects.length > 0) {
        this.drawEnhancedProjects(cvData.projects);
      }

      // Education Section
      if (cvData.education && cvData.education.length > 0) {
        this.drawEnhancedEducation(cvData.education);
      }

      // Certifications Section
      if (cvData.certifications && cvData.certifications.length > 0) {
        this.drawEnhancedCertifications(cvData.certifications);
      }

      // Languages Section
      if (cvData.languages && cvData.languages.length > 0) {
        this.drawEnhancedLanguages(cvData.languages);
      }

      return await this.doc.save();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error('Failed to generate PDF. Please check your data and try again.');
    }
  }

  private drawEnhancedHeader(personalInfo: any) {
    this.checkPageSpace(120);

    // Background accent bar
    this.currentPage.drawRectangle({
      x: 0,
      y: this.currentY - 10,
      width: this.pageWidth,
      height: 80,
      color: rgb(this.style.accentColor[0], this.style.accentColor[1], this.style.accentColor[2]),
      opacity: 0.08
    });

    // Name - large, bold, with better spacing
    if (personalInfo.fullName) {
      this.drawText(personalInfo.fullName, this.margin, {
        font: this.fonts.bold,
        size: 28,
        color: this.style.primaryColor,
        align: 'center'
      });
      this.moveDown(8);
    }

    // Title - professional styling
    if (personalInfo.title) {
      this.drawText(personalInfo.title, this.margin, {
        font: this.fonts.regular,
        size: 16,
        color: this.style.accentColor,
        align: 'center'
      });
      this.moveDown(20);
    }

    // Contact Information - enhanced layout
    const contactInfo = [];
    if (personalInfo.email) contactInfo.push(`📧 ${personalInfo.email}`);
    if (personalInfo.phone) contactInfo.push(`📱 ${personalInfo.phone}`);
    if (personalInfo.location) contactInfo.push(`📍 ${personalInfo.location}`);
    if (personalInfo.linkedin) contactInfo.push(`💼 ${personalInfo.linkedin}`);
    if (personalInfo.website) contactInfo.push(`🌐 ${personalInfo.website}`);

    if (contactInfo.length > 0) {
      // Split into two lines if too many items
      if (contactInfo.length > 3) {
        const firstLine = contactInfo.slice(0, 3).join('  •  ');
        const secondLine = contactInfo.slice(3).join('  •  ');
        
        this.drawText(firstLine, this.margin, {
          font: this.fonts.regular,
          size: 10,
          color: this.style.secondaryColor,
          align: 'center'
        });
        
        this.drawText(secondLine, this.margin, {
          font: this.fonts.regular,
          size: 10,
          color: this.style.secondaryColor,
          align: 'center'
        });
      } else {
        const contactText = contactInfo.join('  •  ');
        this.drawText(contactText, this.margin, {
          font: this.fonts.regular,
          size: 10,
          color: this.style.secondaryColor,
          align: 'center'
        });
      }
      this.moveDown(15);
    }

    // Decorative separator
    this.currentPage.drawLine({
      start: { x: this.margin + 100, y: this.currentY },
      end: { x: this.pageWidth - this.margin - 100, y: this.currentY },
      thickness: 1.5,
      color: rgb(this.style.accentColor[0], this.style.accentColor[1], this.style.accentColor[2]),
      opacity: 0.6
    });
    this.moveDown(15);
  }

  private drawEnhancedSummary(summary: string) {
    this.drawSectionHeader('Professional Summary');
    
    // Add background box for summary
    const summaryHeight = Math.ceil(summary.length / 80) * 16 + 20;
    this.currentPage.drawRectangle({
      x: this.margin - 10,
      y: this.currentY - summaryHeight + 10,
      width: this.pageWidth - 2 * this.margin + 20,
      height: summaryHeight,
      color: rgb(this.style.accentColor[0], this.style.accentColor[1], this.style.accentColor[2]),
      opacity: 0.05
    });

    this.drawText(summary, this.margin, {
      size: 12,
      color: this.style.textColor,
      maxWidth: this.pageWidth - 2 * this.margin
    });
  }

  private drawEnhancedExperience(experience: any[]) {
    this.drawSectionHeader('Professional Experience');

    for (let i = 0; i < experience.length; i++) {
      const exp = experience[i];
      this.checkPageSpace(100);

      // Company and title with enhanced styling
      const titleLine = exp.title || 'Position';
      const companyLine = exp.company || 'Company';
      
      this.drawText(titleLine, this.margin, {
        font: this.fonts.bold,
        size: 13,
        color: this.style.primaryColor
      });

      this.drawText(companyLine, this.margin, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.accentColor
      });

      // Location and dates with better formatting
      const dateRange = exp.current 
        ? `${this.formatDate(exp.startDate)} - Present`
        : `${this.formatDate(exp.startDate)} - ${this.formatDate(exp.endDate)}`;
      
      const locationDate = [exp.location, dateRange].filter(Boolean).join(' • ');
      if (locationDate) {
        this.drawText(locationDate, this.margin, {
          font: this.fonts.italic,
          size: 10,
          color: this.style.secondaryColor
        });
      }

      // Description with enhanced bullet points
      if (exp.description && exp.description.trim()) {
        const cleanDescription = this.cleanBulletPoints(exp.description);
        this.moveDown(6);
        this.drawText(cleanDescription, this.margin, {
          size: 11,
          indent: 20,
          maxWidth: this.pageWidth - 2 * this.margin - 20,
          color: this.style.textColor
        });
      }

      // Add separator line between experiences
      if (i < experience.length - 1) {
        this.moveDown(this.itemSpacing);
        this.currentPage.drawLine({
          start: { x: this.margin + 20, y: this.currentY },
          end: { x: this.pageWidth - this.margin - 20, y: this.currentY },
          thickness: 0.5,
          color: rgb(0.8, 0.8, 0.8)
        });
        this.moveDown(8);
      }
    }
  }

  private drawEnhancedSkills(skills: any[]) {
    this.drawSectionHeader('Skills & Competencies');

    // Group skills by category
    const skillsByCategory: { [key: string]: any[] } = {};
    skills.forEach(skill => {
      const category = skill.category || 'General';
      if (!skillsByCategory[category]) {
        skillsByCategory[category] = [];
      }
      skillsByCategory[category].push(skill);
    });

    for (const [category, skillList] of Object.entries(skillsByCategory)) {
      this.checkPageSpace(40);

      // Category header with styling
      this.drawText(category, this.margin, {
        font: this.fonts.bold,
        size: 12,
        color: this.style.accentColor
      });

      // Skills in a more visual format
      const skillsPerRow = 3;
      const skillChunks = [];
      for (let i = 0; i < skillList.length; i += skillsPerRow) {
        skillChunks.push(skillList.slice(i, i + skillsPerRow));
      }

      skillChunks.forEach(chunk => {
        const skillTexts = chunk.map(skill => {
          const dots = '●'.repeat(skill.level || 3) + '○'.repeat(5 - (skill.level || 3));
          return `${skill.name} ${dots}`;
        });
        
        this.drawText(skillTexts.join('    '), this.margin, {
          size: 10,
          indent: 15,
          color: this.style.textColor
        });
      });

      this.moveDown(12);
    }
  }

  private drawEnhancedProjects(projects: any[]) {
    this.drawSectionHeader('Key Projects');

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      this.checkPageSpace(80);

      // Project name with enhanced styling
      this.drawText(project.name || 'Project', this.margin, {
        font: this.fonts.bold,
        size: 12,
        color: this.style.primaryColor
      });

      // Technologies with visual tags
      if (project.technologies && project.technologies.length > 0) {
        const techText = `Technologies: ${project.technologies.join(' • ')}`;
        this.drawText(techText, this.margin, {
          font: this.fonts.italic,
          size: 10,
          color: this.style.accentColor,
          indent: 10
        });
      }

      // Description
      if (project.description) {
        this.drawText(project.description, this.margin, {
          size: 11,
          indent: 10,
          color: this.style.textColor
        });
      }

      // Link with special formatting
      if (project.link) {
        this.drawText(`🔗 ${project.link}`, this.margin, {
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

  private drawEnhancedEducation(education: any[]) {
    this.drawSectionHeader('Education');

    for (let i = 0; i < education.length; i++) {
      const edu = education[i];
      this.checkPageSpace(60);

      // Degree and school with enhanced styling
      const degreeLine = edu.degree || 'Degree';
      const schoolLine = edu.school || 'Institution';
      
      this.drawText(degreeLine, this.margin, {
        font: this.fonts.bold,
        size: 12,
        color: this.style.primaryColor
      });

      this.drawText(schoolLine, this.margin, {
        font: this.fonts.regular,
        size: 11,
        color: this.style.accentColor
      });

      // Location and graduation date
      const locationDate = [edu.location, this.formatDate(edu.graduationDate)].filter(Boolean).join(' • ');
      if (locationDate) {
        this.drawText(locationDate, this.margin, {
          font: this.fonts.italic,
          size: 10,
          color: this.style.secondaryColor
        });
      }

      // GPA with special formatting
      if (edu.gpa) {
        this.drawText(`GPA: ${edu.gpa}`, this.margin, {
          size: 10,
          color: this.style.textColor,
          indent: 10
        });
      }

      if (i < education.length - 1) {
        this.moveDown(this.itemSpacing);
      }
    }
  }

  private drawEnhancedCertifications(certifications: any[]) {
    this.drawSectionHeader('Certifications');

    for (let i = 0; i < certifications.length; i++) {
      const cert = certifications[i];
      this.checkPageSpace(50);

      // Certification name and issuer
      const certLine = `${cert.name || 'Certification'} • ${cert.issuer || 'Issuer'}`;
      this.drawText(certLine, this.margin, {
        font: this.fonts.bold,
        size: 11,
        color: this.style.primaryColor
      });

      // Date with icon
      if (cert.date) {
        this.drawText(`📅 ${this.formatDate(cert.date)}`, this.margin, {
          size: 10,
          color: this.style.secondaryColor,
          indent: 10
        });
      }

      // Verification link
      if (cert.verificationLink) {
        this.drawText(`🔗 Verify: ${cert.verificationLink}`, this.margin, {
          size: 9,
          color: this.style.accentColor,
          indent: 10
        });
      }

      if (i < certifications.length - 1) {
        this.moveDown(this.itemSpacing);
      }
    }
  }

  private drawEnhancedLanguages(languages: any[]) {
    this.drawSectionHeader('Languages');

    // Create a more visual language display
    const languageChunks = [];
    for (let i = 0; i < languages.length; i += 2) {
      languageChunks.push(languages.slice(i, i + 2));
    }

    languageChunks.forEach(chunk => {
      const languageTexts = chunk.map(lang => {
        const proficiencyIcon = lang.proficiency === 'Fluent' ? '🌟' : 
                               lang.proficiency === 'Intermediate' ? '⭐' : '✨';
        return `${proficiencyIcon} ${lang.name} (${lang.proficiency})`;
      });
      
      this.drawText(languageTexts.join('    '), this.margin, {
        size: 11,
        color: this.style.textColor
      });
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