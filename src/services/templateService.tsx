// src/services/templateService.ts
import { CVTemplate, APIResponse } from '../types';

class TemplateService {
  private baseUrl = process.env.REACT_APP_API_URL || 'https://api.mocv.mu';
  private cacheDuration = 1000 * 60 * 30; // 30 minutes
  private cacheKey = 'mocv_templates_cache';

  // Mock templates for development
  private mockTemplates: CVTemplate[] = [
    {
      id: 'modern-professional',
      name: 'Modern Professional',
      description: 'Clean, modern design perfect for tech and business roles',
      category: 'modern',
      previewUrl: '/templates/modern-professional/preview.png',
      markdownUrl: '/templates/modern-professional/template.md',
      thumbnail: '/templates/modern-professional/thumb.png',
      features: ['ATS-friendly', 'Clean typography', 'Skills visualization', 'Project showcase'],
      difficulty: 'beginner',
      estimatedTime: '15 minutes',
      popularity: 95,
      tags: ['professional', 'tech', 'business', 'clean']
    },
    {
      id: 'creative-designer',
      name: 'Creative Designer',
      description: 'Vibrant design showcasing creativity and visual skills',
      category: 'creative',
      previewUrl: '/templates/creative-designer/preview.png',
      markdownUrl: '/templates/creative-designer/template.md',
      thumbnail: '/templates/creative-designer/thumb.png',
      features: ['Portfolio integration', 'Color customization', 'Visual elements', 'Creative layout'],
      difficulty: 'intermediate',
      estimatedTime: '25 minutes',
      popularity: 87,
      tags: ['creative', 'design', 'portfolio', 'visual']
    },
    {
      id: 'executive-classic',
      name: 'Executive Classic',
      description: 'Traditional, elegant design for senior roles and executives',
      category: 'classic',
      previewUrl: '/templates/executive-classic/preview.png',
      markdownUrl: '/templates/executive-classic/template.md',
      thumbnail: '/templates/executive-classic/thumb.png',
      features: ['Professional layout', 'Achievement focus', 'Leadership emphasis', 'Formal design'],
      difficulty: 'beginner',
      estimatedTime: '20 minutes',
      popularity: 82,
      tags: ['executive', 'classic', 'formal', 'leadership']
    },
    {
      id: 'minimal-tech',
      name: 'Minimal Tech',
      description: 'Minimalist design perfect for developers and tech professionals',
      category: 'minimal',
      previewUrl: '/templates/minimal-tech/preview.png',
      markdownUrl: '/templates/minimal-tech/template.md',
      thumbnail: '/templates/minimal-tech/thumb.png',
      features: ['Code-friendly', 'GitHub integration', 'Tech stack display', 'Minimal design'],
      difficulty: 'intermediate',
      estimatedTime: '20 minutes',
      popularity: 91,
      tags: ['tech', 'developer', 'minimal', 'github']
    },
    {
      id: 'startup-entrepreneur',
      name: 'Startup Entrepreneur',
      description: 'Dynamic design for entrepreneurs and startup founders',
      category: 'modern',
      previewUrl: '/templates/startup-entrepreneur/preview.png',
      markdownUrl: '/templates/startup-entrepreneur/template.md',
      thumbnail: '/templates/startup-entrepreneur/thumb.png',
      features: ['Venture showcase', 'Achievement metrics', 'Network display', 'Growth focus'],
      difficulty: 'advanced',
      estimatedTime: '30 minutes',
      popularity: 78,
      tags: ['startup', 'entrepreneur', 'business', 'growth']
    },
    {
      id: 'academic-researcher',
      name: 'Academic Researcher',
      description: 'Comprehensive template for academics and researchers',
      category: 'classic',
      previewUrl: '/templates/academic-researcher/preview.png',
      markdownUrl: '/templates/academic-researcher/template.md',
      thumbnail: '/templates/academic-researcher/thumb.png',
      features: ['Publication list', 'Research focus', 'Citation display', 'Academic format'],
      difficulty: 'advanced',
      estimatedTime: '35 minutes',
      popularity: 73,
      tags: ['academic', 'research', 'publications', 'education']
    },
    {
      id: 'healthcare-professional',
      name: 'Healthcare Professional',
      description: 'Professional template for healthcare and medical professionals',
      category: 'classic',
      previewUrl: '/templates/healthcare-professional/preview.png',
      markdownUrl: '/templates/healthcare-professional/template.md',
      thumbnail: '/templates/healthcare-professional/thumb.png',
      features: ['Certification focus', 'Clinical experience', 'Medical format', 'Trust building'],
      difficulty: 'beginner',
      estimatedTime: '25 minutes',
      popularity: 85,
      tags: ['healthcare', 'medical', 'professional', 'clinical']
    },
    {
      id: 'sales-marketing',
      name: 'Sales & Marketing',
      description: 'Results-focused template for sales and marketing professionals',
      category: 'modern',
      previewUrl: '/templates/sales-marketing/preview.png',
      markdownUrl: '/templates/sales-marketing/template.md',
      thumbnail: '/templates/sales-marketing/thumb.png',
      features: ['Metrics showcase', 'Achievement focus', 'ROI display', 'Growth charts'],
      difficulty: 'intermediate',
      estimatedTime: '22 minutes',
      popularity: 89,
      tags: ['sales', 'marketing', 'metrics', 'growth']
    }
  ];

