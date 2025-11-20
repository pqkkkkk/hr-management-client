import React from "react";
import {
  departmentOptions,
  positionOptions,
} from "modules/profile/types/profile.types";
import FormSelect from "./FormSelect";
import { Search } from "lucide-react";

interface EmployeeFilters {
  search?: string;
  department?: string;
  position?: string;
  status?: string;
}

type Props = {
  filters: EmployeeFilters;
  setFilters: (f: EmployeeFilters) => void;
};

const SearchAndFilter: React.FC<Props> = ({ filters, setFilters }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="relative bg-blue-400 rounded-lg p-4 mb-3">
        <div className="flex items-center gap-3">
          <Search className="text-white" size={24} />
          <input
            className="flex-1 rounded-full px-4 py-2 outline-none"
            placeholder="Tìm kiếm bằng tên, ID"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <button
            className="ml-2 bg-white text-black rounded px-3 py-1 hover:bg-gray-100"
            onClick={() => setFilters({})}
          >
            Đặt lại
          </button>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 flex gap-6">
        <div className="flex-1">
          <FormSelect
            label="Phòng ban"
            value={filters.department || ""}
            onChange={(v) => setFilters({ ...filters, department: v })}
            options={[{ value: "", label: "Tất cả" }, ...departmentOptions]}
          />
        </div>

        <div className="flex-1">
          <FormSelect
            label="Vị trí"
            value={filters.position || ""}
            onChange={(v) => setFilters({ ...filters, position: v })}
            options={[{ value: "", label: "Tất cả" }, ...positionOptions]}
          />
        </div>

        <div className="flex-1">
          <FormSelect
            label="Trạng thái"
            value={filters.status || ""}
            onChange={(v) => setFilters({ ...filters, status: v })}
            options={[
              { value: "", label: "Tất cả" },
              { value: "ACTIVE", label: "Đang làm việc" },
              { value: "ON_LEAVE", label: "Đang nghỉ phép" },
              { value: "INACTIVE", label: "Đã nghỉ việc" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
