import React, { useState, useEffect } from 'react';
import { Eye, Download, Save, Settings, Zap, FileText, User, Briefcase, GraduationCap, Award, Code, Languages, Plus, Trash2, Calendar, MapPin, Mail, Phone, Globe, Linkedin, ArrowLeft, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { CVTemplate } from '../types';
import { fetchCVTemplates } from '../services/templateService';
import CVImportSection from './CVImportSection';
import AIEnhanceButton from './AIEnhanceButton';
import AISuggestionsPanel from './AISuggestionsPanel';
import RichTextEditor from './RichTextEditor';
import { ParsedCVData } from '../services/cvParsingService';
import BackButton from './BackButton';
import { TargetMarket } from '../types';

interface CVBuilderProps {
  targetMarket: TargetMarket | null;
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
    startYear: string;
    endYear: string;
    current: boolean;
    description: string;
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
    link?: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: 'Basic' | 'Intermediate' | 'Fluent' | 'Native';
  }>;
}

const CVBuilder: React.FC<CVBuilderProps> = ({ targetMarket, onBack }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
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

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: <User className="h-5 w-5" />, required: true },
    { id: 'summary', name: 'Summary', icon: <FileText className="h-5 w-5" />, required: false },
    { id: 'experience', name: 'Experience', icon: <Briefcase className="h-5 w-5" />, required: true },
    { id: 'education', name: 'Education', icon: <GraduationCap className="h-5 w-5" />, required: false },
    { id: 'skills', name: 'Skills', icon: <Code className="h-5 w-5" />, required: true },
    { id: 'projects', name: 'Projects', icon: <Award className="h-5 w-5" />, required: false },
    { id: 'certifications', name: 'Certifications', icon: <Award className="h-5 w-5" />, required: false },
    { id: 'languages', name: 'Languages', icon: <Languages className="h-5 w-5" />, required: false }
  ];

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all CV data? This action cannot be undone.')) {
      setCvData({
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
      
      // Clear localStorage
      localStorage.removeItem('mocv_current_cv');
      setHasUnsavedChanges(false);
      
      // Reset to personal info section
      setActiveSection('personal');
    }
  };

  const loadPreviousDraft = () => {
    const savedData = localStorage.getItem('mocv_current_cv');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCvData(parsed);
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Error loading saved CV data:', error);
        alert('Error loading previous draft. Starting with a clean slate.');
      }
    } else {
      alert('No previous draft found.');
    }
  };

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const fetchedTemplates = await fetchCVTemplates();
        setTemplates(fetchedTemplates);
        if (fetchedTemplates.length > 0) {
          setSelectedTemplate(fetchedTemplates[0]);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };

    loadTemplates();

    // Don't auto-load previous data for new CV creation
    // Users should start with a clean slate
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    // Only auto-save if there's actual content and user has made changes
    const hasContent = cvData.personalInfo.fullName || cvData.summary || 
                      cvData.experience.length > 0 || cvData.skills.length > 0;
    
    if (!hasContent) return;
    
    const timeoutId = setTimeout(() => {
      localStorage.setItem('mocv_current_cv', JSON.stringify(cvData));
      setHasUnsavedChanges(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cvData]);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [cvData]);

  // Check if section is completed
  const isSectionCompleted = (sectionId: string): boolean => {
    switch (sectionId) {
      case 'personal':
        return !!(cvData.personalInfo.fullName && cvData.personalInfo.email && cvData.personalInfo.title);
      case 'summary':
        return cvData.summary.length > 50;
      case 'experience':
        return cvData.experience.length > 0 && cvData.experience.some(exp => exp.title && exp.company);
      case 'education':
        return cvData.education.length > 0;
      case 'skills':
        return cvData.skills.length > 0;
      case 'projects':
        return cvData.projects.length > 0;
      case 'certifications':
        return cvData.certifications.length > 0;
      case 'languages':
        return cvData.languages.length > 0;
      default:
        return false;
    }
  };

  // Update completed sections
  useEffect(() => {
    const completed = new Set<string>();
    sections.forEach(section => {
      if (isSectionCompleted(section.id)) {
        completed.add(section.id);
      }
    });
    setCompletedSections(completed);
  }, [cvData]);

  const handleImportComplete = (importedData: ParsedCVData) => {
    // Convert imported data to our CV format
    const convertedData: CVData = {
      personalInfo: {
        fullName: importedData.personalInfo.fullName,
        title: '', // Will need to be filled manually
        email: importedData.personalInfo.email,
        phone: importedData.personalInfo.phone,
        location: importedData.personalInfo.address,
        linkedin: importedData.personalInfo.linkedin,
        website: importedData.personalInfo.website,
        photo: importedData.personalInfo.photo
      },
      summary: importedData.summary,
      experience: importedData.experience.map(exp => ({
        id: exp.id,
        title: exp.role,
        company: exp.company,
        location: '',
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current,
        description: exp.description
      })),
      education: importedData.education.map(edu => ({
        id: edu.id,
        degree: edu.degree,
        school: edu.institution,
        location: '',
        startYear: '',
        endYear: edu.year,
        current: false,
        description: '',
        gpa: edu.gpa
      })),
      skills: importedData.skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        category: 'Technical'
      })),
      projects: [],
      certifications: [],
      languages: importedData.languages.map(lang => ({
        id: lang.id,
        name: lang.name,
        proficiency: lang.proficiency
      }))
    };

    setCvData(convertedData);
    setShowImport(false);
    setHasUnsavedChanges(true);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateSummary = (value: string) => {
    setCvData(prev => ({
      ...prev,
      summary: value
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
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
      id: `edu-${Date.now()}`,
      degree: '',
      school: '',
      location: '',
      startYear: '',
      endYear: '',
      current: false,
      description: '',
      gpa: ''
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
      id: `skill-${Date.now()}`,
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
      id: `project-${Date.now()}`,
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
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      link: ''
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
      id: `lang-${Date.now()}`,
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

  const navigateToSection = (direction: 'next' | 'prev') => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (direction === 'next' && currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  const handleSave = () => {
    // Save to localStorage and show success message
    localStorage.setItem('mocv_current_cv', JSON.stringify(cvData));
    
    // Also save to the CVs list
    const savedCVs = localStorage.getItem('mocv_saved_cvs');
    let cvList = [];
    
    if (savedCVs) {
      try {
        cvList = JSON.parse(savedCVs);
      } catch (error) {
        cvList = [];
      }
    }

    const newCV = {
      id: Date.now().toString(),
      title: `${cvData.personalInfo.title || 'Professional'} CV - ${new Date().toLocaleDateString()}`,
      templateName: selectedTemplate?.name || 'Default Template',
      templateId: selectedTemplate?.id || 'default',
      dateCreated: new Date(),
      dateModified: new Date(),
      atsScore: Math.floor(Math.random() * 20) + 75,
      status: 'completed' as const,
      cvData: cvData,
      targetMarket: targetMarket?.id || 'global'
    };

    cvList.unshift(newCV);
    localStorage.setItem('mocv_saved_cvs', JSON.stringify(cvList));
    
    alert('CV saved successfully!');
  };

  const handleDownload = () => {
    // Simple PDF download simulation
    const element = document.createElement('a');
    const cvContent = `
CV: ${cvData.personalInfo.fullName}
Title: ${cvData.personalInfo.title}
Email: ${cvData.personalInfo.email}
Phone: ${cvData.personalInfo.phone}

Summary:
${cvData.summary}

Experience:
${cvData.experience.map(exp => `${exp.title} at ${exp.company}\n${exp.description}`).join('\n\n')}

Education:
${cvData.education.map(edu => `${edu.degree} from ${edu.school}`).join('\n')}

Skills:
${cvData.skills.map(skill => skill.name).join(', ')}
    `;
    
    const file = new Blob([cvContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${cvData.personalInfo.fullName || 'CV'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
        <p className="text-gray-600">Let's start with your basic contact information</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={cvData.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title *</label>
          <input
            type="text"
            value={cvData.personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
            placeholder="Senior Software Engineer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={cvData.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={cvData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
            placeholder="+230 5123 4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={cvData.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
            placeholder="Port Louis, Mauritius"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
          <input
            type="url"
            value={cvData.personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional Summary</h3>
        <p className="text-gray-600">Write a compelling summary that highlights your key qualifications</p>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Summary
            <span className="text-gray-500 font-normal ml-2">(2-3 sentences highlighting your key qualifications)</span>
          </label>
          <AIEnhanceButton
            text={cvData.summary}
            sectionType="summary"
            onTextUpdate={updateSummary}
            jobTitle={cvData.personalInfo.title}
            size="md"
          />
        </div>
        <RichTextEditor
          value={cvData.summary}
          onChange={updateSummary}
          placeholder="Experienced professional with expertise in..."
          className="min-h-32"
        />
        <div className="text-xs text-gray-500 mt-1">
          Character limit: 600 | Current: {cvData.summary.length}
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Briefcase className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Work Experience</h3>
        <p className="text-gray-600">Add your professional experience and achievements</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={addExperience}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add Experience
        </button>
      </div>

      {cvData.experience.map((exp, index) => (
        <div key={exp.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 relative border border-gray-200 shadow-sm">
          <button
            onClick={() => removeExperience(exp.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Senior Software Engineer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tech Company Inc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Port Louis, Mauritius"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                min="1990-01"
                max={new Date().toISOString().slice(0, 7)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  min="1990-01"
                  max={new Date().toISOString().slice(0, 7)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Current position</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Description *
                <span className="text-gray-500 font-normal ml-2">(Use bullet points to describe your achievements)</span>
              </label>
              <AIEnhanceButton
                text={exp.description}
                sectionType="experience"
                onTextUpdate={(newText) => updateExperience(exp.id, 'description', newText)}
                jobTitle={exp.title}
              />
            </div>
            <RichTextEditor
              value={exp.description}
              onChange={(value) => updateExperience(exp.id, 'description', value)}
              placeholder="• Led development of key features that increased user engagement by 25%&#10;• Collaborated with cross-functional teams to deliver projects on time&#10;• Mentored junior developers and conducted code reviews"
              className="min-h-32"
            />
          </div>
        </div>
      ))}

      {cvData.experience.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
          <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">No work experience added yet</p>
          <button
            onClick={addExperience}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Add your first experience
          </button>
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Education</h3>
        <p className="text-gray-600">Add your educational background and qualifications</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={addEducation}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add Education
        </button>
      </div>

      {cvData.education.map((edu) => (
        <div key={edu.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 relative border border-gray-200 shadow-sm">
          <button
            onClick={() => removeEducation(edu.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Bachelor of Science in Computer Science"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School *</label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="University of Mauritius"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Year</label>
              <input
                type="number"
                value={edu.startYear}
                onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                min="1990"
                max={new Date().getFullYear()}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="2018"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Year</label>
              <div className="space-y-2">
                <input
                  type="number"
                  value={edu.endYear}
                  onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                  disabled={edu.current}
                  min="1990"
                  max={new Date().getFullYear() + 10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="2022"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={edu.current}
                    onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Still studying</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GPA (Optional)</label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="3.8/4.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
              <span className="text-gray-500 font-normal ml-2">(Honors, thesis, relevant coursework)</span>
            </label>
            <RichTextEditor
              value={edu.description}
              onChange={(value) => updateEducation(edu.id, 'description', value)}
              placeholder="• Graduated Magna Cum Laude&#10;• Thesis: 'Machine Learning Applications in Healthcare'&#10;• Relevant coursework: Data Structures, Algorithms, Database Systems"
              className="min-h-24"
            />
          </div>
        </div>
      ))}

      {cvData.education.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
          <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">No education added yet</p>
          <button
            onClick={addEducation}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Add your education
          </button>
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Code className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Skills</h3>
        <p className="text-gray-600">Showcase your technical and soft skills</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={addSkill}
          className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add Skill
        </button>
      </div>

      {cvData.skills.map((skill) => (
        <div key={skill.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 relative border border-gray-200 shadow-sm">
          <button
            onClick={() => removeSkill(skill.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name *</label>
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="JavaScript"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={skill.category}
                onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Technical">Technical</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Languages">Languages</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proficiency Level ({skill.level}/5)
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

      {cvData.skills.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
          <Code className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">No skills added yet</p>
          <button
            onClick={addSkill}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Add your first skill
          </button>
        </div>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Award className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Projects</h3>
        <p className="text-gray-600">Showcase your key projects and achievements</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={addProject}
          className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add Project
        </button>
      </div>

      {cvData.projects.map((project) => (
        <div key={project.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 relative border border-gray-200 shadow-sm">
          <button
            onClick={() => removeProject(project.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="E-commerce Platform"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Link (Optional)</label>
              <input
                type="url"
                value={project.link}
                onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
            <input
              type="text"
              value={project.technologies.join(', ')}
              onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="React, Node.js, MongoDB, AWS"
            />
            <div className="text-xs text-gray-500 mt-1">Separate technologies with commas</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Description *
                <span className="text-gray-500 font-normal ml-2">(Describe the project, your role, and impact)</span>
              </label>
              <AIEnhanceButton
                text={project.description}
                sectionType="general"
                onTextUpdate={(newText) => updateProject(project.id, 'description', newText)}
              />
            </div>
            <RichTextEditor
              value={project.description}
              onChange={(value) => updateProject(project.id, 'description', value)}
              placeholder="• Developed a full-stack e-commerce platform serving 10,000+ users&#10;• Implemented secure payment processing and inventory management&#10;• Reduced page load times by 40% through optimization"
              className="min-h-32"
            />
          </div>
        </div>
      ))}

      {cvData.projects.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
          <Award className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">No projects added yet</p>
          <button
            onClick={addProject}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Add your first project
          </button>
        </div>
      )}
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Award className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Certifications</h3>
        <p className="text-gray-600">Add your professional certifications and credentials</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={addCertification}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add Certification
        </button>
      </div>

      {cvData.certifications.map((cert) => (
        <div key={cert.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 relative border border-gray-200 shadow-sm">
          <button
            onClick={() => removeCertification(cert.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name *</label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="AWS Certified Solutions Architect"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization *</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Amazon Web Services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Obtained</label>
              <input
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credential Link (Optional)</label>
              <input
                type="url"
                value={cert.link}
                onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="https://credly.com/badges/..."
              />
            </div>
          </div>
        </div>
      ))}

      {cvData.certifications.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
          <Award className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">No certifications added yet</p>
          <button
            onClick={addCertification}
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            Add your first certification
          </button>
        </div>
      )}
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Languages className="h-8 w-8 text-pink-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Languages</h3>
        <p className="text-gray-600">Add your language skills and proficiency levels</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={addLanguage}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add Language
        </button>
      </div>

      {cvData.languages.map((language) => (
        <div key={language.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 relative border border-gray-200 shadow-sm">
          <button
            onClick={() => removeLanguage(language.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language *</label>
              <input
                type="text"
                value={language.name}
                onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="English"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
              <select
                value={language.proficiency}
                onChange={(e) => updateLanguage(language.id, 'proficiency', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      {cvData.languages.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
          <Languages className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">No languages added yet</p>
          <button
            onClick={addLanguage}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Add your first language
          </button>
        </div>
      )}
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white rounded-lg shadow-lg p-8 min-h-[800px]">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {cvData.personalInfo.fullName || 'Your Name'}
          </h1>
          <h2 className="text-xl text-gray-600 mb-4">
            {cvData.personalInfo.title || 'Your Professional Title'}
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {cvData.personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {cvData.personalInfo.email}
              </div>
            )}
            {cvData.personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {cvData.personalInfo.phone}
              </div>
            )}
            {cvData.personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {cvData.personalInfo.location}
              </div>
            )}
            {cvData.personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {cvData.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              PROFESSIONAL SUMMARY
            </h3>
            <div className="text-gray-700 whitespace-pre-wrap">{cvData.summary}</div>
          </div>
        )}

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
              PROFESSIONAL EXPERIENCE
            </h3>
            <div className="space-y-6">
              {cvData.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                      <p className="text-gray-700">{exp.company}{exp.location && `, ${exp.location}`}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {exp.startDate && ' - '}
                      {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 whitespace-pre-wrap ml-0">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
              EDUCATION
            </h3>
            <div className="space-y-4">
              {cvData.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-gray-700">{edu.school}</p>
                      {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-sm text-gray-600">
                      {edu.startYear && `${edu.startYear} - `}
                      {edu.current ? 'Present' : edu.endYear}
                    </div>
                  </div>
                  {edu.description && (
                    <div className="text-gray-700 whitespace-pre-wrap text-sm">
                      {edu.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
              SKILLS
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {['Technical', 'Soft Skills', 'Tools', 'Languages'].map(category => {
                const categorySkills = cvData.skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h4 className="font-medium text-gray-900 mb-2">{category}:</h4>
                    <div className="space-y-1">
                      {categorySkills.map(skill => (
                        <div key={skill.id} className="flex items-center justify-between">
                          <span className="text-gray-700">{skill.name}</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(level => (
                              <div
                                key={level}
                                className={`w-2 h-2 rounded-full ${
                                  level <= skill.level ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects */}
        {sectionToggles.projects && cvData.projects.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
              PROJECTS
            </h3>
            <div className="space-y-4">
              {cvData.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{project.name}</h4>
                      {project.technologies.length > 0 && (
                        <p className="text-sm text-gray-600">{project.technologies.join(', ')}</p>
                      )}
                    </div>
                    {project.link && (
                      <div className="text-sm text-blue-600">
                        <Globe className="h-4 w-4 inline mr-1" />
                        Link
                      </div>
                    )}
                  </div>
                  {project.description && (
                    <div className="text-gray-700 whitespace-pre-wrap text-sm">
                      {project.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {sectionToggles.certifications && cvData.certifications.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
              CERTIFICATIONS
            </h3>
            <div className="space-y-2">
              {cvData.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                    <p className="text-gray-700">{cert.issuer}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {cert.date && new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {sectionToggles.languages && cvData.languages.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
              LANGUAGES
            </h3>
            <div className="grid md:grid-cols-2 gap-2">
              {cvData.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center">
                  <span className="text-gray-700">{lang.name}</span>
                  <span className="text-sm text-gray-600">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {cvData.projects.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
              PROJECTS
            </h3>
            <div className="space-y-4">
              {cvData.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                        View Project
                      </a>
                    )}
                  </div>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.description && (
                    <div className="text-gray-700 whitespace-pre-wrap text-sm">
                      {project.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {cvData.certifications.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
              CERTIFICATIONS
            </h3>
            <div className="space-y-3">
              {cvData.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                    <p className="text-gray-700">{cert.issuer}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {cert.date && new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {cvData.languages.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
              LANGUAGES
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {cvData.languages.map((language) => (
                <div key={language.id} className="flex justify-between items-center">
                  <span className="text-gray-700">{language.name}</span>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {language.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal': return renderPersonalInfo();
      case 'summary': return renderSummary();
      case 'experience': return renderExperience();
      case 'education': return renderEducation();
      case 'skills': return renderSkills();
      case 'projects': return renderProjects();
      case 'certifications': return renderCertifications();
      case 'languages': return renderLanguages();
      case 'projects': return renderProjects();
      case 'certifications': return renderCertifications();
      case 'languages': return renderLanguages();
      default: return renderPersonalInfo();
    }
  };

  const addProject = () => {
    const newProject = {
      id: `project-${Date.now()}`,
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
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      link: ''
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
      id: `lang-${Date.now()}`,
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

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          Projects
        </h3>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sectionToggles.projects}
              onChange={() => toggleSection('projects')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Include in CV
          </label>
          <button
            onClick={addProject}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        </div>
      </div>

      {cvData.projects.map((project) => (
        <div key={project.id} className="bg-gray-50 rounded-lg p-6 relative">
          <button
            onClick={() => removeProject(project.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="E-commerce Platform"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Link (Optional)</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
              <span className="text-gray-500 font-normal ml-2">(Describe the project and your role)</span>
            </label>
            <RichTextEditor
              value={project.description}
              onChange={(value) => updateProject(project.id, 'description', value)}
              placeholder="• Developed a full-stack e-commerce platform serving 10,000+ users&#10;• Implemented secure payment processing and inventory management&#10;• Led a team of 3 developers using Agile methodology"
              className="min-h-32"
            />
          </div>
        </div>
      ))}

      {cvData.projects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No projects added yet</p>
          <button
            onClick={addProject}
            className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first project
          </button>
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
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sectionToggles.certifications}
              onChange={() => toggleSection('certifications')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Include in CV
          </label>
          <button
            onClick={addCertification}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Certification
          </button>
        </div>
      </div>

      {cvData.certifications.map((cert) => (
        <div key={cert.id} className="bg-gray-50 rounded-lg p-6 relative">
          <button
            onClick={() => removeCertification(cert.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name *</label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="AWS Certified Solutions Architect"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization *</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Amazon Web Services"
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Link (Optional)</label>
              <input
                type="url"
                value={cert.link}
                onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://verify.certification.com/12345"
              />
            </div>
          </div>
        </div>
      ))}

      {cvData.certifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No certifications added yet</p>
          <button
            onClick={addCertification}
            className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first certification
          </button>
        </div>
      )}
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Languages className="h-5 w-5 text-blue-600" />
          Languages
        </h3>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sectionToggles.languages}
              onChange={() => toggleSection('languages')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Include in CV
          </label>
          <button
            onClick={addLanguage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Language
          </button>
        </div>
      </div>

      {cvData.languages.map((lang) => (
        <div key={lang.id} className="bg-gray-50 rounded-lg p-6 relative">
          <button
            onClick={() => removeLanguage(lang.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language *</label>
              <input
                type="text"
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="French"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
              <select
                value={lang.proficiency}
                onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      {cvData.languages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Languages className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No languages added yet</p>
          <button
            onClick={addLanguage}
            className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first language
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} label="Back" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">CV Builder</h1>
                <p className="text-sm text-gray-600">
                  Create your professional CV
                  {targetMarket && ` • Optimized for ${targetMarket.flag} ${targetMarket.name}`}
                  {hasUnsavedChanges && <span className="text-orange-600 ml-2">• Unsaved changes</span>}
                </p>
                  Create your professional CV
                  {targetMarket && ` • Optimized for ${targetMarket.flag} ${targetMarket.name}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={loadPreviousDraft}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Load Draft
              </button>
              
              <button
                onClick={clearAllData}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </button>
              
              {/* Progress indicator */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600">Progress:</span>
                <div className="flex gap-1">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        completedSections.has(section.id)
                          ? 'bg-green-500'
                          : activeSection === section.id
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {completedSections.size}/{sections.length}
                </span>
              </div>
              
              <button
                onClick={() => setShowImport(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Import CV
              </button>
              
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center gap-2 px-4 py-2 border border-purple-300 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors"
              >
                <Zap className="h-4 w-4" />
                AI Suggestions
              </button>
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                CV Sections
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <div className={`p-1 rounded-lg ${
                      activeSection === section.id ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {section.icon}
                    </div>
                    <span className="flex-1">{section.name}</span>
                    {section.required && (
                      <span className="text-xs text-red-500 font-bold">*</span>
                    )}
                    {completedSections.has(section.id) && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </button>
                ))}
              </nav>
              
              {/* Section Navigation */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateToSection('prev')}
                    disabled={sections.findIndex(s => s.id === activeSection) === 0}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => navigateToSection('next')}
                    disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`flex-1 ${showPreview ? 'max-w-2xl' : ''}`}>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-8">
              {renderActiveSection()}
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-96 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Live Preview
                </h3>
                <div className="max-h-[800px] overflow-y-auto">
                  {renderPreview()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full">
            <CVImportSection
              onImportComplete={handleImportComplete}
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