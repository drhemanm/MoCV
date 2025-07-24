import React, { useState, useEffect } from 'react';
import { Save, Download, Eye, ArrowLeft, Plus, Trash2, Star, Zap, User, Briefcase, GraduationCap, Award, Globe, FileText, Target, Lightbulb } from 'lucide-react';
import { CVTemplate } from '../types';
import { TargetMarket } from '../types';
import BackButton from './BackButton';
import LTRInput from './LTRInput';
import AIEnhanceButton from './AIEnhanceButton';
import AISuggestionsPanel from './AISuggestionsPanel';
import { generateCVPDF, downloadPDF } from '../services/pdfGenerationService';
import gamificationService from '../services/gamificationService';

interface CVBuilderProps {
  targetMarket: TargetMarket | null;
  selectedTemplate: CVTemplate | null;
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
  }>;
}

const CVBuilder: React.FC<CVBuilderProps> = ({ targetMarket, selectedTemplate, onBack, onChangeTemplate }) => {
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

  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    const autoSave = setTimeout(() => {
      handleSave(true);
    }, 5000);

    return () => clearTimeout(autoSave);
  }, [cvData]);

  const handleSave = async (isAutoSave = false) => {
    if (!isAutoSave) setIsSaving(true);

    try {
      // Create saved CV object
      const savedCV = {
        id: Date.now().toString(),
        title: cvData.personalInfo.fullName || 'Untitled CV',
        templateName: selectedTemplate?.name || 'Default Template',
        templateId: selectedTemplate?.id || 'classic-ats',
        dateCreated: new Date(),
        dateModified: new Date(),
        atsScore: Math.floor(Math.random() * 30) + 70, // Mock ATS score
        status: 'draft' as const,
        cvData: cvData,
        targetMarket: targetMarket?.name
      };

      // Get existing CVs
      const existingCVs = JSON.parse(localStorage.getItem('mocv_saved_cvs') || '[]');
      
      // Check if we're editing an existing CV
      const editingData = localStorage.getItem('mocv_editing_cv');
      if (editingData) {
        const { cvId } = JSON.parse(editingData);
        const existingIndex = existingCVs.findIndex((cv: any) => cv.id === cvId);
        if (existingIndex !== -1) {
          // Update existing CV
          existingCVs[existingIndex] = { ...savedCV, id: cvId, dateCreated: existingCVs[existingIndex].dateCreated };
        } else {
          // Add as new CV
          existingCVs.unshift(savedCV);
        }
      } else {
        // Add as new CV
        existingCVs.unshift(savedCV);
      }

      // Save to localStorage
      localStorage.setItem('mocv_saved_cvs', JSON.stringify(existingCVs));
      
      if (!isAutoSave) {
        setLastSaved(new Date());
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        successMessage.textContent = 'CV saved successfully!';
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Save error:', error);
      if (!isAutoSave) {
        alert('Failed to save CV. Please try again.');
      }
    } finally {
      if (!isAutoSave) setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdfBytes = await generateCVPDF(cvData, selectedTemplate?.id || 'classic-ats');
      const filename = `${cvData.personalInfo.fullName || 'CV'}.pdf`.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      downloadPDF(pdfBytes, filename);
      
      // Award XP for PDF generation
      gamificationService.trackCVCreation();
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

  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
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

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
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

  const removeSkill = (id: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
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

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: <User className="h-5 w-5" /> },
    { id: 'summary', name: 'Summary', icon: <FileText className="h-5 w-5" /> },
    { id: 'experience', name: 'Experience', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'education', name: 'Education', icon: <GraduationCap className="h-5 w-5" /> },
    { id: 'skills', name: 'Skills', icon: <Star className="h-5 w-5" /> },
    { id: 'projects', name: 'Projects', icon: <Target className="h-5 w-5" /> },
    { id: 'certifications', name: 'Certifications', icon: <Award className="h-5 w-5" /> }
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
            onChange={(e) => setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, fullName: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left' }}
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
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left' }}
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
            placeholder="john.doe@email.com"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left' }}
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
            placeholder="+1 (555) 123-4567"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left' }}
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
            placeholder="City, Country"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left' }}
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
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left' }}
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
          placeholder="https://johndoe.com"
          dir="ltr"
          style={{ direction: 'ltr', textAlign: 'left' }}
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
            onTextUpdate={(newText) => setCvData(prev => ({ ...prev, summary: newText }))}
            targetMarket={targetMarket?.name}
            jobTitle={cvData.personalInfo.title}
            size="md"
          />
        </div>
        <LTRInput
          value={cvData.summary}
          onChange={(value) => setCvData(prev => ({ ...prev, summary: value }))}
          placeholder="Write a compelling 2-3 sentence summary highlighting your key achievements, skills, and career objectives..."
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="text-sm text-gray-500 mt-2">
          💡 Include your years of experience, key skills, and what you're looking for in your next role.
        </p>
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

      {cvData.experience.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No work experience added yet</p>
          <button
            onClick={addExperience}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Senior Software Engineer"
                    dir="ltr"
                    style={{ direction: 'ltr', textAlign: 'left' }}
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
                    style={{ direction: 'ltr', textAlign: 'left' }}
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
                    placeholder="New York, NY"
                    dir="ltr"
                    style={{ direction: 'ltr', textAlign: 'left' }}
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
                      disabled={exp.current}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600">Current position</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Description *
                  </label>
                  <AIEnhanceButton
                    text={exp.description}
                    sectionType="experience"
                    onTextUpdate={(newText) => updateExperience(exp.id, 'description', newText)}
                    targetMarket={targetMarket?.name}
                    jobTitle={exp.title}
                  />
                </div>
                <LTRInput
                  value={exp.description}
                  onChange={(value) => updateExperience(exp.id, 'description', value)}
                  placeholder="• Led a team of 5 developers to deliver a customer portal, increasing user satisfaction by 40%&#10;• Implemented microservices architecture reducing system downtime by 60%&#10;• Mentored junior developers and conducted code reviews"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">
                  💡 Use bullet points and include quantifiable achievements (numbers, percentages, dollar amounts).
                </p>
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
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Education
          </button>
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bachelor of Science in Computer Science"
                    dir="ltr"
                    style={{ direction: 'ltr', textAlign: 'left' }}
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
                    style={{ direction: 'ltr', textAlign: 'left' }}
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
                    placeholder="Boston, MA"
                    dir="ltr"
                    style={{ direction: 'ltr', textAlign: 'left' }}
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
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3.8/4.0"
                    dir="ltr"
                    style={{ direction: 'ltr', textAlign: 'left' }}
                  />
                </div>
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
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No skills added yet</p>
          <button
            onClick={addSkill}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="JavaScript"
                  dir="ltr"
                  style={{ direction: 'ltr', textAlign: 'left' }}
                />
                
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
        <h3 className="text-lg font-semibold text-gray-900">Projects (Optional)</h3>
        <button
          onClick={() => {
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
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {cvData.projects.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No projects added yet</p>
          <p className="text-sm text-gray-500 mb-4">Projects help showcase your practical skills and initiative</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.projects.map((project, index) => (
            <div key={project.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Project #{index + 1}</h4>
                <button
                  onClick={() => setCvData(prev => ({
                    ...prev,
                    projects: prev.projects.filter(p => p.id !== project.id)
                  }))}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    projects: prev.projects.map(p =>
                      p.id === project.id ? { ...p, name: e.target.value } : p
                    )
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Project Name"
                  dir="ltr"
                  style={{ direction: 'ltr', textAlign: 'left' }}
                />

                <LTRInput
                  value={project.description}
                  onChange={(value) => setCvData(prev => ({
                    ...prev,
                    projects: prev.projects.map(p =>
                      p.id === project.id ? { ...p, description: value } : p
                    )
                  }))}
                  placeholder="Brief description of the project and your role..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
        <h3 className="text-lg font-semibold text-gray-900">Certifications (Optional)</h3>
        <button
          onClick={() => {
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
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Certification
        </button>
      </div>

      {cvData.certifications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No certifications added yet</p>
          <p className="text-sm text-gray-500 mb-4">Certifications demonstrate your commitment to professional development</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cvData.certifications.map((cert, index) => (
            <div key={cert.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Certification #{index + 1}</span>
                <button
                  onClick={() => setCvData(prev => ({
                    ...prev,
                    certifications: prev.certifications.filter(c => c.id !== cert.id)
                  }))}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    certifications: prev.certifications.map(c =>
                      c.id === cert.id ? { ...c, name: e.target.value } : c
                    )
                  }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="AWS Certified Developer"
                  dir="ltr"
                  style={{ direction: 'ltr', textAlign: 'left' }}
                />
                
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    certifications: prev.certifications.map(c =>
                      c.id === cert.id ? { ...c, issuer: e.target.value } : c
                    )
                  }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Amazon Web Services"
                  dir="ltr"
                  style={{ direction: 'ltr', textAlign: 'left' }}
                />
                
                <input
                  type="month"
                  value={cert.date}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    certifications: prev.certifications.map(c =>
                      c.id === cert.id ? { ...c, date: e.target.value } : c
                    )
                  }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      )}
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
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} label="Back" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">CV Builder</h1>
                <p className="text-sm text-gray-600">
                  {selectedTemplate?.name} • {targetMarket?.name || 'Global'}
                  {lastSaved && (
                    <span className="ml-2 text-green-600">
                      • Saved {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                AI Tips
              </button>
              
              <button
                onClick={() => handleSave(false)}
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
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
                  </button>
                ))}
              </nav>

              {/* Template Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Current Template</h4>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedTemplate?.name}</p>
                  <p className="text-xs mt-1">{selectedTemplate?.category}</p>
                </div>
                <button
                  onClick={onChangeTemplate}
                  className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Change Template
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {sections.find(s => s.id === activeSection)?.name}
                </h2>
                <p className="text-gray-600">
                  {activeSection === 'personal' && 'Enter your contact information and basic details'}
                  {activeSection === 'summary' && 'Write a compelling professional summary that highlights your key achievements'}
                  {activeSection === 'experience' && 'Add your work experience with quantifiable achievements'}
                  {activeSection === 'education' && 'Include your educational background and qualifications'}
                  {activeSection === 'skills' && 'List your technical and soft skills with proficiency levels'}
                  {activeSection === 'projects' && 'Showcase your key projects and technical work'}
                  {activeSection === 'certifications' && 'Add professional certifications and training'}
                </p>
              </div>

              {renderActiveSection()}
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
    </div>
  );
};

export default CVBuilder;