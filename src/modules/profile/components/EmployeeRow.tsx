import React from "react";
import { User } from "shared/types";
import { Edit2, Trash2 } from "lucide-react";

type Props = {
  user: User;
  departmentName?: string;
};

const EmployeeRow: React.FC<Props> = ({ user, departmentName }) => {
  return (
    <tr className="border-b">
      <td className="px-6 py-4">{user.userId}</td>
      <td className="px-6 py-4">{user.fullName}</td>
      <td className="px-6 py-4">{user.position}</td>
      <td className="px-6 py-4">{departmentName || "-"}</td>
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
          if (user.status === "ON_LEAVE") {
            return (
              <span className={`${base} bg-yellow-100 text-yellow-800`}>
                Đang nghỉ phép
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
          <button className="text-black px-2 py-1 rounded hover:bg-gray-100">
            <Edit2 size={20} />
          </button>
          <button className="text-red-600 px-2 py-1 rounded hover:bg-red-50">
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default EmployeeRow;
