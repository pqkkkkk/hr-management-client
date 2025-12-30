import React from "react";
import ActivityListPage from "./ActivityListPage";

/**
 * Admin/Manager view: Shows all activities with status filter and create button
 */
const AdminActivityListPage: React.FC = () => {
    return (
        <ActivityListPage
            title="Quản lý hoạt động"
            description="Tạo và quản lý các hoạt động chạy bộ của công ty"
            showStatusFilter={true}
            showCreateButton={true}
        />
    );
};

export default AdminActivityListPage;
