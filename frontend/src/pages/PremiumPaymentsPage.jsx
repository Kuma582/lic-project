import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, X, QrCode } from 'lucide-react';
import { apiCall } from '../api';
import PaymentReceipt from '../components/PaymentReceipt';

export default function PremiumPaymentsPage() {
  const [history, setHistory] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState('');
  const [payMode, setPayMode] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  
  // Receipt State
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    fetchData();
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [historyRes, policiesRes] = await Promise.all([
      apiCall('/payments/history', 'GET', null, true),
      apiCall('/payments/policies', 'GET', null, true)
    ]);
    
    if (historyRes.status === 'success') setHistory(historyRes.data);
    if (policiesRes.status === 'success') setPolicies(policiesRes.data);
    setLoading(false);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedPolicyId) return alert("Please select a policy");
    
    const policy = policies.find(p => p.id === selectedPolicyId);
    if (!policy) return;

    if (!window.Razorpay) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    setProcessing(true);
    
    try {
      // 1. Create Order on Backend
      const orderRes = await apiCall('/payments/create-order', 'POST', {
        policyId: selectedPolicyId,
        amount: policy.premium
      }, true);

      if (orderRes.status !== 'success') {
        setProcessing(false);
        return alert('Failed to create payment order');
      }

      // 2. Initialize Razorpay Checkout
      const options = {
        key: 'rzp_test_dummyKeyId123', // Dummy key for frontend simulation if no real key provided
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'LIC Secure Future',
        description: `Premium Payment for ${policy.policyNo}`,
        order_id: orderRes.data.id,
        handler: async function (response) {
          // 3. Verify Payment
          const verifyRes = await apiCall('/payments/verify', 'POST', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            policyId: selectedPolicyId,
            amount: policy.premium,
            payMode: payMode
          }, true);

          if (verifyRes.status === 'success') {
            setShowPayModal(false);
            setReceiptData({
              payment: verifyRes.data,
              policy: verifyRes.data.policy
            });
            fetchData();
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'LIC Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#1e3a8a' // lic-blue
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Something went wrong with the payment gateway');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 md:px-0">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Premium Payments</h1>
          <p className="text-gray-600 mt-1">Pay your upcoming installments easily from your phone.</p>
        </div>
        <button 
          onClick={() => setShowPayModal(true)}
          className="bg-lic-gold text-lic-blue font-bold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-400 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <CreditCard size={20} />
          Pay Installment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading history...</div>
          ) : history.length === 0 ? (
             <div className="p-8 text-center text-gray-500">No payment history found.</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600 min-w-[600px]">
              <thead className="bg-gray-50 text-gray-700 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Transaction ID</th>
                  <th className="px-6 py-4 font-semibold">Policy No.</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Method</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{payment.id}</td>
                    <td className="px-6 py-4 text-lic-blue font-medium">{payment.policyNo}</td>
                    <td className="px-6 py-4">{payment.date}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{payment.amount}</td>
                    <td className="px-6 py-4">{payment.method}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-max">
                        <CheckCircle2 size={14} /> PAID
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Pay Installment</h2>
              <button onClick={() => setShowPayModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handlePayment} className="p-6">
              {policies.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  You do not have any active policies to pay for. Apply for a plan first!
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Policy</label>
                    <select 
                      required
                      value={selectedPolicyId}
                      onChange={(e) => setSelectedPolicyId(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-lic-blue focus:outline-none"
                    >
                      <option value="">-- Choose Policy --</option>
                      {policies.map(p => (
                        <option key={p.id} value={p.id}>{p.policyNo} - {p.plan?.name}</option>
                      ))}
                    </select>
                  </div>

                  {selectedPolicyId && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-sm text-blue-800">Installment Amount Due</p>
                      <p className="text-3xl font-black text-lic-blue">₹{policies.find(p => p.id === selectedPolicyId)?.premium.toLocaleString()}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {['UPI', 'Card', 'NetBanking'].map(mode => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setPayMode(mode)}
                          className={`p-3 border rounded-xl text-sm font-bold transition-all flex flex-col items-center gap-1 ${payMode === mode ? 'border-lic-blue bg-blue-50 text-lic-blue shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>

                    {/* Dynamic View based on Payment Mode */}
                    {payMode === 'UPI' && selectedPolicyId && (
                      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl flex flex-col items-center justify-center text-center animate-fade-in">
                        <p className="text-sm font-bold text-gray-800 mb-2">Pay via UPI (GPay, PhonePe, Paytm)</p>
                        <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
                          Clicking Pay will securely open the Razorpay UPI screen. 
                          <br/><br/>
                          <b>Mobile Users:</b> Your GPay/PhonePe app will open directly.
                          <br/>
                          <b>Computer Users:</b> It will ask for your UPI Number (UPI ID) or show a QR Code to scan.
                        </p>
                      </div>
                    )}

                    {payMode === 'Card' && selectedPolicyId && (
                       <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl flex flex-col items-center justify-center text-center animate-fade-in">
                         <p className="text-sm font-bold text-gray-800 mb-2">Pay via Debit / Credit Card</p>
                         <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
                           Visa, Mastercard, RuPay, and Maestro supported.
                         </p>
                       </div>
                    )}

                    {payMode === 'NetBanking' && selectedPolicyId && (
                       <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl flex flex-col items-center justify-center text-center animate-fade-in">
                         <p className="text-sm font-bold text-gray-800 mb-2">Pay via NetBanking</p>
                         <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
                           All major Indian banks supported (SBI, HDFC, ICICI, etc).
                         </p>
                       </div>
                    )}
                  </div>
                  
                  <button 
                    disabled={processing || !selectedPolicyId}
                    type="submit" 
                    className="w-full bg-lic-gold text-lic-blue font-bold py-4 rounded-xl shadow-md hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                  >
                    {processing ? 'Connecting to Secure Gateway...' : `Pay Securely via ${payMode}`}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptData && (
        <PaymentReceipt 
          payment={receiptData.payment} 
          policy={receiptData.policy} 
          onClose={() => setReceiptData(null)} 
        />
      )}
    </div>
  );
}
