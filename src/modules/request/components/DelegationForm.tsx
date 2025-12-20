import React, { useEffect, useState } from "react";
import { CreateDelegationRequest } from "../types/request.types";

interface DelegationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDelegationRequest) => void;
}

const DelegationForm: React.FC<DelegationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [delegateToId, setDelegateToId] = useState("");

  useEffect(() => {
    if (isOpen) {
      // clear when opened so user starts with empty form
      setDelegateToId("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const canSubmit = !!delegateToId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={() => onClose()}
      />

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tạo ủy quyền mới</h3>
            <button
              onClick={() => onClose()}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Ủy quyền cho
              </label>
              <select
                value={delegateToId}
                onChange={(e) => setDelegateToId(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Chọn người được ủy quyền</option>
                <option value="M002">Trần Thị B</option>
                <option value="M003">Lê Văn C</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => onClose()}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (!canSubmit) return;
                onSubmit({ delegateToId });
              }}
              disabled={!canSubmit}
              className={`px-4 py-2 rounded ${!canSubmit
                  ? "bg-blue-300 text-white cursor-not-allowed opacity-70"
                  : "bg-blue-600 text-white"
                }`}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelegationForm;
