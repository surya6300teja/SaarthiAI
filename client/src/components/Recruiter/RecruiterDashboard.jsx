import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import api from '../../services/api';
import JobPostings from './JobPostings';
import CandidateList from './CandidateList';
import InterviewScheduler from './InterviewScheduler';

const RecruiterDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalCandidates: 0,
    scheduledInterviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/auth/recruiter/dashboard-stats');
      
      if (response.data.success) {
        setStats({
          activeJobs: response.data.stats.activeJobs || 0,
          totalCandidates: response.data.stats.totalCandidates || 0,
          scheduledInterviews: response.data.stats.scheduledInterviews || 0
        });
      } else {
        throw new Error(response.data.error || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-blue-600">
            {loading ? '...' : stats.activeJobs}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Candidates</h3>
          <p className="text-3xl font-bold text-green-600">
            {loading ? '...' : stats.totalCandidates}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Scheduled Interviews</h3>
          <p className="text-3xl font-bold text-purple-600">
            {loading ? '...' : stats.scheduledInterviews}
          </p>
        </div>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              }`
            }
          >
            Job Postings
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              }`
            }
          >
            Candidates
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              }`
            }
          >
            Interviews
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <JobPostings />
          </Tab.Panel>
          <Tab.Panel>
            <CandidateList />
          </Tab.Panel>
          <Tab.Panel>
            <InterviewScheduler />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default RecruiterDashboard; 