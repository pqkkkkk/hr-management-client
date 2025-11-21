import React from "react";
import { User } from "shared/types";
import { Edit2, Trash2 } from "lucide-react";

type Props = {
  user: User;
  departmentName?: string;
};

const formatDate = (d?: Date | string) => {
  if (!d) return "-";
  try {
    let dateObj: Date | null = null;

    if (typeof d === "string") {
      const s = d.trim();
      // Handle DD/MM/YYYY or D/M/YYYY
      const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (slashMatch) {
        const day = parseInt(slashMatch[1], 10);
        const month = parseInt(slashMatch[2], 10) - 1;
        const year = parseInt(slashMatch[3], 10);
        const date = new Date(year, month, day);
        if (!Number.isNaN(date.getTime())) dateObj = date;
      } else {
        // Try ISO or other parseable formats
        const parsed = new Date(s);
        if (!Number.isNaN(parsed.getTime())) dateObj = parsed;
      }
    } else {
      const date = d as Date;
      if (!Number.isNaN(date.getTime())) dateObj = date;
    }

    if (!dateObj) return "-";

    const dd = String(dateObj.getDate()).padStart(2, "0");
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return "-";
  }
};

const EmployeeRow: React.FC<Props> = ({ user, departmentName }) => {
  return (
    <tr className="border-b">
      <td className="px-6 py-4 whitespace-nowrap">{user.userId}</td>

      <td className="px-6 py-4 whitespace-nowrap">{user.fullName}</td>

      <td className="px-6 py-4">{formatDate(user.dateOfBirth)}</td>

      <td className="px-6 py-4">{user.gender || "-"}</td>

      <td className="px-6 py-4">{user.address || "-"}</td>

      <td className="px-6 py-4">{user.phoneNumber || "-"}</td>

      <td className="px-6 py-4">{user.email || "-"}</td>

      <td className="px-6 py-4">{formatDate(user.joinDate)}</td>

      <td className="px-6 py-4">{user.position || "-"}</td>

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
