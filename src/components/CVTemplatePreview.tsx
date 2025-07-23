import React from 'react';
import { User, Mail, Phone, MapPin, Globe, Calendar, Award, Briefcase, GraduationCap, Code, Star } from 'lucide-react';

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
  languages: Array<{
    id: string;
    name: string;
    proficiency: string;
  }>;
}

interface CVTemplatePreviewProps {
  templateId: string;
  cvData: CVData;
  className?: string;
}

const CVTemplatePreview: React.FC<CVTemplatePreviewProps> = ({ templateId, cvData, className = '' }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const renderTemplate = () => {
    switch (templateId) {
      case 'classic-professional':
        return <ClassicProfessionalTemplate cvData={cvData} formatDate={formatDate} />;
      case 'modern-minimal':
        return <ModernMinimalTemplate cvData={cvData} formatDate={formatDate} />;
      case 'creative-designer':
        return <CreativeDesignerTemplate cvData={cvData} formatDate={formatDate} />;
      case 'tech-developer':
        return <TechDeveloperTemplate cvData={cvData} formatDate={formatDate} />;
      case 'executive-leader':
        return <ExecutiveLeaderTemplate cvData={cvData} formatDate={formatDate} />;
      case 'academic-researcher':
        return <AcademicResearcherTemplate cvData={cvData} formatDate={formatDate} />;
      case 'startup-entrepreneur':
        return <StartupEntrepreneurTemplate cvData={cvData} formatDate={formatDate} />;
      case 'consulting-analyst':
        return <ConsultingAnalystTemplate cvData={cvData} formatDate={formatDate} />;
      case 'healthcare-professional':
        return <HealthcareProfessionalTemplate cvData={cvData} formatDate={formatDate} />;
      case 'marketing-creative':
        return <MarketingCreativeTemplate cvData={cvData} formatDate={formatDate} />;
      default:
        return <ClassicProfessionalTemplate cvData={cvData} formatDate={formatDate} />;
    }
  };

  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
      <div className="h-full overflow-y-auto">
        {renderTemplate()}
      </div>
    </div>
  );
};

