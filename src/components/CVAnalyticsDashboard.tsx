// src/components/CVAnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Eye, Download, Send, Calendar,
  MapPin, Briefcase, Clock, Users, Target, Award, Zap,
  ArrowUp, ArrowDown, RefreshCw, Filter, Search, Share,
  FileText, CheckCircle, AlertCircle, Star, Globe
} from 'lucide-react';
import { AnimatedCounter } from './ui/AnimatedCounter';

interface ApplicationData {
  id: string;
  company: string;
  position: string;
  location: string;
  appliedDate: string;
  status: 'applied' | 'viewed' | 'interviewed' | 'offered' | 'rejected';
  cvVersion: string;
  source: string;
  salary?: number;
  responseTime?: number; // days
}

interface AnalyticsData {
  totalApplications: number;
  cvViews: number;
  interviewRate: number;
  responseRate: number;
  averageSalary: number;
  topSkillsInDemand: Array<{ skill: string; demand: number; growth: number }>;
  applicationsByMonth: Array<{ month: string; applications: number; interviews: number }>;
  applicationsByLocation: Array<{ location: string; count: number; successRate: number }>;
  industryBreakdown: Array<{ industry: string; applications: number; successRate: number }>;
  cvPerformance: Array<{ version: string; applications: number; responseRate: number; atsScore: number }>;
}

