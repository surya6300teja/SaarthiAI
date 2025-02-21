import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.activeJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Candidates</h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalCandidates}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Scheduled Interviews</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.scheduledInterviews}
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