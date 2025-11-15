import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isManagerOrAbove = user && ['MANAGER', 'HR', 'ADMIN'].includes(user.role);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-6 py-2 text-sm transition-colors duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  const sectionTitleClass = "px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="py-4">
        <ul className="space-y-1">
          <li>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          </li>

          {/* Request Module */}
          <li className="mt-6">
            <h3 className={sectionTitleClass}>Yêu cầu</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/requests" className={navLinkClass}>
                  Danh sách yêu cầu
                </NavLink>
              </li>
              <li>
                <NavLink to="/requests/leave/create" className={navLinkClass}>
                  Tạo yêu cầu nghỉ phép
                </NavLink>
              </li>
              <li>
                <NavLink to="/requests/attendance" className={navLinkClass}>
                  Bảng chấm công
                </NavLink>
              </li>
              {isManagerOrAbove && (
                <li>
                  <NavLink to="/requests/manage" className={navLinkClass}>
                    Quản lý yêu cầu
                  </NavLink>
                </li>
              )}
            </ul>
          </li>

          {/* Profile Module */}
          <li className="mt-6">
            <h3 className={sectionTitleClass}>Hồ sơ</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/profile" className={navLinkClass}>
                  Thông tin cá nhân
                </NavLink>
              </li>
              {isManagerOrAbove && (
                <li>
                  <NavLink to="/profile/employees" className={navLinkClass}>
                    Danh sách nhân viên
                  </NavLink>
                </li>
              )}
            </ul>
          </li>

          {/* Activity Module */}
          <li className="mt-6">
            <h3 className={sectionTitleClass}>Hoạt động</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/activities" className={navLinkClass}>
                  Tất cả hoạt động
                </NavLink>
              </li>
              <li>
                <NavLink to="/activities/certificates" className={navLinkClass}>
                  Chứng nhận
                </NavLink>
              </li>
              {isManagerOrAbove && (
                <li>
                  <NavLink to="/activities/summary" className={navLinkClass}>
                    Tổng kết
                  </NavLink>
                </li>
              )}
            </ul>
          </li>

          {/* Reward Module */}
          <li className="mt-6">
            <h3 className={sectionTitleClass}>Điểm thưởng</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <NavLink to="/rewards" className={navLinkClass}>
                  Tổng quan điểm
                </NavLink>
              </li>
              <li>
                <NavLink to="/rewards/transactions" className={navLinkClass}>
                  Lịch sử giao dịch
                </NavLink>
              </li>
              <li>
                <NavLink to="/rewards/redeem" className={navLinkClass}>
                  Đổi quà
                </NavLink>
              </li>
              {isManagerOrAbove && (
                <>
                  <li>
                    <NavLink to="/rewards/gift" className={navLinkClass}>
                      Tặng điểm
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/rewards/team-report" className={navLinkClass}>
                      Báo cáo team
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
