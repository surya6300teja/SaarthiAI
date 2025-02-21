import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import { aiService } from '../../services/aiService';
import { SparklesIcon, DocumentIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const ResumeBuilder = () => {
  const navigate = useNavigate();
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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

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
            const result = await aiService.generateContent({
                field: 'projects.description',
              context: {
                title: project.title || '',
                technologies: project.technologies || '',
                description: project.description || ''
              },
              currentValue: project.description || ''
            }
              
            );
            handleInputChange('projects', { description: result.content }, context.index);
          }
          break;

        case 'achievements':
          if (context.type === 'description') {
            const achievement = resumeData.achievements[context.index];
            const result = await aiService.generateContent({
              field: 'achievements.description',
              context: {
                title: achievement.title || '',
                organisation: achievement.organisation || ''
              },
              currentValue: achievement.description || ''
            });
            handleInputChange('achievements', { description: result.content }, context.index);
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

  const handleFinish = async () => {
    setIsSaving(true);
    setSaveError('');
    
    try {
      const response = await api.post('/resumes', {
        ...resumeData,
        lastUpdated: new Date().toISOString()
      });

      if (response.data.success) {
        toast.success('Resume saved successfully!');
        navigate('/dashboard');
      } else {
        throw new Error(response.data.error || 'Failed to save resume');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      setSaveError(error.response?.data?.error || error.message || 'Failed to save resume');
      toast.error('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <DocumentIcon className="-ml-1 mr-2 h-5 w-5" />
              Export PDF
            </button>
            
            <button
              onClick={handleFinish}
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSaving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                  Finish & Save
                </>
              )}
            </button>
          </div>
        </div>

        {saveError && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {saveError}
          </div>
        )}

        {/* Main content */}
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
    </div>
  );
};

export default ResumeBuilder; 