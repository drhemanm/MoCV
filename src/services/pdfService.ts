// src/services/pdfService.ts
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';
import { CVData } from '../types';

export class PDFService {
  private doc: PDFDocument;
  private font: any;
  private boldFont: any;
  private currentY: number = 750;
  private margin = 50;
  private pageWidth = PageSizes.A4[0];
  private pageHeight = PageSizes.A4[1];

  constructor() {
    this.doc = PDFDocument.create();
  }

  async generateCV(cvData: CVData): Promise<Uint8Array> {
    // Create fonts
    this.font = await this.doc.embedFont(StandardFonts.Helvetica);
    this.boldFont = await this.doc.embedFont(StandardFonts.HelveticaBold);

    // Add page
    const page = this.doc.addPage(PageSizes.A4);
    
    // Reset Y position
    this.currentY = this.pageHeight - 50;

    // Generate sections
    await this.addHeader(page, cvData.personalInfo);
    await this.addSection(page, 'PROFESSIONAL SUMMARY', cvData.summary);
    await this.addExperience(page, cvData.experience);
    await this.addEducation(page, cvData.education);
    await this.addSkills(page, cvData.skills);
    
    if (cvData.projects && cvData.projects.length > 0) {
      await this.addProjects(page, cvData.projects);
    }
    
    if (cvData.certifications && cvData.certifications.length > 0) {
      await this.addCertifications(page, cvData.certifications);
    }

    if (cvData.references && cvData.references.length > 0) {
      await this.addReferences(page, cvData.references);
    }

    return this.doc.save();
  }

  private addHeader(page: any, personalInfo: any) {
    // Name
    page.drawText(personalInfo.fullName, {
      x: this.margin,
      y: this.currentY,
      size: 24,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 30;

    // Title
    page.drawText(personalInfo.title, {
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

    page.drawText(contactInfo, {
      x: this.margin,
      y: this.currentY,
      size: 10,
      font: this.font,
      color: rgb(0.3, 0.3, 0.3),
    });
    this.currentY -= 30;

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
    if (!content) return;

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
      page.drawText(line, {
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

    // Section title
    page.drawText('WORK EXPERIENCE', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    experiences.forEach(exp => {
      // Job title and company
      page.drawText(`${exp.title} at ${exp.company}`, {
        x: this.margin,
        y: this.currentY,
        size: 12,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;

      // Date and location
      const dateRange = exp.current ? 
        `${exp.startDate} - Present` : 
        `${exp.startDate} - ${exp.endDate}`;
      
      page.drawText(`${dateRange} | ${exp.location}`, {
        x: this.margin,
        y: this.currentY,
        size: 10,
        font: this.font,
        color: rgb(0.4, 0.4, 0.4),
      });
      this.currentY -= 15;

      // Description
      if (exp.description) {
        const lines = this.wrapText(exp.description, 500);
        lines.forEach(line => {
          page.drawText(`• ${line}`, {
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

    page.drawText('EDUCATION', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    education.forEach(edu => {
      page.drawText(`${edu.degree} - ${edu.school}`, {
        x: this.margin,
        y: this.currentY,
        size: 12,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;

      page.drawText(`${edu.graduationDate} | ${edu.location}`, {
        x: this.margin,
        y: this.currentY,
        size: 10,
        font: this.font,
        color: rgb(0.4, 0.4, 0.4),
      });
      this.currentY -= 20;
    });
  }

  private addSkills(page: any, skills: any[]) {
    if (!skills || skills.length === 0) return;

    page.drawText('SKILLS', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(groupedSkills).forEach(([category, skillNames]) => {
      page.drawText(`${category}:`, {
        x: this.margin,
        y: this.currentY,
        size: 11,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;

      page.drawText(skillNames.join(', '), {
        x: this.margin + 10,
        y: this.currentY,
        size: 10,
        font: this.font,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 20;
    });
  }

  private addProjects(page: any, projects: any[]) {
    if (!projects || projects.length === 0) return;

    page.drawText('PROJECTS', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    projects.forEach(project => {
      page.drawText(project.name, {
        x: this.margin,
        y: this.currentY,
        size: 12,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;

      if (project.description) {
        const lines = this.wrapText(project.description, 500);
        lines.forEach(line => {
          page.drawText(line, {
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
        page.drawText(`Technologies: ${project.technologies.join(', ')}`, {
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

    page.drawText('CERTIFICATIONS', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    certifications.forEach(cert => {
      page.drawText(`${cert.name} - ${cert.issuer}`, {
        x: this.margin,
        y: this.currentY,
        size: 11,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;

      page.drawText(cert.date, {
        x: this.margin + 10,
        y: this.currentY,
        size: 10,
        font: this.font,
        color: rgb(0.4, 0.4, 0.4),
      });
      this.currentY -= 20;
    });
  }

  private addReferences(page: any, references: any[]) {
    if (!references || references.length === 0) return;

    page.drawText('REFERENCES', {
      x: this.margin,
      y: this.currentY,
      size: 14,
      font: this.boldFont,
      color: rgb(0.2, 0.3, 0.5),
    });
    this.currentY -= 20;

    references.forEach(ref => {
      page.drawText(`${ref.name} - ${ref.title}`, {
        x: this.margin,
        y: this.currentY,
        size: 11,
        font: this.boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      this.currentY -= 15;

      page.drawText(`${ref.company} | ${ref.email} | ${ref.phone}`, {
        x: this.margin + 10,
        y: this.currentY,
        size: 10,
        font: this.font,
        color: rgb(0.4, 0.4, 0.4),
      });
      this.currentY -= 20;
    });
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (this.font.widthOfTextAtSize(testLine, 11) < maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine) lines.push(currentLine);
    return lines;
  }
}
