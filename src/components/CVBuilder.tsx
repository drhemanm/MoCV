// src/components/CVBuilder.tsx - SECTION 1: Imports, Interfaces & State
import React, { useState, useEffect, useRef } from 'react';
import {
  User, FileText, Briefcase, GraduationCap, Code2, Target, Award, Users,
  Plus, Trash2, Eye, Download, Save, ArrowLeft, ArrowRight, MoreVertical,
  Settings, Sparkles, Bot, RotateCcw, CheckCircle, AlertCircle, ChevronUp,
  Bold, Italic, Underline, Link, List, ListOrdered, AlignLeft, ChevronDown
} from 'lucide-react';

interface CVBuilderProps {
  targetMarket?: any;
  template?: any;
  onComplete?: (cvData: any) => void;
  onBack?: () => void;
  initialData?: any;
}

interface ValidationErrors {
  [key: string]: string;
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
    position: string;
    employer: string;
    city: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    present: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    city: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    present: boolean;
    description: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
  references: Array<{
    id: string;
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
  }>;
}

const CVBuilder: React.FC<CVBuilderProps> = ({
  targetMarket,
  template,
  onComplete,
  onBack,
  initialData
}) => {
  // State management
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
    certifications: [],
    references: []
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Constants and helper data
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const skillLevels = [
    'Beginner',
    'Intermediate', 
    'Advanced',
    'Expert',
    'Native/Fluent'
  ];

  const skillSuggestions = {
    soft: ['Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Adaptability', 'Leadership']
  };

  // Form steps configuration - LEFT PANE NAVIGATION
  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: User,
      description: 'Your basic contact details',
      required: true
    },
    {
      id: 'summary',
      title: 'Professional Summary',
      icon: FileText,
      description: 'Your elevator pitch',
      required: true
    },
    {
      id: 'experience',
      title: 'Employment',
      icon: Briefcase,
      description: 'Your professional journey',
      required: true
    },
    {
      id: 'education',
      title: 'Education',
      icon: GraduationCap,
      description: 'Your academic background',
      required: true
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: Code2,
      description: 'Your technical and soft skills',
      required: true
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: Target,
      description: 'Your notable projects',
      required: false
    },
    {
      id: 'certifications',
      title: 'Certifications',
      icon: Award,
      description: 'Your professional certifications',
      required: false
    },
    {
      id: 'references',
      title: 'References',
      icon: Users,
      description: 'Professional references',
      required: false
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cvData.personalInfo.fullName || cvData.summary) {
        setAutoSaveStatus('saving');
        localStorage.setItem('mocv_draft', JSON.stringify(cvData));
        setTimeout(() => setAutoSaveStatus('saved'), 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [cvData]);

  // Navigation functions
  const nextStep = () => {
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

  // Rich text editor component
  const RichTextEditor = ({ value, onChange, placeholder }: { 
    value: string; 
    onChange: (value: string) => void; 
    placeholder: string;
  }) => (
    <div className="border border-gray-300 rounded-lg">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-0 rounded-t-lg focus:ring-0 focus:outline-none resize-none"
        rows={4}
      />
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-1 text-gray-600 hover:text-gray-800 rounded">
              <Bold className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-600 hover:text-gray-800 rounded">
              <Italic className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-600 hover:text-gray-800 rounded">
              <Underline className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-600 hover:text-gray-800 rounded">
              <Link className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-600 hover:text-gray-800 rounded">
              <List className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-600 hover:text-gray-800 rounded">
              <ListOrdered className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-600 hover:text-gray-800 rounded flex items-center gap-1">
              <AlignLeft className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50">
            <Sparkles className="h-4 w-4" />
            AI Suggestions
          </button>
        </div>
      </div>
    </div>
  );

  // CRUD functions for different sections
  const addSkill = (skillName: string = '') => {
    const newSkill = {
      id: `skill_${Date.now()}`,
      name: skillName,
      level: ''
    };
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: `exp_${Date.now()}`,
      position: '',
      employer: '',
      city: '',
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
      present: false,
      description: ''
    };
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: `edu_${Date.now()}`,
      degree: '',
      school: '',
      city: '',
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
      present: false,
      description: ''
    };
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
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

  const addCertification = () => {
    const newCert = {
      id: `cert_${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      expiryDate: ''
    };
    setCvData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const addReference = () => {
    const newRef = {
      id: `ref_${Date.now()}`,
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: ''
    };
    setCvData(prev => ({
      ...prev,
      references: [...prev.references, newRef]
    }));
  };
  // RIGHT PANE CONTENT - Form for current section
  const renderCurrentStepContent = () => {
    const currentStepData = steps[currentStep];

    switch (currentStepData.id) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <p className="text-gray-600">Your basic contact details</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
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
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Software Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={cvData.personalInfo.email}
                    onChange={(e) => setCvData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => setCvData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="+230 123 4567"
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
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Port Louis, Mauritius"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={cvData.personalInfo.linkedin}
                    onChange={(e) => setCvData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                    }))}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Professional Summary</h2>
                <p className="text-gray-600">Write a compelling summary of your background</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Summary *
                </label>
                <RichTextEditor 
                  value={cvData.summary}
                  onChange={(value) => setCvData(prev => ({ ...prev, summary: value }))}
                  placeholder="Write a compelling 2-3 sentence summary that highlights your experience and value proposition..."
                />
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Employment</h2>
                <p className="text-gray-600">Add your work experience</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employer
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="e.g. Port Louis"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start date
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                          <option value="">Month</option>
                          {months.map((month, index) => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                          <option value="">Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End date
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                          <option value="">Month</option>
                          {months.map((month, index) => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                          <option value="">Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" />
                        <div className="w-12 h-6 bg-gray-200 rounded-full cursor-pointer">
                          <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded-full shadow transform translate-x-0 transition-transform"></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-700">Present</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <RichTextEditor 
                    value=""
                    onChange={() => {}}
                    placeholder="Start typing here..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-5 w-5" />
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Done
                </button>
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                <p className="text-gray-600">Add your educational background</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g. Bachelor of Computer Science"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="University name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="e.g. Reduit"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start date
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                          <option value="">Month</option>
                          {months.map((month, index) => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                          <option value="">Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End date
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                          <option value="">Month</option>
                          {months.map((month, index) => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                          <option value="">Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" />
                        <div className="w-12 h-6 bg-gray-200 rounded-full cursor-pointer">
                          <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded-full shadow transform translate-x-0 transition-transform"></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-700">Present</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <RichTextEditor 
                    value=""
                    onChange={() => {}}
                    placeholder="Start typing here..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-5 w-5" />
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Done
                </button>
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                <p className="text-gray-600">Add your technical and soft skills</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Skills Form */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter skill name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                      <option value="">Make a choice</option>
                      {skillLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-5 w-5" />
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Done
                </button>
              </div>
            </div>

            {/* Skill Suggestions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex flex-wrap gap-3">
                {skillSuggestions.soft.map(skill => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => addSkill()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                Add skill
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50">
                <Sparkles className="h-4 w-4" />
                AI Suggestions
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                <p className="text-gray-600">Showcase your notable projects</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="E-commerce Platform"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Link
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="https://github.com/username/project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies Used
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="React, Node.js, MongoDB, Express"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <RichTextEditor 
                    value=""
                    onChange={() => {}}
                    placeholder="Describe your project, your role, technologies used, and the impact..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-5 w-5" />
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Done
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Plus className="h-4 w-4" />
                Add project
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50">
                <Sparkles className="h-4 w-4" />
                AI Suggestions
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
                <p className="text-gray-600">Add your professional certifications</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certification Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issuing Organization *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Amazon Web Services"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Date *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                          <option value="">Month</option>
                          {months.map((month, index) => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                          <option value="">Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                          <option value="">Month</option>
                          {months.map((month, index) => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                          <option value="">Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-5 w-5" />
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Done
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Plus className="h-4 w-4" />
                Add certification
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50">
                <Sparkles className="h-4 w-4" />
                AI Suggestions
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        );

      case 'references':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">References</h2>
                <p className="text-gray-600">Add professional references</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reference Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Senior Manager"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="ABC Corporation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship
                    </label>
                    <div className="relative">
                      <select className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                        <option value="">Select relationship</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="colleague">Colleague</option>
                        <option value="mentor">Mentor</option>
                        <option value="client">Client</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="+230 123 4567"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-5 w-5" />
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Done
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={addReference}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                Add reference
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50">
                <Sparkles className="h-4 w-4" />
                AI Suggestions
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">CV Builder</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Auto-save status */}
              <div className="flex items-center gap-2">
                {autoSaveStatus === 'saved' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Saved</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => onComplete && onComplete(cvData)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Generate CV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          
          {/* LEFT PANE - Section Navigation */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">CV Sections</h2>
              
              <div className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = (() => {
                    switch (step.id) {
                      case 'personal':
                        return cvData.personalInfo.fullName && cvData.personalInfo.email && cvData.personalInfo.phone;
                      case 'summary':
                        return cvData.summary && cvData.summary.length >= 50;
                      case 'experience':
                        return cvData.experience.length > 0;
                      case 'education':
                        return cvData.education.length > 0;
                      case 'skills':
                        return cvData.skills.length >= 3;
                      case 'projects':
                        return true; // Optional section
                      case 'certifications':
                        return true; // Optional section
                      case 'references':
                        return true; // Optional section
                      default:
                        return false;
                    }
                  })();
                  const isActive = currentStep === index;

                  return (
                    <button
                      key={step.id}
                      onClick={() => goToStep(index)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50'
                          : isCompleted
                          ? 'border-green-200 bg-green-50 hover:bg-green-100'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          isActive
                            ? 'bg-blue-100 text-blue-600'
                            : isCompleted
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            isActive
                              ? 'text-blue-900'
                              : isCompleted
                              ? 'text-green-900'
                              : 'text-gray-900'
                          }`}>
                            {step.title}
                            {step.required && <span className="text-red-500 ml-1">*</span>}
                          </h3>
                          <p className={`text-sm ${
                            isActive
                              ? 'text-blue-600'
                              : isCompleted
                              ? 'text-green-600'
                              : 'text-gray-600'
                          }`}>
                            {step.description}
                          </p>
                          {isCompleted && !isActive && (
                            <div className="flex items-center gap-1 mt-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600">Complete</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
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
                      references: []
                    });
                    setCurrentStep(0);
                    localStorage.removeItem('mocv_draft');
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Form
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANE - Form Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8">
                {/* Current Step Content */}
                {renderCurrentStepContent()}

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                      currentStep === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>

                  {currentStep === steps.length - 1 ? (
                    <button
                      onClick={() => onComplete && onComplete(cvData)}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Complete CV
                    </button>
                  ) : (
                    <button
                      onClick={nextStep}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
