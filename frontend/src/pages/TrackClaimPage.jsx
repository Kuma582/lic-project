import { useState } from 'react';
import { Search, Activity, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TrackClaimPage() {
  const [claimId, setClaimId] = useState('');
  const [status, setStatus] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!claimId) return;

    // Simulate tracking logic
    // We will show different statuses based on the last digit for demo purposes
    const lastChar = claimId.slice(-1);
    
    if (lastChar === '1') {
      setStatus({ status: 'APPROVED', date: '16 Jun 2026', message: 'Your claim has been approved and amount is transferred to registered bank account.' });
    } else if (lastChar === '2') {
      setStatus({ status: 'REJECTED', date: '15 Jun 2026', message: 'Claim rejected due to missing KYC documents. Please contact support.' });
    } else {
      setStatus({ status: 'PENDING', date: '17 Jun 2026', message: 'Your claim is currently under review by our verification team.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-lic-blue mx-auto mb-6">
            <Activity size={32} />
          </div>
          <h1 className="text-4xl font-bold text-lic-blue mb-4">Track Claim Status</h1>
          <p className="text-lg text-gray-600">
            Enter your Claim ID or Policy Number to get real-time updates on your claim application.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-8 sm:p-12">
            
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  value={claimId}
                  onChange={(e) => setClaimId(e.target.value)}
                  placeholder="Enter Claim ID (e.g. CLM-12345)" 
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none transition-all text-lg"
                />
              </div>
              <button 
                type="submit" 
                className="bg-lic-blue text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors shadow-md whitespace-nowrap"
              >
                Track Now
              </button>
            </form>

            {status && (
              <div className="border-t border-gray-100 pt-10 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Current Status for: <span className="text-lic-blue">{claimId}</span></h3>
                
                <div className={`p-6 rounded-2xl border flex items-start gap-4 ${
                  status.status === 'APPROVED' ? 'bg-green-50 border-green-200' :
                  status.status === 'REJECTED' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="mt-1">
                    {status.status === 'APPROVED' && <CheckCircle2 className="text-green-600" size={32} />}
                    {status.status === 'REJECTED' && <XCircle className="text-red-600" size={32} />}
                    {status.status === 'PENDING' && <Clock className="text-yellow-600" size={32} />}
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold mb-2 ${
                      status.status === 'APPROVED' ? 'text-green-800' :
                      status.status === 'REJECTED' ? 'text-red-800' :
                      'text-yellow-800'
                    }`}>
                      {status.status}
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-3">{status.message}</p>
                    <p className="text-sm font-medium text-gray-500">Last Updated: {status.date}</p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4">Have questions regarding your claim?</p>
                  <Link to="/contact" className="text-lic-blue font-bold hover:underline">Contact our Support Team</Link>
                </div>
              </div>
            )}

          </div>
        </div>
        
      </div>
    </div>
  );
}
