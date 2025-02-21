import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
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
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100 to-white">
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                  What's new
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>Just launched AI features</span>
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Create your professional resume in minutes
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Build stunning, ATS-friendly resumes with our AI-powered platform. Stand out from the crowd and land your dream job faster.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get Started Free
              </Link>
              <Link to="/templates" className="text-sm font-semibold leading-6 text-gray-900">
                View Templates <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              {/* <img
                src={resumeTemplate1}
                alt="Resume Template Preview"
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Build Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to create a professional resume
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform combines the power of AI with professional templates to help you create the perfect resume.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-lg text-gray-900">{feature}</span>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Templates Preview Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Professional Templates
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choose from our collection of professionally designed templates that help you stand out.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* <img
              src={resumeTemplate1}
              alt="Modern Template"
              className="rounded-2xl shadow-lg"
            /> */}
            {/* <img
              src={resumeTemplate2}
              alt="Professional Template"
              className="rounded-2xl shadow-lg"
            /> */}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loved by job seekers
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="bg-white p-8 rounded-2xl shadow-lg">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <p className="mt-4 text-lg font-semibold leading-6 text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-blue-600">{testimonial.role}</p>
                  <p className="mt-4 text-gray-600">{testimonial.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to boost your career?
            <br />
            Start building your professional resume today.
          </h2>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              to="/register"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get Started Free
            </Link>
            <Link to="/templates" className="text-sm font-semibold leading-6 text-white">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 