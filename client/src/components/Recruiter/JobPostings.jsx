import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateJob = async (jobData) => {
    try {
      // API call to create job
      setIsCreating(false);
      // Refresh jobs list
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Job Postings</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Job
        </button>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500 mt-2">{job.location}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {job.applicants.length} Applicants
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                Edit
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                View Candidates
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Job Creation Modal */}
      {isCreating && (
        <JobCreationModal
          onClose={() => setIsCreating(false)}
          onSubmit={handleCreateJob}
        />
      )}
    </div>
  );
};

export default JobPostings; 