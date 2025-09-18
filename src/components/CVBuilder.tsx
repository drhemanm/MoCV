// src/components/CVBuilder.tsx - Section 1: World-Class CV Builder Setup with PDF Generation
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ArrowLeft, ArrowRight, Save, Download, Eye, CheckCircle, Loader, 
  User, FileText, Briefcase, GraduationCap, Star, Target, Award, 
  Plus, Trash2, Upload, Lightbulb, Brain, RefreshCw, Settings,
  AlertCircle, Info, Zap, Camera, Link, Globe, MapPin, Phone, Mail
} from 'lucide-react';

// Enhanced interfaces for world-class experience
interface CVBuilderProps {
  onBack: () => void;
  targetMarket?: string;
  selectedTemplate?: any;
  initialData?: Partial<CVData>;
}

interface CVData {
  id?: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  references: Reference[];
  additionalSections: AdditionalSection[];
}

interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  github: string;
  portfolio: string;
  photo: string;
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
  skills: string[];
  companyUrl?: string;
  salary?: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  honors?: string[];
  courses?: string[];
  thesis?: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: 'Technical' | 'Soft Skills' | 'Languages' | 'Tools' | 'Frameworks';
  endorsed?: boolean;
  yearsOfExperience?: number;
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
  status: 'Completed' | 'In Progress' | 'Planned';
  teamSize?: number;
  role?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  skills?: string[];
}

interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
  permissionGranted: boolean;
}

interface AdditionalSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'achievements' | 'awards';
  icon?: string;
}

interface ValidationErrors {
  [key: string]: string[];
}

interface AutoSaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  message?: string;
}

