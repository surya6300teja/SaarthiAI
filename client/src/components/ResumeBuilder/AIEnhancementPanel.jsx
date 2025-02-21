import { useState } from 'react';
import { aiService } from '../../services/aiService';

const AIEnhancementPanel = ({ resumeData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleAnalyzeResume = async () => {
    setLoading(true);
    try {
      const analysis = await aiService.analyzeResumeStrength(resumeData);
      setAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTailorResume = async () => {
    if (!jobDescription) return;
    setLoading(true);
    try {
      const { tailoredContent, matchScore, suggestions } = await aiService.tailorToJob(
        resumeData,
        jobDescription
      );
      onUpdate(tailoredContent);
      setAnalysis({ matchScore, suggestions });
    } catch (error) {
      console.error('Error tailoring resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAchievements = async (experienceIndex) => {
    setLoading(true);
    try {
      const achievements = await aiService.generateAchievements(
        resumeData.experience[experienceIndex]
      );
      const updatedExperience = [...resumeData.experience];
      updatedExperience[experienceIndex] = {
        ...updatedExperience[experienceIndex],
        achievements
      };
      onUpdate({ ...resumeData, experience: updatedExperience });
    } catch (error) {
      console.error('Error generating achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">AI Resume Enhancement</h3>

      {/* Resume Analysis Section */}
      <div className="mb-6">
        <button
          onClick={handleAnalyzeResume}
          disabled={loading}
          className="btn-primary w-full mb-4"
        >
          {loading ? 'Analyzing...' : 'Analyze Resume Strength'}
        </button>

        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Overall Score:</span>
              <span className="font-medium">{analysis.score}%</span>
            </div>

            <div>
              <h4 className="font-medium mb-2">Section Scores:</h4>
              {Object.entries(analysis.sectionScores).map(([section, score]) => (
                <div key={section} className="flex items-center justify-between">
                  <span className="capitalize">{section}:</span>
                  <span>{score}%</span>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-medium mb-2">Suggested Improvements:</h4>
              <ul className="list-disc pl-4">
                {analysis.improvements.map((improvement, index) => (
                  <li key={index} className="text-gray-600">{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Job Tailoring Section */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Tailor to Job Description</h4>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          className="w-full p-2 border rounded mb-2"
          rows={4}
        />
        <button
          onClick={handleTailorResume}
          disabled={loading || !jobDescription}
          className="btn-secondary w-full"
        >
          {loading ? 'Tailoring...' : 'Tailor Resume'}
        </button>
      </div>

      {/* Experience Enhancement Section */}
      <div>
        <h4 className="font-medium mb-2">Generate Achievements</h4>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="mb-2">
            <button
              onClick={() => handleGenerateAchievements(index)}
              disabled={loading}
              className="btn-outline w-full text-left"
            >
              Generate for: {exp.position} at {exp.company}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIEnhancementPanel; 