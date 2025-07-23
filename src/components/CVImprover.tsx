import React, { useState } from 'react';
import { Wand2, CheckCircle, Edit3, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { CVAnalysis } from '../types';
import { TargetMarket } from '../types';
import BackButton from './BackButton';

interface CVImproverProps {
  targetMarket: TargetMarket | null;
  analysis: CVAnalysis;
  originalCV: string;
  onBack: () => void;
  onCreateNew: () => void;
}

const CVImprover: React.FC<CVImproverProps> = ({ targetMarket, analysis, originalCV, onBack, onCreateNew }) => {
  const [selectedSection, setSelectedSection] = useState<string>('summary');
  const [isImproving, setIsImproving] = useState(false);
  const [improvements, setImprovements] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<'suggestions' | 'rewrite'>('suggestions');

  const sections = [
    { id: 'summary', name: 'Professional Summary', icon: '📝' },
    { id: 'experience', name: 'Work Experience', icon: '💼' },
    { id: 'skills', name: 'Skills', icon: '🛠️' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' },
  ];

  const handleImproveSection = async (sectionId: string) => {
    setIsImproving(true);
    
    // Simulate AI improvement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockImprovements: { [key: string]: string } = {
      summary: `Results-driven Software Engineer with 5+ years of experience developing scalable web applications that serve 100K+ daily users. Proven track record of increasing application performance by 40% and leading cross-functional teams of 8+ developers. Expert in JavaScript, React, and Node.js with strong background in cloud architecture and DevOps practices. Seeking to leverage technical leadership skills and innovation mindset to drive digital transformation at a forward-thinking technology company.`,
      
      experience: `Senior Software Engineer | Tech Corp | 2020-2023
• Led development of microservices architecture, reducing system downtime by 60% and improving scalability for 100K+ concurrent users
• Implemented automated CI/CD pipeline using Docker and Kubernetes, decreasing deployment time from 2 hours to 15 minutes
• Mentored team of 5 junior developers, resulting in 90% retention rate and 25% faster feature delivery
• Architected real-time notification system processing 1M+ events daily with 99.9% uptime

Junior Developer | StartupXYZ | 2018-2020
• Developed responsive web applications using React and Node.js, increasing user engagement by 35%
• Optimized database queries and implemented caching strategies, improving page load times by 50%
• Collaborated with UX team to implement A/B testing framework, leading to 20% increase in conversion rates`,
      
      skills: `**Technical Skills:**
• Programming Languages: JavaScript (Expert), TypeScript (Advanced), Python (Intermediate), Java (Intermediate)
• Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS, Redux, Next.js
• Backend: Node.js, Express, Django, RESTful APIs, GraphQL, Microservices
• Databases: PostgreSQL, MongoDB, Redis, MySQL, Elasticsearch
• Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, Kubernetes, CI/CD, Jenkins, Terraform
• Tools: Git, Jest, Webpack, Jira, Figma, Postman

**Soft Skills:**
• Technical Leadership & Team Management
• Agile/Scrum Methodology & Project Planning
• Cross-functional Collaboration & Communication
• Problem-solving & Critical Thinking`,
      
      achievements: `**Key Achievements:**
• Increased application performance by 40% through code optimization and caching implementation
• Led successful migration of legacy system to cloud infrastructure, reducing operational costs by 30%
• Developed automated testing suite achieving 95% code coverage and reducing bugs by 50%
• Recognized as "Developer of the Year" for outstanding technical contributions and leadership
• Published 3 technical articles on Medium with 10K+ combined views
• Contributed to 5+ open-source projects with 500+ GitHub stars`
    };
    
    setImprovements(prev => ({
      ...prev,
      [sectionId]: mockImprovements[sectionId] || 'Improved content will appear here...'
    }));
    
    setIsImproving(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} label="Back to Analysis" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">CV Improvement Assistant</h1>
                <p className="text-sm text-gray-600">
                  AI-powered suggestions to enhance your CV
                  {targetMarket && ` • Optimized for ${targetMarket.name}`}
                </p>
              </div>
            </div>
            
            <button
              onClick={onCreateNew}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Create New CV
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Sections to Improve</h3>
              
              {/* Tab Switcher */}
              <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'suggestions'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Suggestions
                </button>
                <button
                  onClick={() => setActiveTab('rewrite')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'rewrite'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  AI Rewrite
                </button>
              </div>

              {activeTab === 'suggestions' ? (
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedSection === section.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{section.icon}</span>
                      <span className="text-sm">{section.name}</span>
                      {improvements[section.id] && (
                        <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </nav>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'suggestions' ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Improvement Suggestions</h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3">Quick Wins</h3>
                    <ul className="space-y-2 text-blue-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        Add quantifiable achievements with specific numbers and percentages
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        Include missing keywords: TypeScript, AWS, Docker, Agile, CI/CD
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        Use action verbs like "Led", "Implemented", "Optimized", "Achieved"
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                    <h3 className="font-semibold text-yellow-900 mb-3">Content Improvements</h3>
                    <ul className="space-y-2 text-yellow-800">
                      <li className="flex items-start gap-2">
                        <Edit3 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        Strengthen professional summary with specific metrics and achievements
                      </li>
                      <li className="flex items-start gap-2">
                        <Edit3 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        Add a projects section to showcase technical work
                      </li>
                      <li className="flex items-start gap-2">
                        <Edit3 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        Include certifications and professional development
                      </li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-3">ATS Optimization</h3>
                    <ul className="space-y-2 text-green-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        Use standard section headings like "Professional Experience"
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        Include relevant keywords naturally throughout the content
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        Maintain consistent formatting and avoid complex layouts
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    AI Rewrite: {sections.find(s => s.id === selectedSection)?.name}
                  </h2>
                  <button
                    onClick={() => handleImproveSection(selectedSection)}
                    disabled={isImproving}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isImproving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Improving...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Improve Section
                      </>
                    )}
                  </button>
                </div>

                {improvements[selectedSection] ? (
                  <div className="space-y-6">
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-green-900 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Improved Version
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(improvements[selectedSection])}
                            className="text-green-700 hover:text-green-900 transition-colors flex items-center gap-1 text-sm"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </button>
                          <button
                            onClick={() => handleImproveSection(selectedSection)}
                            className="text-green-700 hover:text-green-900 transition-colors flex items-center gap-1 text-sm"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Regenerate
                          </button>
                        </div>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-green-800 font-sans">
                          {improvements[selectedSection]}
                        </pre>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">What was improved:</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Added specific metrics and quantifiable achievements
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Incorporated missing keywords naturally
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Used stronger action verbs and professional language
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Improved readability and ATS compatibility
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Wand2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">Ready to improve this section</p>
                    <p className="text-sm">Click "Improve Section" to get AI-powered suggestions and rewrites</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVImprover;