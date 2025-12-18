import React, { useEffect, useState } from "react";
import TimesheetHeader from "../components/TimesheetHeader";
import TimesheetFilters from "../components/TimesheetFilters";
import TimesheetTable from "../components/TimesheetTable";
import Pagination from "../components/Pagination";
import { TimesheetEntry } from "../components/TimesheetRow";
import { mockRequestApi } from "services/api/request.api";
import { formatDate } from "shared/utils/date-utils";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { TimesheetSummary } from "../types/request.types";

const TimesheetViewPage = () => {
  const [data, setData] = useState<TimesheetEntry[]>([]);
  const [summary, setSummary] = useState<TimesheetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(false);
      try {
        const ym = new Date().toISOString().slice(0, 7); // YYYY-MM
        const res = await mockRequestApi.getTimesheet("NV001", ym);
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
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bảng Chấm Công</h1>
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
          <TimesheetHeader summary={summary} />
          <TimesheetFilters />
          <TimesheetTable data={data} />
        </>
      )}
    </div>
  );
};

export default TimesheetViewPage;
