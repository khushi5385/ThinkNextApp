import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Attendance from './components/Attendance';
import StudentDashboard from './pages/StudentDashboard';
import Navbar from './components/Navbar'; // Add this import
import './App.css';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="empty-state"><i className="fas fa-spinner fa-spin"></i><p>Loading...</p></div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} />;
  }

  return children;
}

// Admin Layout
function AdminLayout() {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <div className="content-container">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

// Main App Component
function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="empty-state"><i className="fas fa-spinner fa-spin"></i><p>Loading...</p></div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // For admin users - redirect to admin routes
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }

  // For student users - redirect to student routes
  if (user.role === 'student') {
    return <Navigate to="/student/dashboard" />;
  }

  return <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          } />
          <Route path="/student/*" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;