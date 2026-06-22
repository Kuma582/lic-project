import { CheckCircle2, FileText, Printer, X } from 'lucide-react';

export default function PaymentReceipt({ payment, policy, onClose }) {
  if (!payment || !policy) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative print:shadow-none print:max-w-full">
        {/* Close Button (Hidden on Print) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 print:hidden"
        >
          <X size={24} />
        </button>

        <div className="p-8 pb-6 text-center bg-green-50 border-b border-green-100">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-sm">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Payment Successful</h2>
          <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">Transaction Receipt</p>
        </div>

        <div className="p-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <span className="text-gray-500 text-sm">Amount Paid</span>
              <span className="text-3xl font-black text-gray-900">₹{payment.amount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-sm py-2">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-bold text-gray-900">{payment.txnId || payment.id}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm py-2">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-bold text-gray-900">{new Date().toLocaleString('en-GB')}</span>
            </div>

            <div className="flex justify-between items-center text-sm py-2">
              <span className="text-gray-500">Policy Number</span>
              <span className="font-bold text-lic-blue">{policy.policyNo}</span>
            </div>

            <div className="flex justify-between items-center text-sm py-2">
              <span className="text-gray-500">Plan Name</span>
              <span className="font-bold text-gray-900 text-right max-w-[60%]">{policy.plan?.name || 'LIC Plan'}</span>
            </div>

            <div className="flex justify-between items-center text-sm py-2 border-b border-gray-100 pb-4">
              <span className="text-gray-500">Payment Mode</span>
              <span className="font-bold text-gray-900">{payment.payMode || payment.method}</span>
            </div>
          </div>

          {/* Footer Logo */}
          <div className="mt-8 text-center flex flex-col items-center justify-center">
             <div className="text-lic-blue font-black text-xl mb-1">LIC</div>
             <p className="text-xs text-gray-400">Life Insurance Corporation of India</p>
          </div>
        </div>

        {/* Print Action (Hidden on Print) */}
        <div className="p-6 pt-0 print:hidden flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Printer size={18} /> Print PDF
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-lic-blue text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
