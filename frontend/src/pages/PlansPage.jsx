import { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiCall } from '../api';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await apiCall('/plans');
      if (response.status === 'success') {
        setPlans(response.data);
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-lic-blue mb-4">Our Insurance Plans</h1>
          <p className="text-lg text-gray-600">
            Explore our comprehensive range of life insurance plans designed to protect your family's future and help you achieve your financial goals.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xl font-bold">No plans available at the moment. Please check back later.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col">

            {/* Card Top */}
            <div className="p-8 pb-6 flex-grow">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-50 p-4 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <ShieldCheck size={32} className="text-lic-blue" />
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {plan.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{plan.name}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {plan.description}
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Starting Premium</span>
                  <span className="font-bold text-gray-900">{plan.premium}</span>
                </div>
                <div className="flex justify-between text-sm pb-2">
                  <span className="text-gray-500">Policy Term</span>
                  <span className="font-bold text-gray-900">{plan.policyTerm}</span>
                </div>
                <div className="flex justify-between text-sm pb-2">
                  <span className="text-gray-500">Age Eligibility</span>
                  <span className="font-bold text-gray-900">{plan.ageEligibility}</span>
                </div>
              </div>
            </div>

            {/* Card Bottom / Action */}
            <div className="p-6 pt-0 mt-auto">
              <Link to={`/apply?planId=${plan.id}`} className="w-full flex items-center justify-center gap-2 bg-gray-50 text-lic-blue font-bold py-3 rounded-lg border border-gray-200 group-hover:bg-lic-blue group-hover:text-white transition-colors">
                Apply Now
                <ArrowRight size={18} />
              </Link>
            </div>

          </div>
        ))}
      </div>
        )}

    </div>
    </div >
  );
}
