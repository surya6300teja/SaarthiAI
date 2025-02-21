const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Total Resumes</h3>
        <p className="text-3xl font-bold">{stats.totalResumes}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Applications</h3>
        <p className="text-3xl font-bold">{stats.totalApplications}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Interviews</h3>
        <p className="text-3xl font-bold">{stats.interviewsScheduled}</p>
      </div>
    </div>
  );
};

export default DashboardStats; 