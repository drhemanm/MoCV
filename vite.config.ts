// vite.config.ts - Updated for better performance
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Code splitting and optimization
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],
          'pdf-vendor': ['pdf-lib', 'pdfjs-dist', 'html2pdf.js'],
          'editor-vendor': ['react-quill', 'quill'],
          'utils-vendor': ['mammoth']
        }
      }
    },
    // Enable compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    // Source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development'
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: ['pdf-lib'] // Large libraries that should be code-split
  },

  // Development server optimization
  server: {
    hmr: {
      overlay: false // Disable error overlay for better UX
    }
  },

  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types')
    }
  }
});

// src/utils/lazyLoad.tsx - Lazy loading utilities
import React, { Suspense, ComponentType } from 'react';
import { LoadingSpinner } from '@components/LoadingSpinner';

interface LazyLoadOptions {
  fallback?: React.ReactNode;
  errorBoundary?: boolean;
}

export const lazyLoad = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) => {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={options.fallback || <LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Example lazy-loaded components
export const LazyComponents = {
  CVBuilder: lazyLoad(() => import('@components/CVBuilder'), {
    fallback: <div className="flex items-center justify-center h-64">Loading CV Builder...</div>
  }),
  
  CVAnalyzer: lazyLoad(() => import('@components/CVAnalyzer'), {
    fallback: <div className="flex items-center justify-center h-64">Loading CV Analyzer...</div>
  }),
  
  ChatAssistant: lazyLoad(() => import('@components/ChatAssistant'), {
    fallback: <div className="flex items-center justify-center h-32">Loading Chat...</div>
  }),
  
  PDFViewer: lazyLoad(() => import('@components/PDFViewer'), {
    fallback: <div className="flex items-center justify-center h-96">Loading PDF Viewer...</div>
  })
};

// src/hooks/useVirtualization.ts - Virtual scrolling for large lists
import { useMemo, useState, useCallback } from 'react';

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualization = <T>(
  items: T[],
  options: VirtualizationOptions
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const { itemHeight, containerHeight, overscan = 5 } = options;

  const visibleItems = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2);

    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, scrollTop, itemHeight, containerHeight, overscan]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return { visibleItems, handleScroll };
};

// src/utils/imageOptimization.ts - Image optimization utilities
export class ImageOptimizer {
  static async compressImage(
    file: File, 
    maxWidth: number = 800, 
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;

        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw and compress
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  static createWebPVersion(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                type: 'image/webp',
                lastModified: Date.now()
              });
              resolve(webpFile);
            } else {
              reject(new Error('Failed to convert to WebP'));
            }
          },
          'image/webp',
          0.8
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// src/utils/memoryManagement.ts - Memory management utilities
export class MemoryManager {
  private static objectUrls: Set<string> = new Set();

  static createObjectURL(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    this.objectUrls.add(url);
    return url;
  }

  static revokeObjectURL(url: string): void {
    URL.revokeObjectURL(url);
    this.objectUrls.delete(url);
  }

  static cleanup(): void {
    this.objectUrls.forEach(url => URL.revokeObjectURL(url));
    this.objectUrls.clear();
  }

  // Auto-cleanup on page unload
  static init(): void {
    window.addEventListener('beforeunload', () => this.cleanup());
  }
}

// Initialize memory management
MemoryManager.init();
