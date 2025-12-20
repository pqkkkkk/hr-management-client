import React, { useEffect, useRef, useState } from "react";
import { formatDateForInput, formatTimeForInput } from "shared/utils/date-utils";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CreateCheckInRequestDTO } from "../types/request.types";


const CheckInRequestForm: React.FC = () => {
  const { requestApi } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isBeforeEight = !!time && time < "08:00";

  useEffect(() => {
    const now = new Date();
    setDate(formatDateForInput(now));
    setTime(formatTimeForInput(now));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate date is not in the future
    const todayStr = formatDateForInput(new Date());
    if (date && date > todayStr) {
      setError("Không thể tạo yêu cầu cho thời gian ở tương lai.");
      return;
    }

    // If time >= 08:00 AM, reason is required
    if (!isBeforeEight && !reason.trim()) {
      setError("Vui lòng nhập lý do.");
      return;
    }

    setSubmitting(true);

    try {
      const desiredCheckInTime = `${date}T${time}:00`;

      const requestData: CreateCheckInRequestDTO = {
        title: time >= "08:00"
          ? `Yêu cầu check-in trễ - ${date} ${time}`
          : `Yêu cầu check-in - ${date} ${time}`,
        userReason: isBeforeEight ? undefined : reason,
        employeeId: user?.userId || "",
        desiredCheckInTime,
      };

      const response = await requestApi.createCheckInRequest(requestData);

      if (response.success) {
        toast.success("Gửi yêu cầu check-in thành công!");
        navigate("/requests/my-requests");
      } else {
        throw new Error(response.message || "Có lỗi xảy ra khi tạo yêu cầu");
      }
    } catch (err) {
      console.error("Failed to create check-in request:", err);
      toast.error(err?.message || "Có lỗi xảy ra khi tạo yêu cầu check-in");
    } finally {
      setSubmitting(false);
    }
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
              className={`w-full border rounded p-3 min-h-[90px] resize-none ${isBeforeEight ? "opacity-50 pointer-events-none" : ""
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
              className={`border-2 ${dragOver && !isBeforeEight
                ? "border-blue-400 bg-blue-50"
                : "border-dashed border-gray-300 bg-white"
                } rounded p-6 text-center ${isBeforeEight
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

      </div>
    </div>
  );
};

export default CheckInRequestForm;
