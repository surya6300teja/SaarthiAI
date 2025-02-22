import { useState } from 'react';
import { 
  BriefcaseIcon, 
  CalendarIcon, 
  MapPinIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const JobApplicationsList = ({ applications, onDelete, onEdit }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'bg-blue-100 text-blue-800',
      'Interview Scheduled': 'bg-yellow-100 text-yellow-800',
      'Offer Received': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Pending': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {applications.map((application, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">{application.jobTitle}</h3>
              <div className="flex items-center text-gray-500">
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                <span>{application.companyName}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span>{application.location}</span>
              </div>
              {application.salary && (
                <div className="flex items-center text-gray-500">
                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                  <span>{application.salary}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
              {application.deadline && (
                <div className="flex items-center text-gray-500 text-sm">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Due: {new Date(application.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {application.notes && (
            <div className="mt-4 text-gray-600">
              <p>{application.notes}</p>
            </div>
          )}

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => onEdit(application)}
              className="text-gray-600 hover:text-gray-800"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(application.id)}
              className="text-red-600 hover:text-red-800"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobApplicationsList; 