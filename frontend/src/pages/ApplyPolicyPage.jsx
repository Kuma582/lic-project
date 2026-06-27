import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Upload, CheckCircle2 } from 'lucide-react';
import { apiCall } from '../api';

export default function ApplyPolicyPage() {
  const [step, setStep] = useState(1);
  const [appRef, setAppRef] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialPlanId = searchParams.get('planId') || '';

  const [planDetails, setPlanDetails] = useState(null);
  const [payMode, setPayMode] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    if (initialPlanId) {
      apiCall(`/plans/${initialPlanId}`, 'GET').then(res => {
        if (res.status === 'success') setPlanDetails(res.data);
      });
    }
  }, [initialPlanId]);

  const [formData, setFormData] = useState({
    planId: initialPlanId,
    fullName: '',
    phone: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    address: '',
    nomineeName: '',
    nomineeRelationship: '',
    nomineeDob: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.planId) {
      setError('Please select a plan from the Plans page first.');
      return;
    }

    if (!window.Razorpay) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    setProcessing(true);

    try {
      const premiumValue = planDetails ? parseFloat(planDetails.premium.replace(/[^0-9.]/g, '')) : 2500;

      // Open Razorpay Checkout directly in Test Mode
      const options = {
        key: 'rzp_test_T6YJ52ykmdwnk7', // User's real test key
        amount: Math.round(premiumValue * 100), // amount in paise
        currency: 'INR',
        name: 'LIC Secure Future',
        description: `Initial Premium for ${planDetails?.name || 'Policy'}`,
        handler: async function (response) {
          const finalFormData = {
             ...formData, 
             payment: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id || `order_${Math.random().toString(36).substr(2, 9)}`,
                amount: premiumValue,
                payMode: payMode
             }
          };
          
          setTransactionId(response.razorpay_payment_id);

          const appResponse = await apiCall('/applications', 'POST', {
            planId: formData.planId,
            formData: finalFormData
          });

          if (appResponse.status === 'success') {
            setAppRef(appResponse.data.appReference);
            setStep(5);
          } else {
            setError(appResponse.message || 'Failed to submit application after payment.');
          }
          setProcessing(false);
        },
        prefill: {
          name: formData.fullName,
          email: 'customer@example.com',
          contact: formData.phone || '9999999999'
        },
        theme: { color: '#1e3a8a' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert(`Payment Failed: ${response.error.description}`);
        setProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Something went wrong with the payment gateway');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <Link to="/plans" className="text-lic-blue font-medium flex items-center gap-2 mb-4 hover:underline">
            <ArrowLeft size={16} /> Back to Plans
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShieldCheck className="text-lic-gold" size={36} />
            Apply for Policy
          </h1>
        </div>

        {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">{error}</div>}

        {/* Multi-step Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">

          {/* Step Indicator */}
          <div className="flex border-b border-gray-100">
            <div className={`flex-1 text-center py-4 text-sm font-bold border-b-2 ${step >= 1 ? 'border-lic-blue text-lic-blue bg-blue-50/50' : 'border-transparent text-gray-400'}`}>
              1. Personal Details
            </div>
            <div className={`flex-1 text-center py-4 text-sm font-bold border-b-2 ${step >= 2 ? 'border-lic-blue text-lic-blue bg-blue-50/50' : 'border-transparent text-gray-400'}`}>
              2. Nominee Details
            </div>
            <div className={`flex-1 text-center py-4 text-sm font-bold border-b-2 ${step >= 3 ? 'border-lic-blue text-lic-blue bg-blue-50/50' : 'border-transparent text-gray-400'}`}>
              3. Upload Docs
            </div>
            <div className={`flex-1 text-center py-4 text-sm font-bold border-b-2 ${step >= 4 ? 'border-lic-blue text-lic-blue bg-blue-50/50' : 'border-transparent text-gray-400'}`}>
              4. Make Payment
            </div>
            <div className={`flex-1 text-center py-4 text-sm font-bold border-b-2 ${step === 5 ? 'border-lic-blue text-lic-blue bg-blue-50/50' : 'border-transparent text-gray-400'}`}>
              5. Form Summary
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 sm:p-12">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none" placeholder="As per Aadhaar" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none" placeholder="10-digit mobile number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none">
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none" rows="3"></textarea>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Nominee Details</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Full Name</label>
                    <input type="text" name="nomineeName" value={formData.nomineeName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <select name="nomineeRelationship" value={formData.nomineeRelationship} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none">
                      <option value="">Select Relationship</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" name="nomineeDob" value={formData.nomineeDob} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Document Upload</h3>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Aadhaar Card (Front & Back)</h4>
                    <p className="text-sm text-gray-500 mb-4">PDF, JPG, or PNG (Max 5MB)</p>
                    <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 cursor-pointer inline-block">
                      Browse Files
                      <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
                    </label>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-bold text-gray-900 mb-1">PAN Card</h4>
                    <p className="text-sm text-gray-500 mb-4">PDF, JPG, or PNG (Max 5MB)</p>
                    <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 cursor-pointer inline-block">
                      Browse Files
                      <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-blue-100 text-lic-blue rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Make Payment</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">Please pay the first premium amount to complete your application.</p>

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8 max-w-md mx-auto flex justify-between items-center">
                    <span className="text-gray-900 font-bold text-lg">First Premium Due:</span>
                    <span className="font-black text-green-600 text-2xl">{planDetails?.premium || '₹2,500'}</span>
                  </div>


                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={50} />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">Application Submitted!</h3>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center max-w-sm mx-auto mb-8">
                    <p className="text-sm text-gray-600 mb-1">Application Reference Number</p>
                    <p className="text-2xl font-black text-lic-blue tracking-wider">{appRef}</p>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Form Summary (Receipt)</h3>
                  <div className="bg-white rounded-xl p-6 text-left border border-gray-200 mb-8 max-w-2xl mx-auto shadow-sm">
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Applicant Name:</span><span className="font-bold text-gray-900">{formData.fullName}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Mobile Number:</span><span className="font-bold text-gray-900">{formData.phone}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Nominee Name:</span><span className="font-bold text-gray-900">{formData.nomineeName}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Selected Plan:</span><span className="font-bold text-lic-blue">{planDetails?.name}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Transaction ID:</span><span className="font-bold text-gray-900">{transactionId}</span></div>
                      <div className="flex justify-between pt-2"><span className="text-gray-900 font-bold">Total Paid:</span><span className="font-black text-green-600 text-lg">{planDetails?.premium || '₹2,500'}</span></div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-8">Our team will verify your documents and send policy papers to your email.</p>

                  <Link to="/track-claim" className="inline-block px-8 py-3 bg-lic-blue text-white rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-md">
                    Track Application Status
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Buttons (Hide on Success Screen) */}
            {step < 5 && (
              <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${step === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-lic-blue border border-lic-blue hover:bg-blue-50 transition-colors'}`}
                >
                  <ArrowLeft size={18} /> Back
                </button>

                {step < 4 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="px-8 py-3 bg-lic-blue text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors shadow-md"
                  >
                    Save & Next <ArrowRight size={18} />
                  </button>
                ) : (
                  <button disabled={processing} onClick={handleSubmit} className="px-8 py-3 bg-lic-gold text-lic-blue rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-md disabled:opacity-50">
                    {processing ? 'Processing Payment...' : 'Pay & Submit Application'}
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
