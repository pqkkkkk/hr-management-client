import { Route } from "react-router-dom";
import {
  TransactionHistoryPage,
  GiftPage,
  GiftedPointTransactionPage,
  RewardProgramDetailPage,
  CreateRewardProgramPage,
  AdminRewardManagementPage,
} from "./pages";
import ProtectedRoute from "shared/components/ProtectedRoute";
import EditRewardProgramPage from "./pages/EditRewardProgramPage";

const RewardRoutes = (
  <Route path="/rewards">
    <Route path="transactions" element={<TransactionHistoryPage />} />
    <Route path="gift" element={
      <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
        <GiftPage />
      </ProtectedRoute>
    } />
    <Route
      path="gifted-transactions"
      element={
        <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
          <GiftedPointTransactionPage />
        </ProtectedRoute>
      }
    />
    <Route path="programs/:id" element={<RewardProgramDetailPage />} />
    <Route path="programs/create" element={
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <CreateRewardProgramPage />
      </ProtectedRoute>
    } />
    <Route path="programs/current-active" element={
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminRewardManagementPage />
      </ProtectedRoute>
    } />
    <Route path="programs/edit/:id" element={
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <EditRewardProgramPage />
      </ProtectedRoute>
    } />
  </Route>
);

export default RewardRoutes;
