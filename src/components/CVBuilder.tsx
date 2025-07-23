import React, { useState, useEffect } from 'react';
import { Save, Download, Eye, Plus, Trash2, User, Briefcase, GraduationCap, Award, Globe, FileText, Zap, Lightbulb, Upload, Palette, X } from 'lucide-react';
import { TargetMarket } from '../types';
import BackButton from './BackButton';
import CVImportSection from './CVImportSection';
import AIEnhanceButton from './AIEnhanceButton';
import AISuggestionsPanel from './AISuggestionsPanel';
import { generateCVPDF, downloadPDF } from '../services/pdfGenerationService';
import { parseCV, ParsedCVData } from '../services/cvParsingService';
import CVTemplatePreview from './CVTemplatePreview';

interface CVBuilderProps {
  targetMarket: TargetMarket | null;
  onBack: () => void;
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
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: number;
    category: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    verificationLink?: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: 'Basic' | 'Intermediate' | 'Fluent';
  }>;
}

const CVBuilder: React.FC<CVBuilderProps> = ({ targetMarket, onBack }) => {
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      photo: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: []
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('classic-professional');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Available templates
  const availableTemplates = [
    { id: 'classic-professional', name: 'Classic Professional', description: 'Traditional and ATS-friendly' },
    { id: 'modern-minimal', name: 'Modern Minimal', description: 'Clean and contemporary design' },
    { id: 'creative-designer', name: 'Creative Designer', description: 'Colorful and artistic layout' },
    { id: 'tech-developer', name: 'Tech Developer', description: 'Terminal-inspired for developers' },
    { id: 'executive-leader', name: 'Executive Leader', description: 'Professional for senior roles' },
    { id: 'academic-researcher', name: 'Academic Researcher', description: 'Formal academic format' },
    { id: 'startup-entrepreneur', name: 'Startup Entrepreneur', description: 'Dynamic and innovative' },
    { id: 'consulting-analyst', name: 'Consulting Analyst', description: 'Business-focused layout' },
    { id: 'healthcare-professional', name: 'Healthcare Professional', description: 'Medical and clinical focus' },
    { id: 'marketing-creative', name: 'Marketing Creative', description: 'Vibrant and engaging design' }
  ];

  // Load existing CV data if editing
  useEffect(() => {
    const editingData = localStorage.getItem('mocv_editing_cv');
    if (editingData) {
      try {
        const { cvData: existingData } = JSON.parse(editingData);
        if (existingData) {
          setCvData(existingData);
        }
      } catch (error) {
        console.error('Error loading editing data:', error);
      }
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (cvData.personalInfo.fullName || cvData.summary) {
        handleSave(true); // Silent save
      }
    }, 5000);

    return () => clearTimeout(autoSave);
  }, [cvData]);

  const handleSave = async (silent = false) => {
    if (!silent) setIsSaving(true);

    try {
      // Get existing CVs
      const existingCVs = JSON.parse(localStorage.getItem('mocv_saved_cvs') || '[]');
      
      // Check if we're editing an existing CV
      const editingData = localStorage.getItem('mocv_editing_cv');
      let cvId = Date.now().toString();
      let isEditing = false;

      if (editingData) {
        try {
          const { cvId: existingId, isEditing: editing } = JSON.parse(editingData);
          if (existingId && editing) {
            cvId = existingId;
            isEditing = true;
          }
        } catch (error) {
          console.error('Error parsing editing data:', error);
        }
      }

      const cvTitle = cvData.personalInfo.fullName || 'Untitled CV';
      const templateId = localStorage.getItem('mocv_selected_template') || 'classic-ats';
      const templateName = getTemplateName(templateId);

      const savedCV = {
        id: cvId,
        title: cvTitle,
        templateName,
        templateId,
        dateCreated: isEditing ? 
          (existingCVs.find((cv: any) => cv.id === cvId)?.dateCreated || new Date()) : 
          new Date(),
        dateModified: new Date(),
        atsScore: calculateATSScore(cvData),
        status: 'draft' as const,
        cvData,
        targetMarket: targetMarket?.id || 'global'
      };

      let updatedCVs;
      if (isEditing) {
        // Update existing CV
        updatedCVs = existingCVs.map((cv: any) => cv.id === cvId ? savedCV : cv);
      } else {
        // Add new CV
        updatedCVs = [savedCV, ...existingCVs];
      }

      localStorage.setItem('mocv_saved_cvs', JSON.stringify(updatedCVs));
      setLastSaved(new Date());

      if (!silent) {
        // Award XP for saving
        const gameData = JSON.parse(localStorage.getItem('mocv_game_data') || '{}');
        const updatedGameData = {
          ...gameData,
          totalXP: (gameData.totalXP || 0) + 25,
          currentLevel: Math.floor(((gameData.totalXP || 0) + 25) / 100)
        };
        localStorage.setItem('mocv_game_data', JSON.stringify(updatedGameData));
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      alert('Failed to save CV. Please try again.');
    } finally {
      if (!silent) setIsSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!cvData.personalInfo.fullName) {
      alert('Please enter your full name before generating PDF');
      return;
    }

    setIsGeneratingPDF(true);

    try {
      const templateId = localStorage.getItem('mocv_selected_template') || 'classic-ats';
      const pdfBytes = await generateCVPDF(cvData, templateId);
      
      const fileName = `MoCV_${cvData.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`;
      downloadPDF(pdfBytes, fileName);

      // Award XP for PDF generation
      const gameData = JSON.parse(localStorage.getItem('mocv_game_data') || '{}');
      const updatedGameData = {
        ...gameData,
        totalXP: (gameData.totalXP || 0) + 50,
        currentLevel: Math.floor(((gameData.totalXP || 0) + 50) / 100)
      };
      localStorage.setItem('mocv_game_data', JSON.stringify(updatedGameData));

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const calculateATSScore = (data: CVData): number => {
    let score = 0;
    
    // Personal info completeness (20 points)
    const personalFields = Object.values(data.personalInfo).filter(Boolean);
    score += Math.min(20, (personalFields.length / 7) * 20);
    
    // Summary (15 points)
    if (data.summary && data.summary.length > 50) score += 15;
    else if (data.summary) score += 8;
    
    // Experience (25 points)
    score += Math.min(25, data.experience.length * 8);
    
    // Education (15 points)
    score += Math.min(15, data.education.length * 7);
    
    // Skills (15 points)
    score += Math.min(15, data.skills.length * 2);
    
    // Additional sections (10 points)
    if (data.projects.length > 0) score += 5;
    if (data.certifications.length > 0) score += 3;
    if (data.languages.length > 0) score += 2;
    
    return Math.min(100, Math.round(score));
  };

  const getTemplateName = (templateId: string): string => {
    const templateNames: { [key: string]: string } = {
      'classic-ats': 'Classic ATS',
      'modern-minimal': 'Modern Minimal',
      'tech-focus': 'Tech Focus',
      'leadership': 'Leadership'
    };
    return templateNames[templateId] || 'Classic ATS';
  };

  const handleImportComplete = (importedData: ParsedCVData) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        fullName: importedData.personalInfo.fullName || prev.personalInfo.fullName,
        email: importedData.personalInfo.email || prev.personalInfo.email,
        phone: importedData.personalInfo.phone || prev.personalInfo.phone,
        linkedin: importedData.personalInfo.linkedin || prev.personalInfo.linkedin,
        website: importedData.personalInfo.website || prev.personalInfo.website
      },
      summary: importedData.summary || prev.summary,
      experience: importedData.experience.length > 0 ? importedData.experience : prev.experience,
      education: importedData.education.length > 0 ? importedData.education : prev.education,
      skills: importedData.skills.length > 0 ? importedData.skills : prev.skills,
      languages: importedData.languages.length > 0 ? importedData.languages : prev.languages
    }));
    setShowImportModal(false);
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      gpa: ''
    };
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: '',
      level: 3,
      category: 'Technical'
    };
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (id: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  // Projects functions
  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: ''
    };
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id: string, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (id: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  // Certifications functions
  const addCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      verificationLink: ''
    };
    setCvData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (id: string) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  // Languages functions
  const addLanguage = () => {
    const newLang = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'Intermediate' as const
    };
    setCvData(prev => ({
      ...prev,
      languages: [...prev.languages, newLang]
    }));
  };

  const updateLanguage = (id: string, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.map(lang => 
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (id: string) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'skills', name: 'Skills', icon: Award },
    { id: 'projects', name: 'Projects', icon: Globe },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'languages', name: 'Languages', icon: Globe }
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <User className="h-5 w-5 text-blue-600" />
        Personal Information
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={cvData.personalInfo.fullName}
            onChange={(e) => setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, fullName: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professional Title
          </label>
          <input
            type="text"
            value={cvData.personalInfo.title}
            onChange={(e) => setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, title: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Software Engineer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={cvData.personalInfo.email}
            onChange={(e) => setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, email: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={cvData.personalInfo.phone}
            onChange={(e) => setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, phone: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={cvData.personalInfo.location}
            onChange={(e) => setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, location: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="New York, NY"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={cvData.personalInfo.linkedin}
            onChange={(e) => setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCvData(prev => ({
            ...prev,
            personalInfo: {
              fullName: '',
              title: '',
              email: '',
              phone: '',
              location: '',
              linkedin: '',
              website: ''
            }
          }))}
          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Clear Personal Info
        </button>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Professional Summary
        </h3>
        <AIEnhanceButton
          text={cvData.summary}
          sectionType="summary"
          onTextUpdate={(newText) => setCvData(prev => ({ ...prev, summary: newText }))}
          targetMarket={targetMarket?.name}
          size="md"
        />
      </div>
      
      <div>
        <textarea
          value={cvData.summary}
          onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career objectives..."
        />
        <div className="text-xs text-gray-500 mt-1">
          {cvData.summary.length}/500 characters
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCvData(prev => ({ ...prev, summary: '' }))}
          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Clear Summary
        </button>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          Work Experience
        </h3>
        <button
          onClick={addExperience}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </button>
        <button
          onClick={() => setCvData(prev => ({ ...prev, experience: [] }))}
          className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-300 hover:border-red-500 transition-colors flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear All Experience
        </button>
      </div>

      {cvData.experience.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No work experience added yet</p>
          <p className="text-sm">Click "Add Experience" to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.experience.map((exp, index) => (
            <div key={exp.id} className="bg-gray-50 rounded-lg p-6 relative">
              <button
                onClick={() => removeExperience(exp.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Software Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tech Company Inc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="New York, NY"
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      disabled={exp.current}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">I currently work here</span>
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Description
                  </label>
                  <AIEnhanceButton
                    text={exp.description}
                    sectionType="experience"
                    onTextUpdate={(newText) => updateExperience(exp.id, 'description', newText)}
                    targetMarket={targetMarket?.name}
                    jobTitle={exp.title}
                  />
                </div>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Include quantifiable results where possible"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          Education
        </h3>
        <button
          onClick={addEducation}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </button>
        <button
          onClick={() => setCvData(prev => ({ ...prev, education: [] }))}
          className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-300 hover:border-red-500 transition-colors flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear All Education
        </button>
      </div>

      {cvData.education.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No education added yet</p>
          <p className="text-sm">Click "Add Education" to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.education.map((edu) => (
            <div key={edu.id} className="bg-gray-50 rounded-lg p-6 relative">
              <button
                onClick={() => removeEducation(edu.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School/University *
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="University of Technology"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="New York, NY"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Date
                  </label>
                  <input
                    type="month"
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3.8/4.0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          Skills
        </h3>
        <button
          onClick={addSkill}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </button>
        <button
          onClick={() => setCvData(prev => ({ ...prev, skills: [] }))}
          className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-300 hover:border-red-500 transition-colors flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear All Skills
        </button>
      </div>

      {cvData.skills.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No skills added yet</p>
          <p className="text-sm">Click "Add Skill" to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {cvData.skills.map((skill) => (
            <div key={skill.id} className="bg-gray-50 rounded-lg p-4 relative">
              <button
                onClick={() => removeSkill(skill.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="JavaScript"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={skill.category}
                    onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Languages">Languages</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proficiency Level: {skill.level}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Projects
        </h3>
        <button
          onClick={addProject}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
        <button
          onClick={() => setCvData(prev => ({ ...prev, projects: [] }))}
          className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-300 hover:border-red-500 transition-colors flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear All Projects
        </button>
      </div>

      {cvData.projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No projects added yet</p>
          <p className="text-sm">Click "Add Project" to showcase your work</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.projects.map((project) => (
            <div key={project.id} className="bg-gray-50 rounded-lg p-6 relative">
              <button
                onClick={() => removeProject(project.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="E-commerce Website"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe what the project does, your role, and key achievements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technologies Used
                  </label>
                  <input
                    type="text"
                    value={project.technologies.join(', ')}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(tech => tech.trim()).filter(Boolean))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="React, Node.js, MongoDB, AWS (separate with commas)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={project.link || ''}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/username/project or https://project-demo.com"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          Certifications
        </h3>
        <button
          onClick={addCertification}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Certification
        </button>
        <button
          onClick={() => setCvData(prev => ({ ...prev, certifications: [] }))}
          className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-300 hover:border-red-500 transition-colors flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear All Certifications
        </button>
      </div>

      {cvData.certifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No certifications added yet</p>
          <p className="text-sm">Click "Add Certification" to showcase your credentials</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.certifications.map((cert) => (
            <div key={cert.id} className="bg-gray-50 rounded-lg p-6 relative">
              <button
                onClick={() => removeCertification(cert.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="AWS Certified Solutions Architect"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Amazon Web Services"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Obtained
                  </label>
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={cert.verificationLink || ''}
                    onChange={(e) => updateCertification(cert.id, 'verificationLink', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://verify.certification.com/12345"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Languages
        </h3>
        <button
          onClick={addLanguage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Language
        </button>
        <button
          onClick={() => setCvData(prev => ({ ...prev, languages: [] }))}
          className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-300 hover:border-red-500 transition-colors flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear All Languages
        </button>
      </div>

      {cvData.languages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No languages added yet</p>
          <p className="text-sm">Click "Add Language" to showcase your multilingual abilities</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {cvData.languages.map((language) => (
            <div key={language.id} className="bg-gray-50 rounded-lg p-4 relative">
              <button
                onClick={() => removeLanguage(language.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language *
                  </label>
                  <input
                    type="text"
                    value={language.name}
                    onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="English, French, Spanish..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proficiency Level
                  </label>
                  <select
                    value={language.proficiency}
                    onChange={(e) => updateLanguage(language.id, 'proficiency', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Fluent">Fluent</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {targetMarket && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Language Tips for {targetMarket.name}:</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            {targetMarket.name === 'Mauritius' && (
              <>
                <li>• English and French are highly valued</li>
                <li>• Creole can be mentioned for local roles</li>
                <li>• Hindi/Urdu useful for certain industries</li>
              </>
            )}
            {targetMarket.name === 'Canada' && (
              <>
                <li>• English and French bilingualism is a major advantage</li>
                <li>• Specify Canadian Language Benchmarks (CLB) levels if known</li>
              </>
            )}
            {targetMarket.name === 'Germany' && (
              <>
                <li>• German proficiency is essential for most roles</li>
                <li>• Use CEFR levels (A1-C2) to specify proficiency</li>
                <li>• English is important for international companies</li>
              </>
            )}
            {!['Mauritius', 'Canada', 'Germany'].includes(targetMarket.name) && (
              <>
                <li>• English proficiency is typically essential</li>
                <li>• Local language skills can be a significant advantage</li>
                <li>• Specify your proficiency level clearly</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalInfo();
      case 'summary':
        return renderSummary();
      case 'experience':
        return renderExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      case 'projects':
        return renderProjects();
      case 'certifications':
        return renderCertifications();
      case 'languages':
        return renderLanguages();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <BackButton onClick={onBack} label="Back to Home" />
            
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all CV data? This action cannot be undone.')) {
                  setCvData({
                    personalInfo: {
                      fullName: '',
                      title: '',
                      email: '',
                      phone: '',
                      location: '',
                      linkedin: '',
                      website: ''
                    },
                    summary: '',
                    experience: [],
                    education: [],
                    skills: [],
                    projects: [],
                    certifications: [],
                    languages: []
                  });
                }
              }}
              className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-300 hover:border-red-500 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear All Data
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Palette className="h-4 w-4" />
                Templates
              </button>
              
              <button
                onClick={() => setShowImportModal(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import CV
              </button>
              
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                AI Tips
              </button>
              
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save CV
                  </>
                )}
              </button>
              
              <button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF || !cvData.personalInfo.fullName}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Generate PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Template Selector */}
          {showTemplateSelector && (
            <div className="mt-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Choose Template Style</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {availableTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplateId(template.id);
                      setShowTemplateSelector(false);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedTemplateId === template.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">CV Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{section.name}</span>
                    </button>
                  );
                })}
              </nav>
              
              {/* ATS Score */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 lg:sticky lg:top-24">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview - {availableTemplates.find(t => t.id === selectedTemplateId)?.name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    Updates automatically as you type
                  </div>
                </div>
              </div>
              
              <div className="h-96 lg:h-[600px] overflow-y-auto">
                <CVTemplatePreview
                  templateId={selectedTemplateId}
                  cvData={cvData}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <CVImportSection
              onImportComplete={handleImportComplete}
              onClose={() => setShowImportModal(false)}
            />
          </div>
        </div>
      )}

      {/* AI Suggestions Panel */}
      <AISuggestionsPanel
        cvData={cvData}
        isVisible={showSuggestions}
        onClose={() => setShowSuggestions(false)}
      />
    </div>
  );
};

export default CVBuilder;