import React from "react";

// Static pagination placeholder used when real data isn't available yet.
const Pagination: React.FC = () => {
  return (
    <div className="px-4 py-4 border-t border-gray-200 rounded-b-xl flex items-center justify-center">
      <div className="flex items-center gap-1">
        <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-md text-sm bg-blue-600 text-white font-bold">
          1
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-md text-sm text-gray-900 hover:bg-gray-100">
          2
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-md text-sm text-gray-900 hover:bg-gray-100">
          3
        </button>
        <span className="w-9 h-9 flex items-center justify-center text-sm text-gray-900">
          ...
        </span>
        <button className="w-9 h-9 flex items-center justify-center rounded-md text-sm text-gray-900 hover:bg-gray-100">
          10
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
            <path
              d="M9 6L15 12L9 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
