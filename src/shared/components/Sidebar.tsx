import React from 'react';
import { useAuth } from 'contexts/AuthContext';
import EmployeeSidebar from './sidebars/EmployeeSidebar';
import ManagerSidebar from './sidebars/ManagerSidebar';
import HRSidebar from './sidebars/HRSidebar';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  // Route to appropriate sidebar based on user role
  switch (user?.role) {
    case 'EMPLOYEE':
      return <EmployeeSidebar />;
    case 'MANAGER':
      return <ManagerSidebar />;
    case 'HR':
    case 'ADMIN':
      return <HRSidebar />;
    default:
      return <EmployeeSidebar />; // Fallback
  }
};

export default Sidebar;