// Template 1: Classic Professional
const ClassicProfessionalTemplate: React.FC<{ cvData: CVData; formatDate: (date: string) => string }> = ({ cvData, formatDate }) => (
  <div className="p-8 max-w-4xl mx-auto bg-white">
    {/* Header */}
    <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {cvData.personalInfo.fullName || 'Your Full Name'}
      </h1>
      <p className="text-xl text-gray-600 mb-4">
        {cvData.personalInfo.title || 'Your Professional Title'}
      </p>
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
            <Globe className="h-4 w-4" />
            LinkedIn
          </div>
        )}
      </div>
    </div>

    {/* Professional Summary */}
    {cvData.summary && (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
          PROFESSIONAL SUMMARY
        </h2>
        <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
      </div>
    )}

    {/* Experience */}
    {cvData.experience.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
          PROFESSIONAL EXPERIENCE
        </h2>
        <div className="space-y-6">
          {cvData.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                  {exp.location && <p>{exp.location}</p>}
                </div>
              </div>
              {exp.description && (
                <div className="text-gray-700 text-sm whitespace-pre-line ml-4">
                  {exp.description}
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
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
          SKILLS
        </h2>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill) => (
            <span key={skill.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {cvData.education.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
          EDUCATION
        </h2>
        <div className="space-y-4">
          {cvData.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-blue-600">{edu.school}</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>{formatDate(edu.graduationDate)}</p>
                {edu.location && <p>{edu.location}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Template 2: Modern Minimal
const ModernMinimalTemplate: React.FC<{ cvData: CVData; formatDate: (date: string) => string }> = ({ cvData, formatDate }) => (
  <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
    {/* Header */}
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <User className="h-12 w-12 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-light mb-2">
            {cvData.personalInfo.fullName || 'Your Full Name'}
          </h1>
          <p className="text-xl text-blue-100 mb-4">
            {cvData.personalInfo.title || 'Your Professional Title'}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
            {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
            {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
          </div>
        </div>
      </div>
    </div>

    <div className="p-8">
      {/* Summary */}
      {cvData.summary && (
        <div className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
          </div>
        </div>
      )}

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            Experience
          </h2>
          <div className="space-y-6">
            {cvData.experience.map((exp, index) => (
              <div key={exp.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 whitespace-pre-line">
                    {exp.description}
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
          <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-blue-600" />
            Skills
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-wrap gap-3">
              {cvData.skills.map((skill) => (
                <span key={skill.id} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

// Template 3: Creative Designer
const CreativeDesignerTemplate: React.FC<{ cvData: CVData; formatDate: (date: string) => string }> = ({ cvData, formatDate }) => (
  <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-full">
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-purple-600 to-pink-600 text-white p-8">
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {cvData.personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-purple-100">
            {cvData.personalInfo.title || 'Creative Professional'}
          </p>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 border-b border-white border-opacity-30 pb-2">
            Contact
          </h3>
          <div className="space-y-3 text-sm">
            {cvData.personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="break-all">{cvData.personalInfo.email}</span>
              </div>
            )}
            {cvData.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{cvData.personalInfo.phone}</span>
              </div>
            )}
            {cvData.personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{cvData.personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 border-b border-white border-opacity-30 pb-2">
              Skills
            </h3>
            <div className="space-y-2">
              {cvData.skills.map((skill) => (
                <div key={skill.id} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>{skill.name}</span>
                    <span>{skill.level * 20}%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${skill.level * 20}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Summary */}
        {cvData.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Creative Vision
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-purple-500">
              <p className="text-gray-700 leading-relaxed italic text-center">
                "{cvData.summary}"
              </p>
            </div>
          </div>
        )}

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Creative Journey
            </h2>
            <div className="space-y-6">
              {cvData.experience.map((exp) => (
                <div key={exp.id} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-purple-600">{exp.title}</h3>
                      <p className="text-gray-600 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Template 4: Tech Developer
const TechDeveloperTemplate: React.FC<{ cvData: CVData; formatDate: (date: string) => string }> = ({ cvData, formatDate }) => (
  <div className="bg-gray-900 text-green-400 font-mono min-h-full">
    {/* Terminal Header */}
    <div className="bg-gray-800 p-4 border-b border-green-500">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="ml-4 text-green-400">developer@portfolio:~$</span>
      </div>
    </div>

    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="text-green-400 mb-4">
          <span className="text-gray-500"># </span>whoami
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {cvData.personalInfo.fullName || 'Developer Name'}
        </h1>
        <p className="text-xl text-green-300 mb-4">
          {cvData.personalInfo.title || 'Full Stack Developer'}
        </p>
        <div className="text-sm space-y-1">
          {cvData.personalInfo.email && (
            <div><span className="text-gray-500">email:</span> {cvData.personalInfo.email}</div>
          )}
          {cvData.personalInfo.phone && (
            <div><span className="text-gray-500">phone:</span> {cvData.personalInfo.phone}</div>
          )}
          {cvData.personalInfo.location && (
            <div><span className="text-gray-500">location:</span> {cvData.personalInfo.location}</div>
          )}
        </div>
      </div>

      {/* Summary */}
      {cvData.summary && (
        <div className="mb-8">
          <div className="text-green-400 mb-4">
            <span className="text-gray-500"># </span>cat about.txt
          </div>
          <div className="bg-gray-800 p-4 rounded border border-green-500">
            <p className="text-gray-300 leading-relaxed">{cvData.summary}</p>
          </div>
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div className="mb-8">
          <div className="text-green-400 mb-4">
            <span className="text-gray-500"># </span>ls -la skills/
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {cvData.skills.map((skill) => (
              <div key={skill.id} className="bg-gray-800 p-2 rounded border border-green-500 text-center">
                <Code className="h-4 w-4 inline mr-2" />
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <div className="mb-8">
          <div className="text-green-400 mb-4">
            <span className="text-gray-500"># </span>git log --oneline
          </div>
          <div className="space-y-4">
            {cvData.experience.map((exp) => (
              <div key={exp.id} className="bg-gray-800 p-4 rounded border border-green-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                    <p className="text-green-300">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-300 text-sm whitespace-pre-line mt-2">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {cvData.projects.length > 0 && (
        <div className="mb-8">
          <div className="text-green-400 mb-4">
            <span className="text-gray-500"># </span>ls projects/
          </div>
          <div className="space-y-4">
            {cvData.projects.map((project) => (
              <div key={project.id} className="bg-gray-800 p-4 rounded border border-green-500">
                <h3 className="text-lg font-bold text-white mb-2">{project.name}</h3>
                <p className="text-gray-300 text-sm mb-2">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-green-600 text-black px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Template 5: Executive Leader
const ExecutiveLeaderTemplate: React.FC<{ cvData: CVData; formatDate: (date: string) => string }> = ({ cvData, formatDate }) => (
  <div className="bg-white min-h-full">
    {/* Header */}
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          {cvData.personalInfo.fullName || 'Executive Name'}
        </h1>
        <p className="text-2xl text-gray-300 mb-4">
          {cvData.personalInfo.title || 'Chief Executive Officer'}
        </p>
        <div className="flex flex-wrap gap-6 text-sm">
          {cvData.personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {cvData.personalInfo.email}
            </div>
          )}
          {cvData.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {cvData.personalInfo.phone}
            </div>
          )}
          {cvData.personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {cvData.personalInfo.location}
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="max-w-6xl mx-auto p-8">
      {/* Executive Summary */}
      {cvData.summary && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-800 pb-2">
            EXECUTIVE SUMMARY
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-800">
            <p className="text-gray-700 leading-relaxed text-lg">{cvData.summary}</p>
          </div>
        </div>
      )}

      {/* Leadership Experience */}
      {cvData.experience.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-800 pb-2">
            LEADERSHIP EXPERIENCE
          </h2>
          <div className="space-y-8">
            {cvData.experience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-gray-300 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                    <p className="text-lg text-gray-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-gray-600">
                    <p className="font-medium">{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Competencies */}
      {cvData.skills.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-800 pb-2">
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cvData.skills.map((skill) => (
              <div key={skill.id} className="bg-gray-100 p-3 rounded-lg text-center">
                <span className="font-medium text-gray-800">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-800 pb-2">
            EDUCATION & CREDENTIALS
          </h2>
          <div className="space-y-4">
            {cvData.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.school}</p>
                </div>
                <div className="text-right text-gray-600">
                  <p>{formatDate(edu.graduationDate)}</p>
                  {edu.location && <p>{edu.location}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Template 6: Academic Researcher
const AcademicResearcherTemplate: React.FC<{ cvData: CVData; formatDate: (date: string) => string }> = ({ cvData, formatDate }) => (
  <div className="bg-white min-h-full">
    {/* Header */}
    <div className="text-center border-b-2 border-blue-800 pb-6 mb-8 p-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-2">
        {cvData.personalInfo.fullName || 'Dr. Academic Name'}
      </h1>
      <p className="text-xl text-blue-700 mb-4">
        {cvData.personalInfo.title || 'Research Professor'}
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
        {cvData.personalInfo.email && (
          <span>{cvData.personalInfo.email}</span>
        )}
        {cvData.personalInfo.phone && (
          <span>{cvData.personalInfo.phone}</span>
        )}
        {cvData.personalInfo.location && (
          <span>{cvData.personalInfo.location}</span>
        )}
      </div>
    </div>

    <div className="max-w-4xl mx-auto p-8">
      {/* Research Interests */}
      {cvData.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">
            RESEARCH INTERESTS
          </h2>
          <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
        </div>
      )}

      {/* Academic Positions */}
      {cvData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">
            ACADEMIC APPOINTMENTS
          </h2>
          <div className="space-y-6">
            {cvData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-blue-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 text-sm whitespace-pre-line ml-4">
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
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">
            EDUCATION
          </h2>
          <div className="space-y-4">
            {cvData.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-blue-700">{edu.school}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{formatDate(edu.graduationDate)}</p>
                  {edu.location && <p>{edu.location}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research Skills */}
      {cvData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">
            RESEARCH SKILLS & METHODOLOGIES
          </h2>
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill) => (
              <span key={skill.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Publications/Projects */}
      {cvData.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">
            SELECTED PUBLICATIONS & PROJECTS
          </h2>
          <div className="space-y-4">
            {cvData.projects.map((project, index) => (
              <div key={project.id}>
                <p className="text-gray-700">
                  <span className="font-medium">{index + 1}.</span> {project.name}. <em>{project.description}</em>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Template 7: Startup Entrepreneur
const StartupEntrepreneurTemplate: React.FC<{ cvData: CVData; formatDate: (date: string) => string }> = ({ cvData, formatDate }) => (
  <div className="bg-gradient-to-br from-orange-50 to-red-50 min-h-full">
    {/* Header */}
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-2">
          {cvData.personalInfo.fullName || 'Entrepreneur Name'}
        </h1>
        <p className="text-2xl text-orange-100 mb-4">
          {cvData.personalInfo.title || 'Startup Founder & Innovator'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
          {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
          {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
        </div>
      </div>
    </div>

    <div className="max-w-4xl mx-auto p-8">
      {/* Vision Statement */}
      {cvData.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">
            🚀 Vision & Mission
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-orange-500">
            <p className="text-gray-700 leading-relaxed text-center italic text-lg">
              "{cvData.summary}"
            </p>
          </div>
        </div>
      )}

      {/* Entrepreneurial Journey */}
      {cvData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
            🎯 Entrepreneurial Journey
          </h2>
          <div className="space-y-6">
            {cvData.experience.map((exp, index) => (
              <div key={exp.id} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                        <p className="text-orange-600 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-gray-700 whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Skills */}
      {cvData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
            💪 Core Competencies
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex flex-wrap gap-3 justify-center">
              {cvData.skills.map((skill) => (
                <span key={skill.id} className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-2 rounded-full font-medium">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ventures & Projects */}
      {cvData.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
            🏢 Ventures & Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {cvData.projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Template 8: Consulting Analyst
const ConsultingAnalystTemplate: React.FC<{ cvData: CVData; formatDate: (date: string) => string }> = ({ cvData, formatDate }) => (
  <div className="bg-white min-h-full">
    {/* Header */}
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          {cvData.personalInfo.fullName || 'Consultant Name'}
        </h1>
        <p className="text-xl text-blue-200 mb-4">
          {cvData.personalInfo.title || 'Management Consultant'}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {cvData.personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="truncate">{cvData.personalInfo.email}</span>
            </div>
          )}
          {cvData.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {cvData.personalInfo.phone}
            </div>
          )}
          {cvData.personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {cvData.personalInfo.location}
            </div>
          )}
          {cvData.personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              LinkedIn
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="max-w-4xl mx-auto p-8">
      {/* Professional Summary */}
      {cvData.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            PROFESSIONAL SUMMARY
          </h2>
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
            <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
          </div>
        </div>
      )}

      {/* Consulting Experience */}
      {cvData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            CONSULTING EXPERIENCE
          </h2>
          <div className="space-y-6">
            {cvData.experience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-blue-300 pl-6 pb-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                    <p className="text-blue-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p className="font-medium">{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Competencies */}
      {cvData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5" />
            CORE COMPETENCIES
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cvData.skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            EDUCATION
          </h2>
          <div className="space-y-4">
            {cvData.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start bg-gray-50 p-4 rounded-lg">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-blue-700">{edu.school}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{formatDate(edu.graduationDate)}</p>
                  {edu.location && <p>{edu.location}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {cvData.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            CERTIFICATIONS
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {cvData.certifications.map((cert) => (
              <div key={cert.id} className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900">{cert.name}</h3>
                <p className="text-blue-700 text-sm">{cert.issuer}</p>
                <p className="text-gray-600 text-sm">{formatDate(cert.date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Template 9: Healthcare Professional
const HealthcareProfessionalTemplate: React.FC<{ cvData: CVData; formatDate: (date: string) => string }> = ({ cvData, formatDate }) => (
  <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-full">
    {/* Header */}
    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">
          {cvData.personalInfo.fullName || 'Dr. Healthcare Professional'}
        </h1>
        <p className="text-xl text-green-100 mb-4">
          {cvData.personalInfo.title || 'Medical Professional'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
          {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
          {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
        </div>
      </div>
    </div>

    <div className="max-w-4xl mx-auto p-8">
      {/* Professional Philosophy */}
      {cvData.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
            Professional Philosophy
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-green-500">
            <p className="text-gray-700 leading-relaxed text-center">{cvData.summary}</p>
          </div>
        </div>
      )}

      {/* Clinical Experience */}
      {cvData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            Clinical Experience
          </h2>
          <div className="space-y-6">
            {cvData.experience.map((exp) => (
              <div key={exp.id} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                    <p className="text-green-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medical Education */}
      {cvData.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            Medical Education
          </h2>
          <div className="space-y-4">
            {cvData.education.map((edu) => (
              <div key={edu.id} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-green-600">{edu.school}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{formatDate(edu.graduationDate)}</p>
                    {edu.location && <p>{edu.location}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specializations & Skills */}
      {cvData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            Specializations & Clinical Skills
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex flex-wrap gap-3">
              {cvData.skills.map((skill) => (
                <span key={skill.id} className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-full font-medium">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certifications & Licenses */}
      {cvData.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            Certifications & Licenses
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {cvData.certifications.map((cert) => (
              <div key={cert.id} className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-green-400">
                <h3 className="font-bold text-gray-900">{cert.name}</h3>
                <p className="text-green-600 text-sm">{cert.issuer}</p>
                <p className="text-gray-600 text-sm">{formatDate(cert.date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Template 10: Marketing Creative
const MarketingCreativeTemplate: React.FC<{ cvData: CVData; formatDate: (date: string) => string }> = ({ cvData, formatDate }) => (
  <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-full">
    {/* Header */}
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-90"></div>
      <div className="relative z-10 text-white p-8 text-center">
        <h1 className="text-4xl font-bold mb-2">
          {cvData.personalInfo.fullName || 'Creative Professional'}
        </h1>
        <p className="text-2xl text-pink-100 mb-4">
          {cvData.personalInfo.title || 'Marketing Creative'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
          {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
          {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
        </div>
      </div>
    </div>

    <div className="max-w-4xl mx-auto p-8">
      {/* Creative Vision */}
      {cvData.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">
            ✨ Creative Vision
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-purple-500 relative">
            <div className="absolute top-4 right-4 text-purple-200">
              <Star className="h-8 w-8" />
            </div>
            <p className="text-gray-700 leading-relaxed text-center italic text-lg">
              "{cvData.summary}"
            </p>
          </div>
        </div>
      )}

      {/* Creative Experience */}
      {cvData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
            🎨 Creative Journey
          </h2>
          <div className="space-y-6">
            {cvData.experience.map((exp, index) => (
              <div key={exp.id} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-200 rounded-bl-full opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                      <p className="text-purple-600 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Creative Skills */}
      {cvData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
            🚀 Creative Arsenal
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex flex-wrap gap-3 justify-center">
              {cvData.skills.map((skill, index) => {
                const colors = [
                  'from-pink-400 to-red-400',
                  'from-purple-400 to-pink-400',
                  'from-indigo-400 to-purple-400',
                  'from-blue-400 to-indigo-400',
                  'from-green-400 to-blue-400'
                ];
                const colorClass = colors[index % colors.length];
                return (
                  <span key={skill.id} className={`bg-gradient-to-r ${colorClass} text-white px-4 py-2 rounded-full font-medium transform hover:scale-105 transition-transform`}>
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Creative Projects */}
      {cvData.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
            💡 Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {cvData.projects.map((project, index) => (
              <div key={project.id} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
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
          <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
            🎓 Creative Education
          </h2>
          <div className="space-y-4">
            {cvData.education.map((edu) => (
              <div key={edu.id} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-purple-600">{edu.school}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{formatDate(edu.graduationDate)}</p>
                    {edu.location && <p>{edu.location}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default CVTemplatePreview;