const StatusCard: React.FC = () => {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
      <h2 className="font-semibold mb-2">Trạng thái hệ thống</h2>

      <div className="flex items-center gap-2 text-sm mb-4">
        <span className="w-2 h-2 bg-green-400 rounded-full" />
        Đang có 1 đợt Active
      </div>

      <div className="bg-white/10 rounded-xl p-4 text-sm">
        <p className="font-medium">Khen thưởng Quý 3 - 2023</p>
        <p className="text-white/80 mt-1">Kết thúc: 30/09/2023</p>
      </div>

      <p className="text-xs mt-4 text-white/80">
        ℹ️ Lưu ý: Kích hoạt đợt mới sẽ yêu cầu kết thúc đợt hiện tại.
      </p>
    </div>
  );
};

export default StatusCard;
