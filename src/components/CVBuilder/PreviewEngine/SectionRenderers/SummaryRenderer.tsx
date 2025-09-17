// src/components/CVBuilder/PreviewEngine/SectionRenderers/SummaryRenderer.tsx
import React from 'react';
import { FileText, Quote } from 'lucide-react';
import { SectionRendererProps } from '../types';
import { useStyleSystem } from '../../StyleSystem/ThemeProvider';

interface SummaryRendererProps extends SectionRendererProps {
  data: string;
  showIcon?: boolean;
  showQuotes?: boolean;
  layout?: 'standard' | 'highlighted' | 'boxed' | 'minimal';
  maxLines?: number;
}

const SummaryRenderer: React.FC<SummaryRendererProps> = ({
  data,
  isVisible,
  showIcon = true,
  showQuotes = false,
  layout = 'standard',
  maxLines,
  className = '',
  style = {}
}) => {
  const { currentTheme } = useStyleSystem();

  if (!isVisible || !data || !data.trim()) return null;

  const sectionTitle = "Professional Summary";

  const renderSectionHeader = () => (
    <div className="flex items-center gap-3 mb-4">
      {showIcon && (
        <div 
          className="flex items-center justify-center w-8 h-8 rounded-full"
          style={{
            backgroundColor: 'var(--cv-color-primary)',
            color: 'white'
          }}
        >
          <FileText className="h-4 w-4" />
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

  const renderContent = () => {
    const contentStyle: React.CSSProperties = {
      fontSize: 'var(--cv-text-base)',
      fontFamily: 'var(--cv-font-body)',
      color: 'var(--cv-color-text-primary)',
      lineHeight: 'var(--cv-leading-relaxed)',
      ...(maxLines && {
        display: '-webkit-box',
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      })
    };

    if (showQuotes) {
      return (
        <div className="relative">
          <Quote 
            className="absolute -top-2 -left-2 h-8 w-8 opacity-20"
            style={{ color: 'var(--cv-color-primary)' }}
          />
          <p style={contentStyle} className="italic pl-6">
            "{data}"
          </p>
        </div>
      );
    }

    return (
      <p style={contentStyle}>
        {data}
      </p>
    );
  };

  const renderByLayout = () => {
    switch (layout) {
      case 'highlighted':
        return (
          <section 
            className={`cv-summary-section ${className}`}
            style={{
              padding: 'var(--cv-space-lg)',
              marginBottom: 'var(--cv-space-xl)',
              backgroundColor: 'var(--cv-color-surface)',
              border: `1px solid var(--cv-color-border)`,
              borderRadius: 'var(--cv-rounded-lg)',
              position: 'relative',
              ...style
            }}
          >
            <div 
              className="absolute top-0 left-0 w-full h-1"
              style={{
                backgroundColor: 'var(--cv-color-primary)',
                borderTopLeftRadius: 'var(--cv-rounded-lg)',
                borderTopRightRadius: 'var(--cv-rounded-lg)'
              }}
            />
            {renderSectionHeader()}
            {renderContent()}
          </section>
        );

      case 'boxed':
        return (
          <section 
            className={`cv-summary-section ${className}`}
            style={{
              padding: 'var(--cv-space-lg)',
              marginBottom: 'var(--cv-space-xl)',
              backgroundColor: 'var(--cv-color-background)',
              border: `2px solid var(--cv-color-primary)`,
              borderRadius: 'var(--cv-rounded-md)',
              boxShadow: 'var(--cv-shadow-sm)',
              ...style
            }}
          >
            {renderSectionHeader()}
            {renderContent()}
          </section>
        );

      case 'minimal':
        return (
          <section 
            className={`cv-summary-section ${className}`}
            style={{
              marginBottom: 'var(--cv-space-xl)',
              ...style
            }}
          >
            <h2 
              className="font-medium mb-3"
              style={{
                fontSize: 'var(--cv-text-lg)',
                fontFamily: 'var(--cv-font-heading)',
                fontWeight: 'var(--cv-font-medium)',
                color: 'var(--cv-color-text-primary)'
              }}
            >
              {sectionTitle}
            </h2>
            {renderContent()}
          </section>
        );

      case 'standard':
      default:
        return (
          <section 
            className={`cv-summary-section ${className}`}
            style={{
              marginBottom: 'var(--cv-space-xl)',
              ...style
            }}
          >
            {renderSectionHeader()}
            <div 
              style={{
                paddingLeft: showIcon ? 'var(--cv-space-lg)' : '0'
              }}
            >
              {renderContent()}
            </div>
          </section>
        );
    }
  };

  return renderByLayout();
};

export default SummaryRenderer;
