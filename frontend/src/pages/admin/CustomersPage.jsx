import { useState, useEffect } from 'react';
import { apiCall } from '../../api';
import { Users, Mail, Activity, Calendar, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await apiCall('/admin/customers');
      if (response.status === 'success') {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Failed to load customers', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (customers.length === 0) {
      toast.error('No customers to export');
      return;
    }
    
    const headers = ['Name', 'Email', 'Phone Number', 'Address', 'Joined Date', 'Active Policies', 'Total Applications', 'Total Paid (₹)'];
    const csvContent = [
      headers.join(','),
      ...customers.map(user => 
        [`"${user.name}"`, `"${user.email}"`, `"${user.phone || 'N/A'}"`, `"${user.address || 'N/A'}"`, new Date(user.joined).toLocaleDateString(), user.policiesCount, user.applicationsCount, user.totalSpent || 0].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to Excel successfully');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customer Directory</h1>
        <p className="text-gray-500 mt-2">Manage registered users and view their policy portfolio.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Users size={18} className="text-lic-blue" /> All Registered Customers
          </h3>
          <button 
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Download size={16} /> Export
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No customers registered yet.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Customer Info</th>
                  <th className="px-6 py-4">Contact Details</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Stats</th>
                  <th className="px-6 py-4">Total Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {customers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} className="text-gray-400" /> {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-gray-400 font-bold ml-1">📞</span> {user.phone || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 mt-1 max-w-[200px] truncate" title={user.address}>
                          <span className="text-gray-400 font-bold ml-1">📍</span> {user.address || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} className="text-gray-400" /> 
                        {new Date(user.joined).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${user.policiesCount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`} title="Active Policies">
                          {user.policiesCount} Pol
                        </span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold" title="Total Applications">
                          {user.applicationsCount} App
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ₹{user.totalSpent?.toLocaleString() || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