const CVBuilder: React.FC<CVBuilderProps> = ({ 
  onBack, 
  targetMarket = 'Global', 
  selectedTemplate,
  initialData 
}) => {
  // Enhanced state management for world-class experience
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      github: '',
      portfolio: '',
      photo: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    references: [],
    additionalSections: [],
    ...initialData
  });

  // Advanced state for enhanced UX
  const [currentStep, setCurrentStep] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>({ status: 'idle' });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop' | 'print'>('desktop');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // World-class sections configuration
  const sections = useMemo(() => [
    { 
      id: 'personal', 
      title: 'Personal Info', 
      icon: <User className="h-5 w-5" />,
      description: 'Your contact details and professional identity',
      required: true,
      estimatedTime: '2 min'
    },
    { 
      id: 'summary', 
      title: 'Professional Summary', 
      icon: <FileText className="h-5 w-5" />,
      description: 'A compelling overview of your career',
      required: true,
      estimatedTime: '3 min'
    },
    { 
      id: 'experience', 
      title: 'Work Experience', 
      icon: <Briefcase className="h-5 w-5" />,
      description: 'Your professional journey and achievements',
      required: true,
      estimatedTime: '5 min'
    },
    { 
      id: 'education', 
      title: 'Education', 
      icon: <GraduationCap className="h-5 w-5" />,
      description: 'Academic background and qualifications',
      required: true,
      estimatedTime: '2 min'
    },
    { 
      id: 'skills', 
      title: 'Skills & Expertise', 
      icon: <Star className="h-5 w-5" />,
      description: 'Technical and soft skills portfolio',
      required: true,
      estimatedTime: '3 min'
    },
    { 
      id: 'projects', 
      title: 'Projects', 
      icon: <Target className="h-5 w-5" />,
      description: 'Showcase your best work and initiatives',
      required: false,
      estimatedTime: '4 min'
    },
    { 
      id: 'certifications', 
      title: 'Certifications', 
      icon: <Award className="h-5 w-5" />,
      description: 'Professional certifications and credentials',
      required: false,
      estimatedTime: '2 min'
    },
    { 
      id: 'references', 
      title: 'References', 
      icon: <User className="h-5 w-5" />,
      description: 'Professional references and recommendations',
      required: false,
      estimatedTime: '3 min'
    }
  ], []);
  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    let totalPoints = 0;
    let earnedPoints = 0;

    // Personal info (25 points)
    totalPoints += 25;
    if (cvData.personalInfo.fullName) earnedPoints += 5;
    if (cvData.personalInfo.email) earnedPoints += 5;
    if (cvData.personalInfo.phone) earnedPoints += 5;
    if (cvData.personalInfo.title) earnedPoints += 5;
    if (cvData.personalInfo.location) earnedPoints += 5;

    // Summary (15 points)
    totalPoints += 15;
    if (cvData.summary && cvData.summary.length > 50) earnedPoints += 15;

    // Experience (25 points)
    totalPoints += 25;
    if (cvData.experience.length > 0) earnedPoints += 10;
    if (cvData.experience.some(exp => exp.description)) earnedPoints += 15;

    // Education (15 points)
    totalPoints += 15;
    if (cvData.education.length > 0) earnedPoints += 15;

    // Skills (10 points)
    totalPoints += 10;
    if (cvData.skills.length >= 3) earnedPoints += 10;

    // Optional sections (10 points)
    totalPoints += 10;
    if (cvData.projects.length > 0) earnedPoints += 3;
    if (cvData.certifications.length > 0) earnedPoints += 3;
    if (cvData.references.length > 0) earnedPoints += 4;

    return Math.round((earnedPoints / totalPoints) * 100);
  }, [cvData]);

  // Update completion percentage when data changes
  useEffect(() => {
    setCompletionPercentage(calculateCompletion());
  }, [calculateCompletion]);

  // Enhanced auto-save with debouncing
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (unsavedChanges) {
        handleAutoSave();
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [cvData, unsavedChanges]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('cvBuilderData');
    if (savedData && !initialData) {
      try {
        const parsed = JSON.parse(savedData);
        setCvData(parsed);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [initialData]);

  // Mark changes as unsaved when data changes
  useEffect(() => {
    setUnsavedChanges(true);
  }, [cvData]);

  // Enhanced auto-save function
  const handleAutoSave = useCallback(async () => {
    setAutoSaveStatus({ status: 'saving' });
    
    try {
      // Save to localStorage
      localStorage.setItem('cvBuilderData', JSON.stringify(cvData));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAutoSaveStatus({ 
        status: 'saved', 
        lastSaved: new Date(),
        message: 'All changes saved'
      });
      setUnsavedChanges(false);
      
    } catch (error) {
      setAutoSaveStatus({ 
        status: 'error', 
        message: 'Failed to save changes'
      });
      console.error('Auto-save failed:', error);
    }
  }, [cvData]);

  // WORKING PDF GENERATION using pdf-lib
  const handleGeneratePDF = useCallback(async () => {
    // Validate required fields
    const errors = validateCV(cvData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setShowValidation(true);
      return;
    }

    setIsGeneratingPDF(true);
    setPdfGenerated(false);

    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      let currentPage = pdfDoc.addPage([595, 842]); // A4 size
      const { width, height } = currentPage.getSize();
      
      // Load fonts
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      let yPosition = height - 50;
      const margin = 50;
      const maxWidth = width - (margin * 2);
      const lineHeight = 14;

      // Helper function to add text with wrapping
      const addText = (text: string, x: number, y: number, options: {
        font?: any;
        size?: number;
        color?: any;
        maxWidth?: number;
        page?: any;
      } = {}) => {
        const {
          font = helveticaFont,
          size = 10,
          color = rgb(0, 0, 0),
          maxWidth: textMaxWidth = maxWidth,
          page = currentPage
        } = options;

        // Simple word wrapping
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const textWidth = font.widthOfTextAtSize(testLine, size);
          
          if (textWidth <= textMaxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          }
        }
        if (currentLine) lines.push(currentLine);

        // Draw the lines
        lines.forEach((line, index) => {
          page.drawText(line, {
            x,
            y: y - (index * lineHeight),
            size,
            font,
            color
          });
        });

        return y - (lines.length * lineHeight);
      };

      // Helper to check if we need a new page
      const checkNewPage = (neededSpace: number) => {
        if (yPosition - neededSpace < 50) {
          currentPage = pdfDoc.addPage([595, 842]);
          yPosition = height - 50;
          return currentPage;
        }
        return currentPage;
      };

      // HEADER with blue background
      currentPage.drawRectangle({
        x: 0,
        y: height - 80,
        width: width,
        height: 80,
        color: rgb(0.16, 0.38, 1), // Blue color
      });

      // Name and title in white
      yPosition = addText(
        cvData.personalInfo.fullName || 'Your Name',
        margin,
        height - 30,
        { font: helveticaBold, size: 18, color: rgb(1, 1, 1) }
      );

      yPosition = addText(
        cvData.personalInfo.title || 'Professional Title',
        margin,
        yPosition - 5,
        { font: helveticaFont, size: 12, color: rgb(1, 1, 1) }
      );

      // Contact info
      const contactInfo = [];
      if (cvData.personalInfo.email) contactInfo.push(`Email: ${cvData.personalInfo.email}`);
      if (cvData.personalInfo.phone) contactInfo.push(`Phone: ${cvData.personalInfo.phone}`);
      if (cvData.personalInfo.location) contactInfo.push(`Location: ${cvData.personalInfo.location}`);

      if (contactInfo.length > 0) {
        yPosition = addText(
          contactInfo.join(' | '),
          margin,
          yPosition - 3,
          { font: helveticaFont, size: 9, color: rgb(1, 1, 1) }
        );
      }

      yPosition = height - 100; // Reset position after header

      // PROFESSIONAL SUMMARY
      if (cvData.summary && cvData.summary.trim()) {
        checkNewPage(40);
        
        // Section header background
        currentPage.drawRectangle({
          x: margin - 5,
          y: yPosition - 5,
          width: maxWidth + 10,
          height: 20,
          color: rgb(0.94, 0.94, 0.94), // Light gray
        });

        yPosition = addText(
          'PROFESSIONAL SUMMARY',
          margin,
          yPosition + 8,
          { font: helveticaBold, size: 12, page: currentPage }
        );

        yPosition = addText(
          cvData.summary,
          margin,
          yPosition - 10,
          { font: helveticaFont, size: 10, page: currentPage }
        );

        yPosition -= 20;
      }

      // WORK EXPERIENCE
      if (cvData.experience && cvData.experience.length > 0) {
        checkNewPage(60);

        // Section header
        currentPage.drawRectangle({
          x: margin - 5,
          y: yPosition - 5,
          width: maxWidth + 10,
          height: 20,
          color: rgb(0.94, 0.94, 0.94),
        });

        yPosition = addText(
          'WORK EXPERIENCE',
          margin,
          yPosition + 8,
          { font: helveticaBold, size: 12, page: currentPage }
        );

        yPosition -= 25;

        cvData.experience.forEach((exp, index) => {
          checkNewPage(50);

          // Job title and company
          const jobHeader = `${exp.title || 'Job Title'}${exp.company ? ` at ${exp.company}` : ''}`;
          yPosition = addText(
            jobHeader,
            margin,
            yPosition,
            { font: helveticaBold, size: 11, page: currentPage }
          );

          // Dates and location
          const dateLocation = [];
          if (exp.startDate || exp.endDate) {
            const endDate = exp.current ? 'Present' : exp.endDate || '';
            dateLocation.push(`${exp.startDate || 'Start'} - ${endDate}`);
          }
          if (exp.location) dateLocation.push(exp.location);

          if (dateLocation.length > 0) {
            yPosition = addText(
              dateLocation.join(' | '),
              margin,
              yPosition - 5,
              { font: helveticaFont, size: 9, color: rgb(0.4, 0.4, 0.4), page: currentPage }
            );
          }

          // Description
          if (exp.description) {
            yPosition = addText(
              exp.description,
              margin,
              yPosition - 8,
              { font: helveticaFont, size: 10, page: currentPage }
            );
          }

          if (index < cvData.experience.length - 1) yPosition -= 15;
        });

        yPosition -= 20;
      }

      // EDUCATION
      if (cvData.education && cvData.education.length > 0) {
        checkNewPage(40);

        currentPage.drawRectangle({
          x: margin - 5,
          y: yPosition - 5,
          width: maxWidth + 10,
          height: 20,
          color: rgb(0.94, 0.94, 0.94),
        });

        yPosition = addText(
          'EDUCATION',
          margin,
          yPosition + 8,
          { font: helveticaBold, size: 12, page: currentPage }
        );

        yPosition -= 25;

        cvData.education.forEach((edu, index) => {
          checkNewPage(30);

          const eduHeader = `${edu.degree || 'Degree'}${edu.school ? ` - ${edu.school}` : ''}`;
          yPosition = addText(
            eduHeader,
            margin,
            yPosition,
            { font: helveticaBold, size: 10, page: currentPage }
          );

          const eduDetails = [];
          if (edu.graduationDate) eduDetails.push(edu.graduationDate);
          if (edu.location) eduDetails.push(edu.location);
          if (edu.gpa) eduDetails.push(`GPA: ${edu.gpa}`);

          if (eduDetails.length > 0) {
            yPosition = addText(
              eduDetails.join(' | '),
              margin,
              yPosition - 5,
              { font: helveticaFont, size: 9, color: rgb(0.4, 0.4, 0.4), page: currentPage }
            );
          }

          if (index < cvData.education.length - 1) yPosition -= 15;
        });

        yPosition -= 20;
      }

      // SKILLS
      if (cvData.skills && cvData.skills.length > 0) {
        checkNewPage(30);

        currentPage.drawRectangle({
          x: margin - 5,
          y: yPosition - 5,
          width: maxWidth + 10,
          height: 20,
          color: rgb(0.94, 0.94, 0.94),
        });

        yPosition = addText(
          'SKILLS',
          margin,
          yPosition + 8,
          { font: helveticaBold, size: 12, page: currentPage }
        );

        yPosition -= 20;

        // Group skills by category
        const skillsByCategory = cvData.skills.reduce((acc, skill) => {
          const category = skill.category || 'Technical';
          if (!acc[category]) acc[category] = [];
          acc[category].push(skill.name);
          return acc;
        }, {} as Record<string, string[]>);

        Object.entries(skillsByCategory).forEach(([category, skills]) => {
          checkNewPage(25);
          
          yPosition = addText(
            `${category}:`,
            margin,
            yPosition,
            { font: helveticaBold, size: 10, page: currentPage }
          );

          yPosition = addText(
            skills.join(', '),
            margin + 5,
            yPosition - 5,
            { font: helveticaFont, size: 10, page: currentPage }
          );

          yPosition -= 10;
        });
      }

      // PROJECTS (if any)
      if (cvData.projects && cvData.projects.length > 0) {
        checkNewPage(30);

        currentPage.drawRectangle({
          x: margin - 5,
          y: yPosition - 5,
          width: maxWidth + 10,
          height: 20,
          color: rgb(0.94, 0.94, 0.94),
        });

        yPosition = addText(
          'PROJECTS',
          margin,
          yPosition + 8,
          { font: helveticaBold, size: 12, page: currentPage }
        );

        yPosition -= 25;

        cvData.projects.forEach((project, index) => {
          checkNewPage(25);

          yPosition = addText(
            project.name || 'Project Name',
            margin,
            yPosition,
            { font: helveticaBold, size: 11, page: currentPage }
          );

          if (project.description) {
            yPosition = addText(
              project.description,
              margin,
              yPosition - 5,
              { font: helveticaFont, size: 10, page: currentPage }
            );
          }

          const projectDetails = [];
          if (project.status) projectDetails.push(`Status: ${project.status}`);
          if (project.github) projectDetails.push(`GitHub: ${project.github}`);
          if (project.link) projectDetails.push(`Demo: ${project.link}`);

          if (projectDetails.length > 0) {
            yPosition = addText(
              projectDetails.join(' | '),
              margin,
              yPosition - 3,
              { font: helveticaFont, size: 9, color: rgb(0.4, 0.4, 0.4), page: currentPage }
            );
          }

          if (index < cvData.projects.length - 1) yPosition -= 15;
        });
      }

      // Generate the PDF
      const pdfBytes = await pdfDoc.save();
      
      // Create download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `${(cvData.personalInfo.fullName || 'CV').replace(/\s+/g, '_')}_${timestamp}.pdf`;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setPdfGenerated(true);
      showSuccessNotification('CV PDF generated successfully!');
      
    } catch (error) {
      console.error('PDF generation error:', error);
      showErrorNotification('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [cvData]);

  // Validation function
  const validateCV = (data: CVData): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    // Personal info validation
    if (!data.personalInfo.fullName.trim()) {
      errors.personalInfo = (errors.personalInfo || []).concat('Full name is required');
    }
    if (!data.personalInfo.email.trim()) {
      errors.personalInfo = (errors.personalInfo || []).concat('Email is required');
    }
    if (data.personalInfo.email && !isValidEmail(data.personalInfo.email)) {
      errors.personalInfo = (errors.personalInfo || []).concat('Invalid email format');
    }
    
    // Summary validation
    if (!data.summary.trim()) {
      errors.summary = ['Professional summary is required'];
    } else if (data.summary.length < 50) {
      errors.summary = ['Summary should be at least 50 characters'];
    }
    
    // Experience validation
    if (data.experience.length === 0) {
      errors.experience = ['At least one work experience is required'];
    }
    
    return errors;
  };

  // Utility functions
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showSuccessNotification = (message: string) => {
    console.log('Success:', message);
    // In a real app, you'd show a toast notification
  };

  const showErrorNotification = (message: string) => {
    console.log('Error:', message);
    // In a real app, you'd show a toast notification
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < sections.length - 1) {
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

  // Enhanced data update functions
  const updateCvData = useCallback((section: keyof CVData, data: any) => {
    setCvData(prev => ({
      ...prev,
      [section]: data
    }));
    setUnsavedChanges(true);
  }, []);

  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
    setUnsavedChanges(true);
  }, []);

  // Professional photo upload with advanced validation
  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Advanced validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const minDimension = 200;

    if (!validTypes.includes(file.type)) {
      showErrorNotification('Please upload a JPEG, PNG, or WebP image');
      return;
    }

    if (file.size > maxSize) {
      showErrorNotification('Image size must be less than 5MB');
      return;
    }

    // Check image dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width < minDimension || img.height < minDimension) {
        showErrorNotification('Image should be at least 200x200 pixels');
        return;
      }

      // Process and compress image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = Math.min(img.width, img.height);
      canvas.width = 400;
      canvas.height = 400;

      if (ctx) {
        // Draw cropped and resized image
        ctx.drawImage(img, 
          (img.width - size) / 2, (img.height - size) / 2, size, size,
          0, 0, 400, 400
        );
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        updatePersonalInfo('photo', dataUrl);
        showSuccessNotification('Photo uploaded successfully');
      }
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }, [updatePersonalInfo]);

  // Experience management functions
  const addExperience = useCallback(() => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
      skills: []
    };
    
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
    setUnsavedChanges(true);
  }, []);

  const updateExperience = useCallback((id: string, field: keyof Experience, value: any) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
    setUnsavedChanges(true);
  }, []);

  const removeExperience = useCallback((id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
    setUnsavedChanges(true);
  }, []);

  // Education management functions
  const addEducation = useCallback(() => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      gpa: '',
      honors: [],
      courses: []
    };
    
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
    setUnsavedChanges(true);
  }, []);

  const updateEducation = useCallback((id: string, field: keyof Education, value: any) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
    setUnsavedChanges(true);
  }, []);

  const removeEducation = useCallback((id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
    setUnsavedChanges(true);
  }, []);

  // Skills management functions
  const addSkill = useCallback(() => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 3,
      category: 'Technical',
      endorsed: false,
      yearsOfExperience: 1
    };
    
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
    setUnsavedChanges(true);
  }, []);

  const updateSkill = useCallback((id: string, field: keyof Skill, value: any) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
    setUnsavedChanges(true);
  }, []);

  const removeSkill = useCallback((id: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
    setUnsavedChanges(true);
  }, []);

  const addBulkSkills = useCallback((skillNames: string[], category: Skill['category'] = 'Technical') => {
    const newSkills: Skill[] = skillNames.map(name => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      level: 3,
      category,
      endorsed: false,
      yearsOfExperience: 1
    }));
    
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, ...newSkills]
    }));
    setUnsavedChanges(true);
  }, []);

  // Projects management functions
  const addProject = useCallback(() => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      status: 'Completed',
      teamSize: 1
    };
    
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
    setUnsavedChanges(true);
  }, []);

  const updateProject = useCallback((id: string, field: keyof Project, value: any) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
    setUnsavedChanges(true);
  }, []);

  const removeProject = useCallback((id: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
    setUnsavedChanges(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleAutoSave();
      }
      
      // Ctrl+P or Cmd+P to generate PDF
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handleGeneratePDF();
      }
      
      // Arrow keys for navigation (when not in input)
      if (e.target === document.body) {
        if (e.key === 'ArrowLeft') prevStep();
        if (e.key === 'ArrowRight') nextStep();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleAutoSave, handleGeneratePDF, prevStep, nextStep]);
  // World-class render functions for each section
  const renderPersonalInfo = () => (
    <div className="space-y-8">
      {/* Professional Photo Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-6">
          <div className="relative">
            {cvData.personalInfo.photo ? (
              <div className="relative">
                <img
                  src={cvData.personalInfo.photo}
                  alt="Professional headshot"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button
                  onClick={() => updatePersonalInfo('photo', '')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200 shadow-lg"
                  title="Remove photo"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-white shadow-lg flex items-center justify-center group hover:from-blue-200 hover:to-indigo-200 transition-all duration-200">
                <Camera className="h-8 w-8 text-gray-500 group-hover:text-blue-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Professional Photo
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Add a high-quality headshot to make a strong first impression. {targetMarket !== 'US' && 'Highly recommended for your target market.'}
            </p>
            
            <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm flex items-center gap-2 w-fit">
              <Upload className="h-4 w-4" />
              {cvData.personalInfo.photo ? 'Change Photo' : 'Upload Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            
            <p className="text-xs text-gray-500 mt-2">
              JPEG, PNG, or WebP. Max 5MB. Square photos work best (400x400px minimum).
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <User className="h-4 w-4 text-blue-600" />
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cvData.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Briefcase className="h-4 w-4 text-blue-600" />
            Professional Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cvData.personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
            placeholder="Senior Software Engineer"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Mail className="h-4 w-4 text-blue-600" />
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={cvData.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
            placeholder="john.smith@email.com"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Phone className="h-4 w-4 text-blue-600" />
            Phone Number
          </label>
          <input
            type="tel"
            value={cvData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <MapPin className="h-4 w-4 text-blue-600" />
            Location
          </label>
          <input
            type="text"
            value={cvData.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
            placeholder="New York, NY"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Link className="h-4 w-4 text-blue-600" />
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={cvData.personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
            placeholder="linkedin.com/in/johnsmith"
          />
        </div>
      </div>

      {/* Additional Links */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Globe className="h-4 w-4 text-blue-600" />
            Website/Portfolio
          </label>
          <input
            type="url"
            value={cvData.personalInfo.website}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
            placeholder="https://johnsmith.dev"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Globe className="h-4 w-4 text-blue-600" />
            GitHub Profile
          </label>
          <input
            type="url"
            value={cvData.personalInfo.github}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
            placeholder="github.com/johnsmith"
          />
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Professional Summary <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600">
              Write a compelling 2-3 sentence overview that highlights your expertise and career goals.
            </p>
          </div>
          
          <button
            onClick={() => setShowAISuggestions(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Brain className="h-4 w-4" />
            AI Enhance
          </button>
        </div>

        <textarea
          value={cvData.summary}
          onChange={(e) => updateCvData('summary', e.target.value)}
          rows={5}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400 resize-none"
          placeholder="Experienced software engineer with 5+ years in full-stack development. Proven track record of leading cross-functional teams and delivering scalable web applications. Seeking to leverage expertise in React and Node.js to drive innovation at a forward-thinking tech company."
        />

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              {cvData.summary.length}/300 characters
            </span>
            {cvData.summary.length >= 50 && (
              <span className="text-green-600 text-xs flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Good length
              </span>
            )}
          </div>
          
          {validationErrors.summary && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationErrors.summary[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            Work Experience <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Add your professional experience with quantifiable achievements
          </p>
        </div>
        
        <button
          onClick={addExperience}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      {cvData.experience.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No work experience added yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Add your professional experience to showcase your career journey
          </p>
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
            <div key={exp.id} className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                  </div>
                  Experience #{index + 1}
                </h4>
                
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="Senior Software Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="Tech Innovations Inc."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="San Francisco, CA"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <div className="space-y-3">
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      disabled={exp.current}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => {
                          updateExperience(exp.id, 'current', e.target.checked);
                          if (e.target.checked) {
                            updateExperience(exp.id, 'endDate', '');
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Currently working here</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Job Description & Achievements <span className="text-red-500">*</span>
                </label>
                
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors resize-none"
                  placeholder="• Led development of customer portal, resulting in 40% increase in user satisfaction&#10;• Implemented microservices architecture, reducing system downtime by 60%&#10;• Mentored 3 junior developers and conducted weekly code reviews"
                />
                
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Use bullet points and include quantifiable achievements (numbers, percentages, dollar amounts)
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
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Education <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Add your educational background and qualifications
          </p>
        </div>
        
        <button
          onClick={addEducation}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </button>
      </div>

      {cvData.education.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No education added yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Add your academic achievements and qualifications
          </p>
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
            <div key={edu.id} className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">{index + 1}</span>
                  </div>
                  Education #{index + 1}
                </h4>
                
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School/University <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="Stanford University"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="Stanford, CA"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="3.8/4.0"
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
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-600" />
            Skills & Expertise <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Showcase your technical and soft skills
          </p>
        </div>
        
        <button
          onClick={addSkill}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </button>
      </div>

      {/* Bulk skill input */}
      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <Zap className="h-4 w-4 text-indigo-600" />
          Quick Add Skills
        </h4>
        <input
          type="text"
          placeholder="Type skills separated by commas (e.g., JavaScript, React, Node.js)"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const input = e.target as HTMLInputElement;
              const skills = input.value.split(',').map(s => s.trim()).filter(s => s);
              if (skills.length > 0) {
                addBulkSkills(skills, 'Technical');
                input.value = '';
              }
            }
          }}
        />
        <p className="text-xs text-gray-500 mt-2">Press Enter to add multiple skills at once</p>
      </div>

      {cvData.skills.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No skills added yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Add your technical and soft skills to showcase your expertise
          </p>
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
            <div key={skill.id} className="bg-white rounded-xl border-2 border-gray-100 p-4 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Skill #{index + 1}</span>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors"
                  placeholder="JavaScript"
                />
                
                <select
                  value={skill.category}
                  onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors"
                >
                  <option value="Technical">Technical</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Languages">Languages</option>
                  <option value="Tools">Tools</option>
                  <option value="Frameworks">Frameworks</option>
                </select>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Proficiency Level: {skill.level}/5
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skill.level}
                      onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(num => (
                        <div key={num} className={`w-2 h-2 rounded-full ${num <= skill.level ? 'bg-blue-600' : 'bg-gray-300'}`} />
                      ))}
                    </div>
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
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Projects (Optional)
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Showcase your best work and personal projects
          </p>
        </div>
        
        <button
          onClick={addProject}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {cvData.projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No projects added yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Projects help demonstrate your practical skills and initiative
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.projects.map((project, index) => (
            <div key={project.id} className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-bold">{index + 1}</span>
                  </div>
                  Project #{index + 1}
                </h4>
                
                <button
                  onClick={() => removeProject(project.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="E-commerce Platform"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={project.status}
                    onChange={(e) => updateProject(project.id, 'status', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors resize-none"
                  placeholder="Built a full-stack e-commerce platform with user authentication, payment processing, and admin dashboard..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Link
                  </label>
                  <input
                    type="url"
                    value={project.github}
                    onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="https://github.com/username/project"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Live Demo
                  </label>
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="https://myproject.com"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderActiveSection = () => {
    const currentSection = sections[currentStep];
    
    switch (currentSection.id) {
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
      case 'references':
        return (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">Section Coming Soon</p>
            <p className="text-gray-500 text-sm">
              {currentSection.title} section will be available in the next update
            </p>
          </div>
        );
      default:
        return <div className="text-center py-8 text-gray-500">Section not found</div>;
    }
  };
  // Main component JSX return
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
              
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-xl font-bold text-gray-900">CV Builder</h1>
                <p className="text-xs text-gray-600">
                  {completionPercentage}% Complete • Target: {targetMarket}
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Auto-save status */}
              <div className="flex items-center gap-2">
                {autoSaveStatus.status === 'saving' && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Saving...</span>
                  </div>
                )}
                {autoSaveStatus.status === 'saved' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Saved</span>
                  </div>
                )}
                {autoSaveStatus.status === 'error' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Error</span>
                  </div>
                )}
              </div>

              {/* Preview mode selector */}
              <select
                value={previewMode}
                onChange={(e) => setPreviewMode(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
                <option value="print">Print</option>
              </select>

              {/* Generate PDF button */}
              <button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF || completionPercentage < 60}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all ${
                  isGeneratingPDF
                    ? 'bg-gray-400 cursor-not-allowed'
                    : completionPercentage < 60
                    ? 'bg-gray-400 cursor-not-allowed'
                    : pdfGenerated
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
                title={completionPercentage < 60 ? 'Complete at least 60% to generate PDF' : ''}
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : pdfGenerated ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Generated
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Generate PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {sections[currentStep].title}
              </h2>
              <p className="text-sm text-gray-600">
                {sections[currentStep].description} • Est. {sections[currentStep].estimatedTime}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {completionPercentage}% Complete
              </div>
              <div className="text-xs text-gray-500">
                Step {currentStep + 1} of {sections.length}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${completionPercentage}%` }}
            >
              {completionPercentage > 15 && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-between">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`flex flex-col items-center cursor-pointer transition-colors ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
                onClick={() => goToStep(index)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 transition-all ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    section.icon
                  )}
                </div>
                <span className="text-xs text-center max-w-16 leading-tight">
                  {section.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            {renderActiveSection()}
          </div>

          {/* Navigation Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {unsavedChanges && (
                    <span className="flex items-center gap-1 text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      Unsaved changes
                    </span>
                  )}
                </div>

                {currentStep < sections.length - 1 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleAutoSave}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all shadow-md hover:shadow-lg"
                    >
                      <Save className="h-4 w-4" />
                      Save & Finish
                    </button>
                    
                    <button
                      onClick={handleGeneratePDF}
                      disabled={isGeneratingPDF}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Errors Modal */}
      {showValidation && Object.keys(validationErrors).length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Validation Errors</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              {Object.entries(validationErrors).map(([section, errors]) => (
                <div key={section}>
                  <h4 className="font-medium text-gray-900 capitalize">{section}:</h4>
                  <ul className="text-sm text-red-600 ml-4">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowValidation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowValidation(false);
                  // Go to first section with errors
                  const firstErrorSection = Object.keys(validationErrors)[0];
                  const sectionIndex = sections.findIndex(s => s.id === firstErrorSection);
                  if (sectionIndex >= 0) {
                    goToStep(sectionIndex);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fix Errors
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-75">
        Ctrl+S to save • Ctrl+P for PDF • ← → to navigate
      </div>
    </div>
  );
};

export default CVBuilder;
