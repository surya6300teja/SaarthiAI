import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function CoursesPage() {
  const location = useLocation();
  const { courses } = location.state || {};

  return (
    <div className="min-h-screen bg-white text-gray-800 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzIwMjAyMDA1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-10"></div>

      <motion.div 
        className="absolute top-20 left-20 w-20 h-20 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
      />

      <motion.div 
        className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
      />

      <header className="text-center py-8 relative z-10">
        <motion.h1 
          className="text-6xl font-bold mb-2 font-display text-indigo-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          SkillCraft
        </motion.h1>
        <motion.p 
          className="text-2xl text-gray-600"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Recommended Courses
        </motion.p>
      </header>

      <div className="flex-grow overflow-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Object.entries(courses).map(([skill, skillCourses], index) => (
            <motion.div 
              key={skill} 
              className="bg-gray-50 rounded-xl shadow-lg overflow-hidden border border-gray-200"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
                <h2 className="text-2xl font-semibold">{skill}</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {skillCourses.map((course, courseIndex) => (
                  <motion.li 
                    key={courseIndex} 
                    className="p-4 hover:bg-gray-100 transition duration-300 ease-in-out"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (index * 0.1) + (courseIndex * 0.05) }}
                  >
                    <a href={course.url} target="_blank" rel="noopener noreferrer" className="block group">
                      <h3 className="text-lg font-medium text-indigo-600 mb-1 group-hover:text-indigo-700 transition duration-300">{course.name}</h3>
                      <p className="text-gray-600 flex items-center text-sm">
                        <span className="mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        </span>
                        {course.provider}
                      </p>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className='text-center py-8 relative z-10'>
          <motion.p 
            className="text-sm text-gray-600"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Note: Some of the course links may not be updated. If a link doesn't work, please search for the course name manually.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;