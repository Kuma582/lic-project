import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, CreditCard, ShieldAlert, LogOut, Settings, Users, IndianRupee, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../api';

export default function Sidebar({ role = "USER" }) {
  const { logout, userEmail } = useAuth();
  const [hasPolicies, setHasPolicies] = useState(true); // Default to true to prevent flicker, then check
  const displayName = userEmail ? userEmail.split('@')[0] : (role === 'ADMIN' || role === 'SUPER_ADMIN' ? 'Admin' : 'User');

  const isSuperAdmin = role === 'SUPER_ADMIN';

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Applications', path: '/admin/applications', icon: <FileText size={20} /> },
    { name: 'Claims', path: '/admin/claims', icon: <Activity size={20} /> },
    ...(isSuperAdmin ? [{ name: 'Transactions', path: '/admin/transactions', icon: <IndianRupee size={20} /> }] : []),
    { name: 'Insurance Plans', path: '/admin/plans', icon: <ShieldAlert size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    ...(isSuperAdmin ? [{ name: 'Team', path: '/admin/team', icon: <ShieldAlert size={20} /> }] : []),
    ...(isSuperAdmin ? [{ name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> }] : []),
  ];

  useEffect(() => {
    if (role === 'USER') {
      const checkPolicies = async () => {
        try {
          const response = await apiCall('/policies/my-policies', 'GET', null, true);
          if (response.status === 'success') {
            setHasPolicies(response.data.length > 0);
          }
        } catch (error) {
          console.error(error);
        }
      };
      checkPolicies();
    }
  }, [role]);

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Pay Installment', path: '/payments', icon: <CreditCard size={20} /> },
    ...(hasPolicies ? [
      { name: 'My Policies', path: '/dashboard/policies', icon: <FileText size={20} /> }
    ] : []),
  ];

  const isAdminUser = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const links = isAdminUser ? adminLinks : userLinks;

  return (
    <div className="w-64 bg-lic-dark text-white flex flex-col min-h-[calc(100vh-80px)] border-r border-gray-800 shadow-2xl">
      <div className="p-6">
        <h3 className="text-xs uppercase text-gray-400 font-bold tracking-widest mb-3">
          {isAdminUser ? 'Admin Panel' : 'My Account'}
        </h3>
        
        {/* User Profile Card */}
        <div className="flex items-center gap-3 mb-6 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="w-10 h-10 rounded-full bg-lic-gold text-lic-dark flex items-center justify-center font-bold text-lg shadow-inner">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col truncate w-full">
            <span className="text-sm font-bold text-white truncate capitalize">{displayName}</span>
            <span className="text-xs text-gray-400 truncate" title={userEmail}>{userEmail || 'No Email'}</span>
          </div>
        </div>

        <div className="space-y-1">
          {links.map((link) => {
            const isActive = window.location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive 
                    ? 'bg-lic-blue text-lic-gold shadow-md' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="mt-auto p-6 border-t border-gray-800">
        <button onClick={logout} className="flex items-center gap-3 text-gray-400 hover:text-red-400 w-full px-4 py-2 font-medium transition-colors">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
