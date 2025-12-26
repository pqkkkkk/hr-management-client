import React from "react";
import { Search, Filter } from "lucide-react";
import { ActivityStatus } from "../types/activity.types";

interface ActivityFilterProps {
    filters: {
        search?: string;
        status?: string;
        type?: string;
    };
    onFilterChange: (filters: any) => void;
    showStatusFilter?: boolean;
}

const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: ActivityStatus.OPEN, label: "Đang diễn ra" },
    { value: ActivityStatus.DRAFT, label: "Nháp" },
    { value: ActivityStatus.CLOSED, label: "Đã đóng" },
    { value: ActivityStatus.COMPLETED, label: "Hoàn thành" },
];

const typeOptions = [
    { value: "", label: "Tất cả loại" },
    { value: "RUNNING", label: "Chạy bộ" },
];

const ActivityFilter: React.FC<ActivityFilterProps> = ({
    filters,
    onFilterChange,
    showStatusFilter = true,
}) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ ...filters, search: e.target.value });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, status: e.target.value });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, type: e.target.value });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
                {/* Search Input */}
                <div className="flex-1 min-w-[250px]">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Tìm kiếm hoạt động..."
                            value={filters.search || ""}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                {showStatusFilter && (
                    <div className="min-w-[180px]">
                        <select
                            value={filters.status || ""}
                            onChange={handleStatusChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Type Filter */}
                <div className="min-w-[150px]">
                    <select
                        value={filters.type || ""}
                        onChange={handleTypeChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        {typeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ActivityFilter;
