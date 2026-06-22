import { useState, useEffect } from 'react';
import { Search, Filter, Check, X, Eye } from 'lucide-react';
import { apiCall } from '../api';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const socket = useSocket();

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleAdminNotify = (event) => {
        if (event.type === 'NEW_APPLICATION') {
          toast.success(event.message || 'New application received!');
          // Format it to match the existing state
          const newApp = {
            id: event.data.appReference,
            appReference: event.data.appReference,
            userId: event.data.userId,
            planId: event.data.planId,
            user: event.data.user.name,
            plan: event.data.plan.name,
            date: new Date(event.data.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            createdAt: event.data.createdAt,
            status: event.data.status,
            formData: event.data.formData
          };
          setPolicies((prev) => [newApp, ...prev]);
        }
      };

      socket.on('admin_notify', handleAdminNotify);
      return () => socket.off('admin_notify', handleAdminNotify);
    }
  }, [socket]);

  const fetchPolicies = async () => {
    const response = await apiCall('/applications');
    if (response.status === 'success') {
      setPolicies(response.data);
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    if (window.confirm(`Are you sure you want to mark this application as ${status}?`)) {
      const response = await apiCall(`/applications/${id}`, 'PUT', { status });
      if (response.status === 'success') {
        // Update local state
        setPolicies(policies.map(p => p.id === id ? { ...p, status } : p));
        if (selectedPolicy && selectedPolicy.id === id) {
          setSelectedPolicy({ ...selectedPolicy, status });
        }
      } else {
        alert(response.message || 'Error updating status');
      }
    }
  };

  const openDetails = (policy) => {
    setSelectedPolicy(policy);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Policies</h1>
        <p className="text-gray-600 mt-1">Review, approve, or reject user policy applications.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by App ID or User Name..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lic-blue"
            />
          </div>

        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading applications...</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">App ID</th>
                  <th className="px-6 py-4 font-semibold">User ID</th>
                  <th className="px-6 py-4 font-semibold">Plan ID</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-lic-blue">{policy.appReference}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{policy.userId.substring(0,8)}...</td>
                    <td className="px-6 py-4">{policy.planId.substring(0,8)}...</td>
                    <td className="px-6 py-4">{new Date(policy.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        policy.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        policy.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button onClick={() => openDetails(policy)} className="p-2 text-gray-500 hover:text-lic-blue bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all" title="View Details">
                        <Eye size={16} />
                      </button>
                      {policy.status === 'PENDING' && (
                        <>
                          <button onClick={() => updateStatus(policy.id, 'APPROVED')} className="p-2 text-green-600 hover:bg-green-50 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all" title="Approve">
                            <Check size={16} />
                          </button>
                          <button onClick={() => updateStatus(policy.id, 'REJECTED')} className="p-2 text-red-600 hover:bg-red-50 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all" title="Reject">
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {policies.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No applications found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <p className="text-sm text-gray-500 mt-1">Ref: {selectedPolicy.appReference}</p>
              </div>
              <button onClick={() => setSelectedPolicy(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h3 className="font-bold text-lg border-b pb-2 mb-4 text-lic-blue">Form Data</h3>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm border border-gray-200">
                  {typeof selectedPolicy.formData === 'string' 
                    ? JSON.stringify(JSON.parse(selectedPolicy.formData), null, 2)
                    : JSON.stringify(selectedPolicy.formData, null, 2)}
                </pre>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setSelectedPolicy(null)} className="px-6 py-2 rounded-lg font-bold text-gray-600 border border-gray-300 hover:bg-gray-100">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
