import React from "react";
import {
    RequestType,
    RequestStatus,
    requestTypeOptions,
    requestStatusOptions,
} from "../types/request.types";

export type Filters = {
    nameTerm?: string;
    dateFrom?: string; // ISO yyyy-mm-dd
    dateTo?: string; // ISO yyyy-mm-dd
    requestType?: RequestType | "";
    status?: RequestStatus | "";
};

type SearchAndFilterProps = {
    filters: Filters;
    onChange: (f: Filters) => void;
    onClear?: () => void;
};

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    filters,
    onChange,
    onClear,
}) => {
    return (
        <div className="px-6 py-3 border-t border-b border-gray-200 flex items-center gap-3 flex-nowrap overflow-x-auto bg-white">
            {/* Search by employee name */}
            <div className="flex flex-col">
                <label className="text-xl text-gray-600 mb-1">Tìm kiếm</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tên nhân viên..."
                        value={filters.nameTerm ?? ""}
                        onChange={(e) => onChange({ ...filters, nameTerm: e.target.value })}
                        className="h-9 px-3 pl-9 bg-gray-100 rounded-lg text-sm w-48"
                    />
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                        <path d="M21 21L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
            <div className="flex flex-col">
                <label className="text-xl text-gray-600 mb-1">Ngày gửi</label>
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={filters.dateFrom ?? ""}
                        onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
                        className="h-9 px-3 bg-gray-100 rounded-lg text-sm"
                    />
                    <span className="text-sm text-gray-400">—</span>
                    <input
                        type="date"
                        value={filters.dateTo ?? ""}
                        onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
                        className="h-9 px-3 bg-gray-100 rounded-lg text-sm"
                    />
                </div>
            </div>
            <div className="flex flex-col">
                <label className="text-xl text-gray-600 mb-1">Loại yêu cầu</label>
                <div className="relative">
                    <select
                        value={filters.requestType ?? ""}
                        onChange={(e) =>
                            onChange({
                                ...filters,
                                requestType: e.target.value as RequestType | "",
                            })
                        }
                        className="h-9 px-4 pr-10 bg-gray-100 rounded-lg text-sm font-medium appearance-none"
                    >
                        <option value="">Tất cả</option>
                        {requestTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                            <path
                                d="M4 7L8 11L12 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <label className="text-xl text-gray-600 mb-1">Trạng thái</label>
                <div className="relative">
                    <select
                        value={filters.status ?? ""}
                        onChange={(e) =>
                            onChange({
                                ...filters,
                                status: e.target.value as RequestStatus | "",
                            })
                        }
                        className="h-9 px-4 pr-10 bg-gray-100 rounded-lg text-sm font-medium appearance-none"
                    >
                        <option value="">Tất cả</option>
                        {requestStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                            <path
                                d="M4 7L8 11L12 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="ml-auto flex items-center">
                <button
                    onClick={() => {
                        onChange({
                            nameTerm: "",
                            dateFrom: "",
                            dateTo: "",
                            requestType: "",
                            status: "",
                        });
                        if (onClear) onClear();
                    }}
                    className="h-9 px-3 flex items-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                    aria-label="Xóa bộ lọc"
                >
                    <svg
                        className="w-4 h-4 inline-block align-middle"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                    >
                        <path
                            d="M12 4L4 12M4 4L12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="align-middle">Xóa bộ lọc</span>
                </button>
            </div>
        </div >
    );
};

export default SearchAndFilter;
