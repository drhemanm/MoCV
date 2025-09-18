// src/services/pdfService.ts - Corrected version
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';
import { CVData } from '../types';

export class PDFService {
  private doc!: PDFDocument;
  private font!: any;
  private boldFont!: any;
  private currentY: number = 750;
  private margin = 50;
  private pageWidth = PageSizes.A4[0];
  private pageHeight = PageSizes.A4[1];
  private currentPage: any;

  async generateCV(cvData: CVData): Promise<Uint8Array> {
    // Create document and fonts
    this.doc = await PDFDocument.create();
    this.font = await this.doc.embedFont(StandardFonts.Helvetica);
    this.boldFont = await this.doc.embedFont(StandardFonts.HelveticaBold);

    // Add first page
    this.currentPage = this.doc.addPage(PageSizes.A4);
    
    // Reset Y position
    this.currentY = this.pageHeight - 50;

    // Generate sections
    this.addHeader(this.currentPage, cvData.personalInfo);
    this.addSection(this.currentPage, 'PROFESSIONAL SUMMARY', cvData.summary);
    this.addExperience(this.currentPage, cvData.experience);
    this.addEducation(this.currentPage, cvData.education);
    this.addSkills(this.currentPage, cvData.skills);
    
    if (cvData.projects && cvData.projects.length > 0) {
      this.addProjects(this.currentPage, cvData.projects);
    }
    
    if (cvData.certifications && cvData.certifications.length > 0) {
      this.addCertifications(this.currentPage, cvData.certifications);
    }

    if (cvData.references && cvData.references.length > 0) {
      this.addReferences(this.currentPage, cvData.references);
    }

    return this.doc.save();
  }

  private checkPageSpace(requiredSpace: number = 50) {
    if (this.currentY < this.margin + requiredSpace) {
      // Add new page
      this.currentPage = this.doc.addPage(PageSizes.A4);
      this.currentY = this.pageHeight - 50;
    }
  }

