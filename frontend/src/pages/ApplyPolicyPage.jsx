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

  const [formData, setFormData] = useState({
    planId: initialPlanId,
    fullName: '',
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

    const response = await apiCall('/applications', 'POST', {
      planId: formData.planId,
      formData: formData
    });

    if (response.status === 'success') {
      setAppRef(response.data.appReference);
      setStep(5);
    } else {
      setError(response.message || 'Failed to submit application.');
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
            <div className={`flex-1 text-center py-4 text-sm font-bold border-b-2 ${step === 4 ? 'border-lic-blue text-lic-blue bg-blue-50/50' : 'border-transparent text-gray-400'}`}>
              4. Form Summary
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
                      <option value="Spouse">Father</option>
                      <option value="Child">Mother</option>
                      <option value="Parent">Son</option>
                      <option value="Sibling">Daughter</option>
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
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Review & Submit</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">Please review all the information provided before submitting your application. By clicking submit, you agree to our Terms and Conditions.</p>

                  <div className="bg-gray-50 rounded-xl p-6 text-left border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Summary</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Applicant:</span><span className="font-bold">{formData.fullName || 'Not provided'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Nominee:</span><span className="font-bold">{formData.nomineeName || 'Not provided'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Documents:</span><span className="font-bold text-green-600">To be verified</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={50} />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h3>
                  <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    Your policy application has been submitted successfully. Our team will review your documents and contact you shortly.
                  </p>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-left max-w-sm mx-auto mb-8">
                    <p className="text-sm text-gray-500 mb-1">Application Reference Number</p>
                    <p className="text-2xl font-bold text-lic-blue tracking-wider">{appRef}</p>
                  </div>

                  <Link to="/track-claim" className="inline-block px-8 py-3 bg-lic-blue text-white rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-md">
                    Track Status
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
                  <button onClick={handleSubmit} className="px-8 py-3 bg-lic-gold text-lic-blue rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-md">
                    Submit Application
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
