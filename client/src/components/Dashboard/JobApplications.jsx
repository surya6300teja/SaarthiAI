import { format } from 'date-fns';

const statusColors = {
  applied: 'bg-blue-100 text-blue-800',
  interview: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
  accepted: 'bg-green-100 text-green-800',
};

const JobApplications = ({ applications }) => {
  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application._id}
          className="border rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{application.job.title}</h3>
              <p className="text-sm text-gray-500">{application.job.company}</p>
              <p className="text-sm text-gray-500">
                Applied: {format(new Date(application.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[application.status]
              }`}
            >
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobApplications; 