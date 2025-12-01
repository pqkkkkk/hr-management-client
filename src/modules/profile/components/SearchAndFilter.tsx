import React from "react";
import {
  departmentOptions,
  positionOptions,
  genderOptions,
  statusOptions,
} from "modules/profile/types/profile.types";
import FormSelect from "./FormSelect";
import { Search } from "lucide-react";

interface EmployeeFilters {
  search?: string;
  gender?: string;
  department?: string;
  position?: string;
  status?: string;
}

type Option = { value: string; label: string };

type Props = {
  filters: EmployeeFilters;
  setFilters: (f: EmployeeFilters) => void;
  // allow passing position options from parent
  positionOptions?: Option[];
  // allow passing department options from parent (e.g., fetched from backend)
  departmentOptions?: Option[];
};

const SearchAndFilter: React.FC<Props> = ({ filters, setFilters, positionOptions: posOpts, departmentOptions: deptOpts }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="relative bg-blue-400 rounded-lg p-4 mb-3">
        <div className="flex items-center gap-3">
          <Search className="text-white" size={24} />
          <input
            className="flex-1 rounded-full px-4 py-2 outline-none"
            placeholder="Tìm kiếm bằng tên"
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
            label="Giới tính"
            value={filters.gender || ""}
            onChange={(v) => setFilters({ ...filters, gender: v })}
            options={[{ value: "", label: "Tất cả" }, ...genderOptions]}
          />
        </div>
        <div className="flex-1">
          <FormSelect
            label="Phòng ban"
            value={filters.department || ""}
            onChange={(v) => setFilters({ ...filters, department: v })}
            options={[{ value: "", label: "Tất cả" }, ...(deptOpts || departmentOptions)]}
          />
        </div>

        <div className="flex-1">
          <FormSelect
            label="Vị trí"
            value={filters.position || ""}
            onChange={(v) => setFilters({ ...filters, position: v })}
            options={[{ value: "", label: "Tất cả" }, ...(posOpts || positionOptions)]}
          />
        </div>

        <div className="flex-1">
          <FormSelect
            label="Trạng thái"
            value={filters.status || ""}
            onChange={(v) => setFilters({ ...filters, status: v })}
            options={[{ value: "", label: "Tất cả" }, ...statusOptions]}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
