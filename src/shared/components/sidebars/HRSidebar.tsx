import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, User, Users, Activity, Gift, BarChart3, Settings, Building2 } from 'lucide-react';

const HRSidebar: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-6 py-3 text-sm transition-colors duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  const sectionTitleClass = "px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="py-4">
        <ul className="space-y-1">
          <li>
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Profile Module */}
          <li>
            <h3 className={sectionTitleClass}>Quản lý nhân sự</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/profile" className={navLinkClass}>
                  <User className="w-5 h-5" />
                  <span>Thông tin cá nhân</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile/employees" className={navLinkClass}>
                  <Users className="w-5 h-5" />
                  <span>Danh sách nhân viên</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/departments" className={navLinkClass}>
                  <Building2 className="w-5 h-5" />
                  <span>Quản lý phòng ban</span>
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Request Module */}
          <li>
            <h3 className={sectionTitleClass}>Quản lý yêu cầu</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/requests" className={navLinkClass}>
                  <FileText className="w-5 h-5" />
                  <span>Yêu cầu của tôi</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/requests/manage" className={navLinkClass}>
                  <FileText className="w-5 h-5" />
                  <span>Tất cả yêu cầu</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/requests/leave/create" className={navLinkClass}>
                  <FileText className="w-5 h-5" />
                  <span>Tạo yêu cầu nghỉ phép</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/requests/attendance" className={navLinkClass}>
                  <FileText className="w-5 h-5" />
                  <span>Chấm công toàn công ty</span>
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Activity Module */}
          <li>
            <h3 className={sectionTitleClass}>Quản lý hoạt động</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/activities" className={navLinkClass}>
                  <Activity className="w-5 h-5" />
                  <span>Tất cả hoạt động</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/activities/create" className={navLinkClass}>
                  <Activity className="w-5 h-5" />
                  <span>Tạo hoạt động mới</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/activities/certificates" className={navLinkClass}>
                  <Activity className="w-5 h-5" />
                  <span>Quản lý chứng nhận</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/activities/summary" className={navLinkClass}>
                  <BarChart3 className="w-5 h-5" />
                  <span>Báo cáo tổng hợp</span>
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Reward Module */}
          <li>
            <h3 className={sectionTitleClass}>Quản lý thưởng</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/rewards" className={navLinkClass}>
                  <Gift className="w-5 h-5" />
                  <span>Tổng quan điểm</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/rewards/campaigns" className={navLinkClass}>
                  <Gift className="w-5 h-5" />
                  <span>Chiến dịch thưởng</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/rewards/transactions" className={navLinkClass}>
                  <Gift className="w-5 h-5" />
                  <span>Lịch sử giao dịch</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/rewards/redeem" className={navLinkClass}>
                  <Gift className="w-5 h-5" />
                  <span>Đổi quà</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/rewards/gift" className={navLinkClass}>
                  <Gift className="w-5 h-5" />
                  <span>Tặng điểm</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/rewards/team-report" className={navLinkClass}>
                  <BarChart3 className="w-5 h-5" />
                  <span>Báo cáo công ty</span>
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Settings */}
          <li>
            <h3 className={sectionTitleClass}>Cài đặt</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/settings" className={navLinkClass}>
                  <Settings className="w-5 h-5" />
                  <span>Cấu hình hệ thống</span>
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default HRSidebar;
