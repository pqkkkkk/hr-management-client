import React, { useState, useRef } from "react";
import { X } from "lucide-react";
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

// ==================== WfhDatesEditor Component ====================
interface WfhDatesEditorProps {
  wfhDates: WfhDate[];
  onWfhDatesChange: (dates: WfhDate[]) => void;
  remainingDays: number;
  disabled?: boolean;
}

const WfhDatesEditor: React.FC<WfhDatesEditorProps> = ({
  wfhDates,
  onWfhDatesChange,
  remainingDays,
  disabled = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<ShiftType>(
    ShiftType.FULL_DAY
  );
  const [dateError, setDateError] = useState<string>("");

  const calculateTotalDays = (dates: WfhDate[]): number => {
    return dates.reduce((sum, date) => {
      return sum + (date.shiftType === ShiftType.FULL_DAY ? 1 : 0.5);
    }, 0);
  };

  const totalDays = calculateTotalDays(wfhDates);

  const handleAddDate = () => {
    setDateError("");

    if (!selectedDate) {
      setDateError("Vui lòng chọn ngày");
      return;
    }

    // Check if date is weekend
    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setDateError("Không thể chọn ngày cuối tuần");
      return;
    }

    // Check if date already exists
    const isDuplicate = wfhDates.some((item) => item.date === selectedDate);
    if (isDuplicate) {
      setDateError("Ngày này đã được chọn");
      return;
    }

    // Check if adding this date would exceed remaining days
    const daysToAdd = selectedShift === ShiftType.FULL_DAY ? 1 : 0.5;
    if (totalDays + daysToAdd > remainingDays) {
      setDateError("Số ngày WFH sẽ vượt quá số ngày còn lại");
      return;
    }

    const newWfhDate: WfhDate = {
      date: selectedDate,
      shiftType: selectedShift,
    };

    onWfhDatesChange([...wfhDates, newWfhDate]);
    setSelectedDate("");
    setSelectedShift(ShiftType.FULL_DAY);
  };

  const handleRemoveDate = (index: number) => {
    const newDates = wfhDates.filter((_, i) => i !== index);
    onWfhDatesChange(newDates);
  };

  const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getShiftLabel = (shift: ShiftType): string => {
    const option = shiftTypeOptions.find((opt) => opt.value === shift);
    return option?.label || shift;
  };

  return (
    <div className="space-y-4">
      {/* Add Date Section */}
      <div>
        <label className="block text-sm font-medium text-slate-800 mb-2">
          Thêm ngày làm việc từ xa
        </label>
        <div className="flex gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex-1 min-w-[150px]">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-12 px-4 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={disabled}
            />
          </div>
          <div className="w-full sm:w-48">
            <div className="relative">
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value as ShiftType)}
                className="w-full h-12 px-4 pr-10 border border-slate-300 rounded-lg text-base appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={disabled}
              >
                {shiftTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddDate}
            className="h-12 px-6 bg-blue-600 text-white font-semibold text-base rounded-lg hover:bg-blue-700 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            Thêm ngày
          </button>
        </div>
        {dateError && <p className="mt-2 text-xs text-red-600">{dateError}</p>}
      </div>

      {/* WFH Dates List */}
      {wfhDates.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Danh sách các ngày đã chọn
          </label>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            {wfhDates.map((wfhDate, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 border-b border-slate-200 last:border-b-0 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <svg
                    width="20"
                    height="24"
                    viewBox="0 0 20 24"
                    fill="none"
                    className="text-blue-600"
                  >
                    <rect
                      x="2"
                      y="4"
                      width="16"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="2"
                      y1="9"
                      x2="18"
                      y2="9"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="6"
                      y1="2"
                      x2="6"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="14"
                      y1="2"
                      x2="14"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {formatDisplayDate(wfhDate.date)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {getShiftLabel(wfhDate.shiftType)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDate(index)}
                  className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
                  title="Xóa"
                  disabled={disabled}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between px-2">
            <span className="text-sm font-medium text-slate-700">
              Tổng số ngày WFH:
            </span>
            <span className="text-lg font-bold text-blue-600">
              {totalDays} ngày
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== Main Component ====================
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

  const [wfhDates, setWfhDates] = useState<WfhDate[]>([]);
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

    if (wfhDates.length === 0) {
      newErrors.wfhDates = "Vui lòng thêm ít nhất một ngày WFH";
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

  const getDateRangeTitle = (): string => {
    if (wfhDates.length === 0) return "";
    const sortedDates = [...wfhDates].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const firstDate = sortedDates[0].date;
    const lastDate = sortedDates[sortedDates.length - 1].date;
    if (firstDate === lastDate) return firstDate;
    return `${firstDate} đến ${lastDate}`;
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

      const requestData: CreateWfhRequestDTO = {
        title: `Yêu cầu làm việc từ xa - ${getDateRangeTitle()}`,
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
    setWfhDates([]);
    setWorkLocation("");
    setReason("");
    setCommitment(false);
    setFile(null);
    setErrors({});
    if (isModalMode) {
      onClose?.();
    }
  };

  const showWarning = remainingWfhDays < 3 && remainingWfhDays > 0;

  const formContent = (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Tạo Yêu Cầu Làm Việc Từ Xa
          </h2>
          <p className="mt-1 text-base text-slate-500">
            Số ngày WFH còn lại:{" "}
            <span className="font-semibold text-blue-600">
              {remainingWfhDays} ngày
            </span>
          </p>
        </div>
        {isModalMode && (
          <button
            onClick={handleCancel}
            className="rounded-full p-1 hover:bg-gray-100"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* WFH Dates Editor */}
        <div>
          <WfhDatesEditor
            wfhDates={wfhDates}
            onWfhDatesChange={setWfhDates}
            remainingDays={remainingWfhDays}
            disabled={loading || uploading}
          />
          {errors.wfhDates && (
            <p className="mt-2 text-xs text-red-600">{errors.wfhDates}</p>
          )}
        </div>

        {/* Warning */}
        {showWarning && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-center gap-3">
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
              <path
                d="M10 2L2 20H18L10 2Z"
                stroke="#92400E"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <line
                x1="10"
                y1="8"
                x2="10"
                y2="14"
                stroke="#92400E"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="10" cy="17" r="1" fill="#92400E" />
            </svg>
            <p className="text-sm font-medium text-amber-800">
              Bạn sắp hết ngày WFH.
            </p>
          </div>
        )}

        {/* Work Location */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Địa chỉ làm việc
          </label>
          <input
            type="text"
            placeholder="Nhập địa chỉ làm việc từ xa"
            value={workLocation}
            onChange={(e) => setWorkLocation(e.target.value)}
            className={`w-full h-12 px-4 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.workLocation ? "border-red-500" : "border-slate-300"
              }`}
            disabled={loading || uploading}
          />
          {errors.workLocation && (
            <p className="mt-1 text-xs text-red-600">{errors.workLocation}</p>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Lý do
          </label>
          <textarea
            placeholder="Nhập lý do chi tiết (nếu có)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full px-4 py-4 border border-slate-300 rounded-lg text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || uploading}
          />
        </div>

        {/* File Attachment */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800">
            Đính kèm file (tùy chọn)
          </label>
          <div
            onDragOver={(e) => {
              if (uploading || loading) return;
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              if (!uploading && !loading) handleDrop(e);
            }}
            onClick={() => {
              if (!uploading && !loading) fileInputRef.current?.click();
            }}
            className={`border-2 ${dragOver
                ? "border-blue-400 bg-blue-50"
                : "border-dashed border-gray-300 bg-white"
              } rounded-lg p-6 text-center ${uploading || loading
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer"
              } transition-colors`}
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
                  {(file.size / 1024).toFixed(0)} KB
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700 text-sm"
                disabled={loading}
              >
                Xóa
              </button>
            </div>
          )}
        </div>

        {/* Commitment Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={commitment}
            onChange={(e) => setCommitment(e.target.checked)}
            disabled={loading || uploading}
          />
          <span
            className={`text-sm ${errors.commitment ? "text-red-500" : ""}`}
          >
            Tôi cam kết đảm bảo tiến độ công việc
          </span>
        </div>
        {errors.commitment && (
          <p className="text-xs text-red-600">{errors.commitment}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={uploading || loading}
            className="h-12 px-6 bg-slate-100 text-slate-700 font-bold text-base rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={uploading || loading}
            className="h-12 px-6 bg-blue-600 text-white font-bold text-base rounded-lg hover:bg-blue-700 disabled:opacity-80 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                <span>Đang gửi...</span>
              </>
            ) : (
              "Gửi Yêu Cầu"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (isModalMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {formContent}
        </div>
      </div>
    );
  }

  // Render as page
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-2xl mx-auto">{formContent}</div>
    </div>
  );
};

export default WfhRequestForm;
