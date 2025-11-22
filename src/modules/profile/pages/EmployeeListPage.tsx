import React, { useEffect, useMemo, useState } from "react";
import { useApi } from "contexts/ApiContext";
import { User } from "shared/types";
import { departmentOptions } from "modules/profile/types/profile.types";
import SearchAndFilter from "modules/profile/components/SearchAndFilter";
import EmployeeRow from "modules/profile/components/EmployeeRow";
import Pagination from "modules/profile/components/Pagination";
import EmptyList from "modules/profile/components/EmptyList";
import { File } from "lucide-react";

// Ánh xạ cục bộ từ departmentId -> nhãn (vì departmentOptions hiện đang sử dụng tên)
const departmentIdToName: Record<string, string> = {
  DPT01: "Kế toán",
  DPT02: "Nhân sự",
  DPT03: "IT",
  DPT04: "Marketing",
};

const EmployeeListPage: React.FC = () => {
  const { profileApi } = useApi();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{
    search?: string;
    gender?: string;
    department?: string;
    position?: string;
    status?: string;
  }>({});
  const [page, setPage] = useState(1);
  const limit = 5;

  // Lấy danh sách nhân viên
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    profileApi
      .getProfiles()
      .then((res) => {
        if (!mounted) return;
        setUsers(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [profileApi]);

  // Lọc nhân viên dựa trên filters
  const filtered = useMemo(() => {
    const q = (filters.search || "").toLowerCase().trim();
    return users.filter((u) => {
      if (filters.department) {
        const deptName = u.departmentId
          ? departmentIdToName[u.departmentId] || u.departmentId
          : "";
        if (
          deptName !== filters.department &&
          u.departmentId !== filters.department
        )
          return false;
      }
      if (filters.position && u.position !== filters.position) return false;
      if (filters.gender && (u.gender || "") !== filters.gender) return false;
      if (filters.status && u.status !== filters.status) return false;
      if (!q) return true;
      return (
        u.fullName?.toLowerCase().includes(q) ||
        u.userId?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    });
  }, [users, filters]);

  // Phân trang
  const paged = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page]);

  return (
    <div className="p-6 relative">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">Danh sách nhân viên</h2>

      <div className="absolute right-6 top-6">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <File size={20} />
          <span>Xuất file</span>
        </button>
      </div>

      {/* Tìm kiếm và lọc */}
      <SearchAndFilter
        filters={filters}
        setFilters={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />

      {/* Danh sách nhân viên */}
      {loading ? (
        <div className="mt-6">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyList />
        </div>
      ) : (
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-max table-auto border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="px-6 py-3 whitespace-nowrap">Mã NV</th>
                  <th className="px-6 py-3 whitespace-nowrap">Họ tên</th>
                  <th className="px-6 py-3">Ngày sinh</th>
                  <th className="px-6 py-3">Giới tính</th>
                  <th className="px-6 py-3">Địa chỉ</th>
                  <th className="px-6 py-3">SDT</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Ngày gia nhập</th>
                  <th className="px-6 py-3">Vị trí</th>
                  <th className="px-6 py-3">Phòng ban</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((u) => (
                  <EmployeeRow
                    key={u.userId}
                    user={u}
                    departmentName={
                      u.departmentId
                        ? departmentIdToName[u.departmentId] || u.departmentId
                        : ""
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <Pagination
            page={page}
            total={filtered.length}
            limit={limit}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;
