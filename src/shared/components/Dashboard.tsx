import React from 'react';
import { useAuth } from 'contexts/AuthContext';
import EmployeeDashboard from './dashboards/EmployeeDashboard/EmployeeDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard/ManagerDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  switch (user?.role) {
    case 'EMPLOYEE':
      return <EmployeeDashboard />;
    case 'MANAGER':
      return <ManagerDashboard />;
    case 'HR':
    case 'ADMIN':
      // TODO: Implement HRDashboard in future sprint
      return <ManagerDashboard />; // Temporary fallback to Manager
    default:
      return <EmployeeDashboard />;
  }
};

export default Dashboard;
