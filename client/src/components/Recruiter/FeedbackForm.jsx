import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const FeedbackForm = ({ onSubmit }) => {
  const [feedback, setFeedback] = useState({
    technicalSkills: 0,
    communication: 0,
    problemSolving: 0,
    cultureFit: 0,
    overallRating: 0,
    strengths: '',
    weaknesses: '',
    notes: '',
    recommendation: 'no_decision'
  });

  const categories = [
    { id: 'technicalSkills', label: 'Technical Skills' },
    { id: 'communication', label: 'Communication' },
    { id: 'problemSolving', label: 'Problem Solving' },
    { id: 'cultureFit', label: 'Culture Fit' },
    { id: 'overallRating', label: 'Overall Rating' }
  ];

  const handleRatingChange = (category, rating) => {
    setFeedback(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(feedback);
  };

  const RatingStars = ({ category, value }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => handleRatingChange(category, rating)}
          className="focus:outline-none"
        >
          {rating <= value ? (
            <StarIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="w-6 h-6 text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {categories.map(({ id, label }) => (
          <div key={id} className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <RatingStars category={id} value={feedback[id]} />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Key Strengths
          </label>
          <textarea
            value={feedback.strengths}
            onChange={(e) => setFeedback(prev => ({
              ...prev,
              strengths: e.target.value
            }))}
            rows={3}
            className="w-full rounded-md border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Areas for Improvement
          </label>
          <textarea
            value={feedback.weaknesses}
            onChange={(e) => setFeedback(prev => ({
              ...prev,
              weaknesses: e.target.value
            }))}
            rows={3}
            className="w-full rounded-md border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={feedback.notes}
            onChange={(e) => setFeedback(prev => ({
              ...prev,
              notes: e.target.value
            }))}
            rows={3}
            className="w-full rounded-md border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recommendation
          </label>
          <select
            value={feedback.recommendation}
            onChange={(e) => setFeedback(prev => ({
              ...prev,
              recommendation: e.target.value
            }))}
            className="w-full rounded-md border-gray-300"
          >
            <option value="no_decision">No Decision</option>
            <option value="strong_hire">Strong Hire</option>
            <option value="hire">Hire</option>
            <option value="maybe">Maybe</option>
            <option value="no_hire">Do Not Hire</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Save Draft
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Feedback
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm; 