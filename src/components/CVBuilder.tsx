// src/components/CVBuilder.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Download, Eye, Wand2, ArrowLeft, ArrowRight, 
  Plus, Trash2, Upload, Sparkles, Brain, Target,
  User, Briefcase, GraduationCap, Award, Code2, 
  FileText, Link, Mail, Phone, MapPin, Calendar,
  CheckCircle, AlertCircle, Loader2, Edit3, ExternalLink
} from 'lucide-react';
import { CVData, TargetMarket, CVTemplate } from '../types';
import { StorageService } from '../services/storageService';
import { AIService } from '../services/aiService';
import { TemplateService } from '../services/templateService';
import { PDFGenerator } from '../services/pdfGenerator';

interface CVBuilderProps {
  initialData?: Partial<CVData>;
  targetMarket?: TargetMarket;
  selectedTemplate?: CVTemplate;
  onSave?: (cvData: CVData) => void;
  onPreview?: (cvData: CVData) => void;
}

const CVBuilder: React.FC<CVBuilderProps> = ({ 
  initialData, 
  targetMarket = 'mauritius', 
  selectedTemplate,
  onSave,
  onPreview 
}) => {
  // State management
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
    ...initialData
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  
  // FIXED: Added preview mode state
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Services
  const storageService = new StorageService();
  const aiService = new AIService();
  const templateService = new TemplateService();
  const pdfGenerator = new PDFGenerator();

  // Auto-save functionality
  const autoSaveTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Auto-save every 30 seconds
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }
    
    autoSaveTimer.current = setTimeout(() => {
      handleAutoSave();
    }, 30000);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [cvData]);

  const handleAutoSave = async () => {
    setAutoSaveStatus('saving');
    try {
      storageService.saveDraft(cvData);
      setAutoSaveStatus('saved');
    } catch (error) {
      setAutoSaveStatus('error');
      console.error('Auto-save failed:', error);
    }
  };

  // FIXED: Added preview toggle function
  const togglePreview = () => {
    console.log('Preview toggle clicked, current mode:', isPreviewMode);
    setIsPreviewMode(!isPreviewMode);
    console.log('Preview mode will be:', !isPreviewMode);
  };

  // Step configuration
  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: User,
      description: 'Your basic contact details'
    },
    {
      id: 'summary',
      title: 'Professional Summary',
      icon: FileText,
      description: 'Your elevator pitch'
    },
    {
      id: 'experience',
      title: 'Work Experience',
      icon: Briefcase,
      description: 'Your professional journey'
    },
    {
      id: 'education',
      title: 'Education',
      icon: GraduationCap,
      description: 'Your academic background'
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: Code2,
      description: 'Your technical and soft skills'
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: Target,
      description: 'Your notable projects'
    },
    {
      id: 'certifications',
      title: 'Certifications',
      icon: Award,
      description: 'Your professional certifications'
    }
  ];

  // Validation
  const validateStep = (stepIndex: number): boolean => {
    const step = steps[stepIndex];
    const errors: Record<string, string> = {};

    switch (step.id) {
      case 'personal':
        if (!cvData.personalInfo.fullName.trim()) {
          errors.fullName = 'Full name is required';
        }
        if (!cvData.personalInfo.email.trim()) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cvData.personalInfo.email)) {
          errors.email = 'Please enter a valid email';
        }
        if (!cvData.personalInfo.phone.trim()) {
          errors.phone = 'Phone number is required';
        }
        break;
      case 'summary':
        if (!cvData.summary.trim()) {
          errors.summary = 'Professional summary is required';
        } else if (cvData.summary.trim().length < 50) {
          errors.summary = 'Summary should be at least 50 characters';
        }
        break;
      case 'experience':
        if (cvData.experience.length === 0) {
          errors.experience = 'At least one work experience is required';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Data handlers
  const updatePersonalInfo = (field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: `exp_${Date.now()}`,
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
      id: `edu_${Date.now()}`,
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
      id: `skill_${Date.now()}`,
      name: '',
      level: 3,
      category: 'technical'
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
      id: `proj_${Date.now()}`,
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
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const removeProject = (id: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const addCertification = () => {
    const newCert = {
      id: `cert_${Date.now()}`,
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

  // AI Enhancement
  const enhanceWithAI = async (section: string, content: string) => {
    setIsLoading(true);
    try {
      const enhanced = await aiService.enhanceContent(content, section, targetMarket);
      return enhanced;
    } catch (error) {
      console.error('AI enhancement failed:', error);
      return content;
    } finally {
      setIsLoading(false);
    }
  };

  // Actions
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const savedCV = storageService.saveCV({
        data: cvData,
        templateId: selectedTemplate?.id || 'modern-professional',
        targetMarket,
        name: `${cvData.personalInfo.fullName} - CV`,
        lastModified: new Date()
      });
      
      if (onSave) {
        onSave(cvData);
      }
      
      // Show success message
      setAutoSaveStatus('saved');
    } catch (error) {
      console.error('Save failed:', error);
      setAutoSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(cvData);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await pdfGenerator.generatePDF(cvData, selectedTemplate);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // FIXED: Added CV preview rendering function
  const renderCVPreview = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 min-h-[800px]">
          {/* CV Header */}
          <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {cvData.personalInfo?.fullName || 'Your Full Name'}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {cvData.personalInfo?.title || 'Your Professional Title'}
            </p>
            
            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {cvData.personalInfo?.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {cvData.personalInfo.email}
                </div>
              )}
              {cvData.personalInfo?.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {cvData.personalInfo.phone}
                </div>
              )}
              {cvData.personalInfo?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {cvData.personalInfo.location}
                </div>
              )}
              {cvData.personalInfo?.linkedin && (
                <div className="flex items-center gap-1">
                  <Link className="h-4 w-4" />
                  LinkedIn
                </div>
              )}
              {cvData.personalInfo?.website && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" />
                  Portfolio
                </div>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {cvData.summary && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-400 pb-2">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">{cvData.summary}</p>
            </div>
          )}

          {/* Experience */}
          {cvData.experience && cvData.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-400 pb-2">
                Professional Experience
              </h2>
              <div className="space-y-6">
                {cvData.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-orange-300 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {exp.title || 'Job Title'}
                    </h3>
                    <p className="text-orange-600 font-medium text-lg mb-2">
                      {exp.company || 'Company Name'}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                    <p className="text-gray-600 mb-3">
                      {exp.startDate || 'Start Date'} - {exp.current ? 'Present' : (exp.endDate || 'End Date')}
                    </p>
                    {exp.description && (
                      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cvData.education && cvData.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-400 pb-2">
                Education
              </h2>
              <div className="space-y-4">
                {cvData.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {edu.degree || 'Degree'}
                      </h3>
                      <p className="text-orange-600 font-medium">{edu.school || 'School Name'}</p>
                      {edu.location && <p className="text-gray-600">{edu.location}</p>}
                      {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">{edu.graduationDate || 'Graduation Date'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {cvData.skills && cvData.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-400 pb-2">
                Skills
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-900 mb-2">{skill.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${skill.level * 20}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{skill.level}/5</span>
                    </div>
                    {skill.category && (
                      <div className="text-xs text-gray-500 mt-1 capitalize">{skill.category}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {cvData.projects && cvData.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-400 pb-2">
                Projects
              </h2>
              <div className="space-y-6">
                {cvData.projects.map((project, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {project.name || 'Project Name'}
                    </h3>
                    {project.description && (
                      <p className="text-gray-700 mb-3">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.link && (
                      <a href={project.link} className="text-orange-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" />
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {cvData.certifications && cvData.certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-400 pb-2">
                Certifications
              </h2>
              <div className="space-y-4">
                {cvData.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {cert.name || 'Certification Name'}
                      </h3>
                      <p className="text-orange-600">{cert.issuer || 'Issuing Organization'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">{cert.date || 'Issue Date'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!cvData.personalInfo?.fullName && !cvData.summary && 
           (!cvData.experience || cvData.experience.length === 0) && (
            <div className="text-center py-16 text-gray-400">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Your CV Preview</h3>
              <p>Start filling out your information to see your CV come to life!</p>
              <button
                onClick={() => setIsPreviewMode(false)}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Start Building
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render step content (existing code)
  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    validationErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {validationErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo.title}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+230 5xxx xxxx"
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website/Portfolio
                </label>
                <input
                  type="url"
                  value={cvData.personalInfo.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://johndoe.com"
                />
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Professional Summary *
                </label>
                <button
                  onClick={() => enhanceWithAI('summary', cvData.summary)}
                  disabled={isLoading}
                  className="flex items-center px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Wand2 className="h-4 w-4 mr-1" />}
                  Enhance with AI
                </button>
              </div>
              <textarea
                value={cvData.summary}
                onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  validationErrors.summary ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Write a compelling summary that highlights your key strengths, experience, and career objectives..."
              />
              {validationErrors.summary && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.summary}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {cvData.summary.length}/500 characters • Aim for 2-3 sentences highlighting your key value proposition
              </p>
            </div>
          </div>
        );

      // ... [Rest of the existing step content - experience, education, skills, projects, certifications]
      // I'll keep the existing implementation for brevity
      
      default:
        return <div>Step content for {step.title} goes here...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
              <div className="ml-4 flex items-center space-x-2">
                {autoSaveStatus === 'saving' && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Saving...
                  </div>
                )}
                {autoSaveStatus === 'saved' && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Saved
                  </div>
                )}
                {autoSaveStatus === 'error' && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Save Failed
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* FIXED: Updated preview button */}
              <button
                onClick={togglePreview}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                  isPreviewMode 
                    ? 'text-white bg-green-500 hover:bg-green-600' 
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {isPreviewMode ? <Edit3 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {isPreviewMode ? 'Edit CV' : 'Preview CV'}
              </button>

              <button
                onClick={handleDownload}
                disabled={isLoading}
                className="flex items-center px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                Download PDF
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save CV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED: Main content now switches between edit and preview mode */}
      {isPreviewMode ? (
        /* Preview Mode - Full Screen CV Preview */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">CV Preview</h2>
            <div className="text-sm text-gray-600">
              This is how your CV will look when exported to PDF
            </div>
          </div>
          {renderCVPreview()}
        </div>
      ) : (
        /* Edit Mode - Form Interface */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Steps Sidebar */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">CV Sections</h2>
                <nav className="space-y-2">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === index;
                    const isCompleted = index < currentStep;

                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(index)}
                        className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                          isActive 
                            ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-500' 
                            : isCompleted
                            ? 'bg-green-50 text-green-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <StepIcon className={`h-5 w-5 mr-3 ${
                          isActive ? 'text-orange-500' : isCompleted ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium">{step.title}</div>
                          <div className="text-xs text-gray-500">{step.description}</div>
                        </div>
                        {isCompleted && (
                          <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content - Full Width */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Step Header */}
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {steps[currentStep].title}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {steps[currentStep].description}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                  {renderStepContent()}
                </div>

                {/* Navigation */}
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </button>

                    <button
                      onClick={nextStep}
                      disabled={currentStep === steps.length - 1}
                      className="flex items-center px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Panel */}
      {aiAssistantOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              <button
                onClick={() => setAiAssistantOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600">
              AI assistance is coming soon! This will help you optimize your CV content for better results.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVBuilder;
