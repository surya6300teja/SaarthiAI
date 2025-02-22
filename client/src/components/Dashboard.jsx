import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  UserCircleIcon,
  SparklesIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  PencilIcon,
  EyeIcon,
  DocumentPlusIcon,
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import AnalyticsDashboard from './Analytics/AnalyticsDashboard';
import JobApplicationForm from './JobTracker/JobApplicationForm';
import JobApplicationsList from './JobTracker/JobApplicationsList';
import { getJobApplications, addJobApplication, deleteJobApplication } from '../services/jobApplicationService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' or 'jobs'

  useEffect(() => {
    fetchUserData();
    fetchApplications();
  }, []);

  const fetchUserData = async () => {
    try {
      setError(null);
      const response = await api.get('/auth/user-profile');
      if (response.data.success) {
        setUserData(response.data.user);
      } else {
        setError(response.data.error || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getJobApplications();
      console.log('Fetched applications:', data); // For debugging
      setApplications(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleEditResume = async () => {
    try {
      const response = await api.get(`/auth/resume/${userData._id}/edit`);
      if (response.data.success) {
        // Store resume data in localStorage for the resume builder
        localStorage.setItem('resumeData', JSON.stringify(response.data.resumeData));
        navigate('/dashboard/resume-builder', { 
          state: { resumeData: response.data.resumeData }
        });
      }
    } catch (error) {
      console.error('Error fetching resume data:', error);
      alert('Failed to load resume data. Please try again.');
    }
  };

  const handleViewResume = () => {
    // Open resume in new tab
    window.open(`/api/v1/auth/resume/${userData._id}/view`, '_blank');
  };

  const handleAnalyticsClick = () => {
    setShowAnalytics(true);
  };

  const handleAnalyticsClose = () => {
    setShowAnalytics(false);
  };

  const handleAddApplication = async (applicationData) => {
    try {
      const newApplication = await addJobApplication(applicationData);
      setApplications(prevApplications => [newApplication, ...prevApplications]);
      toast.success('Application added successfully');
      setShowApplicationForm(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add application');
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await deleteJobApplication(id);
      setApplications(prevApplications => 
        prevApplications.filter(app => app._id !== id)
      );
      toast.success('Application deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete application');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUserData}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If user has no resume or portfolio
  if (!userData?.resume?.pdf?.data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome, {userData?.name}!
          </h1>
          <p className="text-lg text-gray-600">
            Let's get started by creating your professional profile
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Build Resume Card */}
          <Link
            to="/dashboard/resume-builder"
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <DocumentTextIcon className="h-12 w-12 text-blue-600" />
              <SparklesIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Build Your Resume with AI
            </h2>
            <p className="text-gray-600 mb-4">
              Create a professional resume in minutes with our AI-powered builder
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              Get Started <ArrowRightIcon className="h-4 w-4 ml-2" />
            </div>
          </Link>

          {/* Build Portfolio Card */}
          <Link
            to="/portfolio-builder"
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <UserCircleIcon className="h-12 w-12 text-purple-600" />
              <PlusCircleIcon className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Create Your Portfolio
            </h2>
            <p className="text-gray-600 mb-4">
              Showcase your work and achievements with a personalized portfolio
            </p>
            <div className="flex items-center text-purple-600 font-medium">
              Get Started <ArrowRightIcon className="h-4 w-4 ml-2" />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // If user has resume and/or portfolio
  return (
    <div className="min-h-screen bg-white">
      {showAnalytics ? (
        <AnalyticsDashboard 
          onClose={handleAnalyticsClose} 
          applications={applications}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('resume')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'resume'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Resume Builder
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'jobs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Job Applications
              </button>
            </nav>
          </div>

          {activeTab === 'jobs' ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Job Applications</h1>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setShowApplicationForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Application
                  </button>
                  <button 
                    onClick={() => setShowAnalytics(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
                  >
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    View Analytics
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <JobApplicationsList 
                  applications={applications}
                  onDelete={handleDeleteApplication}
                  onEdit={() => {}} // Implement edit functionality if needed
                />
              )}

              {showApplicationForm && (
                <JobApplicationForm
                  onSubmit={handleAddApplication}
                  onClose={() => setShowApplicationForm(false)}
                />
              )}
            </>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Resume Section */}
              <div className="md:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Your Resume</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Last updated: {new Date(userData.resume.lastUpdated).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-3">
                        <Link
                          to="/resume-builder"
                          className="text-gray-600 hover:text-blue-600 font-medium flex items-center transition-colors duration-150"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => window.open(`/api/v1/auth/resume/${userData._id}/view`, '_blank')}
                          className="text-gray-600 hover:text-blue-600 font-medium flex items-center transition-colors duration-150"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View Full
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Resume Preview */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-lg text-gray-900">{userData.jobRole}</p>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {userData.experience} Experience
                        </span>
                      </div>
                      <p className="text-gray-600 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {userData.location}
                      </p>
                    </div>
                    
                    {/* PDF Preview */}
                    <div className="w-full bg-white rounded-lg shadow-inner" style={{ height: '400px' }}>
                      {userData.resume?.pdf?.data ? (
                        <embed
                          src={`/api/v1/auth/resume/${userData._id}/view#toolbar=0`}
                          type="application/pdf"
                          width="100%"
                          height="100%"
                          className="rounded-lg scale-[1] origin-top-left"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <DocumentTextIcon className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">No resume uploaded yet</p>
                          <Link
                            to="/resume-builder"
                            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
                          >
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            Create Resume
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Section */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <UserCircleIcon className="h-6 w-6 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Portfolio</h2>
                  </div>
                  
                  {userData.portfolio ? (
                    <div>
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4">
                        <p className="text-gray-600">
                          Showcase your best work and achievements
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <Link
                          to="/portfolio-builder"
                          className="text-purple-600 hover:text-purple-800 font-medium flex items-center transition-colors duration-150"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit Portfolio
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        You haven't created your portfolio yet
                      </p>
                      <Link
                        to="/portfolio-builder"
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-150"
                      >
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        Create Portfolio
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;