import { useState } from 'react';
import { motion } from 'framer-motion';

const PortfolioShowcase = ({ portfolio }) => {
  const [activeSection, setActiveSection] = useState('projects');

  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{portfolio.title}</h1>
        <p className="text-xl text-gray-600">{portfolio.about}</p>
        
        <div className="flex justify-center space-x-4 mt-6">
          {portfolio.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600"
            >
              <i className={`fab fa-${link.platform.toLowerCase()}`}></i>
            </a>
          ))}
        </div>
      </header>

      <nav className="flex justify-center space-x-6 mb-12">
        {['projects', 'skills', 'experience', 'education'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-full ${
              activeSection === section
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeSection === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'skills' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {portfolio.skills.map((skillCategory) => (
              <div
                key={skillCategory.category}
                className="bg-white p-6 rounded-lg shadow"
              >
                <h3 className="text-lg font-semibold mb-4">
                  {skillCategory.category}
                </h3>
                <div className="space-y-3">
                  {skillCategory.items.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1">
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add similar sections for experience and education */}
      </motion.div>
    </div>
  );
};

export default PortfolioShowcase; 