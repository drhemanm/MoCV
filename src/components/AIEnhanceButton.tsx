import React, { useState } from 'react';
import { Wand2, Loader2, CheckCircle, X, RotateCcw, Copy } from 'lucide-react';
import { enhanceText, getEnhancementSuggestions, EnhancementRequest, EnhancementResponse } from '../services/aiEnhancementService';

interface AIEnhanceButtonProps {
  text: string;
  sectionType: 'summary' | 'experience' | 'education' | 'skills' | 'general';
  onTextUpdate: (newText: string) => void;
  targetMarket?: string;
  jobTitle?: string;
  className?: string;
  size?: 'sm' | 'md';
}

const AIEnhanceButton: React.FC<AIEnhanceButtonProps> = ({
  text,
  sectionType,
  onTextUpdate,
  targetMarket,
  jobTitle,
  className = '',
  size = 'sm'
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [enhancement, setEnhancement] = useState<EnhancementResponse | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleEnhance = async () => {
    if (!text.trim()) {
      setShowSuggestions(true);
      return;
    }

    setIsEnhancing(true);
    
    try {
      const request: EnhancementRequest = {
        text,
        sectionType,
        targetMarket,
        jobTitle
      };
      
      const result = await enhanceText(request);
      setEnhancement(result);
      setShowModal(true);
    } catch (error) {
      console.error('Enhancement error:', error);
      // Show error state or fallback
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAccept = () => {
    if (enhancement) {
      onTextUpdate(enhancement.enhancedText);
      setShowModal(false);
      setEnhancement(null);
    }
  };

  const handleReject = () => {
    setShowModal(false);
    setEnhancement(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const suggestions = getEnhancementSuggestions(sectionType, text);

  const buttonSize = size === 'sm' ? 'p-1.5' : 'p-2';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <>
      <button
        onClick={handleEnhance}
        disabled={isEnhancing}
        className={`inline-flex items-center gap-1 bg-purple-600 text-white ${buttonSize} rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="AI Enhance"
      >
        {isEnhancing ? (
          <Loader2 className={`${iconSize} animate-spin`} />
        ) : (
          <Wand2 className={iconSize} />
        )}
        {size === 'md' && <span className="text-xs">AI Enhance</span>}
      </button>

      {/* Enhancement Modal */}
      {showModal && enhancement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div>
                <h3 className="text-xl font-bold">AI Enhancement Results</h3>
                <p className="text-purple-100 text-sm">Confidence: {enhancement.confidence}%</p>
              </div>
              <button
                onClick={handleReject}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Text */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    Original Text
                    <button
                      onClick={() => copyToClipboard(enhancement.originalText)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy original"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <pre className="whitespace-pre-wrap text-gray-700 text-sm font-sans">
                      {enhancement.originalText}
                    </pre>
                  </div>
                </div>

                {/* Enhanced Text */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Enhanced Text
                    <button
                      onClick={() => copyToClipboard(enhancement.enhancedText)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy enhanced"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </h4>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <pre className="whitespace-pre-wrap text-gray-700 text-sm font-sans">
                      {enhancement.enhancedText}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Improvements */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">What was improved:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {enhancement.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      {improvement}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                💡 AI Enhanced - You can still edit manually after accepting
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Keep Original
                </button>
                <button
                  onClick={handleEnhance}
                  className="px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Regenerate
                </button>
                <button
                  onClick={handleAccept}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Use Enhanced Version
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions Modal */}
      {showSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <Wand2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Enhancement Tips</h3>
              <p className="text-gray-600">Add some content first, then I can help enhance it!</p>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-gray-900">Suggestions for {sectionType}:</h4>
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  {suggestion}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSuggestions(false)}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIEnhanceButton;