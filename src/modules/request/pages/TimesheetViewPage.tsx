import React, { useEffect, useState, useRef } from "react";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import { formatDate } from "shared/utils/date-utils";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { TimesheetSummary } from "../types/request.types";
import {
  Calendar,
  ChevronDown,
  Sun,
  Moon,
  Clock,
  AlertTriangle,
  Zap,
  Star,
  Check,
  X,
  Edit,
} from "lucide-react";

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
// Badge component
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
// Timesheet row component
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
// Table header component
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
// Timesheet table component
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

// summary cards
interface TimesheetHeaderProps {
  summary: TimesheetSummary | null;
}

type Stat = { title: string; value: React.ReactNode; icon?: React.ReactNode };
// Card component
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
// Timesheet header component
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
          {summary.totalWorkCredit.toFixed(3)}
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
// Timesheet filters component
interface TimesheetFiltersProps {
  yearmonth: string;
  setYearmonth: (m: string) => void;
}
const TimesheetFilters: React.FC<TimesheetFiltersProps> = ({
  yearmonth,
  setYearmonth,
}) => {
  const formatDateLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const getMonthRange = (month: string) => {
    const [y, m] = month.split("-").map(Number);
    const first = new Date(y, m - 1, 1);
    const last = new Date(y, m, 0);
    return { start: formatDateLocal(first), end: formatDateLocal(last) };
  };

  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  // month, setMonth are now props
  const [startDate, setStartDate] = useState<string>(
    () => getMonthRange(defaultMonth).start
  );
  const [endDate, setEndDate] = useState<string>(
    () => getMonthRange(defaultMonth).end
  );
  const [rangeOpen, setRangeOpen] = useState(false);

  const rangeButtonRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { start, end } = getMonthRange(yearmonth);
    setStartDate(start);
    setEndDate(end);
  }, [yearmonth]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rangeOpen) return;
      const target = e.target as Node;
      if (
        popupRef.current &&
        !popupRef.current.contains(target) &&
        rangeButtonRef.current &&
        !rangeButtonRef.current.contains(target)
      ) {
        setRangeOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setRangeOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [rangeOpen]);

  const monthStart = getMonthRange(yearmonth).start;
  const monthEnd = getMonthRange(yearmonth).end;

  const clampDate = (d: string, min: string, max: string) => {
    if (d < min) return min;
    if (d > max) return max;
    return d;
  };

  const formatMonthLabel = (m: string) => {
    const [y, mm] = m.split("-");
    return `${mm}/${y}`;
  };

  const formatRangeLabel = (s: string, e: string) => {
    const sd = s.slice(8, 10);
    const ed = e.slice(8, 10);
    return `${sd}-${ed}`;
  };

  return (
    <div className="mb-6">
      <div className="bg-white border border-gray-100 rounded-md p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Tháng
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 w-48">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="flex-1 text-sm text-gray-700">
                {formatMonthLabel(yearmonth)}
              </div>
              <div className="relative">
                <input
                  type="month"
                  value={yearmonth}
                  onChange={(e) => setYearmonth(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Khoảng thời gian
            </div>
            <button
              ref={rangeButtonRef}
              type="button"
              onClick={() => setRangeOpen((s) => !s)}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 w-44"
            >
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="flex-1 text-sm text-gray-700">
                {formatRangeLabel(startDate, endDate)}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {rangeOpen && (
              <div
                ref={popupRef}
                className="absolute z-20 mt-2 bg-white border border-gray-200 rounded p-3 shadow-lg w-64"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    min={monthStart}
                    max={monthEnd}
                    onChange={(e) => {
                      const v = clampDate(e.target.value, monthStart, monthEnd);
                      setStartDate(v);
                      if (v > endDate) setEndDate(v);
                    }}
                    className="bg-white border border-gray-200 rounded px-3 py-2 text-sm w-full"
                  />
                </div>
                <div className="my-2 text-center text-sm text-gray-400">—</div>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={endDate}
                    min={monthStart}
                    max={monthEnd}
                    onChange={(e) => {
                      const v = clampDate(e.target.value, monthStart, monthEnd);
                      setEndDate(v);
                      if (v < startDate) setStartDate(v);
                    }}
                    className="bg-white border border-gray-200 rounded px-3 py-2 text-sm w-full"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setStartDate(monthStart);
                setEndDate(monthEnd);
                setRangeOpen(false);
              }}
              className="bg-blue-600 border border-gray-200 text-white px-4 py-2 rounded text-sm"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimesheetViewPage: React.FC = () => {
  const { requestApi } = useApi();
  const { user } = useAuth();
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
  const [yearmonth, setYearmonth] = useState<string>(defaultMonth);
  const [data, setData] = useState<TimesheetEntry[]>([]);
  const [summary, setSummary] = useState<TimesheetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(false);
      try {
        const ym = yearmonth;
        const res = await requestApi.getTimesheet(user?.userId, ym);
        if (res && res.success && res.data) {
          const mapped: TimesheetEntry[] = res.data.timesheets.map((t) => {
            const dateLabel = (() => {
              try {
                return formatDate(t.date).slice(0, 5);
              } catch {
                return t.date;
              }
            })();

            const mapStatus = (s: string) => {
              if (!s) return "-";
              if (s === "PRESENT") return "Có mặt";
              if (s === "LEAVE") return "Nghỉ phép";
              if (s === "ABSENT") return "Vắng mặt";
              return s;
            };

            const timeLabel = (iso?: string) => {
              if (!iso) return undefined;
              try {
                return new Date(iso).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              } catch {
                return iso;
              }
            };

            const work = t.totalWorkCredit >= 0.75 ? 1.0 : 0.5;

            return {
              id: t.dailyTsId,
              date: dateLabel,
              morning: mapStatus(t.morningStatus),
              afternoon: mapStatus(t.afternoonStatus),
              wfhMorning: t.morningWfh,
              wfhAfternoon: t.afternoonWfh,
              work,
              checkIn: timeLabel(t.checkInTime),
              checkOut: timeLabel(t.checkOutTime),
              late: t.lateMinutes && t.lateMinutes > 0 ? t.lateMinutes : "-",
              early:
                t.earlyLeaveMinutes && t.earlyLeaveMinutes > 0
                  ? t.earlyLeaveMinutes
                  : "-",
              ot:
                t.overtimeMinutes && t.overtimeMinutes > 0
                  ? t.overtimeMinutes
                  : "-",
            } as TimesheetEntry;
          });
          setData(mapped);
          setSummary(res.data.summary);
        } else {
          setData([]);
          setSummary(null);
        }
      } catch (err) {
        console.error("Failed to load timesheet", err);
        setData([]);
        setSummary(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [yearmonth]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bảng Chấm Công</h1>
      <TimesheetHeader summary={summary} />
      <TimesheetFilters yearmonth={yearmonth} setYearmonth={setYearmonth} />
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
      ) : data.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <TimesheetTable data={data} />
        </>
      )}
    </div>
  );
};

export default TimesheetViewPage;
