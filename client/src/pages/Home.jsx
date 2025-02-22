import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { UserIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
// import resumeTemplate1 from '../assets/resume-template-1.png';
// import resumeTemplate2 from '../assets/resume-template-2.png';

const features = [
  'AI-Powered Resume Builder',
  'Professional Templates',
  'ATS-Friendly Formats',
  'Real-Time Preview',
  'Expert Suggestions',
  'Easy Download Options'
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    content: 'This resume builder helped me land my dream job! The AI suggestions were incredibly helpful.'
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    content: 'The templates are professional and modern. I got more interviews after using this platform.'
  },
  {
    name: 'Emily Brown',
    role: 'Marketing Director',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    content: 'Incredibly easy to use with fantastic results. The real-time preview is a game-changer.'
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Background Image Overlay */}
      <div 
        className="absolute left-0 top-0 h-full w-1/2 opacity-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/client/src/assets/Bg.png')",
         
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Build Your Professional</span>
              <span className="block text-indigo-600">Resume with AI</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Create a standout resume in minutes with our AI-powered resume builder. Perfect for job seekers and professionals.
            </p>

            {/* Login Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              {/* Job Seeker Login */}
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg"
              >
                <UserIcon className="-ml-1 mr-2 h-5 w-5" />
                Job Seeker Login
              </Link>

              {/* Recruiter Login */}
              <Link
                to="/recruiter/login"
                className="inline-flex items-center justify-center px-8 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:text-lg"
              >
                <BriefcaseIcon className="-ml-1 mr-2 h-5 w-5" />
                Recruiter Login
              </Link>
              <Link
                  to="/skill-craft"
                  className="inline-flex items-center justify-center px-8 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:text-lg"
                >
                  <svg 
                    className="-ml-1 mr-2 h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" 
                    />
                  </svg>
                  Try Skill-Craft
                </Link>
            </div>

            {/* Features Grid */}
            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 mb-4">
                  <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">AI-Powered Content</h3>
                <p className="mt-2 text-gray-500">Generate professional content for your resume with advanced AI technology.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 mb-4">
                  <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Professional Templates</h3>
                <p className="mt-2 text-gray-500">Choose from a variety of ATS-friendly resume templates.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 mb-4">
                  <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Easy to Use</h3>
                <p className="mt-2 text-gray-500">Simple and intuitive interface to create your perfect resume.</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-20 space-y-6">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg"
                >
                  Get Started for Free
                </Link>
                <Link
                  to="/skill-craft"
                  className="inline-flex items-center justify-center px-8 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:text-lg"
                >
                  <svg 
                    className="-ml-1 mr-2 h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" 
                    />
                  </svg>
                  Try Skill-Craft
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 