  async fetchCVTemplates(): Promise<CVTemplate[]> {
    try {
      // Check cache first
      const cached = this.getCachedTemplates();
      if (cached && cached.length > 0) {
        return cached;
      }

      // In development, use mock data
      if (process.env.NODE_ENV === 'development') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.setCachedTemplates(this.mockTemplates);
        return this.mockTemplates;
      }

      // Production API call
      const response = await fetch(`${this.baseUrl}/api/templates`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<CVTemplate[]> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch templates');
      }

      // Cache the results
      this.setCachedTemplates(result.data);
      
      return result.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      
      // Fallback to mock data if API fails
      console.log('Falling back to mock templates');
      return this.mockTemplates;
    }
  }

  async getTemplate(id: string): Promise<CVTemplate> {
    const templates = await this.fetchCVTemplates();
    const template = templates.find(t => t.id === id);
    
    if (!template) {
      throw new Error(`Template with id ${id} not found`);
    }
    
    return template;
  }

  async downloadTemplate(id: string): Promise<Blob> {
    try {
      const template = await this.getTemplate(id);
      
      // In development, return mock markdown
      if (process.env.NODE_ENV === 'development') {
        const mockMarkdown = this.generateMockMarkdown(template);
        return new Blob([mockMarkdown], { type: 'text/markdown' });
      }

      const response = await fetch(template.markdownUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download template: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Error downloading template:', error);
      throw error;
    }
  }

  async fetchTemplateContent(markdownUrl: string): Promise<string> {
    try {
      // In development, return mock content
      if (process.env.NODE_ENV === 'development') {
        return this.generateMockMarkdownContent();
      }

      const response = await fetch(markdownUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch template content: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error fetching template content:', error);
      return this.generateMockMarkdownContent();
    }
  }

  // Search and filter methods
  searchTemplates(query: string, templates: CVTemplate[]): CVTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    
    return templates.filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      template.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  filterTemplatesByCategory(category: string, templates: CVTemplate[]): CVTemplate[] {
    if (category === 'all') return templates;
    return templates.filter(template => template.category === category);
  }

  filterTemplatesByDifficulty(difficulty: string, templates: CVTemplate[]): CVTemplate[] {
    if (difficulty === 'all') return templates;
    return templates.filter(template => template.difficulty === difficulty);
  }

  sortTemplates(templates: CVTemplate[], sortBy: 'popularity' | 'name' | 'newest'): CVTemplate[] {
    const sorted = [...templates];
    
    switch (sortBy) {
      case 'popularity':
        return sorted.sort((a, b) => b.popularity - a.popularity);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        // In a real app, you'd sort by creation date
        return sorted.reverse();
      default:
        return sorted;
    }
  }

  // Cache management
  private getCachedTemplates(): CVTemplate[] | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp > this.cacheDuration) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading template cache:', error);
      localStorage.removeItem(this.cacheKey);
      return null;
    }
  }

  private setCachedTemplates(templates: CVTemplate[]): void {
    try {
      const cacheData = {
        data: templates,
        timestamp: Date.now()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching templates:', error);
    }
  }

  clearCache(): void {
    localStorage.removeItem(this.cacheKey);
  }

  // Mock data generators
  private generateMockMarkdown(template: CVTemplate): string {
    return `# ${template.name} Template

## Description
${template.description}

## Features
${template.features.map(feature => `- ${feature}`).join('\n')}

## Template Structure

\`\`\`markdown
# {{personalInfo.fullName}}
## {{personalInfo.title}}

### Contact Information
- Email: {{personalInfo.email}}
- Phone: {{personalInfo.phone}}
- Location: {{personalInfo.location}}
- LinkedIn: {{personalInfo.linkedin}}

### Professional Summary
{{summary}}

### Experience
{{#each experience}}
#### {{title}} at {{company}}
*{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}*

{{description}}
{{/each}}

### Education
{{#each education}}
#### {{degree}}
**{{school}}** - {{graduationDate}}
{{/each}}

### Skills
{{#each skills}}
- {{name}} ({{level}}/5)
{{/each}}
\`\`\`

## Customization Options
- Color scheme
- Typography
- Section ordering
- Layout variations

## Tags
${template.tags.join(', ')}
`;
  }

  private generateMockMarkdownContent(): string {
    return `# {{personalInfo.fullName}}
## {{personalInfo.title}}

**Contact:** {{personalInfo.email}} | {{personalInfo.phone}} | {{personalInfo.location}}  
**LinkedIn:** {{personalInfo.linkedin}} {{#if personalInfo.website}}| **Website:** {{personalInfo.website}}{{/if}}

---

## Professional Summary
{{summary}}

---

## Professional Experience

{{#each experience}}
### {{title}}
**{{company}}** | {{location}} | {{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}

{{description}}

{{#if achievements}}
**Key Achievements:**
{{#each achievements}}
- {{this}}
{{/each}}
{{/if}}

{{/each}}

---

## Education

{{#each education}}
### {{degree}}
**{{school}}** | {{location}} | {{graduationDate}}
{{#if gpa}}GPA: {{gpa}}{{/if}}
{{#if honors}}**Honors:** {{honors}}{{/if}}

{{/each}}

---

## Technical Skills

{{#each skills}}
- **{{name}}:** {{level}}/5
{{/each}}

---

## Projects

{{#each projects}}
### {{name}}
{{description}}

**Technologies:** {{technologies}}
{{#if link}}**Link:** {{link}}{{/if}}
{{#if github}}**GitHub:** {{github}}{{/if}}

{{/each}}

---

## Certifications

{{#each certifications}}
- **{{name}}** - {{issuer}} ({{date}})
{{/each}}`;
  }

  // Analytics and insights
  getTemplateAnalytics(): { totalTemplates: number; categoryCounts: Record<string, number>; popularityAverage: number } {
    const templates = this.mockTemplates; // In production, this would be cached data
    
    const categoryCounts = templates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const popularityAverage = templates.reduce((sum, template) => sum + template.popularity, 0) / templates.length;
    
    return {
      totalTemplates: templates.length,
      categoryCounts,
      popularityAverage: Math.round(popularityAverage)
    };
  }

  // Featured templates
  getFeaturedTemplates(limit: number = 3): CVTemplate[] {
    return this.mockTemplates
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }

  // Template recommendations based on user profile
  getRecommendedTemplates(userProfile: { role?: string; industry?: string; experience?: string }): CVTemplate[] {
    // Simple recommendation logic - in production this would be more sophisticated
    const { role, industry, experience } = userProfile;
    
    let scored = this.mockTemplates.map(template => {
      let score = template.popularity;
      
      // Role-based scoring
      if (role) {
        if (role.toLowerCase().includes('developer') && template.tags.includes('tech')) score += 20;
        if (role.toLowerCase().includes('designer') && template.tags.includes('creative')) score += 20;
        if (role.toLowerCase().includes('manager') && template.tags.includes('executive')) score += 15;
      }
      
      // Industry-based scoring
      if (industry) {
        if (industry.toLowerCase().includes('tech') && template.tags.includes('tech')) score += 15;
        if (industry.toLowerCase().includes('healthcare') && template.tags.includes('healthcare')) score += 15;
        if (industry.toLowerCase().includes('startup') && template.tags.includes('startup')) score += 15;
      }
      
      // Experience-based scoring
      if (experience) {
        if (experience === 'entry' && template.difficulty === 'beginner') score += 10;
        if (experience === 'senior' && template.difficulty === 'advanced') score += 10;
      }
      
      return { ...template, recommendationScore: score };
    });
    
    return scored
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 4);
  }
}

