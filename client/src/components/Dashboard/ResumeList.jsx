import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ResumeList = ({ resumes }) => {
  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <div
          key={resume._id}
          className="border rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{resume.basics.title}</h3>
              <p className="text-sm text-gray-500">
                Last updated: {format(new Date(resume.updatedAt), 'MMM dd, yyyy')}
              </p>
            </div>
            <div className="space-x-2">
              <Link
                to={`/resume/${resume._id}/edit`}
                className="btn-secondary btn-sm"
              >
                Edit
              </Link>
              <Link
                to={`/resume/${resume._id}/preview`}
                className="btn-primary btn-sm"
              >
                Preview
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumeList; 