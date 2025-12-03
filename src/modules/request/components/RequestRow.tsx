import React from "react";
import { formatDate } from "shared/utils/date-utils";
import { useNavigate } from "react-router-dom";
import {
  Request,
  RequestStatus,
  RequestType,
  requestTypeOptions,
  requestStatusOptions,
} from "../types/request.types";

type Props = {
  request: Request;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
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

const RequestRow: React.FC<Props> = ({ request, onApprove, onReject }) => {
  const navigate = useNavigate();
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
        <div className="flex items-center gap-2">
          {request.status === RequestStatus.PENDING ? (
            <>
              <button
                onClick={() => onApprove && onApprove(request.requestId)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9 12.5l1.8 1.8L15 10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Phê duyệt</span>
              </button>
              <button
                onClick={() => onReject && onReject(request.requestId)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M15 9L9 15M9 9l6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Từ chối</span>
              </button>
            </>
          ) : null}

          <button
            onClick={() => {
              navigate(`/requests/manage/${request.requestId}`);
            }}
            className="flex items-center gap-2 border border-gray-200 text-sm px-3 py-1 rounded"
          >
            <svg
              className="w-4 h-4 text-gray-700"
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
            <span>Xem</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RequestRow;
