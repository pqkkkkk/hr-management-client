export const formatDate = (d?: Date | string): string => {
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

export const parseDate = (dateStr: string): Date | null => {
  // Expected format: DD/MM/YYYY
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return null;
};

/**
 * Format date to YYYY-MM-DD (for HTML input type="date")
 */
export const formatDateForInput = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Format time to HH:MM (for HTML input type="time")
 */
export const formatTimeForInput = (d: Date): string => {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export type DateTimeDisplay = {
  date: string;
  time: string;
};

export const formatDateTime = (
  d?: Date | string,
  options?: {
    locale?: string;
    timeZone?: string;
  }
): DateTimeDisplay => {
  if (!d) return { date: "-", time: "-" };

  const locale = options?.locale ?? "vi-VN";
  const timeZone = options?.timeZone;

  const dateObj = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dateObj.getTime())) return { date: "-", time: "-" };

  const date = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(timeZone ? { timeZone } : {}),
  }).format(dateObj);

  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...(timeZone ? { timeZone } : {}),
  }).format(dateObj);

  return { date, time };
};

/**
 * Return YYYY-MM using UTC calendar fields.
 */
export const formatMonthKeyUtc = (d: Date): string => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

/**
 * Human-friendly month label for UI.
 */
export const formatMonthLabel = (monthKey: string, nowMonthKey: string) => {
  if (monthKey === nowMonthKey) return "Tháng này";
  const [y, m] = monthKey.split("-");
  return `Tháng ${m}/${y}`;
};

/**
 * Build last N month keys (YYYY-MM) counting backwards from the given date.
 */
export const buildRecentMonthKeysUtc = (baseDate: Date, months: number) => {
  const out: string[] = [];
  const d = new Date(baseDate);
  for (let i = 0; i < months; i++) {
    out.push(formatMonthKeyUtc(d));
    d.setUTCMonth(d.getUTCMonth() - 1);
  }
  return out;
};

/**
 * For a monthKey YYYY-MM, return the next-month reset date label (DD/MM/YYYY) in UTC.
 */
export const getNextMonthResetLabelUtc = (
  monthKey: string,
  options?: { locale?: string }
) => {
  const locale = options?.locale ?? "vi-VN";
  const [y, m] = monthKey.split("-").map((x) => Number(x));
  const reset = new Date(Date.UTC(y, m, 1, 0, 0, 0));
  return formatDateTime(reset, { locale, timeZone: "UTC" }).date;
};

/**
 * Convert an ISO string to YYYY-MM using UTC calendar fields.
 */
export const formatMonthKeyFromIsoUtc = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return formatMonthKeyUtc(d);
};
