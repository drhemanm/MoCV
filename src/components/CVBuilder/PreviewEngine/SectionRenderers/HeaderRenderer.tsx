// src/components/CVBuilder/PreviewEngine/SectionRenderers/HeaderRenderer.tsx
import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, User } from 'lucide-react';
import { SectionRendererProps } from '../types';
import { useStyleSystem } from '../../StyleSystem/ThemeProvider';

interface HeaderData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  photo?: string;
}

interface HeaderRendererProps extends SectionRendererProps {
  data: HeaderData;
  layout?: 'left-aligned' | 'centered' | 'right-aligned' | 'split';
  showPhoto?: boolean;
  photoPosition?: 'left' | 'right' | 'top';
  photoSize?: 'small' | 'medium' | 'large';
  showIcons?: boolean;
}

const HeaderRenderer: React.FC<HeaderRendererProps> = ({
  data,
  isVisible,
  layout = 'left-aligned',
  showPhoto = true,
  photoPosition = 'right',
  photoSize = 'medium',
  showIcons = true,
  className = '',
  style = {}
}) => {
  const { currentTheme } = useStyleSystem();

  if (!isVisible) return null;

  const photoSizes = {
    small: '80px',
    medium: '120px',
    large: '160px'
  };

  const contactItems = [
    { 
      icon: Mail, 
      value: data.email, 
      href: `mailto:${data.email}`,
      label: 'Email'
    },
    { 
      icon: Phone, 
      value: data.phone, 
      href: `tel:${data.phone}`,
      label: 'Phone'
    },
    { 
      icon: MapPin, 
      value: data.location,
      label: 'Location'
    },
    { 
      icon: Linkedin, 
      value: data.linkedin, 
      href: data.linkedin.startsWith('http') ? data.linkedin : `https://linkedin.com/in/${data.linkedin}`,
      label: 'LinkedIn'
    },
    { 
      icon: Globe, 
      value: data.website, 
      href: data.website.startsWith('http') ? data.website : `https://${data.website}`,
      label: 'Website'
    }
  ].filter(item => item.value && item.value.trim());

  const renderPhoto = () => {
    if (!showPhoto) return null;

    return (
      <div 
        className="flex-shrink-0"
        style={{
          width: photoSizes[photoSize],
          height: photoSizes[photoSize]
        }}
      >
        {data.photo ? (
          <img
            src={data.photo}
            alt={data.fullName}
            className="w-full h-full object-cover"
            style={{
              borderRadius: 'var(--cv-rounded-lg)',
              border: `2px solid var(--cv-color-border)`
            }}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundColor: 'var(--cv-color-surface)',
              borderRadius: 'var(--cv-rounded-lg)',
              border: `2px solid var(--cv-color-border)`,
              color: 'var(--cv-color-text-muted)'
            }}
          >
            <User className="w-1/2 h-1/2" />
          </div>
        )}
      </div>
    );
  };

  const renderNameAndTitle = () => (
    <div className={`${layout === 'centered' ? 'text-center' : layout === 'right-aligned' ? 'text-right' : 'text-left'}`}>
      {data.fullName && (
        <h1 
          className="font-bold leading-tight mb-2"
          style={{
            fontSize: 'var(--cv-text-4xl)',
            fontFamily: 'var(--cv-font-heading)',
            fontWeight: 'var(--cv-font-bold)',
            color: 'var(--cv-color-text-primary)',
            lineHeight: 'var(--cv-leading-tight)'
          }}
        >
          {data.fullName}
        </h1>
      )}
      {data.title && (
        <h2 
          className="font-medium mb-4"
          style={{
            fontSize: 'var(--cv-text-xl)',
            fontFamily: 'var(--cv-font-heading)',
            fontWeight: 'var(--cv-font-medium)',
            color: 'var(--cv-color-primary)',
            lineHeight: 'var(--cv-leading-normal)'
          }}
        >
          {data.title}
        </h2>
      )}
    </div>
  );

  const renderContactInfo = () => {
    if (!contactItems.length) return null;

    const contactGrid = layout === 'centered' ? 'justify-center' : layout === 'right-aligned' ? 'justify-end' : 'justify-start';
    const textAlign = layout === 'centered' ? 'text-center' : layout === 'right-aligned' ? 'text-right' : 'text-left';

    return (
      <div className={`flex flex-wrap gap-4 ${contactGrid} ${textAlign}`}>
        {contactItems.map((item, index) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-center gap-2">
              {showIcons && (
                <Icon 
                  className="h-4 w-4 flex-shrink-0" 
                  style={{ color: 'var(--cv-color-primary)' }}
                />
              )}
              <span 
                style={{
                  fontSize: 'var(--cv-text-sm)',
                  fontFamily: 'var(--cv-font-body)',
                  color: 'var(--cv-color-text-secondary)',
                  lineHeight: 'var(--cv-leading-normal)'
                }}
              >
                {item.value}
              </span>
            </div>
          );

          return item.href ? (
            <a
              key={index}
              href={item.href}
              className="hover:opacity-80 transition-opacity"
              aria-label={item.label}
              style={{ textDecoration: 'none' }}
            >
              {content}
            </a>
          ) : (
            <div key={index}>
              {content}
            </div>
          );
        })}
      </div>
    );
  };

  // Layout-specific rendering
  const renderSplitLayout = () => (
    <div className="flex items-start justify-between gap-8">
      <div className="flex-1">
        {renderNameAndTitle()}
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-4">
        {renderPhoto()}
        <div className="text-right">
          {renderContactInfo()}
        </div>
      </div>
    </div>
  );

  const renderStandardLayout = () => {
    const isPhotoLeft = photoPosition === 'left';
    const isPhotoTop = photoPosition === 'top';

    if (isPhotoTop) {
      return (
        <div className={`${layout === 'centered' ? 'text-center' : ''}`}>
          <div className={`mb-6 ${layout === 'centered' ? 'flex justify-center' : layout === 'right-aligned' ? 'flex justify-end' : ''}`}>
            {renderPhoto()}
          </div>
          {renderNameAndTitle()}
          {renderContactInfo()}
        </div>
      );
    }

    return (
      <div className={`flex items-start gap-8 ${isPhotoLeft ? '' : 'flex-row-reverse'}`}>
        {renderPhoto()}
        <div className="flex-1">
          {renderNameAndTitle()}
          {renderContactInfo()}
        </div>
      </div>
    );
  };

  return (
    <header 
      className={`cv-header-section ${className}`}
      style={{
        padding: 'var(--cv-space-lg)',
        marginBottom: 'var(--cv-space-xl)',
        borderBottom: `1px solid var(--cv-color-border)`,
        ...style
      }}
    >
      {layout === 'split' ? renderSplitLayout() : renderStandardLayout()}
    </header>
  );
};

export default HeaderRenderer;
