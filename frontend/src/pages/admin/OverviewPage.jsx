import { useState, useEffect } from 'react';
import { apiCall } from '../../api';
import { Users, FileText, Activity, IndianRupee, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiCall('/admin/stats');
      if (response.status === 'success') {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading Dashboard...</div>;
  }

  // Mock data for the chart, since we don't have historical data in backend yet
  const chartData = [
    { name: 'Jan', applications: 40, revenue: 24000 },
    { name: 'Feb', applications: 30, revenue: 13980 },
    { name: 'Mar', applications: 20, revenue: 9800 },
    { name: 'Apr', applications: 27, revenue: 39080 },
    { name: 'May', applications: 18, revenue: 48000 },
    { name: 'Jun', applications: 23, revenue: 38000 },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
        <p className="text-gray-500 mt-2">Real-time metrics and performance analytics of your LIC branch.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Customers" 
          value={stats?.users?.total || 0} 
          icon={<Users size={24} />} 
          color="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Pending Applications" 
          value={stats?.applications?.pending || 0} 
          icon={<FileText size={24} />} 
          color="bg-amber-100 text-amber-600" 
          alert={stats?.applications?.pending > 0}
        />
        <StatCard 
          title="Active Policies" 
          value={stats?.policies?.active || 0} 
          icon={<ShieldCheck size={24} />} 
          color="bg-emerald-100 text-emerald-600" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${(stats?.revenue?.total || 0).toLocaleString()}`} 
          icon={<IndianRupee size={24} />} 
          color="bg-purple-100 text-purple-600" 
        />
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Performance Trends</h3>
            <p className="text-sm text-gray-500">Applications and Revenue over the last 6 months</p>
          </div>
          <div className="bg-gray-50 px-3 py-1 rounded-lg text-sm font-medium text-gray-600 border border-gray-200">
            Year 2026
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar yAxisId="left" dataKey="applications" name="Applications" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar yAxisId="right" dataKey="revenue" name="Revenue (₹)" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, alert }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
      {alert && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping m-6"></span>
      )}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-50`}>
          {icon}
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-transparent to-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
    </div>
  );
}
