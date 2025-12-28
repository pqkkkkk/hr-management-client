import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, User, Users, Activity, Gift, BarChart3 } from 'lucide-react';

const ManagerSidebar: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-6 py-3 text-sm transition-colors duration-200 ${isActive
      ? 'bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600'
      : 'text-gray-700 hover:bg-gray-100'
    }`;

  const sectionTitleClass = "px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="py-4">
        <ul className="space-y-1">
          <li>
            <NavLink to="/dashboard" end className={navLinkClass}>
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Profile Module */}
          <li>
            <h3 className={sectionTitleClass}>Hồ sơ</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/profile/users/1/for-employee" end className={navLinkClass}>
                  <User className="w-5 h-5" />
                  <span>Thông tin cá nhân</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile/users" end className={navLinkClass}>
                  <Users className="w-5 h-5" />
                  <span>Quản lý nhân viên</span>
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Request Module */}
          <li>
            <h3 className={sectionTitleClass}>Yêu cầu</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/requests/manage" end className={navLinkClass}>
                  <FileText className="w-5 h-5" />
                  <span>Quản lý yêu cầu team</span>
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Activity Module */}
          <li>
            <h3 className={sectionTitleClass}>Hoạt động</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/activities/overview" end className={navLinkClass}>
                  <Activity className="w-5 h-5" />
                  <span>Xem tổng kết hoạt động</span>
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Reward Module */}
          <li>
            <h3 className={sectionTitleClass}>Điểm thưởng</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/rewards/programs/1" end className={navLinkClass}>
                  <Gift className="w-5 h-5" />
                  <span>Đợt khen thưởng hiện tại</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/rewards/gifted-transactions" end className={navLinkClass}>
                  <Gift className="w-5 h-5" />
                  <span>Lịch sử tặng điểm</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/rewards/gift" end className={navLinkClass}>
                  <Gift className="w-5 h-5" />
                  <span>Tặng điểm cho team</span>
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default ManagerSidebar;
