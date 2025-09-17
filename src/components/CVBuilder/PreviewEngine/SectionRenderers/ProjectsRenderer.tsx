// src/components/CVBuilder/PreviewEngine/SectionRenderers/ProjectsRenderer.tsx
import React from 'react';
import { FolderOpen, ExternalLink, Code2, Github, Globe } from 'lucide-react';
import { SectionRendererProps } from '../types';
import { useStyleSystem } from '../../StyleSystem/ThemeProvider';

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface ProjectsRendererProps extends SectionRendererProps {
  data: ProjectItem[];
  showIcon?: boolean;
  layout?: 'grid' | 'list' | 'compact' | 'detailed';
  showTechnologies?: boolean;
  showLinks?: boolean;
  columns?: number;
}

const ProjectsRenderer: React.FC<ProjectsRendererProps> = ({
  data,
  isVisible,
  showIcon = true,
  layout = 'list',
  showTechnologies = true,
  showLinks = true,
  columns = 2,
  className = '',
  style = {}
}) => {
  const { currentTheme } = useStyleSystem();

  if (!isVisible || !data || data.length === 0) return null;

  const sectionTitle = "Projects";

  const getLinkIcon = (url: string) => {
    if (url.includes('github.com')) return Github;
    return Globe;
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
          <FolderOpen className="h-4 w-4" />
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

  const renderTechnologies = (technologies: string[]) => {
    if (!showTechnologies || !technologies.length) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {technologies.map((tech, index) => (
          <span 
            key={index}
            className="px-2 py-1 text-xs font-medium rounded"
            style={{
              backgroundColor: 'var(--cv-color-surface)',
              color: 'var(--cv-color-text-secondary)',
              border: `1px solid var(--cv-color-border)`
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    );
  };

  const renderProjectLink = (project: ProjectItem) => {
    if (!showLinks || !project.link) return null;

    const LinkIcon = getLinkIcon(project.link);

    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm hover:opacity-80 transition-opacity"
        style={{ color: 'var(--cv-color-primary)' }}
      >
        <LinkIcon className="h-3 w-3" />
        <span>View Project</span>
        <ExternalLink className="h-2 w-2" />
      </a>
    );
  };

  const renderProjectItem = (project: ProjectItem) => {
    switch (layout) {
      case 'grid':
        return (
          <div 
            key={project.id}
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'var(--cv-color-surface)',
              borderColor: 'var(--cv-color-border)',
              height: 'fit-content'
            }}
          >
            <div className="mb-3">
              <h3 
                className="font-semibold mb-2"
                style={{
                  fontSize: 'var(--cv-text-base)',
                  fontFamily: 'var(--cv-font-heading)',
                  fontWeight: 'var(--cv-font-semibold)',
                  color: 'var(--cv-color-text-primary)'
                }}
              >
                {project.name}
              </h3>
              <p 
                className="text-sm leading-relaxed"
                style={{
                  color: 'var(--cv-color-text-secondary)',
                  fontFamily: 'var(--cv-font-body)',
                  lineHeight: 'var(--cv-leading-relaxed)'
                }}
              >
                {project.description}
              </p>
            </div>
            {renderTechnologies(project.technologies)}
            <div className="mt-3">
              {renderProjectLink(project)}
            </div>
          </div>
        );

      case 'compact':
        return (
          <div key={project.id} className="mb-3 pb-3 border-b" style={{ borderColor: 'var(--cv-color-border)' }}>
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
                  {project.name}
                </h3>
                <p 
                  className="text-sm mt-1"
                  style={{
                    color: 'var(--cv-color-text-secondary)',
                    fontFamily: 'var(--cv-font-body)'
                  }}
                >
                  {project.description}
                </p>
                {showTechnologies && project.technologies.length > 0 && (
                  <div className="text-xs mt-2">
                    <span style={{ color: 'var(--cv-color-text-muted)' }}>
                      {project.technologies.join(' • ')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                {renderProjectLink(project)}
              </div>
            </div>
          </div>
        );

      case 'detailed':
        return (
          <div 
            key={project.id}
            className="mb-6 p-5 rounded-lg border"
            style={{
              backgroundColor: 'var(--cv-color-surface)',
              borderColor: 'var(--cv-color-border)',
              boxShadow: 'var(--cv-shadow-sm)'
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 
                className="font-bold"
                style={{
                  fontSize: 'var(--cv-text-xl)',
                  fontFamily: 'var(--cv-font-heading)',
                  fontWeight: 'var(--cv-font-bold)',
                  color: 'var(--cv-color-text-primary)'
                }}
              >
                {project.name}
              </h3>
              {renderProjectLink(project)}
            </div>
            
            <p 
              className="mb-4 leading-relaxed"
              style={{
                fontSize: 'var(--cv-text-sm)',
                color: 'var(--cv-color-text-secondary)',
                fontFamily: 'var(--cv-font-body)',
                lineHeight: 'var(--cv-leading-relaxed)'
              }}
            >
              {project.description}
            </p>

            {showTechnologies && project.technologies.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="h-3 w-3" style={{ color: 'var(--cv-color-primary)' }} />
                  <span 
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: 'var(--cv-color-primary)' }}
                  >
                    Technologies
                  </span>
                </div>
                {renderTechnologies(project.technologies)}
              </div>
            )}
          </div>
        );

      case 'list':
      default:
        return (
          <div key={project.id} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h3 
                className="font-semibold"
                style={{
                  fontSize: 'var(--cv-text-lg)',
                  fontFamily: 'var(--cv-font-heading)',
                  fontWeight: 'var(--cv-font-semibold)',
                  color: 'var(--cv-color-text-primary)'
                }}
              >
                {project.name}
              </h3>
              {renderProjectLink(project)}
            </div>
            
            <p 
              className="mb-3"
              style={{
                fontSize: 'var(--cv-text-sm)',
                color: 'var(--cv-color-text-secondary)',
                fontFamily: 'var(--cv-font-body)',
                lineHeight: 'var(--cv-leading-relaxed)'
              }}
            >
              {project.description}
            </p>

            {renderTechnologies(project.technologies)}
          </div>
        );
    }
  };

  return (
    <section 
      className={`cv-projects-section ${className}`}
      style={{
        marginBottom: 'var(--cv-space-xl)',
        ...style
      }}
    >
      {renderSectionHeader()}
      <div style={{ paddingLeft: showIcon ? 'var(--cv-space-lg)' : '0' }}>
        {layout === 'grid' ? (
          <div 
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`
            }}
          >
            {data.map(renderProjectItem)}
          </div>
        ) : (
          <div>
            {data.map(renderProjectItem)}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsRenderer;
