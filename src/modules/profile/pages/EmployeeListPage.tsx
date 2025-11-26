import React, { useEffect, useMemo, useState } from "react";
import { useApi } from "contexts/ApiContext";
import { User } from "shared/types";
import { departmentOptions } from "modules/profile/types/profile.types";
import SearchAndFilter from "modules/profile/components/SearchAndFilter";
import EmployeeRow from "modules/profile/components/EmployeeRow";
import Pagination from "modules/profile/components/Pagination";
import EmptyList from "modules/profile/components/EmptyList";
import { File } from "lucide-react";
import ConfirmationModal from "modules/profile/components/ConfirmationModal";
import ExportModal from "modules/profile/components/ExportModal";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [candidateUser, setCandidateUser] = useState<User | null>(null);
  const [deactivatingUserId, setDeactivatingUserId] = useState<string | null>(
    null
  );
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel");
  const [exportLoading, setExportLoading] = useState(false);

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

  const exportDisabled = exportLoading || (filtered && filtered.length === 0);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3000);
  };

  const handleDeactivateRequest = (user: User) => {
    setCandidateUser(user);
    setConfirmOpen(true);
  };

  const handleConfirmDeactivate = () => {
    if (!candidateUser) return;
    setDeactivatingUserId(candidateUser.userId);
    profileApi
      .deactivateUser(candidateUser.userId)
      .then((res) => {
        if (res && res.success) {
          // update local state
          setUsers((prev) =>
            prev.map((u) =>
              u.userId === candidateUser.userId
                ? {
                    ...u,
                    status: "INACTIVE",
                    updatedAt: new Date().toISOString(),
                  }
                : u
            )
          );
          showToast("success", res.message || "Vô hiệu hóa thành công");
        } else {
          showToast("error", res.message || "Vô hiệu hóa thất bại");
        }
      })
      .catch((err) => {
        showToast("error", err?.message || "Vô hiệu hóa thất bại");
      })
      .finally(() => {
        setDeactivatingUserId(null);
        setConfirmOpen(false);
        setCandidateUser(null);
      });
  };

  return (
    <div className="p-6 relative">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">Danh sách nhân viên</h2>

      <div className="absolute right-6 top-6">
        <button
          onClick={() => {
            if (exportDisabled) return;
            setExportOpen(true);
          }}
          className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg ${
            exportDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
          disabled={exportDisabled}
        >
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
          {/* Toast */}
          {toast ? (
            <div
              className={`mb-3 p-3 rounded ${
                toast.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {toast.message}
            </div>
          ) : null}

          <ConfirmationModal
            open={confirmOpen}
            user={candidateUser}
            onCancel={() => {
              setConfirmOpen(false);
              setCandidateUser(null);
            }}
            onConfirm={handleConfirmDeactivate}
            loading={Boolean(deactivatingUserId)}
          />

          <ExportModal
            open={exportOpen}
            format={exportFormat}
            setFormat={(f) => setExportFormat(f)}
            loading={exportLoading}
            onClose={() => setExportOpen(false)}
            onExport={async () => {
              setExportLoading(true);
              try {
                const resp = await profileApi.exportUsers({
                  ...filters,
                  format: exportFormat,
                });
                if (resp && resp.success && resp.data) {
                  const url = resp.data;
                  const ext = exportFormat === "pdf" ? "pdf" : "xlsx";
                  const fileName = `list-users-${Date.now()}.${ext}`;
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = fileName;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  showToast("success", resp.message || "Export thành công");
                } else {
                  showToast("error", resp.message || "Export thất bại");
                }
              } catch (err: any) {
                showToast("error", err?.message || "Export thất bại");
              } finally {
                setExportLoading(false);
                setExportOpen(false);
              }
            }}
          />

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
                    onDeactivate={() => handleDeactivateRequest(u)}
                    isDeactivating={deactivatingUserId === u.userId}
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
