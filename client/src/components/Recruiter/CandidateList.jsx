import { useState, useEffect } from 'react';
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobRole: 'all',
    location: 'all',
    experience: 'all'
  });
  const [sortBy, setSortBy] = useState('matchScore');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, [filters]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSort = (key) => {
    setSortBy(key);
    // Implement sorting logic
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const filteredCandidates = candidates.filter(candidate => 
    candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const jobRoles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'UI/UX Designer',
    'Product Manager',
    'Project Manager'
  ];

  const locations = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Remote'
  ];

  const experienceLevels = [
    { value: '0-2', label: '0-2 years' },
    { value: '2-5', label: '2-5 years' },
    { value: '5-8', label: '5-8 years' },
    { value: '8+', label: '8+ years' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search candidates..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Updated Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FunnelIcon className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <select
            value={filters.jobRole}
            onChange={(e) => handleFilterChange('jobRole', e.target.value)}
            className="rounded-md border-gray-300 text-sm"
          >
            <option value="all">All Job Roles</option>
            {jobRoles.map(role => (
              <option key={role} value={role.toLowerCase().replace(/\s+/g, '-')}>
                {role}
              </option>
            ))}
          </select>

          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="rounded-md border-gray-300 text-sm"
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location.toLowerCase()}>
                {location}
              </option>
            ))}
          </select>

          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
            className="rounded-md border-gray-300 text-sm"
          >
            <option value="all">All Experience Levels</option>
            {experienceLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Candidate
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('matchScore')}
              >
                <div className="flex items-center">
                  Match Score
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Applied For
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCandidates.map((candidate) => (
              <tr
                key={candidate._id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedCandidate(candidate)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <UserCircleIcon 
                        className="h-10 w-10 text-gray-400" 
                        aria-hidden="true" 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {candidate.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {candidate.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900">
                      {candidate.matchScore}%
                    </span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${candidate.matchScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{candidate.jobTitle}</div>
                  <div className="text-sm text-gray-500">
                    Applied {formatDate(candidate.appliedDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    getStatusColor(candidate.status)
                  }`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    View Resume
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    Schedule Interview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    new: 'bg-blue-100 text-blue-800',
    reviewing: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-green-100 text-green-800',
    interviewed: 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default CandidateList; 