import { Route } from "react-router-dom";
import {
  TransactionHistoryPage,
  GiftPage,
  GiftedPointTransactionPage,
} from "./pages";

const RewardRoutes = (
  <Route path="/rewards">
    <Route path="transactions" element={<TransactionHistoryPage />} />
    <Route path="gift" element={<GiftPage />} />
    <Route
      path="gifted-transactions"
      element={<GiftedPointTransactionPage />}
    />
  </Route>
);

export default RewardRoutes;
