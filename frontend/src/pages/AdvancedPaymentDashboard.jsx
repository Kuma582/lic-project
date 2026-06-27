import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ShieldCheck, Activity, Search, Filter, ArrowUpDown, Download, Printer, 
  Smartphone, Wallet, Building, CheckCircle2, XCircle, Bell, Receipt, TrendingUp, Calendar, Lock 
} from 'lucide-react';

import toast, { Toaster } from 'react-hot-toast';

import { apiCall } from '../api';

export default function AdvancedPaymentDashboard() {
  const [activeTab, setActiveTab] = useState('pay');
  const [darkMode, setDarkMode] = useState(false);
  
  const [policies, setPolicies] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    try {
      const polRes = await apiCall('/payments/policies', 'GET', null, true);
      if (polRes.status === 'success') {
        const formattedPol = polRes.data.map(p => {
          const dueDate = new Date(p.nextDueDate);
          const isOverdue = dueDate < new Date();
          return {
            id: p.id,
            policyNo: p.policyNo,
            name: p.plan ? p.plan.name : 'Unknown',
            type: p.plan ? p.plan.category : 'Plan',
            premium: p.premium,
            due: dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            rawDueDate: dueDate,
            status: isOverdue ? 'Overdue' : 'Pending'
          };
        });
        setPolicies(formattedPol);
      }

      const histRes = await apiCall('/payments/history', 'GET', null, true);
      if (histRes.status === 'success') {
        setHistory(histRes.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    // Load Razorpay for real payment
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);
  
  // States for Policy Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  
  // States for Payment Flow
  const [payMethod, setPayMethod] = useState('UPI');
  const [paymentStep, setPaymentStep] = useState(0); // 0: select, 1: details, 2: OTP, 3: Success/Fail
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' or 'error'
  const [lastTxnId, setLastTxnId] = useState('');

  const handleDownloadReceipt = (txnDetails) => {
    const receiptContent = `
=========================================
      LIC SECURE FUTURE - RECEIPT
=========================================
Transaction ID : ${txnDetails.txnId || 'N/A'}
Policy Number  : ${txnDetails.policyNo || 'N/A'}
Amount Paid    : Rs. ${txnDetails.amount || 'N/A'}
Date & Time    : ${txnDetails.date || new Date().toLocaleString()}
Status         : SUCCESS
=========================================
      Thank you for choosing LIC!
=========================================
    `;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LIC_Receipt_${txnDetails.policyNo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Receipt Downloaded Successfully!');
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handlePay = () => {
    if (!selectedPolicy) return toast.error('Please select a policy to pay');
    setPaymentStep(1);
    setActiveTab('pay');
  };

  const processPayment = async () => {
    if (!window.Razorpay) {
      return toast.error('Razorpay SDK failed to load. Are you online?');
    }
    
    setIsProcessing(true);
    try {
      // Open Razorpay Checkout Modal directly (Test Mode)
      const options = {
        key: 'rzp_test_T6YJ52ykmdwnk7', // User's real test key
        amount: Math.round(selectedPolicy.premium * 100), // amount in paise
        currency: 'INR',
        name: 'LIC Secure Future',
        description: `Premium Payment for ${selectedPolicy.policyNo}`,
        handler: async function (response) {
          // Verify Payment Signature on backend
          const verifyRes = await apiCall('/payments/verify', 'POST', {
            razorpay_order_id: response.razorpay_order_id || `order_${Math.random().toString(36).substr(2, 9)}`,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            policyId: selectedPolicy.id,
            amount: selectedPolicy.premium,
            payMode: payMethod
          }, true);

          if (verifyRes.status === 'success') {
            setLastTxnId(response.razorpay_payment_id);
            setPaymentStep(3);
            setPaymentStatus('success');
            toast.success('Payment completed successfully!');
            fetchData(); // Refresh policies and history
          } else {
            toast.error('Payment Verification Failed');
          }
          setIsProcessing(false);
        },
        prefill: {
          name: 'LIC Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#1e3a8a'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        toast.error(`Payment Failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during payment');
      setIsProcessing(false);
    }
  };

  const renderPolicySelection = () => (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-sm overflow-hidden`}>
        <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Select Policy to Pay</h3>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search policy..." 
                className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-200 focus:ring-blue-100'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className={`p-2 rounded-xl border transition-colors ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-200 hover:bg-gray-100 text-gray-600'}`}>
              <Filter size={20} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className={`uppercase text-xs font-bold ${darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
              <tr>
                <th className="px-6 py-4">Policy No.</th>
                <th className="px-6 py-4">Plan Name</th>
                <th className="px-6 py-4">Premium</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {policies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No active policies found. Please apply for a policy from the Plans section first.
                  </td>
                </tr>
              ) : (
                policies.filter(p => 
                  (p.policyNo && p.policyNo.toLowerCase().includes(searchQuery.toLowerCase())) || 
                  (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                ).map((policy) => (
                <tr key={policy.id} className={`transition-colors ${selectedPolicy?.id === policy.id ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-50') : (darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50')}`}>
                  <td className={`px-6 py-4 font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{policy.policyNo}</td>
                  <td className={`px-6 py-4 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{policy.name || 'Unknown'} <span className="text-xs text-gray-400 block">{policy.type || 'Plan'}</span></td>
                  <td className={`px-6 py-4 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{policy.premium}</td>
                  <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{policy.due}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      policy.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                      policy.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setSelectedPolicy(policy); setPaymentStep(0); }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        selectedPolicy?.id === policy.id 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                          : `${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`
                      }`}
                    >
                      {selectedPolicy?.id === policy.id ? 'Selected' : 'Select'}
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        {selectedPolicy && (
          <div className={`p-4 border-t flex justify-end ${darkMode ? 'border-gray-700 bg-gray-800/80' : 'border-gray-100 bg-gray-50'}`}>
            <button onClick={handlePay} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-transform flex items-center gap-2">
              Proceed to Pay ₹{selectedPolicy.premium} <ArrowUpDown size={18} className="rotate-90" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );

  const renderPaymentFlow = () => (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Col: Form/Process */}
      <div className="lg:col-span-2 space-y-6">
        <AnimatePresence mode="wait">
          {paymentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-lg`}>
              <div className="flex items-center justify-between mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
                <h2 className={`text-2xl font-bold flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <ShieldCheck className="text-emerald-500" size={28} />
                  Secure Checkout
                </h2>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  <Lock size={12} /> 256-BIT ENCRYPTION
                </div>
              </div>

              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Review Payment Details</h3>
              <div className={`p-6 rounded-xl mb-8 space-y-4 ${darkMode ? 'bg-gray-700/30 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex justify-between border-b pb-3 border-gray-200 dark:border-gray-600">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Policy Holder</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>LIC Customer</span>
                </div>
                <div className="flex justify-between border-b pb-3 border-gray-200 dark:border-gray-600">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Policy Number</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedPolicy.policyNo}</span>
                </div>
                <div className="flex justify-between border-b pb-3 border-gray-200 dark:border-gray-600">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Selected Plan</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedPolicy.name}</span>
                </div>
                <div className="flex justify-between border-b pb-3 border-gray-200 dark:border-gray-600">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Due Date</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedPolicy.due}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Amount Payable</span>
                  <span className={`font-black text-lg text-blue-600 dark:text-blue-400`}>₹{selectedPolicy.premium}</span>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button onClick={() => setPaymentStep(0)} className={`font-bold ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Cancel</button>
                <button 
                  disabled={isProcessing}
                  onClick={processPayment} 
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                >
                  {isProcessing ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}><Activity size={18} /></motion.div> Processing...</>
                  ) : 'Pay Now Securely'}
                </button>
              </div>
            </motion.div>
          )}



          {paymentStep === 3 && paymentStatus === 'success' && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`p-10 rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-lg text-center relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }} className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={50} />
              </motion.div>
              <h2 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Payment Successful!</h2>
              <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your transaction has been processed securely.</p>
              
              <div className={`p-6 rounded-xl text-left mb-8 space-y-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex justify-between border-b pb-3 border-gray-200 dark:border-gray-600">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Transaction ID</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{lastTxnId || 'TXN-839401284'}</span>
                </div>
                <div className="flex justify-between border-b pb-3 border-gray-200 dark:border-gray-600">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Policy No.</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedPolicy.policyNo}</span>
                </div>
                <div className="flex justify-between border-b pb-3 border-gray-200 dark:border-gray-600">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Amount Paid</span>
                  <span className={`font-black text-emerald-600`}>₹{selectedPolicy.premium}</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Date & Time</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => handleDownloadReceipt({ txnId: lastTxnId || 'TXN-839401284', policyNo: selectedPolicy.policyNo, amount: selectedPolicy.premium, date: new Date().toLocaleString() })}
                  className={`flex-1 py-3 rounded-xl font-bold border transition-colors flex items-center justify-center gap-2 ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-white' : 'border-gray-200 hover:bg-gray-50 text-gray-800'}`}>
                  <Download size={18} /> Download Receipt
                </button>
                <button onClick={() => { setPaymentStep(0); setActiveTab('dashboard'); }} className="flex-1 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Col: Summary Card */}
      <div className="lg:col-span-1">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`sticky top-24 p-6 rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-b from-blue-50 to-white border-blue-100'} border shadow-xl`}>
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/40">
            <Receipt size={24} />
          </div>
          <h3 className={`text-xl font-black mb-6 ${darkMode ? 'text-white' : 'text-blue-950'}`}>Payment Summary</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Base Premium</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{selectedPolicy?.premium || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Late Fee</span>
              <span className={`font-bold text-rose-500`}>₹0</span>
            </div>
            <div className="flex justify-between border-b pb-4 border-gray-200 dark:border-gray-700">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>GST (18%)</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{Math.round((selectedPolicy?.premium || 0) * 0.18)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className={`font-bold text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Total Payable</span>
              <span className={`font-black text-2xl text-blue-600 dark:text-blue-400`}>₹{Math.round((selectedPolicy?.premium || 0) * 1.18)}</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl flex items-start gap-3 ${darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-blue-100/50 text-blue-800'}`}>
            <ShieldCheck className="shrink-0 mt-0.5" size={18} />
            <p className="text-xs font-medium leading-relaxed">
              Your payments are secured by bank-grade 256-bit SSL encryption. We do not store your card details.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-sm`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transaction History</h3>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm border transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          <Download size={16} /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className={`uppercase text-xs font-bold ${darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Policy No.</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {history.map((txn, i) => (
              <tr key={i} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{txn.id}</td>
                <td className={`px-6 py-4 font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{txn.policyNo}</td>
                <td className={`px-6 py-4 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{txn.amount}</td>
                <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{txn.method}</td>
                <td className={`px-6 py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{txn.date} <span className="text-xs ml-1 opacity-70">{txn.time}</span></td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    txn.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {txn.status === 'Success' && (
                    <button 
                      onClick={() => handleDownloadReceipt({ txnId: txn.id, policyNo: txn.policyNo, amount: txn.amount, date: `${txn.date} ${txn.time || ''}` })}
                      className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
                      <Printer size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-slate-50 text-gray-900'}`}>
      <Toaster position="top-right" />
      
      {/* Top Navigation */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/30">
              ₹
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight">LIC Premium<span className="text-blue-500">Pay</span></h1>
              <p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Advanced Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-full relative transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <Bell size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'border-gray-200 bg-white hover:bg-gray-50 text-indigo-600'}`}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-200/50 dark:bg-gray-800/50 p-1 rounded-xl mb-8 w-max">
          {[
            { id: 'pay', label: 'Make Payment', icon: <CreditCard size={16} /> },
            { id: 'history', label: 'History & Receipts', icon: <Receipt size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if(tab.id==='pay') setPaymentStep(0); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? `${darkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-blue-700 shadow-sm'}` 
                  : `${darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'pay' && (!selectedPolicy || paymentStep === 0 ? renderPolicySelection() : renderPaymentFlow())}
            {activeTab === 'history' && renderHistory()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
