import { useState, useEffect } from 'react';
import { Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiCall } from '../api';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

export default function MyPoliciesPage() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleUserNotify = (event) => {
        if (event.type === 'APPLICATION_STATUS') {
          if (event.status === 'APPROVED') {
            toast.success(event.message || 'Policy Approved!');
          } else {
            toast.error(event.message || 'Policy Rejected!');
          }
          // Refresh the table to show the real policy!
          fetchPolicies();
        }
      };

      socket.on('user_notify', handleUserNotify);
      return () => socket.off('user_notify', handleUserNotify);
    }
  }, [socket]);

  const fetchPolicies = async () => {
    const response = await apiCall('/policies/my-policies', 'GET', null, true);
    if (response.status === 'success') {
      setPolicies(response.data);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Policies</h1>
        <p className="text-gray-600 mt-1">Manage and view details of your purchased insurance policies.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">All Policies</h3>
          <Link to="/apply" className="bg-lic-blue text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors">
            + Apply New
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Policy No.</th>
                <th className="px-6 py-4 font-semibold">Plan Name</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Premium</th>
                <th className="px-6 py-4 font-semibold">Total Paid</th>
                <th className="px-6 py-4 font-semibold">Next Due</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Loading your policies...</td>
                </tr>
              ) : policies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">You don't have any policies yet. Apply for a new one!</td>
                </tr>
              ) : (
                policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-lic-blue">{policy.id}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{policy.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        policy.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                        policy.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{policy.premium}</td>
                    <td className="px-6 py-4 font-bold text-green-600">{policy.totalPaid}</td>
                    <td className="px-6 py-4">{policy.nextDue}</td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button className="p-2 text-gray-500 hover:text-lic-blue bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all">
                        <Eye size={16} />
                      </button>
                      {policy.status === 'ACTIVE' && (
                        <button className="p-2 text-gray-500 hover:text-lic-blue bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all">
                          <Download size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-sm text-gray-500">
          Showing {policies.length} policies
        </div>
      </div>
    </div>
  );
}