export const CVAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'performance' | 'insights'>('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data
    const mockData: AnalyticsData = {
      totalApplications: 47,
      cvViews: 156,
      interviewRate: 23.4,
      responseRate: 68.1,
      averageSalary: 82500,
      topSkillsInDemand: [
        { skill: 'React', demand: 95, growth: 12 },
        { skill: 'Python', demand: 88, growth: 8 },
        { skill: 'AWS', demand: 82, growth: 15 },
        { skill: 'Docker', demand: 76, growth: 18 },
        { skill: 'TypeScript', demand: 74, growth: 22 }
      ],
      applicationsByMonth: [
        { month: 'Jan', applications: 8, interviews: 2 },
        { month: 'Feb', applications: 12, interviews: 3 },
        { month: 'Mar', applications: 15, interviews: 4 },
        { month: 'Apr', applications: 12, interviews: 2 }
      ],
      applicationsByLocation: [
        { location: 'San Francisco', count: 18, successRate: 28 },
        { location: 'New York', count: 15, successRate: 22 },
        { location: 'Austin', count: 8, successRate: 35 },
        { location: 'Remote', count: 6, successRate: 45 }
      ],
      industryBreakdown: [
        { industry: 'Technology', applications: 25, successRate: 32 },
        { industry: 'Finance', applications: 12, successRate: 18 },
        { industry: 'Healthcare', applications: 6, successRate: 28 },
        { industry: 'E-commerce', applications: 4, successRate: 45 }
      ],
      cvPerformance: [
        { version: 'Tech-focused v2.1', applications: 23, responseRate: 74, atsScore: 87 },
        { version: 'Generic v1.8', applications: 15, responseRate: 56, atsScore: 72 },
        { version: 'Leadership v2.0', applications: 9, responseRate: 82, atsScore: 91 }
      ]
    };

    const mockApplications: ApplicationData[] = [
      {
        id: '1',
        company: 'TechCorp Inc.',
        position: 'Senior Full Stack Developer',
        location: 'San Francisco, CA',
        appliedDate: '2024-01-15',
        status: 'interviewed',
        cvVersion: 'Tech-focused v2.1',
        source: 'LinkedIn',
        salary: 120000,
        responseTime: 3
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'React Developer',
        location: 'Remote',
        appliedDate: '2024-01-18',
        status: 'viewed',
        cvVersion: 'Tech-focused v2.1',
        source: 'Indeed',
        salary: 95000,
        responseTime: 7
      }
      // Add more mock applications...
    ];

    setAnalyticsData(mockData);
    setApplications(mockApplications);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'offered': return 'bg-green-100 text-green-800';
      case 'interviewed': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-yellow-100 text-yellow-800';
      case 'applied': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'offered': return <Award className="h-4 w-4" />;
      case 'interviewed': return <Users className="h-4 w-4" />;
      case 'viewed': return <Eye className="h-4 w-4" />;
      case 'applied': return <Send className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number | string;
    change?: number;
    icon: React.ReactNode;
    format?: 'number' | 'percentage' | 'currency';
    color?: string;
  }> = ({ title, value, change, icon, format = 'number', color = 'blue' }) => {
    const formatValue = (val: number | string) => {
      if (typeof val === 'string') return val;
      
      switch (format) {
        case 'percentage': return `${val}%`;
        case 'currency': return `$${val.toLocaleString()}`;
        default: return val.toLocaleString();
      }
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className={`text-3xl font-bold text-${color}-600 mt-1`}>
              {typeof value === 'number' ? (
                <AnimatedCounter 
                  from={0} 
                  to={value} 
                  prefix={format === 'currency' ? '$' : ''}
                  suffix={format === 'percentage' ? '%' : ''}
                />
              ) : (
                value
              )}
            </p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                <span>{Math.abs(change)}% vs last {timeRange}</span>
              </div>
            )}
          </div>
          <div className={`p-3 bg-${color}-100 rounded-lg`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Career Analytics</h1>
            <p className="text-gray-600 mt-1">Track your job application performance and career insights</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              {['week', 'month', 'quarter', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'applications', label: 'Applications', icon: Send },
            { id: 'performance', label: 'CV Performance', icon: TrendingUp },
            { id: 'insights', label: 'Market Insights', icon: Target }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {analyticsData && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Applications"
                    value={analyticsData.totalApplications}
                    change={12}
                    icon={<Send className="h-6 w-6" />}
                    color="blue"
                  />
                  <StatCard
                    title="CV Views"
                    value={analyticsData.cvViews}
                    change={8}
                    icon={<Eye className="h-6 w-6" />}
                    color="green"
                  />
                  <StatCard
                    title="Interview Rate"
                    value={analyticsData.interviewRate}
                    change={5}
                    icon={<Users className="h-6 w-6" />}
                    format="percentage"
                    color="purple"
                  />
                  <StatCard
                    title="Response Rate"
                    value={analyticsData.responseRate}
                    change={-2}
                    icon={<CheckCircle className="h-6 w-6" />}
                    format="percentage"
                    color="orange"
                  />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Applications by Month */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trends</h3>
                    <div className="space-y-4">
                      {analyticsData.applicationsByMonth.map((data, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-600">{data.month}</span>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">{data.applications} applied</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">{data.interviews} interviews</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Skills in Demand */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills in Demand</h3>
                    <div className="space-y-4">
                      {analyticsData.topSkillsInDemand.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{skill.skill}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">{skill.demand}%</span>
                              <div className={`flex items-center gap-1 text-xs ${
                                skill.growth >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {skill.growth >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                {skill.growth}%
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${skill.demand}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location & Industry Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Applications by Location */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Location</h3>
                    <div className="space-y-3">
                      {analyticsData.applicationsByLocation.map((location, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{location.location}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{location.count} applications</div>
                            <div className="text-xs text-green-600">{location.successRate}% success rate</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Industry Breakdown */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Breakdown</h3>
                    <div className="space-y-3">
                      {analyticsData.industryBreakdown.map((industry, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{industry.industry}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{industry.applications} applications</div>
                            <div className="text-xs text-blue-600">{industry.successRate}% success rate</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search companies, positions..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="h-4 w-4" />
                      Filter
                    </button>
                  </div>
                </div>

                {/* Applications List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {applications.map((application) => (
                      <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-medium text-gray-900">{application.position}</h4>
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                {getStatusIcon(application.status)}
                                {application.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{application.company}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {application.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(application.appliedDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Globe className="h-4 w-4" />
                                {application.source}
                              </div>
                              {application.salary && (
                                <div className="flex items-center gap-1">
                                  <span>$</span>
                                  {application.salary.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                              <Share className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CV Performance Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">CV Version Performance</h3>
                  <div className="space-y-4">
                    {analyticsData.cvPerformance.map((cv, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">{cv.version}</h4>
                          <span className="text-sm text-gray-500">{cv.applications} applications</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Response Rate</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${cv.responseRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{cv.responseRate}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">ATS Score</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${cv.atsScore}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{cv.atsScore}/100</span>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Market Insights Tab */}
            {activeTab === 'insights' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Market Trends</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-800">Remote Work Demand</span>
                        <span className="text-blue-900 font-semibold">↑ 23%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-800">Full-stack Roles</span>
                        <span className="text-blue-900 font-semibold">↑ 18%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-800">AI/ML Positions</span>
                        <span className="text-blue-900 font-semibold">↑ 45%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">Recommendations</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-green-800">Update your skills section with trending technologies</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-green-800">Focus on remote-friendly companies for better response rates</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-green-800">Consider expanding to fintech and healthtech sectors</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
