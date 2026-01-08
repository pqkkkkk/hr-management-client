import React, { useEffect, useRef, useState } from "react";
import {
  formatDateForInput,
  formatTimeForInput,
} from "shared/utils/date-utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useApi } from "contexts/ApiContext";
import { CreateTimesheetUpdateRequestDTO } from "../types/request.types";
import { useAuth } from "contexts/AuthContext";
import { useFileUpload } from "shared/hooks/useFileUpload";

interface UpdateTimesheetModalProps {
  isModalMode?: boolean;
  open?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
}

const UpdateTimesheetRequestForm: React.FC<UpdateTimesheetModalProps> = ({
  isModalMode = false,
  open = true,
  onClose,
  onSubmit,
}) => {
  const navigate = useNavigate();
  const { requestApi, timesheetApi } = useApi();
  const { user } = useAuth();

  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [currentCheckInTime, setCurrentCheckInTime] = useState<string>("");
  const [currentCheckOutTime, setCurrentCheckOutTime] = useState<string>("");
  const [desiredCheckInTime, setDesiedCheckInTime] = useState<string>("");
  const [desiredCheckOutTime, setDesiredCheckOutTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadSingleFile, uploading } = useFileUpload();

  useEffect(() => {
    const now = new Date();
    setTargetDate(now);
    setDesiedCheckInTime(formatTimeForInput(now));
    const d = new Date(now.getTime());
    d.setHours(d.getHours() + 9);
    setDesiredCheckOutTime(formatTimeForInput(d));
  }, []);

  // Auto fill check in time and check out time of target date
  // Raise error if timesheet record of target date is not found
  useEffect(() => {
    if (!targetDate) return;
    const getTimesheet = async () => {
      try {
        const response = await timesheetApi.getTimesheetByEmployeeIdAndDate(
          user?.userId || "",
          targetDate.toISOString().split("T")[0]
        );

        if (!response.data) {
          throw new Error("Bảng chấm công chưa tồn tại ngày đã chọn. Không thể gửi yêu cầu cập nhật bảng chấm công cho ngày này");
        }

        setCurrentCheckInTime(response.data.checkInTime ? formatTimeForInput(new Date(response.data.checkInTime)) : "Không có check in");
        setCurrentCheckOutTime(response.data.checkOutTime ? formatTimeForInput(new Date(response.data.checkOutTime)) : "Không có check out");
      } catch (error) {
        toast.error(error.message);
      }
    };
    getTimesheet();
  }, [targetDate]);

  // If rendered as modal but not open, do not render anything
  if (isModalMode && !open) return null;

  const onFiles = (fList: FileList | null) => {
    setFile(fList && fList[0] ? fList[0] : null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    onFiles(e.dataTransfer.files);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleCancel = () => {
    setDesiedCheckInTime("");
    setDesiredCheckOutTime("");
    setReason("");
    setFile(null);
    setErrors({});
    if (isModalMode) onClose?.();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!targetDate) {
      newErrors.date = "Vui lòng chọn ngày";
    }
    if (!desiredCheckInTime) {
      newErrors.timeIn = "Vui lòng chọn giờ vào";
    }
    if (!desiredCheckOutTime) {
      newErrors.timeOut = "Vui lòng chọn giờ ra";
    }
    if (desiredCheckInTime && desiredCheckOutTime && desiredCheckInTime >= desiredCheckOutTime) {
      newErrors.timeOut = "Giờ ra phải sau giờ vào";
    }
    if (!reason.trim()) {
      newErrors.reason = "Vui lòng nhập lý do";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    let attachmentUrl: string | undefined;
    if (file) {
      attachmentUrl = await uploadSingleFile(file, {
        errorMessage: "Không thể tải lên tệp đính kèm.",
      });
    }

    setSubmitting(true);
    try {
      const timeSheetData: CreateTimesheetUpdateRequestDTO = {
        title: `Yêu cầu cập nhật timesheet - ${targetDate?.toISOString().split("T")[0]
          } ${desiredCheckInTime}-${desiredCheckOutTime}`,
        userReason: reason,
        employeeId: user?.userId || "u1a2b3c4-e5f6-7890-abcd-ef1234567890",
        targetDate: targetDate?.toISOString().split("T")[0],
        desiredCheckInTime: `${targetDate?.toISOString().split("T")[0]
          }T${desiredCheckInTime}:00`,
        currentCheckInTime: `${targetDate?.toISOString().split("T")[0]
          }T${currentCheckInTime}:00`,
        desiredCheckOutTime: `${targetDate?.toISOString().split("T")[0]
          }T${desiredCheckOutTime}:00`,
        currentCheckOutTime: `${targetDate?.toISOString().split("T")[0]
          }T${currentCheckOutTime}:00`,
        attachmentUrl,
      };
      await requestApi.createTimesheetUpdateRequest(timeSheetData);

      toast.success("Gửi yêu cầu thành công!");
      onSubmit?.();

      setTargetDate(null);
      setDesiedCheckInTime("");
      setDesiredCheckOutTime("");
      setReason("");
      setFile(null);
      setErrors({});
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi tạo yêu cầu cập nhật timesheet";

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formContent = (
    <form
      onSubmit={handleSubmit}
      className={`${isModalMode
        ? "bg-white rounded-xl w-full max-w-lg shadow-xl"
        : "bg-white rounded-lg shadow-md"
        } p-6 relative`}
    >
      {isModalMode && !submitting && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
      )}

      <h2 className="text-2xl font-semibold">Cập nhật chấm công</h2>

      <div className="mb-4 mt-6">
        <label className="text-sm text-gray-600 block mb-2">Ngày</label>
        <div className="flex items-center">
          <input
            type="date"
            className={`w-full border rounded px-3 py-2 ${errors.date ? "border-red-500" : ""
              }`}
            value={targetDate?.toISOString().split("T")[0]}
            onChange={(e) => setTargetDate(new Date(e.target.value))}
          />
        </div>
        {errors.date && (
          <p className="mt-1 text-xs text-red-500">{errors.date}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-600 block mb-2">
          Thời gian hiện tại
        </label>
        <div className="flex gap-3 mb-4">
          <div className="flex-1 border border-gray-200 rounded p-3 bg-gray-50">
            <div className="text-xs text-gray-500">Giờ vào</div>
            <div className="font-medium">{currentCheckInTime}</div>
          </div>
          <div className="flex-1 border border-gray-200 rounded p-3 bg-gray-50">
            <div className="text-xs text-gray-500">Giờ ra</div>
            <div className="font-medium">{currentCheckOutTime}</div>
          </div>
        </div>

        <label className="text-sm text-gray-600 block mb-2">
          Thời gian đề xuất
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="time"
              className={`w-full border rounded px-3 py-2 ${errors.timeIn ? "border-red-500" : ""
                }`}
              value={desiredCheckInTime}
              onChange={(e) => setDesiedCheckInTime(e.target.value)}
            />
            {errors.timeIn && (
              <p className="mt-1 text-xs text-red-500">{errors.timeIn}</p>
            )}
          </div>
          <div>
            <input
              type="time"
              className={`w-full border rounded px-3 py-2 ${errors.timeOut ? "border-red-500" : ""
                }`}
              value={desiredCheckOutTime}
              onChange={(e) => setDesiredCheckOutTime(e.target.value)}
            />
            {errors.timeOut && (
              <p className="mt-1 text-xs text-red-500">{errors.timeOut}</p>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Thứ tự: Giờ vào (trái) · Giờ ra (phải)
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-600 block mb-2">
          Lý do / Ghi chú
        </label>
        <textarea
          className={`w-full border rounded p-3 min-h-[90px] resize-none ${errors.reason ? "border-red-500" : ""
            }`}
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Mô tả chi tiết lý do cần thay đổi..."
        />
        {errors.reason && (
          <p className="mt-1 text-xs text-red-500">{errors.reason}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-600 block mb-2">
          Tệp đính kèm (nếu có)
        </label>
        <div
          onDragOver={(e) => {
            if (uploading || submitting) return;
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            if (!uploading && !submitting) handleDrop(e);
          }}
          className={`border-2 ${dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-dashed border-gray-300 bg-white"
            } rounded p-6 text-center ${uploading || submitting
              ? "opacity-50 pointer-events-none"
              : "cursor-pointer"
            }`}
          onClick={() => {
            if (!uploading && !submitting) fileInputRef.current?.click();
          }}
        >
          {uploading ? (
            <>
              <svg
                className="w-8 h-8 animate-spin mx-auto text-blue-600"
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
              <div className="text-blue-600 mt-2">Đang tải lên...</div>
            </>
          ) : (
            <>
              <div className="text-gray-500">Nhấn để tải lên hoặc kéo thả</div>
              <div className="text-xs text-gray-400">
                PNG, JPG, PDF (Tối đa 10MB)
              </div>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={(e) => onFiles(e.target.files)}
            className="hidden"
            disabled={uploading || submitting}
          />
        </div>

        {file && !uploading && (
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
                onClick={() => removeFile()}
                className="text-red-500 text-sm"
                disabled={submitting}
              >
                Xóa
              </button>
            </li>
          </ul>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border rounded bg-white"
          disabled={uploading || submitting}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2 disabled:opacity-50"
          disabled={uploading || submitting}
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
  );

  // Render as modal or page
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
      <div className="w-full max-w-lg">{formContent}</div>
    </div>
  );
};

export default UpdateTimesheetRequestForm;