// Export functions for easier importing
export const fetchCVTemplates = async (): Promise<CVTemplate[]> => {
  const service = new TemplateService();
  return service.fetchCVTemplates();
};

export const getTemplate = async (id: string): Promise<CVTemplate> => {
  const service = new TemplateService();
  return service.getTemplate(id);
};

export const downloadTemplate = async (id: string): Promise<Blob> => {
  const service = new TemplateService();
  return service.downloadTemplate(id);
};

export const fetchTemplateContent = async (markdownUrl: string): Promise<string> => {
  const service = new TemplateService();
  return service.fetchTemplateContent(markdownUrl);
};

export const getTemplateContentByType = async (templateId: string, type: 'markdown' | 'html' = 'markdown'): Promise<string> => {
  const service = new TemplateService();
  const template = await service.getTemplate(templateId);
  
  if (type === 'html') {
    // Convert markdown to HTML - simplified version
    const markdown = await service.fetchTemplateContent(template.markdownUrl);
    return markdown.replace(/^# (.+)$/gm, '<h1>$1</h1>')
                  .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                  .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.+?)\*/g, '<em>$1</em>')
                  .replace(/\n/g, '<br>');
  }
  
  return service.fetchTemplateContent(template.markdownUrl);
};

// Export the service class as default
export default TemplateService;
