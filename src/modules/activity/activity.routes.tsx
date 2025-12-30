import React from "react";
import { Route } from "react-router-dom";
import {
    EmployeeActivityListPage,
    AdminActivityListPage,
    MyActivitiesPage,
    ActivityDetailPage,
    SubmitResultPage,
    CreateActivityPage,
    EditActivityPage,
    PendingLogsPage,
    ActivitySummaryPage,
    ActivityOverviewPage,
} from "./pages";
import ProtectedRoute from "shared/components/ProtectedRoute";

const ActivityRoutes = (
    <>
        {/* Employee routes */}
        <Route path="activities" element={<EmployeeActivityListPage />} />
        <Route path="activities/me" element={<MyActivitiesPage />} />
        <Route path="activities/:id" element={<ActivityDetailPage />} />
        <Route path="activities/:id/submit" element={<SubmitResultPage />} />

        {/* Manager overview route - view summaries only */}
        <Route
            path="activities/overview"
            element={
                <ProtectedRoute allowedRoles={["MANAGER", "HR", "ADMIN"]}>
                    <ActivityOverviewPage />
                </ProtectedRoute>
            }
        />

        {/* Admin/Manager routes - full management */}
        <Route
            path="activities/manage"
            element={
                <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                    <AdminActivityListPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="activities/create"
            element={
                <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                    <CreateActivityPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="activities/manage/:id/edit"
            element={
                <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                    <EditActivityPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="activities/pending-logs"
            element={
                <ProtectedRoute allowedRoles={["MANAGER", "HR", "ADMIN"]}>
                    <PendingLogsPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="activities/manage/:id/summary"
            element={
                <ProtectedRoute allowedRoles={["MANAGER", "HR", "ADMIN"]}>
                    <ActivitySummaryPage />
                </ProtectedRoute>
            }
        />
    </>
);

export default ActivityRoutes;
