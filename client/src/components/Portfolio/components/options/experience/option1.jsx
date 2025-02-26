import React from 'react';
import { 
  StarIcon, 
  BriefcaseIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/solid';

const Option1 = (props) => {
  const { experienceTitle, experience } = props;

  return (
    <section className="w-full h-screen overflow-x-hidden" id="experience" style={{ fontFamily: 'sans-serif' }}>
      <div className="w-full px-4 md:px-32 pt-12 md:pt-24 relative">
        {/* Decorative Stars */}
        <div className="hidden md:block absolute right-4 md:right-12 top-4 md:top-12">
          <StarIcon className="h-8 md:h-12 w-8 md:w-12 text-yellow-400" />
        </div>
        <div className="absolute right-8 md:right-24 top-20">
          <StarIcon className="h-20 w-20 text-yellow-400 opacity-80" />
        </div>
        <div className="absolute left-0 bottom-0">
          <StarIcon className="h-32 w-32 text-yellow-400 opacity-50 transform rotate-90" />
        </div>

        <div
          className="mt-10 md:mt-4 ml-4 md:ml-28 text-xl tracking-tight"
          style={{ color: 'rgba(255, 214, 53, 1)' }}
        >
          Worked before at
        </div>
        <div
          className="ml-4 md:ml-28 mt-1 md:mt-2 mb-3 md:mb-6 text-4xl"
          style={{ color: 'rgba(22, 22, 22, 1)' }}
        >
          {experienceTitle}
        </div>

        <div className="w-full px-4 md:px-12 mt-12 md:mt-16 flex flex-col md:flex-row gap-4 md:gap-8 ml-4 md:ml-28">
          {experience && experience.map((item, index) => (
            <div 
              key={index} 
              className="w-72 md:w-80 p-3 md:p-4 rounded-lg border hover:border-yellow-400 transition-colors duration-300"
            >
              <div className="flex flex-col items-center">
                {index % 2 === 0 ? (
                  <BriefcaseIcon className="h-12 md:h-16 w-12 md:w-16 mb-2 text-gray-700" />
                ) : (
                  <BuildingOfficeIcon className="h-12 md:h-16 w-12 md:w-16 mb-2 text-gray-700" />
                )}
                
                <div
                  className="text-[1rem] md:text-[1.05rem] capitalize text-center font-medium"
                  style={{ color: 'rgba(22, 22, 22, 1)' }}
                >
                  {item.experience.company}
                </div>
                <div
                  className="mb-1 text-xs md:text-sm capitalize text-center"
                  style={{ color: 'rgba(22, 22, 22, 0.5)' }}
                >
                  {item.experience.position}
                </div>
                <div
                  className="mb-1 text-xs md:text-sm text-center"
                  style={{ color: 'rgba(22, 22, 22, 0.5)' }}
                >
                  {item.experience.desc.slice(0, 300)}
                </div>
              </div>
              <div className="text-xs md:text-sm text-gray-400 flex items-center justify-center text-center mt-2">
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                <span>
                  {`${item.experience.start} - ${item.experience.end ? item.experience.end : item.experience.presentJob ? 'Present' : ''}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Option1;