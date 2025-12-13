import React, { useEffect, useRef, useState } from "react";
import { formatDateForInput, formatTimeForInput } from "shared/utils/date-utils";

const CheckInRequestForm: React.FC = () => {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const isBeforeEight = !!time && time < "08:00";

  useEffect(() => {
    const now = new Date();
    setDate(formatDateForInput(now));
    setTime(formatTimeForInput(now));
  }, []);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(false), 4000);
      return () => clearTimeout(t);
    }
  }, [success]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as unknown as number);
      }
    };
  }, []);

  const onFiles = (fList: FileList | null) => {
    if (!fList) return;
    const arr = Array.from(fList);
    const filtered = arr.filter((f) => f.size <= 5 * 1024 * 1024);
    setFiles((prev) => [...prev, ...filtered]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    onFiles(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Chặn việc tạo yêu cầu cho các ngày trong tương lai
    const todayStr = formatDateForInput(new Date());
    if (date && date > todayStr) {
      setError("Không thể tạo yêu cầu cho thời gian ở tương lai.");
      return;
    }

    // Nếu thời gian >= 08:00 A.M, lý do là bắt buộc. Nếu trước 08:00, lý do bị vô hiệu hóa.
    if (!isBeforeEight && !reason.trim()) {
      setError("Vui lòng nhập lý do.");
      return;
    }

    // Mô phỏng độ trễ của server: đặt trạng thái đang gửi, sau đó hiển thị thành công
    setSubmitting(true);
    //(ví dụ: 1,5 giây)
    timeoutRef.current = window.setTimeout(() => {
      setSuccess(true);
      setReason("");
      setFiles([]);
      setSubmitting(false);
      timeoutRef.current = null;
    }, 1500);
  };

  const removeFile = (index: number) => {
    setFiles((f) => f.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <h2 className="text-center text-2xl font-semibold mb-1">
          Tạo Yêu cầu Check-in
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Vui lòng điền đầy đủ thông tin bên dưới
        </p>
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Ngày */}
            <div>
              <label className="text-sm text-gray-600 block mb-2">Ngày</label>
              <div className="flex items-center">
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Giờ */}
            <div>
              <label className="text-sm text-gray-600 block mb-2">Giờ</label>
              <div className="flex items-center">
                <input
                  type="time"
                  className="w-full border rounded px-3 py-2"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Lý do đi trễ */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">
              Lý do đi trễ (nếu check-in sau 8h){" "}
              {isBeforeEight ? null : <span className="text-red-500">*</span>}
            </label>
            <textarea
              className={`w-full border rounded p-3 min-h-[90px] resize-none ${
                isBeforeEight ? "opacity-50 pointer-events-none" : ""
              }`}
              placeholder={
                isBeforeEight
                  ? "Không cần nhập lý do"
                  : "Nhập lý do chi tiết (bắt buộc)"
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isBeforeEight}
            />
          </div>
          {/* Đính kèm file */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">
              Đính kèm file (tùy chọn)
            </label>
            <div
              onDragOver={(e) => {
                if (isBeforeEight) return;
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => {
                if (!isBeforeEight) setDragOver(false);
              }}
              onDrop={(e) => {
                if (!isBeforeEight) handleDrop(e);
              }}
              className={`border-2 ${
                dragOver && !isBeforeEight
                  ? "border-blue-400 bg-blue-50"
                  : "border-dashed border-gray-300 bg-white"
              } rounded p-6 text-center ${
                isBeforeEight
                  ? "opacity-50 pointer-events-none"
                  : "cursor-pointer"
              }`}
              onClick={() => {
                if (!isBeforeEight) fileInputRef.current?.click();
              }}
            >
              <div className="text-gray-500">
                {isBeforeEight
                  ? "Không cần đính kèm file"
                  : "Nhấn để tải lên hoặc kéo thả"}
              </div>
              <div className="text-xs text-gray-400">
                PNG, JPG, PDF (Tối đa 5MB)
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => onFiles(e.target.files)}
                className="hidden"
                disabled={isBeforeEight}
              />
            </div>
            {/* Danh sách file đã đính kèm */}
            {files.length > 0 && (
              <ul className="mt-3">
                {files.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2 text-sm mb-2"
                  >
                    <div>
                      <div className="font-medium">{f.name}</div>
                      <div className="text-xs text-gray-500">
                        {(f.size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-red-500 text-sm"
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Hiển thị lỗi */}
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          {/* Button */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setReason("");
                setFiles([]);
                setError(null);
              }}
              className="px-4 py-2 border rounded bg-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Đang gửi...
                </>
              ) : (
                "Gửi Yêu Cầu"
              )}
            </button>
          </div>
        </form>

        {/* Success toast */}
        {success && (
          <div className="fixed right-6 bottom-6 bg-green-600 text-white rounded-lg shadow-lg px-4 py-3 flex items-start gap-3">
            <div className="text-sm">Yêu cầu check-in của bạn đã được gửi.</div>
            <button
              className="ml-3 opacity-90"
              onClick={() => setSuccess(false)}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInRequestForm;
