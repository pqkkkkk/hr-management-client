import { useMemo } from "react";
import { RewardProgram } from "../types/reward.types";

interface RewardProgramHeaderProps {
  program: RewardProgram;
  userPoints: number;
}

export default function RewardProgramHeader({ program, userPoints }: RewardProgramHeaderProps) {
  const nf = useMemo(() => new Intl.NumberFormat("vi-VN"), []);

  // Format dates
  const dateRange = useMemo(() => {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN");
    };
    return `${formatDate(program.startDate)} - ${formatDate(program.endDate)}`;
  }, [program.startDate, program.endDate]);

  // Status badge config
  const statusConfig = useMemo(() => {
    switch (program.status) {
      case "ACTIVE":
        return { label: "🟢 ĐANG DIỄN RA", className: "bg-green-500/20" };
      case "PENDING":
        return { label: "🟡 SẮP DIỄN RA", className: "bg-yellow-500/20" };
      case "INACTIVE":
        return { label: "⚪ ĐÃ KẾT THÚC", className: "bg-gray-500/20" };
      default:
        return { label: program.status, className: "bg-gray-500/20" };
    }
  }, [program.status]);

  // User rank based on points
  const userRank = useMemo(() => {
    if (userPoints >= 2000) return "💎 Hạng Kim Cương";
    if (userPoints >= 1000) return "⭐ Hạng Vàng";
    if (userPoints >= 500) return "🥈 Hạng Bạc";
    return "🥉 Hạng Đồng";
  }, [userPoints]);

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 to-blue-300 p-8 text-white">
      <div className="flex items-start justify-between">
        <div>
          <span className={`inline-flex items-center gap-2 rounded-full ${statusConfig.className} px-3 py-1 text-sm`}>
            {statusConfig.label}
          </span>

          <p className="mt-2 text-sm opacity-90">
            📅 {dateRange}
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-snug">
            {program.name}
          </h1>

          <p className="mt-3 max-w-xl text-sm opacity-90">
            {program.description}
          </p>
        </div>

        <div className="rounded-xl bg-white/20 p-6 text-center backdrop-blur">
          <p className="text-sm">ĐIỂM HIỆN CÓ CỦA BẠN</p>
          <p className="mt-2 text-4xl font-bold">{nf.format(userPoints)}</p>
          <p className="mt-1 text-sm">{userRank}</p>
        </div>
      </div>
    </div>
  );
}
