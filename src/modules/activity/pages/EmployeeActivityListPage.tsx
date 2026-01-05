import React from "react";
import ActivityListPage from "./ActivityListPage";
import { ActivityStatus } from "../types/activity.types";

/**
 * Employee view: Only shows OPEN activities, no status filter, no create button
 */
const EmployeeActivityListPage: React.FC = () => {
    return (
        <ActivityListPage
            title="Hoạt động đang diễn ra"
            description="Tham gia các hoạt động chạy bộ của công ty"
            showStatusFilter={false}
            defaultStatus={ActivityStatus.IN_PROGRESS}
            showCreateButton={false}
        />
    );
};

export default EmployeeActivityListPage;
