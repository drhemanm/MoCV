// src/components/CVBuilder/PreviewEngine/SectionRenderers/ExperienceRenderer.tsx
import React from 'react';
import { Briefcase, Calendar, MapPin, Building } from 'lucide-react';
import { SectionRendererProps } from '../types';
import { useStyleSystem } from '../../StyleSystem/ThemeProvider';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ExperienceRendererProps extends SectionRendererProps {
  data: ExperienceItem[];
  showIcon?: boolean;
  layout?: 'standard' | 'timeline' | 'compact' | 'detailed';
  dateFormat?: 'full' | 'short' | 'year-only';
  showLocation?: boolean;
  highlightCurrent?: boolean;
}

const ExperienceRenderer: React.FC<ExperienceRendererProps> = ({
  data,
  isVisible,
  showIcon = true,
  layout = 'standard',
  dateFormat = 'short',
  showLocation = true,
  highlightCurrent = true,
  className = '',
  style = {}
}) => {
  const { currentTheme } = useStyleSystem();

  if (!isVisible || !data || data.length === 0) return null;

  const sectionTitle = "Work Experience";

  const formatDate = (dateString: string, format: 'full' | 'short' | 'year-only') => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    switch (format) {
      case 'full':
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });
      case 'year-only':
        return date.getFullYear().toString();
      case 'short':
      default:
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
    }
  };

  const renderSectionHeader = () => (
    <div className="flex items-center gap-3 mb-6">
      {showIcon && (
        <div 
          className="flex items-center justify-center w-8 h-8 rounded-full"
          style={{
            backgroundColor: 'var(--cv-color-primary)',
            color: 'white'
          }}
        >
          <Briefcase className="h-4 w-4" />
        </div>
      )}
      <h2 
        className="font-semibold uppercase tracking-wide"
        style={{
          fontSize: 'var(--cv-text-lg)',
          fontFamily: 'var(--cv-font-heading)',
          fontWeight: 'var(--cv-font-semibold)',
          color: 'var(--cv-color-primary)',
          letterSpacing: '0.05em'
        }}
      >
        {sectionTitle}
      </h2>
      <div 
        className="flex-1 h-px"
        style={{ backgroundColor: 'var(--cv-color-border)' }}
      />
    </div>
  );

  const renderExperienceItem = (item: ExperienceItem, index: number) => {
    const isCurrentJob = item.current;
    const dateRange = `${formatDate(item.startDate, dateFormat)} - ${
      isCurrentJob ? 'Present' : formatDate(item.endDate, dateFormat)
    }`;

    switch (layout) {
      case 'timeline':
        return (
          <div key={item.id} className="relative">
            {/* Timeline line */}
            {index < data.length - 1 && (
              <div 
                className="absolute left-4 top-12 bottom-0 w-px"
                style={{ backgroundColor: 'var(--cv-color-border)' }}
              />
            )}
            
            {/* Timeline dot */}
            <div 
              className="absolute left-2 top-3 w-4 h-4 rounded-full border-2"
              style={{
                backgroundColor: isCurrentJob && highlightCurrent 
                  ? 'var(--cv-color-accent)' 
                  : 'var(--cv-color-background)',
                borderColor: isCurrentJob && highlightCurrent 
                  ? 'var(--cv-color-accent)' 
                  : 'var(--cv-color-border)'
              }}
            />
            
            <div className="ml-8 pb-8">
              <div className="mb-2">
                <h3 
                  className="font-semibold"
                  style={{
                    fontSize: 'var(--cv-text-lg)',
                    fontFamily: 'var(--cv-font-heading)',
                    fontWeight: 'var(--cv-font-semibold)',
                    color: isCurrentJob && highlightCurrent 
                      ? 'var(--cv-color-accent)' 
                      : 'var(--cv-color-text-primary)'
                  }}
                >
                  {item.title}
                </h3>
                <div className="flex items-center gap-4 text-sm mt-1">
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3" style={{ color: 'var(--cv-color-primary)' }} />
                    <span 
                      className="font-medium"
                      style={{ 
                        color: 'var(--cv-color-primary)',
                        fontFamily: 'var(--cv-font-body)'
                      }}
                    >
                      {item.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" style={{ color: 'var(--cv-color-text-secondary)' }} />
                    <span style={{ color: 'var(--cv-color-text-secondary)' }}>
                      {dateRange}
                    </span>
                  </div>
                  {showLocation && item.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" style={{ color: 'var(--cv-color-text-secondary)' }} />
                      <span style={{ color: 'var(--cv-color-text-secondary)' }}>
                        {item.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {item.description && (
                <div 
                  className="prose prose-sm"
                  style={{
                    fontSize: 'var(--cv-text-sm)',
                    fontFamily: 'var(--cv-font-body)',
                    color: 'var(--cv-color-text-primary)',
                    lineHeight: 'var(--cv-leading-relaxed)'
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: item.description.replace(/\n/g, '<br />') 
                  }}
                />
              )}
            </div>
          </div>
        );

      case 'compact':
        return (
          <div key={item.id} className="mb-4 pb-4 border-b" style={{ borderColor: 'var(--cv-color-border)' }}>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 
                  className="font-semibold"
                  style={{
                    fontSize: 'var(--cv-text-base)',
                    fontFamily: 'var(--cv-font-heading)',
                    fontWeight: 'var(--cv-font-semibold)',
                    color: 'var(--cv-color-text-primary)'
                  }}
                >
                  {item.title} at {item.company}
                </h3>
                <div className="flex items-center gap-3 text-sm mt-1">
                  <span style={{ color: 'var(--cv-color-text-secondary)' }}>
                    {dateRange}
                  </span>
                  {showLocation && item.location && (
                    <>
                      <span style={{ color: 'var(--cv-color-border)' }}>•</span>
                      <span style={{ color: 'var(--cv-color-text-secondary)' }}>
                        {item.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'detailed':
        return (
          <div 
            key={item.id} 
            className="mb-8 p-4 rounded-lg"
            style={{
              backgroundColor: 'var(--cv-color-surface)',
              border: `1px solid var(--cv-color-border)`
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 
                  className="font-bold mb-1"
                  style={{
                    fontSize: 'var(--cv-text-xl)',
                    fontFamily: 'var(--cv-font-heading)',
                    fontWeight: 'var(--cv-font-bold)',
                    color: isCurrentJob && highlightCurrent 
                      ? 'var(--cv-color-accent)' 
                      : 'var(--cv-color-text-primary)'
                  }}
                >
                  {item.title}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Building className="h-4 w-4" style={{ color: 'var(--cv-color-primary)' }} />
                  <span 
                    className="font-semibold"
                    style={{ 
                      fontSize: 'var(--cv-text-lg)',
                      color: 'var(--cv-color-primary)',
                      fontFamily: 'var(--cv-font-heading)'
                    }}
                  >
                    {item.company}
                  </span>
                </div>
              </div>
              {isCurrentJob && highlightCurrent && (
                <div 
                  className="px-2 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: 'var(--cv-color-accent)',
                    color: 'white'
                  }}
                >
                  Current
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" style={{ color: 'var(--cv-color-text-secondary)' }} />
                <span style={{ color: 'var(--cv-color-text-secondary)' }}>
                  {dateRange}
                </span>
              </div>
              {showLocation && item.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" style={{ color: 'var(--cv-color-text-secondary)' }} />
                  <span style={{ color: 'var(--cv-color-text-secondary)' }}>
                    {item.location}
                  </span>
                </div>
              )}
            </div>
            
            {item.description && (
              <div 
                className="prose prose-sm"
                style={{
                  fontSize: 'var(--cv-text-sm)',
                  fontFamily: 'var(--cv-font-body)',
                  color: 'var(--cv-color-text-primary)',
                  lineHeight: 'var(--cv-leading-relaxed)'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: item.description.replace(/\n/g, '<br />') 
                }}
              />
            )}
          </div>
        );

      case 'standard':
      default:
        return (
          <div key={item.id} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 
                  className="font-semibold"
                  style={{
                    fontSize: 'var(--cv-text-lg)',
                    fontFamily: 'var(--cv-font-heading)',
                    fontWeight: 'var(--cv-font-semibold)',
                    color: 'var(--cv-color-text-primary)'
                  }}
                >
                  {item.title}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <Building className="h-4 w-4" style={{ color: 'var(--cv-color-primary)' }} />
                  <span 
                    className="font-medium"
                    style={{ 
                      fontSize: 'var(--cv-text-base)',
                      color: 'var(--cv-color-primary)',
                      fontFamily: 'var(--cv-font-body)'
                    }}
                  >
                    {item.company}
                  </span>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="flex items-center gap-1 justify-end">
                  <Calendar className="h-3 w-3" style={{ color: 'var(--cv-color-text-secondary)' }} />
                  <span style={{ color: 'var(--cv-color-text-secondary)' }}>
                    {dateRange}
                  </span>
                </div>
                {showLocation && item.location && (
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <MapPin className="h-3 w-3" style={{ color: 'var(--cv-color-text-secondary)' }} />
                    <span style={{ color: 'var(--cv-color-text-secondary)' }}>
                      {item.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {item.description && (
              <div 
                className="mt-2"
                style={{
                  fontSize: 'var(--cv-text-sm)',
                  fontFamily: 'var(--cv-font-body)',
                  color: 'var(--cv-color-text-primary)',
                  lineHeight: 'var(--cv-leading-relaxed)',
                  paddingLeft: showIcon ? 'var(--cv-space-lg)' : '0'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: item.description.replace(/\n/g, '<br />') 
                }}
              />
            )}
          </div>
        );
    }
  };

  return (
    <section 
      className={`cv-experience-section ${className}`}
      style={{
        marginBottom: 'var(--cv-space-xl)',
        ...style
      }}
    >
      {renderSectionHeader()}
      <div style={{ paddingLeft: showIcon && layout !== 'timeline' ? 'var(--cv-space-lg)' : '0' }}>
        {data.map((item, index) => renderExperienceItem(item, index))}
      </div>
    </section>
  );
};

export default ExperienceRenderer;
