import React from "react";
import { Check, X, Edit } from "lucide-react";

export type TimesheetEntry = {
  id: string;
  date: string;
  morning: string;
  afternoon: string;
  wfhMorning?: boolean;
  wfhAfternoon?: boolean;
  work: number;
  checkIn?: string;
  checkOut?: string;
  late?: number | "-";
  early?: number | "-";
  ot?: number | "-";
};

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </div>
);

const TimesheetRow: React.FC<{ entry: TimesheetEntry }> = ({ entry }) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 text-sm text-gray-600">{entry.date}</td>
      <td className="py-3 px-4 text-sm">
        <Badge
          className={
            entry.morning === "Có mặt"
              ? "bg-green-50 text-green-600"
              : "bg-yellow-50 text-yellow-600"
          }
        >
          {entry.morning}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm">
        <Badge
          className={
            entry.afternoon === "Có mặt"
              ? "bg-green-50 text-green-600"
              : entry.afternoon === "Nghỉ phép"
              ? "bg-yellow-50 text-yellow-600"
              : "bg-red-50 text-red-600"
          }
        >
          {entry.afternoon}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm text-center">
        {entry.wfhMorning ? (
          <Check className="w-4 h-4 text-green-600 mx-auto" />
        ) : (
          <X className="w-4 h-4 text-red-400 mx-auto" />
        )}
      </td>
      <td className="py-3 px-4 text-sm text-center">
        {entry.wfhAfternoon ? (
          <Check className="w-4 h-4 text-green-600 mx-auto" />
        ) : (
          <X className="w-4 h-4 text-red-400 mx-auto" />
        )}
      </td>
      <td className="py-3 px-4 text-sm font-semibold">{entry.work}</td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {entry.checkIn || "-"}
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {entry.checkOut || "-"}
      </td>
      <td className="py-3 px-4 text-sm text-orange-500">{entry.late || "-"}</td>
      <td className="py-3 px-4 text-sm text-gray-500">{entry.early || "-"}</td>
      <td className="py-3 px-4 text-sm text-blue-600 font-semibold">
        {entry.ot || "-"}
      </td>
      <td className="py-3 px-4 text-sm">
        <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600">
          <Edit className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export default TimesheetRow;
