import React from "react";

type Props = {
  open: boolean;
  format: "excel" | "pdf";
  setFormat: (f: "excel" | "pdf") => void;
  loading?: boolean;
  onClose: () => void;
  onExport: () => Promise<void> | void;
};

const ExportModal: React.FC<Props> = ({
  open,
  format,
  setFormat,
  loading,
  onClose,
  onExport,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-3">Xuất danh sách nhân viên</h3>
        <p className="mb-3">Chọn định dạng file để tải về</p>
        <div className="mb-4">
          <label className="block text-sm mb-2">Định dạng</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
            className="w-full rounded border px-2 py-1"
            disabled={loading}
          >
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100"
            disabled={loading}
          >
            Huỷ
          </button>
          <button
            onClick={async () => {
              await onExport();
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Tải về"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
