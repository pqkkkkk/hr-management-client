import React, { useState } from "react";
import { formatDate } from "shared/utils/date-utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Request,
  RequestStatus,
  RequestType,
  requestTypeOptions,
  requestStatusOptions,
} from "../types/request.types";
import DelegationForm, { CreateDelegationRequest } from "./DelegationForm";

type Props = {
  request: Request;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelegate?: (requestId: string, data: CreateDelegationRequest) => void;
};

const getStatusBadgeClass = (status: RequestStatus): string => {
  switch (status) {
    case RequestStatus.APPROVED:
      return "bg-emerald-50 text-green-800";
    case RequestStatus.PENDING:
      return "bg-amber-50 text-amber-700";
    case RequestStatus.REJECTED:
      return "bg-red-50 text-red-700";
    case RequestStatus.CANCELLED:
      return "bg-gray-100 text-gray-700";
    case RequestStatus.PROCESSING:
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusLabel = (status: RequestStatus) => {
  const opt = requestStatusOptions.find((o) => o.value === status);
  return opt?.label ?? status;
};

const getTypeLabel = (type: RequestType) => {
  const opt = requestTypeOptions.find((o) => o.value === type);
  return opt?.label ?? type;
};

const RequestRow: React.FC<Props> = ({
  request,
  onApprove,
  onReject,
  onDelegate,
}) => {
  const navigate = useNavigate();
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);

  const handleDelegateSubmit = (data: CreateDelegationRequest) => {
    if (onDelegate) {
      onDelegate(request.requestId, data);
    } else {
      toast.success("Ủy quyền thành công");
    }
    setIsDelegateOpen(false);
  };

  return (
    <tr className="border-b last:border-b-0">
      <td className="py-4 px-10 text-sm font-medium text-gray-800">
        {request.employeeName}
      </td>
      <td className="py-4 px-10 text-sm text-gray-600">
        {getTypeLabel(request.requestType)}
      </td>
      <td className="py-4 px-10 text-sm text-gray-600">
        {formatDate(request.createdAt)}
      </td>
      <td className="py-4 px-10">
        {
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
              request.status
            )}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {getStatusLabel(request.status)}
          </span>
        }
      </td>
      <td className="py-4 px-10">
        <div className="flex items-center gap-1">
          {request.status === RequestStatus.PENDING ? (
            <>
              <button
                onClick={() => onApprove && onApprove(request.requestId)}
                className="w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded"
                title="Phê duyệt"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                onClick={() => onReject && onReject(request.requestId)}
                className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded"
                title="Từ chối"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M15 9L9 15M9 9l6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          ) : null}

          <button
            onClick={() => {
              navigate(`/requests/manage/${request.requestId}`);
            }}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-700 rounded"
            title="Xem chi tiết"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
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

          {request.status === RequestStatus.PENDING ? (
            <button
              onClick={() => setIsDelegateOpen(true)}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 text-blue-600 rounded"
              title="Ủy quyền xử lý"
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
            </button>
          ) : null}
        </div>
      </td>
      <DelegationForm
        isOpen={isDelegateOpen}
        onClose={() => setIsDelegateOpen(false)}
        onSubmit={handleDelegateSubmit}
      />
    </tr>
  );
};

export default RequestRow;
