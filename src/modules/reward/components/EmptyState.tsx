import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div className="px-6 py-20">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect
              x="6"
              y="8"
              width="20"
              height="20"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="6"
              y1="13"
              x2="26"
              y2="13"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="11"
              y1="6"
              x2="11"
              y2="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="21"
              y1="6"
              x2="21"
              y2="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Không có dữ liệu
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
