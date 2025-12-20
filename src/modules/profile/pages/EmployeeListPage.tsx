import React, { useState, useCallback, useMemo } from "react";
import { useApi } from "contexts/ApiContext";
import { User } from "shared/types";
import SearchAndFilter from "modules/profile/components/SearchAndFilter";
import EmployeeRow from "modules/profile/components/EmployeeRow";
import Pagination from "modules/profile/components/Pagination";
import EmptyList from "modules/profile/components/EmptyList";
import { File } from "lucide-react";
import ConfirmationModal from "modules/profile/components/ConfirmationModal";
import ExportModal from "modules/profile/components/ExportModal";
import { ProfileFilter, SupportedFileFormat } from "../types/profile.req.types";
import { useQuery } from "shared/hooks/use-query";
import { useFetchList } from "shared/hooks/use-fetch-list";
import { departmentOptions, positionOptions } from "../types/profile.types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EmployeeListPage: React.FC = () => {
  const navigate = useNavigate();
  const { profileApi } = useApi();
  const PAGE_SIZE = 5;

  // Query state với useQuery hook
  const { query, updateQuery, resetQuery } = useQuery<ProfileFilter>({
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });

  // Memoize fetchFn để tránh tạo function mới mỗi lần render
  const fetchProfiles = useMemo(
    () => profileApi.getProfiles.bind(profileApi),
    [profileApi]
  );

  const { data: users, page: pageData, isFetching, error, refetch } = useFetchList<ProfileFilter, User>(
    fetchProfiles,
    query
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [candidateUser, setCandidateUser] = useState<User | null>(null);
  const [deactivatingUserId, setDeactivatingUserId] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<SupportedFileFormat>("EXCEL");
  const [exportLoading, setExportLoading] = useState(false);

  const exportDisabled = exportLoading || users.length === 0

  // Handler cho filter changes
  const handleFilterChange = useCallback(
    (newFilters: any) => {
      updateQuery({
        currentPage: 1,
        nameTerm: newFilters.search,
        gender: newFilters.gender,
        departmentId: newFilters.department,
        position: newFilters.position,
        status: newFilters.status,
      });
    },
    [updateQuery]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateQuery({ currentPage: newPage });
    },
    [updateQuery]
  );

  const handleDeactivateRequest = (user: User) => {
    setCandidateUser(user);
    setConfirmOpen(true);
  };

  const handleConfirmDeactivate = async () => {
    if (!candidateUser) return;
    setDeactivatingUserId(candidateUser.userId);
    try {
      const res = await profileApi.deactivateUser(candidateUser.userId);
      if (res && res.success) {
        toast.success(res.message || "Vô hiệu hóa thành công");
        // Refetch data từ server
        await refetch();
      } else {
        toast.error(res.message || "Vô hiệu hóa thất bại");
      }
    } catch (err: any) {
      toast.error(err?.message || "Đã có lỗi xảy ra");
    } finally {
      setDeactivatingUserId(null);
      setConfirmOpen(false);
      setCandidateUser(null);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const response = await profileApi.exportProfiles?.({
        fileFormat: exportFormat,
        filter: {
          nameTerm: query.nameTerm,
          gender: query.gender,
          departmentId: query.departmentId,
          position: query.position,
          status: query.status,
        },
      });

      if (response?.success && response.data?.fileUrl) {
        // Trigger file download
        const link = document.createElement("a");
        link.href = response.data.fileUrl;
        link.download = `employees_${new Date().toISOString().split("T")[0]}.${exportFormat === "EXCEL" ? "xlsx" : "pdf"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Xuất file thành công!");
        setExportOpen(false);
      } else {
        toast.error("Xuất file thất bại");
      }
    } catch (err: any) {
      console.error("Export failed:", err);
      toast.error(err?.message || "Đã có lỗi xảy ra khi xuất file");
    } finally {
      setExportLoading(false);
    }
  }

  const handleEditRequest = (userId: string) => {
    navigate(`/profile/users/${userId}/for-hr`);
  }

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
          className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg ${exportDisabled
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
        filters={{
          search: query.nameTerm,
          gender: query.gender,
          department: query.departmentId,
          position: query.position,
          status: query.status,
        }}
        setFilters={handleFilterChange}
        departmentOptions={departmentOptions}
        positionOptions={positionOptions}
      />

      {/* Danh sách nhân viên */}
      {isFetching ? (
        <div className="mt-6">Đang tải...</div>
      ) : users.length === 0 ? (
        <div className="mt-6">
          <EmptyList />
        </div>
      ) : (
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">

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
            onExport={handleExport}
          />

          <div className="overflow-x-auto">
            <table className="min-w-max table-auto border-collapse">
              <thead>
                <tr className="text-left border-b">
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
                {users.map((u) => (
                  <EmployeeRow
                    key={u.userId}
                    user={u}
                    onEdit={() => handleEditRequest(u.userId)}
                    onDeactivate={() => handleDeactivateRequest(u)}
                    isDeactivating={deactivatingUserId === u.userId}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {pageData && (
            <Pagination
              page={(query.currentPage || 1)}
              total={pageData.totalElements}
              limit={PAGE_SIZE}
              setPage={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;
