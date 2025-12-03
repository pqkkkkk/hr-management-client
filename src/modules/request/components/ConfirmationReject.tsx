import React, { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

const ConfirmationReject: React.FC<Props> = ({ open, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full mx-4 z-10">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-xl">!</span>
          </div>
          <h3 className="text-xl font-semibold">Xác nhận Từ chối yêu cầu?</h3>
          <p className="mt-3 text-sm text-gray-600">
            Bạn có chắc chắn muốn từ chối yêu cầu này không? Hành động này không
            thể hoàn tác.
          </p>
          <div className="mt-4 text-left">
            <label className="block text-sm text-gray-700">
              Nhập lý do từ chối (bắt buộc)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 w-full border rounded p-2"
              rows={3}
            ></textarea>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">
              Hủy
            </button>
            <button
              onClick={() => {
                if (reason.trim()) {
                  onConfirm(reason.trim());
                  setReason("");
                } else {
                  toast.warn("Vui lòng nhập lý do từ chối", {
                    position: "top-right",
                  });
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Từ chối
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationReject;
