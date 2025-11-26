import React from "react";
import { User } from "shared/types";

type Props = {
  open: boolean;
  user: User | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

const ConfirmationModal: React.FC<Props> = ({
  open,
  user,
  onCancel,
  onConfirm,
  loading,
}) => {
  if (!open || !user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-3">Xác nhận vô hiệu hóa</h3>
        <p className="mb-4">
          Bạn có chắc muốn vô hiệu hóa nhân viên{" "}
          <strong>{user.fullName}</strong> (Mã: {user.userId})?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-100">
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            {loading ? "Đang thực hiện..." : "Vô hiệu hóa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
