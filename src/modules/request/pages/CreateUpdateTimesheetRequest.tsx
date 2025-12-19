import React, { useEffect, useRef, useState } from "react";
import { formatDateForInput, formatTimeForInput } from "shared/utils/date-utils";

interface UpdateTimesheetModalProps {
  isModalMode?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const UpdateTimesheetRequestForm: React.FC<UpdateTimesheetModalProps> = ({ isModalMode = false, open = true, onClose }) => {
  const [date, setDate] = useState<string>("");
  const [timeIn, setTimeIn] = useState<string>("");
  const [timeOut, setTimeOut] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const now = new Date();
    setDate(formatDateForInput(now));
    setTimeIn(formatTimeForInput(now));
    const d = new Date(now.getTime());
    d.setHours(d.getHours() + 9);
    setTimeOut(formatTimeForInput(d));
  }, []);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(false), 3500);
      return () => clearTimeout(t);
    }
  }, [success]);

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
    setTimeIn("");
    setTimeOut("");
    setReason("");
    setFile(null);
    if (isModalMode) onClose?.();
  };

  const handleSuccess = () => {
    setTimeIn("");
    setTimeOut("");
    setReason("");
    setFile(null);
    setSuccess(true);
    // Close modal when in modal mode
    if (isModalMode) onClose?.();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSubmitting(true);
    timeoutRef.current = window.setTimeout(() => {
      setSubmitting(false);
      handleSuccess();
    }, 1200);
  };

  const formContent = (
    <form onSubmit={handleSubmit} className={`${isModalMode ? 'bg-white rounded-xl w-full max-w-lg shadow-xl' : 'bg-white rounded-lg shadow-md'} p-6 relative`}>
      {isModalMode && !submitting && (
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">✕</button>
      )}

      <h2 className="text-2xl font-semibold">Cập nhật chấm công</h2>

      <div className="mb-4 mt-6">
        <label className="text-sm text-gray-600 block mb-2">Ngày</label>
        <div className="flex items-center">
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">Thời gian hiện tại</label>
            <div className="flex gap-3 mb-4">
              <div className="flex-1 border border-gray-200 rounded p-3 bg-gray-50">
                <div className="text-xs text-gray-500">Giờ vào</div>
                <div className="font-medium">08:30</div>
              </div>
              <div className="flex-1 border border-gray-200 rounded p-3 bg-gray-50">
                <div className="text-xs text-gray-500">Giờ ra</div>
                <div className="font-medium">17:30</div>
              </div>
            </div>

            <label className="text-sm text-gray-600 block mb-2">Thời gian đề xuất</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                className="w-full border rounded px-3 py-2"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
              />
              <input
                type="time"
                className="w-full border rounded px-3 py-2"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">Thứ tự: Giờ vào (trái) · Giờ ra (phải)</div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">Lý do / Ghi chú</label>
            <textarea
              className="w-full border rounded p-3 min-h-[90px] resize-none"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Mô tả chi tiết lý do cần thay đổi..."
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">Tệp đính kèm (nếu có)</label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => handleDrop(e)}
              className={`border-2 ${dragOver ? "border-blue-400 bg-blue-50" : "border-dashed border-gray-300 bg-white"} rounded p-6 text-center cursor-pointer`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-gray-500">Nhấn để tải lên hoặc kéo thả</div>
              <div className="text-xs text-gray-400">PNG, JPG, PDF (Tối đa 10MB)</div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => onFiles(e.target.files)}
                className="hidden"
              />
            </div>

            {file && (
              <ul className="mt-3">
                  <li key={file.name} className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2 text-sm mb-2">
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <button type="button" onClick={() => removeFile()} className="text-red-500 text-sm">Xóa</button>
                  </li>
              </ul>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={handleCancel} className="px-4 py-2 border rounded bg-white">Hủy</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2" disabled={submitting}>
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
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
      <div className="w-full max-w-lg">
        {formContent}

        {success && (
          <div className="fixed right-6 bottom-6 bg-green-600 text-white rounded-lg shadow-lg px-4 py-3 flex items-start gap-3">
            <div className="text-sm">Yêu cầu cập nhật chấm công đã được gửi (demo)</div>
            <button className="ml-3 opacity-90" onClick={() => setSuccess(false)}>✕</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateTimesheetRequestForm;
