// src/components/CVBuilder/PreviewEngine/SectionRenderers/EducationRenderer.tsx
import React from 'react';
import { GraduationCap, Calendar, MapPin, School, Award } from 'lucide-react';
import { SectionRendererProps } from '../types';
import { useStyleSystem } from '../../StyleSystem/ThemeProvider';

interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

interface EducationRendererProps extends SectionRendererProps {
  data: EducationItem[];
  showIcon?: boolean;
  layout?: 'standard' | 'timeline' | 'compact' | 'detailed';
  showLocation?: boolean;
  showGPA?: boolean;
  dateFormat?: 'full' | 'short' | 'year-only';
}

const EducationRenderer: React.FC<EducationRendererProps> = ({
  data,
  isVisible,
  showIcon = true,
  layout = 'standard',
  showLocation = true,
  showGPA = true,
  dateFormat = 'year-only',
  className = '',
  style = {}
}) => {
  const { currentTheme } = useStyleSystem();

  if (!isVisible || !data || data.length === 0) return null;

  const sectionTitle = "Education";

  const formatDate = (dateString: string, format: 'full' | 'short' | 'year-only') => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    switch (format) {
      case 'full':
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });
      case 'short':
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
      case 'year-only':
      default:
        return date.getFullYear().toString();
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
          <GraduationCap className="h-4 w-4" />
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

  const renderEducationItem = (item: EducationItem, index: number) => {
    const graduationYear = formatDate(item.graduationDate, dateFormat);

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
                backgroundColor: 'var(--cv-color-background)',
                borderColor: 'var(--cv-color-primary)'
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
                    color: 'var(--cv-color-text-primary)'
                  }}
                >
                  {item.degree}
                </h3>
                <div className="flex items-center gap-4 text-sm mt-1">
                  <div className="flex items-center gap-1">
                    <School className="h-3 w-3" style={{ color: 'var(--cv-color-primary)' }} />
                    <span 
                      className="font-medium"
                      style={{ 
                        color: 'var(--cv-color-primary)',
                        fontFamily: 'var(--cv-font-body)'
                      }}
                    >
                      {item.school}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" style={{ color: 'var(--cv-color-text-secondary)' }} />
                    <span style={{ color: 'var(--cv-color-text-secondary)' }}>
                      {graduationYear}
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
                  {showGPA && item.gpa && (
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3" style={{ color: 'var(--cv-color-accent)' }} />
                      <span style={{ color: 'var(--cv-color-accent)' }}>
                        GPA: {item.gpa}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'compact':
        return (
          <div key={item.id} className="mb-3 pb-3 border-b" style={{ borderColor: 'var(--cv-color-border)' }}>
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
                  {item.degree}
                </h3>
                <div className="flex items-center gap-3 text-sm mt-1">
                  <span style={{ color: 'var(--cv-color-primary)' }}>
                    {item.school}
                  </span>
                  <span style={{ color: 'var(--cv-color-border)' }}>•</span>
                  <span style={{ color: 'var(--cv-color-text-secondary)' }}>
                    {graduationYear}
                  </span>
                  {showGPA && item.gpa && (
                    <>
                      <span style={{ color: 'var(--cv-color-border)' }}>•</span>
                      <span style={{ color: 'var(--cv-color-accent)' }}>
                        {item.gpa}
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
            className="mb-6 p-4 rounded-lg"
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
                    color: 'var(--cv-color-text-primary)'
                  }}
                >
                  {item.degree}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <School className="h-4 w-4" style={{ color: 'var(--cv-color-primary)' }} />
                  <span 
                    className="font-semibold"
                    style={{ 
                      fontSize: 'var(--cv-text-lg)',
                      color: 'var(--cv-color-primary)',
                      fontFamily: 'var(--cv-font-heading)'
                    }}
                  >
                    {item.school}
                  </span>
                </div>
              </div>
              {showGPA && item.gpa && (
                <div 
                  className="px-3 py-1 text-sm font-medium rounded-full"
                  style={{
                    backgroundColor: 'var(--cv-color-accent)',
                    color: 'white'
                  }}
                >
                  GPA: {item.gpa}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" style={{ color: 'var(--cv-color-text-secondary)' }} />
                <span style={{ color: 'var(--cv-color-text-secondary)' }}>
                  Graduated {graduationYear}
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
        );

      case 'standard':
      default:
        return (
          <div key={item.id} className="mb-5">
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
                  {item.degree}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <School className="h-4 w-4" style={{ color: 'var(--cv-color-primary)' }} />
                  <span 
                    className="font-medium"
                    style={{ 
                      fontSize: 'var(--cv-text-base)',
                      color: 'var(--cv-color-primary)',
                      fontFamily: 'var(--cv-font-body)'
                    }}
                  >
                    {item.school}
                  </span>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="flex items-center gap-1 justify-end">
                  <Calendar className="h-3 w-3" style={{ color: 'var(--cv-color-text-secondary)' }} />
                  <span style={{ color: 'var(--cv-color-text-secondary)' }}>
                    {graduationYear}
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
                {showGPA && item.gpa && (
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Award className="h-3 w-3" style={{ color: 'var(--cv-color-accent)' }} />
                    <span style={{ color: 'var(--cv-color-accent)' }}>
                      GPA: {item.gpa}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section 
      className={`cv-education-section ${className}`}
      style={{
        marginBottom: 'var(--cv-space-xl)',
        ...style
      }}
    >
      {renderSectionHeader()}
      <div style={{ paddingLeft: showIcon && layout !== 'timeline' ? 'var(--cv-space-lg)' : '0' }}>
        {data.map((item, index) => renderEducationItem(item, index))}
      </div>
    </section>
  );
};

export default EducationRenderer;
