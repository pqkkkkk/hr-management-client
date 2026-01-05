import React from "react";
import { User } from "shared/types";
import { Edit2, Trash2 } from "lucide-react";
import { formatDate } from "shared/utils/date-utils";

type Props = {
  user: User;
  departmentName?: string;
  onDeactivate?: (user: User) => void;
  onEdit: (userId: string) => void;
  isDeactivating?: boolean;
};

const EmployeeRow: React.FC<Props> = ({
  user,
  departmentName,
  onDeactivate,
  onEdit,
  isDeactivating,
}) => {
  return (
    <tr className="border-b cursor-pointer hover:bg-gray-100"
      onClick={() => onEdit(user.userId)}>
      <td className="px-6 py-4 whitespace-nowrap">{user.fullName}</td>

      <td className="px-6 py-4">{formatDate(user.dateOfBirth)}</td>

      <td className="px-6 py-4">
        {(() => {
          const g = user.gender;
          if (!g) return "-";
          const up = String(g).toUpperCase();
          if (up === "MALE") return "Nam";
          if (up === "FEMALE") return "Nữ";
          return g;
        })()}
      </td>

      <td className="px-6 py-4">{user.address || "-"}</td>

      <td className="px-6 py-4">{user.phoneNumber || "-"}</td>

      <td className="px-6 py-4">{user.email || "-"}</td>

      <td className="px-6 py-4">{formatDate(user.joinDate)}</td>

      <td className="px-6 py-4">{user.position || "-"}</td>

      <td className="px-6 py-4">{user.departmentName || "-"}</td>

      <td className="px-6 py-4">
        {(() => {
          const base = "px-3 py-1 rounded-full text-sm";
          if (user.status === "ACTIVE") {
            return (
              <span className={`${base} bg-green-100 text-green-800`}>
                Đang làm việc
              </span>
            );
          }
          if (user.status === "INACTIVE") {
            return (
              <span className={`${base} bg-gray-100 text-gray-800`}>
                Đã nghỉ việc
              </span>
            );
          }
          return <span className={base}>{user.status}</span>;
        })()}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => onEdit(user.userId)} className="text-black px-2 py-1 rounded hover:bg-gray-100">
            <Edit2 size={20} />
          </button>
          {user.status !== "INACTIVE" && onDeactivate ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeactivate(user);
              }}
              disabled={isDeactivating}
              className={`text-red-600 px-2 py-1 rounded ${isDeactivating
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-50"
                }`}
            >
              <Trash2 size={20} />
            </button>
          ) : null}
        </div>
      </td>
    </tr>
  );
};

export default EmployeeRow;
