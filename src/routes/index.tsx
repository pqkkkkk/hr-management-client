import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "shared/components/ProtectedRoute";
import LoginPage from "shared/components/LoginPage";
import Dashboard from "shared/components/Dashboard";
import UnauthorizedPage from "shared/components/UnauthorizedPage";
import Layout from "shared/components/Layout";
import { EmployeeUpdatePage, EmployeeListPage } from "modules/profile/pages";

// Placeholder components for routes that will be implemented later
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-600">Trang này đang được phát triển...</p>
  </div>
);

// Request placeholder pages
const RequestListPage = () => <PlaceholderPage title="Danh sách yêu cầu" />;
const CreateLeaveRequestPage = () => (
  <PlaceholderPage title="Tạo yêu cầu nghỉ phép" />
);
const CreateCheckInRequestPage = () => (
  <PlaceholderPage title="Tạo yêu cầu check-in" />
);
const CreateCheckOutRequestPage = () => (
  <PlaceholderPage title="Tạo yêu cầu check-out" />
);
const CreateTimesheetUpdatePage = () => (
  <PlaceholderPage title="Cập nhật timesheet" />
);
const CreateWFHRequestPage = () => <PlaceholderPage title="Tạo yêu cầu WFH" />;
const ManageRequestsPage = () => <PlaceholderPage title="Quản lý yêu cầu" />;
const AttendancePage = () => <PlaceholderPage title="Bảng chấm công" />;

// Profile placeholder pages
const ProfilePage = () => <PlaceholderPage title="Thông tin cá nhân" />;
const EditProfilePage = () => <EmployeeUpdatePage />;
// (Real) EmployeeListPage is imported from modules/profile/pages
const EmployeeDetailPage = () => <PlaceholderPage title="Chi tiết nhân viên" />;

// Activity placeholder pages
const ActivityListPage = () => <PlaceholderPage title="Tất cả hoạt động" />;
const ActivityDetailPage = () => <PlaceholderPage title="Chi tiết hoạt động" />;
const ActivityCertificatesPage = () => <PlaceholderPage title="Chứng nhận" />;
const ActivitySummaryPage = () => (
  <PlaceholderPage title="Tổng kết hoạt động" />
);

// Reward placeholder pages
const PointsOverviewPage = () => <PlaceholderPage title="Tổng quan điểm" />;
const TransactionHistoryPage = () => (
  <PlaceholderPage title="Lịch sử giao dịch" />
);
const RedeemPointsPage = () => <PlaceholderPage title="Đổi quà" />;
const GiftPointsPage = () => <PlaceholderPage title="Tặng điểm" />;
const TeamPointsReportPage = () => <PlaceholderPage title="Báo cáo team" />;

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
        <Route path="requests">
          <Route index element={<RequestListPage />} />
          <Route path="leave/create" element={<CreateLeaveRequestPage />} />
          <Route
            path="check-in/create"
            element={<CreateCheckInRequestPage />}
          />
          <Route
            path="check-out/create"
            element={<CreateCheckOutRequestPage />}
          />
          <Route
            path="timesheet/create"
            element={<CreateTimesheetUpdatePage />}
          />
          <Route path="wfh/create" element={<CreateWFHRequestPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route
            path="manage"
            element={
              <ProtectedRoute allowedRoles={["MANAGER", "HR", "ADMIN"]}>
                <ManageRequestsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Profile routes */}
        <Route path="profile">
          <Route index element={<ProfilePage />} />
          <Route path="edit" element={<EditProfilePage />} />
          {/* thêm để test giao diện */}
          <Route path="view" element={<EmployeeListPage />} />
          <Route
            path="employees"
            element={
              <ProtectedRoute allowedRoles={["MANAGER", "HR", "ADMIN"]}>
                <EmployeeListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="employees/:id"
            element={
              <ProtectedRoute allowedRoles={["MANAGER", "HR", "ADMIN"]}>
                <EmployeeDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Activity routes */}
        <Route path="activities">
          <Route index element={<ActivityListPage />} />
          <Route path=":id" element={<ActivityDetailPage />} />
          <Route path="certificates" element={<ActivityCertificatesPage />} />
          <Route
            path="summary"
            element={
              <ProtectedRoute allowedRoles={["MANAGER", "HR", "ADMIN"]}>
                <ActivitySummaryPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Reward routes */}
        <Route path="rewards">
          <Route index element={<PointsOverviewPage />} />
          <Route path="transactions" element={<TransactionHistoryPage />} />
          <Route path="redeem" element={<RedeemPointsPage />} />
          <Route
            path="gift"
            element={
              <ProtectedRoute allowedRoles={["MANAGER", "HR", "ADMIN"]}>
                <GiftPointsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="team-report"
            element={
              <ProtectedRoute allowedRoles={["MANAGER", "HR", "ADMIN"]}>
                <TeamPointsReportPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
