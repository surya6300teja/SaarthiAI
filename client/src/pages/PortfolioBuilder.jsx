import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { portfolioService } from '../services/api';

const PortfolioBuilder = () => {
  const [portfolio, setPortfolio] = useState({
    title: '',
    about: '',
    skills: [],
    projects: [],
    education: [],
    experience: [],
    socialLinks: {
      github: '',
      linkedin: '',
      website: '',
    },
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPortfolio((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProject = () => {
    setPortfolio((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: '',
          description: '',
          technologies: [],
          link: '',
          image: '',
        },
      ],
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setPortfolio((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await portfolioService.create(portfolio);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating portfolio:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Your Portfolio</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Portfolio Title
          </label>
          <input
            type="text"
            name="title"
            value={portfolio.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            About Me
          </label>
          <textarea
            name="about"
            value={portfolio.about}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          {portfolio.projects.map((project, index) => (
            <div key={index} className="border p-4 rounded-md mb-4">
              <input
                type="text"
                placeholder="Project Title"
                value={project.title}
                onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                className="mb-2 block w-full rounded-md border-gray-300"
              />
              <textarea
                placeholder="Project Description"
                value={project.description}
                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                className="mb-2 block w-full rounded-md border-gray-300"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addProject}
            className="btn-secondary"
          >
            Add Project
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
          >
            Create Portfolio
          </button>
        </div>
      </form>
    </div>
  );
};

export default PortfolioBuilder; 