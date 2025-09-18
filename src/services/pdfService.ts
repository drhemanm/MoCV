// src/services/pdfService.ts - CORRECT VERSION (NO JSX)
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';

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
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
    description: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
    category: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    startDate: string;
    endDate: string;
    current: boolean;
    url?: string;
    github?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
  }>;
}

export class PDFService {
  private doc: PDFDocument;
  private font: any;
  private boldFont: any;
  private currentY: number = 750;
  private margin = 50;
  private pageWidth = PageSizes.A4[0];
  private pageHeight = PageSizes.A4[1];
  private currentPage: any;

  constructor() {
    this.doc = PDFDocument.create();
  }

  async generateCV(cvData: CVData): Promise<Uint8Array> {
    // Create fonts
    this.font = await this.doc.embedFont(StandardFonts.Helvetica);
    this.boldFont = await this.doc.embedFont(StandardFonts.HelveticaBold);

    // Add first page
    this.currentPage = this.doc.addPage(PageSizes.A4);
    this.currentY = this.pageHeight - 50;

    // Generate sections
    this.addHeader(cvData.personalInfo);
    this.addSection('PROFESSIONAL SUMMARY', cvData.summary);
    this.addExperience(cvData.experience);
    this.addEducation(cvData.education);
    this.addSkills(cvData.skills);
    
    if (cvData.projects && cvData.projects.length > 0) {
      this.addProjects(cvData.projects);
    }
    
    if (cvData.certifications && cvData.certifications.length > 0) {
      this.addCertifications(cvData.certifications);
    }

    return this.doc.save();
  }

  private checkNewPage(requiredHeight: number = 100) {
    if (this.currentY - requiredHeight < 50) {
      this.currentPage = this.doc.addPage(PageSizes.A4);
      this.currentY = this.pageHeight - 50;
    }
  }

  private addHeader(personalInfo: any) {
    // Name
    this.currentPage.drawText(personalInfo.fullName, {
      x: this.margin,
      y: this.currentY,
      size: 24,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 30;

    // Title
    this.currentPage.drawText(personalInfo.title, {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.font,
      color: rgb(0.4, 0.4, 0.4),
    });
    this.currentY -= 25;

    // Contact info
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
      personalInfo.website
    ].filter(Boolean).join(' | ');

    this.currentPage.drawText(contactInfo, {
      x: this.margin,
      y: this.currentY,
      size: 10,
      font: this.font,
      color: rgb(0.3, 0.3, 0.3),
    });
    this.currentY -= 30;

    // Divider line
    this.currentPage.drawLine({
      start: { x: this.margin, y: this.currentY },
      end: { x: this.pageWidth - this.margin, y: this.currentY },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    this.currentY -= 20;
  }

  private addSection(title: string, content?: string) {
    if (!content) return;

    this.checkNewPage(80);

    // Section title
    this.currentPage.drawText(title, {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    // Content
    const lines = this.wrapText(content, 500);
    lines.forEach(line => {
      this.checkNewPage(20);
      this.currentPage.drawText(line, {
        x: this.margin,
        y: this.currentY,
        size: 11,
        font: this.font,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;
    });
    this.currentY -= 10;
  }

  private addExperience(experiences: any[]) {
    if (!experiences || experiences.length === 0) return;

    this.checkNewPage(100);

    // Section title
    this.currentPage.drawText('WORK EXPERIENCE', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    experiences.forEach(exp => {
      this.checkNewPage(120);

      // Job title and company
      this.currentPage.drawText(`${exp.title} at ${exp.company}`, {
        x: this.margin,
        y: this.currentY,
        size: 12,
        font: this.boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });
      this.currentY -= 18;

      // Location and dates
      const dateText = exp.current ? 
        `${this.formatDate(exp.startDate)} - Present` : 
        `${this.formatDate(exp.startDate)} - ${this.formatDate(exp.endDate)}`;
      
      this.currentPage.drawText(`${exp.location} | ${dateText}`, {
        x: this.margin,
        y: this.currentY,
        size: 10,
        font: this.font,
        color: rgb(0.4, 0.4, 0.4),
      });
      this.currentY -= 20;

      // Description
      if (exp.description) {
        const lines = this.wrapText(exp.description, 500);
        lines.forEach(line => {
          this.checkNewPage(20);
          this.currentPage.drawText(line, {
            x: this.margin + 10,
            y: this.currentY,
            size: 10,
            font: this.font,
            color: rgb(0.2, 0.2, 0.2),
          });
          this.currentY -= 14;
        });
      }
      this.currentY -= 10;
    });
  }

  private addEducation(education: any[]) {
    if (!education || education.length === 0) return;

    this.checkNewPage(100);

    // Section title
    this.currentPage.drawText('EDUCATION', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    education.forEach(edu => {
      this.checkNewPage(80);

      // Degree and institution
      this.currentPage.drawText(`${edu.degree} - ${edu.institution}`, {
        x: this.margin,
        y: this.currentY,
        size: 12,
        font: this.boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });
      this.currentY -= 18;

      // Location, dates, and GPA
      const dateText = edu.current ? 
        `${this.formatDate(edu.startDate)} - Present` : 
        `${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}`;
      
      const eduInfo = [edu.location, dateText, edu.gpa ? `GPA: ${edu.gpa}` : null]
        .filter(Boolean).join(' | ');
      
      this.currentPage.drawText(eduInfo, {
        x: this.margin,
        y: this.currentY,
        size: 10,
        font: this.font,
        color: rgb(0.4, 0.4, 0.4),
      });
      this.currentY -= 20;

      // Description
      if (edu.description) {
        const lines = this.wrapText(edu.description, 500);
        lines.forEach(line => {
          this.checkNewPage(20);
          this.currentPage.drawText(line, {
            x: this.margin + 10,
            y: this.currentY,
            size: 10,
            font: this.font,
            color: rgb(0.2, 0.2, 0.2),
          });
          this.currentY -= 14;
        });
      }
      this.currentY -= 10;
    });
  }

  private addSkills(skills: any[]) {
    if (!skills || skills.length === 0) return;

    this.checkNewPage(100);

    // Section title
    this.currentPage.drawText('SKILLS', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    // Group skills by category
    const skillsByCategory = skills.reduce((acc: any, skill: any) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

    Object.entries(skillsByCategory).forEach(([category, categorySkills]: [string, any]) => {
      this.checkNewPage(40);

      // Category title
      const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1) + ':';
      this.currentPage.drawText(categoryTitle, {
        x: this.margin,
        y: this.currentY,
        size: 11,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 18;

      // Skills list
      const skillsText = categorySkills.map((skill: any) => `${skill.name} (${skill.level})`).join(', ');
      const lines = this.wrapText(skillsText, 500);
      lines.forEach(line => {
        this.checkNewPage(20);
        this.currentPage.drawText(line, {
          x: this.margin + 10,
          y: this.currentY,
          size: 10,
          font: this.font,
          color: rgb(0.3, 0.3, 0.3),
        });
        this.currentY -= 14;
      });
      this.currentY -= 5;
    });
  }

  private addProjects(projects: any[]) {
    if (!projects || projects.length === 0) return;

    this.checkNewPage(100);

    // Section title
    this.currentPage.drawText('PROJECTS', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    projects.forEach(project => {
      this.checkNewPage(100);

      // Project name
      this.currentPage.drawText(project.name, {
        x: this.margin,
        y: this.currentY,
        size: 12,
        font: this.boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });
      this.currentY -= 18;

      // Technologies and dates
      const dateText = project.current ? 
        `${this.formatDate(project.startDate)} - Present` : 
        `${this.formatDate(project.startDate)} - ${this.formatDate(project.endDate)}`;
      
      const techText = project.technologies.join(', ');
      this.currentPage.drawText(`${techText} | ${dateText}`, {
        x: this.margin,
        y: this.currentY,
        size: 10,
        font: this.font,
        color: rgb(0.4, 0.4, 0.4),
      });
      this.currentY -= 16;

      // URLs
      if (project.url || project.github) {
        const urls = [project.url, project.github].filter(Boolean).join(' | ');
        this.currentPage.drawText(urls, {
          x: this.margin,
          y: this.currentY,
          size: 9,
          font: this.font,
          color: rgb(0.5, 0.5, 0.5),
        });
        this.currentY -= 16;
      }

      // Description
      if (project.description) {
        const lines = this.wrapText(project.description, 500);
        lines.forEach(line => {
          this.checkNewPage(20);
          this.currentPage.drawText(line, {
            x: this.margin + 10,
            y: this.currentY,
            size: 10,
            font: this.font,
            color: rgb(0.2, 0.2, 0.2),
          });
          this.currentY -= 14;
        });
      }
      this.currentY -= 10;
    });
  }

  private addCertifications(certifications: any[]) {
    if (!certifications || certifications.length === 0) return;

    this.checkNewPage(100);

    // Section title
    this.currentPage.drawText('CERTIFICATIONS', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    certifications.forEach(cert => {
      this.checkNewPage(60);

      // Certification name
      this.currentPage.drawText(cert.name, {
        x: this.margin,
        y: this.currentY,
        size: 12,
        font: this.boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });
      this.currentY -= 18;

      // Issuer and dates
      const certInfo = [
        cert.issuer,
        `Issued: ${this.formatDate(cert.issueDate)}`,
        cert.expiryDate ? `Expires: ${this.formatDate(cert.expiryDate)}` : null,
        cert.credentialId ? `ID: ${cert.credentialId}` : null
      ].filter(Boolean).join(' | ');

      this.currentPage.drawText(certInfo, {
        x: this.margin,
        y: this.currentY,
        size: 10,
        font: this.font,
        color: rgb(0.4, 0.4, 0.4),
      });
      this.currentY -= 16;

      // URL
      if (cert.url) {
        this.currentPage.drawText(cert.url, {
          x: this.margin,
          y: this.currentY,
          size: 9,
          font: this.font,
          color: rgb(0.5, 0.5, 0.5),
        });
        this.currentY -= 16;
      }
      this.currentY -= 5;
    });
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const width = this.font.widthOfTextAtSize(testLine, 11);
      
      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}

// Export function to generate PDF
export async function generateCVPDF(cvData: CVData): Promise<Uint8Array> {
  const pdfService = new PDFService();
  return await pdfService.generateCV(cvData);
}
