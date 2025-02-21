import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const InterviewScheduler = () => {
  const [interviews, setInterviews] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
  };

  const handleSelectEvent = (event) => {
    setSelectedInterview(event);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Interview Schedule</h2>
        <button
          onClick={() => setSelectedSlot({ start: new Date() })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Schedule New Interview
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <Calendar
              localizer={localizer}
              events={interviews}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              views={['month', 'week', 'day']}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Upcoming Interviews</h3>
            <div className="space-y-2">
              {interviews
                .filter(interview => new Date(interview.start) > new Date())
                .sort((a, b) => new Date(a.start) - new Date(b.start))
                .map(interview => (
                  <div
                    key={interview._id}
                    className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedInterview(interview)}
                  >
                    <div className="text-sm font-medium">{interview.candidate.name}</div>
                    <div className="text-xs text-gray-500">
                      {moment(interview.start).format('MMM DD, YYYY h:mm A')}
                    </div>
                    <div className="text-xs text-gray-500">{interview.position}</div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Interview Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {interviews.length}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {interviews.filter(i => i.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Scheduling Modal */}
      {selectedSlot && (
        <ScheduleInterviewModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSchedule={async (interviewData) => {
            // Handle interview scheduling
            setSelectedSlot(null);
          }}
        />
      )}

      {/* Interview Detail Modal */}
      {selectedInterview && (
        <InterviewDetailModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onUpdate={async (updates) => {
            // Handle interview updates
            setSelectedInterview(null);
          }}
        />
      )}
    </div>
  );
};

export default InterviewScheduler; 