import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import HomePage from './pages/HomePage';
import MaterialsPage from './pages/MaterialsPage';
import StudyPage from './pages/StudyPage';
import RecordsPage from './pages/RecordsPage';
import SchedulePage from './pages/SchedulePage';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<AuthForm />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/materials"
            element={
              <PrivateRoute>
                <Layout>
                  <MaterialsPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/study"
            element={
              <PrivateRoute>
                <Layout>
                  <StudyPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/records"
            element={
              <PrivateRoute>
                <Layout>
                  <RecordsPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <PrivateRoute>
                <Layout>
                  <SchedulePage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;