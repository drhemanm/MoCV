import React, { useState, useEffect } from 'react';
import {
  Save, Download, Eye, Lock, Sun, Moon, Compress, Expand
} from 'lucide-react';
import { TargetMarket } from '../types';
import BackButton from './BackButton';
import { generateCVPDF, downloadPDF } from '../services/pdfGenerationService';

interface CVBuilderProps {
  targetMarket: TargetMarket | null;
  onBack: () => void;
  isPro?: boolean; // flag to simulate premium access
}

interface CVData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    photo?: string;
  };
  summary: string;
  experience: Array<any>;
  education: Array<any>;
  skills: Array<any>;
  projects: Array<any>;
  certifications: Array<any>;
  languages: Array<any>;
}

const templates = [
  { id: 'classic-ats', label: '📄 Classic ATS', premium: false, thumbnail: '/thumbs/classic.jpg' },
  { id: 'modern-minimal', label: '🎯 Modern Minimal', premium: false, thumbnail: '/thumbs/modern.jpg' },
  { id: 'tech-focus', label: '💻 Tech Focus', premium: true, thumbnail: '/thumbs/tech.jpg' },
  { id: 'leadership', label: '🏆 Leadership', premium: true, thumbnail: '/thumbs/leader.jpg' },
];

const CVBuilder: React.FC<CVBuilderProps> = ({ targetMarket, onBack, isPro = false }) => {
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '', photo: ''
    },
    summary: '', experience: [], education: [], skills: [], projects: [], certifications: [], languages: []
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>(localStorage.getItem('mocv_selected_template') || 'classic-ats');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);

  const handleGeneratePDF = async () => {
    if (!cvData.personalInfo.fullName) return alert('Please enter full name');
    setIsGeneratingPDF(true);
    try {
      const pdfBytes = await generateCVPDF(cvData, selectedTemplate);
      const fileName = `MoCV_${cvData.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`;
      downloadPDF(pdfBytes, fileName);
    } catch (err) {
      alert('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const toggleTemplate = (templateId: string, premium: boolean) => {
    if (premium && !isPro) return;
    setSelectedTemplate(templateId);
    localStorage.setItem('mocv_selected_template', templateId);
  };

  return (
    <div className={`min-h-screen transition ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} ${compactView ? 'text-sm' : 'text-base'}`}>
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <BackButton onClick={onBack} label="Back" />
          <h1 className="font-bold text-xl">CV Builder</h1>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => setDarkMode(!darkMode)} className="hover:scale-105 transition">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button onClick={() => setCompactView(!compactView)} className="hover:scale-105 transition">
            {compactView ? <Expand className="h-5 w-5" /> : <Compress className="h-5 w-5" />}
          </button>
          <button onClick={handleGeneratePDF} disabled={isGeneratingPDF} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            <Download className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h2 className="font-semibold mb-4">Select a Template</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {templates.map(({ id, label, premium, thumbnail }) => (
            <div
              key={id}
              className={`border rounded-lg overflow-hidden shadow-sm relative cursor-pointer ${selectedTemplate === id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => toggleTemplate(id, premium)}
            >
              <img src={thumbnail} alt={label} className="w-full h-36 object-cover" />
              <div className="p-2 flex justify-between items-center">
                <span>{label}</span>
                {premium && !isPro && <Lock className="h-4 w-4 text-yellow-500" title="Pro only" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">[CV form fields go here]</p>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
