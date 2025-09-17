// src/services/templateService.ts

export interface CVTemplate {
  id: string;
  name: string;
  category: 'professional' | 'creative' | 'modern' | 'academic' | 'minimal';
  description: string;
  preview: string; // URL to preview image
  thumbnail: string; // URL to thumbnail
  isPremium: boolean;
  features: string[];
  layout: {
    columns: number;
    sections: string[];
    colorScheme: 'light' | 'dark' | 'color';
    typography: string;
  };
  customization: {
    colors: boolean;
    fonts: boolean;
    layout: boolean;
    sections: boolean;
  };
  tags: string[];
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateCustomization {
  templateId: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    size: 'small' | 'medium' | 'large';
  };
  layout: {
    margins: number;
    spacing: number;
    columnGap: number;
  };
  sections: {
    order: string[];
    visibility: Record<string, boolean>;
  };
}

export interface TemplateFilter {
  category?: CVTemplate['category'];
  isPremium?: boolean;
  features?: string[];
  tags?: string[];
  sortBy?: 'popularity' | 'name' | 'recent' | 'category';
  sortOrder?: 'asc' | 'desc';
}

export class TemplateService {
  private static templates: CVTemplate[] = [];
  private static initialized = false;

  /**
   * Initialize templates (load from API or local data)
   */
  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // In production, this would load from an API
      this.templates = this.getDefaultTemplates();
      this.initialized = true;
    } catch (error) {
      console.error('Template service initialization failed:', error);
      throw new Error('Failed to initialize template service');
    }
  }

  /**
   * Get all available templates
   */
  static async getAllTemplates(filter?: TemplateFilter): Promise<CVTemplate[]> {
    await this.initialize();
    
    let filteredTemplates = [...this.templates];

    // Apply filters
    if (filter) {
      if (filter.category) {
        filteredTemplates = filteredTemplates.filter(t => t.category === filter.category);
      }
      
      if (filter.isPremium !== undefined) {
        filteredTemplates = filteredTemplates.filter(t => t.isPremium === filter.isPremium);
      }
      
      if (filter.features && filter.features.length > 0) {
        filteredTemplates = filteredTemplates.filter(t => 
          filter.features!.some(feature => t.features.includes(feature))
        );
      }
      
      if (filter.tags && filter.tags.length > 0) {
        filteredTemplates = filteredTemplates.filter(t => 
          filter.tags!.some(tag => t.tags.includes(tag))
        );
      }

      // Apply sorting
      const sortBy = filter.sortBy || 'popularity';
      const sortOrder = filter.sortOrder || 'desc';
      
      filteredTemplates.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'recent':
            comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
          case 'popularity':
          default:
            comparison = a.popularity - b.popularity;
            break;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return filteredTemplates;
  }

  /**
   * Get template by ID
   */
  static async getTemplate(templateId: string): Promise<CVTemplate | null> {
    await this.initialize();
    return this.templates.find(t => t.id === templateId) || null;
  }

  /**
   * Get templates by category
   */
  static async getTemplatesByCategory(category: CVTemplate['category']): Promise<CVTemplate[]> {
    return this.getAllTemplates({ category });
  }

  /**
   * Get popular templates
   */
  static async getPopularTemplates(limit: number = 6): Promise<CVTemplate[]> {
    const templates = await this.getAllTemplates({ 
      sortBy: 'popularity', 
      sortOrder: 'desc' 
    });
    return templates.slice(0, limit);
  }

  /**
   * Get recommended templates based on user preferences
   */
  static async getRecommendedTemplates(
    userPreferences: {
      industry?: string;
      experience?: 'entry' | 'mid' | 'senior';
      style?: 'conservative' | 'modern' | 'creative';
    }
  ): Promise<CVTemplate[]> {
    await this.initialize();
    
    let recommendedTemplates = [...this.templates];

    // Filter based on preferences
    if (userPreferences.style) {
      const styleMapping = {
        'conservative': ['professional', 'academic'],
        'modern': ['modern', 'minimal'],
        'creative': ['creative', 'modern']
      };
      
      const preferredCategories = styleMapping[userPreferences.style] || [];
      recommendedTemplates = recommendedTemplates.filter(t => 
        preferredCategories.includes(t.category)
      );
    }

    // Sort by relevance and popularity
    recommendedTemplates.sort((a, b) => b.popularity - a.popularity);
    
    return recommendedTemplates.slice(0, 8);
  }

  /**
   * Save template customization
   */
  static async saveCustomization(
    templateId: string, 
    customization: TemplateCustomization
  ): Promise<boolean> {
    try {
      // In production, this would save to API or local storage
      const key = `template_customization_${templateId}`;
      localStorage.setItem(key, JSON.stringify(customization));
      return true;
    } catch (error) {
      console.error('Failed to save template customization:', error);
      return false;
    }
  }

  /**
   * Load template customization
   */
  static async loadCustomization(templateId: string): Promise<TemplateCustomization | null> {
    try {
      const key = `template_customization_${templateId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load template customization:', error);
      return null;
    }
  }

  /**
   * Get default customization for a template
   */
  static async getDefaultCustomization(templateId: string): Promise<TemplateCustomization> {
    const template = await this.getTemplate(templateId);
    
    return {
      templateId,
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#10b981',
        background: '#ffffff',
        text: '#1f2937'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        size: 'medium'
      },
      layout: {
        margins: 20,
        spacing: 16,
        columnGap: 20
      },
      sections: {
        order: [
          'personal',
          'summary',
          'experience',
          'education',
          'skills',
          'projects',
          'certifications'
        ],
        visibility: {
          personal: true,
          summary: true,
          experience: true,
          education: true,
          skills: true,
          projects: true,
          certifications: true,
          languages: false,
          hobbies: false
        }
      }
    };
  }

  /**
   * Preview template with sample data
   */
  static async previewTemplate(
    templateId: string,
    customization?: Partial<TemplateCustomization>
  ): Promise<string> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) throw new Error('Template not found');

      const defaultCustomization = await this.getDefaultCustomization(templateId);
      const finalCustomization = { ...defaultCustomization, ...customization };

      // In production, this would render the template with sample data
      // For now, return a placeholder URL
      return `/api/template/preview/${templateId}?customization=${encodeURIComponent(JSON.stringify(finalCustomization))}`;
    } catch (error) {
      console.error('Template preview failed:', error);
      throw new Error('Failed to generate template preview');
    }
  }

  /**
   * Clone/duplicate a template
   */
  static async cloneTemplate(
    templateId: string, 
    newName: string
  ): Promise<CVTemplate | null> {
    try {
      const originalTemplate = await this.getTemplate(templateId);
      if (!originalTemplate) return null;

      const clonedTemplate: CVTemplate = {
        ...originalTemplate,
        id: `cloned_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: newName,
        isPremium: false, // Cloned templates are free
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // In production, save to API
      this.templates.push(clonedTemplate);
      return clonedTemplate;
    } catch (error) {
      console.error('Template cloning failed:', error);
      return null;
    }
  }

  /**
   * Get template categories with counts
   */
  static async getCategoryStats(): Promise<Array<{
    category: CVTemplate['category'];
    count: number;
    popularTemplate: CVTemplate;
  }>> {
    await this.initialize();
    
    const categories = ['professional', 'creative', 'modern', 'academic', 'minimal'] as const;
    
    return categories.map(category => {
      const categoryTemplates = this.templates.filter(t => t.category === category);
      const popularTemplate = categoryTemplates.sort((a, b) => b.popularity - a.popularity)[0];
      
      return {
        category,
        count: categoryTemplates.length,
        popularTemplate
      };
    });
  }

  /**
   * Search templates by name or tags
   */
  static async searchTemplates(query: string): Promise<CVTemplate[]> {
    await this.initialize();
    
    const lowercaseQuery = query.toLowerCase();
    
    return this.templates.filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      template.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Fetch template content from API or local storage
   */
  static async fetchTemplateContent(templateId: string): Promise<any> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) throw new Error('Template not found');

      // In production, this would fetch the actual template content/HTML
      // For now, return mock template structure
      return {
        templateId,
        html: `<div class="cv-template cv-template-${templateId}">
          <!-- Template HTML content would go here -->
          <div class="cv-header">Header Section</div>
          <div class="cv-content">Content Sections</div>
        </div>`,
        css: `/* Template CSS for ${templateId} */
          .cv-template-${templateId} { 
            font-family: Inter, sans-serif;
            max-width: 210mm;
            margin: 0 auto;
          }`,
        metadata: {
          template,
          lastFetched: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Failed to fetch template content:', error);
      throw new Error(`Failed to fetch template content for ${templateId}`);
    }
  }

  /**
   * Get template content by type/format
   */
  static async getTemplateContentByType(
    templateId: string, 
    contentType: 'html' | 'pdf' | 'docx' | 'json' = 'html'
  ): Promise<any> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) throw new Error('Template not found');

      switch (contentType) {
        case 'html':
          return {
            type: 'html',
            content: `<!DOCTYPE html>
              <html>
                <head>
                  <title>CV Template - ${template.name}</title>
                  <style>
                    /* Template styles */
                    body { font-family: ${template.layout.typography}, sans-serif; }
                    .cv-container { max-width: 210mm; margin: 0 auto; padding: 20mm; }
                  </style>
                </head>
                <body>
                  <div class="cv-container">
                    <!-- Template content -->
                    <h1>CV Template: ${template.name}</h1>
                    <p>This is a ${template.category} template</p>
                  </div>
                </body>
              </html>`,
            template
          };

        case 'json':
          return {
            type: 'json',
            content: {
              templateId,
              template,
              structure: {
                sections: template.layout.sections,
                columns: template.layout.columns,
                colorScheme: template.layout.colorScheme
              },
              customization: await this.getDefaultCustomization(templateId)
            }
          };

        case 'pdf':
          return {
            type: 'pdf',
            content: null, // PDF generation would happen elsewhere
            template,
            message: 'PDF generation requires additional processing'
          };

        case 'docx':
          return {
            type: 'docx',
            content: null, // DOCX generation would happen elsewhere  
            template,
            message: 'DOCX generation requires additional processing'
          };

        default:
          throw new Error(`Unsupported content type: ${contentType}`);
      }
    } catch (error) {
      console.error('Failed to get template content by type:', error);
      throw new Error(`Failed to get ${contentType} content for template ${templateId}`);
    }
  }

  /**
   * Get template content for preview rendering
   */
  static async getTemplatePreviewContent(
    templateId: string,
    sampleData?: any
  ): Promise<{
    html: string;
    css: string;
    data: any;
  }> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) throw new Error('Template not found');

      const defaultData = sampleData || this.getDefaultSampleData();
      
      return {
        html: this.generateTemplateHTML(template, defaultData),
        css: this.generateTemplateCSS(template),
        data: defaultData
      };
    } catch (error) {
      console.error('Failed to get template preview content:', error);
      throw new Error(`Failed to generate preview content for ${templateId}`);
    }
  }

  /**
   * Generate HTML for template preview
   */
  private static generateTemplateHTML(template: CVTemplate, data: any): string {
    return `
      <div class="cv-template" data-template="${template.id}">
        <header class="cv-header">
          <h1>${data.name || 'John Doe'}</h1>
          <p class="cv-title">${data.title || 'Professional Title'}</p>
          <div class="cv-contact">
            <span>${data.email || 'john@example.com'}</span>
            <span>${data.phone || '+1 (555) 123-4567'}</span>
          </div>
        </header>
        
        <main class="cv-content">
          <section class="cv-section">
            <h2>Professional Summary</h2>
            <p>${data.summary || 'Professional summary content goes here...'}</p>
          </section>
          
          <section class="cv-section">
            <h2>Work Experience</h2>
            <div class="cv-experience">
              <h3>Senior Position</h3>
              <p class="cv-company">Company Name • 2020-Present</p>
              <ul>
                <li>Achievement or responsibility example</li>
                <li>Another key accomplishment</li>
              </ul>
            </div>
          </section>
          
          <section class="cv-section">
            <h2>Education</h2>
            <div class="cv-education">
              <h3>Degree Name</h3>
              <p>University Name • Year</p>
            </div>
          </section>
          
          <section class="cv-section">
            <h2>Skills</h2>
            <div class="cv-skills">
              <span class="cv-skill">Skill 1</span>
              <span class="cv-skill">Skill 2</span>
              <span class="cv-skill">Skill 3</span>
            </div>
          </section>
        </main>
      </div>
    `;
  }

  /**
   * Generate CSS for template preview
   */
  private static generateTemplateCSS(template: CVTemplate): string {
    return `
      .cv-template {
        max-width: 210mm;
        margin: 0 auto;
        padding: 20mm;
        font-family: ${template.layout.typography}, sans-serif;
        background: white;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
      }
      
      .cv-header {
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #eee;
      }
      
      .cv-header h1 {
        font-size: 2.5em;
        margin: 0;
        color: #333;
      }
      
      .cv-title {
        font-size: 1.2em;
        color: #666;
        margin: 10px 0;
      }
      
      .cv-contact {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
      }
      
      .cv-section {
        margin-bottom: 25px;
      }
      
      .cv-section h2 {
        color: #2563eb;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 5px;
        margin-bottom: 15px;
      }
      
      .cv-experience,
      .cv-education {
        margin-bottom: 20px;
      }
      
      .cv-skills {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .cv-skill {
        background: #f3f4f6;
        padding: 5px 12px;
        border-radius: 15px;
        font-size: 0.9em;
      }
      
      .cv-company {
        color: #6b7280;
        font-style: italic;
        margin: 5px 0;
      }
      
      ${template.category === 'creative' ? `
        .cv-template { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .cv-header { border-bottom-color: rgba(255,255,255,0.3); }
        .cv-section h2 { color: #fbbf24; }
      ` : ''}
      
      ${template.category === 'minimal' ? `
        .cv-template { 
          font-family: 'Helvetica Neue', sans-serif;
          padding: 15mm;
        }
        .cv-header h1 { font-weight: 300; }
        .cv-section h2 { 
          font-weight: 400; 
          color: #111;
          border: none;
        }
      ` : ''}
    `;
  }

  /**
   * Get default sample data for preview
   */
  private static getDefaultSampleData(): any {
    return {
      name: 'Alex Johnson',
      title: 'Senior Software Engineer',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      summary: 'Experienced software engineer with 8+ years developing scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.',
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Solutions Inc.',
          period: '2020 - Present',
          achievements: [
            'Led development of microservices architecture reducing load times by 40%',
            'Mentored 5 junior developers and established code review processes',
            'Implemented CI/CD pipelines improving deployment efficiency by 60%'
          ]
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of California, Berkeley',
          year: '2016'
        }
      ],
      skills: [
        'JavaScript', 'React', 'Node.js', 'Python', 'AWS', 
        'Docker', 'MongoDB', 'PostgreSQL', 'Git', 'Agile'
      ]
    };
  }

  /**
   * Get default templates (mock data)
   */
  private static getDefaultTemplates(): CVTemplate[] {
    return [
      {
        id: 'professional-classic',
        name: 'Professional Classic',
        category: 'professional',
        description: 'Clean, traditional layout perfect for corporate environments',
        preview: '/templates/professional-classic/preview.jpg',
        thumbnail: '/templates/professional-classic/thumb.jpg',
        isPremium: false,
        features: ['ATS-friendly', 'Clean layout', 'Traditional formatting'],
        layout: {
          columns: 1,
          sections: ['header', 'summary', 'experience', 'education', 'skills'],
          colorScheme: 'light',
          typography: 'professional'
        },
        customization: {
          colors: true,
          fonts: true,
          layout: false,
          sections: true
        },
        tags: ['classic', 'corporate', 'traditional', 'ats'],
        popularity: 95,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'modern-creative',
        name: 'Modern Creative',
        category: 'creative',
        description: 'Contemporary design with creative flair for design professionals',
        preview: '/templates/modern-creative/preview.jpg',
        thumbnail: '/templates/modern-creative/thumb.jpg',
        isPremium: true,
        features: ['Creative layout', 'Color accents', 'Modern typography'],
        layout: {
          columns: 2,
          sections: ['header', 'portfolio', 'experience', 'skills', 'education'],
          colorScheme: 'color',
          typography: 'modern'
        },
        customization: {
          colors: true,
          fonts: true,
          layout: true,
          sections: true
        },
        tags: ['creative', 'modern', 'design', 'portfolio'],
        popularity: 87,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        category: 'minimal',
        description: 'Ultra-clean minimalist design focusing on content',
        preview: '/templates/minimal-clean/preview.jpg',
        thumbnail: '/templates/minimal-clean/thumb.jpg',
        isPremium: false,
        features: ['Minimalist', 'Space-efficient', 'Typography-focused'],
        layout: {
          columns: 1,
          sections: ['header', 'experience', 'education', 'skills'],
          colorScheme: 'light',
          typography: 'minimal'
        },
        customization: {
          colors: false,
          fonts: true,
          layout: false,
          sections: true
        },
        tags: ['minimal', 'clean', 'simple', 'elegant'],
        popularity: 78,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: 'tech-modern',
        name: 'Tech Modern',
        category: 'modern',
        description: 'Modern layout optimized for tech professionals',
        preview: '/templates/tech-modern/preview.jpg',
        thumbnail: '/templates/tech-modern/thumb.jpg',
        isPremium: true,
        features: ['Tech-focused', 'Skills highlight', 'Project showcase'],
        layout: {
          columns: 2,
          sections: ['header', 'skills', 'experience', 'projects', 'education'],
          colorScheme: 'color',
          typography: 'tech'
        },
        customization: {
          colors: true,
          fonts: true,
          layout: true,
          sections: true
        },
        tags: ['tech', 'modern', 'developer', 'projects'],
        popularity: 92,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-25')
      },
      {
        id: 'academic-formal',
        name: 'Academic Formal',
        category: 'academic',
        description: 'Formal academic layout for researchers and academics',
        preview: '/templates/academic-formal/preview.jpg',
        thumbnail: '/templates/academic-formal/thumb.jpg',
        isPremium: false,
        features: ['Publications section', 'Research focus', 'Academic formatting'],
        layout: {
          columns: 1,
          sections: ['header', 'education', 'research', 'publications', 'experience'],
          colorScheme: 'light',
          typography: 'academic'
        },
        customization: {
          colors: false,
          fonts: true,
          layout: false,
          sections: true
        },
        tags: ['academic', 'research', 'formal', 'publications'],
        popularity: 65,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-18')
      }
    ];
  }
}

// Export specific functions for easier importing
export const fetchTemplateContent = TemplateService.fetchTemplateContent.bind(TemplateService);
export const getTemplateContentByType = TemplateService.getTemplateContentByType.bind(TemplateService);
export const getTemplatePreviewContent = TemplateService.getTemplatePreviewContent.bind(TemplateService);
export const fetchCVTemplates = TemplateService.getAllTemplates.bind(TemplateService);

export default TemplateService;
