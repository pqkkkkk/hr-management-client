import React, { useState } from "react";
import { X, Paperclip, ChevronDown } from "lucide-react";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CreateWfhRequestDTO, ShiftType, WfhDate, shiftTypeOptions } from "../types/request.types";

interface WfhModalProps {
  isModalMode?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const WfhRequestForm: React.FC<WfhModalProps> = ({ isModalMode = true, open, onClose }) => {
  const { requestApi, fileApi } = useApi();
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

  const generateWfhDates = (): WfhDate[] => {
    const dates: WfhDate[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      // Skip weekends
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push({
          date: d.toISOString().split('T')[0],
          shift: shift,
        });
      }
    }
    return dates;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // Upload attachment file if exists
      let attachmentUrl: string | undefined = undefined;
      if (file) {
        try {
          const uploadResponse = await fileApi.uploadFile(file);
          if (uploadResponse.success && uploadResponse.data) {
            attachmentUrl = uploadResponse.data;
          }
        } catch (uploadError) {
          console.error("Failed to upload file:", uploadError);
          toast.warning("Không thể tải lên tệp đính kèm.");
        }
      }

      const wfhDates = generateWfhDates();

      const requestData: CreateWfhRequestDTO = {
        title: `Yêu cầu làm việc từ xa - ${startDate} đến ${endDate}`,
        userReason: reason || undefined,
        wfhCommitment: commitment,
        workLocation,
        wfhDates,
      };

      const response = await requestApi.createWfhRequest(requestData);

      if (response.success) {
        toast.success("Gửi yêu cầu WFH thành công!");
        if (isModalMode) {
          onClose?.();
        }
        navigate("/requests/my-requests");
      } else {
        throw new Error(response.message || "Có lỗi xảy ra khi tạo yêu cầu");
      }
    } catch (error: any) {
      console.error("Failed to create WFH request:", error);
      // Check if it's a "not implemented" error from REST API
      if (error?.message?.includes("not implemented") || error?.response?.status === 501) {
        toast.error("Chức năng tạo yêu cầu WFH chưa được hỗ trợ trên hệ thống.");
      } else {
        toast.error(error?.message || "Có lỗi xảy ra khi tạo yêu cầu WFH");
      }
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
          <label className="mb-1 block text-sm font-semibold">Ngày bắt đầu</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black ${errors.startDate ? "border-red-500" : ""}`}
            disabled={loading}
          />
          {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Ngày kết thúc</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black ${errors.endDate ? "border-red-500" : ""}`}
            disabled={loading}
          />
          {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Ca làm việc</label>
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
          <label className="mb-1 block text-sm font-semibold">Địa chỉ làm việc</label>
          <input
            type="text"
            placeholder="Nhập địa chỉ"
            value={workLocation}
            onChange={(e) => setWorkLocation(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black ${errors.workLocation ? "border-red-500" : ""}`}
            disabled={loading}
          />
          {errors.workLocation && <p className="mt-1 text-xs text-red-500">{errors.workLocation}</p>}
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

        <div>
          <label className="mb-1 block text-sm font-semibold">Đính kèm file</label>
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
            <span>{file ? file.name : "Tải tệp lên"}</span>
            <Paperclip className="h-4 w-4" />
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
          </label>
          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="mt-1 text-xs text-red-500 hover:underline"
            >
              Xóa tệp
            </button>
          )}
        </div>

        <div className="flex items-end">
          <p className="text-sm font-semibold">
            Số ngày WFH còn lại trong tuần: <span className="font-bold">2</span>
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
          <span className={`text-sm ${errors.commitment ? "text-red-500" : ""}`}>
            Tôi cam kết đảm bảo tiến độ công việc
          </span>
        </div>
        {errors.commitment && <p className="text-xs text-red-500 sm:col-span-2">{errors.commitment}</p>}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          onClick={handleCancel}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          disabled={loading}
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-black px-6 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
