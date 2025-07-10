import React, { useState, useEffect } from 'react';
import { Eye, Download, Save, Settings, Zap, FileText, User, Briefcase, GraduationCap, Award, Code, Languages, Plus, Trash2, Calendar, MapPin, Mail, Phone, Globe, Linkedin, ArrowLeft, Sparkles, RefreshCw, Upload, Wand2 } from 'lucide-react';
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
  onBack: () => void;
  targetMarket?: TargetMarket | null;
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

const CVBuilder: React.FC<CVBuilderProps> = ({ onBack, targetMarket }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [progress, setProgress] = useState(0);
  
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

  const [sectionToggles, setSectionToggles] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: false,
    languages: false
  });

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const fetchedTemplates = await fetchCVTemplates();
        setTemplates(fetchedTemplates);
        if (fetchedTemplates.length > 0) {
          setSelectedTemplate(fetchedTemplates[0]); // Default to first template
        }
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };

    loadTemplates();

    // Check if we're editing an existing CV
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
    } else {
      // Load saved data from localStorage for new CVs
      const savedData = localStorage.getItem('mocv_current_cv');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setCvData(parsed);
        } catch (error) {
          console.error('Error loading saved CV data:', error);
        }
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('mocv_current_cv', JSON.stringify(cvData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cvData]);

  // Calculate progress
  useEffect(() => {
    const calculateProgress = () => {
      let completed = 0;
      const total = 8; // Total number of progress items

      if (cvData.personalInfo.fullName) completed++;
      if (cvData.personalInfo.email) completed++;
      if (cvData.personalInfo.title) completed++;
      if (cvData.summary) completed++;
      if (cvData.experience.length > 0) completed++;
      if (cvData.education.length > 0) completed++;
      if (cvData.skills.length > 0) completed++;
      if (cvData.projects.length > 0 || cvData.certifications.length > 0) completed++;

      setProgress(Math.round((completed / total) * 100));
    };

    calculateProgress();
  }, [cvData]);

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

  const toggleSection = (sectionId: string) => {
    setSectionToggles(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId as keyof typeof prev]
    }));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
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
      localStorage.removeItem('mocv_current_cv');
      localStorage.removeItem('mocv_editing_cv');
    }
  };

  const handleSave = () => {
    // Save to localStorage and show success message
    localStorage.setItem('mocv_current_cv', JSON.stringify(cvData));
    
    // Check if we're editing an existing CV
    const editingData = localStorage.getItem('mocv_editing_cv');
    if (editingData) {
      try {
        const { cvId } = JSON.parse(editingData);
        // Update existing CV in the list
        const savedCVs = localStorage.getItem('mocv_saved_cvs');
        if (savedCVs) {
          const cvList = JSON.parse(savedCVs);
          const updatedList = cvList.map((cv: any) => 
            cv.id === cvId 
              ? { ...cv, cvData, dateModified: new Date(), atsScore: Math.floor(Math.random() * 20) + 75 }
              : cv
          );
          localStorage.setItem('mocv_saved_cvs', JSON.stringify(updatedList));
        }
        localStorage.removeItem('mocv_editing_cv');
      } catch (error) {
        console.error('Error updating existing CV:', error);
      }
    } else {
      // Save as new CV
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
    }
    
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            Personal Information
          </h3>
          <p className="text-gray-600 mt-2">Tell us about yourself and how to reach you</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
          <input
            type="text"
            value={cvData.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            placeholder="John Doe"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Professional Title *</label>
          <input
            type="text"
            value={cvData.personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            placeholder="Senior Software Engineer"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Email *</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={cvData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              placeholder="john@example.com"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Phone</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={cvData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              placeholder="+230 5123 4567"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={cvData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              placeholder="Port Louis, Mauritius"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">LinkedIn</label>
          <div className="relative">
            <Linkedin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url"
              value={cvData.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            Professional Summary
          </h3>
          <p className="text-gray-600 mt-2">A compelling overview of your professional background</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={sectionToggles.summary}
              onChange={() => toggleSection('summary')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Include in CV
          </label>
          <AIEnhanceButton
            text={cvData.summary}
            sectionType="summary"
            onTextUpdate={updateSummary}
            jobTitle={cvData.personalInfo.title}
            size="md"
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Professional Summary
          <span className="text-gray-500 font-normal ml-2">(2-3 sentences highlighting your key qualifications)</span>
        </label>
        <RichTextEditor
          value={cvData.summary}
          onChange={updateSummary}
          placeholder="Experienced professional with expertise in..."
          className="min-h-32"
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Character limit: 600</span>
          <span className={cvData.summary.length > 600 ? 'text-red-500' : ''}>
            Current: {cvData.summary.length}
          </span>
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-green-600" />
            </div>
            Work Experience
          </h3>
          <p className="text-gray-600 mt-2">Your professional journey and achievements</p>
        </div>
        <button
          onClick={addExperience}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add Experience
        </button>
      </div>

      {cvData.experience.map((exp, index) => (
        <div key={exp.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100 relative group hover:shadow-xl transition-all duration-300">
          <button
            onClick={() => removeExperience(exp.id)}
            className="absolute top-6 right-6 text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Job Title *</label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="Senior Software Engineer"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Company *</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="Tech Company Inc."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Location</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="Port Louis, Mauritius"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Employment Period</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  min="1990-01"
                  max={new Date().toISOString().slice(0, 7)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-sm"
                />
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                  min="1990-01"
                  max={new Date().toISOString().slice(0, 7)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm disabled:bg-gray-100 text-sm"
                />
              </div>
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700 font-medium">Current position</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                Job Description *
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
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
          <Briefcase className="h-16 w-16 mx-auto mb-6 text-gray-300" />
          <h4 className="text-xl font-semibold text-gray-600 mb-2">No work experience added yet</h4>
          <p className="text-gray-500 mb-6">Add your professional experience to showcase your career journey</p>
          <button
            onClick={addExperience}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
          >
            Add your first experience
          </button>
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
            </div>
            Education
          </h3>
          <p className="text-gray-600 mt-2">Your academic background and qualifications</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={sectionToggles.education}
              onChange={() => toggleSection('education')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Include in CV
          </label>
          <button
            onClick={addEducation}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Add Education
          </button>
        </div>
      </div>

      {cvData.education.map((edu) => (
        <div key={edu.id} className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 shadow-lg border border-gray-100 relative group hover:shadow-xl transition-all duration-300">
          <button
            onClick={() => removeEducation(edu.id)}
            className="absolute top-6 right-6 text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Degree *</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="Bachelor of Science in Computer Science"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Institution *</label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="University of Mauritius"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Study Period</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={edu.startYear}
                  onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                  min="1990"
                  max={new Date().getFullYear()}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-sm"
                  placeholder="2018"
                />
                <input
                  type="number"
                  value={edu.endYear}
                  onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                  disabled={edu.current}
                  min="1990"
                  max={new Date().getFullYear() + 10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm disabled:bg-gray-100 text-sm"
                  placeholder="2022"
                />
              </div>
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={edu.current}
                  onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 font-medium">Currently studying</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">GPA (Optional)</label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="3.8/4.0"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Additional Details (Optional)
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
        <div className="text-center py-16 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border-2 border-dashed border-indigo-300">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 text-indigo-300" />
          <h4 className="text-xl font-semibold text-gray-600 mb-2">No education added yet</h4>
          <p className="text-gray-500 mb-6">Add your educational background to strengthen your profile</p>
          <button
            onClick={addEducation}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
          >
            Add your education
          </button>
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Code className="h-5 w-5 text-orange-600" />
            </div>
            Skills & Expertise
          </h3>
          <p className="text-gray-600 mt-2">Showcase your technical and professional capabilities</p>
        </div>
        <button
          onClick={addSkill}
          className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add Skill
        </button>
      </div>

      {cvData.skills.map((skill) => (
        <div key={skill.id} className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg border border-gray-100 relative group hover:shadow-xl transition-all duration-300">
          <button
            onClick={() => removeSkill(skill.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Skill Name *</label>
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="JavaScript"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Category</label>
              <select
                value={skill.category}
                onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              >
                <option value="Technical">Technical</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Languages">Languages</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Proficiency Level ({skill.level}/5)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #ea580c 0%, #ea580c ${(skill.level / 5) * 100}%, #e5e7eb ${(skill.level / 5) * 100}%, #e5e7eb 100%)`
                }}
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
        <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-white rounded-2xl border-2 border-dashed border-orange-300">
          <Code className="h-16 w-16 mx-auto mb-6 text-orange-300" />
          <h4 className="text-xl font-semibold text-gray-600 mb-2">No skills added yet</h4>
          <p className="text-gray-500 mb-6">Add your skills to highlight your expertise</p>
          <button
            onClick={addSkill}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
          >
            Add your first skill
          </button>
        </div>
      )}
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[800px] border border-gray-200">
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
        {sectionToggles.summary && cvData.summary && (
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
        {sectionToggles.education && cvData.education.length > 0 && (
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

        {/* Draft Watermark */}
        {isDraftMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-6xl font-bold text-gray-200 transform rotate-45 opacity-50">
              DRAFT
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
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <BackButton onClick={onBack} label="Back" />
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
                    <p className="text-sm text-gray-600">
                      Create your professional CV
                      {targetMarket && ` • Optimized for ${targetMarket.flag} ${targetMarket.name}`}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="hidden lg:flex items-center gap-3 ml-8">
                <span className="text-sm font-medium text-gray-600">Progress:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{progress}%</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowImport(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                <FileText className="h-3.5 w-3.5" />
                Import CV
              </button>
              
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2.5 border border-orange-300 text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <RefreshCw className="h-4 w-4" />
                Clear & Reset
              </button>
              
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-purple-300 text-purple-600 rounded-md hover:bg-purple-50 transition-colors text-sm"
              >
                <Zap className="h-3.5 w-3.5" />
                AI Suggestions
              </button>
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                <Eye className="h-3.5 w-3.5" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              
              <div className="flex items-center gap-1.5">
                <label className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={isDraftMode}
                    onChange={(e) => setIsDraftMode(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                  Draft Mode
                </label>
              </div>
              
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Enhanced Sidebar */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-28">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">CV Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const isCompleted = section.id === 'personal' 
                    ? cvData.personalInfo.fullName && cvData.personalInfo.email
                    : section.id === 'summary'
                    ? cvData.summary.length > 0
                    : section.id === 'experience'
                    ? cvData.experience.length > 0
                    : section.id === 'education'
                    ? cvData.education.length > 0
                    : section.id === 'skills'
                    ? cvData.skills.length > 0
                    : false;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-md'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                      }`}>
                        {section.icon}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{section.name}</span>
                        {section.required && (
                          <span className="text-xs text-red-500 ml-1">*</span>
                        )}
                      </div>
                      {isCompleted && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className={`flex-1 ${showPreview ? 'max-w-3xl' : ''}`}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              {renderActiveSection()}
            </div>
          </div>

          {/* Enhanced Preview Panel */}
          {showPreview && (
            <div className="w-96 flex-shrink-0">
              <div className="sticky top-28">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">Live Preview</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Auto-updating</span>
                  </div>
                </div>
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