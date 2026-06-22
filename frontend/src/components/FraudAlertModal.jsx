import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function FraudAlertModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the alert has already been shown in this session
    const hasSeenAlert = sessionStorage.getItem('hasSeenFraudAlert');
    
    if (!hasSeenAlert) {
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeAlert = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenFraudAlert', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-500 animate-pulse" size={24} />
            <h2 className="text-lg font-bold text-red-700 uppercase tracking-wide">Important Security Alert</h2>
          </div>
          <button 
            onClick={closeAlert}
            className="text-red-400 hover:text-red-700 hover:bg-red-100 p-1 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Beware of Fraudulent Calls & Offers</h3>
            <h3 className="text-lg font-semibold text-gray-700 mt-1">फर्जी कॉल और ऑफर्स से सावधान रहें</h3>
          </div>
          
          <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="font-medium text-gray-800">
                <strong>LIC never calls you</strong> to ask for your bank details, OTP, PIN, or passwords.
              </p>
              <p className="text-gray-500 mt-1">
                <strong>LIC कभी भी</strong> आपको कॉल करके आपकी बैंक डिटेल्स, OTP, PIN या पासवर्ड नहीं मांगता है।
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="font-medium text-gray-800">
                Do not fall prey to spurious calls offering unsolicited bonuses, huge benefits, or asking you to surrender your existing policies.
              </p>
              <p className="text-gray-500 mt-1">
                अवांछित बोनस, भारी लाभ की पेशकश करने वाले या आपकी मौजूदा पॉलिसियों को सरेंडर करने के लिए कहने वाले फर्जी कॉल्स के झांसे में न आएं।
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-lic-blue p-4 mt-6 rounded-r-lg">
              <p className="text-lic-blue font-medium">
                If you suspect any fraud, report immediately to / किसी भी धोखाधड़ी की सूचना तुरंत दें:
                <br />
                <span className="font-bold text-xl mt-1 block">1800-425-9876</span>
              </p>
            </div>
          </div>

          <button 
            onClick={closeAlert}
            className="mt-8 w-full bg-lic-blue hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors"
          >
            I Understand / मुझे समझ आ गया
          </button>
        </div>

      </div>
    </div>
  );
}
