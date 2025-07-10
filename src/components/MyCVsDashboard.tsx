import React, { useState, useEffect } from 'react';
import { FileText, Edit3, Download, Plus, Search, Filter, Calendar, TrendingUp, Eye, Trash2, Copy, Share2, Star, Clock, CheckCircle } from 'lucide-react';
import { SavedCV } from '../types';
import BackButton from './BackButton';

interface MyCVsDashboardProps {
  onBack: () => void;
  onEditCV: (cv: SavedCV) => void;
  onCreateNew: () => void;
}

const MyCVsDashboard: React.FC<MyCVsDashboardProps> = ({ onBack, onEditCV, onCreateNew }) => {
  const [cvs, setCvs] = useState<SavedCV[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'completed' | 'published'>('all');
  const [sortBy, setSortBy] = useState<'dateModified' | 'dateCreated' | 'title' | 'atsScore'>('dateModified');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCVs = async () => {
      setIsLoading(true);
      
      try {
        // Add a small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Load CVs from localStorage
        const savedCVs = localStorage.getItem('mocv_saved_cvs');
        if (savedCVs) {
          try {
            const parsedCVs = JSON.parse(savedCVs).map((cv: any) => ({
              ...cv,
              dateCreated: new Date(cv.dateCreated),
              dateModified: new Date(cv.dateModified)
            }));
            setCvs(parsedCVs);
          } catch (error) {
            console.error('Error parsing saved CVs:', error);
            setCvs([]);
            // Clear corrupted data
            localStorage.removeItem('mocv_saved_cvs');
          }
        } else {
          // Initialize with empty array if no saved CVs
          setCvs([]);
        }
      } catch (error) {
        console.error('Error loading CVs:', error);
        setCvs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCVs();
  }, []);

  // Add some sample CVs for demonstration if none exist
  useEffect(() => {
    // Remove sample data initialization - start clean
  }, [isLoading, cvs.length]);

  // Save CVs to localStorage whenever cvs state changes
  useEffect(() => {
    if (cvs.length > 0 && !isLoading) {
      localStorage.setItem('mocv_saved_cvs', JSON.stringify(cvs));
    }
  }, [cvs, isLoading]);

  const handleEditCV = (cv: SavedCV) => {
    // When editing, we want to load the specific CV data
    if (cv.cvData) {
      // Store the CV data in localStorage for the CV builder to pick up
      localStorage.setItem('mocv_editing_cv', JSON.stringify({
        cvData: cv.cvData,
        cvId: cv.id,
        isEditing: true
      }));
    }
    onEditCV(cv);
  };
      
  const filteredAndSortedCVs = cvs
    .filter(cv => {
      const matchesSearch = cv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cv.templateName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || cv.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateModified':
          return new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime();
        case 'dateCreated':
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'atsScore':
          return b.atsScore - a.atsScore;
        default:
          return 0;
      }
    });

  const getStatusColor = (status: SavedCV['status']) => {
    switch (status) {
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'published': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: SavedCV['status']) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'published': return <Share2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleDownload = (cv: SavedCV) => {
    // Simulate PDF download
    console.log('Downloading CV:', cv.title);
    
    // Create a simple PDF download simulation
    const element = document.createElement('a');
    const file = new Blob([`CV: ${cv.title}\nCreated: ${cv.dateCreated}\nTemplate: ${cv.templateName}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${cv.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDuplicate = (cv: SavedCV) => {
    const duplicatedCV: SavedCV = {
      ...cv,
      id: Date.now().toString(),
      title: `${cv.title} (Copy)`,
      dateCreated: new Date(),
      dateModified: new Date(),
      status: 'draft'
    };
    setCvs(prev => [duplicatedCV, ...prev]);
  };

  const handleDelete = (cvId: string) => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      const updatedCVs = cvs.filter(cv => cv.id !== cvId);
      setCvs(updatedCVs);
      
      // Update localStorage
      if (updatedCVs.length === 0) {
        localStorage.removeItem('mocv_saved_cvs');
      } else {
        localStorage.setItem('mocv_saved_cvs', JSON.stringify(updatedCVs));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your CVs...</p>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} label="Back to Home" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My CVs</h1>
                <p className="text-gray-600">Manage and organize all your CVs in one place</p>
              </div>
            </div>
            <button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              Create New CV
            </button>
          </div>

          {/* Stats - Only show if there are CVs */}
          {cvs.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-900">{cvs.length}</div>
                    <div className="text-sm text-blue-700">Total CVs</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-900">
                      {Math.round(cvs.reduce((sum, cv) => sum + cv.atsScore, 0) / cvs.length)}%
                    </div>
                    <div className="text-sm text-green-700">Avg ATS Score</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-900">
                      {cvs.filter(cv => cv.status === 'completed').length}
                    </div>
                    <div className="text-sm text-purple-700">Completed</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-900">
                      {cvs.filter(cv => cv.status === 'draft').length}
                    </div>
                    <div className="text-sm text-yellow-700">Drafts</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters - Only show if there are CVs */}
          {cvs.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search CVs by title or template..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                  <option value="published">Published</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="dateModified">Last Modified</option>
                  <option value="dateCreated">Date Created</option>
                  <option value="title">Title</option>
                  <option value="atsScore">ATS Score</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CV Grid or Empty State */}
      <div className="container mx-auto px-4 py-8">
        {filteredAndSortedCVs.length === 0 && cvs.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {searchTerm || filterStatus !== 'all' ? 'No CVs found' : 'No CVs created yet'}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria to find your CVs.'
                  : 'You haven\'t created any CVs yet. Start building your professional CV with our AI-powered templates and tools designed specifically for the global job market.'
                }
              </p>
              <div className="space-y-4">
                {searchTerm || filterStatus !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear filters
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onCreateNew}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-3 mx-auto"
                    >
                      <Plus className="h-5 w-5" />
                      Create Your First CV
                    </button>
                    <p className="text-sm text-gray-500">
                      Choose from 10+ professional templates optimized for ATS systems
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : filteredAndSortedCVs.length === 0 && cvs.length > 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No CVs found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCVs.map((cv) => (
              <div
                key={cv.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {/* CV Preview Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">CV Preview</div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cv.status)}`}>
                      {getStatusIcon(cv.status)}
                      {cv.status.charAt(0).toUpperCase() + cv.status.slice(1)}
                    </span>
                  </div>

                  {/* ATS Score Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(cv.atsScore)}`}>
                      <TrendingUp className="h-3 w-3" />
                      {cv.atsScore}%
                    </span>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCV(cv)}
                        className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        title="Edit CV"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(cv)}
                        className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* CV Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{cv.title}</h3>
                      <p className="text-sm text-gray-500">{cv.templateName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {cv.dateModified.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      ATS {cv.atsScore}%
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCV(cv)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Edit3 className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDownload(cv)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                    <div className="relative group">
                      <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="h-3 w-3" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <button
                          onClick={() => handleDuplicate(cv)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Copy className="h-3 w-3" />
                          Duplicate
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Share2 className="h-3 w-3" />
                          Share
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => handleDelete(cv.id)}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCVsDashboard;