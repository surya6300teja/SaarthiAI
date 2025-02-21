import React from 'react';

export const templates = {
  modern: {
    name: 'Modern',
    render: (data) => (
      <div className="font-sans">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{data.basics.name}</h1>
          <p className="text-xl text-gray-600">{data.basics.title}</p>
          <div className="flex justify-center gap-4 mt-2 text-gray-600">
            <span>{data.basics.email}</span>
            <span>{data.basics.phone}</span>
            <span>{data.basics.location}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 mb-3">
            Professional Summary
          </h2>
          <p className="text-gray-700">{data.basics.summary}</p>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 mb-3">
            Experience
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                <span className="text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-gray-700 font-medium">{exp.company}</p>
              <p className="text-gray-600 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 mb-3">
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                <span className="text-gray-600">{edu.graduationDate}</span>
              </div>
              <p className="text-gray-700">{edu.school}</p>
              <p className="text-gray-600 mt-2">{edu.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },

  professional: {
    name: 'Professional',
    render: (data) => (
      <div className="font-serif max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-blue-700 text-white px-8 py-12 text-center">
          <h1 className="text-4xl font-bold">{data.basics.name}</h1>
          <p className="text-xl mt-2">{data.basics.title}</p>
          <div className="flex gap-6 mt-4 text-blue-100 justify-center">
            <span>{data.basics.email}</span>
            <span>{data.basics.phone}</span>
            <span>{data.basics.location}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="px-8 py-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{data.basics.summary}</p>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Experience</h2>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                  <span className="text-gray-600">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-blue-600 font-semibold mb-2">{exp.company}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">{edu.degree}</h3>
                <p className="text-blue-600">{edu.school}</p>
                <p className="text-gray-600">{edu.graduationDate}</p>
                <p className="text-gray-700 mt-2">{edu.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
};

export default templates; 