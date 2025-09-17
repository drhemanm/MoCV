// src/components/CVBuilder/PreviewEngine/ViewModeSelector.tsx
import React from 'react';
import { Monitor, Tablet, Smartphone, Printer, ZoomIn, ZoomOut, Grid3x3, Maximize2 } from 'lucide-react';
import { ViewMode, PreviewSettings } from './types';
import { useStyleSystem } from '../StyleSystem/ThemeProvider';

interface ViewModeSelectorProps {
  previewSettings: PreviewSettings;
  onSettingsChange: (settings: Partial<PreviewSettings>) => void;
  className?: string;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  previewSettings,
  onSettingsChange,
  className = ''
}) => {
  const { currentTheme } = useStyleSystem();

  const viewModes: Array<{
    id: ViewMode;
    label: string;
    icon: React.ComponentType<any>;
    description: string;
  }> = [
    {
      id: 'desktop',
      label: 'Desktop',
      icon: Monitor,
      description: 'Full desktop view (1200px)'
    },
    {
      id: 'tablet',
      label: 'Tablet',
      icon: Tablet,
      description: 'Tablet view (768px)'
    },
    {
      id: 'mobile',
      label: 'Mobile',
      icon: Smartphone,
      description: 'Mobile view (375px)'
    },
    {
      id: 'print',
      label: 'Print',
      icon: Printer,
      description: 'Print preview (A4)'
    }
  ];

  const scaleOptions = [
    { value: 0.5, label: '50%' },
    { value: 0.75, label: '75%' },
    { value: 1, label: '100%' },
    { value: 1.25, label: '125%' },
    { value: 1.5, label: '150%' }
  ];

  const handleViewModeChange = (viewMode: ViewMode) => {
    onSettingsChange({ viewMode });
  };

  const handleScaleChange = (scale: number) => {
    onSettingsChange({ scale });
  };

  const toggleSetting = (setting: keyof PreviewSettings) => {
    onSettingsChange({ [setting]: !previewSettings[setting] });
  };

  return (
    <div 
      className={`flex items-center gap-4 p-3 rounded-lg border ${className}`}
      style={{
        backgroundColor: 'var(--cv-color-surface)',
        borderColor: 'var(--cv-color-border)'
      }}
    >
      {/* View Mode Buttons */}
      <div className="flex items-center gap-1">
        <span 
          className="text-sm font-medium mr-2"
          style={{ 
            color: 'var(--cv-color-text-secondary)',
            fontFamily: 'var(--cv-font-body)' 
          }}
        >
          View:
        </span>
        {viewModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = previewSettings.viewMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => handleViewModeChange(mode.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all hover:opacity-80 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: isActive ? 'var(--cv-color-primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--cv-color-text-secondary)',
                focusRingColor: 'var(--cv-color-primary)'
              }}
              title={mode.description}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div 
        className="h-6 w-px"
        style={{ backgroundColor: 'var(--cv-color-border)' }}
      />

      {/* Scale Controls */}
      <div className="flex items-center gap-2">
        <span 
          className="text-sm font-medium"
          style={{ 
            color: 'var(--cv-color-text-secondary)',
            fontFamily: 'var(--cv-font-body)' 
          }}
        >
          Scale:
        </span>
        
        <button
          onClick={() => handleScaleChange(Math.max(0.25, previewSettings.scale - 0.25))}
          className="p-1 rounded hover:opacity-80 focus:outline-none focus:ring-2"
          style={{ 
            color: 'var(--cv-color-text-secondary)',
            focusRingColor: 'var(--cv-color-primary)'
          }}
          disabled={previewSettings.scale <= 0.25}
        >
          <ZoomOut className="h-4 w-4" />
        </button>

        <select
          value={previewSettings.scale}
          onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
          className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--cv-color-background)',
            borderColor: 'var(--cv-color-border)',
            color: 'var(--cv-color-text-primary)',
            focusRingColor: 'var(--cv-color-primary)'
          }}
        >
          {scaleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => handleScaleChange(Math.min(2, previewSettings.scale + 0.25))}
          className="p-1 rounded hover:opacity-80 focus:outline-none focus:ring-2"
          style={{ 
            color: 'var(--cv-color-text-secondary)',
            focusRingColor: 'var(--cv-color-primary)'
          }}
          disabled={previewSettings.scale >= 2}
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      {/* Divider */}
      <div 
        className="h-6 w-px"
        style={{ backgroundColor: 'var(--cv-color-border)' }}
      />

      {/* Display Options */}
      <div className="flex items-center gap-2">
        <span 
          className="text-sm font-medium"
          style={{ 
            color: 'var(--cv-color-text-secondary)',
            fontFamily: 'var(--cv-font-body)' 
          }}
        >
          Show:
        </span>

        <button
          onClick={() => toggleSetting('showGrid')}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-all hover:opacity-80 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: previewSettings.showGrid ? 'var(--cv-color-accent)' : 'transparent',
            color: previewSettings.showGrid ? 'white' : 'var(--cv-color-text-secondary)',
            focusRingColor: 'var(--cv-color-primary)'
          }}
          title="Toggle grid overlay"
        >
          <Grid3x3 className="h-3 w-3" />
          <span className="hidden md:inline">Grid</span>
        </button>

        <button
          onClick={() => toggleSetting('showMargins')}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-all hover:opacity-80 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: previewSettings.showMargins ? 'var(--cv-color-accent)' : 'transparent',
            color: previewSettings.showMargins ? 'white' : 'var(--cv-color-text-secondary)',
            focusRingColor: 'var(--cv-color-primary)'
          }}
          title="Toggle margin guides"
        >
          <Maximize2 className="h-3 w-3" />
          <span className="hidden md:inline">Margins</span>
        </button>

        <button
          onClick={() => toggleSetting('showSafeArea')}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-all hover:opacity-80 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: previewSettings.showSafeArea ? 'var(--cv-color-accent)' : 'transparent',
            color: previewSettings.showSafeArea ? 'white' : 'var(--cv-color-text-secondary)',
            focusRingColor: 'var(--cv-color-primary)'
          }}
          title="Toggle safe area guides"
        >
          <div className="w-3 h-3 border border-current rounded-sm" />
          <span className="hidden md:inline">Safe Area</span>
        </button>
      </div>

      {/* Quick Info */}
      <div className="flex items-center gap-2 ml-auto">
        <div 
          className="text-xs px-2 py-1 rounded"
          style={{ 
            backgroundColor: 'var(--cv-color-background)',
            color: 'var(--cv-color-text-muted)',
            border: '1px solid var(--cv-color-border)'
          }}
        >
          {previewSettings.viewMode === 'desktop' && '1200px'}
          {previewSettings.viewMode === 'tablet' && '768px'}
          {previewSettings.viewMode === 'mobile' && '375px'}
          {previewSettings.viewMode === 'print' && 'A4'}
        </div>
        
        <div 
          className="text-xs px-2 py-1 rounded"
          style={{ 
            backgroundColor: 'var(--cv-color-background)',
            color: 'var(--cv-color-text-muted)',
            border: '1px solid var(--cv-color-border)'
          }}
        >
          {Math.round(previewSettings.scale * 100)}%
        </div>
      </div>
    </div>
  );
};

export default ViewModeSelector;
