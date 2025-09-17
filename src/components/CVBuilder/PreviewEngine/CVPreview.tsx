// src/components/CVBuilder/PreviewEngine/CVPreview.tsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { 
  CVData, 
  PreviewSettings, 
  SectionVisibility, 
  LayoutSettings,
  PreviewContextType,
  VIEWPORT_DIMENSIONS,
  DEFAULT_CV_DATA,
  DEFAULT_PREVIEW_SETTINGS,
  DEFAULT_SECTION_VISIBILITY,
  DEFAULT_LAYOUT_SETTINGS
} from './types';
import { useStyleSystem } from '../StyleSystem/ThemeProvider';
import ViewModeSelector from './ViewModeSelector';
import HeaderRenderer from './SectionRenderers/HeaderRenderer';
import SummaryRenderer from './SectionRenderers/SummaryRenderer';
import ExperienceRenderer from './SectionRenderers/ExperienceRenderer';
import SkillsRenderer from './SectionRenderers/SkillsRenderer';
import EducationRenderer from './SectionRenderers/EducationRenderer';
import ProjectsRenderer from './SectionRenderers/ProjectsRenderer';

// Create Preview Context
const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }
  return context;
};

// Preview Provider Component
interface PreviewProviderProps {
  children: React.ReactNode;
  initialData?: Partial<CVData>;
  onDataChange?: (data: CVData) => void;
}

