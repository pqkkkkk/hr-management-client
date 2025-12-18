import React from "react";
import TimesheetRow, { TimesheetEntry } from "./TimesheetRow";

const TableHeader: React.FC = () => (
  <thead>
    <tr className="bg-gray-50 text-left text-xs text-blue-600 font-semibold uppercase tracking-wide">
      <th className="py-3 px-4">Ngày</th>
      <th className="py-3 px-4">Sáng</th>
      <th className="py-3 px-4">Chiều</th>
      <th className="py-3 px-4">WFH Sáng</th>
      <th className="py-3 px-4">WFH Chiều</th>
      <th className="py-3 px-4">Công</th>
      <th className="py-3 px-4">Check-in</th>
      <th className="py-3 px-4">Check-out</th>
      <th className="py-3 px-4 text-orange-500"> ĐiTrễ (P)</th>
      <th className="py-3 px-4 text-orange-500"> Về Sớm (P)</th>
      <th className="py-3 px-4 text-green-600">OT (P)</th>
      <th className="py-3 px-4">Hành động</th>
    </tr>
  </thead>
);

const TimesheetTable: React.FC<{ data: TimesheetEntry[] }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <table className="w-full">
        <TableHeader />
        <tbody>
          {data.map((d) => (
            <TimesheetRow key={d.id} entry={d} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimesheetTable;
