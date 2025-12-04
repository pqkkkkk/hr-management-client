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