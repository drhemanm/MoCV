// src/components/CVBuilder.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, Download, Save, Edit3, Plus, Trash2, ChevronLeft, ChevronRight,
  User, FileText, Briefcase, GraduationCap, Star, Lightbulb, Award,
  MapPin, Mail, Phone, Globe, Calendar, ExternalLink,
  Zap, Target, Palette, Layout, RefreshCw, Share2, Settings,
  CheckCircle, AlertCircle, Info, Copy, Maximize2, Minimize2
} from 'lucide-react';
import { TargetMarket, CVTemplate } from '../types';
import { BackButton } from './BackButton';
import { Button } from './UI/Button';
import { Input } from './UI/Input';
import { Card } from './UI/Card';
import { Modal } from './UI/Modal';

interface CVBuilderProps {
  targetMarket: TargetMarket | null;
  selectedTemplate: CVTemplate | null;
  onBack: () => void;
  onChangeTemplate: () => void;
}

interface FormSection {
  id: string;
  title: string;
  icon: any;
  completed: boolean;
  required: boolean;
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
  achievements: string[];
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  honors?: string[];
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

const CVBuilder: React.FC<CVBuilderProps> = ({
  targetMarket,
  selectedTemplate,
  onBack,
  onChangeTemplate
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showExportModal, setShowExportModal] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  // Form data
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: ''
  });

  const [professionalSummary, setProfessionalSummary] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const autoSaveInterval = useRef<NodeJS.Timeout>();

  // Form sections
  const sections: FormSection[] = [
    { id: 'personal', title: 'Personal Information', icon: User, completed: false, required: true },
    { id: 'summary', title: 'Professional Summary', icon: FileText, completed: false, required: true },
    { id: 'experience', title: 'Work Experience', icon: Briefcase, completed: false, required: true },
    { id: 'education', title: 'Education', icon: GraduationCap, completed: false, required: true },
    { id: 'skills', title: 'Skills', icon: Star, completed: false, required: true },
    { id: 'projects', title: 'Projects', icon: Lightbulb, completed: false, required: false },
    { id: 'certifications', title: 'Certifications', icon: Award, completed: false, required: false }
  ];

  // Auto-save functionality
  useEffect(() => {
    if (autoSave) {
      autoSaveInterval.current = setInterval(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds
    }

    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [autoSave, personalInfo, professionalSummary, experiences, education, skills, projects, certifications]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mocv_current_cv_draft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPersonalInfo(data.personalInfo || personalInfo);
        setProfessionalSummary(data.professionalSummary || '');
        setExperiences(data.experiences || []);
        setEducation(data.education || []);
        setSkills(data.skills || []);
        setProjects(data.projects || []);
        setCertifications(data.certifications || []);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const handleAutoSave = () => {
    if (saveStatus === 'saving') return;
    
    setSaveStatus('saving');
    
    const cvData = {
      personalInfo,
      professionalSummary,
      experiences,
      education,
      skills,
      projects,
      certifications,
      lastSaved: new Date().toISOString()
    };

    setTimeout(() => {
      localStorage.setItem('mocv_current_cv_draft', JSON.stringify(cvData));
      setSaveStatus('saved');
    }, 1000);
  };

  const handleManualSave = () => {
    handleAutoSave();
  };

  // Experience CRUD operations
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    };
    setExperiences([...experiences, newExperience]);
    setSaveStatus('unsaved');
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setExperiences(prev => prev.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
    setSaveStatus('unsaved');
  };

  const removeExperience = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
    setSaveStatus('unsaved');
  };

  // Education CRUD operations
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      gpa: '',
      honors: []
    };
    setEducation([...education, newEducation]);
    setSaveStatus('unsaved');
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setEducation(prev => prev.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
    setSaveStatus('unsaved');
  };

  const removeEducation = (id: string) => {
    setEducation(prev => prev.filter(edu => edu.id !== id));
    setSaveStatus('unsaved');
  };

  // Skills CRUD operations
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 3,
      category: 'Technical'
    };
    setSkills([...skills, newSkill]);
    setSaveStatus('unsaved');
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setSkills(prev => prev.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
    setSaveStatus('unsaved');
  };

  const removeSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
    setSaveStatus('unsaved');
  };

  // Projects CRUD operations
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      github: '',
      startDate: '',
      endDate: ''
    };
    setProjects([...projects, newProject]);
    setSaveStatus('unsaved');
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
    setSaveStatus('unsaved');
  };

  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    setSaveStatus('unsaved');
  };

  // Certifications CRUD operations
  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: ''
    };
    setCertifications([...certifications, newCertification]);
    setSaveStatus('unsaved');
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    setCertifications(prev => prev.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
    setSaveStatus('unsaved');
  };

  const removeCertification = (id: string) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
    setSaveStatus('unsaved');
  };

  // Check section completion
  const checkSectionCompletion = (sectionId: string): boolean => {
    switch (sectionId) {
      case 'personal':
        return !!(personalInfo.fullName && personalInfo.email && personalInfo.phone);
      case 'summary':
        return professionalSummary.length > 50;
      case 'experience':
        return experiences.length > 0 && experiences[0]?.title && experiences[0]?.company;
      case 'education':
        return education.length > 0 && education[0]?.degree && education[0]?.school;
      case 'skills':
        return skills.length >= 3;
      case 'projects':
        return true; // Optional section
      case 'certifications':
        return true; // Optional section
      default:
        return false;
    }
  };

  // Update completion status
  const updatedSections = sections.map(section => ({
    ...section,
    completed: checkSectionCompletion(section.id)
  }));

  const completionPercentage = (updatedSections.filter(s => s.completed).length / updatedSections.filter(s => s.required).length) * 100;

  const renderPersonalInfoSection = () => (
    <Card className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <p className="text-gray-600">Basic contact details and professional identity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name *"
          value={personalInfo.fullName}
          onChange={(e) => {
            setPersonalInfo({...personalInfo, fullName: e.target.value});
            setSaveStatus('unsaved');
          }}
          placeholder="John Doe"
          fullWidth
        />
        <Input
          label="Professional Title *"
          value={personalInfo.title}
          onChange={(e) => {
            setPersonalInfo({...personalInfo, title: e.target.value});
            setSaveStatus('unsaved');
          }}
          placeholder="Software Engineer"
          fullWidth
        />
        <Input
          label="Email Address *"
          type="email"
          value={personalInfo.email}
          onChange={(e) => {
            setPersonalInfo({...personalInfo, email: e.target.value});
            setSaveStatus('unsaved');
          }}
          placeholder="john.doe@email.com"
          icon={<Mail className="h-4 w-4" />}
          fullWidth
        />
        <Input
          label="Phone Number *"
          value={personalInfo.phone}
          onChange={(e) => {
            setPersonalInfo({...personalInfo, phone: e.target.value});
            setSaveStatus('unsaved');
          }}
          placeholder="+1 (555) 123-4567"
          icon={<Phone className="h-4 w-4" />}
          fullWidth
        />
        <Input
          label="Location"
          value={personalInfo.location}
          onChange={(e) => {
            setPersonalInfo({...personalInfo, location: e.target.value});
            setSaveStatus('unsaved');
          }}
          placeholder="New York, NY"
          icon={<MapPin className="h-4 w-4" />}
          fullWidth
        />
        <Input
          label="LinkedIn Profile"
          value={personalInfo.linkedin}
          onChange={(e) => {
            setPersonalInfo({...personalInfo, linkedin: e.target.value});
            setSaveStatus('unsaved');
          }}
          placeholder="linkedin.com/in/johndoe"
          icon={<ExternalLink  className="h-4 w-4" />}
          fullWidth
        />
      </div>
    </Card>
  );

  const renderSummarySection = () => (
    <Card className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <FileText className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Professional Summary</h2>
          <p className="text-gray-600">A compelling overview of your professional background</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary *
          </label>
          <textarea
            value={professionalSummary}
            onChange={(e) => {
              setProfessionalSummary(e.target.value);
              setSaveStatus('unsaved');
            }}
            placeholder={`Write a compelling 2-3 sentence summary highlighting your key qualifications and value proposition${targetMarket ? ` for ${targetMarket.name.toLowerCase()} roles` : ''}...`}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>{professionalSummary.length} characters</span>
            <span>Recommended: 150-300 characters</span>
          </div>
        </div>

        {targetMarket && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Industry Tips for {targetMarket.name}</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Highlight relevant {targetMarket.skillFocus?.[0]?.toLowerCase()} skills</li>
              <li>• Mention experience with {targetMarket.industries?.[0]?.toLowerCase()}</li>
              <li>• Include quantifiable achievements</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );

  const renderExperienceSection = () => (
    <Card className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
            <p className="text-gray-600">Your professional work history and achievements</p>
          </div>
        </div>
        <Button onClick={addExperience} icon={<Plus className="h-4 w-4" />}>
          Add Experience
        </Button>
      </div>

      <div className="space-y-6">
        {experiences.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No work experience added</h3>
            <p className="text-gray-500 mb-4">Add your professional experience to strengthen your CV</p>
            <Button onClick={addExperience} variant="primary">
              Add Your First Experience
            </Button>
          </div>
        ) : (
          experiences.map((exp, index) => (
            <Card key={exp.id} className="p-6 border-l-4 border-l-green-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Experience #{index + 1}</h3>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Job Title *"
                  value={exp.title}
                  onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                  placeholder="Software Engineer"
                  fullWidth
                />
                <Input
                  label="Company *"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Tech Corp"
                  fullWidth
                />
                <Input
                  label="Location"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  placeholder="New York, NY"
                  fullWidth
                />
                <div className="flex gap-4">
                  <Input
                    label="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    fullWidth
                  />
                  {!exp.current && (
                    <Input
                      label="End Date"
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      fullWidth
                    />
                  )}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description & Achievements
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder="Describe your role, responsibilities, and key achievements. Use bullet points and include specific metrics where possible..."
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );

  const renderEducationSection = () => (
    <Card className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Education</h2>
            <p className="text-gray-600">Your academic background and qualifications</p>
          </div>
        </div>
        <Button onClick={addEducation} icon={<Plus className="h-4 w-4" />}>
          Add Education
        </Button>
      </div>

      <div className="space-y-6">
        {education.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No education added</h3>
            <p className="text-gray-500 mb-4">Add your educational background</p>
            <Button onClick={addEducation} variant="primary">
              Add Education
            </Button>
          </div>
        ) : (
          education.map((edu, index) => (
            <Card key={edu.id} className="p-6 border-l-4 border-l-indigo-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Education #{index + 1}</h3>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Degree *"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                  fullWidth
                />
                <Input
                  label="School *"
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  placeholder="University of Technology"
                  fullWidth
                />
                <Input
                  label="Location"
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                  placeholder="Boston, MA"
                  fullWidth
                />
                <Input
                  label="Graduation Date"
                  type="month"
                  value={edu.graduationDate}
                  onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                  fullWidth
                />
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );

  const renderSkillsSection = () => (
    <Card className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Star className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
            <p className="text-gray-600">Technical and soft skills relevant to your field</p>
          </div>
        </div>
        <Button onClick={addSkill} icon={<Plus className="h-4 w-4" />}>
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <Card key={skill.id} className="p-4">
            <Input
              label="Skill Name"
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
              placeholder="JavaScript"
              fullWidth
            />
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proficiency Level: {skill.level}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>
            <button
              onClick={() => removeSkill(skill.id)}
              className="mt-3 text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </Card>
        ))}
        
        {skills.length === 0 && (
          <div className="col-span-full text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Add your professional skills</p>
            <Button onClick={addSkill}>Add First Skill</Button>
          </div>
        )}
      </div>
    </Card>
  );

  const renderProjectsSection = () => (
    <Card className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-pink-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
            <p className="text-gray-600">Notable projects and achievements</p>
          </div>
        </div>
        <Button onClick={addProject} icon={<Plus className="h-4 w-4" />}>
          Add Project
        </Button>
      </div>

      <div className="space-y-6">
        {projects.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects added</h3>
            <p className="text-gray-500 mb-4">Showcase your notable projects and achievements</p>
            <Button onClick={addProject} variant="primary">
              Add Project
            </Button>
          </div>
        ) : (
          projects.map((project, index) => (
            <Card key={project.id} className="p-6 border-l-4 border-l-pink-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Project #{index + 1}</h3>
                <button
                  onClick={() => removeProject(project.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Project Name"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="E-commerce Platform"
                  fullWidth
                />
                <Input
                  label="Project Link"
                  value={project.link || ''}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  placeholder="https://myproject.com"
                  fullWidth
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="Describe your project, your role, and the impact it had..."
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );

  const renderCertificationsSection = () => (
    <Card className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Award className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
            <p className="text-gray-600">Professional certifications and credentials</p>
          </div>
        </div>
        <Button onClick={addCertification} icon={<Plus className="h-4 w-4" />}>
          Add Certification
        </Button>
      </div>

      <div className="space-y-6">
        {certifications.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certifications added</h3>
            <p className="text-gray-500 mb-4">Add your professional certifications</p>
            <Button onClick={addCertification} variant="primary">
              Add Certification
            </Button>
          </div>
        ) : (
          certifications.map((cert, index) => (
            <Card key={cert.id} className="p-6 border-l-4 border-l-orange-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Certification #{index + 1}</h3>
                <button
                  onClick={() => removeCertification(cert.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Certification Name"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder="AWS Solutions Architect"
                  fullWidth
                />
                <Input
                  label="Issuing Organization"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                  fullWidth
                />
                <Input
                  label="Issue Date"
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  fullWidth
                />
                <Input
                  label="Expiry Date (Optional)"
                  type="month"
                  value={cert.expiryDate || ''}
                  onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                  fullWidth
                />
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );

  const renderCurrentSection = () => {
    const sectionId = sections[currentSection]?.id;
    
    switch (sectionId) {
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
      default:
        return (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {sections[currentSection]?.title}
            </h2>
            <p className="text-gray-600">This section is under construction.</p>
          </Card>
        );
    }
  };

  const renderPreview = () => (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-xl text-gray-600 mt-2">{personalInfo.title || 'Professional Title'}</p>
        <div className="flex justify-center gap-4 mt-4 text-sm text-gray-500">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {personalInfo.location}
            </span>
          )}
        </div>
      </div>

      {professionalSummary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{professionalSummary}</p>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            Experience
          </h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.title || 'Job Title'}</h3>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-gray-600 font-medium mb-2">{exp.company || 'Company Name'}</p>
                {exp.description && (
                  <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <h3 className="text-lg font-semibold text-gray-900">{edu.degree || 'Degree'}</h3>
                <p className="text-gray-600">{edu.school || 'School'} • {edu.graduationDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex justify-between items-center">
                <span className="text-gray-700">{skill.name}</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < skill.level ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <h3 className="text-lg font-semibold text-gray-900">{project.name || 'Project Name'}</h3>
                {project.description && (
                  <p className="text-gray-700">{project.description}</p>
                )}
                {project.link && (
                  <p className="text-blue-600 text-sm">{project.link}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            Certifications
          </h2>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <h3 className="text-lg font-semibold text-gray-900">{cert.name || 'Certification Name'}</h3>
                <p className="text-gray-600">{cert.issuer || 'Issuer'} • {cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} variant="minimal" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Template: {selectedTemplate?.name}</span>
                  {targetMarket && <span>• {targetMarket.name}</span>}
                  <span>• {Math.round(completionPercentage)}% Complete</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Save Status */}
              <div className="flex items-center gap-2 text-sm">
                {saveStatus === 'saved' && (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Saved</span>
                  </>
                )}
                {saveStatus === 'saving' && (
                  <>
                    <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                    <span className="text-blue-600">Saving...</span>
                  </>
                )}
                {saveStatus === 'unsaved' && (
                  <>
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-orange-600">Unsaved</span>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                icon={isPreviewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              >
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>

              <Button onClick={handleManualSave} icon={<Save className="h-4 w-4" />}>
                Save
              </Button>

              <Button 
                variant="primary"
                onClick={() => setShowExportModal(true)}
                icon={<Download className="h-4 w-4" />}
              >
                Export
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm text-gray-600">{Math.round(completionPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {isPreviewMode ? (
        <div className="container mx-auto px-4 py-8">
          {renderPreview()}
        </div>
      ) : (
        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-white/60 backdrop-blur-sm border-r border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">CV Sections</h3>
            <div className="space-y-2">
              {updatedSections.map((section, index) => {
                const IconComponent = section.icon;
                const isActive = currentSection === index;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left
                      ${isActive 
                        ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                        : 'hover:bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${section.completed 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }
                    `}>
                      {section.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <IconComponent className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{section.title}</div>
                      {section.required && (
                        <div className="text-xs text-gray-500">Required</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {renderCurrentSection()}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                Previous
              </Button>

              <Button
                onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                disabled={currentSection === sections.length - 1}
                icon={<ChevronRight className="h-4 w-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Your CV"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Export Format</h3>
            <p className="text-gray-600">Select how you'd like to export your CV</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="outline"
              onClick={() => {/* PDF export logic */}}
              icon={<FileText className="h-5 w-5" />}
              fullWidth
            >
              Download as PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => {/* Word export logic */}}
              icon={<FileText className="h-5 w-5" />}
              fullWidth
            >
              Download as Word Document
            </Button>
            <Button
              variant="outline"
              onClick={() => {/* Share logic */}}
              icon={<Share2 className="h-5 w-5" />}
              fullWidth
            >
              Share Link
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CVBuilder;
