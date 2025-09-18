// src/components/CVBuilder.tsx - COMPLETE VERSION WITH PDF - SECTION 1
import React, { useState, useEffect, useRef } from 'react';
import {
  User, FileText, Briefcase, GraduationCap, Code2, Target, Award,
  Plus, Trash2, Eye, Download, Save, ArrowLeft, ArrowRight,
  Settings, Sparkles, Bot, RotateCcw, CheckCircle, AlertCircle,
  Calendar, MapPin, ExternalLink, Mail, Phone, Globe
} from 'lucide-react';
import { generateCVPDF } from '../services/pdfService';

// Types and Interfaces
interface CVBuilderProps {
  targetMarket?: any;
  template?: any;
  onComplete?: (cvData: any) => void;
  onBack?: () => void;
  initialData?: any;
}

interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'technical' | 'soft' | 'language' | 'other';
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  current: boolean;
  url?: string;
  github?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

interface ValidationErrors {
  [key: string]: string;
}

// Main Component Start
const CVBuilder: React.FC<CVBuilderProps> = ({
  targetMarket,
  template,
  onComplete,
  onBack,
  initialData
}) => {
  // State Management
  const [currentStep, setCurrentStep] = useState(0);
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
    certifications: []
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Steps configuration
  const steps = [
    { 
      id: 'personal', 
      title: 'Personal Info', 
      icon: User, 
      description: 'Basic contact information' 
    },
    { 
      id: 'summary', 
      title: 'Professional Summary', 
      icon: FileText, 
      description: 'Your career overview' 
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

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setCvData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [initialData]);

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdfBytes = await generateCVPDF(cvData);
      
      // Create blob and download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf` || 'CV.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validatePersonalInfo = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!cvData.personalInfo.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!cvData.personalInfo.title.trim()) {
      errors.title = 'Professional title is required';
    }
    
    if (!cvData.personalInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(cvData.personalInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!cvData.personalInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(cvData.personalInfo.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  // Form Rendering Functions - Section 2

  // Personal Information Form
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
        </div>
        <p className="text-gray-600 mb-6">Let's start with your basic contact information</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cvData.personalInfo.fullName}
              onChange={(e) => setCvData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, fullName: e.target.value }
              }))}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.fullName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="John Doe"
            />
            {validationErrors.fullName && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cvData.personalInfo.title}
              onChange={(e) => setCvData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, title: e.target.value }
              }))}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Senior Software Developer"
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={cvData.personalInfo.email}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: e.target.value }
                }))}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
            </div>
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={cvData.personalInfo.phone}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, phone: e.target.value }
                }))}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {validationErrors.phone && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={cvData.personalInfo.location}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, location: e.target.value }
                }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="New York, NY"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile
            </label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={cvData.personalInfo.linkedin}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website/Portfolio
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={cvData.personalInfo.website}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, website: e.target.value }
                }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://johndoe.dev"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Professional Summary Form
  const renderSummary = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Professional Summary</h3>
        </div>
        <p className="text-gray-600 mb-6">Write a compelling summary that highlights your key strengths and career objectives</p>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary
          </label>
          <textarea
            value={cvData.summary}
            onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={6}
            placeholder="Dynamic software engineer with 5+ years of experience in full-stack development. Passionate about creating scalable solutions and leading cross-functional teams to deliver exceptional user experiences..."
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              Tip: Keep it concise (2-3 sentences) and focus on your value proposition
            </p>
            <span className="text-sm text-gray-400">
              {cvData.summary.length} characters
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Work Experience Form
  const renderExperience = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Work Experience</h3>
          </div>
          <button
            onClick={() => {
              const newExperience: Experience = {
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
                experience: [...prev.experience, newExperience]
              }));
            }}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">Add your work experience, starting with the most recent position</p>

        {cvData.experience.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No work experience added</h4>
            <p className="text-gray-500">Click "Add Experience" to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cvData.experience.map((exp, index) => (
              <div key={exp.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Experience #{index + 1}</h4>
                  <button
                    onClick={() => {
                      setCvData(prev => ({
                        ...prev,
                        experience: prev.experience.filter(e => e.id !== exp.id)
                      }));
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          experience: prev.experience.map(item => 
                            item.id === exp.id ? { ...item, title: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          experience: prev.experience.map(item => 
                            item.id === exp.id ? { ...item, company: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Google Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          experience: prev.experience.map(item => 
                            item.id === exp.id ? { ...item, location: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Employment Period
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => {
                            setCvData(prev => ({
                              ...prev,
                              experience: prev.experience.map(item => 
                                item.id === exp.id ? { ...item, current: e.target.checked } : item
                              )
                            }));
                          }}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-600">Current Position</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => {
                          setCvData(prev => ({
                            ...prev,
                            experience: prev.experience.map(item => 
                              item.id === exp.id ? { ...item, startDate: e.target.value } : item
                            )
                          }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => {
                          setCvData(prev => ({
                            ...prev,
                            experience: prev.experience.map(item => 
                              item.id === exp.id ? { ...item, endDate: e.target.value } : item
                            )
                          }));
                        }}
                        disabled={exp.current}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description & Achievements
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => {
                      setCvData(prev => ({
                        ...prev,
                        experience: prev.experience.map(item => 
                          item.id === exp.id ? { ...item, description: e.target.value } : item
                        )
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                    placeholder="• Led a team of 5 developers in building scalable web applications
• Implemented microservices architecture reducing system downtime by 40%
• Collaborated with product managers to define technical requirements"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use bullet points to describe your responsibilities and achievements
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  // Education Form
  const renderEducation = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-900">Education</h3>
          </div>
          <button
            onClick={() => {
              const newEducation: Education = {
                id: Date.now().toString(),
                degree: '',
                institution: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                gpa: '',
                description: ''
              };
              setCvData(prev => ({
                ...prev,
                education: [...prev.education, newEducation]
              }));
            }}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Education
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">Add your educational background, starting with the most recent</p>

        {cvData.education.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No education added</h4>
            <p className="text-gray-500">Click "Add Education" to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cvData.education.map((edu, index) => (
              <div key={edu.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Education #{index + 1}</h4>
                  <button
                    onClick={() => {
                      setCvData(prev => ({
                        ...prev,
                        education: prev.education.filter(e => e.id !== edu.id)
                      }));
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree/Qualification
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          education: prev.education.map(item => 
                            item.id === edu.id ? { ...item, degree: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Bachelor of Science in Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution/University
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          education: prev.education.map(item => 
                            item.id === edu.id ? { ...item, institution: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Stanford University"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          education: prev.education.map(item => 
                            item.id === edu.id ? { ...item, location: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Stanford, CA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GPA (Optional)
                    </label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          education: prev.education.map(item => 
                            item.id === edu.id ? { ...item, gpa: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="3.8/4.0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center gap-4 mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Study Period
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => {
                            setCvData(prev => ({
                              ...prev,
                              education: prev.education.map(item => 
                                item.id === edu.id ? { ...item, current: e.target.checked } : item
                              )
                            }));
                          }}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-600">Currently Studying</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => {
                          setCvData(prev => ({
                            ...prev,
                            education: prev.education.map(item => 
                              item.id === edu.id ? { ...item, startDate: e.target.value } : item
                            )
                          }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => {
                          setCvData(prev => ({
                            ...prev,
                            education: prev.education.map(item => 
                              item.id === edu.id ? { ...item, endDate: e.target.value } : item
                            )
                          }));
                        }}
                        disabled={edu.current}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={edu.description}
                    onChange={(e) => {
                      setCvData(prev => ({
                        ...prev,
                        education: prev.education.map(item => 
                          item.id === edu.id ? { ...item, description: e.target.value } : item
                        )
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    placeholder="• Relevant coursework: Data Structures, Algorithms, Machine Learning
• Awards: Dean's List (2019-2021)
• Activities: Computer Science Club President"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Skills Form
  const renderSkills = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Code2 className="h-6 w-6 text-teal-600" />
            <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
          </div>
          <button
            onClick={() => {
              const newSkill: Skill = {
                id: Date.now().toString(),
                name: '',
                level: 'intermediate',
                category: 'technical'
              };
              setCvData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill]
              }));
            }}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">Add your technical skills, soft skills, and languages</p>

        {cvData.skills.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No skills added</h4>
            <p className="text-gray-500">Click "Add Skill" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cvData.skills.map((skill, index) => (
              <div key={skill.id} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-gray-900">Skill #{index + 1}</h4>
                  <button
                    onClick={() => {
                      setCvData(prev => ({
                        ...prev,
                        skills: prev.skills.filter(s => s.id !== skill.id)
                      }));
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          skills: prev.skills.map(item => 
                            item.id === skill.id ? { ...item, name: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="JavaScript, Leadership, Spanish..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={skill.category}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          skills: prev.skills.map(item => 
                            item.id === skill.id ? { ...item, category: e.target.value as any } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="technical">Technical</option>
                      <option value="soft">Soft Skills</option>
                      <option value="language">Language</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proficiency Level
                    </label>
                    <select
                      value={skill.level}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          skills: prev.skills.map(item => 
                            item.id === skill.id ? { ...item, level: e.target.value as any } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Summary */}
        {cvData.skills.length > 0 && (
          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-3">Skills Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['technical', 'soft', 'language', 'other'].map(category => {
                const categorySkills = cvData.skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h5 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                      {category === 'technical' ? 'Technical Skills' : 
                       category === 'soft' ? 'Soft Skills' : 
                       category === 'language' ? 'Languages' : 'Other Skills'}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map(skill => (
                        <span key={skill.id} className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">
                          {skill.name} ({skill.level})
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Projects Form
  const renderProjects = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg border border-pink-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-pink-600" />
            <h3 className="text-xl font-semibold text-gray-900">Projects</h3>
          </div>
          <button
            onClick={() => {
              const newProject: Project = {
                id: Date.now().toString(),
                name: '',
                description: '',
                technologies: [],
                startDate: '',
                endDate: '',
                current: false,
                url: '',
                github: ''
              };
              setCvData(prev => ({
                ...prev,
                projects: [...prev.projects, newProject]
              }));
            }}
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">Showcase your notable projects and achievements</p>

        {cvData.projects.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No projects added</h4>
            <p className="text-gray-500">Click "Add Project" to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cvData.projects.map((project, index) => (
              <div key={project.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Project #{index + 1}</h4>
                  <button
                    onClick={() => {
                      setCvData(prev => ({
                        ...prev,
                        projects: prev.projects.filter(p => p.id !== project.id)
                      }));
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          projects: prev.projects.map(item => 
                            item.id === project.id ? { ...item, name: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="E-commerce Platform"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies Used
                    </label>
                    <input
                      type="text"
                      value={project.technologies.join(', ')}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          projects: prev.projects.map(item => 
                            item.id === project.id ? { 
                              ...item, 
                              technologies: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean) 
                            } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="React, Node.js, MongoDB, AWS"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate technologies with commas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Live URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={project.url}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          projects: prev.projects.map(item => 
                            item.id === project.id ? { ...item, url: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="https://myproject.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={project.github}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          projects: prev.projects.map(item => 
                            item.id === project.id ? { ...item, github: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="https://github.com/username/project"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center gap-4 mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Project Duration
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={project.current}
                          onChange={(e) => {
                            setCvData(prev => ({
                              ...prev,
                              projects: prev.projects.map(item => 
                                item.id === project.id ? { ...item, current: e.target.checked } : item
                              )
                            }));
                          }}
                          className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-600">Ongoing Project</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="month"
                        value={project.startDate}
                        onChange={(e) => {
                          setCvData(prev => ({
                            ...prev,
                            projects: prev.projects.map(item => 
                              item.id === project.id ? { ...item, startDate: e.target.value } : item
                            )
                          }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                      <input
                        type="month"
                        value={project.endDate}
                        onChange={(e) => {
                          setCvData(prev => ({
                            ...prev,
                            projects: prev.projects.map(item => 
                              item.id === project.id ? { ...item, endDate: e.target.value } : item
                            )
                          }));
                        }}
                        disabled={project.current}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => {
                      setCvData(prev => ({
                        ...prev,
                        projects: prev.projects.map(item => 
                          item.id === project.id ? { ...item, description: e.target.value } : item
                        )
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows={4}
                    placeholder="• Built a full-stack e-commerce platform with React and Node.js
• Implemented secure payment processing with Stripe integration
• Achieved 99.9% uptime with automated testing and CI/CD pipeline
• Served 10,000+ users with average page load time under 2 seconds"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Describe the project, your role, technologies used, and key achievements
                  </p>
                </div>

                {/* Project Technology Tags */}
                {project.technologies.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Technologies</h5>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  // Certifications Form
  const renderCertifications = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-indigo-600" />
            <h3 className="text-xl font-semibold text-gray-900">Certifications</h3>
          </div>
          <button
            onClick={() => {
              const newCertification: Certification = {
                id: Date.now().toString(),
                name: '',
                issuer: '',
                issueDate: '',
                expiryDate: '',
                credentialId: '',
                url: ''
              };
              setCvData(prev => ({
                ...prev,
                certifications: [...prev.certifications, newCertification]
              }));
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Certification
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">Add your professional certifications and achievements</p>

        {cvData.certifications.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No certifications added</h4>
            <p className="text-gray-500">Click "Add Certification" to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cvData.certifications.map((cert, index) => (
              <div key={cert.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Certification #{index + 1}</h4>
                  <button
                    onClick={() => {
                      setCvData(prev => ({
                        ...prev,
                        certifications: prev.certifications.filter(c => c.id !== cert.id)
                      }));
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification Name
                    </label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          certifications: prev.certifications.map(item => 
                            item.id === cert.id ? { ...item, name: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issuing Organization
                    </label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          certifications: prev.certifications.map(item => 
                            item.id === cert.id ? { ...item, issuer: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Amazon Web Services"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="month"
                      value={cert.issueDate}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          certifications: prev.certifications.map(item => 
                            item.id === cert.id ? { ...item, issueDate: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="month"
                      value={cert.expiryDate}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          certifications: prev.certifications.map(item => 
                            item.id === cert.id ? { ...item, expiryDate: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credential ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={cert.credentialId}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          certifications: prev.certifications.map(item => 
                            item.id === cert.id ? { ...item, credentialId: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="ABC123XYZ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={cert.url}
                      onChange={(e) => {
                        setCvData(prev => ({
                          ...prev,
                          certifications: prev.certifications.map(item => 
                            item.id === cert.id ? { ...item, url: e.target.value } : item
                          )
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="https://aws.amazon.com/verification/..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Step Navigation Functions
  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 0 && !validatePersonalInfo()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  // Save CV Data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would typically save to your backend/database
      console.log('Saving CV data:', cvData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // You can add your actual save logic here
      // await saveCVData(cvData);
      
    } catch (error) {
      console.error('Error saving CV:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Complete CV Building
  const handleComplete = () => {
    if (onComplete) {
      onComplete(cvData);
    }
  };

  // Render Current Step Content
  const renderCurrentStep = () => {
    switch (steps[currentStep].id) {
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
      default:
        return <div>Step not found</div>;
    }
  };

  // Progress Calculation
  const getProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  // Main Render Function
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
                <p className="text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF || !cvData.personalInfo.fullName}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-4 w-4" />
                {previewMode ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Step Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CV Sections</h3>
              <nav className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => goToStep(index)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : isCompleted
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${
                        isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{step.title}</p>
                        <p className="text-xs opacity-75 truncate">{step.description}</p>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* CV Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Your Progress</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{cvData.experience.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Education:</span>
                    <span className="font-medium">{cvData.education.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skills:</span>
                    <span className="font-medium">{cvData.skills.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects:</span>
                    <span className="font-medium">{cvData.projects.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certifications:</span>
                    <span className="font-medium">{cvData.certifications.length} items</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-8">
                {renderCurrentStep()}
              </div>

              {/* Navigation Footer */}
              <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between">
                <div>
                  {currentStep > 0 && (
                    <button
                      onClick={prevStep}
                      className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {currentStep < steps.length - 1 ? (
                    <button
                      onClick={nextStep}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleComplete}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Complete CV
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Errors Toast */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Please fix the errors above</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVBuilder;
