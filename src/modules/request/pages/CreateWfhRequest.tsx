
import React, { useState } from "react";
import { useApi } from "contexts/ApiContext";
import { useFileUpload } from "shared/hooks/useFileUpload";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CreateWfhRequestDTO, ShiftType, shiftTypeOptions, WfhDate } from "../types/request.types";

interface WfhDateEditorProps {
  wfhDates: WfhDate[];
  onWfhDatesChange: (dates: WfhDate[]) => void;
  remainingDays: number;
}

const WfhDatesEditor: React.FC<WfhDateEditorProps> = ({ wfhDates, onWfhDatesChange, remainingDays }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<ShiftType>(ShiftType.FULL_DAY);
  const [dateError, setDateError] = useState<string>("");

  const calculateTotalDays = (dates: WfhDate[]): number => {
    return dates.reduce((sum, date) => sum + (date.shiftType === ShiftType.FULL_DAY ? 1 : 0.5), 0);
  };
  const totalDays = calculateTotalDays(wfhDates);

  const handleAddDate = () => {
    setDateError("");
    if (!selectedDate) {
      setDateError("Vui lòng chọn ngày");
      return;
    }
    if (wfhDates.some(item => item.date === selectedDate)) {
      setDateError("Ngày này đã được chọn");
      return;
    }
    const daysToAdd = selectedShift === ShiftType.FULL_DAY ? 1 : 0.5;
    if (totalDays + daysToAdd > remainingDays) {
      setDateError("Số ngày WFH sẽ vượt quá số ngày còn lại");
      return;
    }
    onWfhDatesChange([...wfhDates, { date: selectedDate, shiftType: selectedShift }]);
    setSelectedDate("");
    setSelectedShift(ShiftType.FULL_DAY);
  };

  const handleRemoveDate = (index: number) => {
    onWfhDatesChange(wfhDates.filter((_, i) => i !== index));
  };

  const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  const getShiftLabel = (shift: ShiftType): string => {
    const option = shiftTypeOptions.find(opt => opt.value === shift);
    return option?.label || shift;
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-800 mb-2">Thêm ngày WFH</label>
        <div className="flex gap-3">
          <div className="flex-1">
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full h-12 px-4 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="w-48">
            <div className="relative">
              <select value={selectedShift} onChange={e => setSelectedShift(e.target.value as ShiftType)} className="w-full h-12 px-4 pr-10 border border-slate-300 rounded-lg text-base appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {shiftTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="button" onClick={handleAddDate} className="h-12 px-6 bg-blue-600 text-white font-semibold text-base rounded-lg hover:bg-blue-700 whitespace-nowrap">Thêm ngày</button>
        </div>
        {dateError && <p className="mt-2 text-xs text-red-600">{dateError}</p>}
      </div>
      {wfhDates.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">Danh sách các ngày đã chọn</label>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            {wfhDates.map((wfhDate, index) => (
              <div key={index} className="flex items-center justify-between px-4 py-3 border-b border-slate-200 last:border-b-0 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{formatDisplayDate(wfhDate.date)}</p>
                    <p className="text-xs text-slate-500">{getShiftLabel(wfhDate.shiftType)}</p>
                  </div>
                </div>
                <button type="button" onClick={() => handleRemoveDate(index)} className="text-red-600 hover:text-red-700 p-1" title="Xóa">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between px-2">
            <span className="text-sm font-medium text-slate-700">Tổng số ngày WFH:</span>
            <span className="text-lg font-bold text-blue-600">{totalDays} ngày</span>
          </div>
        </div>
      )}
    </div>
  );
};

const WfhRequestForm: React.FC = () => {
  const { requestApi } = useApi();
  const { uploadSingleFile, uploading } = useFileUpload();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [workLocation, setWorkLocation] = useState("");
  const [reason, setReason] = useState("");
  const [commitment, setCommitment] = useState(false);
  const [wfhDates, setWfhDates] = useState<WfhDate[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);

  const remainingWfhDays = user?.remainingWfhDays || 10;

  const calculateTotalDays = (dates: WfhDate[]): number => {
    return dates.reduce((sum, date) => sum + (date.shiftType === ShiftType.FULL_DAY ? 1 : 0.5), 0);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!workLocation.trim()) newErrors.workLocation = "Vui lòng nhập địa chỉ làm việc";
    if (!commitment) newErrors.commitment = "Vui lòng xác nhận cam kết";
    if (wfhDates.length === 0) newErrors.wfhDates = "Vui lòng thêm ít nhất một ngày WFH";
    if (calculateTotalDays(wfhDates) > remainingWfhDays) newErrors.wfhDates = "Tổng số ngày WFH vượt quá số ngày còn lại";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("remainingWfhDays", remainingWfhDays);
      let attachmentUrl: string | undefined;
      if (file) {
        attachmentUrl = await uploadSingleFile(file, {
          errorMessage: 'Không thể tải lên tệp đính kèm.',
        });
      }
      const requestData: CreateWfhRequestDTO = {
        title: `Yêu cầu làm việc từ xa`,
        employeeId: user?.userId || '',
        userReason: reason || 'Không có lý do',
        wfhCommitment: commitment,
        workLocation,
        wfhDates,
        attachmentUrl,
      };
      await requestApi.createWfhRequest(requestData);
      toast.success('Tạo yêu cầu WFH thành công!');
      navigate('/requests/my-requests');
    } catch (error: any) {
      console.log("error", error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi tạo yêu cầu WFH';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setWorkLocation("");
    setReason("");
    setCommitment(false);
    setWfhDates([]);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Tạo yêu cầu làm việc từ xa</h2>
        <div className="space-y-6 bg-white rounded-xl shadow-lg p-6">
          <WfhDatesEditor wfhDates={wfhDates} onWfhDatesChange={setWfhDates} remainingDays={remainingWfhDays} />
          <div>
            <label className="mb-1 block text-sm font-semibold">Địa chỉ làm việc</label>
            <input type="text" placeholder="Nhập địa chỉ" value={workLocation} onChange={e => setWorkLocation(e.target.value)} className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black ${errors.workLocation ? "border-red-500" : ""}`} disabled={isSubmitting} />
            {errors.workLocation && <p className="mt-1 text-xs text-red-500">{errors.workLocation}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Lý do</label>
            <textarea rows={3} placeholder="Nhập lý do" value={reason} onChange={e => setReason(e.target.value)} className="w-full resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" disabled={isSubmitting} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Tệp đính kèm</label>
            <input
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
              disabled={isSubmitting || uploading}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="flex items-end">
            <p className="text-sm font-semibold">Số ngày WFH còn lại: <span className="font-bold">{remainingWfhDays}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" checked={commitment} onChange={e => setCommitment(e.target.checked)} disabled={isSubmitting} />
            <span className={`text-sm ${errors.commitment ? "text-red-500" : ""}`}>Tôi cam kết đảm bảo tiến độ công việc</span>
          </div>
          {errors.commitment && <p className="text-xs text-red-500">{errors.commitment}</p>}
          {errors.wfhDates && <p className="text-xs text-red-500">{errors.wfhDates}</p>}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button onClick={handleCancel} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50" disabled={isSubmitting}>Hủy</button>
            <button onClick={handleSubmit} className="rounded-lg bg-black px-6 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2" disabled={uploading || isSubmitting}>
              {uploading ? "Đang tải lên file..." : isSubmitting ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WfhRequestForm;
