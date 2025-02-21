import { useState, useEffect } from 'react';
import { jobService } from '../../services/api';
import { aiService } from '../../services/aiService';

const JobMatcher = ({ resumeId }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchScores, setMatchScores] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobService.getAll();
      setJobs(response.data.data);
      calculateMatchScores(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScores = async (jobsList) => {
    const scores = {};
    for (const job of jobsList) {
      try {
        const result = await aiService.calculateMatchScore(resumeId, job._id);
        scores[job._id] = result.score;
      } catch (error) {
        console.error(`Error calculating match score for job ${job._id}:`, error);
      }
    }
    setMatchScores(scores);
  };

  if (loading) {
    return <div>Loading job matches...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Matched Jobs</h2>
      
      <div className="grid gap-6">
        {jobs
          .sort((a, b) => (matchScores[b._id] || 0) - (matchScores[a._id] || 0))
          .map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500 mt-2">{job.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {matchScores[job._id]}%
                  </div>
                  <div className="text-sm text-gray-500">Match Score</div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Key Requirements</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {job.requirements.slice(0, 3).map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="space-x-2">
                  {job.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="inline-block px-2 py-1 text-sm bg-gray-100 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <button className="btn-primary">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default JobMatcher; 