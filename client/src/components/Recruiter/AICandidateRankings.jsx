import { useState, useEffect } from 'react';
import { rankCandidates } from '../../services/geminiScoring';
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  SparklesIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const AICandidateRankings = ({ candidates, jobRequirements }) => {
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCandidate, setExpandedCandidate] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const results = await rankCandidates(candidates, jobRequirements);
        setRankedCandidates(results);
      } catch (err) {
        setError('Failed to analyze candidates');
      } finally {
        setLoading(false);
      }
    };

    if (candidates?.length && jobRequirements) {
      fetchRankings();
    }
  }, [candidates, jobRequirements]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">AI is analyzing candidates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          AI-Ranked Candidates ({rankedCandidates.length})
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <SparklesIcon className="h-5 w-5 mr-2 text-blue-500" />
          Powered by Gemini AI
        </div>
      </div>

      <div className="space-y-4">
        {rankedCandidates.map((candidate, index) => (
          <div 
            key={candidate._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedCandidate(
                expandedCandidate === candidate._id ? null : candidate._id
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`
                    flex items-center justify-center h-8 w-8 rounded-full 
                    ${index < 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                    font-semibold
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {candidate.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {candidate.title || 'Candidate'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {candidate.aiScoring.overallMatch}%
                  </div>
                  <ChevronDownIcon 
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      expandedCandidate === candidate._id ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {expandedCandidate === candidate._id && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Education Match</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {candidate.aiScoring.educationScore}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Experience Match</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {candidate.aiScoring.experienceScore}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Skills Match</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {candidate.aiScoring.skillsScore}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Project Portfolio</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {candidate.aiScoring.projectScore}%
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Strengths</h4>
                    <ul className="space-y-1">
                      {candidate.aiScoring.keyStrengths.map((strength, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {candidate.aiScoring.areasForImprovement.map((area, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <ExclamationCircleIcon className="h-4 w-4 text-yellow-500 mr-2" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">AI Recommendation</h4>
                    <p className="text-sm text-gray-600">
                      {candidate.aiScoring.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AICandidateRankings; 