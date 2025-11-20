import React from "react";
import { Circle } from "lucide-react";

const EmptyList: React.FC<{ message?: string }> = ({
  message = "Danh sách nhân viên trống",
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center">
      <Circle className="text-gray-300 mb-4" size={48} />
      <div className="text-gray-600 text-lg">{message}</div>
    </div>
  );
};

export default EmptyList;
