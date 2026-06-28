import { useState, useEffect } from 'react';
import { apiCall } from '../../api';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';
import { Search, CheckCircle, XCircle, Eye, Filter, Download, X } from 'lucide-react';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const socket = useSocket();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleAdminNotify = (event) => {
        if (event.type === 'NEW_APPLICATION') {
          toast.success('New Application Received: ' + event.message);
          fetchApplications(); // Refresh list to get full data
        }
      };
      socket.on('admin_notify', handleAdminNotify);
      return () => socket.off('admin_notify', handleAdminNotify);
    }
  }, [socket]);

  async function fetchApplications() {
    try {
      const response = await apiCall('/applications');
      if (response.status === 'success') {
        setApplications(response.data);
      }
    } catch (error) { console.error(error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this application as ${status}?`)) return;
    
    try {
      const response = await apiCall(`/applications/${id}`, 'PUT', { status });
      if (response.status === 'success') {
        toast.success(`Application ${status} successfully`);
        setApplications(apps => apps.map(app => app.id === id ? { ...app, status } : app));
        if (selectedApp?.id === id) setSelectedApp(null);
      } else {
        toast.error(response.message || 'Error updating status');
      }
    } catch (error) { console.error(error);
      toast.error('Server error');
    }
  };

  // Filter and Search Logic
  const filteredApps = applications.filter(app => {
    if (filter !== 'ALL' && app.status !== filter) return false;
    if (search) {
      const term = search.toLowerCase();
      return app.id.toLowerCase().includes(term) || app.user.toLowerCase().includes(term);
    }
    return true;
  });

  const exportToExcel = () => {
    if (filteredApps.length === 0) {
      toast.error('No applications to export');
      return;
    }
    
    const headers = ['App ID', 'Customer Name', 'Plan Applied', 'Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredApps.map(app => 
        [app.id, `"${app.user}"`, `"${app.plan}"`, app.date, app.status].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to Excel successfully');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Policy Applications</h1>
          <p className="text-gray-500 mt-2">Review customer requests and approve or reject policies.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search App ID or User..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lic-blue/50 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 items-center">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  filter === f 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {f === 'ALL' ? 'All Applications' : f}
              </button>
            ))}
            <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
            <button 
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400 font-medium">Loading applications...</div>
          ) : filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Filter size={48} className="mb-4 opacity-20" />
              <p>No applications match your current filters.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">App ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Plan Applied</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-lic-blue">{app.id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{app.user}</td>
                    <td className="px-6 py-4">{app.plan}</td>
                    <td className="px-6 py-4 text-gray-500">{app.date}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedApp(app)} className="p-2 text-gray-600 hover:text-lic-blue hover:bg-blue-100 rounded-lg transition-colors" title="Review Document">
                        <Eye size={18} />
                      </button>
                      {app.status === 'PENDING' && (
                        <>
                          <button onClick={() => updateStatus(app.id, 'APPROVED')} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Approve">
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => updateStatus(app.id, 'REJECTED')} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
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
      {selectedApp && (
        <ApplicationModal 
          app={selectedApp} 
          onClose={() => setSelectedApp(null)} 
          onApprove={() => updateStatus(selectedApp.id, 'APPROVED')}
          onReject={() => updateStatus(selectedApp.id, 'REJECTED')}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200'
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
}

function ApplicationModal({ app, onClose, onApprove, onReject }) {
  // Fetch full data if we only have summary, but assuming backend gave enough or we just use app.id to fetch more later.
  // For now, we simulate full data parsing
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Application Review</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Reference: <span className="text-lic-blue">{app.id}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={app.status} />
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto bg-white flex-grow">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Customer Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Applicant Name</p>
                  <p className="font-semibold text-gray-900">{app.user}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Applied Plan</p>
                  <p className="font-semibold text-gray-900">{app.plan}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Application Date</p>
                  <p className="font-semibold text-gray-900">{app.date}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Verification Documents</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <FileText size={40} className="text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700">Aadhar Card.pdf</p>
                <p className="text-xs text-gray-500 mt-1">Uploaded securely</p>
                <button className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-lic-blue hover:bg-gray-50">View Document</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-between items-center">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">
            Close
          </button>
          
          {app.status === 'PENDING' && (
            <div className="flex gap-3">
              <button onClick={onReject} className="px-6 py-2.5 rounded-xl font-bold text-red-600 bg-red-100 hover:bg-red-200 transition-colors flex items-center gap-2">
                <XCircle size={18} /> Reject
              </button>
              <button onClick={onApprove} className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
                <CheckCircle size={18} /> Approve Policy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
