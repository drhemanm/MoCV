import React, { useState, useEffect } from 'react';
import { Save, Download, Eye, Plus, Trash2, Edit3, User, FileText, Briefcase, GraduationCap, Award, Globe, Languages, Lightbulb, ArrowLeft, CheckCircle, Upload, X } from 'lucide-react';
import { TargetMarket, SavedCV } from '../types';
import BackButton from './BackButton';
import RichTextEditor from './RichTextEditor';
import AIEnhanceButton from './AIEnhanceButton';
import AISuggestionsPanel from './AISuggestionsPanel';
import CVImportSection from './CVImportSection';
import { generateCVPDF, downloadPDF } from '../services/pdfGenerationService';
import { ParsedCVData } from '../services/cvParsingService';
import gamificationService from '../services/gamificationService';

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
    description?: string;
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
    startDate?: string;
    endDate?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    verificationLink?: string;
    description?: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cvId, setCvId] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load existing CV data if editing
  useEffect(() => {
    const editingData = localStorage.getItem('mocv_editing_cv');
    if (editingData) {
      try {
        const parsed = JSON.parse(editingData);
        if (parsed.cvData) {
          setCvData(parsed.cvData);
          setIsEditing(parsed.isEditing || false);
          setCvId(parsed.cvId || '');
        }
        // Clear the editing flag
        localStorage.removeItem('mocv_editing_cv');
      } catch (error) {
        console.error('Error loading editing data:', error);
      }
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (cvData.personalInfo.fullName || cvData.summary || cvData.experience.length > 0) {
        handleSave(false); // Silent save
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearTimeout(autoSave);
  }, [cvData]);

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User, color: 'text-blue-600' },
    { id: 'summary', name: 'Summary', icon: FileText, color: 'text-purple-600' },
    { id: 'experience', name: 'Experience', icon: Briefcase, color: 'text-green-600' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'text-indigo-600' },
    { id: 'skills', name: 'Skills', icon: Award, color: 'text-orange-600' },
    { id: 'projects', name: 'Projects', icon: Globe, color: 'text-teal-600' },
    { id: 'certifications', name: 'Certifications', icon: Award, color: 'text-red-600' },
    { id: 'languages', name: 'Languages', icon: Languages, color: 'text-pink-600' }
  ];

  const handleSave = (showNotification = true) => {
    try {
      const savedCVs = JSON.parse(localStorage.getItem('mocv_saved_cvs') || '[]');
      const now = new Date();
      
      let updatedCVs;
      if (isEditing && cvId) {
        // Update existing CV
        updatedCVs = savedCVs.map((cv: SavedCV) => 
          cv.id === cvId 
            ? { 
                ...cv, 
                cvData, 
                dateModified: now,
                status: 'completed' as const
              }
            : cv
        );
      } else {
        // Create new CV
        const newCV: SavedCV = {
          id: Date.now().toString(),
          title: cvData.personalInfo.fullName || 'Untitled CV',
          templateName: 'Custom CV',
          templateId: 'custom',
          dateCreated: now,
          dateModified: now,
          atsScore: Math.floor(Math.random() * 30) + 70, // Mock ATS score
          status: 'completed',
          cvData,
          targetMarket: targetMarket?.name
        };
        updatedCVs = [newCV, ...savedCVs];
        setCvId(newCV.id);
        setIsEditing(true);
      }

      localStorage.setItem('mocv_saved_cvs', JSON.stringify(updatedCVs));
      setLastSaved(now);

      if (showNotification) {
        // Award XP for CV creation/update
        const result = gamificationService.trackCVCreation();
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = 'CV saved successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Failed to save CV. Please try again.';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdfBytes = await generateCVPDF(cvData, 'classic-ats');
      const filename = `${cvData.personalInfo.fullName || 'CV'}.pdf`.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      downloadPDF(pdfBytes, filename);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleImportComplete = (data: ParsedCVData) => {
    setCvData({
      personalInfo: {
        fullName: data.personalInfo.fullName || '',
        title: '',
        email: data.personalInfo.email || '',
        phone: data.personalInfo.phone || '',
        location: data.personalInfo.address || '',
        linkedin: data.personalInfo.linkedin || '',
        website: data.personalInfo.website || '',
        photo: data.personalInfo.photo || ''
      },
      summary: data.summary || '',
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
        gpa: edu.gpa,
        description: ''
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
        proficiency: lang.proficiency as any
      }))
    });
    setShowImport(false);
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
      gpa: '',
      description: ''
    };
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
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
      link: '',
      startDate: '',
      endDate: ''
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
      verificationLink: '',
      description: ''
    };
    setCvData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const updateCertification = (id: string, field: string, value: any) => {
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
            onChange={(e) => setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, fullName: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
            dir="ltr"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
            dir="ltr"
            placeholder="Software Engineer"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
            dir="ltr"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
            dir="ltr"
            placeholder="+1 (555) 123-4567"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
            dir="ltr"
            placeholder="City, Country"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
            dir="ltr"
            placeholder="https://linkedin.com/in/johndoe"
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
          dir="ltr"
          placeholder="https://johndoe.com"
        />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Professional Summary
        </label>
        <AIEnhanceButton
          text={cvData.summary}
          sectionType="summary"
          onTextUpdate={(newText) => setCvData(prev => ({ ...prev, summary: newText }))}
          targetMarket={targetMarket?.name}
          jobTitle={cvData.personalInfo.title}
        />
      </div>
      <RichTextEditor
        value={cvData.summary}
        onChange={(value) => setCvData(prev => ({ ...prev, summary: value }))}
        placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career objectives..."
        className="min-h-32"
        style={{ direction: 'ltr', textAlign: 'left' }}
      />
      <p className="text-xs text-gray-500">
        Tip: Include 2-3 sentences highlighting your experience, key skills, and what you're looking for in your next role.
      </p>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        <button
          onClick={addExperience}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Experience
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-left"
                    dir="ltr"
                    placeholder="Software Engineer"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-left"
                    dir="ltr"
                    placeholder="Tech Company Inc."
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-left"
                    dir="ltr"
                    placeholder="City, Country"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-left"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
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
                <RichTextEditor
                  value={exp.description}
                  onChange={(value) => updateExperience(exp.id, 'description', value)}
                  placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points and action verbs&#10;• Include specific metrics and results where possible"
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
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
        <button
          onClick={addEducation}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Education
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-left"
                    dir="ltr"
                    placeholder="Bachelor of Science in Computer Science"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-left"
                    dir="ltr"
                    placeholder="University of Technology"
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
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-left"
                    dir="ltr"
                    placeholder="City, Country"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-left"
                    dir="ltr"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-left"
                    dir="ltr"
                    placeholder="3.8/4.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={edu.description || ''}
                  onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Relevant coursework, honors, activities, etc."
                />
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
        <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
        <button
          onClick={addSkill}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Skill
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
                <div>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Skill name (e.g., JavaScript, Project Management)"
                  />
                </div>

                <div>
                  <select
                    value={skill.category}
                    onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Languages">Languages</option>
                    <option value="Tools">Tools</option>
                    <option value="Certifications">Certifications</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
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
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        <button
          onClick={addProject}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Project
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-left"
                    dir="ltr"
                    placeholder="E-commerce Platform"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-left"
                    dir="ltr"
                    placeholder="https://github.com/username/project"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-left"
                  dir="ltr"
                  placeholder="React, Node.js, MongoDB, AWS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <RichTextEditor
                  value={project.description}
                  onChange={(value) => updateProject(project.id, 'description', value)}
                  placeholder="• Describe the project scope and your role&#10;• Highlight key technologies and methodologies used&#10;• Include measurable outcomes or impact"
                  className="w-full text-left"
                  dir="ltr"
                />
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
        <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
        <button
          onClick={addCertification}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Certification
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-left"
                    dir="ltr"
                    placeholder="AWS Certified Solutions Architect"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-left"
                    dir="ltr"
                    placeholder="Amazon Web Services"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-left"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={cert.verificationLink || ''}
                    onChange={(e) => updateCertification(cert.id, 'verificationLink', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="https://verify.certification.com/12345"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={cert.description || ''}
                  onChange={(e) => updateCertification(cert.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Brief description of what this certification covers..."
                />
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
        <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
        <button
          onClick={addLanguage}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Language
        </button>
      </div>

      {cvData.languages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Languages className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No languages added yet</p>
          <p className="text-sm">Click "Add Language" to showcase your multilingual abilities</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {cvData.languages.map((lang, index) => (
            <div key={lang.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Language #{index + 1}</span>
                <button
                  onClick={() => removeLanguage(lang.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Language name (e.g., English, French)"
                  />
                </div>

                <div>
                  <select
                    value={lang.proficiency}
                    onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal': return renderPersonalInfo();
      case 'summary': return renderSummary();
      case 'experience': return renderExperience();
      case 'education': return renderEducation();
      case 'skills': return renderSkills();
      case 'projects': return renderProjects();
      case 'certifications': return renderCertifications();
      case 'languages': return renderLanguages();
      default: return renderPersonalInfo();
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
                <h1 className="text-xl font-bold text-gray-900">
                  {isEditing ? 'Edit CV' : 'Create New CV'}
                </h1>
                <p className="text-sm text-gray-600">
                  {targetMarket ? `Optimized for ${targetMarket.flag} ${targetMarket.name}` : 'Professional CV Builder'}
                  {lastSaved && (
                    <span className="ml-2 text-green-600">
                      • Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
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
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="border border-purple-300 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                AI Tips
              </button>
              
              <button
                onClick={() => handleSave(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save CV
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">CV Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  const hasContent = (() => {
                    switch (section.id) {
                      case 'personal': return cvData.personalInfo.fullName || cvData.personalInfo.email;
                      case 'summary': return cvData.summary;
                      case 'experience': return cvData.experience.length > 0;
                      case 'education': return cvData.education.length > 0;
                      case 'skills': return cvData.skills.length > 0;
                      case 'projects': return cvData.projects.length > 0;
                      case 'certifications': return cvData.certifications.length > 0;
                      case 'languages': return cvData.languages.length > 0;
                      default: return false;
                    }
                  })();

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
                      <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : section.color}`} />
                      <span className="text-sm font-medium">{section.name}</span>
                      {hasContent && (
                        <CheckCircle className="h-3 w-3 text-green-600 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {sections.find(s => s.id === activeSection)?.name}
                </h2>
                <p className="text-gray-600">
                  {activeSection === 'personal' && 'Add your contact information and basic details'}
                  {activeSection === 'summary' && 'Write a compelling professional summary'}
                  {activeSection === 'experience' && 'Add your work experience and achievements'}
                  {activeSection === 'education' && 'Include your educational background'}
                  {activeSection === 'skills' && 'List your technical and soft skills'}
                  {activeSection === 'projects' && 'Showcase your key projects and work'}
                  {activeSection === 'certifications' && 'Add your professional certifications'}
                  {activeSection === 'languages' && 'Include your language proficiencies'}
                </p>
              </div>

              {renderSectionContent()}
            </div>
          </div>
        </div>
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