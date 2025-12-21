import React, { useState } from "react";
import { AlertCircle, X, Paperclip } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "contexts/AuthContext";
import { CreateTimesheetUpdateRequestDTO } from "../types/request.types";
import { useApi } from "contexts/ApiContext";

interface UpdateTimesheetModalProps {
    open: boolean;
    onClose?: () => void;
    onSubmit?: () => void;
}

interface FormData {
  date: string;
  checkInTime: string;
  checkOutTime: string;
  reason: string;
  file: File | null;
}

const UpdateTimesheetModal = ({ open, onClose, onSubmit }: UpdateTimesheetModalProps) => {
  const [workDate, setWorkDate] = useState<Date | null>(null);
  const [checkInTime, setCheckInTime] = useState("08:15");
  const [checkOutTime, setCheckOutTime] = useState("17:15");
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { requestApi } = useApi();

  if (!open) return null;

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!workDate) {
      newErrors.workDate = 'Vui lòng chọn ngày';
    } else {
      const selectedDate = new Date(workDate);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.workDate = 'Ngày không được trong quá khứ';
      }
    }

    if (!checkInTime) {
      newErrors.checkInTime = "Vui lòng nhập giờ check-in";
    }

    if (!checkOutTime) {
      newErrors.checkOutTime = "Vui lòng nhập giờ check-out";
    } else if (checkInTime && checkOutTime <= checkInTime) {
      newErrors.checkOutTime = "Giờ check-out phải sau giờ check-in";
    }
    
    if (!reason.trim()) {
      newErrors.reason = 'Vui lòng nhập lý do';
    } else if (reason.length < 10) {
      newErrors.reason = 'Lý do phải có ít nhất 10 ký tự';
    } else if (reason.length > 500) {
      newErrors.reason = 'Lý do không được vượt quá 500 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWorkDate(value ? new Date(value) : null);
    if (errors.workDate) {
      setErrors((prev) => ({ ...prev, workDate: '' }));
    }
  };

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckInTime(e.target.value);
    if (errors.checkInTime) {
      setErrors((prev) => ({ ...prev, checkInTime: '' }));
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckOutTime(e.target.value);
    if (errors.checkOutTime) {
      setErrors((prev) => ({ ...prev, checkOutTime: '' }));
    }
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
    if (errors.reason) {
      setErrors((prev) => ({ ...prev, reason: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Call mock API
      const timeSheetData:CreateTimesheetUpdateRequestDTO = {
        title: `Yêu cầu cập nhật timesheet - ${workDate?.toISOString().split('T')[0]} ${checkInTime}-${checkOutTime}`,
        userReason: reason,
        employeeId: user?.userId|| '', 
        targetDate: workDate ? workDate.toISOString().split('T')[0] : '',
        desiredCheckInTime: `${workDate?.toISOString().split('T')[0]}T${checkInTime}:00`,
        desiredCheckOutTime: `${workDate?.toISOString().split('T')[0]}T${checkOutTime}:00`,
      }
      const response = await requestApi.createTimesheetUpdateRequest(timeSheetData);
      if (response.success) {
        toast.success('Gửi yêu cầu thành công!');
        onSubmit?.();
      } else {
        toast.error('Có lỗi xảy ra');
      }

      setWorkDate(null);
      setCheckInTime("08:15");
      setCheckOutTime("17:15");
      setReason('');
      setFile(null);
      setErrors({});
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setWorkDate(null);
    setCheckInTime("08:15");
    setCheckOutTime("17:15");
    setReason('');
    setFile(null);
    setErrors({});
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Tạo yêu cầu cập nhật timesheet
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

        {/* Form */}
        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Ngày cần cập nhật <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={workDate ? workDate.toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 ${
                errors.workDate
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-black"
              }`}
              disabled={loading}
            />
            {errors.workDate && (
              <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.workDate}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Giờ check-in <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="checkInTime"
                value={checkInTime}
                onChange={handleCheckInChange}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 ${
                  errors.checkInTime
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-black"
                }`}
                disabled={loading}
              />
              {errors.checkInTime && (
                <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.checkInTime}</span>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Giờ check-out <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="checkOutTime"
                value={checkOutTime}
                onChange={handleCheckOutChange}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 ${
                  errors.checkOutTime
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-black"
                }`}
                disabled={loading}
              />
              {errors.checkOutTime && (
                <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.checkOutTime}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Lý do cập nhật <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              name="reason"
              value={reason}
              onChange={handleReasonChange}
              placeholder="Vui lòng nhập lý do cập nhật (tối thiểu 10 ký tự)"
              className={`w-full resize-none rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 ${
                errors.reason
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-black"
              }`}
              disabled={loading}
            />
            <div className="mt-1 flex items-center justify-between">
              <div>
                {errors.reason && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.reason}</span>
                  </div>
                )}
              </div>
              <span
                className={`text-xs ${
                  reason.length > 500
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {reason.length}/500
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Đính kèm file
            </label>

            <label className="inline-flex cursor-pointer items-center gap-2
                              rounded-lg border px-4 py-2 text-sm
                              hover:bg-gray-50">
              <Paperclip className="h-4 w-4" />
              <span>{file ? file.name : "Tải tệp lên"}</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="rounded-lg border px-5 py-2 text-sm hover:bg-gray-50"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={(e) => handleSubmit(e)}
            className="rounded-lg bg-black px-5 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateTimesheetModal;
