import React from "react";
import { X, Paperclip, ChevronDown } from "lucide-react";

const RemoteWorkRequestModal: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="
          w-full
          max-w-3xl
          rounded-xl
          bg-white
          p-5
          shadow-lg
          sm:p-6
          max-h-[90vh]
          overflow-y-auto
        "
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
          <button className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-y-4
            sm:grid-cols-2
            sm:gap-x-6
          "
        >
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Ngày kết thúc
            </label>
            <input
              type="date"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Ca làm việc
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-black">
                <option>Sáng</option>
                <option>Chiều</option>
                <option>Cả ngày</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Địa chỉ làm việc
            </label>
            <input
              type="text"
              placeholder="Nhập địa chỉ"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold">Lý do</label>
            <textarea
              rows={3}
              placeholder="Nhập lý do"
              className="w-full resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Đính kèm file
            </label>
            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
              <span>Tải tệp lên</span>
              <Paperclip className="h-4 w-4" />
              <input type="file" className="hidden" />
            </label>
          </div>

          <div className="flex items-end">
            <p className="text-sm font-semibold">
              Số ngày WFH còn lại trong tuần:{" "}
              <span className="font-bold">2</span>
            </p>
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" />
            <span className="text-sm">
              Tôi cam kết đảm bảo tiến độ công việc
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
            Hủy
          </button>
          <button className="rounded-lg bg-black px-6 py-2 text-sm text-white hover:bg-gray-800">
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoteWorkRequestModal;
