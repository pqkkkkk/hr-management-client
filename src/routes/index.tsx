import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "shared/components/ProtectedRoute";
import LoginPage from "shared/components/LoginPage";
import Dashboard from "shared/components/Dashboard";
import UnauthorizedPage from "shared/components/UnauthorizedPage";
import Layout from "shared/components/Layout";
import { ProfileRoutes } from "modules/profile/pages/profile.routes";
import RequestRoutes from "modules/request/request.routes";
import RewardRoutes from "modules/reward/reward.routes";
import ActivityRoutes from "modules/activity/activity.routes";

// Placeholder components for routes that will be implemented later
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-600">Trang này đang được phát triển...</p>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-8">Trang không tồn tại</p>
    </div>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Request routes */}
        {RequestRoutes}

        {/* Profile routes */}
        {ProfileRoutes}

        {/* Activity routes */}
        {ActivityRoutes}

        {/* Reward routes */}
        {RewardRoutes}
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
