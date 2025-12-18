import React from "react";
import {
  Calendar,
  Sun,
  Moon,
  Clock,
  AlertTriangle,
  Zap,
  Star,
} from "lucide-react";
import { TimesheetSummary } from "../types/request.types";

type Stat = { title: string; value: React.ReactNode; icon?: React.ReactNode };

const Card: React.FC<Stat> = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col justify-between h-28">
    <div className="flex items-center gap-3">
      {icon && <div className="text-gray-400">{icon}</div>}
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </div>
    </div>
    <div className="text-2xl md:text-3xl font-bold text-gray-900 text-left">
      {value}
    </div>
  </div>
);

interface TimesheetHeaderProps {
  summary: TimesheetSummary;
}

const TimesheetHeader: React.FC<TimesheetHeaderProps> = ({ summary }) => {
  const stats: Stat[] = [
    {
      title: "Tổng số ngày làm việc",
      value: summary ? summary.totalDays : "-",
      icon: <Calendar className="w-4 h-4 text-blue-600" />,
    },
    {
      title: "Có mặt buổi sáng",
      value: summary ? summary.morningPresentCount : "-",
      icon: <Sun className="w-4 h-4 text-yellow-500" />,
    },
    {
      title: "Có mặt buổi chiều",
      value: summary ? summary.afternoonPresentCount : "-",
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
    },
    {
      title: "Số ngày đi muộn",
      value: summary ? summary.lateDaysCount : "-",
      icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
    },
    {
      title: "Tổng số phút đi muộn",
      value: summary ? (
        <span className="text-red-600 font-semibold">
          {summary.totalLateMinutes}
        </span>
      ) : (
        "-"
      ),
      icon: <Clock className="w-4 h-4 text-red-500" />,
    },
    {
      title: "Tổng số phút làm thêm giờ",
      value: summary ? (
        <span className="text-blue-600 font-semibold">
          {summary.totalOvertimeMinutes}
        </span>
      ) : (
        "-"
      ),
      icon: <Zap className="w-4 h-4 text-blue-600" />,
    },
    {
      title: "Tổng số công",
      value: summary ? (
        <span className="text-green-600 font-semibold">
          {summary.totalWorkCredit}
        </span>
      ) : (
        "-"
      ),
      icon: <Star className="w-4 h-4 text-green-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
      {stats.map((s) => (
        <Card key={s.title} title={s.title} value={s.value} icon={s.icon} />
      ))}
    </div>
  );
};

export default TimesheetHeader;
