import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import UploadPage from './pages/UploadPage';
import AdminDashboard from './pages/AdminDashboard';
import PresentationView from './pages/PresentationView';
import EvaluationPage from './pages/EvaluationPage';
import AdminScores from './pages/AdminScores';
import AdminJuries from './pages/AdminJuries';
import LandingPage from './pages/LandingPage';

function AppRoutes() {
  const { currentUser, currentUserRole } = useData();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes inside Layout */}
      <Route
        path="/upload"
        element={
          currentUser && currentUserRole === 'participant' ? (
            <Layout><UploadPage /></Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/evaluation"
        element={
          currentUser && currentUserRole === 'jury' ? (
            <Layout><EvaluationPage /></Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/evaluation/:teamId"
        element={
          currentUser && currentUserRole === 'jury' ? (
            <Layout><EvaluationPage /></Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin"
        element={
          currentUser && currentUserRole === 'admin' ? (
            <Layout><AdminDashboard /></Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin/juries"
        element={
          currentUser && currentUserRole === 'admin' ? (
            <Layout><AdminJuries /></Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin/scores"
        element={
          currentUser && currentUserRole === 'admin' ? (
            <Layout><AdminScores /></Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/presentation/:teamId"
        element={<Layout><PresentationView /></Layout>}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;