import React, { useEffect, useRef, useState } from "react";
import {
  formatDateForInput,
  formatTimeForInput,
} from "shared/utils/date-utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useApi } from "contexts/ApiContext";
import { CreateTimesheetUpdateRequestDTO, AttendanceStatus, TimesheetDailyEntry } from "../types/request.types";
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

  // Target date
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  // Current timesheet data (loaded from API)
  const [currentTimesheet, setCurrentTimesheet] = useState<TimesheetDailyEntry | null>(null);
  const [loadingTimesheet, setLoadingTimesheet] = useState(false);

  // Desired changes - Morning
  const [morningStatus, setMorningStatus] = useState<AttendanceStatus>("PRESENT");
  const [morningWfh, setMorningWfh] = useState<boolean>(false);
  const [desiredCheckInTime, setDesiredCheckInTime] = useState<string>("");

  // Desired changes - Afternoon
  const [afternoonStatus, setAfternoonStatus] = useState<AttendanceStatus>("PRESENT");
  const [afternoonWfh, setAfternoonWfh] = useState<boolean>(false);
  const [desiredCheckOutTime, setDesiredCheckOutTime] = useState<string>("");

  // Common fields
  const [reason, setReason] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadSingleFile, uploading } = useFileUpload();

  // Conditional visibility - show times when ANY shift requires presence
  const morningRequiresPresence = morningStatus === "PRESENT" && !morningWfh;
  const afternoonRequiresPresence = afternoonStatus === "PRESENT" && !afternoonWfh;
  const anyShiftRequiresPresence = morningRequiresPresence || afternoonRequiresPresence;
  const isFullDayLeave = morningStatus === "LEAVE" && afternoonStatus === "LEAVE";

  // Show both time inputs when any shift requires physical presence
  const showTimeInputs = anyShiftRequiresPresence;

  const morningWfhDisabled = morningStatus === "LEAVE";
  const afternoonWfhDisabled = afternoonStatus === "LEAVE";

  // Reset WFH when switching to LEAVE (but don't auto-clear times)
  useEffect(() => {
    if (morningStatus === "LEAVE") {
      setMorningWfh(false);
    }
  }, [morningStatus]);

  useEffect(() => {
    if (afternoonStatus === "LEAVE") {
      setAfternoonWfh(false);
    }
  }, [afternoonStatus]);

  // Clear both times when both shifts are LEAVE
  useEffect(() => {
    if (isFullDayLeave) {
      setDesiredCheckInTime("");
      setDesiredCheckOutTime("");
    }
  }, [isFullDayLeave]);

  // Load timesheet when date changes
  useEffect(() => {
    if (!targetDate) {
      setCurrentTimesheet(null);
      return;
    }

    const loadTimesheet = async () => {
      setLoadingTimesheet(true);
      try {
        const response = await timesheetApi.getTimesheetByEmployeeIdAndDate(
          user?.userId || "",
          targetDate.toISOString().split("T")[0]
        );

        if (!response.data) {
          toast.error("Bảng chấm công chưa tồn tại cho ngày đã chọn");
          setCurrentTimesheet(null);
          return;
        }

        if (response.data.isFinalized) {
          toast.warning("Bảng chấm công ngày này đã được chốt, không thể sửa đổi");
        }

        setCurrentTimesheet(response.data);

        // Pre-fill with current values
        setMorningStatus((response.data.morningStatus as AttendanceStatus) || "PRESENT");
        setAfternoonStatus((response.data.afternoonStatus as AttendanceStatus) || "PRESENT");
        setMorningWfh(response.data.morningWfh || false);
        setAfternoonWfh(response.data.afternoonWfh || false);

        if (response.data.checkInTime) {
          setDesiredCheckInTime(formatTimeForInput(new Date(response.data.checkInTime)));
        }
        if (response.data.checkOutTime) {
          setDesiredCheckOutTime(formatTimeForInput(new Date(response.data.checkOutTime)));
        }
      } catch (error: any) {
        toast.error(error.message || "Không thể tải bảng chấm công");
        setCurrentTimesheet(null);
      } finally {
        setLoadingTimesheet(false);
      }
    };

    loadTimesheet();
  }, [targetDate, user?.userId, timesheetApi]);

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
    setTargetDate(null);
    setCurrentTimesheet(null);
    setMorningStatus("PRESENT");
    setAfternoonStatus("PRESENT");
    setMorningWfh(false);
    setAfternoonWfh(false);
    setDesiredCheckInTime("");
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

    if (!currentTimesheet) {
      newErrors.date = "Không tìm thấy bảng chấm công cho ngày này";
    }

    if (currentTimesheet?.isFinalized) {
      newErrors.date = "Bảng chấm công đã được chốt, không thể sửa đổi";
    }

    // Check-in and Check-out required if ANY shift is PRESENT and not WFH
    if (showTimeInputs) {
      if (!desiredCheckInTime) {
        newErrors.checkIn = "Giờ vào là bắt buộc";
      }
      if (!desiredCheckOutTime) {
        newErrors.checkOut = "Giờ ra là bắt buộc";
      }
    }

    // No times allowed for full-day leave
    if (isFullDayLeave) {
      if (desiredCheckInTime || desiredCheckOutTime) {
        newErrors.times = "Không được nhập giờ khi nghỉ cả ngày";
      }
    }

    // Check-out must be after check-in
    if (desiredCheckInTime && desiredCheckOutTime) {
      if (desiredCheckOutTime <= desiredCheckInTime) {
        newErrors.checkOut = "Giờ ra phải sau giờ vào";
      }
    }

    if (!reason.trim()) {
      newErrors.reason = "Vui lòng nhập lý do";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateForm()) return;

    let attachmentUrl: string | undefined;
    if (file) {
      attachmentUrl = await uploadSingleFile(file, {
        errorMessage: "Không thể tải lên tệp đính kèm.",
      });
    }

    setSubmitting(true);
    try {
      const dateStr = targetDate?.toISOString().split("T")[0];

      const requestData: CreateTimesheetUpdateRequestDTO = {
        title: `Yêu cầu cập nhật chấm công - ${dateStr}`,
        userReason: reason,
        employeeId: user?.userId || "",
        targetDate: dateStr || "",
        // Time fields - only include if any shift requires presence
        desiredCheckInTime: showTimeInputs && desiredCheckInTime
          ? `${dateStr}T${desiredCheckInTime}:00`
          : undefined,
        desiredCheckOutTime: showTimeInputs && desiredCheckOutTime
          ? `${dateStr}T${desiredCheckOutTime}:00`
          : undefined,
        currentCheckInTime: currentTimesheet?.checkInTime || undefined,
        currentCheckOutTime: currentTimesheet?.checkOutTime || undefined,
        // Extended v2 fields
        desiredMorningStatus: morningStatus,
        desiredAfternoonStatus: afternoonStatus,
        desiredMorningWfh: morningWfh || undefined,
        desiredAfternoonWfh: afternoonWfh || undefined,
        attachmentUrl,
      };

      await requestApi.createTimesheetUpdateRequest(requestData);

      toast.success("Gửi yêu cầu thành công!");
      onSubmit?.();
      handleCancel();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi tạo yêu cầu";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusLabel = (status: string | undefined) => {
    switch (status) {
      case "PRESENT": return "Có mặt";
      case "LEAVE": return "Nghỉ phép";
      default: return status || "—";
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

      {/* Date Selection */}
      <div className="mb-4 mt-6">
        <label className="text-sm text-gray-600 block mb-2">Ngày cần sửa</label>
        <input
          type="date"
          className={`w-full border rounded px-3 py-2 ${errors.date ? "border-red-500" : ""}`}
          value={targetDate ? formatDateForInput(targetDate) : ""}
          onChange={(e) => setTargetDate(e.target.value ? new Date(e.target.value) : null)}
        />
        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
      </div>

      {/* Loading indicator */}
      {loadingTimesheet && (
        <div className="mb-4 p-4 bg-gray-50 rounded border text-center text-gray-500">
          Đang tải bảng chấm công...
        </div>
      )}

      {/* Current Timesheet Info */}
      {currentTimesheet && !loadingTimesheet && (
        <>
          <div className="mb-4 p-4 bg-gray-50 rounded border">
            <label className="text-sm text-gray-600 block mb-2 font-medium">
              Trạng thái hiện tại
            </label>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Sáng:</span>{" "}
                <span className="font-medium">{getStatusLabel(currentTimesheet.morningStatus)}</span>
                {currentTimesheet.morningWfh && <span className="ml-1 text-blue-600">(WFH)</span>}
              </div>
              <div>
                <span className="text-gray-500">Chiều:</span>{" "}
                <span className="font-medium">{getStatusLabel(currentTimesheet.afternoonStatus)}</span>
                {currentTimesheet.afternoonWfh && <span className="ml-1 text-blue-600">(WFH)</span>}
              </div>
              <div>
                <span className="text-gray-500">Giờ vào:</span>{" "}
                <span className="font-medium">
                  {currentTimesheet.checkInTime
                    ? formatTimeForInput(new Date(currentTimesheet.checkInTime))
                    : "—"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Giờ ra:</span>{" "}
                <span className="font-medium">
                  {currentTimesheet.checkOutTime
                    ? formatTimeForInput(new Date(currentTimesheet.checkOutTime))
                    : "—"}
                </span>
              </div>
            </div>
            {currentTimesheet.isFinalized && (
              <div className="mt-2 text-xs text-orange-600 font-medium">
                ⚠️ Bảng chấm công đã được chốt
              </div>
            )}
          </div>

          {/* Desired Changes */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-3 font-medium">
              Thay đổi mong muốn
            </label>

            {/* Morning Section */}
            <div className="p-4 border rounded mb-3 bg-blue-50/30">
              <div className="font-medium text-sm mb-3 text-blue-800">Buổi sáng</div>

              {/* Status Radio */}
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="morningStatus"
                    checked={morningStatus === "PRESENT"}
                    onChange={() => setMorningStatus("PRESENT")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Có mặt</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="morningStatus"
                    checked={morningStatus === "LEAVE"}
                    onChange={() => setMorningStatus("LEAVE")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Nghỉ phép</span>
                </label>
              </div>

              {/* WFH Checkbox */}
              <label className={`flex items-center gap-2 mb-3 ${morningWfhDisabled ? "opacity-50" : "cursor-pointer"}`}>
                <input
                  type="checkbox"
                  checked={morningWfh}
                  onChange={(e) => setMorningWfh(e.target.checked)}
                  disabled={morningWfhDisabled}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm">Làm việc từ xa (WFH)</span>
              </label>


            </div>

            {/* Afternoon Section */}
            <div className="p-4 border rounded bg-orange-50/30">
              <div className="font-medium text-sm mb-3 text-orange-800">Buổi chiều</div>

              {/* Status Radio */}
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="afternoonStatus"
                    checked={afternoonStatus === "PRESENT"}
                    onChange={() => setAfternoonStatus("PRESENT")}
                    className="w-4 h-4 text-orange-600"
                  />
                  <span className="text-sm">Có mặt</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="afternoonStatus"
                    checked={afternoonStatus === "LEAVE"}
                    onChange={() => setAfternoonStatus("LEAVE")}
                    className="w-4 h-4 text-orange-600"
                  />
                  <span className="text-sm">Nghỉ phép</span>
                </label>
              </div>

              {/* WFH Checkbox */}
              <label className={`flex items-center gap-2 mb-3 ${afternoonWfhDisabled ? "opacity-50" : "cursor-pointer"}`}>
                <input
                  type="checkbox"
                  checked={afternoonWfh}
                  onChange={(e) => setAfternoonWfh(e.target.checked)}
                  disabled={afternoonWfhDisabled}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <span className="text-sm">Làm việc từ xa (WFH)</span>
              </label>


            </div>

            {/* Time Settings Section - visible if any presence required */}
            {showTimeInputs && (
              <div className="p-4 border rounded mb-3 bg-gray-50">
                <div className="font-medium text-sm mb-3 text-gray-800">Thời gian làm việc</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Giờ vào</label>
                    <input
                      type="time"
                      className={`w-full border rounded px-3 py-2 ${errors.checkIn ? "border-red-500" : ""}`}
                      value={desiredCheckInTime}
                      onChange={(e) => setDesiredCheckInTime(e.target.value)}
                    />
                    {errors.checkIn && <p className="mt-1 text-xs text-red-500">{errors.checkIn}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Giờ ra</label>
                    <input
                      type="time"
                      className={`w-full border rounded px-3 py-2 ${errors.checkOut ? "border-red-500" : ""}`}
                      value={desiredCheckOutTime}
                      onChange={(e) => setDesiredCheckOutTime(e.target.value)}
                    />
                    {errors.checkOut && <p className="mt-1 text-xs text-red-500">{errors.checkOut}</p>}
                  </div>
                </div>
              </div>
            )}

            {errors.times && <p className="mt-2 text-xs text-red-500">{errors.times}</p>}
          </div>
        </>
      )}

      {/* Reason */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 block mb-2">
          Lý do / Ghi chú
        </label>
        <textarea
          className={`w-full border rounded p-3 min-h-[90px] resize-none ${errors.reason ? "border-red-500" : ""}`}
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Mô tả chi tiết lý do cần thay đổi..."
        />
        {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason}</p>}
      </div>

      {/* File Upload */}
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

      {/* Action Buttons */}
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
          disabled={uploading || submitting || !currentTimesheet || currentTimesheet.isFinalized}
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
