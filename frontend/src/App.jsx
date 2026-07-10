import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './context/AuthContext';

// Components
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { JDMatcher } from './pages/JDMatcher';
import { CareerCoach } from './pages/CareerCoach';
import { MockInterview } from './pages/MockInterview';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { RecruiterDashboard } from './pages/RecruiterDashboard';

// Main layout for dashboard & coach tools
const AppLayout = ({ title }) => {
  return (
    <div className="flex bg-darkBg-900 min-h-screen text-slate-100 font-sans">
      <Sidebar />
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        <Header title={title} />
        <main className="p-6 md:p-8 flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Pages wrapped in the admin/dashboard layout */}
            <Route element={<AppLayout title="Dashboard" />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<AppLayout title="Resume ATS Analyzer" />}>
              <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
            </Route>
            <Route element={<AppLayout title="Job Match Analyzer" />}>
              <Route path="/jd-matcher" element={<JDMatcher />} />
            </Route>
            <Route element={<AppLayout title="AI Career Roadmap" />}>
              <Route path="/career-coach" element={<CareerCoach />} />
            </Route>
            <Route element={<AppLayout title="AI Mock Interview Simulator" />}>
              <Route path="/mock-interview" element={<MockInterview />} />
            </Route>
            <Route element={<AppLayout title="Recruiter Screening Dashboard" />}>
              <Route path="/recruiter" element={<RecruiterDashboard />} />
            </Route>
            <Route element={<AppLayout title="User Profile" />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route element={<AppLayout title="Admin Control Center" />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>

          {/* Fallback redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      
      {/* Toast notification component */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-panel text-slate-100 border border-slate-800',
          duration: 3500,
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
