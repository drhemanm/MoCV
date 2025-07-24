import React, { useState, useEffect } from 'react';
import { Save, Download, Eye, EyeOff, Monitor, Tablet, Smartphone, Plus, Trash2, Star, User, Briefcase, GraduationCap, Award, Globe, Languages, Upload, FileText, Wand2, Lightbulb, X, ArrowLeft, CheckCircle, Sparkles, RefreshCw, Mail, Phone, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { CVTemplate, TargetMarket } from '../types';
import BackButton from './BackButton';
import AIEnhanceButton from './AIEnhanceButton';
import AISuggestionsPanel from './AISuggestionsPanel';
import CVImportSection from './CVImportSection';
import RichTextEditor from './RichTextEditor';
import { generateCVPDF, downloadPDF } from '../services/pdfGenerationService';
import gamificationService from '../services/gamificationService';

interface CVBuilderProps {
  selectedTemplate: CVTemplate | null;
  targetMarket: TargetMarket | null;
  onBack: () => void;
  onChangeTemplate: () => void;
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
    verificationLink?: string;
  }>;
  languages?: Array<{
    id: string;
    name: string;
    proficiency: string;
    written: string;
    spoken: string;
  }>;
}

const CVBuilder: React.FC<CVBuilderProps> = ({ selectedTemplate, targetMarket, onBack, onChangeTemplate }) => {
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

  const [activeSection, setActiveSection] = useState('personal');
  const [previewMode, setPreviewMode] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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
    const saveTimer = setTimeout(() => {
      saveCV(false);
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [cvData]);

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: <User className="h-5 w-5" />, required: true },
    { id: 'summary', name: 'Summary', icon: <FileText className="h-5 w-5" />, required: true },
    { id: 'experience', name: 'Experience', icon: <Briefcase className="h-5 w-5" />, required: true },
    { id: 'education', name: 'Education', icon: <GraduationCap className="h-5 w-5" />, required: false },
    { id: 'skills', name: 'Skills', icon: <Award className="h-5 w-5" />, required: true },
    { id: 'projects', name: 'Projects', icon: <Globe className="h-5 w-5" />, required: false },
    { id: 'certifications', name: 'Certifications', icon: <Star className="h-5 w-5" />, required: false },
    { id: 'languages', name: 'Languages', icon: <Languages className="h-5 w-5" />, required: false }
  ];

  const saveCV = async (showNotification = true) => {
    if (showNotification) setIsSaving(true);
    
    try {
      // Generate a title if not provided
      const title = cvData.personalInfo.fullName 
        ? `${cvData.personalInfo.fullName} - ${selectedTemplate?.name || 'CV'}`
        : `CV - ${selectedTemplate?.name || 'Untitled'}`;

      // Calculate completion score
      const completionScore = calculateCompletionScore();
      
      // Create CV object
      const cvToSave = {
        id: Date.now().toString(),
        title,
        templateName: selectedTemplate?.name || 'Unknown Template',
        templateId: selectedTemplate?.id || 'default',
        dateCreated: new Date(),
        dateModified: new Date(),
        atsScore: Math.min(95, Math.max(60, completionScore)),
        status: completionScore >= 80 ? 'completed' : 'draft',
        cvData,
        targetMarket: targetMarket?.name
      };

      // Save to localStorage
      const existingCVs = JSON.parse(localStorage.getItem('mocv_saved_cvs') || '[]');
      
      // Check if we're editing an existing CV
      const editingData = localStorage.getItem('mocv_editing_cv');
      if (editingData) {
        const { cvId } = JSON.parse(editingData);
        const existingIndex = existingCVs.findIndex((cv: any) => cv.id === cvId);
        if (existingIndex !== -1) {
          existingCVs[existingIndex] = { ...cvToSave, id: cvId };
        } else {
          existingCVs.unshift(cvToSave);
        }
      } else {
        existingCVs.unshift(cvToSave);
      }

      localStorage.setItem('mocv_saved_cvs', JSON.stringify(existingCVs));
      
      if (showNotification) {
        setLastSaved(new Date());
        
        // Award XP for CV creation/update
        const result = gamificationService.trackCVCreation();
        // You could show XP notification here if needed
      }
    } catch (error) {
      console.error('Error saving CV:', error);
    } finally {
      if (showNotification) setIsSaving(false);
    }
  };

  const calculateCompletionScore = (): number => {
    let score = 0;
    
    // Personal info (30 points)
    if (cvData.personalInfo.fullName) score += 10;
    if (cvData.personalInfo.email) score += 10;
    if (cvData.personalInfo.phone) score += 5;
    if (cvData.personalInfo.linkedin) score += 5;

    // Summary (20 points)
    if (cvData.summary && cvData.summary.length > 50) score += 20;

    // Experience (25 points)
    if (cvData.experience.length > 0) score += 15;
    if (cvData.experience.some(exp => exp.description && exp.description.length > 50)) score += 10;

    // Skills (15 points)
    if (cvData.skills.length >= 3) score += 10;
    if (cvData.skills.length >= 6) score += 5;

    // Education (10 points)
    if (cvData.education.length > 0) score += 10;

    return Math.min(100, score);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdfBytes = await generateCVPDF(cvData, selectedTemplate?.id || 'classic-ats');
      const filename = `${cvData.personalInfo.fullName || 'CV'}_${selectedTemplate?.name || 'CV'}.pdf`.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      downloadPDF(pdfBytes, filename);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
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

  const addLanguage = () => {
    const newLang = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'Intermediate',
      written: 'Intermediate',
      spoken: 'Intermediate'
    };
    setCvData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), newLang]
    }));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      languages: (prev.languages || []).map(lang => 
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (id: string) => {
    setCvData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter(lang => lang.id !== id)
    }));
  };

  const renderPersonalInfoSection = () => (
    <div className="space-y-6">
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
            placeholder="John Smith"
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
            placeholder="Senior Software Engineer"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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
            placeholder="john.smith@email.com"
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
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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
            placeholder="linkedin.com/in/johnsmith"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website/Portfolio
        </label>
        <input
          type="url"
          value={cvData.personalInfo.website}
          onChange={(e) => setCvData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, website: e.target.value }
          }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://johnsmith.dev"
        />
      </div>
    </div>
  );

  const renderSummarySection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Professional Summary *
        </label>
        <AIEnhanceButton
          text={cvData.summary}
          sectionType="summary"
          onTextUpdate={(newText) => setCvData(prev => ({ ...prev, summary: newText }))}
          targetMarket={targetMarket?.name}
          jobTitle={cvData.personalInfo.title}
          size="md"
        />
      </div>
      <RichTextEditor
        value={cvData.summary}
        onChange={(value) => setCvData(prev => ({ ...prev, summary: value }))}
        placeholder="Write a compelling 2-3 sentence summary highlighting your experience, key skills, and career objectives..."
        className="min-h-32"
      />
      <div className="text-xs text-gray-500">
        Tip: Include your years of experience, key skills, and what you're looking for in your next role.
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
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No work experience added yet</p>
          <button
            onClick={addExperience}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Job
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.experience.map((exp, index) => (
            <div key={exp.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Experience #{index + 1}</h4>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Senior Software Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tech Company Ltd"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Port Louis, Mauritius"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <div className="space-y-2">
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      disabled={exp.current}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Current position</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Job Description</label>
                  <AIEnhanceButton
                    text={exp.description}
                    sectionType="experience"
                    onTextUpdate={(newText) => updateExperience(exp.id, 'description', newText)}
                    targetMarket={targetMarket?.name}
                    jobTitle={exp.title}
                  />
                </div>
                <RichTextEditor
                  value={exp.description}
                  onChange={(value) => updateExperience(exp.id, 'description', value)}
                  placeholder="• Led development of key features resulting in 40% performance improvement&#10;• Managed team of 5 developers and coordinated project deliverables&#10;• Implemented best practices that reduced bugs by 60%"
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
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No education added yet</p>
          <button
            onClick={addEducation}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Education
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School/University</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="University of Mauritius"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Reduit, Mauritius"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Date</label>
                  <input
                    type="month"
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPA (Optional)</label>
                  <input
                    type="text"
                    value={edu.gpa}
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
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No skills added yet</p>
          <button
            onClick={addSkill}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Skills
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
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="JavaScript"
                />
                
                <select
                  value={skill.category}
                  onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Technical">Technical</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Languages">Languages</option>
                  <option value="Tools">Tools</option>
                </select>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Proficiency Level</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
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
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No projects added yet</p>
          <button
            onClick={addProject}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cvData.projects.map((project, index) => (
            <div key={project.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Project #{index + 1}</h4>
                <button
                  onClick={() => removeProject(project.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="E-commerce Platform"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Link</label>
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                <input
                  type="text"
                  value={project.technologies.join(', ')}
                  onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, Node.js, MongoDB, AWS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                <RichTextEditor
                  value={project.description}
                  onChange={(value) => updateProject(project.id, 'description', value)}
                  placeholder="Describe the project, your role, challenges overcome, and results achieved..."
                />
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
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No certifications added yet</p>
          <button
            onClick={addCertification}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Certification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cvData.certifications.map((cert, index) => (
            <div key={cert.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Certification #{index + 1}</h4>
                <button
                  onClick={() => removeCertification(cert.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="AWS Certified Developer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Amazon Web Services"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Obtained</label>
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verification Link</label>
                  <input
                    type="url"
                    value={cert.verificationLink}
                    onChange={(e) => updateCertification(cert.id, 'verificationLink', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://verify.certification.com/123456"
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

      {!cvData.languages || cvData.languages.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Languages className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No languages added yet</p>
          <button
            onClick={addLanguage}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Language
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cvData.languages.map((lang, index) => (
            <div key={lang.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Language #{index + 1}</h4>
                <button
                  onClick={() => removeLanguage(lang.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="English"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overall Proficiency</label>
                  <select
                    value={lang.proficiency}
                    onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Written</label>
                  <select
                    value={lang.written}
                    onChange={(e) => updateLanguage(lang.id, 'written', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spoken</label>
                  <select
                    value={lang.spoken}
                    onChange={(e) => updateLanguage(lang.id, 'spoken', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalInfoSection();
      case 'summary':
        return renderSummarySection();
      case 'experience':
        return renderExperienceSection();
      case 'education':
        return renderEducationSection();
      case 'skills':
        return renderSkillsSection();
      case 'projects':
        return renderProjectsSection();
      case 'certifications':
        return renderCertificationsSection();
      case 'languages':
        return renderLanguagesSection();
      default:
        return renderPersonalInfoSection();
    }
  };

  const getSectionCompletionStatus = (sectionId: string) => {
    switch (sectionId) {
      case 'personal':
        return cvData.personalInfo.fullName && cvData.personalInfo.email;
      case 'summary':
        return cvData.summary && cvData.summary.length > 20;
      case 'experience':
        return cvData.experience.length > 0;
      case 'education':
        return cvData.education.length > 0;
      case 'skills':
        return cvData.skills.length > 0;
      case 'projects':
        return cvData.projects.length > 0;
      case 'certifications':
        return cvData.certifications.length > 0;
      case 'languages':
        return cvData.languages && cvData.languages.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} label="Back" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">CV Builder</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {selectedTemplate && (
                    <>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {selectedTemplate.name}
                      </span>
                      {targetMarket && (
                        <span className="text-gray-500">
                          • {targetMarket.flag} {targetMarket.name}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {lastSaved && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              
              <button
                onClick={onChangeTemplate}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Change Template
              </button>
              
              <button
                onClick={() => setShowImport(true)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import CV
              </button>
              
              <button
                onClick={() => saveCV(true)}
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
              
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                Tips
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">CV Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const isCompleted = getSectionCompletionStatus(section.id);
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className={isActive ? 'text-blue-600' : 'text-gray-400'}>
                        {section.icon}
                      </div>
                      <span className="text-sm flex-1">{section.name}</span>
                      {section.required && (
                        <span className="text-xs text-red-500">*</span>
                      )}
                      {isCompleted && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </button>
                  );
                })}
              </nav>
              
              {/* Completion Progress */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Completion</span>
                  <span className="text-sm text-gray-600">{calculateCompletionScore()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateCompletionScore()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {sections.find(s => s.id === activeSection)?.name}
                  </h2>
                  <p className="text-gray-600">
                    {activeSection === 'personal' && 'Enter your contact information and basic details'}
                    {activeSection === 'summary' && 'Write a compelling professional summary'}
                    {activeSection === 'experience' && 'Add your work experience and achievements'}
                    {activeSection === 'education' && 'Include your educational background'}
                    {activeSection === 'skills' && 'List your technical and soft skills'}
                    {activeSection === 'projects' && 'Showcase your key projects and work'}
                    {activeSection === 'certifications' && 'Add professional certifications and credentials'}
                    {activeSection === 'languages' && 'Include languages you speak and proficiency levels'}
                  </p>
                </div>
              </div>

              {renderCurrentSection()}
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CVImportSection
              onImportComplete={(data) => {
                // Map imported data to CV format
                setCvData(prev => ({
                  ...prev,
                  personalInfo: {
                    fullName: data.personalInfo.fullName,
                    title: '',
                    email: data.personalInfo.email,
                    phone: data.personalInfo.phone,
                    location: data.personalInfo.address,
                    linkedin: data.personalInfo.linkedin,
                    website: data.personalInfo.website
                  },
                  summary: data.summary,
                  experience: data.experience.map(exp => ({
                    id: exp.id,
                    title: exp.role,
                    company: exp.company,
                    location: '',
                    startDate: exp.startDate,
                    endDate: exp.endDate,
                    current: exp.current,
                    description: exp.description
                  })),
                  education: data.education.map(edu => ({
                    id: edu.id,
                    degree: edu.degree,
                    school: edu.institution,
                    location: '',
                    graduationDate: edu.year,
                    gpa: edu.gpa
                  })),
                  skills: data.skills.map(skill => ({
                    id: skill.id,
                    name: skill.name,
                    level: skill.level,
                    category: 'Technical'
                  })),
                  projects: [],
                  certifications: [],
                  languages: data.languages.map(lang => ({
                    id: lang.id,
                    name: lang.name,
                    proficiency: lang.proficiency,
                    written: lang.proficiency,
                    spoken: lang.proficiency
                  }))
                }));
                setShowImport(false);
              }}
              onClose={() => setShowImport(false)}
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