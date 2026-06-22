import { Users, FileText, CreditCard, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const { userEmail } = useAuth();
  const displayName = userEmail ? userEmail.split('@')[0] : 'Admin';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {displayName}!</h1>
        <p className="text-gray-600 mt-1">Here is what's happening with your LIC branch today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900">1,245</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-lic-blue">
              <Users size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 font-medium flex items-center gap-1">
            <TrendingUp size={14} /> +12% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Policies Sold</p>
              <h3 className="text-3xl font-bold text-gray-900">3,480</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-green-600">
              <FileText size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 font-medium flex items-center gap-1">
            <TrendingUp size={14} /> +8% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Collections</p>
              <h3 className="text-3xl font-bold text-gray-900">₹4.5Cr</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600">
              <CreditCard size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 font-medium flex items-center gap-1">
            <TrendingUp size={14} /> +15% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pending Apps</p>
              <h3 className="text-3xl font-bold text-gray-900">42</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-lg text-red-600">
              <FileText size={24} />
            </div>
          </div>
          <p className="text-sm text-red-500 font-medium">Requires immediate action</p>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
          <Link to="/admin/policies" className="text-sm font-medium text-lic-blue hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">App ID</th>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Plan Name</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">APP-5512</td>
                <td className="px-6 py-4">Ramesh Kumar</td>
                <td className="px-6 py-4">Jeevan Anand</td>
                <td className="px-6 py-4">17 Jun 2026</td>
                <td className="px-6 py-4">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold">PENDING</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to="/admin/policies" className="text-lic-blue font-bold hover:underline">Review</Link>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">APP-5511</td>
                <td className="px-6 py-4">Sita Devi</td>
                <td className="px-6 py-4">Jeevan Umang</td>
                <td className="px-6 py-4">16 Jun 2026</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">APPROVED</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-gray-400 cursor-not-allowed">Reviewed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
