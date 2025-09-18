// src/components/CVBuilder.tsx - Section 1
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Download, FileText, Loader } from 'lucide-react';
import { CVData } from '../types';
import { PDFService } from '../services/pdfService';

interface CVBuilderProps {
  onBack: () => void;
  targetMarket: string;
}

const CVBuilder: React.FC<CVBuilderProps> = ({ onBack, targetMarket }) => {
  // State for current step
  const [currentStep, setCurrentStep] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved');

  // PDF Generation state
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  // CV Data state
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    references: [],
  });

  // Steps configuration
  const steps = [
    { id: 'personal', title: 'Personal Info', description: 'Basic information and contact details' },
    { id: 'summary', title: 'Summary', description: 'Professional summary or objective' },
    { id: 'experience', title: 'Experience', description: 'Work experience and achievements' },
    { id: 'education', title: 'Education', description: 'Educational background' },
    { id: 'skills', title: 'Skills', description: 'Technical and soft skills' },
    { id: 'projects', title: 'Projects', description: 'Notable projects (optional)' },
    { id: 'certifications', title: 'Certifications', description: 'Professional certifications (optional)' },
    { id: 'references', title: 'References', description: 'Professional references (optional)' },
  ];

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      setAutoSaveStatus('saving');
      localStorage.setItem('cvBuilderData', JSON.stringify(cvData));
      setTimeout(() => setAutoSaveStatus('saved'), 500);
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [cvData]);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('cvBuilderData');
    if (savedData) {
      setCvData(JSON.parse(savedData));
    }
  }, []);
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

  // PDF Generation function
  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Validate required fields
      if (!cvData.personalInfo.fullName || !cvData.personalInfo.email) {
        alert('Please fill in at least your full name and email before generating PDF.');
        return;
      }

      // Create PDF service instance
      const pdfService = new PDFService();
      
      // Generate PDF
      const pdfBytes = await pdfService.generateCV(cvData);
      
      // Create download link
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV_${timestamp}.pdf`;
      
      // Download the file
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      URL.revokeObjectURL(url);
      setPdfGenerated(true);
      
      // Show success message
      alert('CV PDF generated successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Save CV to localStorage for later use
  const saveCVData = () => {
    const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
    const cvWithId = {
      ...cvData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      targetMarket,
    };
    
    savedCVs.push(cvWithId);
    localStorage.setItem('savedCVs', JSON.stringify(savedCVs));
  };

  // Update CV data helper function
  const updateCvData = (section: keyof CVData, data: any) => {
    setCvData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  // Add new item helper functions
  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    updateCvData('experience', [...cvData.experience, newExperience]);
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      gpa: '',
    };
    updateCvData('education', [...cvData.education, newEducation]);
  };

  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: '',
      level: 3,
      category: 'Technical' as const,
    };
    updateCvData('skills', [...cvData.skills, newSkill]);
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      startDate: '',
      endDate: '',
    };
    updateCvData('projects', [...cvData.projects, newProject]);
  };

  const addCertification = () => {
    const newCertification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      verificationUrl: '',
    };
    updateCvData('certifications', [...cvData.certifications, newCertification]);
  };

  const addReference = () => {
    const newReference = {
      id: Date.now().toString(),
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
    };
    updateCvData('references', [...cvData.references, newReference]);
  };
  // Render section content based on current step
  const renderSectionContent = () => {
    const currentStepData = steps[currentStep];
    
    switch (currentStepData.id) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.fullName}
                    onChange={(e) => updateCvData('personalInfo', { ...cvData.personalInfo, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.title}
                    onChange={(e) => updateCvData('personalInfo', { ...cvData.personalInfo, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={cvData.personalInfo.email}
                    onChange={(e) => updateCvData('personalInfo', { ...cvData.personalInfo, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john.doe@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => updateCvData('personalInfo', { ...cvData.personalInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.location}
                    onChange={(e) => updateCvData('personalInfo', { ...cvData.personalInfo, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="New York, NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={cvData.personalInfo.linkedin}
                    onChange={(e) => updateCvData('personalInfo', { ...cvData.personalInfo, linkedin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
              <textarea
                value={cvData.summary}
                onChange={(e) => updateCvData('summary', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a compelling professional summary that highlights your key achievements and career objectives..."
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                <button
                  onClick={addExperience}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Experience
                </button>
              </div>
              
              {cvData.experience.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No experience added yet. Click "Add Experience" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cvData.experience.map((exp, index) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => {
                              const updated = cvData.experience.map(item => 
                                item.id === exp.id ? { ...item, title: e.target.value } : item
                              );
                              updateCvData('experience', updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Software Engineer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = cvData.experience.map(item => 
                                item.id === exp.id ? { ...item, company: e.target.value } : item
                              );
                              updateCvData('experience', updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tech Company Inc."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => {
                              const updated = cvData.experience.map(item => 
                                item.id === exp.id ? { ...item, startDate: e.target.value } : item
                              );
                              updateCvData('experience', updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                          <input
                            type="month"
                            value={exp.endDate}
                            disabled={exp.current}
                            onChange={(e) => {
                              const updated = cvData.experience.map(item => 
                                item.id === exp.id ? { ...item, endDate: e.target.value } : item
                              );
                              updateCvData('experience', updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => {
                              const updated = cvData.experience.map(item => 
                                item.id === exp.id ? { ...item, current: e.target.checked, endDate: e.target.checked ? '' : item.endDate } : item
                              );
                              updateCvData('experience', updated);
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600">Currently working here</span>
                        </label>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => {
                            const updated = cvData.experience.map(item => 
                              item.id === exp.id ? { ...item, description: e.target.value } : item
                            );
                            updateCvData('experience', updated);
                          }}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>

                      <button
                        onClick={() => {
                          const updated = cvData.experience.filter(item => item.id !== exp.id);
                          updateCvData('experience', updated);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove Experience
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'education':
      case 'skills':
      case 'projects':
      case 'certifications':
      case 'references':
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Section Coming Soon</h3>
            <p className="text-gray-600">The {currentStepData.title} section is under development.</p>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Section Coming Soon</h3>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
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
                {autoSaveStatus === 'saving' && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Saving...</span>
                  </div>
                )}
              </div>

              {/* Progress indicator */}
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {steps[currentStep].title}
              </h2>
              <span className="text-sm text-gray-500">
                {steps[currentStep].description}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>

            {/* Step indicators */}
            <div className="flex justify-between mt-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs mt-1 text-center max-w-20">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderSectionContent()}

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
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

          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  saveCVData();
                  alert('CV saved successfully!');
                }}
                className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Save CV
              </button>
              
              <button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                  isGeneratingPDF
                    ? 'bg-gray-400 cursor-not-allowed'
                    : pdfGenerated
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : pdfGenerated ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Generated ✓
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Generate PDF
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
