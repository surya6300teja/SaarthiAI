import { useState, useEffect } from 'react';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ClockIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  UserGroupIcon,
  XMarkIcon,
  PlusIcon,
  SparklesIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import AICandidateRankings from './AICandidateRankings';

const PDFViewerModal = ({ isOpen, onClose, candidateId }) => {
  if (!isOpen || !candidateId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-5xl h-[90vh] mx-4">
        {/* Modal content */}
        <div className="bg-white rounded-lg shadow-xl h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* PDF Viewer */}
          <div className="flex-1 bg-gray-100 p-4">
            <embed
              src={`/api/v1/auth/resume/${candidateId}/view`}
              type="application/pdf"
              width="100%"
              height="100%"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [filters, setFilters] = useState({
    jobRole: 'all',
    location: 'all',
    experience: 'all'
  });
  const [jobRequirements, setJobRequirements] = useState({
    role: 'Software Developer',
    experience: 'entry',
    skills: ['JavaScript'],
    education: 'bachelors',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, [filters]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (filters.jobRole !== 'all') params.append('jobRole', filters.jobRole);
      if (filters.location !== 'all') params.append('location', filters.location);
      if (filters.experience !== 'all') params.append('experience', filters.experience);

      const response = await api.get(`/auth/recruiter/candidates?${params.toString()}`);
      
      if (response.data.success) {
        const formattedCandidates = response.data.candidates.map(candidate => ({
          ...candidate,
          createdAt: candidate.createdAt ? new Date(candidate.createdAt) : null,
          updatedAt: candidate.updatedAt ? new Date(candidate.updatedAt) : null
        }));
        
        // Sort candidates by match score
        const sortedCandidates = formattedCandidates.sort((a, b) => b.matchScore - a.matchScore);
        
        setCandidates(sortedCandidates);
      } else {
        throw new Error(response.data.error || 'Failed to fetch candidates');
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleViewResume = (candidateId) => {
    if (!candidateId) {
      console.error('No candidate ID provided');
      return;
    }
    setSelectedCandidateId(candidateId);
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !jobRequirements.skills.includes(skillInput.trim())) {
      setJobRequirements(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setJobRequirements(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowAIAnalysis(true);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isRequirementsValid = () => {
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <UserGroupIcon className="h-8 w-8 mr-3 text-blue-600" />
            Candidate Search
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Find the perfect candidate for your team
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center mb-4">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Job Role</label>
              <select
                value={filters.jobRole}
                onChange={(e) => handleFilterChange('jobRole', e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option key="all-roles" value="all">All Job Roles</option>
                {[
                  'Software Engineer',
                  'Frontend Developer',
                  'Backend Developer',
                  'Full Stack Developer',
                  'DevOps Engineer',
                  'Data Scientist',
                  'UI/UX Designer'
                ].map(role => (
                  <option key={`role-${role}`} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option key="all-locations" value="all">All Locations</option>
                {[
                  'Remote',
                  'Bangalore',
                  'Mumbai',
                  'Delhi',
                  'Hyderabad'
                ].map(location => (
                  <option key={`location-${location}`} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option key="all-exp" value="all">All Experience Levels</option>
                {[
                  '0-2 years',
                  '2-5 years',
                  '5-8 years',
                  '8+ years'
                ].map(exp => (
                  <option key={`exp-${exp}`} value={exp}>{exp}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">{error}</div>
            <button
              onClick={fetchCandidates}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Candidates Found</h3>
            <p className="text-gray-600">Try adjusting your filters to find more candidates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{candidate.jobRole}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    candidate.matchScore >= 70 ? 'bg-green-100 text-green-800' :
                    candidate.matchScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {candidate.matchScore}% Match
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <BriefcaseIcon className="h-4 w-4 mr-2" />
                    {candidate.experience}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {candidate.location}
                  </div>
                  {candidate.summary && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {candidate.summary}
                    </p>
                  )}
                </div>

                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <span 
                        key={`${candidate._id}-skill-${index}`}
                        className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span 
                        key={`${candidate._id}-skill-more`}
                        className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-full"
                      >
                        +{candidate.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    Updated {new Date(candidate.lastUpdated).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-3">
                    <a
                      href={`mailto:${candidate.email}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-150"
                      title="Contact Candidate"
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() => handleViewResume(candidate._id)}
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-150"
                      title="View Resume"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        isOpen={!!selectedCandidateId}
        onClose={() => setSelectedCandidateId(null)}
        candidateId={selectedCandidateId}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Candidate Rankings</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              {!showAIAnalysis && (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className={`flex items-center px-4 py-2 rounded-md text-white
                    ${isAnalyzing 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'}
                  `}
                >
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={jobRequirements.role}
                    onChange={(e) => setJobRequirements(prev => ({
                      ...prev,
                      role: e.target.value
                    }))}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={jobRequirements.experience}
                    onChange={(e) => setJobRequirements(prev => ({
                      ...prev,
                      experience: e.target.value
                    }))}
                  >
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (3-5 years)</option>
                    <option value="senior">Senior Level (5+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education Level
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={jobRequirements.education}
                    onChange={(e) => setJobRequirements(prev => ({
                      ...prev,
                      education: e.target.value
                    }))}
                  >
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {jobRequirements.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">AI is analyzing candidates based on your requirements...</p>
          </div>
        ) : showAIAnalysis ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <SparklesIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">AI Analysis Results</h2>
              </div>
              <button
                onClick={() => setShowAIAnalysis(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <AICandidateRankings 
              candidates={candidates} 
              jobRequirements={jobRequirements}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Ready to Analyze</h3>
              <p className="mt-1 text-gray-500">
                Click "Analyze with AI" to rank candidates based on current requirements
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateList;