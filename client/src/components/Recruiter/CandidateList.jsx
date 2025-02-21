import { useState, useEffect } from 'react';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ClockIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  UserGroupIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

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
    </div>
  );
};

export default CandidateList;