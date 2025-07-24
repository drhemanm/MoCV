import React, { useState, useEffect } from 'react';
import { Save, Download, Eye, EyeOff, Monitor, Tablet, Smartphone, Plus, Trash2, Star, User, Briefcase, GraduationCap, Award, Globe, Languages, Upload, FileText, Wand2, Lightbulb, X, ArrowLeft, CheckCircle, Sparkles, Code, Target, BookOpen, RefreshCw, Crown, Palette, Brain } from 'lucide-react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Globe, 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Eye, 
  EyeOff, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  X, 
  Loader2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Star,
  ExternalLink,
  Languages
} from 'lucide-react';
import { TargetMarket } from '../types';
import BackButton from './BackButton';
import AISuggestionsPanel from './AISuggestionsPanel';
import AIEnhanceButton from './AIEnhanceButton';
import CVImportSection from './CVImportSection';
import { generateCVPDF, downloadPDF } from '../services/pdfGenerationService';
import { ParsedCVData } from '../services/cvParsingService';
import { getTemplateContentByType } from '../services/templateService';
import gamificationService from '../services/gamificationService';

interface CVBuilderProps {
  targetMarket: TargetMarket | null;
  selectedTemplate?: CVTemplate | null;
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
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: string;
    written: string;
    spoken: string;
  }>;
}

const CVBuilder: React.FC<CVBuilderProps> = ({ targetMarket, selectedTemplate, onBack }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [showAITips, setShowAITips] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [templateContent, setTemplateContent] = useState<string>('');
  const [currentTemplate, setCurrentTemplate] = useState<CVTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  const [cvData, setCvData] = useState<CVData>({
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

  // Load existing CV data if editing
  useEffect(() => {
    // Load template information
    const loadTemplate = () => {
      try {
        // First try to get from props
        if (selectedTemplate) {
          setCurrentTemplate(selectedTemplate);
          console.log('Template loaded from props:', selectedTemplate.name);
          return;
        }

        // Then try localStorage
        const savedTemplateData = localStorage.getItem('mocv_selected_template_data');
        if (savedTemplateData) {
          const template = JSON.parse(savedTemplateData);
          setCurrentTemplate(template);
          console.log('Template loaded from localStorage:', template.name);
          return;
        }

        // Fallback to classic template
        const fallbackTemplate: CVTemplate = {
          id: 'classic-ats',
          name: 'Classic ATS',
          description: 'Professional and ATS-optimized template',
          category: 'Universal',
          icon: React.createElement(FileText, { className: "h-6 w-6" }),
          markdownUrl: 'fallback-classic',
          tags: ['professional', 'universal', 'ats-safe'],
          difficulty: 'Beginner',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setCurrentTemplate(fallbackTemplate);
        console.log('Using fallback template');
      } catch (error) {
        console.error('Error loading template:', error);
      }
    };

    loadTemplate();

    const editingData = localStorage.getItem('mocv_editing_cv');
    if (editingData) {
      try {
        const { cvData: existingData } = JSON.parse(editingData);
        if (existingData) {
          setCvData(prev => ({
            ...prev,
            ...existingData,
            // Ensure languages array exists
            languages: existingData.languages || []
          }));
        }
      } catch (error) {
        console.error('Error loading editing data:', error);
      }
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem('mocv_cv_draft', JSON.stringify(cvData));
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [cvData]);

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: <User className="h-5 w-5" />, required: true },
    { id: 'summary', name: 'Summary', icon: <FileText className="h-5 w-5" />, required: true },
    { id: 'experience', name: 'Experience', icon: <Briefcase className="h-5 w-5" />, required: true },
    { id: 'skills', name: 'Skills', icon: <Award className="h-5 w-5" />, required: true },
    { id: 'projects', name: 'Projects', icon: <Code className="h-5 w-5" />, required: false },
    { id: 'education', name: 'Education', icon: <GraduationCap className="h-5 w-5" />, required: false },
    { id: 'certifications', name: 'Certifications', icon: <Award className="h-5 w-5" />, required: false },
    { id: 'languages', name: 'Languages', icon: <Languages className="h-5 w-5" />, required: false }
  ];

  const handleImportComplete = (importedData: ParsedCVData) => {
    setCvData(prev => ({
      personalInfo: {
        fullName: importedData.personalInfo.fullName || prev.personalInfo.fullName,
        title: prev.personalInfo.title,
        email: importedData.personalInfo.email || prev.personalInfo.email,
        phone: importedData.personalInfo.phone || prev.personalInfo.phone,
        location: importedData.personalInfo.address || prev.personalInfo.location,
        linkedin: importedData.personalInfo.linkedin || prev.personalInfo.linkedin,
        website: importedData.personalInfo.website || prev.personalInfo.website
      },
      summary: importedData.summary || prev.summary,
      experience: importedData.experience.length > 0 ? importedData.experience.map(exp => ({
        id: exp.id,
        title: exp.role,
        company: exp.company,
        location: '',
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current,
        description: exp.description
      })) : prev.experience,
      education: importedData.education.length > 0 ? importedData.education.map(edu => ({
        id: edu.id,
        degree: edu.degree,
        school: edu.institution,
        location: '',
        graduationDate: edu.year,
        gpa: edu.gpa
      })) : prev.education,
      skills: importedData.skills.length > 0 ? importedData.skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        category: 'Technical'
      })) : prev.skills,
      projects: prev.projects,
      certifications: prev.certifications,
      languages: importedData.languages.length > 0 ? importedData.languages.map(lang => ({
        id: lang.id,
        name: lang.name,
        proficiency: lang.proficiency,
        written: lang.proficiency,
        spoken: lang.proficiency
      })) : prev.languages
    }));
    setShowImport(false);
  };

  // Load template content
  useEffect(() => {
    if (currentTemplate) {
      try {
        const content = getTemplateContentByType(currentTemplate.markdownUrl || 'fallback-classic');
        setTemplateContent(content);
        console.log('Template content loaded for:', currentTemplate.name);
      } catch (error) {
        console.error('Error loading template content:', error);
        setTemplateContent(getTemplateContentByType('fallback-classic'));
      }
    }
  }, [currentTemplate]);

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

  const addCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: ''
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

  const addLanguage = () => {
    const newLanguage = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'Intermediate',
      written: 'Intermediate',
      spoken: 'Intermediate'
    };
    setCvData(prev => ({
      ...prev,
      languages: [...prev.languages, newLanguage]
    }));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
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

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Get existing CVs
      const existingCVs = JSON.parse(localStorage.getItem('mocv_saved_cvs') || '[]');
      
      // Check if we're editing an existing CV
      const editingData = localStorage.getItem('mocv_editing_cv');
      let cvId: string;
      
      if (editingData) {
        const { cvId: existingId } = JSON.parse(editingData);
        cvId = existingId;
        
        // Update existing CV
        const updatedCVs = existingCVs.map((cv: any) => 
          cv.id === cvId 
            ? {
                ...cv,
                title: cvData.personalInfo.fullName || 'My CV',
                cvData,
                dateModified: new Date(),
                status: 'completed'
              }
            : cv
        );
        localStorage.setItem('mocv_saved_cvs', JSON.stringify(updatedCVs));
        
        // Clear editing state
        localStorage.removeItem('mocv_editing_cv');
      } else {
        // Create new CV
        cvId = Date.now().toString();
        const newCV = {
          id: cvId,
          title: cvData.personalInfo.fullName || 'My CV',
          templateName: 'Professional Template',
          templateId: localStorage.getItem('mocv_selected_template') || 'classic-ats',
          dateCreated: new Date(),
          dateModified: new Date(),
          atsScore: Math.floor(Math.random() * 20) + 75, // Mock ATS score
          status: 'completed',
          cvData,
          targetMarket: targetMarket?.name
        };
        
        const updatedCVs = [newCV, ...existingCVs];
        localStorage.setItem('mocv_saved_cvs', JSON.stringify(updatedCVs));
        
        // Award XP for CV creation
        gamificationService.trackCVCreation();
      }
      
      // Clear draft
      localStorage.removeItem('mocv_cv_draft');
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          CV saved successfully!
        </div>
      `;
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save CV. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const templateId = localStorage.getItem('mocv_selected_template') || 'classic-ats';
      const pdfBytes = await generateCVPDF(cvData, templateId);
      const filename = `${cvData.personalInfo.fullName || 'CV'}.pdf`.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      downloadPDF(pdfBytes, filename);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return 'w-80';
      case 'tablet': return 'w-96';
      default: return 'w-full';
    }
  };

  const renderPersonalInfoSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <AIEnhanceButton
          text={JSON.stringify(cvData.personalInfo)}
          sectionType="general"
          onTextUpdate={() => {}}
          targetMarket={targetMarket?.name}
          size="md"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Title *
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            placeholder="john.doe@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            placeholder="+230 5123 4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            placeholder="Port Louis, Mauritius"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
      </div>
    </div>
  );

  const renderSummarySection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
        <AIEnhanceButton
          text={cvData.summary}
          sectionType="summary"
          onTextUpdate={(newText) => setCvData(prev => ({ ...prev, summary: newText }))}
          targetMarket={targetMarket?.name}
          jobTitle={cvData.personalInfo.title}
          size="md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Summary *
        </label>
        <textarea
          value={cvData.summary}
          onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Write a compelling 2-3 sentence summary of your professional background, key skills, and career objectives..."
        />
        <div className="mt-2 text-sm text-gray-500">
          {cvData.summary.length}/300 characters • Aim for 150-300 characters
        </div>
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        <button
          onClick={addExperience}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      {cvData.experience.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No work experience added yet</h4>
          <p className="text-gray-600 mb-4">Add your professional experience to showcase your career journey</p>
          <button
            onClick={addExperience}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.experience.map((exp, index) => (
            <div key={exp.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                <div className="flex items-center gap-2">
                  <AIEnhanceButton
                    text={exp.description}
                    sectionType="experience"
                    onTextUpdate={(newText) => updateExperience(exp.id, 'description', newText)}
                    targetMarket={targetMarket?.name}
                    jobTitle={exp.title}
                  />
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Software Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tech Company Ltd"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Port Louis, Mauritius"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                      className="mr-2"
                    />
                    Currently working here
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {!exp.current && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description & Achievements *
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="• Led development of web applications serving 10,000+ users&#10;• Improved system performance by 40% through optimization&#10;• Mentored 3 junior developers and conducted code reviews"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Use bullet points (•) and include quantifiable achievements
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Skills & Competencies</h3>
        <button
          onClick={addSkill}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </button>
      </div>

      {cvData.skills.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h4>
          <p className="text-gray-600 mb-4">Add your technical and soft skills to highlight your capabilities</p>
          <button
            onClick={addSkill}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {cvData.skills.map((skill, index) => (
            <div key={skill.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Skill #{index + 1}</span>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name *</label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="JavaScript"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={skill.category}
                    onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Tools">Tools</option>
                    <option value="Languages">Languages</option>
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

  const renderProjectsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        <button
          onClick={addProject}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {cvData.projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No projects added yet</h4>
          <p className="text-gray-600 mb-4">Showcase your personal, academic, or professional projects</p>
          <button
            onClick={addProject}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.projects.map((project, index) => (
            <div key={project.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Project #{index + 1}</h4>
                <button
                  onClick={() => removeProject(project.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="E-commerce Platform"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                <input
                  type="text"
                  value={project.technologies.join(', ')}
                  onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, Node.js, MongoDB, AWS"
                />
                <div className="mt-1 text-xs text-gray-500">Separate technologies with commas</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Description *</label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe the project, your role, challenges solved, and impact achieved..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
        <button
          onClick={addEducation}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </button>
      </div>

      {cvData.education.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No education added yet</h4>
          <p className="text-gray-600 mb-4">Add your educational background and qualifications</p>
          <button
            onClick={addEducation}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Add Education
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="University of Mauritius"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Reduit, Mauritius"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Date</label>
                  <input
                    type="month"
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">GPA (Optional)</label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

  const renderCertificationsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
        <button
          onClick={addCertification}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Certification
        </button>
      </div>

      {cvData.certifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No certifications added yet</h4>
          <p className="text-gray-600 mb-4">Add professional certifications to strengthen your credentials</p>
          <button
            onClick={addCertification}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Add Certification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cvData.certifications.map((cert, index) => (
            <div key={cert.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Certification #{index + 1}</span>
                <button
                  onClick={() => removeCertification(cert.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name *</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="AWS Certified Developer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization *</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Amazon Web Services"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Obtained</label>
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLanguagesSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
        <button
          onClick={addLanguage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Language
        </button>
      </div>

      {cvData.languages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Languages className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No languages added yet</h4>
          <p className="text-gray-600 mb-4">
            Showcase your multilingual abilities - a key advantage for Mauritian professionals in global markets
          </p>
          <button
            onClick={addLanguage}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Add Your First Language
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cvData.languages.map((language, index) => (
            <div key={language.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Language #{index + 1}</span>
                <button
                  onClick={() => removeLanguage(language.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
                  <input
                    type="text"
                    value={language.name}
                    onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="English"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overall Proficiency</label>
                  <select
                    value={language.proficiency}
                    onChange={(e) => updateLanguage(language.id, 'proficiency', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                    <option value="Beginner">Beginner</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Written Level</label>
                  <select
                    value={language.written}
                    onChange={(e) => updateLanguage(language.id, 'written', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                    <option value="Beginner">Beginner</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spoken Level</label>
                  <select
                    value={language.spoken}
                    onChange={(e) => updateLanguage(language.id, 'spoken', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                    <option value="Beginner">Beginner</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Language Assessment Tips:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Be honest about your proficiency levels</li>
              <li>• Native: Mother tongue or equivalent fluency</li>
              <li>• Fluent: Near-native level with minor limitations</li>
              <li>• Advanced: High proficiency with occasional errors</li>
              <li>• Intermediate: Good working knowledge</li>
              <li>• Basic: Limited working proficiency</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const renderPreview = () => {
    const isEmpty = !cvData.personalInfo.fullName && !cvData.summary && 
                   cvData.experience.length === 0 && cvData.skills.length === 0;

    if (isEmpty) {
      return (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">CV Preview</h3>
          <p className="text-gray-600">Start filling out your information to see a live preview</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded border shadow-sm p-8 max-w-none">
        {/* Header */}
        <div className="text-center border-b pb-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {cvData.personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-lg text-gray-600 mb-3">
            {cvData.personalInfo.title || 'Your Professional Title'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            {cvData.personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {cvData.personalInfo.email}
              </span>
            )}
            {cvData.personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {cvData.personalInfo.phone}
              </span>
            )}
            {cvData.personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {cvData.personalInfo.location}
              </span>
            )}
            {cvData.personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                LinkedIn
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {cvData.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Experience</h3>
            <div className="space-y-4">
              {cvData.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                  <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                  {exp.description && (
                    <div className="text-gray-700 text-sm whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {cvData.skills.map((skill) => (
                <span key={skill.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {cvData.projects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects</h3>
            <div className="space-y-4">
              {cvData.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    {project.link && (
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  {project.technologies.length > 0 && (
                    <p className="text-sm text-blue-600 mb-2">
                      Technologies: {project.technologies.join(', ')}
                    </p>
                  )}
                  <p className="text-gray-700 text-sm">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
            <div className="space-y-3">
              {cvData.education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-blue-600">{edu.school}</p>
                  <p className="text-sm text-gray-500">
                    {edu.graduationDate} {edu.location && `• ${edu.location}`}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {cvData.certifications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
            <div className="space-y-2">
              {cvData.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{cert.name}</span>
                    <span className="text-gray-600"> - {cert.issuer}</span>
                  </div>
                  {cert.date && (
                    <span className="text-sm text-gray-500">{cert.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {cvData.languages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
            <div className="space-y-3">
              {cvData.languages.map((language) => (
                <div key={language.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{language.name}</span>
                    <span className="text-gray-600 ml-2">({language.proficiency})</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Written: {language.written} • Spoken: {language.spoken}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'personal': return renderPersonalInfoSection();
      case 'summary': return renderSummarySection();
      case 'experience': return renderExperienceSection();
      case 'skills': return renderSkillsSection();
      case 'projects': return renderProjectsSection();
      case 'education': return renderEducationSection();
      case 'certifications': return renderCertificationsSection();
      case 'languages': return renderLanguagesSection();
      default: return renderPersonalInfoSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} label="Back" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">CV Builder</h1>
                <p className="text-sm text-gray-600">
                  Create your professional CV
                  {targetMarket && ` • Optimized for ${targetMarket.flag} ${targetMarket.name}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowImport(true)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import CV
              </button>
              
              <button
                onClick={() => setShowAITips(!showAITips)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  showAITips 
                    ? 'bg-purple-600 text-white' 
                    : 'border border-purple-600 text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                AI Tips
              </button>
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  showPreview 
                    ? 'bg-blue-600 text-white' 
                    : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                Preview
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isGeneratingPDF ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className={`flex gap-8 ${showPreview ? 'grid grid-cols-12' : ''}`}>
          {/* Sidebar */}
          <div className={showPreview ? 'col-span-3' : 'w-64 flex-shrink-0'}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">CV Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {section.icon}
                    <span className="text-sm">{section.name}</span>
                    {section.required && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className={showPreview ? 'col-span-5' : 'flex-1'}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {renderCurrentSection()}
            </div>
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="col-span-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
                {/* Preview Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Live Preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                        title="Desktop view"
                      >
                        <div className="w-4 h-3 border border-gray-400 rounded-sm"></div>
                      </button>
                      <button
                        onClick={() => setPreviewDevice('tablet')}
                        className={`p-1 rounded ${previewDevice === 'tablet' ? 'bg-white shadow-sm' : ''}`}
                        title="Tablet view"
                      >
                        <div className="w-3 h-4 border border-gray-400 rounded-sm"></div>
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                        title="Mobile view"
                      >
                        <div className="w-2 h-4 border border-gray-400 rounded-sm"></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div className={`mx-auto transition-all duration-300 ${getPreviewWidth()}`}>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {renderPreview()}
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-xs text-gray-500">
                      Live preview • Updates automatically
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Tips Panel */}
      <AISuggestionsPanel
        cvData={cvData}
        isVisible={showAITips}
        onClose={() => setShowAITips(false)}
      />

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <CVImportSection
              onImportComplete={handleImportComplete}
              onClose={() => setShowImport(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CVBuilder;