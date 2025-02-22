import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ArrowLeftIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsDashboard = ({ onClose, applications = [] }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [readinessScore, setReadinessScore] = useState(75);
  
  // Process applications data for charts
  const processApplicationData = () => {
    const monthsMap = {};
    const today = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      monthsMap[monthKey] = 0;
    }

    // Count applications by month
    applications.forEach(app => {
      const date = new Date(app.applicationDate);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      if (monthsMap.hasOwnProperty(monthKey)) {
        monthsMap[monthKey]++;
      }
    });

    return {
      labels: Object.keys(monthsMap),
      datasets: [{
        label: 'Applications Submitted',
        data: Object.values(monthsMap),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }]
    };
  };

  // Process status data
  const processStatusData = () => {
    const statusCounts = {
      'Applied': 0,
      'Interview Scheduled': 0,
      'Offer Received': 0,
      'Rejected': 0,
      'Pending': 0
    };

    applications.forEach(app => {
      if (statusCounts.hasOwnProperty(app.status)) {
        statusCounts[app.status]++;
      }
    });

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)', // blue
          'rgba(234, 179, 8, 0.6)',  // yellow
          'rgba(34, 197, 94, 0.6)',  // green
          'rgba(239, 68, 68, 0.6)',  // red
          'rgba(107, 114, 128, 0.6)' // gray
        ],
      }]
    };
  };

  // Calculate metrics
  const calculateMetrics = () => {
    const total = applications.length;
    const interviews = applications.filter(app => app.status === 'Interview Scheduled').length;
    const offers = applications.filter(app => app.status === 'Offer Received').length;
    const active = applications.filter(app => ['Applied', 'Pending'].includes(app.status)).length;

    return {
      total,
      interviewRate: total ? ((interviews / total) * 100).toFixed(1) : 0,
      successRate: total ? ((offers / total) * 100).toFixed(1) : 0,
      active
    };
  };

  const metrics = calculateMetrics();
  const applicationData = processApplicationData();
  const statusData = processStatusData();

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your job search progress</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-150"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{metrics.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{metrics.successRate}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">Interview Rate</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{metrics.interviewRate}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Applications</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{metrics.active}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
            <Bar data={applicationData} options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              }
            }} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
            <Doughnut data={statusData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' }
              }
            }} />
          </div>
        </div>

        {/* Dynamic Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-blue-600" />
              Job Search Insights
            </div>
          </h3>
          <div className="space-y-4">
            {metrics.interviewRate > 20 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-green-800">Your interview success rate is above average at {metrics.interviewRate}%!</p>
              </div>
            )}
            {metrics.total < 5 && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">Consider applying to more positions to increase your chances of success.</p>
              </div>
            )}
            {metrics.active > 10 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">You have {metrics.active} active applications. Keep tracking their progress!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 