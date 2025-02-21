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
      </Route>
    </Routes>
  )
}

export default App
