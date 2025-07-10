import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2, Download, X } from 'lucide-react';
import { parseCV, ParsedCVData } from '../services/cvParsingService';

interface CVImportSectionProps {
  onImportComplete: (data: ParsedCVData) => void;
  onClose?: () => void;
}

const CVImportSection: React.FC<CVImportSectionProps> = ({ onImportComplete, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError('');
    setSuccess(false);
    setIsProcessing(true);

    try {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      const allowedExtensions = ['.pdf', '.docx', '.txt'];
      const hasValidType = allowedTypes.includes(file.type);
      const hasValidExtension = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

      if (!hasValidType && !hasValidExtension) {
        throw new Error('Please upload a PDF, DOCX, or TXT file');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Parse the CV
      const parsedData = await parseCV(file);
      
      setSuccess(true);
      setTimeout(() => {
        onImportComplete(parsedData);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Import My CV</h2>
          <p className="text-gray-600">Upload your existing CV to auto-fill the form fields</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : error
            ? 'border-red-300 bg-red-50'
            : success
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="py-8">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-lg font-medium text-gray-700 mb-2">Processing your CV...</p>
            <p className="text-gray-500">This may take a few moments</p>
          </div>
        ) : success ? (
          <div className="py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-700 mb-2">CV imported successfully!</p>
            <p className="text-green-600">Form fields will be auto-filled shortly</p>
          </div>
        ) : error ? (
          <div className="py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-red-700 mb-2">Import failed</p>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => setError('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your CV here or click to browse
            </p>
            <p className="text-gray-500 mb-6">Supports PDF, DOCX, and TXT files (max 10MB)</p>
            
            <button
              onClick={() => document.getElementById('cv-file-input')?.click()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Choose File
            </button>
            
            <input
              id="cv-file-input"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Supported Formats */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <FileText className="h-8 w-8 text-red-500" />
          <div>
            <div className="font-medium text-gray-900">PDF Files</div>
            <div className="text-sm text-gray-500">Standard CV format</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <FileText className="h-8 w-8 text-blue-500" />
          <div>
            <div className="font-medium text-gray-900">DOCX Files</div>
            <div className="text-sm text-gray-500">Microsoft Word</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <FileText className="h-8 w-8 text-green-500" />
          <div>
            <div className="font-medium text-gray-900">TXT Files</div>
            <div className="text-sm text-gray-500">Plain text format</div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Import Tips:</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Ensure your CV has clear section headers (Experience, Education, Skills)</li>
          <li>• Use standard formatting for best results</li>
          <li>• LinkedIn exports work well with our parser</li>
          <li>• You can review and edit all imported data before saving</li>
        </ul>
      </div>
    </div>
  );
};

export default CVImportSection;