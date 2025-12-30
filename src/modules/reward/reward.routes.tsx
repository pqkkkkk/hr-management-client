import { Route } from "react-router-dom";
import {
  TransactionHistoryPage,
  GiftPage,
  GiftedPointTransactionPage,
  RewardProgramDetailPage,
  CreateRewardProgramPage,
} from "./pages";
import ProtectedRoute from "shared/components/ProtectedRoute";

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
  </Route>
);

export default RewardRoutes;
