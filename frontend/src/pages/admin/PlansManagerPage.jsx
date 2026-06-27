import { useState, useEffect } from 'react';
import { apiCall } from '../../api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';

export default function PlansManagerPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await apiCall('/plans');
      if (response.status === 'success') {
        setPlans(response.data);
      }
    } catch (error) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Insurance Plans</h1>
          <p className="text-gray-500 mt-2">Create, modify, and manage the life insurance policies offered.</p>
        </div>
        <button className="flex items-center gap-2 bg-lic-blue text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all">
          <Plus size={20} /> Add New Plan
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col group hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 p-3 rounded-xl text-lic-blue">
                  <ShieldAlert size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-gray-50 text-gray-600 hover:text-lic-blue rounded-lg transition-colors"><Edit2 size={16} /></button>
                  <button className="p-2 bg-gray-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md w-fit mb-4">
                {plan.category}
              </span>
              
              <p className="text-sm text-gray-500 line-clamp-2 flex-grow mb-6">
                {plan.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Premium</p>
                  <p className="font-bold text-gray-900">{plan.premium}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Term</p>
                  <p className="font-bold text-gray-900">{plan.policyTerm}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
