import React, { useState, useEffect } from 'react';
import { User, Briefcase, GraduationCap, Award, Code, Globe, Save, Download, Eye, ArrowLeft, Plus, X, Trash2, Star, Lightbulb, Languages, Monitor, Smartphone, Tablet } from 'lucide-react';
import { generateCVPDF, downloadPDF } from '../services/pdfGenerationService';
import { SavedCV } from '../types';
import { TargetMarket } from '../types';
import BackButton from './BackButton';
import AIEnhanceButton from './AIEnhanceButton';
import AISuggestionsPanel from './AISuggestionsPanel';
import CVImportSection from './CVImportSection';
import { ParsedCVData } from '../services/cvParsingService';
import gamificationService from '../services/gamificationService';

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

interface CVBuilderProps {
  targetMarket: TargetMarket | null;
  onBack: () => void;
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load editing CV data if available
  useEffect(() => {
    const editingData = localStorage.getItem('mocv_editing_cv');
    if (editingData) {
      try {
        const { cvData: existingData } = JSON.parse(editingData);
        if (existingData) {
          setCvData(existingData);
        }
      } catch (error) {
        console.error('Error loading editing CV data:', error);
      }
    }
  }, []);

  const handlePersonalInfoChange = (field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleSummaryChange = (value: string) => {
    setCvData(prev => ({
      ...prev,
      summary: value
    }));
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

  const updateExperience = (id: string, field: string, value: string | boolean) => {
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

  const updateSkill = (id: string, field: string, value: string | number) => {
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

  const updateProject = (id: string, field: string, value: string | string[]) => {
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
      let isEditing = false;
      
      if (editingData) {
        try {
          const { cvId: existingId, isEditing: editing } = JSON.parse(editingData);
          cvId = existingId;
          isEditing = editing;
        } catch {
          cvId = Date.now().toString();
        }
      } else {
        cvId = Date.now().toString();
      }

      const savedCV: SavedCV = {
        id: cvId,
        title: cvData.personalInfo.fullName || 'Untitled CV',
        templateName: 'Custom Template',
        templateId: localStorage.getItem('mocv_selected_template') || 'classic-ats',
        dateCreated: isEditing ? 
          (existingCVs.find((cv: SavedCV) => cv.id === cvId)?.dateCreated || new Date()) : 
          new Date(),
        dateModified: new Date(),
        atsScore: Math.floor(Math.random() * 30) + 70,
        status: 'completed' as const,
        cvData: cvData,
        targetMarket: targetMarket?.name
      };

      let updatedCVs;
      if (isEditing) {
        // Update existing CV
        updatedCVs = existingCVs.map((cv: SavedCV) => 
          cv.id === cvId ? savedCV : cv
        );
      } else {
        // Add new CV
        updatedCVs = [savedCV, ...existingCVs];
      }

      localStorage.setItem('mocv_saved_cvs', JSON.stringify(updatedCVs));
      
      // Clear editing state
      localStorage.removeItem('mocv_editing_cv');
      
      // Award XP for CV creation/update
      if (!isEditing) {
        gamificationService.trackCVCreation();
      }
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      message.textContent = isEditing ? 'CV updated successfully!' : 'CV saved successfully!';
      document.body.appendChild(message);
      
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error saving CV:', error);
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
      const filename = `${cvData.personalInfo.fullName || 'CV'}_${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(pdfBytes, filename);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleImportComplete = (parsedData: ParsedCVData) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        fullName: parsedData.personalInfo.fullName || prev.personalInfo.fullName,
        title: prev.personalInfo.title,
        email: parsedData.personalInfo.email || prev.personalInfo.email,
        phone: parsedData.personalInfo.phone || prev.personalInfo.phone,
        location: parsedData.personalInfo.address || prev.personalInfo.location,
        linkedin: parsedData.personalInfo.linkedin || prev.personalInfo.linkedin,
        website: parsedData.personalInfo.website || prev.personalInfo.website
      },
      summary: parsedData.summary || prev.summary,
      experience: parsedData.experience.length > 0 ? parsedData.experience.map(exp => ({
        id: exp.id,
        title: exp.role,
        company: exp.company,
        location: '',
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current,
        description: exp.description
      })) : prev.experience,
      education: parsedData.education.length > 0 ? parsedData.education.map(edu => ({
        id: edu.id,
        degree: edu.degree,
        school: edu.institution,
        location: '',
        graduationDate: edu.year,
        gpa: edu.gpa
      })) : prev.education,
      skills: parsedData.skills.length > 0 ? parsedData.skills : prev.skills
    }));
    
    setShowImport(false);
  };

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: User },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'skills', name: 'Skills', icon: Award },
    { id: 'projects', name: 'Projects', icon: Globe },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'languages', name: 'Languages', icon: Languages }
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={cvData.personalInfo.fullName}
            onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Title *
          </label>
          <input
            type="text"
            value={cvData.personalInfo.title}
            onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Software Engineer"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline h-4 w-4 mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            value={cvData.personalInfo.email}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john.doe@email.com"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline h-4 w-4 mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            value={cvData.personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Location
          </label>
          <input
            type="text"
            value={cvData.personalInfo.location}
            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="City, Country"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Link className="inline h-4 w-4 mr-1" />
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={cvData.personalInfo.linkedin}
            onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="linkedin.com/in/johndoe"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="inline h-4 w-4 mr-1" />
          Website/Portfolio
        </label>
        <input
          type="url"
          value={cvData.personalInfo.website}
          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://johndoe.com"
          dir="ltr"
          style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
        />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Professional Summary *
          </label>
          <AIEnhanceButton
            text={cvData.summary}
            sectionType="summary"
            onTextUpdate={handleSummaryChange}
            targetMarket={targetMarket?.name}
            jobTitle={cvData.personalInfo.title}
            size="md"
          />
        </div>
        <textarea
          value={cvData.summary}
          onChange={(e) => handleSummaryChange(e.target.value)}
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Write a compelling professional summary that highlights your key skills, experience, and career objectives. This is your elevator pitch to potential employers."
          dir="ltr"
          style={{ 
            direction: 'ltr', 
            textAlign: 'left', 
            unicodeBidi: 'embed',
            writingMode: 'horizontal-tb'
          }}
        />
        <div className="text-sm text-gray-500 mt-2">
          {cvData.summary.length}/500 characters • This section is crucial for ATS optimization
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
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

      {cvData.experience.map((exp, index) => (
        <div key={exp.id} className="bg-gray-50 rounded-lg p-6 relative">
          <button
            onClick={() => removeExperience(exp.id)}
            className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Software Engineer"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tech Company Inc."
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, Country"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="space-y-2">
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={exp.current}
                  dir="ltr"
                  style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Current position</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Job Description & Achievements *
              </label>
              <AIEnhanceButton
                text={exp.description}
                sectionType="experience"
                onTextUpdate={(value) => updateExperience(exp.id, 'description', value)}
                targetMarket={targetMarket?.name}
                jobTitle={exp.title}
              />
            </div>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points and action verbs&#10;• Include quantifiable results (e.g., increased sales by 25%)&#10;• Focus on impact and outcomes"
              dir="ltr"
              style={{ 
                direction: 'ltr', 
                textAlign: 'left', 
                unicodeBidi: 'embed',
                writingMode: 'horizontal-tb'
              }}
            />
          </div>
        </div>
      ))}

      {cvData.experience.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No work experience added yet</p>
          <p className="text-sm">Click "Add Experience" to get started</p>
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
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

      {cvData.education.map((edu) => (
        <div key={edu.id} className="bg-gray-50 rounded-lg p-6 relative">
          <button
            onClick={() => removeEducation(edu.id)}
            className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree *
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bachelor of Science in Computer Science"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School/University *
              </label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="University of Technology"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={edu.location}
                onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, Country"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Date
              </label>
              <input
                type="month"
                value={edu.graduationDate}
                onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="3.8/4.0"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
          </div>
        </div>
      ))}

      {cvData.education.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No education added yet</p>
          <p className="text-sm">Click "Add Education" to get started</p>
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
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

      <div className="grid md:grid-cols-2 gap-4">
        {cvData.skills.map((skill) => (
          <div key={skill.id} className="bg-gray-50 rounded-lg p-4 relative">
            <button
              onClick={() => removeSkill(skill.id)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="JavaScript"
                  dir="ltr"
                  style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
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

      {cvData.skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No skills added yet</p>
          <p className="text-sm">Click "Add Skill" to get started</p>
        </div>
      )}
    </div>
  );

  const renderProjects = () => (
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

      {cvData.projects.map((project) => (
        <div key={project.id} className="bg-gray-50 rounded-lg p-6 relative">
          <button
            onClick={() => removeProject(project.id)}
            className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="E-commerce Platform"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Link (Optional)
              </label>
              <input
                type="url"
                value={project.link || ''}
                onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/username/project"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technologies Used
            </label>
            <input
              type="text"
              value={project.technologies.join(', ')}
              onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="React, Node.js, MongoDB, AWS"
              dir="ltr"
              style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              value={project.description}
              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe the project, your role, and key achievements..."
              dir="ltr"
              style={{ 
                direction: 'ltr', 
                textAlign: 'left', 
                unicodeBidi: 'embed',
                writingMode: 'horizontal-tb'
              }}
            />
          </div>
        </div>
      ))}

      {cvData.projects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No projects added yet</p>
          <p className="text-sm">Click "Add Project" to showcase your work</p>
        </div>
      )}
    </div>
  );

  const renderCertifications = () => (
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

      {cvData.certifications.map((cert) => (
        <div key={cert.id} className="bg-gray-50 rounded-lg p-6 relative">
          <button
            onClick={() => removeCertification(cert.id)}
            className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certification Name *
              </label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="AWS Certified Solutions Architect"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuing Organization *
              </label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Amazon Web Services"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Obtained
              </label>
              <input
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
          </div>
        </div>
      ))}

      {cvData.certifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No certifications added yet</p>
          <p className="text-sm">Click "Add Certification" to showcase your credentials</p>
        </div>
      )}
    </div>
  );

  const renderLanguages = () => (
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

      {cvData.languages.map((language) => (
        <div key={language.id} className="bg-gray-50 rounded-lg p-6 relative">
          <button
            onClick={() => removeLanguage(language.id)}
            className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language *
              </label>
              <input
                type="text"
                value={language.name}
                onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="English"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Proficiency
              </label>
              <select
                value={language.proficiency}
                onChange={(e) => updateLanguage(language.id, 'proficiency', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Written Level
              </label>
              <select
                value={language.written}
                onChange={(e) => updateLanguage(language.id, 'written', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spoken Level
              </label>
              <select
                value={language.spoken}
                onChange={(e) => updateLanguage(language.id, 'spoken', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>Tip:</strong> Be honest about your language levels. Many employers will test language skills during interviews.
            </p>
          </div>
        </div>
      ))}

      {cvData.languages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Languages className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No languages added yet</p>
          <p className="text-sm">Click "Add Language" to showcase your multilingual abilities</p>
          <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-left">
            <h4 className="font-semibold text-yellow-900 mb-2">💡 Why Add Languages?</h4>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• Increases your competitiveness in global markets</li>
              <li>• Essential for Mauritius and African professionals</li>
              <li>• Many international roles require multilingual skills</li>
              <li>• Shows cultural adaptability and communication skills</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} label="Back" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">CV Builder</h1>
                <p className="text-sm text-gray-600">
                  {targetMarket ? `Optimized for ${targetMarket.flag} ${targetMarket.name}` : 'Create your professional CV'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  showPreview 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye className="h-4 w-4" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                onClick={() => setShowImport(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import CV
              </button>
              
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <Wand2 className="h-4 w-4" />
                AI Tips
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content Area */}
        <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
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
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {activeSection === 'personal' && renderPersonalInfo()}
              {activeSection === 'summary' && renderSummary()}
              {activeSection === 'experience' && renderExperience()}
              {activeSection === 'education' && renderEducation()}
              {activeSection === 'skills' && renderSkills()}
              {activeSection === 'projects' && renderProjects()}
              {activeSection === 'certifications' && renderCertifications()}
              {activeSection === 'languages' && renderLanguages()}
            </div>
          </div>
        </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        {showPreview && (
          <div className="w-1/2 border-l border-gray-200 bg-gray-50 overflow-hidden">
            <div className="h-full overflow-y-auto p-4">
              {renderLivePreview()}
            </div>
          </div>
        )}
      </div>

      {/* AI Suggestions Panel */}
      <AISuggestionsPanel
        cvData={cvData}
        isVisible={showSuggestions}
        onClose={() => setShowSuggestions(false)}
      />

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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