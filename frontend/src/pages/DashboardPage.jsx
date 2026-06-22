import { ShieldCheck, FileText, CreditCard, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here is a summary of your insurance portfolio.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Policies</p>
              <h3 className="text-3xl font-bold text-gray-900">2</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-green-600">
              <ShieldCheck size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 font-medium">All in good standing</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Premium Paid</p>
              <h3 className="text-3xl font-bold text-gray-900">₹85,000</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-lic-blue">
              <CreditCard size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500">Till date</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pending Applications</p>
              <h3 className="text-3xl font-bold text-gray-900">1</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600">
              <FileText size={24} />
            </div>
          </div>
          <p className="text-sm text-yellow-600 font-medium">Under Review</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Claims Status</p>
              <h3 className="text-3xl font-bold text-gray-900">0</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
              <Activity size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500">No active claims</p>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Recent Policies */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">My Policies</h3>
            <Link to="/dashboard/policies" className="text-sm font-medium text-lic-blue hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">Policy Name</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Jeevan Anand</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">ACTIVE</span>
                  </td>
                  <td className="px-6 py-4">₹2,500/mo</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Jeevan Tarun</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">ACTIVE</span>
                  </td>
                  <td className="px-6 py-4">₹1,800/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Recent Payments</h3>
            <Link to="/dashboard/payments" className="text-sm font-medium text-lic-blue hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">12 Jun 2026</td>
                  <td className="px-6 py-4 font-medium text-gray-900">₹2,500</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">PAID</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">05 May 2026</td>
                  <td className="px-6 py-4 font-medium text-gray-900">₹1,800</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">PAID</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
