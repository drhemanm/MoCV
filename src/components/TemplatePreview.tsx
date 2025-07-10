import React, { useState } from 'react';
import { X, Download, Eye, Loader2, AlertCircle } from 'lucide-react';
import { fetchTemplateContent, getTemplateContentByType } from '../services/templateService';

interface TemplatePreviewProps {
  templateName: string;
  markdownUrl: string;
  onClose: () => void;
  onUseTemplate: (content: string) => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  templateName,
  markdownUrl,
  onClose,
  onUseTemplate
}) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  React.useEffect(() => {
    const loadTemplate = async () => {
      setIsLoading(true);
      setError('');
      try {
        let templateContent: string;
        
        // Ensure markdownUrl is a string to prevent undefined errors
        const currentMarkdownUrl = markdownUrl || '';
        
        // Check if it's a fallback template or empty URL
        if (currentMarkdownUrl.startsWith('fallback-') || currentMarkdownUrl === '') {
          // Use fallback template for empty URLs or explicit fallback requests
          const fallbackType = currentMarkdownUrl === '' ? 'fallback-classic' : currentMarkdownUrl;
          templateContent = getTemplateContentByType(fallbackType);
        } else {
          templateContent = await fetchTemplateContent(currentMarkdownUrl);
        }
        
        setContent(templateContent);
      } catch (err) {
        setError('Failed to load template preview');
        console.error('Template loading error:', err);
        
        // Try to load fallback content
        try {
          const fallbackContent = getTemplateContentByType('fallback-classic');
          setContent(fallbackContent);
          setError(''); // Clear error if fallback works
        } catch (fallbackErr) {
          console.error('Fallback template loading error:', fallbackErr);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [markdownUrl]);

  const handleUseTemplate = () => {
    if (content) {
      onUseTemplate(content);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Preview: {templateName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading template preview...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2 text-gray-800">Preview Unavailable</p>
                <p className="text-gray-600 mb-4">{error}</p>
                <p className="text-sm text-gray-500">You can still use this template - it will load the default content.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="bg-white rounded border p-6 shadow-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm leading-relaxed">
                    {content}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>This template is ATS-optimized and ready to customize</span>
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Will use default template content</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUseTemplate}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Use This Template (+50 XP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview