import { FileCheck, Search, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClaimsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-lic-blue mx-auto mb-6">
            <FileCheck size={32} />
          </div>
          <h1 className="text-4xl font-bold text-lic-blue mb-4">Claims Process</h1>
          <p className="text-lg text-gray-600">
            We understand that making a claim can be stressful. Our streamlined, digital claims process is designed to be quick, transparent, and hassle-free.
          </p>
        </div>

        {/* 3-Step Process */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How to File a Claim</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center relative group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-5 -left-5 w-12 h-12 bg-lic-gold text-lic-blue font-bold text-xl rounded-full flex items-center justify-center border-4 border-white shadow-sm">1</div>
              <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center text-lic-blue mx-auto mb-6 group-hover:bg-lic-blue group-hover:text-white transition-colors">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Intimate Claim</h3>
              <p className="text-gray-600">Notify us about the claim online or by visiting the nearest branch. Provide the policy number and basic details.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center relative group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-5 -left-5 w-12 h-12 bg-lic-gold text-lic-blue font-bold text-xl rounded-full flex items-center justify-center border-4 border-white shadow-sm">2</div>
              <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center text-lic-blue mx-auto mb-6 group-hover:bg-lic-blue group-hover:text-white transition-colors">
                <FileCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Submit Documents</h3>
              <p className="text-gray-600">Upload the required KYC documents and claim forms through our secure portal for verification.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center relative group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-5 -left-5 w-12 h-12 bg-lic-gold text-lic-blue font-bold text-xl rounded-full flex items-center justify-center border-4 border-white shadow-sm">3</div>
              <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center text-lic-blue mx-auto mb-6 group-hover:bg-lic-blue group-hover:text-white transition-colors">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Claim Settlement</h3>
              <p className="text-gray-600">Once verified, the claim amount will be directly transferred to the registered bank account.</p>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-lic-dark rounded-3xl p-10 md:p-16 text-center text-white">
          <HelpCircle size={48} className="text-lic-gold mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Need help with your claim?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
            Our dedicated claims support team is available 24/7 to guide you through the documentation and submission process.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="bg-lic-gold text-lic-blue font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-yellow-400 transition-colors">
              Contact Support
            </Link>
            <Link to="/track-claim" className="inline-block bg-transparent border-2 border-gray-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-colors">
              Track Claim Status
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
