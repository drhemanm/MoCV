// src/components/CVBuilder/ColorSystem/ColorPicker.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ColorFormat, BrandColor } from './types';
import { createColorFormat, rgbToHsl, hslToRgb, rgbToHex } from './colorUtils';
import { useColorSystem } from './ColorProvider';

interface ColorPickerProps {
  initialColor?: ColorFormat;
  onChange?: (color: ColorFormat) => void;
  onSave?: (brandColor: BrandColor) => void;
  showSaveButton?: boolean;
  showFormatTabs?: boolean;
  showHarmonyPreview?: boolean;
  className?: string;
  disabled?: boolean;
}

interface HSVColor {
  h: number;
  s: number;
  v: number;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  initialColor = createColorFormat('#3B82F6'),
  onChange,
  onSave,
  showSaveButton = true,
  showFormatTabs = true,
  showHarmonyPreview = true,
  className = '',
  disabled = false
}) => {
  const [currentColor, setCurrentColor] = useState<ColorFormat>(initialColor);
  const [hsv, setHSV] = useState<HSVColor>(() => ({
    h: initialColor.hsv.h,
    s: initialColor.hsv.s,
    v: initialColor.hsv.v
  }));
  const [activeFormat, setActiveFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [colorName, setColorName] = useState('');
  const [colorUsage, setColorUsage] = useState<BrandColor['usage']>('primary');
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'saturation' | 'hue' | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  const { generateHarmony, addColor } = useColorSystem();

  // Update color when HSV changes
  useEffect(() => {
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const newColor = createColorFormat(rgbToHex(rgb.r, rgb.g, rgb.b));
    setCurrentColor(newColor);
    onChange?.(newColor);
  }, [hsv, onChange]);

  // Draw saturation/value canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create saturation gradient (left to right)
    const satGradient = ctx.createLinearGradient(0, 0, width, 0);
    satGradient.addColorStop(0, '#fff');
    satGradient.addColorStop(1, `hsl(${hsv.h}, 100%, 50%)`);
    
    ctx.fillStyle = satGradient;
    ctx.fillRect(0, 0, width, height);

    // Create value gradient (top to bottom)
    const valGradient = ctx.createLinearGradient(0, 0, 0, height);
    valGradient.addColorStop(0, 'transparent');
    valGradient.addColorStop(1, '#000');
    
    ctx.fillStyle = valGradient;
    ctx.fillRect(0, 0, width, height);
  }, [hsv.h]);

  // Draw hue canvas
  useEffect(() => {
    if (!hueCanvasRef.current) return;
    
    const canvas = hueCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    for (let i = 0; i <= 360; i += 60) {
      gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, []);

  // HSV to RGB conversion
  const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
    s /= 100;
    v /= 100;
    
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    
    let r = 0, g = 0, b = 0;
    
    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }
    
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  };

  // Handle saturation/value canvas interaction
  const handleSaturationMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    setIsDragging(true);
    setDragType('saturation');
    handleSaturationMouseMove(event);
  }, [disabled]);

  const handleSaturationMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || (!isDragging && event.type !== 'mousedown')) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvas.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(canvas.height, event.clientY - rect.top));
    
    const s = (x / canvas.width) * 100;
    const v = 100 - (y / canvas.height) * 100;
    
    setHSV(prev => ({ ...prev, s, v }));
  }, [isDragging]);

  // Handle hue canvas interaction
  const handleHueMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    setIsDragging(true);
    setDragType('hue');
    handleHueMouseMove(event);
  }, [disabled]);

  const handleHueMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hueCanvasRef.current || (!isDragging && event.type !== 'mousedown')) return;
    
    const canvas = hueCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvas.width, event.clientX - rect.left));
    
    const h = (x / canvas.width) * 360;
    setHSV(prev => ({ ...prev, h }));
  }, [isDragging]);

  // Global mouse up handler
  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setDragType(null);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      
      if (dragType === 'saturation' && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(canvasRef.current.width, event.clientX - rect.left));
        const y = Math.max(0, Math.min(canvasRef.current.height, event.clientY - rect.top));
        
        const s = (x / canvasRef.current.width) * 100;
        const v = 100 - (y / canvasRef.current.height) * 100;
        
        setHSV(prev => ({ ...prev, s, v }));
      } else if (dragType === 'hue' && hueCanvasRef.current) {
        const rect = hueCanvasRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(hueCanvasRef.current.width, event.clientX - rect.left));
        
        const h = (x / hueCanvasRef.current.width) * 360;
        setHSV(prev => ({ ...prev, h }));
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, dragType]);

  // Handle input field changes
  const handleInputChange = useCallback((format: 'hex' | 'rgb' | 'hsl', field: string, value: string) => {
    if (disabled) return;
    
    const numValue = parseInt(value) || 0;
    
    try {
      if (format === 'hex') {
        if (value.match(/^#?[0-9A-Fa-f]{0,6}$/)) {
          const hex = value.startsWith('#') ? value : `#${value}`;
          if (hex.length === 7) {
            const newColor = createColorFormat(hex);
            setCurrentColor(newColor);
            setHSV({ h: newColor.hsv.h, s: newColor.hsv.s, v: newColor.hsv.v });
          }
        }
      } else if (format === 'rgb') {
        const newRgb = { ...currentColor.rgb, [field]: Math.max(0, Math.min(255, numValue)) };
        const newColor = createColorFormat(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        setCurrentColor(newColor);
        setHSV({ h: newColor.hsv.h, s: newColor.hsv.s, v: newColor.hsv.v });
      } else if (format === 'hsl') {
        const maxValue = field === 'h' ? 360 : 100;
        const newHsl = { ...currentColor.hsl, [field]: Math.max(0, Math.min(maxValue, numValue)) };
        const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        const newColor = createColorFormat(rgbToHex(rgb.r, rgb.g, rgb.b));
        setCurrentColor(newColor);
        setHSV({ h: newColor.hsv.h, s: newColor.hsv.s, v: newColor.hsv.v });
      }
    } catch (error) {
      console.warn('Invalid color input:', error);
    }
  }, [currentColor, disabled]);

  // Handle save color
  const handleSave = useCallback(() => {
    if (!colorName.trim()) {
      setColorName(`Color ${Date.now()}`);
    }
    
    const brandColor: BrandColor = {
      id: `color-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: colorName.trim() || `Color ${Date.now()}`,
      color: currentColor,
      usage: colorUsage
    };
    
    if (onSave) {
      onSave(brandColor);
    } else {
      addColor(brandColor);
    }
    
    setColorName('');
  }, [colorName, currentColor, colorUsage, onSave, addColor]);

  // Generate harmony colors for preview
  const harmonyColors = showHarmonyPreview 
    ? generateHarmony(currentColor, 'complementary').colors.slice(1) // Exclude base color
    : [];

  return (
    <div className={`cv-color-picker ${className}`} style={{
      fontFamily: 'var(--cv-font-body)',
      background: 'var(--cv-color-surface)',
      border: '1px solid var(--cv-color-border)',
      borderRadius: 'var(--cv-rounded-lg)',
      padding: 'var(--cv-space-lg)',
      maxWidth: '400px',
      opacity: disabled ? 0.6 : 1,
      pointerEvents: disabled ? 'none' : 'auto'
    }}>
      {/* Color Preview */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--cv-space-md)',
        marginBottom: 'var(--cv-space-lg)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: currentColor.hex,
          borderRadius: 'var(--cv-rounded-md)',
          border: '2px solid var(--cv-color-border)',
          boxShadow: 'var(--cv-shadow-sm)'
        }} />
        <div>
          <div style={{
            fontSize: 'var(--cv-text-lg)',
            fontWeight: 'var(--cv-font-semibold)',
            color: 'var(--cv-color-text-primary)'
          }}>
            {currentColor.hex.toUpperCase()}
          </div>
          <div style={{
            fontSize: 'var(--cv-text-sm)',
            color: 'var(--cv-color-text-muted)'
          }}>
            RGB({currentColor.rgb.r}, {currentColor.rgb.g}, {currentColor.rgb.b})
          </div>
        </div>
      </div>

      {/* Saturation/Value Canvas */}
      <div style={{ marginBottom: 'var(--cv-space-md)' }}>
        <canvas
          ref={canvasRef}
          width={300}
          height={200}
          style={{
            width: '100%',
            height: '150px',
            cursor: disabled ? 'default' : 'crosshair',
            borderRadius: 'var(--cv-rounded-sm)',
            border: '1px solid var(--cv-color-border)'
          }}
          onMouseDown={handleSaturationMouseDown}
          onMouseMove={handleSaturationMouseMove}
        />
        {/* Saturation/Value Indicator */}
        <div style={{
          position: 'relative',
          top: '-150px',
          left: `${(hsv.s / 100) * 100}%`,
          top: `${((100 - hsv.v) / 100) * 150}px`,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />
      </div>

      {/* Hue Canvas */}
      <div style={{ marginBottom: 'var(--cv-space-lg)' }}>
        <canvas
          ref={hueCanvasRef}
          width={300}
          height={20}
          style={{
            width: '100%',
            height: '20px',
            cursor: disabled ? 'default' : 'crosshair',
            borderRadius: 'var(--cv-rounded-sm)',
            border: '1px solid var(--cv-color-border)'
          }}
          onMouseDown={handleHueMouseDown}
          onMouseMove={handleHueMouseMove}
        />
        {/* Hue Indicator */}
        <div style={{
          position: 'relative',
          top: '-20px',
          left: `${(hsv.h / 360) * 100}%`,
          width: '4px',
          height: '20px',
          background: 'white',
          border: '1px solid rgba(0,0,0,0.3)',
          transform: 'translateX(-50%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Format Tabs and Input Fields */}
      {showFormatTabs && (
        <>
          <div style={{
            display: 'flex',
            gap: 'var(--cv-space-xs)',
            marginBottom: 'var(--cv-space-md)',
            borderBottom: '1px solid var(--cv-color-border)'
          }}>
            {(['hex', 'rgb', 'hsl'] as const).map(format => (
              <button
                key={format}
                onClick={() => setActiveFormat(format)}
                style={{
                  padding: 'var(--cv-space-sm) var(--cv-space-md)',
                  border: 'none',
                  background: activeFormat === format ? 'var(--cv-color-primary)' : 'transparent',
                  color: activeFormat === format ? 'white' : 'var(--cv-color-text-secondary)',
                  borderRadius: 'var(--cv-rounded-sm)',
                  fontSize: 'var(--cv-text-sm)',
                  fontWeight: 'var(--cv-font-medium)',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {format}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 'var(--cv-space-lg)' }}>
            {activeFormat === 'hex' && (
              <input
                type="text"
                value={currentColor.hex}
                onChange={(e) => handleInputChange('hex', '', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--cv-space-sm)',
                  border: '1px solid var(--cv-color-border)',
                  borderRadius: 'var(--cv-rounded-sm)',
                  fontSize: 'var(--cv-text-base)',
                  fontFamily: 'var(--cv-font-mono)'
                }}
                placeholder="#000000"
              />
            )}

            {activeFormat === 'rgb' && (
              <div style={{ display: 'flex', gap: 'var(--cv-space-sm)' }}>
                {(['r', 'g', 'b'] as const).map(channel => (
                  <div key={channel} style={{ flex: 1 }}>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--cv-text-xs)',
                      color: 'var(--cv-color-text-muted)',
                      marginBottom: '2px',
                      textTransform: 'uppercase'
                    }}>
                      {channel}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={currentColor.rgb[channel]}
                      onChange={(e) => handleInputChange('rgb', channel, e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'var(--cv-space-sm)',
                        border: '1px solid var(--cv-color-border)',
                        borderRadius: 'var(--cv-rounded-sm)',
                        fontSize: 'var(--cv-text-sm)'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeFormat === 'hsl' && (
              <div style={{ display: 'flex', gap: 'var(--cv-space-sm)' }}>
                {(['h', 's', 'l'] as const).map(channel => (
                  <div key={channel} style={{ flex: 1 }}>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--cv-text-xs)',
                      color: 'var(--cv-color-text-muted)',
                      marginBottom: '2px',
                      textTransform: 'uppercase'
                    }}>
                      {channel} {channel === 'h' ? '°' : '%'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={channel === 'h' ? 360 : 100}
                      value={Math.round(currentColor.hsl[channel])}
                      onChange={(e) => handleInputChange('hsl', channel, e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'var(--cv-space-sm)',
                        border: '1px solid var(--cv-color-border)',
                        borderRadius: 'var(--cv-rounded-sm)',
                        fontSize: 'var(--cv-text-sm)'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Harmony Preview */}
      {showHarmonyPreview && harmonyColors.length > 0 && (
        <div style={{ marginBottom: 'var(--cv-space-lg)' }}>
          <h4 style={{
            fontSize: 'var(--cv-text-sm)',
            fontWeight: 'var(--cv-font-medium)',
            color: 'var(--cv-color-text-secondary)',
            marginBottom: 'var(--cv-space-sm)'
          }}>
            Complementary Colors
          </h4>
          <div style={{ display: 'flex', gap: 'var(--cv-space-xs)' }}>
            {harmonyColors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                style={{
                  width: '40px',
                  height: '40px',
                  background: color.hex,
                  borderRadius: 'var(--cv-rounded-sm)',
                  border: '1px solid var(--cv-color-border)',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setCurrentColor(color);
                  setHSV({ h: color.hsv.h, s: color.hsv.s, v: color.hsv.v });
                }}
                title={color.hex}
              />
            ))}
          </div>
        </div>
      )}

      {/* Save Section */}
      {showSaveButton && (
        <div>
          <div style={{ display: 'flex', gap: 'var(--cv-space-sm)', marginBottom: 'var(--cv-space-sm)' }}>
            <input
              type="text"
              placeholder="Color name"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              style={{
                flex: 1,
                padding: 'var(--cv-space-sm)',
                border: '1px solid var(--cv-color-border)',
                borderRadius: 'var(--cv-rounded-sm)',
                fontSize: 'var(--cv-text-sm)'
              }}
            />
            <select
              value={colorUsage}
              onChange={(e) => setColorUsage(e.target.value as BrandColor['usage'])}
              style={{
                padding: 'var(--cv-space-sm)',
                border: '1px solid var(--cv-color-border)',
                borderRadius: 'var(--cv-rounded-sm)',
                fontSize: 'var(--cv-text-sm)',
                background: 'var(--cv-color-background)'
              }}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="accent">Accent</option>
              <option value="neutral">Neutral</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: 'var(--cv-space-md)',
              background: 'var(--cv-color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--cv-rounded-md)',
              fontSize: 'var(--cv-text-sm)',
              fontWeight: 'var(--cv-font-medium)',
              cursor: 'pointer'
            }}
          >
            Save Color
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
