import { useState, useEffect } from 'react';
import { apiCall } from '../../api';
import toast from 'react-hot-toast';
import { IndianRupee, Download, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function TransactionsPage() {
  const { userRole } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await apiCall('/admin/payments');
      if (response.status === 'success') {
        setPayments(response.data);
      }
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => {
    if (!search) return true;
    const term = search.toLowerCase();
    return p.txnId.toLowerCase().includes(term) || p.user.toLowerCase().includes(term);
  });

  const exportToExcel = () => {
    if (filteredPayments.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    const headers = ['Transaction ID', 'Customer', 'Email', 'Plan', 'Amount', 'Date', 'Mode', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(p => 
        [`"${p.txnId}"`, `"${p.user}"`, `"${p.email}"`, `"${p.plan}"`, p.amount, new Date(p.date).toLocaleString(), p.payMode, p.status].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Transactions exported successfully');
  };

  if (userRole !== 'SUPER_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financial Transactions</h1>
          <p className="text-gray-500 mt-2">Monitor all premium collections and policy payments.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Transaction ID or Name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lic-blue/50 text-sm"
            />
          </div>
          <button 
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
          >
            <Download size={16} /> Export to Excel
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400 font-medium">Loading transactions...</div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <IndianRupee size={48} className="mb-4 opacity-20" />
              <p>No transactions found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Policy Plan</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.txnId}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{p.user}</p>
                      <p className="text-xs text-gray-500">{p.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{p.plan}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(p.date).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold uppercase tracking-wider">{p.payMode}</span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-gray-900 text-base">₹{p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
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

function StatusBadge({ status }) {
  if (status === 'Success') {
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle2 size={14} /> Success</span>;
  }
  if (status === 'Failed') {
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700"><XCircle size={14} /> Failed</span>;
  }
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700"><Clock size={14} /> Pending</span>;
}
