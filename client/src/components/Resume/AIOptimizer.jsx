import { useState } from 'react';
import { aiService } from '../../services/aiService';

const AIOptimizer = ({ resumeData, onOptimize }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [matchScore, setMatchScore] = useState(null);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      // Get optimization suggestions
      const optimizationResult = await aiService.optimizeResume(resumeData, jobDescription);
      setSuggestions(optimizationResult.suggestions);
      setMatchScore(optimizationResult.matchScore);
    } catch (error) {
      console.error('Error optimizing resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestions = () => {
    if (suggestions) {
      onOptimize(suggestions);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">AI Resume Optimizer</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full h-32 p-2 border rounded-md"
          placeholder="Paste the job description here..."
        />
      </div>

      <button
        onClick={handleOptimize}
        disabled={loading || !jobDescription}
        className="btn-primary w-full mb-4"
      >
        {loading ? 'Analyzing...' : 'Optimize Resume'}
      </button>

      {matchScore && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Match Score</h3>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${matchScore}%` }}
              ></div>
            </div>
            <span className="ml-2 font-medium">{matchScore}%</span>
          </div>
        </div>
      )}

      {suggestions && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Suggested Improvements</h3>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 bg-blue-50 rounded-md border border-blue-200"
              >
                <p className="text-sm text-blue-800">{suggestion.text}</p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {suggestion.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={applySuggestions}
            className="btn-secondary w-full mt-4"
          >
            Apply Suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default AIOptimizer; 