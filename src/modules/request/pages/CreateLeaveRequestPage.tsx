import React, { useState, useEffect } from "react";
import {
  LeaveType,
  leaveTypeOptions,
  ShiftType,
  shiftTypeOptions,
  LeaveDate,
  CreateLeaveRequestDTO,
} from "../types/request.types";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFileUpload } from "shared/hooks/useFileUpload";

// ==================== LeaveDatesEditor Component ====================
interface LeaveDatesEditorProps {
  leaveDates: LeaveDate[];
  onLeaveDatesChange: (dates: LeaveDate[]) => void;
  remainingDays: number;
}

const LeaveDatesEditor: React.FC<LeaveDatesEditorProps> = ({
  leaveDates,
  onLeaveDatesChange,
  remainingDays,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<ShiftType>(
    ShiftType.FULL_DAY
  );
  const [dateError, setDateError] = useState<string>("");

  const calculateTotalDays = (dates: LeaveDate[]): number => {
    return dates.reduce((sum, date) => {
      return sum + (date.shiftType === ShiftType.FULL_DAY ? 1 : 0.5);
    }, 0);
  };

  const totalDays = calculateTotalDays(leaveDates);

  const handleAddDate = () => {
    setDateError("");

    if (!selectedDate) {
      setDateError("Vui lòng chọn ngày");
      return;
    }

    // Check if date already exists
    const isDuplicate = leaveDates.some((item) => item.date === selectedDate);
    if (isDuplicate) {
      setDateError("Ngày này đã được chọn");
      return;
    }

    // Check if adding this date would exceed remaining days
    const daysToAdd = selectedShift === ShiftType.FULL_DAY ? 1 : 0.5;
    if (totalDays + daysToAdd > remainingDays) {
      setDateError("Số ngày nghỉ sẽ vượt quá số ngày phép còn lại");
      return;
    }

    const newLeaveDate: LeaveDate = {
      date: selectedDate,
      shiftType: selectedShift,
    };

    onLeaveDatesChange([...leaveDates, newLeaveDate]);
    setSelectedDate("");
    setSelectedShift(ShiftType.FULL_DAY);
  };

  const handleRemoveDate = (index: number) => {
    const newDates = leaveDates.filter((_, i) => i !== index);
    onLeaveDatesChange(newDates);
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
          Thêm ngày nghỉ
        </label>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-12 px-4 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-48">
            <div className="relative">
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value as ShiftType)}
                className="w-full h-12 px-4 pr-10 border border-slate-300 rounded-lg text-base appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
            className="h-12 px-6 bg-blue-600 text-white font-semibold text-base rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            Thêm ngày
          </button>
        </div>
        {dateError && <p className="mt-2 text-xs text-red-600">{dateError}</p>}
      </div>

      {/* Leave Dates List */}
      {leaveDates.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Danh sách các ngày đã chọn
          </label>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            {leaveDates.map((leaveDate, index) => (
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
                      {formatDisplayDate(leaveDate.date)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {getShiftLabel(leaveDate.shiftType)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDate(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Xóa"
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
              Tổng số ngày nghỉ:
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
interface LeaveRequestFormData {
  leaveType: LeaveType | "";
  reason: string;
}

interface FormErrors {
  leaveType?: string;
  leaveDates?: string;
}

const CreateLeaveRequestPage: React.FC = () => {
  const { requestApi } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LeaveRequestFormData>({
    leaveType: "",
    reason: "",
  });

  const [leaveDates, setLeaveDates] = useState<LeaveDate[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const remainingDays = user?.remainingAnnualLeaveDays || 12;
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { uploadSingleFile, uploading } = useFileUpload();

  const onFileSelect = (fList: FileList | null) => {
    if (!fList || fList.length === 0) return;
    const selectedFile = fList[0];
    if (selectedFile.size <= 5 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      toast.warning("File quá lớn. Tối đa 5MB");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    onFileSelect(e.dataTransfer.files);
  };

  const removeFile = () => {
    setFile(null);
  };

  const calculateTotalDays = (dates: LeaveDate[]): number => {
    return dates.reduce((sum, date) => {
      return sum + (date.shiftType === ShiftType.FULL_DAY ? 1 : 0.5);
    }, 0);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.leaveType) {
      newErrors.leaveType = "Vui lòng chọn loại nghỉ phép";
    }

    if (leaveDates.length === 0) {
      newErrors.leaveDates = "Vui lòng thêm ít nhất một ngày nghỉ";
    }

    const totalDays = calculateTotalDays(leaveDates);
    if (totalDays > remainingDays) {
      newErrors.leaveDates = "Tổng số ngày nghỉ vượt quá số ngày phép còn lại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      const errorMessage = Object.values(errors).join("\n");
      toast.error(errorMessage);
      return;
    }

    if (!formData.reason.trim()) {
      setErrors({ ...errors, leaveDates: "Vui lòng nhập lý do nghỉ phép" });
      return;
    }

    try {
      let attachmentUrl: string | undefined;
      if (file) {
        attachmentUrl = await uploadSingleFile(file, {
          errorMessage: "Không thể tải lên tệp đính kèm.",
        });
      }

      setIsSubmitting(true);

      const requestData: CreateLeaveRequestDTO = {
        title: `Nghỉ ${
          leaveTypeOptions.find((opt) => opt.value === formData.leaveType)
            ?.label || "phép"
        }`,
        userReason: formData.reason,
        employeeId: user?.userId || "",
        leaveType: formData.leaveType as LeaveType,
        leaveDates: leaveDates.map((date) => ({
          date: date.date,
          shiftType: date.shiftType,
        })),
        attachmentUrl,
      };

      await requestApi.createLeaveRequest(requestData);

      toast.success("Tạo yêu cầu nghỉ phép thành công!");
      navigate("/requests/my-requests");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi tạo yêu cầu nghỉ phép";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      leaveType: "",
      reason: "",
    });
    setLeaveDates([]);
    setErrors({});
  };

  const showWarning = remainingDays < 3 && remainingDays > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
            Tạo Yêu Cầu Nghỉ Phép
          </h1>
          <p className="text-base text-slate-500">
            Số ngày phép năm còn lại:{" "}
            <span className="font-semibold text-blue-600">
              {remainingDays} ngày
            </span>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="space-y-6">
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Loại nghỉ phép
              </label>
              <div className="relative">
                <select
                  value={formData.leaveType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      leaveType: e.target.value as LeaveType,
                    })
                  }
                  className="w-full h-12 px-4 pr-10 border border-slate-300 rounded-lg text-base appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Chọn loại nghỉ phép</option>
                  {leaveTypeOptions.map((option) => (
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
              {errors.leaveType && (
                <p className="mt-1 text-xs text-red-600">{errors.leaveType}</p>
              )}
            </div>

            {/* Leave Dates Editor */}
            <div>
              <LeaveDatesEditor
                leaveDates={leaveDates}
                onLeaveDatesChange={setLeaveDates}
                remainingDays={remainingDays}
              />
              {errors.leaveDates && (
                <p className="mt-2 text-xs text-red-600">{errors.leaveDates}</p>
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
                  Bạn sắp hết ngày phép năm.
                </p>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Lý do nghỉ phép
              </label>
              <textarea
                placeholder="Nhập lý do chi tiết (nếu có)"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-4 border border-slate-300 rounded-lg text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Đính kèm file (tùy chọn)
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 ${
                  dragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-dashed border-gray-300 bg-white"
                } rounded p-6 text-center cursor-pointer transition-colors`}
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
                    <div className="text-xs text-gray-400">
                      PNG, JPG, PDF (Tối đa 5MB)
                    </div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => onFileSelect(e.target.files)}
                  className="hidden"
                  disabled={uploading || isSubmitting}
                  accept=".png,.jpg,.jpeg,.pdf"
                />
              </div>
              {/* File đã đính kèm */}
              {file && !uploading && (
                <div className="mt-3 flex items-center justify-between bg-gray-50 border rounded px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 text-sm"
                    disabled={isSubmitting}
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={uploading || isSubmitting}
                className="h-12 px-6 bg-slate-100 text-slate-700 font-bold text-base rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploading || isSubmitting}
                className="h-12 px-6 bg-blue-600 text-white font-bold text-base rounded-lg hover:bg-blue-700 disabled:opacity-80 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
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
      </div>
    </div>
  );
};

export default CreateLeaveRequestPage;
