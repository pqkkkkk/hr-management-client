import React, { useState } from "react";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    time: string;
    reason: string;
    file?: File | null;
  }) => void;
}

export default function CheckoutModal({
  open,
  onClose,
  onSubmit,
}: CheckoutModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit({ date, time, reason, file });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold">Tạo yêu cầu check-out</h2>
        <p className="text-gray-500 text-sm mt-1">
          Điền thông tin yêu cầu của bạn. Quản lý sẽ xem xét và phê duyệt.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <label className="font-medium">Ngày</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-black"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium">Giờ</label>
            <input
              type="time"
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-black"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="font-medium">
            Lý do về sớm (nếu check-out trước 17h)
          </label>
          <textarea
            className="w-full h-28 border rounded-lg px-3 py-2 mt-1 resize-none focus:ring-2 focus:ring-black"
            placeholder="Nhập lý do về sớm"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <label className="font-medium">
            Đính kèm file (nếu liên quan đến lý do về sớm)
          </label>
          <input
            type="file"
            className="mt-2 block w-full text-sm border rounded-lg p-2 cursor-pointer"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
