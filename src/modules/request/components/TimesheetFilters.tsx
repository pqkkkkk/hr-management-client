import React, { useState, useEffect, useRef } from "react";
import { Calendar, ChevronDown } from "lucide-react";

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getMonthRange = (month: string) => {
  // month is YYYY-MM
  const [y, m] = month.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const last = new Date(y, m, 0);
  return { start: formatDate(first), end: formatDate(last) };
};

const TimesheetFilters: React.FC = () => {
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  const [month, setMonth] = useState<string>(defaultMonth);
  const [startDate, setStartDate] = useState<string>(
    () => getMonthRange(defaultMonth).start
  );
  const [endDate, setEndDate] = useState<string>(
    () => getMonthRange(defaultMonth).end
  );

  useEffect(() => {
    const { start, end } = getMonthRange(month);
    setStartDate(start);
    setEndDate(end);
  }, [month]);

  const [rangeOpen, setRangeOpen] = useState(false);

  // refs for outside-click detection
  const rangeButtonRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // current month bounds (YYYY-MM-DD)
  const monthStart = getMonthRange(month).start;
  const monthEnd = getMonthRange(month).end;

  const clampDate = (d: string, min: string, max: string) => {
    if (d < min) return min;
    if (d > max) return max;
    return d;
  };

  // close popup on outside click or Escape key
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
          {/* Month picker (compact control) */}
          <div className="relative">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Tháng
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 w-48">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="flex-1 text-sm text-gray-700">
                {formatMonthLabel(month)}
              </div>
              <div className="relative">
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Date range (compact control with popup) */}
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

export default TimesheetFilters;
