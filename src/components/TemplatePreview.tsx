// src/components/TemplatePreview.tsx
import React, { useState, useEffect } from 'react';
import { X, Download, Eye, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { fetchTemplateContent, getTemplateContentByType } from '../services/templateService';

interface TemplatePreviewProps {
  templateId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (templateId: string) => void;
  cvData?: any; // Optional CV data for personalized preview
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  templateId,
  isOpen,
  onClose,
  onSelectTemplate,
  cvData
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templateContent, setTemplateContent] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Load template content when modal opens
  useEffect(() => {
    if (isOpen && templateId) {
      loadTemplateContent();
    }
  }, [isOpen, templateId]);

  const loadTemplateContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get template content
      const content = await getTemplateContentByType(templateId, 'html');
      setTemplateContent(content);
    } catch (err) {
      console.error('Failed to load template:', err);
      setError('Failed to load template preview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // This would generate and download PDF
      console.log('Downloading PDF for template:', templateId);
      // Implementation would go here
      alert('PDF download feature coming soon!');
    } catch (err) {
      console.error('PDF download failed:', err);
    }
  };

  const handleSelectTemplate = () => {
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Eye className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Template Preview
              </h2>
              <p className="text-sm text-gray-500">
                {templateContent?.template?.name || 'Loading...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Preview Mode Toggles */}
            <div className="hidden md:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    previewMode === mode
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Preview Area */}
          <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
            {loading ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-gray-600">Loading template preview...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center space-y-4 text-center max-w-md">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Preview Error
                  </h3>
                  <p className="text-gray-600">{error}</p>
                  <button
                    onClick={loadTemplateContent}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className={`bg-white shadow-xl transition-all duration-300 ${
                previewMode === 'desktop' ? 'w-full max-w-4xl' :
                previewMode === 'tablet' ? 'w-full max-w-2xl' :
                'w-full max-w-sm'
              }`}>
                {/* Template Preview Frame */}
                <div 
                  className="w-full h-full min-h-[600px] border border-gray-200 rounded-lg overflow-auto"
                  style={{ 
                    aspectRatio: previewMode === 'mobile' ? '9/16' : 
                                previewMode === 'tablet' ? '3/4' : 'auto'
                  }}
                >
                  {templateContent ? (
                    <div className="p-8">
                      {/* Mock CV Preview Content */}
                      <TemplatePreviewContent 
                        template={templateContent.template}
                        cvData={cvData}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No preview available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar with Actions */}
          <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Template Info */}
              {templateContent?.template && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {templateContent.template.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {templateContent.template.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="capitalize font-medium">
                        {templateContent.template.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Layout:</span>
                      <span className="font-medium">
                        {templateContent.template.layout.columns} Column
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium">
                        {templateContent.template.isPremium ? 'Premium' : 'Free'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Features */}
              {templateContent?.template?.features && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                  <ul className="space-y-2">
                    {templateContent.template.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSelectTemplate}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Use This Template
                </button>
                
                <button
                  onClick={handleDownloadPDF}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Sample PDF</span>
                </button>
                
                <button
                  onClick={() => window.open(`/templates/${templateId}/preview`, '_blank')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in New Tab</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template Preview Content Component
const TemplatePreviewContent: React.FC<{
  template: any;
  cvData?: any;
}> = ({ template, cvData }) => {
  const sampleData = cvData || {
    name: 'Sarah Johnson',
    title: 'Senior Product Manager',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    website: 'sarahjohnson.dev'
  };

  return (
    <div className={`cv-preview cv-preview-${template.id}`}>
      <style jsx>{`
        .cv-preview {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #1f2937;
        }
        
        .cv-preview-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .cv-preview-name {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: ${template.category === 'creative' ? '#7c3aed' : 
                    template.category === 'modern' ? '#2563eb' : '#1f2937'};
        }
        
        .cv-preview-title {
          font-size: 1.25rem;
          color: #6b7280;
          margin: 0 0 1rem 0;
        }
        
        .cv-preview-contact {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 0.9rem;
          color: #4b5563;
        }
        
        .cv-preview-section {
          margin-bottom: 2rem;
        }
        
        .cv-preview-section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: ${template.category === 'creative' ? '#7c3aed' : 
                    template.category === 'modern' ? '#2563eb' : '#1f2937'};
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .cv-preview-item {
          margin-bottom: 1.5rem;
        }
        
        .cv-preview-item-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
        }
        
        .cv-preview-item-meta {
          color: #6b7280;
          font-style: italic;
          margin: 0 0 0.5rem 0;
        }
        
        .cv-preview-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .cv-preview-skill {
          background: ${template.category === 'creative' ? '#f3e8ff' : 
                        template.category === 'modern' ? '#dbeafe' : '#f3f4f6'};
          color: ${template.category === 'creative' ? '#7c3aed' : 
                   template.category === 'modern' ? '#2563eb' : '#374151'};
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
        }
      `}</style>

      {/* Header */}
      <div className="cv-preview-header">
        <h1 className="cv-preview-name">{sampleData.name}</h1>
        <p className="cv-preview-title">{sampleData.title}</p>
        <div className="cv-preview-contact">
          <span>{sampleData.email}</span>
          <span>•</span>
          <span>{sampleData.phone}</span>
          <span>•</span>
          <span>{sampleData.location}</span>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="cv-preview-section">
        <h2 className="cv-preview-section-title">Professional Summary</h2>
        <p>
          Experienced Product Manager with 8+ years driving product strategy and execution 
          for leading tech companies. Proven track record of launching successful products 
          that generate $50M+ in annual revenue while leading cross-functional teams of 15+ members.
        </p>
      </div>

      {/* Experience */}
      <div className="cv-preview-section">
        <h2 className="cv-preview-section-title">Professional Experience</h2>
        
        <div className="cv-preview-item">
          <h3 className="cv-preview-item-title">Senior Product Manager</h3>
          <p className="cv-preview-item-meta">TechCorp Solutions • 2020 - Present</p>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>Led product strategy for B2B SaaS platform serving 10,000+ customers</li>
            <li>Increased user engagement by 45% through data-driven feature development</li>
            <li>Managed $5M product budget and coordinated releases across 3 engineering teams</li>
          </ul>
        </div>
        
        <div className="cv-preview-item">
          <h3 className="cv-preview-item-title">Product Manager</h3>
          <p className="cv-preview-item-meta">Innovation Labs • 2018 - 2020</p>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>Launched 3 major product features resulting in 30% revenue growth</li>
            <li>Conducted user research with 500+ customers to inform product roadmap</li>
          </ul>
        </div>
      </div>

      {/* Education */}
      <div className="cv-preview-section">
        <h2 className="cv-preview-section-title">Education</h2>
        <div className="cv-preview-item">
          <h3 className="cv-preview-item-title">MBA, Business Administration</h3>
          <p className="cv-preview-item-meta">Stanford Graduate School of Business • 2018</p>
        </div>
        <div className="cv-preview-item">
          <h3 className="cv-preview-item-title">Bachelor of Science, Computer Science</h3>
          <p className="cv-preview-item-meta">UC Berkeley • 2014</p>
        </div>
      </div>

      {/* Skills */}
      <div className="cv-preview-section">
        <h2 className="cv-preview-section-title">Core Skills</h2>
        <div className="cv-preview-skills">
          <span className="cv-preview-skill">Product Strategy</span>
          <span className="cv-preview-skill">User Research</span>
          <span className="cv-preview-skill">Data Analysis</span>
          <span className="cv-preview-skill">A/B Testing</span>
          <span className="cv-preview-skill">Agile/Scrum</span>
          <span className="cv-preview-skill">SQL</span>
          <span className="cv-preview-skill">Figma</span>
          <span className="cv-preview-skill">JIRA</span>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
