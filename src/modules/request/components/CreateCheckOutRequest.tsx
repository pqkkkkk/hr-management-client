import React, { useState } from "react";
import { useApi } from "contexts/ApiContext";
import { CreateCheckOutRequestDTO } from "modules/request/types/request.types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface CheckoutModalProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: {
    date: string;
    time: string;
    reason: string;
    file?: File | null;
  }) => Promise<void>;
}

export default function CheckoutModal({ open, onClose, onSubmit }: CheckoutModalProps) {
  const { requestApi } = useApi();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const validate = async () => {
    const newErrors: Record<string, string> = {};

    // Kiểm tra ngày
    if (!date) {
      newErrors.date = "Vui lòng chọn ngày";
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        newErrors.date = "Không được chọn ngày trong tương lai";
      }
    }

    if (!time) {
      newErrors.time = "Vui lòng chọn giờ";
    } else if (date && !newErrors.date) {
      const selectedDateTime = new Date(`${date}T${time}`);
      const now = new Date();

      if (selectedDateTime > now) {
        newErrors.time = "Không được chọn thời điểm trong tương lai";
      }
    }

    // Bắt buộc nhập lý do nếu check-out trước 17:00
    if (time && time < "17:00" && !reason.trim()) {
      newErrors.reason = "Bạn phải nhập lý do nếu check-out trước 17h";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = await validate();
    if (!isValid) return;

    try {
      setLoading(true);

      // If custom onSubmit is provided, use it
      if (onSubmit) {
        await onSubmit({ date, time, reason, file });
        setLoading(false);
        handleSuccess();
        return;
      }
      const desiredCheckOutTime = `${date}T${time}:00`;
      const attachmentUrl = file ? `uploads/${file.name}` : undefined;

      const requestData: CreateCheckOutRequestDTO = {
        title: time < "17:00"
          ? `Yêu cầu check-out sớm - ${date} ${time}`
          : `Yêu cầu check-out - ${date} ${time}`,
        userReason: reason || undefined,
        desiredCheckOutTime,
        attachmentUrl,
      };

      const response = await requestApi.createCheckOutRequest(requestData);

      if (response.success) {
        setLoading(false);
        handleSuccess();
      } else {
        throw new Error(response.message || "Có lỗi xảy ra khi tạo yêu cầu");
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.message || "Có lỗi xảy ra khi tạo yêu cầu check-out");
    }
  };

  const handleSuccess = () => {
    setDate("");
    setTime("");
    setReason("");
    setFile(null);
    setErrors({});

    toast.success("Gửi yêu cầu check-out thành công!");

    // Close modal
    onClose?.();

    navigate("/requests/history");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl relative">

        {!loading && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            ✕
          </button>
        )}

        <h2 className="text-2xl font-semibold">Tạo yêu cầu check-out</h2>
        <p className="text-gray-500 text-sm mt-1">
          Điền thông tin yêu cầu của bạn. Quản lý sẽ xem xét và phê duyệt.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <label className="font-medium">Ngày</label>
            <input
              type="date"
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                errors.date ? "border-red-500" : "focus:ring-2 focus:ring-black"
              }`}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) {
                  setErrors({ ...errors, date: "" });
                }
              }}
              disabled={loading}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="font-medium">Giờ</label>
            <input
              type="time"
              className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                errors.time ? "border-red-500" : "focus:ring-2 focus:ring-black"
              }`}
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                if (errors.time) {
                  setErrors({ ...errors, time: "" });
                }
              }}
              disabled={loading}
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label className="font-medium">
            Lý do về sớm (bắt buộc nếu check-out trước 17h)
          </label>
          <textarea
            className={`w-full h-28 border rounded-lg px-3 py-2 mt-1 resize-none ${
              errors.reason ? "border-red-500" : "focus:ring-2 focus:ring-black"
            }`}
            placeholder="Nhập lý do về sớm"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (errors.reason) {
                setErrors({ ...errors, reason: "" });
              }
            }}
            disabled={loading}
          />
          {errors.reason && (
            <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
          )}
        </div>

        <div className="mt-5">
          <label className="font-medium">Đính kèm file (không bắt buộc)</label>
          <input
            type="file"
            className="mt-2 block w-full text-sm border rounded-lg p-2"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={loading}
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
            disabled={loading}
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading && (
              <svg
                className="w-5 h-5 animate-spin text-white"
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
            )}

            {loading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
}

