import React, { useEffect, useMemo, useState } from "react";
import SearchAndFilter, { Filters } from "../components/SearchAndFilter";
import RequestRow from "../components/RequestRow";
import Pagination from "../components/Pagination";
import ConfirmationApprove from "../components/ConfirmationApprove";
import ConfirmationReject from "../components/ConfirmationReject";
import { mockRequestApi } from "services/api/request.api";
import { Request, RequestStatus } from "../types/request.types";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

const RequestManagementPage: React.FC = () => {
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    name: "",
    dateFrom: "",
    dateTo: "",
    requestType: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const pageSize = 6; // rows per page to match design

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await mockRequestApi.getRequests({
          page: 1,
          pageSize: 200,
        });
        if (res.success) {
          setAllRequests(res.data.content);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    return allRequests.filter((r) => {
      if (
        filters.name &&
        !(r.employeeName ?? "")
          .toLowerCase()
          .includes(filters.name!.toLowerCase())
      )
        return false;
      // date range filter (inclusive)
      const d = (r.createdAt || "").slice(0, 10);
      if (filters.dateFrom) {
        if (d < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        if (d > filters.dateTo) return false;
      }
      if (filters.requestType) {
        if (r.requestType !== (filters.requestType as any)) return false;
      }
      if (filters.status) {
        if (r.status !== (filters.status as any)) return false;
      }
      return true;
    });
  }, [allRequests, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const pageItems = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const pendingCount = allRequests.filter(
    (r) => r.status === RequestStatus.PENDING
  ).length;

  const badgeBgClass =
    pendingCount === 0
      ? "bg-green-50 text-green-700"
      : "bg-red-50 text-red-700";
  const badgeDotClass = pendingCount === 0 ? "bg-green-400" : "bg-red-400";

  const handleApprove = (id: string) => {
    setSelectedRequestId(id);
    setShowApproveModal(true);
  };

  const handleReject = (id: string) => {
    setSelectedRequestId(id);
    setShowRejectModal(true);
  };

  const doApprove = async () => {
    if (!selectedRequestId) return;
    try {
      const res = await mockRequestApi.approveRequest(selectedRequestId);
      if (res && res.success) {
        setAllRequests((prev) =>
          prev.map((r) => (r.requestId === selectedRequestId ? res.data : r))
        );
        window.dispatchEvent(
          new CustomEvent("request-updated", { detail: res.data })
        );
      }
    } catch (err) {
      console.error("Approve failed", err);
    } finally {
      setShowApproveModal(false);
      setSelectedRequestId(null);
    }
  };

  const doReject = async (reason: string) => {
    if (!selectedRequestId) return;
    try {
      const res = await mockRequestApi.rejectRequest(
        selectedRequestId,
        reason || ""
      );
      if (res && res.success) {
        setAllRequests((prev) =>
          prev.map((r) => (r.requestId === selectedRequestId ? res.data : r))
        );
        window.dispatchEvent(
          new CustomEvent("request-updated", { detail: res.data })
        );
      }
    } catch (err) {
      console.error("Reject failed", err);
    } finally {
      setShowRejectModal(false);
      setSelectedRequestId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 rounded-t-xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="3"
                y1="9"
                x2="21"
                y2="9"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Quản lý Yêu cầu</h2>
          </div>
          <div
            className={`inline-flex items-center gap-2 ${badgeBgClass} px-3 py-1 rounded-full text-sm`}
          >
            <span
              className={`w-2 h-2 ${badgeDotClass} rounded-full inline-block`}
            />
            {pendingCount} yêu cầu chưa xử lý
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white">
          <div className="px-6 py-6 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Danh sách Yêu cầu
            </h1>
          </div>

          <div className="px-6">
            <SearchAndFilter
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setPage(1);
              }}
              onClear={() => {
                setFilters({
                  name: "",
                  dateFrom: "",
                  dateTo: "",
                  requestType: "",
                  status: "",
                });
                setPage(1);
              }}
            />
          </div>

          {loading ? (
            <div className="px-6 py-20 text-center">
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            </div>
          ) : error ? (
            <ErrorState />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="mt-6 overflow-x-auto px-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-3 text-sm text-gray-600">
                          TÊN NHÂN VIÊN
                        </th>
                        <th className="text-left px-6 py-3 text-sm text-gray-600">
                          LOẠI YÊU CẦU
                        </th>
                        <th className="text-left px-6 py-3 text-sm text-gray-600">
                          NGÀY GỬI
                        </th>
                        <th className="text-left px-6 py-3 text-sm text-gray-600">
                          TRẠNG THÁI
                        </th>
                        <th className="text-left px-6 py-3 text-sm text-gray-600">
                          HÀNH ĐỘNG
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {pageItems.map((r) => (
                        <RequestRow
                          key={r.requestId}
                          request={r}
                          onApprove={handleApprove}
                          onReject={handleReject}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="px-6">
                <Pagination />
              </div>
            </>
          )}
        </div>
      </div>
      <ConfirmationApprove
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={doApprove}
      />
      <ConfirmationReject
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={(reason: string) => doReject(reason)}
      />
    </div>
  );
};

export default RequestManagementPage;
