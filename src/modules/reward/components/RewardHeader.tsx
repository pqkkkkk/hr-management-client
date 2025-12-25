
export default function RewardHeader() {
  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 to-blue-300 p-8 text-white">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-sm">
            🟢 ĐANG DIỄN RA (ACTIVE)
          </span>

          <p className="mt-2 text-sm opacity-90">
            📅 01/06/2024 - 31/12/2024
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-snug">
            Khen Thưởng Thành <br />
            Tích Quý 3 & 4 - 2024
          </h1>

          <p className="mt-3 max-w-xl text-sm opacity-90">
            Cơ hội đổi những phần quà hấp dẫn dành cho những nỗ lực tuyệt vời
            của bạn trong suốt thời gian qua.
          </p>
        </div>

        <div className="rounded-xl bg-white/20 p-6 text-center backdrop-blur">
          <p className="text-sm">ĐIỂM HIỆN CÓ CỦA BẠN</p>
          <p className="mt-2 text-4xl font-bold">1,250</p>
          <p className="mt-1 text-sm">⭐ Hạng Vàng</p>
        </div>
      </div>
    </div>
  );
}
