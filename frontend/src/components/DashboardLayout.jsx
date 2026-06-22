import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import FraudAlertModal from './FraudAlertModal';

export default function DashboardLayout() {
  const { userRole } = useAuth();

  return (
    <div className="flex flex-1 bg-gray-50">
      <div className="hidden md:block">
        <Sidebar role={userRole} />
      </div>
      <div className="flex-1 overflow-y-auto h-[calc(100vh-80px)] relative">
        <div className="p-8">
          {userRole === 'USER' && <FraudAlertModal />}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
