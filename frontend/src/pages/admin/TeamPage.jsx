import { useState, useEffect } from 'react';
import { apiCall } from '../../api';
import toast from 'react-hot-toast';
import { Shield, UserPlus, Trash2, X, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function TeamPage() {
  const { userEmail, userRole } = useAuth();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    try {
      const response = await apiCall('/admin/team');
      if (response.status === 'success') {
        setTeam(response.data);
      }
    } catch (error) { console.error(error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await apiCall('/admin/team', 'POST', formData);
      if (response.status === 'success') {
        toast.success('Team member added successfully!');
        setTeam([response.data, ...team]);
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '' });
      } else {
        toast.error(response.message || 'Failed to add member');
      }
    } catch (error) { console.error(error);
      toast.error('Server error');
    }
  };

  const handleRemoveMember = async (id, email) => {
    if (email === userEmail) {
      toast.error('You cannot remove yourself!');
      return;
    }
    if (!window.confirm(`Are you sure you want to revoke Admin access for ${email}?`)) return;

    try {
      const response = await apiCall(`/admin/team/${id}`, 'DELETE');
      if (response.status === 'success') {
        toast.success('Access revoked successfully');
        setTeam(team.filter(t => t.id !== id));
      } else {
        toast.error(response.message || 'Error revoking access');
      }
    } catch (error) { console.error(error);
      toast.error('Server error');
    }
  };

  if (userRole !== 'SUPER_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Team Management</h1>
          <p className="text-gray-500 mt-2">Manage admin and staff accounts with system access.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-lic-blue text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200"
        >
          <UserPlus size={18} /> Add Member
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Shield size={20} className="text-lic-blue" /> Authorized Admins
          </h3>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400 font-medium">Loading team...</div>
          ) : team.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Shield size={40} className="mb-4 opacity-20" />
              <p>No team members found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Added On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      {member.name} {member.email === userEmail && <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] uppercase">You</span>}
                    </td>
                    <td className="px-6 py-4">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-bold border border-purple-200">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(member.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      {member.email !== userEmail && (
                        <button 
                          onClick={() => handleRemoveMember(member.id, member.email)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100" 
                          title="Revoke Access"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-lic-blue/50 outline-none" 
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-lic-blue/50 outline-none" 
                  placeholder="e.g. john@lic.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Assign Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-lic-blue/50 outline-none" 
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>
              
              <div className="pt-4 mt-2">
                <button 
                  type="submit" 
                  className="w-full py-3 bg-lic-blue text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
