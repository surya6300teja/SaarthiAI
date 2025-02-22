import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const JobApplicationForm = ({ onSubmit, onClose }) => {
  const initialState = {
    companyName: '',
    jobTitle: '',
    location: '',
    salary: '',
    status: 'Applied',
    deadline: '',
    notes: '',
    applicationDate: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialState);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Job Application</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Salary</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g., $80,000/year"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Applied">Applied</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer Received">Offer Received</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes about the application..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm; 