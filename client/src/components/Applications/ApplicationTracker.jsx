import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';

const statusColumns = {
  applied: { title: 'Applied', color: 'bg-blue-100' },
  screening: { title: 'Screening', color: 'bg-yellow-100' },
  interview: { title: 'Interview', color: 'bg-purple-100' },
  offer: { title: 'Offer', color: 'bg-green-100' },
  rejected: { title: 'Rejected', color: 'bg-red-100' },
  accepted: { title: 'Accepted', color: 'bg-emerald-100' }
};

const ApplicationTracker = ({ applications, onStatusUpdate }) => {
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    // Group applications by status
    const groupedApps = applications.reduce((acc, app) => {
      if (!acc[app.status]) acc[app.status] = [];
      acc[app.status].push(app);
      return acc;
    }, {});
    setGrouped(groupedApps);
  }, [applications]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      // Update application status
      onStatusUpdate(draggableId, destination.droppableId);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(statusColumns).map(([status, { title, color }]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`${color} p-4 rounded-lg min-h-[400px]`}
              >
                <h3 className="font-semibold mb-4">{title}</h3>
                <div className="space-y-3">
                  {grouped[status]?.map((application, index) => (
                    <Draggable
                      key={application._id}
                      draggableId={application._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded shadow-sm"
                        >
                          <h4 className="font-medium">{application.job.title}</h4>
                          <p className="text-sm text-gray-600">
                            {application.job.company}
                          </p>
                          <div className="mt-2 text-xs text-gray-500">
                            Applied: {format(new Date(application.createdAt), 'MMM dd, yyyy')}
                          </div>
                          {application.matchScore && (
                            <div className="mt-2 flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-blue-600 h-1.5 rounded-full"
                                  style={{ width: `${application.matchScore}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs font-medium">
                                {application.matchScore}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default ApplicationTracker; 