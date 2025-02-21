import { useState } from 'react';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import { aiService } from '../../services/aiService';
import { SparklesIcon, DocumentIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    basics: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    achievements: []
  });

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (section, value, index = null) => {
    setResumeData(prev => {
      if (index !== null) {
        // Handle array updates (experience, education, projects, achievements)
        const newArray = [...(prev[section] || [])];
        newArray[index] = { ...newArray[index], ...value };
        return { ...prev, [section]: newArray };
      } else if (section === 'basics') {
        // Handle basics section
        return { ...prev, basics: { ...prev.basics, ...value } };
      } else if (Array.isArray(prev[section])) {
        // Handle skills array or other arrays
        return { ...prev, [section]: value };
      } else {
        // Handle other sections
        return { ...prev, [section]: { ...(prev[section] || {}), ...value } };
      }
    });
  };

  const addItem = (section, defaultItem) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), defaultItem]
    }));
  };

  const removeItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: (prev[section] || []).filter((_, i) => i !== index)
    }));
  };

  const generateWithAI = async (section, context) => {
    setIsGenerating(true);
    try {
      switch (section) {
        case 'basics':
          if (context.type === 'summary') {
            const result = await aiService.generateContent({
              field: 'basics.summary',
              context: {
                title: resumeData.basics?.title || ''
              },
              currentValue: resumeData.basics?.summary || ''
            });
            handleInputChange('basics', { summary: result.content });
          }
          break;

        case 'experience':
          if (context.type === 'description') {
            const exp = resumeData.experience[context.index] || {};
            const result = await aiService.generateContent({
              field: 'experience.description',
              context: {
                position: exp.position || '',
                company: exp.company || ''
              },
              currentValue: exp.description || ''
            });
            handleInputChange('experience', { description: result.content }, context.index);
          }
          break;

        case 'education':
          if (context.type === 'description') {
            const edu = resumeData.education[context.index];
            const result = await aiService.generateContent({
              field: 'education.description',
              context: {
                degree: edu.degree,
                school: edu.school
              },
              currentValue: edu.description
            });
            handleInputChange('education', { description: result.content }, context.index);
          }
          break;

        case 'skills':
          if (context.type === 'suggestions') {
            const result = await aiService.generateContent({
              field: 'skills.suggestions',
              context: {
                title: resumeData.basics.title,
                experience: resumeData.experience
              },
              currentValue: resumeData.skills
            });
            // Assuming result.content is a comma-separated string of skills
            const newSkills = result.content.split(',').map(skill => skill.trim());
            handleInputChange('skills', [...resumeData.skills, ...newSkills]);
          }
          break;

        case 'projects':
          if (context.type === 'description') {
            const project = resumeData.projects[context.index];
            const result = await aiService.generateBulletPoints(
              project.description,
              resumeData.basics.title
            );
            handleInputChange('projects', { description: result.join('\n') }, context.index);
          }
          break;

        case 'achievements':
          if (context.type === 'description') {
            const achievement = resumeData.achievements[context.index];
            const result = await aiService.generateAchievements({
              position: resumeData.basics.title,
              company: achievement.organization,
              description: achievement.description
            });
            handleInputChange('achievements', { description: result[0] }, context.index);
          }
          break;

        default:
          console.warn('Unknown section for AI generation:', section);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFullResume = async () => {
    setIsGenerating(true);
    try {
      const sections = ['summary', 'experience', 'skills', 'projects'];
      for (const section of sections) {
        const response = await aiService.generateContent({
          field: section,
          context: resumeData.basics,
          currentValue: resumeData[section]
        });
        handleInputChange(section, response.content);
      }
    } catch (error) {
      console.error('Error generating full resume:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
            <div className="flex gap-4">
              <button
                onClick={generateFullResume}
                disabled={isGenerating}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
                    Generate with AI
                  </>
                )}
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <DocumentIcon className="-ml-1 mr-2 h-5 w-5" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Form section */}
          <div className="w-1/2 bg-white rounded-lg shadow p-6">
            <ResumeForm
              resumeData={resumeData}
              onInputChange={handleInputChange}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              onGenerateAI={generateWithAI}
              isGenerating={isGenerating}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
            />
          </div>

          {/* Preview section */}
          <div className="w-1/2 sticky top-8">
            <div className="bg-white rounded-lg shadow p-6">
              <ResumePreview
                resumeData={resumeData}
                template={selectedTemplate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Template selector */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Template:</span>
            <div className="flex gap-4">
              {['modern', 'classic', 'minimal'].map(template => (
                <button
                  key={template}
                  onClick={() => setSelectedTemplate(template)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedTemplate === template
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {template.charAt(0).toUpperCase() + template.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder; 