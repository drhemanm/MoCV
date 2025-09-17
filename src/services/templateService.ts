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

export default TemplateService;
