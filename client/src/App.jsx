import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './components/Dashboard'
import ResumeBuilder from './components/ResumeBuilder/ResumeBuilder'
import ProtectedRoute from './components/ProtectedRoute'
import RecruiterLogin from './components/Recruiter/RecruiterLogin'
import RecruiterRegister from './components/Recruiter/RecruiterRegister'
import RecruiterDashboard from './components/Recruiter/RecruiterDashboard'
import UploadPage from './components/Skill-Craft/upload'
import ResultPage from './components/Skill-Craft/result'
import CoursesPage from './components/Skill-Craft/courses'
import PortfolioCard from './components/Portfolio/components/portfolioCard'



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/resume-builder"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />
        
        <Route path="/recruiter/login" element={<RecruiterLogin />} />
        <Route path="/recruiter/register" element={<RecruiterRegister />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/skill-craft" element={<UploadPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/portfolio-builder" element={< PortfolioCard />} />
      </Route>
    </Routes>
  )
}

export default App
