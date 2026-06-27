import { useState, useEffect } from 'react';
import { apiCall } from '../../api';
import toast from 'react-hot-toast';
import { FileText, CheckCircle, XCircle, Search, Clock, Eye } from 'lucide-react';

export default function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await apiCall('/admin/claims');
      if (response.status === 'success') {
        setClaims(response.data);
      }
    } catch (error) {
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this claim as ${status}?`)) return;
    
    try {
      const response = await apiCall(`/admin/claims/${id}`, 'PUT', { status });
      if (response.status === 'success') {
        toast.success(`Claim ${status} successfully`);
        setClaims(cls => cls.map(c => c.id === id ? { ...c, status } : c));
        if (selectedClaim?.id === id) setSelectedClaim(null);
      } else {
        toast.error(response.message || 'Error updating status');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  const filteredClaims = claims.filter(c => {
    if (!search) return true;
    const term = search.toLowerCase();
    return c.claimId.toLowerCase().includes(term) || c.user.toLowerCase().includes(term) || c.policyNo.toLowerCase().includes(term);
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Claims Management</h1>
        <p className="text-gray-500 mt-2">Review and process policy maturity and death claims.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Claim ID, User, or Policy No..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lic-blue/50 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400 font-medium">Loading claims...</div>
          ) : filteredClaims.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FileText size={48} className="mb-4 opacity-20" />
              <p>No claims found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Claim ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Policy No</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredClaims.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-lic-blue">{c.claimId}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{c.user}</td>
                    <td className="px-6 py-4 font-mono text-xs">{c.policyNo}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold">{c.reason}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{c.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(c.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedClaim(c)} className="p-2 text-gray-600 hover:text-lic-blue hover:bg-blue-100 rounded-lg transition-colors" title="Review Details">
                        <Eye size={18} />
                      </button>
                      {c.status === 'Pending' && (
                        <>
                          <button onClick={() => updateStatus(c.id, 'Approved')} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Approve">
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => updateStatus(c.id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Claim Details</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Claim ID: <span className="text-lic-blue">{selectedClaim.claimId}</span></p>
              </div>
              <StatusBadge status={selectedClaim.status} />
            </div>
            
            <div className="p-6 overflow-y-auto bg-white flex-grow">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-2">Description</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed">
                    {selectedClaim.description || 'No description provided by the user.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Claim Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₹{selectedClaim.amount.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-center items-center text-center hover:bg-gray-100 transition-colors cursor-pointer">
                    <FileText size={24} className="text-gray-400 mb-1" />
                    <p className="text-sm font-medium text-lic-blue">View Attached Document</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-between items-center">
              <button onClick={() => setSelectedClaim(null)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                Close
              </button>
              
              {selectedClaim.status === 'Pending' && (
                <div className="flex gap-3">
                  <button onClick={() => updateStatus(selectedClaim.id, 'Rejected')} className="px-6 py-2.5 rounded-xl font-bold text-red-600 bg-red-100 hover:bg-red-200 transition-colors flex items-center gap-2">
                    <XCircle size={18} /> Reject
                  </button>
                  <button onClick={() => updateStatus(selectedClaim.id, 'Approved')} className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
                    <CheckCircle size={18} /> Approve Claim
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'Approved') {
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle size={14} /> Approved</span>;
  }
  if (status === 'Rejected') {
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700"><XCircle size={14} /> Rejected</span>;
  }
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700"><Clock size={14} /> Pending</span>;
}
