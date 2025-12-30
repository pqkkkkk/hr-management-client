import React from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    description?: string;
    action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = "Không có dữ liệu",
    description = "Chưa có hoạt động nào được tìm thấy.",
    action,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Inbox size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-center max-w-md mb-4">{description}</p>
            {action}
        </div>
    );
};

export default EmptyState;
