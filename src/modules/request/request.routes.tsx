import React from "react";
import { Route } from "react-router-dom";
import {
  CreateLeaveRequestPage,
  RequestHistoryPage,
  RequestManagementPage,
  RequestDetailPage,
  CheckInRequestForm,
} from "./pages";

const RequestRoutes = (
  <Route path="/requests">
    <Route path="my-requests" element={<RequestHistoryPage />} />
    <Route path="create/leave" element={<CreateLeaveRequestPage />} />
    <Route path="manage" element={<RequestManagementPage />} />
    <Route path="manage/:requestId" element={<RequestDetailPage />} />
    <Route path="create/check-in" element={<CheckInRequestForm />} />
  </Route>
);

export default RequestRoutes;
