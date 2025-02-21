import { useState, useEffect } from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DashboardAnalytics = ({ applications, resumes }) => {
  const [applicationStats, setApplicationStats] = useState({
    totalApplications: 0,
    interviewRate: 0,
    responseRate: 0,
    statusDistribution: {},
    applicationTrends: []
  });

  useEffect(() => {
    calculateStats();
  }, [applications]);

  const calculateStats = () => {
    const total = applications.length;
    const interviews = applications.filter(app => app.status === 'interview').length;
    const responses = applications.filter(app => app.status !== 'applied').length;

    // Calculate status distribution
    const distribution = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    // Calculate application trends (last 6 months)
    const trends = calculateApplicationTrends(applications);

    setApplicationStats({
      totalApplications: total,
      interviewRate: (interviews / total) * 100,
      responseRate: (responses / total) * 100,
      statusDistribution: distribution,
      applicationTrends: trends
    });
  };

  const calculateApplicationTrends = (applications) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trends = applications
      .filter(app => new Date(app.createdAt) >= sixMonthsAgo)
      .reduce((acc, app) => {
        const month = new Date(app.createdAt).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

    return Object.entries(trends).map(([month, count]) => ({
      month,
      applications: count
    }));
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-blue-600">
            {applicationStats.totalApplications}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Interview Rate</h3>
          <p className="text-3xl font-bold text-green-600">
            {applicationStats.interviewRate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Response Rate</h3>
          <p className="text-3xl font-bold text-purple-600">
            {applicationStats.responseRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Application Trends Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Application Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={applicationStats.applicationTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#3B82F6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Status Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Application Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(applicationStats.statusDistribution).map(
                  ([status, count]) => ({
                    name: status,
                    value: count
                  })
                )}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#3B82F6"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Resume Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={resumes.map(resume => ({
                name: resume.title,
                score: resume.atsScore
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics; 