import { Route } from "react-router-dom";
import {
  TransactionHistoryPage,
  GiftPage,
  GiftedPointTransactionPage,
  RewardProgramDetailPage,
} from "./pages";

const RewardRoutes = (
  <Route path="/rewards">
    <Route path="transactions" element={<TransactionHistoryPage />} />
    <Route path="gift" element={<GiftPage />} />
    <Route
      path="gifted-transactions"
      element={<GiftedPointTransactionPage />}
    />
    <Route path="programs/:id" element={<RewardProgramDetailPage />} />
  </Route>
);

export default RewardRoutes;
