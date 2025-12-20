import React, { useState } from "react";
import { AlertCircle, X, Paperclip } from "lucide-react";

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

interface FormErrors {
  date?: string;
  checkInTime?: string;
  checkOutTime?: string;
  reason?: string;
}

const UpdateTimesheetModal = ({ open, onClose, onSubmit }: UpdateTimesheetModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    date: "",
    checkInTime: "08:15",
    checkOutTime: "17:15",
    reason: "",
    file: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate date
    if (!formData.date) {
      newErrors.date = "Vui lòng chọn ngày cần cập nhật";
    } else {
      const selectedDate = new Date(formData.date);
      if (selectedDate > today) {
        newErrors.date = "Không thể cập nhật cho ngày trong tương lai";
      }
    }

    if (!formData.checkInTime) {
      newErrors.checkInTime = "Vui lòng nhập giờ check-in";
    }

    if (!formData.checkOutTime) {
      newErrors.checkOutTime = "Vui lòng nhập giờ check-out";
    } else if (formData.checkInTime && formData.checkOutTime <= formData.checkInTime) {
      newErrors.checkOutTime = "Giờ check-out phải sau giờ check-in";
    }

    // Validate reason
    if (!formData.reason.trim()) {
      newErrors.reason = "Vui lòng nhập lý do cập nhật";
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = "Lý do phải có ít nhất 10 ký tự";
    } else if (formData.reason.trim().length > 500) {
      newErrors.reason = "Lý do không được vượt quá 500 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit?.();
      
      // Reset form
      setFormData({
        date: "",
        checkInTime: "08:15",
        checkOutTime: "17:15",
        reason: "",
        file: null,
      });
      setErrors({});
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      date: "",
      checkInTime: "08:15",
      checkOutTime: "17:15",
      reason: "",
      file: null,
    });
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
            disabled={isSubmitting}
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
              value={formData.date}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 ${
                errors.date
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-black"
              }`}
              disabled={isSubmitting}
            />
            {errors.date && (
              <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.date}</span>
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
                value={formData.checkInTime}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 ${
                  errors.checkInTime
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-black"
                }`}
                disabled={isSubmitting}
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
                value={formData.checkOutTime}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 ${
                  errors.checkOutTime
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-black"
                }`}
                disabled={isSubmitting}
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
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Vui lòng nhập lý do cập nhật (tối thiểu 10 ký tự)"
              className={`w-full resize-none rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 ${
                errors.reason
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-black"
              }`}
              disabled={isSubmitting}
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
                  formData.reason.length > 500
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {formData.reason.length}/500
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
              <span>{formData.file ? formData.file.name : "Tải tệp lên"}</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="rounded-lg border px-5 py-2 text-sm hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-black px-5 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateTimesheetModal;
