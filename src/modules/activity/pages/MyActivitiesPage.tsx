import React from "react";
import ActivityListPage from "./ActivityListPage";

/**
 * My Activities: Shows activities the user has joined
 */
const MyActivitiesPage: React.FC = () => {
    return (
        <ActivityListPage
            title="Hoạt động đã tham gia"
            description="Danh sách các hoạt động bạn đã đăng ký tham gia"
            showStatusFilter={false}
            showCreateButton={false}
            myActivitiesOnly={true}
        />
    );
};

export default MyActivitiesPage;
