import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { format } from 'date-fns';
import {
  VideoCameraIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const InterviewDetailModal = ({ interview, onClose, onUpdate }) => {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState(interview.status);

  const getInterviewTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <VideoCameraIcon className="w-5 h-5" />;
      case 'phone':
        return <PhoneIcon className="w-5 h-5" />;
      case 'onsite':
        return <BuildingOfficeIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await onUpdate({
        id: interview._id,
        status: newStatus,
        feedback,
      });
    } catch (error) {
      console.error('Error updating interview status:', error);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Dialog.Title className="text-xl font-semibold">
                Interview with {interview.candidate.name}
              </Dialog.Title>
              <p className="text-gray-600">{interview.position}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              getStatusColor(interview.status)
            }`}>
              {interview.status}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <span>{format(new Date(interview.start), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5 text-gray-400" />
              <span>{format(new Date(interview.start), 'h:mm a')}</span>
            </div>
            <div className="flex items-center space-x-2">
              {getInterviewTypeIcon(interview.type)}
              <span className="capitalize">{interview.type} Interview</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Duration:</span>
              <span>{interview.duration} minutes</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Interview Details</h3>
            <p className="text-gray-600">{interview.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Candidate Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{interview.candidate.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{interview.candidate.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Resume</p>
                  <a
                    href={interview.candidate.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300"
              placeholder="Enter interview feedback..."
            />
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="space-x-2">
              <button
                onClick={() => handleStatusUpdate('completed')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Mark as Completed
              </button>
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel Interview
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

const getStatusColor = (status) => {
  const colors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default InterviewDetailModal; 