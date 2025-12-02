import React from 'react';
import { Route } from 'react-router-dom';
import { CreateLeaveRequestPage, RequestHistoryPage } from './pages';

const RequestRoutes = (
    <Route path="/requests">
      <Route path="my-requests" element={<RequestHistoryPage />} />
      <Route path="create/leave" element={<CreateLeaveRequestPage />} />
    </Route>
);

export default RequestRoutes;
