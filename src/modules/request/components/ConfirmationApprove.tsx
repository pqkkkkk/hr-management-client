import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmationApprove: React.FC<Props> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full mx-4 z-10">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-xl">?</span>
          </div>
          <h3 className="text-xl font-semibold">Xác nhận Phê duyệt yêu cầu?</h3>
          <p className="mt-3 text-sm text-gray-600">
            Bạn có chắc chắn muốn phê duyệt yêu cầu này không? Hành động này
            không thể hoàn tác.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Phê duyệt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationApprove;
