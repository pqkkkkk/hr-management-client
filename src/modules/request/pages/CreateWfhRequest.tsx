import React, { useState, useRef } from "react";
import { X, Paperclip, ChevronDown } from "lucide-react";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFileUpload } from "shared/hooks/useFileUpload";
import {
  CreateWfhRequestDTO,
  ShiftType,
  WfhDate,
  shiftTypeOptions,
} from "../types/request.types";

interface WfhModalProps {
  isModalMode?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const WfhRequestForm: React.FC<WfhModalProps> = ({
  isModalMode = true,
  open,
  onClose,
}) => {
  const { requestApi } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [shift, setShift] = useState<ShiftType>(ShiftType.FULL_DAY);
  const [workLocation, setWorkLocation] = useState("");
  const [reason, setReason] = useState("");
  const [commitment, setCommitment] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remainingWfhDays = user?.remainingWfhDays || 10;
  const { uploadSingleFile, uploading } = useFileUpload();

  if (isModalMode && open === false) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }
    if (!endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }
    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    if (!workLocation.trim()) {
      newErrors.workLocation = "Vui lòng nhập địa chỉ làm việc";
    }
    if (!commitment) {
      newErrors.commitment = "Vui lòng xác nhận cam kết";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const selectedFile = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      toast.error("Tệp không được vượt quá 5MB");
      return;
    }
    setFile(selectedFile);
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    onFileSelect(e.dataTransfer.files);
  };

  const removeFile = () => {
    setFile(null);
  };

  const generateWfhDates = (): WfhDate[] => {
    const dates: WfhDate[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      // Skip weekends
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push({
          date: d.toISOString().split("T")[0],
          shiftType: shift,
        });
      }
    }
    return dates;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      // Upload attachment file if exists
      let attachmentUrl: string | undefined = undefined;
      if (file) {
        attachmentUrl = await uploadSingleFile(file, {
          errorMessage: "Không thể tải lên tệp đính kèm.",
        });
      }

      setLoading(true);
      const wfhDates = generateWfhDates();

      const requestData: CreateWfhRequestDTO = {
        title: `Yêu cầu làm việc từ xa - ${startDate} đến ${endDate}`,
        employeeId: user?.userId || "",
        userReason: reason || "Không có lý do",
        wfhCommitment: commitment,
        workLocation,
        wfhDates,
        attachmentUrl,
      };

      await requestApi.createWfhRequest(requestData);

      toast.success("Gửi yêu cầu WFH thành công!");
      if (isModalMode) {
        onClose?.();
      }
      navigate("/requests/my-requests");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi tạo yêu cầu WFH";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStartDate("");
    setEndDate("");
    setShift(ShiftType.FULL_DAY);
    setWorkLocation("");
    setReason("");
    setCommitment(false);
    setFile(null);
    setErrors({});
    if (isModalMode) {
      onClose?.();
    }
  };

  const formContent = (
    <div
      className={`w-full max-w-3xl rounded-xl bg-white p-5 shadow-lg sm:p-6 max-h-[90vh] overflow-y-auto`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            Tạo yêu cầu làm việc từ xa
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Điền thông tin yêu cầu của bạn. Quản lý sẽ xem xét và phê duyệt.
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="rounded-full p-1 hover:bg-gray-100"
          disabled={loading}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Ngày bắt đầu
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black ${
              errors.startDate ? "border-red-500" : ""
            }`}
            disabled={loading}
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">
            Ngày kết thúc
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black ${
              errors.endDate ? "border-red-500" : ""
            }`}
            disabled={loading}
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">
            Ca làm việc
          </label>
          <div className="relative">
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value as ShiftType)}
              className="w-full appearance-none rounded-lg border px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-black"
              disabled={loading}
            >
              {shiftTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">
            Địa chỉ làm việc
          </label>
          <input
            type="text"
            placeholder="Nhập địa chỉ"
            value={workLocation}
            onChange={(e) => setWorkLocation(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black ${
              errors.workLocation ? "border-red-500" : ""
            }`}
            disabled={loading}
          />
          {errors.workLocation && (
            <p className="mt-1 text-xs text-red-500">{errors.workLocation}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-semibold">Lý do</label>
          <textarea
            rows={3}
            placeholder="Nhập lý do"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            disabled={loading}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-semibold">
            Đính kèm file
          </label>
          <div
            onDragOver={(e) => {
              if (uploading || loading) return;
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => {
              setDragOver(false);
            }}
            onDrop={(e) => {
              if (!uploading && !loading) handleDrop(e);
            }}
            className={`border-2 ${
              dragOver
                ? "border-blue-400 bg-blue-50"
                : "border-dashed border-gray-300 bg-white"
            } rounded-lg p-6 text-center ${
              uploading || loading
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer"
            }`}
            onClick={() => {
              if (!uploading && !loading) fileInputRef.current?.click();
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
                <div className="text-gray-500">
                  Nhấn để tải lên hoặc kéo thả
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  PNG, JPG, PDF (Tối đa 5MB)
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={(e) => onFileSelect(e.target.files)}
              className="hidden"
              disabled={uploading || loading}
            />
          </div>
          {file && !uploading && (
            <div className="mt-3 flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2 text-sm">
              <div>
                <div className="font-medium text-gray-800">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700 text-xs font-medium"
                disabled={loading}
              >
                Xóa
              </button>
            </div>
          )}
        </div>

        <div className="flex items-end">
          <p className="text-sm font-semibold">
            Số ngày WFH còn lại:{" "}
            <span className="font-bold">{remainingWfhDays}</span>
          </p>
        </div>

        <div className="sm:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={commitment}
            onChange={(e) => setCommitment(e.target.checked)}
            disabled={loading}
          />
          <span
            className={`text-sm ${errors.commitment ? "text-red-500" : ""}`}
          >
            Tôi cam kết đảm bảo tiến độ công việc
          </span>
        </div>
        {errors.commitment && (
          <p className="text-xs text-red-500 sm:col-span-2">
            {errors.commitment}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          onClick={handleCancel}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          disabled={loading || uploading}
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          disabled={loading || uploading}
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </div>
  );

  if (isModalMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        {formContent}
      </div>
    );
  }

  // Render as page
  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-3xl">{formContent}</div>
    </div>
  );
};

export default WfhRequestForm;
