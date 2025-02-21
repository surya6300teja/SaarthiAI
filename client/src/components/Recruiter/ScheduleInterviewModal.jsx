import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ScheduleInterviewModal = ({ slot, onClose, onSchedule }) => {
  const [formData, setFormData] = useState({
    candidate: '',
    position: '',
    type: 'video',
    start: slot.start,
    duration: 60,
    description: '',
    interviewers: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule(formData);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            Schedule Interview
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate
              </label>
              <select
                value={formData.candidate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  candidate: e.target.value
                }))}
                className="w-full rounded-md border-gray-300"
                required
              >
                <option value="">Select Candidate</option>
                {/* Add candidates dynamically */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  position: e.target.value
                }))}
                className="w-full rounded-md border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  type: e.target.value
                }))}
                className="w-full rounded-md border-gray-300"
              >
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
                <option value="onsite">On-site</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time
                </label>
                <DatePicker
                  selected={formData.start}
                  onChange={(date) => setFormData(prev => ({
                    ...prev,
                    start: date
                  }))}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    duration: parseInt(e.target.value)
                  }))}
                  className="w-full rounded-md border-gray-300"
                  min="15"
                  step="15"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                rows={3}
                className="w-full rounded-md border-gray-300"
              />
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Schedule Interview
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default ScheduleInterviewModal; 