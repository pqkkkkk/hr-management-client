import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockRequestApi } from "services/api/request.api";
import {
  Request,
  RequestStatus,
  requestTypeOptions,
  requestStatusOptions,
} from "../types/request.types";
import { leaveTypeOptions, shiftTypeOptions } from "../types/request.types";
import { formatDate } from "shared/utils/date-utils";
import ConfirmationApprove from "../components/ConfirmationApprove";
import ConfirmationReject from "../components/ConfirmationReject";
import DelegationForm, {
  CreateDelegationRequest,
} from "../components/DelegationForm";
import { toast } from "react-toastify";

const Badge: React.FC<{ status?: RequestStatus }> = ({ status }) => {
  const classMap: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    PROCESSING: "bg-blue-100 text-blue-800",
  };
  if (!status) return null;
  const opt = requestStatusOptions.find((o) => o.value === status);
  const label = opt?.label ?? status;
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        classMap[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {label}
    </span>
  );
};

const RequestDetailPage: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!requestId) throw new Error("Missing request id");
        const res = await mockRequestApi.getRequestById(requestId);
        if (res && res.success) {
          setRequest(res.data);
        } else {
          setError(res?.message || "Không thể tải yêu cầu");
        }
      } catch (err: any) {
        setError(err?.message || "Không thể tải yêu cầu");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [requestId]);

  const handleClose = () => navigate(-1);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);

  const openApprove = () => setShowApproveModal(true);
  const closeApprove = () => setShowApproveModal(false);
  const openReject = () => setShowRejectModal(true);
  const closeReject = () => setShowRejectModal(false);

  const doApprove = async () => {
    if (!request) return;
    try {
      const res = await mockRequestApi.approveRequest(request.requestId);
      if (res && res.success) setRequest(res.data);
      // notify other parts of app
      try {
        window.dispatchEvent(
          new CustomEvent("request-updated", { detail: res?.data })
        );
      } catch {}
    } catch (err) {
      console.error("Approve failed", err);
    } finally {
      closeApprove();
    }
  };

  const doReject = async (reason: string) => {
    if (!request) return;
    try {
      const res = await mockRequestApi.rejectRequest(request.requestId, reason);
      if (res && res.success) setRequest(res.data);
      try {
        window.dispatchEvent(
          new CustomEvent("request-updated", { detail: res?.data })
        );
      } catch {}
    } catch (err) {
      console.error("Reject failed", err);
    } finally {
      closeReject();
    }
  };

  const getTypeLabel = (t?: string) => {
    const opt = requestTypeOptions.find((x) => x.value === (t as any));
    return opt ? opt.label : t;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-5 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Chi tiết yêu cầu
              </h3>
              {request && <Badge status={request.status} />}
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-600 mx-auto"
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
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : request ? (
            <div className="p-6 grid grid-cols-12 gap-6">
              {/* Left summary */}
              <div className="col-span-4 bg-gray-50 p-5 rounded-md">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-semibold">
                    {(request.employeeName || "?")
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <ConfirmationApprove
                      open={showApproveModal}
                      onClose={closeApprove}
                      onConfirm={doApprove}
                    />
                    <ConfirmationReject
                      open={showRejectModal}
                      onClose={closeReject}
                      onConfirm={doReject}
                    />
                    <div className="text-md font-bold text-gray-900">
                      {request.employeeName}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Tiêu đề</div>
                    <div className="text-gray-800">{request.title}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Loại yêu cầu</div>
                    <div className="text-gray-800">
                      {getTypeLabel(request.requestType)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Ngày gửi</div>
                    <div className="text-gray-800">
                      {formatDate(request.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right details */}
              <div className="col-span-8">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      Lý do
                    </div>
                    <div className="mt-2 p-4 bg-white border rounded text-gray-800">
                      {request.userReason || "-"}
                    </div>
                  </div>

                  {request.rejectReason && (
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        Lý do từ chối
                      </div>
                      <div className="mt-2 p-4 bg-white border rounded text-gray-800">
                        {request.rejectReason}
                      </div>
                    </div>
                  )}

                  {/* Additional info: list leave/wfh dates */}
                  {request.additionalLeaveInfo && (
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        Chi tiết nghỉ phép
                      </div>
                      <div className="mt-2 bg-white border rounded p-4">
                        <div className="text-sm text-gray-700">
                          Loại nghỉ phép:{" "}
                          {leaveTypeOptions.find(
                            (o) =>
                              o.value === request.additionalLeaveInfo.leaveType
                          )?.label ?? request.additionalLeaveInfo.leaveType}
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          Tổng số ngày:{" "}
                          <span className="font-medium">
                            {request.additionalLeaveInfo.totalDays}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs font-semibold text-gray-800">
                            Các ngày áp dụng
                          </div>
                          <ul className="mt-2 space-y-1">
                            {request.additionalLeaveInfo.leaveDates.map(
                              (d, idx) => (
                                <li key={idx} className="text-gray-800">
                                  {formatDate(d.date)} —{" "}
                                  {shiftTypeOptions.find(
                                    (s) => s.value === d.shift
                                  )?.label ?? d.shift}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {request.additionalWfhInfo && (
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        Chi tiết WFH
                      </div>
                      <div className="mt-2 bg-white border rounded p-4">
                        <div className="text-sm text-gray-700">
                          Địa điểm làm việc từ xa:{" "}
                          {request.additionalWfhInfo.workLocation || "-"}
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          Tổng số ngày:{" "}
                          <span className="font-medium">
                            {request.additionalWfhInfo.totalDays}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs font-semibold text-gray-800">
                            Các ngày áp dụng
                          </div>
                          <ul className="mt-2 space-y-1">
                            {request.additionalWfhInfo.wfhDates.map(
                              (d, idx) => (
                                <li key={idx} className="text-gray-800">
                                  {formatDate(d.date)} —{" "}
                                  {shiftTypeOptions.find(
                                    (s) => s.value === d.shift
                                  )?.label ?? d.shift}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Các loại yêu cầu khác sẽ có chi tiết tương tự và khác đôi chút, phát triển sau khi có dữ liệu */}
                  {request.attachmentUrl && (
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        Tệp đính kèm
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-white border rounded flex items-center justify-between p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center text-red-600">
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                                  stroke="currentColor"
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M14 2v6h6"
                                  stroke="currentColor"
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <div className="text-left">
                              <div className="text-sm font-medium text-gray-800">
                                {(() => {
                                  try {
                                    const parts =
                                      request.attachmentUrl!.split("/");
                                    return parts[parts.length - 1];
                                  } catch {
                                    return "attachment.pdf";
                                  }
                                })()}
                              </div>
                              {/* Size tệp đính kèm thực hiện sau */}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="text-gray-600 hover:text-gray-800"
                              title="Tải xuống (biểu tượng)"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7 10l5 5 5-5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 15V3"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>

                            <button
                              type="button"
                              className="text-gray-600 hover:text-gray-800"
                              title="Xem (biểu tượng)"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="3"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-white border rounded text-gray-700"
                  >
                    Đóng
                  </button>
                  {request.status === RequestStatus.PENDING ? (
                    <>
                      <button
                        onClick={() => setIsDelegateOpen(true)}
                        className="px-3 py-2 flex items-center justify-center border rounded text-blue-600 bg-white"
                        title="Ủy quyền"
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM4 20v-1c0-2.5 4-3.5 8-3.5s8 1 8 3.5V20"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Ủy quyền
                      </button>

                      <button
                        onClick={openReject}
                        className="px-4 py-2 bg-red-600 text-white rounded inline-flex items-center gap-2"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M18 6L6 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Từ chối
                      </button>

                      <button
                        onClick={openApprove}
                        className="px-4 py-2 bg-green-600 text-white rounded inline-flex items-center gap-2"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Phê duyệt
                      </button>
                    </>
                  ) : (
                    <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded">
                      Quay lại
                    </button>
                  )}
                </div>
              </div>

              <DelegationForm
                isOpen={isDelegateOpen}
                onClose={() => setIsDelegateOpen(false)}
                onSubmit={(data: CreateDelegationRequest) => {
                  // For now just show a toast and notify other parts of the app
                  toast.success(`Ủy quyền cho ${data.delegateToId} thành công`);
                  try {
                    window.dispatchEvent(
                      new CustomEvent("delegation-created", {
                        detail: { requestId: request?.requestId, ...data },
                      })
                    );
                  } catch {}
                  setIsDelegateOpen(false);
                }}
              />
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600">
              Không tìm thấy yêu cầu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPage;
