import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],
            'pdf-vendor': ['pdf-lib', 'pdfjs-dist', 'html2pdf.js'],
            'editor-vendor': ['react-quill', 'quill'],
            'utils-vendor': ['mammoth', 'dompurify']
          }
        }
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction
        }
      },
      sourcemap: !isProduction
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', 'clsx'],
      exclude: ['pdf-lib']
    },

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@services': resolve(__dirname, 'src/services'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@types': resolve(__dirname, 'src/types'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@config': resolve(__dirname, 'src/config')
      }
    }
  };
});
