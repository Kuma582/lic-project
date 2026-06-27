import { useState } from 'react';
import { apiCall } from '../../api';
import toast from 'react-hot-toast';
import { Lock, Save, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function SettingsPage() {
  const { userEmail, userRole } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await apiCall('/admin/change-password', 'PUT', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.status === 'success') {
        toast.success('Password updated successfully');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(response.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'SUPER_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account security and system configurations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-20 h-20 bg-lic-blue text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-inner">
              A
            </div>
            <h3 className="text-xl font-bold text-gray-900">Super Admin</h3>
            <p className="text-sm text-gray-500">{userEmail}</p>
            <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-2 rounded-lg text-sm font-bold">
              <ShieldAlert size={16} /> Full Access Rights
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                <Lock size={20} className="text-lic-blue" /> Change Master Password
              </h3>
            </div>
            
            <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-lic-blue/50 outline-none transition-all" 
                  placeholder="Enter current password" 
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-lic-blue/50 outline-none transition-all" 
                    placeholder="Minimum 6 characters" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-lic-blue/50 outline-none transition-all" 
                    placeholder="Repeat new password" 
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-3 bg-lic-blue text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70"
                >
                  {loading ? 'Updating...' : <><Save size={18} /> Update Password</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