export const PreviewProvider: React.FC<PreviewProviderProps> = ({
  children,
  initialData = {},
  onDataChange
}) => {
  const [cvData, setCVData] = useState<CVData>({
    ...DEFAULT_CV_DATA,
    ...initialData
  });
  
  const [previewSettings, setPreviewSettings] = useState<PreviewSettings>(DEFAULT_PREVIEW_SETTINGS);
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(DEFAULT_SECTION_VISIBILITY);
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(DEFAULT_LAYOUT_SETTINGS);

  const updateCVData = useCallback((data: Partial<CVData>) => {
    setCVData(prev => {
      const newData = { ...prev, ...data };
      onDataChange?.(newData);
      return newData;
    });
  }, [onDataChange]);

  const updatePreviewSettings = useCallback((settings: Partial<PreviewSettings>) => {
    setPreviewSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const updateSectionVisibility = useCallback((visibility: Partial<SectionVisibility>) => {
    setSectionVisibility(prev => ({ ...prev, ...visibility }));
  }, []);

  const updateLayoutSettings = useCallback((layout: Partial<LayoutSettings>) => {
    setLayoutSettings(prev => ({ ...prev, ...layout }));
  }, []);

  const exportHTML = useCallback(() => {
    // This would generate the HTML string of the current CV
    return document.querySelector('.cv-preview-content')?.outerHTML || '';
  }, []);

  const resetToDefaults = useCallback(() => {
    setCVData({ ...DEFAULT_CV_DATA });
    setPreviewSettings({ ...DEFAULT_PREVIEW_SETTINGS });
    setSectionVisibility({ ...DEFAULT_SECTION_VISIBILITY });
    setLayoutSettings({ ...DEFAULT_LAYOUT_SETTINGS });
  }, []);

  const contextValue: PreviewContextType = {
    cvData,
    previewSettings,
    sectionVisibility,
    layoutSettings,
    updateCVData,
    updatePreviewSettings,
    updateSectionVisibility,
    updateLayoutSettings,
    exportHTML,
    resetToDefaults
  };

  return (
    <PreviewContext.Provider value={contextValue}>
      {children}
    </PreviewContext.Provider>
  );
};

// Main CV Preview Component
interface CVPreviewProps {
  className?: string;
  style?: React.CSSProperties;
  showControls?: boolean;
}

const CVPreview: React.FC<CVPreviewProps> = ({
  className = '',
  style = {},
  showControls = true
}) => {
  const { currentTheme } = useStyleSystem();
  const {
    cvData,
    previewSettings,
    sectionVisibility,
    layoutSettings,
    updatePreviewSettings
  } = usePreview();

  const viewport = VIEWPORT_DIMENSIONS[previewSettings.viewMode];
  
  const previewStyles = useMemo(() => ({
    width: `${viewport.width}px`,
    minHeight: `${viewport.height}px`,
    transform: `scale(${previewSettings.scale})`,
    transformOrigin: 'top center',
    backgroundColor: 'var(--cv-color-background)',
    boxShadow: 'var(--cv-shadow-lg)',
    borderRadius: 'var(--cv-rounded-md)',
    border: `1px solid var(--cv-color-border)`,
    margin: `${layoutSettings.pageMargins.top}px ${layoutSettings.pageMargins.right}px ${layoutSettings.pageMargins.bottom}px ${layoutSettings.pageMargins.left}px`,
    padding: `${layoutSettings.pageMargins.top}px ${layoutSettings.pageMargins.right}px ${layoutSettings.pageMargins.bottom}px ${layoutSettings.pageMargins.left}px`,
    fontFamily: 'var(--cv-font-body)',
    fontSize: 'var(--cv-text-base)',
    color: 'var(--cv-color-text-primary)',
    lineHeight: 'var(--cv-leading-normal)',
    position: 'relative' as const
  }), [viewport, previewSettings.scale, layoutSettings.pageMargins]);

  const renderGrid = () => {
    if (!previewSettings.showGrid) return null;
    
    return (
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--cv-color-primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--cv-color-primary) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
    );
  };

  const renderMargins = () => {
    if (!previewSettings.showMargins) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute border-2 border-dashed opacity-30"
          style={{
            top: `${layoutSettings.pageMargins.top}px`,
            right: `${layoutSettings.pageMargins.right}px`,
            bottom: `${layoutSettings.pageMargins.bottom}px`,
            left: `${layoutSettings.pageMargins.left}px`,
            borderColor: 'var(--cv-color-warning)'
          }}
        />
      </div>
    );
  };

  const renderSafeArea = () => {
    if (!previewSettings.showSafeArea) return null;
    
    const safeMargin = 20;
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute border border-dashed opacity-40"
          style={{
            top: `${safeMargin}px`,
            right: `${safeMargin}px`,
            bottom: `${safeMargin}px`,
            left: `${safeMargin}px`,
            borderColor: 'var(--cv-color-accent)'
          }}
        />
      </div>
    );
  };

  const renderSections = () => {
    const sectionSpacing = {
      compact: 'var(--cv-space-md)',
      normal: 'var(--cv-space-lg)',
      relaxed: 'var(--cv-space-xl)'
    }[layoutSettings.sectionSpacing];

    const sectionComponents = {
      header: (
        <HeaderRenderer
          key="header"
          data={cvData.personalInfo}
          isVisible={sectionVisibility.header}
          showPhoto={true}
          photoPosition="right"
          photoSize="medium"
          layout="left-aligned"
          style={{ marginBottom: sectionSpacing }}
        />
      ),
      summary: (
        <SummaryRenderer
          key="summary"
          data={cvData.summary}
          isVisible={sectionVisibility.summary}
          layout="standard"
          style={{ marginBottom: sectionSpacing }}
        />
      ),
      experience: (
        <ExperienceRenderer
          key="experience"
          data={cvData.experience}
          isVisible={sectionVisibility.experience}
          layout="standard"
          dateFormat="short"
          showLocation={true}
          style={{ marginBottom: sectionSpacing }}
        />
      ),
      education: (
        <EducationRenderer
          key="education"
          data={cvData.education}
          isVisible={sectionVisibility.education}
          layout="standard"
          dateFormat="year-only"
          showGPA={true}
          style={{ marginBottom: sectionSpacing }}
        />
      ),
      skills: (
        <SkillsRenderer
          key="skills"
          data={cvData.skills}
          isVisible={sectionVisibility.skills}
          layout="bars"
          showLevels={true}
          groupByCategory={false}
          style={{ marginBottom: sectionSpacing }}
        />
      ),
      projects: (
        <ProjectsRenderer
          key="projects"
          data={cvData.projects}
          isVisible={sectionVisibility.projects}
          layout="list"
          showTechnologies={true}
          showLinks={true}
          style={{ marginBottom: sectionSpacing }}
        />
      ),
      certifications: (
        // We haven't built this yet, so we'll show a placeholder
        sectionVisibility.certifications && cvData.certifications.length > 0 && (
          <div key="certifications" style={{ marginBottom: sectionSpacing }}>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{
                  backgroundColor: 'var(--cv-color-primary)',
                  color: 'white'
                }}
              >
                <Award className="h-4 w-4" />
              </div>
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
                Certifications
              </h2>
              <div 
                className="flex-1 h-px"
                style={{ backgroundColor: 'var(--cv-color-border)' }}
              />
            </div>
            <div className="pl-8">
              {cvData.certifications.map((cert) => (
                <div key={cert.id} className="mb-3">
                  <h3 
                    className="font-semibold"
                    style={{
                      fontSize: 'var(--cv-text-base)',
                      color: 'var(--cv-color-text-primary)'
                    }}
                  >
                    {cert.name}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--cv-color-text-secondary)' }}
                  >
                    {cert.issuer} • {cert.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      )
    };

    return layoutSettings.sectionOrder.map(sectionId => 
      sectionComponents[sectionId as keyof typeof sectionComponents]
    ).filter(Boolean);
  };

  return (
    <div className={`cv-preview-container ${className}`} style={style}>
      {/* Controls */}
      {showControls && (
        <div className="mb-6">
          <ViewModeSelector
            previewSettings={previewSettings}
            onSettingsChange={updatePreviewSettings}
          />
        </div>
      )}

      {/* Preview Wrapper */}
      <div 
        className="flex justify-center p-8 overflow-auto"
        style={{
          backgroundColor: 'var(--cv-color-surface)',
          borderRadius: 'var(--cv-rounded-lg)',
          minHeight: '600px'
        }}
      >
        {/* CV Preview */}
        <div 
          className="cv-preview-content relative"
          style={previewStyles}
        >
          {renderGrid()}
          {renderMargins()}
          {renderSafeArea()}
          
          {/* CV Content */}
          <div className="relative z-10">
            {renderSections()}
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-4 px-4 py-2 rounded-lg text-sm" style={{
          backgroundColor: 'var(--cv-color-surface)',
          color: 'var(--cv-color-text-secondary)',
          border: `1px solid var(--cv-color-border)`
        }}>
          <span>Theme: {currentTheme.name}</span>
          <span>•</span>
          <span>View: {previewSettings.viewMode}</span>
          <span>•</span>
          <span>Scale: {Math.round(previewSettings.scale * 100)}%</span>
          <span>•</span>
          <span>Size: {viewport.width}×{viewport.height}px</span>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
