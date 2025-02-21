import { Link } from 'react-router-dom';
import { DocumentTextIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Resume CTA */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <DocumentTextIcon className="h-16 w-16 text-blue-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Create Your Resume</h2>
            <p className="text-gray-600 mb-6">
              Build a professional resume with our AI-powered builder. Get noticed by employers with ATS-friendly templates.
            </p>
            <Link
              to="resume-builder"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Build Resume
            </Link>
          </div>
        </div>

        {/* Portfolio CTA */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <UserCircleIcon className="h-16 w-16 text-purple-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Create Your Portfolio</h2>
            <p className="text-gray-600 mb-6">
              Showcase your work with a professional portfolio. Stand out with a personalized website to display your projects.
            </p>
            <Link
              to="/portfolio/build"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Build Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Quick Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">ATS Optimization</h3>
            <p className="text-blue-800 text-sm">
              Our AI tools ensure your resume gets past Applicant Tracking Systems
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">Professional Portfolio</h3>
            <p className="text-purple-800 text-sm">
              Showcase your best work with our customizable portfolio templates
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Career Growth</h3>
            <p className="text-green-800 text-sm">
              Get personalized tips to improve your professional presence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 