import { Route } from "react-router-dom";
import {
  CreateLeaveRequestPage,
  RequestHistoryPage,
  RequestManagementPage,
  RequestDetailPage,
  CheckInRequestForm,
  CheckOutRequestForm,
  TimesheetViewPage,
  WfhRequestForm,
  UpdateTimesheetRequestForm,
  CreateRequest,
} from "./pages";

const RequestRoutes = (
  <Route path="/requests">
    <Route path="my-requests" element={<RequestHistoryPage />} />
    <Route path="create/leave" element={<CreateLeaveRequestPage />} />
    <Route path="manage" element={<RequestManagementPage />} />
    <Route path="manage/:requestId" element={<RequestDetailPage />} />
    <Route path="create" element={<CreateRequest />} />
    <Route path="create/check-in" element={<CheckInRequestForm />} />
    <Route path="create/check-out" element={<CheckOutRequestForm />} />
    <Route path="create/wfh" element={<WfhRequestForm isModalMode={false} open={true} />} />
    <Route path="create/update-timesheet" element={<UpdateTimesheetRequestForm />} />
    <Route path="timesheet" element={<TimesheetViewPage />} />
  </Route>
);

export default RequestRoutes;
