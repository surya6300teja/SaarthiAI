import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AIGenerateButton from './AIGenerateButton';
import { PlusIcon, SparklesIcon, TrashIcon } from '@heroicons/react/24/outline';

const jobRoles = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'UI/UX Designer',
  'Product Manager',
  'Project Manager',
  'Business Analyst',
  'System Administrator',
  'Cloud Engineer',
  'Mobile Developer',
  'QA Engineer',
  'Other'
];

const experienceLevels = [
  { value: '0-2', label: '0-2 years' },
  { value: '2-5', label: '2-5 years' },
  { value: '5-8', label: '5-8 years' },
  { value: '8-12', label: '8-12 years' },
  { value: '12+', label: '12+ years' }
];

const ResumeForm = ({ 
  resumeData = {
    basics: {},
    experience: [],
    education: [],
    skills: [],
    projects: [],
    achievements: []
  }, 
  onInputChange, 
  onAddItem, 
  onRemoveItem, 
  onGenerateAI, 
  isGenerating, 
  selectedTemplate, 
  setSelectedTemplate 
}) => {
  const [formData, setFormData] = useState({
    template: 'modern',
    basics: {
      title: '',
      summary: '',
      location: {
        city: '',
        country: '',
      },
      website: '',
      linkedin: '',
      github: '',
    },
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
  });

  const [activeSection, setActiveSection] = useState('basics');
  const navigate = useNavigate();

  const handleBasicsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      basics: {
        ...prev.basics,
        [name]: value,
      },
    }));
  };

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          achievements: [],
        },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/resumes', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate(`/resume/${response.data.data._id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
    }
  };

  const templates = [
    { id: 'modern', name: 'Modern' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
  ];

  const addExperience = () => {
    onInputChange('experience', [...resumeData.experience, {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  };

  const removeExperience = (index) => {
    const newExperience = resumeData.experience.filter((_, i) => i !== index);
    onInputChange('experience', newExperience);
  };

  const addEducation = () => {
    onInputChange('education', [...resumeData.education, {
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  };

  const removeEducation = (index) => {
    const newEducation = resumeData.education.filter((_, i) => i !== index);
    onInputChange('education', newEducation);
  };

  const addProject = () => {
    onInputChange('projects', [...resumeData.projects, {
      name: '',
      description: '',
      technologies: '',
      link: ''
    }]);
  };

  const removeProject = (index) => {
    const newProjects = resumeData.projects.filter((_, i) => i !== index);
    onInputChange('projects', newProjects);
  };

  const addSkill = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      onInputChange('skills', [...resumeData.skills, e.target.value.trim()]);
      e.target.value = '';
    }
  };

  const removeSkill = (index) => {
    const newSkills = resumeData.skills.filter((_, i) => i !== index);
    onInputChange('skills', newSkills);
  };

  const addAchievement = () => {
    onAddItem('achievements', {
      title: '',
      date: '',
      organization: '',
      description: '',
      category: ''
    });
  };

  const achievements = resumeData.achievements || [];

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 overflow-x-auto">
        {['basics', 'experience', 'education', 'skills', 'projects', 'achievements'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeSection === section
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      {/* Template Selection */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Choose Template</h3>
        <div className="flex gap-4">
          {templates.map(template => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-4 border rounded-lg ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Basic Information */}
      {activeSection === 'basics' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={resumeData.basics.name}
              onChange={(e) => onInputChange('basics', { name: e.target.value })}
              className="input-field"
            />
            
            {/* Job Role Dropdown */}
            <select
              value={resumeData.basics.title || ''}
              onChange={(e) => onInputChange('basics', { title: e.target.value })}
              className="input-field bg-white"
            >
              <option value="">Select Job Role</option>
              {jobRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <input
              type="email"
              placeholder="Email"
              value={resumeData.basics.email}
              onChange={(e) => onInputChange('basics', { email: e.target.value })}
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={resumeData.basics.phone}
              onChange={(e) => onInputChange('basics', { phone: e.target.value })}
              className="input-field"
            />

            {/* Experience Level Dropdown */}
            <select
              value={resumeData.basics.experience || ''}
              onChange={(e) => onInputChange('basics', { experience: e.target.value })}
              className="input-field bg-white"
            >
              <option value="">Select Experience Level</option>
              {experienceLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Location"
              value={resumeData.basics.location}
              onChange={(e) => onInputChange('basics', { location: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Custom Job Role Input (shows only when 'Other' is selected) */}
          {resumeData.basics.title === 'Other' && (
            <input
              type="text"
              placeholder="Enter Custom Job Role"
              value={resumeData.basics.customTitle || ''}
              onChange={(e) => onInputChange('basics', { 
                customTitle: e.target.value,
                title: e.target.value // Update both custom and main title
              })}
              className="input-field mt-2"
            />
          )}

          <textarea
            placeholder="Professional Summary"
            value={resumeData.basics.summary}
            onChange={(e) => onInputChange('basics', { summary: e.target.value })}
            className="input-field h-32"
          />
          <button
            onClick={() => onGenerateAI('basics', { type: 'summary' })}
            disabled={isGenerating}
            className={`
              inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-300 
              ${isGenerating 
                ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:shadow-md active:scale-95'
              }
            `}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4 mr-2 animate-pulse" />
                Generate Summary
              </>
            )}
          </button>
        </div>
      )}

      {/* Experience Section */}
      {activeSection === 'experience' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Experience</h3>
            <button
              onClick={addExperience}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Experience
            </button>
          </div>

          {resumeData.experience.map((exp, index) => (
            <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-start">
                <h4 className="text-md font-medium text-gray-900">Experience {index + 1}</h4>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => onInputChange('experience', { company: e.target.value }, index)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => onInputChange('experience', { position: e.target.value }, index)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) => onInputChange('experience', { startDate: e.target.value }, index)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) => onInputChange('experience', { endDate: e.target.value }, index)}
                  className="input-field"
                />
              </div>
              <textarea
                placeholder="Description"
                value={exp.description}
                onChange={(e) => onInputChange('experience', { description: e.target.value }, index)}
                className="input-field h-32"
              />
              <button
                onClick={() => onGenerateAI('experience', { index, type: 'description' })}
                disabled={isGenerating}
                className={`
                  inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-300 
                  ${isGenerating 
                    ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:shadow-md active:scale-95'
                  }
                `}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4 mr-2 animate-pulse" />
                    AI Generate
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {activeSection === 'education' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Education</h3>
            <button
              onClick={addEducation}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Education
            </button>
          </div>

          {resumeData.education.map((edu, index) => (
            <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-start">
                <h4 className="text-md font-medium text-gray-900">Education {index + 1}</h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="School"
                  value={edu.school}
                  onChange={(e) => onInputChange('education', { school: e.target.value }, index)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => onInputChange('education', { degree: e.target.value }, index)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Field of Study"
                  value={edu.fieldOfStudy}
                  onChange={(e) => onInputChange('education', { fieldOfStudy: e.target.value }, index)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Graduation Date"
                  value={edu.endDate}
                  onChange={(e) => onInputChange('education', { endDate: e.target.value }, index)}
                  className="input-field"
                />
              </div>
              <textarea
                placeholder="Description (Optional)"
                value={edu.description}
                onChange={(e) => onInputChange('education', { description: e.target.value }, index)}
                className="input-field h-32"
              />
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {activeSection === 'skills' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Skills</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Type a skill and press Enter"
              onKeyPress={addSkill}
              className="input-field"
            />
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={() => onGenerateAI('skills', { type: 'suggestions' })}
              disabled={isGenerating}
              className={`
                inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-300 
                ${isGenerating 
                  ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:shadow-md active:scale-95'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 mr-2 animate-pulse" />
                  Suggest Skills
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Projects Section */}
      {activeSection === 'projects' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Projects</h3>
            <button
              onClick={addProject}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Project
            </button>
          </div>

          {resumeData.projects.map((project, index) => (
            <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-start">
                <h4 className="text-md font-medium text-gray-900">Project {index + 1}</h4>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) => onInputChange('projects', { name: e.target.value }, index)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Technologies Used"
                  value={project.technologies}
                  onChange={(e) => onInputChange('projects', { technologies: e.target.value }, index)}
                  className="input-field"
                />
                <input
                  type="url"
                  placeholder="Project Link"
                  value={project.link}
                  onChange={(e) => onInputChange('projects', { link: e.target.value }, index)}
                  className="input-field col-span-2"
                />
              </div>
              <textarea
                placeholder="Project Description"
                value={project.description}
                onChange={(e) => onInputChange('projects', { description: e.target.value }, index)}
                className="input-field h-32"
              />
              <button
                onClick={() => onGenerateAI('projects', { index, type: 'description' })}
                disabled={isGenerating}
                className={`
                  inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-300 
                  ${isGenerating 
                    ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:shadow-md active:scale-95'
                  }
                `}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4 mr-2 animate-pulse" />
                    Generate Description
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Achievements Section */}
      {activeSection === 'achievements' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
            <button onClick={addAchievement} className="add-button">
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Achievement
            </button>
          </div>
          {achievements.map((achievement, index) => (
            <div key={index} className="section-item">
              <div className="flex justify-between items-start">
                <h4 className="text-md font-medium text-gray-900">Achievement {index + 1}</h4>
                <button 
                  onClick={() => onInputChange('achievements', { title: '', date: '', organization: '', description: '', category: '' }, index)} 
                  className="delete-button"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Achievement Title"
                  value={achievement.title || ''}
                  onChange={(e) => onInputChange('achievements', { title: e.target.value }, index)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Organization"
                  value={achievement.organization || ''}
                  onChange={(e) => onInputChange('achievements', { organization: e.target.value }, index)}
                  className="input-field"
                />
                <input
                  type="month"
                  placeholder="Date"
                  value={achievement.date || ''}
                  onChange={(e) => onInputChange('achievements', { date: e.target.value }, index)}
                  className="input-field"
                />
                <select
                  value={achievement.category || ''}
                  onChange={(e) => onInputChange('achievements', { category: e.target.value }, index)}
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  <option value="award">Award</option>
                  <option value="certification">Certification</option>
                  <option value="recognition">Recognition</option>
                  <option value="publication">Publication</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <textarea
                placeholder="Description of your achievement"
                value={achievement.description || ''}
                onChange={(e) => onInputChange('achievements', { description: e.target.value }, index)}
                className="input-field h-32 mt-4"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => onGenerateAI('achievements', { index, type: 'description' })}
                  disabled={isGenerating}
                  className={`
                    inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-300 
                    ${isGenerating 
                      ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:shadow-md active:scale-95'
                    }
                  `}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4 mr-2 animate-pulse" />
                      Generate Description
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
          {achievements.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No achievements added yet. Click "Add Achievement" to get started.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeForm; 
