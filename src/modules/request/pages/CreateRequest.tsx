import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Home, Edit3 } from 'lucide-react';

const CreateRequest: React.FC = () => {
  const navigate = useNavigate();

  const items = [
    {
      id: 'check-in',
      title: 'Tạo yêu cầu Check-in',
      desc: 'Ghi nhận giờ vào',
      icon: <Clock className="w-5 h-5 mr-3 text-blue-600" />,
      to: '/requests/create/check-in',
    },
    {
      id: 'check-out',
      title: 'Tạo yêu cầu Check-out',
      desc: 'Ghi nhận giờ ra',
      icon: <Clock className="w-5 h-5 mr-3 text-blue-600" />,
      to: '/requests/create/check-out',
    },
    {
      id: 'leave',
      title: 'Tạo yêu cầu nghỉ phép',
      desc: 'Gửi yêu cầu nghỉ phép',
      icon: <Calendar className="w-5 h-5 mr-3 text-blue-600" />,
      to: '/requests/create/leave',
    },
    {
      id: 'wfh',
      title: 'Tạo yêu cầu làm việc từ xa',
      desc: 'Yêu cầu WFH',
      icon: <Home className="w-5 h-5 mr-3 text-blue-600" />,
      to: '/requests/create/wfh',
    },
    {
      id: 'update-timesheet',
      title: 'Cập nhật chấm công',
      desc: 'Chỉnh sửa giờ vào/ra / thêm ghi chú',
      icon: <Edit3 className="w-5 h-5 mr-3 text-blue-600" />,
      to: '/requests/create/update-timesheet',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gửi yêu cầu mới</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => navigate(it.to)}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition duration-200 text-left flex items-center"
          >
            {it.icon}
            <div>
              <div className="font-medium text-gray-900">{it.title}</div>
              <div className="text-sm text-gray-600">{it.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CreateRequest;