  private addHeader(page: any, personalInfo: any) {
    // Name
    page.drawText(personalInfo.fullName || 'No Name Provided', {
      x: this.margin,
      y: this.currentY,
      size: 24,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 30;

    // Title
    if (personalInfo.title) {
      page.drawText(personalInfo.title, {
        x: this.margin,
        y: this.currentY,
        size: 14,
        font: this.font,
        color: rgb(0.4, 0.4, 0.4),
      });
      this.currentY -= 25;
    }

    // Contact info - Updated to include all fields
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
      personalInfo.website,
      personalInfo.github,
      personalInfo.portfolio
    ].filter(Boolean).join(' | ');

    if (contactInfo) {
      page.drawText(contactInfo, {
        x: this.margin,
        y: this.currentY,
        size: 10,
        font: this.font,
        color: rgb(0.3, 0.3, 0.3),
      });
      this.currentY -= 30;
    }

    // Divider line
    page.drawLine({
      start: { x: this.margin, y: this.currentY },
      end: { x: this.pageWidth - this.margin, y: this.currentY },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    this.currentY -= 20;
  }

  private addSection(page: any, title: string, content?: string) {
    if (!content || content.trim() === '') return;

    this.checkPageSpace(60);

    // Section title
    page.drawText(title, {
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
      this.checkPageSpace(20);
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

  private addExperience(page: any, experiences: any[]) {
    if (!experiences || experiences.length === 0) return;

    this.checkPageSpace(60);

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
      this.checkPageSpace(80);

      // Job title and company
      const titleText = exp.title && exp.company ? 
        `${exp.title} at ${exp.company}` : 
        exp.title || exp.company || 'Position';

      this.currentPage.drawText(titleText, {
        x: this.margin,
        y: this.currentY,
        size: 12,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;

      // Date and location
      const dateRange = exp.current ? 
        `${exp.startDate || 'Start'} - Present` : 
        `${exp.startDate || 'Start'} - ${exp.endDate || 'End'}`;
      
      const locationText = exp.location ? ` | ${exp.location}` : '';
      
      this.currentPage.drawText(`${dateRange}${locationText}`, {
        x: this.margin,
        y: this.currentY,
        size: 10,
        font: this.font,
        color: rgb(0.4, 0.4, 0.4),
      });
      this.currentY -= 15;

      // Description
      if (exp.description && exp.description.trim() !== '') {
        const lines = this.wrapText(exp.description, 500);
        lines.forEach(line => {
          this.checkPageSpace(20);
          this.currentPage.drawText(`• ${line}`, {
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

  private addEducation(page: any, education: any[]) {
    if (!education || education.length === 0) return;

    this.checkPageSpace(60);

    this.currentPage.drawText('EDUCATION', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    education.forEach(edu => {
      this.checkPageSpace(40);

      const eduText = edu.degree && edu.school ? 
        `${edu.degree} - ${edu.school}` : 
        edu.degree || edu.school || 'Education';

      this.currentPage.drawText(eduText, {
        x: this.margin,
        y: this.currentY,
        size: 12,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;

      const detailParts = [edu.graduationDate, edu.location].filter(Boolean);
      if (detailParts.length > 0) {
        this.currentPage.drawText(detailParts.join(' | '), {
          x: this.margin,
          y: this.currentY,
          size: 10,
          font: this.font,
          color: rgb(0.4, 0.4, 0.4),
        });
        this.currentY -= 15;
      }
      this.currentY -= 5;
    });
  }

  private addSkills(page: any, skills: any[]) {
    if (!skills || skills.length === 0) return;

    this.checkPageSpace(60);

    this.currentPage.drawText('SKILLS', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(groupedSkills).forEach(([category, skillNames]) => {
      this.checkPageSpace(40);

      this.currentPage.drawText(`${category}:`, {
        x: this.margin,
        y: this.currentY,
        size: 11,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;

      const skillsText = skillNames.join(', ');
      const skillLines = this.wrapText(skillsText, 480);
      
      skillLines.forEach(line => {
        this.checkPageSpace(20);
        this.currentPage.drawText(line, {
          x: this.margin + 10,
          y: this.currentY,
          size: 10,
          font: this.font,
          color: rgb(0.2, 0.2, 0.2),
        });
        this.currentY -= 15;
      });
      this.currentY -= 5;
    });
  }

  private addProjects(page: any, projects: any[]) {
    if (!projects || projects.length === 0) return;

    this.checkPageSpace(60);

    this.currentPage.drawText('PROJECTS', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    projects.forEach(project => {
      this.checkPageSpace(60);

      this.currentPage.drawText(project.name || 'Unnamed Project', {
        x: this.margin,
        y: this.currentY,
        size: 12,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;

      if (project.description && project.description.trim() !== '') {
        const lines = this.wrapText(project.description, 500);
        lines.forEach(line => {
          this.checkPageSpace(20);
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

      if (project.technologies && project.technologies.length > 0) {
        this.checkPageSpace(20);
        this.currentPage.drawText(`Technologies: ${project.technologies.join(', ')}`, {
          x: this.margin + 10,
          y: this.currentY,
          size: 9,
          font: this.font,
          color: rgb(0.4, 0.4, 0.4),
        });
        this.currentY -= 15;
      }
      this.currentY -= 10;
    });
  }

  private addCertifications(page: any, certifications: any[]) {
    if (!certifications || certifications.length === 0) return;

    this.checkPageSpace(60);

    this.currentPage.drawText('CERTIFICATIONS', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    certifications.forEach(cert => {
      this.checkPageSpace(40);

      const certText = cert.name && cert.issuer ? 
        `${cert.name} - ${cert.issuer}` : 
        cert.name || cert.issuer || 'Certification';

      this.currentPage.drawText(certText, {
        x: this.margin,
        y: this.currentY,
        size: 11,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;

      if (cert.date) {
        this.currentPage.drawText(cert.date, {
          x: this.margin + 10,
          y: this.currentY,
          size: 10,
          font: this.font,
          color: rgb(0.4, 0.4, 0.4),
        });
        this.currentY -= 15;
      }
      this.currentY -= 5;
    });
  }

  private addReferences(page: any, references: any[]) {
    if (!references || references.length === 0) return;

    this.checkPageSpace(60);

    this.currentPage.drawText('REFERENCES', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    references.forEach(ref => {
      this.checkPageSpace(40);

      const refText = ref.name && ref.title ? 
        `${ref.name} - ${ref.title}` : 
        ref.name || ref.title || 'Reference';

      this.currentPage.drawText(refText, {
        x: this.margin,
        y: this.currentY,
        size: 11,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;

      const contactParts = [ref.company, ref.email, ref.phone].filter(Boolean);
      if (contactParts.length > 0) {
        this.currentPage.drawText(contactParts.join(' | '), {
          x: this.margin + 10,
          y: this.currentY,
          size: 10,
          font: this.font,
          color: rgb(0.4, 0.4, 0.4),
        });
        this.currentY -= 15;
      }
      this.currentY -= 5;
    });
  }

  private wrapText(text: string, maxWidth: number): string[] {
    if (!text || text.trim() === '') return [];
    
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      try {
        if (this.font.widthOfTextAtSize(testLine, 11) < maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      } catch (error) {
        // Fallback if font width calculation fails
        if (testLine.length < 80) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
    }
    
    if (currentLine) lines.push(currentLine);
    return lines;
  }
}
