import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resumeService, jobService } from '../services/api';
import DashboardStats from '../components/Dashboard/DashboardStats';
import ResumeList from '../components/Dashboard/ResumeList';
import JobApplications from '../components/Dashboard/JobApplications';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
  });
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resumesRes, applicationsRes] = await Promise.all([
        resumeService.getAll(),
        jobService.getApplications(),
      ]);

      setResumes(resumesRes.data.data);
      setApplications(applicationsRes.data.data);
      
      setStats({
        totalResumes: resumesRes.data.data.length,
        totalApplications: applicationsRes.data.data.length,
        interviewsScheduled: applicationsRes.data.data.filter(
          app => app.status === 'interview'
        ).length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <Link
            to="/resume-builder"
            className="btn-primary"
          >
            Create Resume
          </Link>
          <Link
            to="/portfolio-builder"
            className="btn-secondary"
          >
            Create Portfolio
          </Link>
        </div>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Resumes</h2>
          <ResumeList resumes={resumes} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
          <JobApplications applications={applications} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 