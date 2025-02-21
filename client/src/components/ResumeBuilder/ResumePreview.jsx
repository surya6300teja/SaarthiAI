import { useEffect, useRef } from 'react';
import { templates } from './resumeTemplates';

const ResumePreview = ({ resumeData, template }) => {
  if (!resumeData) return null;

  const {
    basics = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    achievements = []
  } = resumeData;

  return (
    <div className="preview-container p-6 text-sm">
      {/* Basics Section */}
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{basics.name || 'Your Name'}</h1>
        {basics.title && <p className="text-lg text-gray-700">{basics.title}</p>}
        <div className="text-gray-600 mt-2">
          {basics.email && <span className="mr-4">{basics.email}</span>}
          {basics.phone && <span className="mr-4">{basics.phone}</span>}
          {basics.location && <span>{basics.location}</span>}
        </div>
      </header>

      {/* Summary Section */}
      {basics.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700">{basics.summary}</p>
        </section>
      )}

      {/* Experience Section */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-700 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                    <p className="text-gray-600">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                  </div>
                  <span className="text-gray-500 text-sm">{edu.endDate}</span>
                </div>
                {edu.description && <p className="text-gray-700 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{project.name}</h3>
                  {project.technologies && (
                    <span className="text-gray-500 text-sm">{project.technologies}</span>
                  )}
                </div>
                <p className="text-gray-700 mt-1">{project.description}</p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm mt-1 inline-block"
                  >
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
            Achievements
          </h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                    {achievement.organization && (
                      <p className="text-gray-600">{achievement.organization}</p>
                    )}
                  </div>
                  {achievement.date && (
                    <span className="text-gray-500 text-sm">
                      {new Date(achievement.date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                </div>
                {achievement.description && (
                  <p className="text-gray-700 mt-1">{achievement.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResumePreview;