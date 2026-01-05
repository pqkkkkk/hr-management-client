import React, { useState, useEffect, useRef } from "react";
import { formatDateForInput, formatTimeForInput } from "shared/utils/date-utils";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import { toast } from "react-toastify";
import { CreateCheckOutRequestDTO } from "../types/request.types";
import { useNavigate } from "react-router-dom";

interface CheckoutModalProps {
  isModalMode?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const CheckOutRequestForm: React.FC<CheckoutModalProps> = ({
  isModalMode = false,
  open,
  onClose
}) => {
  const { requestApi, fileApi } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isBeforeSeventeen = !!time && time < "17:00";

  // Auto-fill date and time on mount
  useEffect(() => {
    const now = new Date();
    setDate(formatDateForInput(now));
    setTime(formatTimeForInput(now));
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // If in modal mode and not open, don't render
  if (isModalMode && !open) return null;

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

  const onFileSelect = (fList: FileList | null) => {
    if (!fList) return;
    const arr = Array.from(fList);

    setFile(arr[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    onFileSelect(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    const isValid = await validate();
    if (!isValid) return;

    try {
      setLoading(true);

      // Upload attachment file if exists to get attachmentUrl first
      let attachmentUrl: string | undefined = undefined;
      if (file) {
        try {
          const uploadResponse = await fileApi.uploadFile(file);
          if (uploadResponse.success && uploadResponse.data) {
            attachmentUrl = uploadResponse.data;
          }
        } catch (uploadError) {
          console.error("Failed to upload file:", uploadError);
          // Continue without attachment if upload fails
          toast.warning("Không thể tải lên tệp đính kèm. Yêu cầu sẽ được gửi không có tệp.");
        }
      }

      const desiredCheckOutTime = `${date}T${time}:00`;

      const requestData: CreateCheckOutRequestDTO = {
        title: time < "17:00"
          ? `Yêu cầu check-out sớm - ${date} ${time}`
          : `Yêu cầu check-out - ${date} ${time}`,
        userReason: reason || undefined,
        employeeId: user?.userId || "",
        desiredCheckOutTime,
        attachmentUrl,
      };

      await requestApi.createCheckOutRequest(requestData);

      setLoading(false);
      handleSuccess();

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message
        || error?.message
        || 'Có lỗi xảy ra khi tạo yêu cầu check-out';

      toast.error(errorMessage);
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

  // Form content component
  const formContent = (
    <form onSubmit={handleSubmit} className={`${isModalMode ? 'bg-white rounded-xl w-full max-w-lg shadow-xl' : 'bg-white rounded-lg shadow'} p-6 relative`}>
      {isModalMode && !loading && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
      )}

      <h2 className="text-2xl font-semibold">Tạo yêu cầu check-out</h2>
      <p className="text-gray-500 text-sm mt-1">
        Vui lòng điền đầy đủ thông tin bên dưới
      </p>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <label className="text-sm text-gray-600 block mb-2">Ngày</label>
          <input
            type="date"
            className={`w-full border rounded px-3 py-2 ${errors.date ? "border-red-500" : "focus:ring-2 focus:ring-black"
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
          <label className="text-sm text-gray-600 block mb-2">Giờ</label>
          <input
            type="time"
            className={`w-full border rounded px-3 py-2 ${errors.time ? "border-red-500" : ""
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

      <div className="mt-4">
        <label className="text-sm text-gray-600 block mb-2">
          Lý do về sớm (bắt buộc nếu check-out trước 17h){" "}
          {isBeforeSeventeen ? <span className="text-red-500">*</span> : null}
        </label>
        <textarea
          className={`w-full border rounded p-3 min-h-[90px] resize-none ${!isBeforeSeventeen ? "opacity-50 pointer-events-none" : ""
            } ${errors.reason ? "border-red-500" : ""
            }`}
          placeholder={
            !isBeforeSeventeen
              ? "Không cần nhập lý do"
              : "Nhập lý do chi tiết (bắt buộc)"
          }
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (errors.reason) {
              setErrors({ ...errors, reason: "" });
            }
          }}
          disabled={!isBeforeSeventeen || loading}
        />
        {errors.reason && (
          <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="text-sm text-gray-600 block mb-2">
          Đính kèm file (tùy chọn)
        </label>
        <div
          onDragOver={(e) => {
            if (!isBeforeSeventeen) return;
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => {
            if (isBeforeSeventeen) setDragOver(false);
          }}
          onDrop={(e) => {
            if (isBeforeSeventeen) handleDrop(e);
          }}
          className={`border-2 ${dragOver && isBeforeSeventeen
            ? "border-blue-400 bg-blue-50"
            : "border-dashed border-gray-300 bg-white"
            } rounded p-6 text-center ${!isBeforeSeventeen
              ? "opacity-50 pointer-events-none"
              : "cursor-pointer"
            }`}
          onClick={() => {
            if (isBeforeSeventeen) fileInputRef.current?.click();
          }}
        >
          <div className="text-gray-500">
            {!isBeforeSeventeen
              ? "Không cần đính kèm file"
              : "Nhấn để tải lên hoặc kéo thả"}
          </div>
          <div className="text-xs text-gray-400">
            PNG, JPG, PDF (Tối đa 5MB)
          </div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => onFileSelect(e.target.files)}
            className="hidden"
            disabled={!isBeforeSeventeen || loading}
          />
        </div>
        {file && (
          <ul className="mt-3">
            <li
              key={file.name}
              className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2 text-sm mb-2"
            >
              <div>
                <div className="font-medium">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(0)} KB
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-red-500 text-sm"
              >
                Xóa
              </button>
            </li>
          </ul>
        )}
      </div>

      {errors.submit && (
        <div className="text-red-600 text-sm mt-3">{errors.submit}</div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex items-center justify-end gap-3">
        {!isModalMode && (
          <button
            type="button"
            onClick={() => {
              setReason("");
              setFile(null);
              setErrors({});
            }}
            className="px-4 py-2 border rounded bg-white"
            disabled={loading}
          >
            Hủy
          </button>
        )}
        {isModalMode && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-40"
            disabled={loading}
          >
            Hủy
          </button>
        )}

        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2"
          disabled={loading}
        >
          {loading && (
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
          )}
          {loading ? "Đang gửi..." : "Gửi Yêu Cầu"}
        </button>
      </div>
    </form>
  );

  // Render as modal or page based on props
  if (isModalMode) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        {formContent}
      </div>
    );
  }

  // Render as page
  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {formContent}
      </div>
    </div>
  );
};

export default CheckOutRequestForm;
