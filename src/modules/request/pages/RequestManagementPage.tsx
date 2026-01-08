import React, { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import ConfirmationApprove from "../components/ConfirmationApprove";
import ConfirmationReject from "../components/ConfirmationReject";
import SearchAndFilter, { Filters } from "../components/SearchAndFilter";
import RequestRow from "../components/RequestRow";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import {
  Request,
  RequestStatus,
  RequestType,
  CreateDelegationRequest,
  RequestFilter,
} from "../types/request.types";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { useQuery } from "shared/hooks/use-query";
import { useFetchList } from "shared/hooks/use-fetch-list";

const RequestManagementPage: React.FC = () => {
  const { requestApi } = useApi();
  const { user } = useAuth();
  const PAGE_SIZE = 6;

  const { query, updateQuery, resetQuery } = useQuery<RequestFilter>({
    currentPage: 1,
    pageSize: PAGE_SIZE,
    approverId: user?.userId,
  });

  const fetchTeamRequests = useMemo(
    () => requestApi.getTeamRequests.bind(requestApi),
    [requestApi]
  );

  const {
    data: requests,
    page: pageData,
    isFetching: loading,
    error,
    refetch,
  } = useFetchList<RequestFilter, Request>(fetchTeamRequests, query);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const pendingCount = requests.filter(
    (r) => r.status === RequestStatus.PENDING
  ).length;

  const handleFilterChange = useCallback(
    (newFilters: Filters) => {
      updateQuery({
        currentPage: 1,
        nameTerm: newFilters.nameTerm || undefined,
        type: newFilters.requestType ? (newFilters.requestType as RequestType) : undefined,
        status: newFilters.status ? (newFilters.status as RequestStatus) : undefined,
        startDate: newFilters.dateFrom || undefined,
        endDate: newFilters.dateTo || undefined,
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

  const handleClearFilters = useCallback(() => {
    resetQuery();
  }, [resetQuery]);

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
    if (!selectedRequestId || !user) return;
    try {
      const res = await requestApi.approveRequest(selectedRequestId, user.userId);
      if (res && res.success) {
        await refetch();
        toast.success("Phê duyệt thành công");
      }
    } catch (err) {
      console.error("Approve failed", err);
      toast.error("Phê duyệt thất bại");
    } finally {
      setShowApproveModal(false);
      setSelectedRequestId(null);
    }
  };

  const doReject = async (reason: string) => {
    if (!selectedRequestId || !user) return;
    try {
      const res = await requestApi.rejectRequest(
        selectedRequestId,
        user.userId,
        reason || ""
      );
      if (res && res.success) {
        await refetch();
        toast.success("Từ chối thành công");
      }
    } catch (err) {
      console.error("Reject failed", err);
      toast.error("Từ chối thất bại");
    } finally {
      setShowRejectModal(false);
      setSelectedRequestId(null);
    }
  };

  const doDelegate = async (requestId: string, data: CreateDelegationRequest) => {
    if (!user) return;
    try {
      const res = await requestApi.delegateRequest(requestId, data.delegateToId);
      if (res && res.success) {
        toast.success("Ủy quyền thành công");
        await refetch();
      } else {
        toast.error(res?.message || "Ủy quyền thất bại");
      }
    } catch (err: any) {
      console.error("Delegate failed", err);
      toast.error(err?.message || "Ủy quyền thất bại");
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
            <h2 className="text-lg font-bold text-gray-900">Quản lý Yêu cầu Team</h2>
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

          <div className="px-6">
            <SearchAndFilter
              filters={{
                nameTerm: query.nameTerm,
                dateFrom: query.startDate,
                dateTo: query.endDate,
                requestType: query.type,
                status: query.status,
              }}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
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
          ) : requests.length === 0 ? (
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
                      {requests.map((r) => (
                        <RequestRow
                          key={r.requestId}
                          request={r}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          onDelegate={doDelegate}
                          showDelegateButton={true}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {pageData && (
                <div className="px-6">
                  <Pagination
                    page={query.currentPage || 1}
                    total={pageData.totalElements}
                    limit={PAGE_SIZE}
                    setPage={handlePageChange}
                  />
                </div>
              )}
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
