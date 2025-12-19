import React from "react";

const ErrorState: React.FC = () => {
  return (
    <div className="px-6 py-20">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" stroke="#DC2626" strokeWidth="2" />
            <line
              x1="16"
              y1="10"
              x2="16"
              y2="18"
              stroke="#DC2626"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="16" cy="22" r="1" fill="#DC2626" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Không thể tải dữ liệu
        </h3>
      </div>
    </div>
  );
};

export default ErrorState;
