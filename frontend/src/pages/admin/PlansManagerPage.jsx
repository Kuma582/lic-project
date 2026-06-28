import { useState, useEffect } from 'react';
import { apiCall } from '../../api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, ShieldAlert, X } from 'lucide-react';

export default function PlansManagerPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Endowment',
    description: '',
    premium: '',
    policyTerm: '',
    ageEligibility: '18 - 60 Years',
    sumAssuredRange: '₹1 Lakh - No Limit'
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    try {
      const response = await apiCall('/plans');
      if (response.status === 'success') {
        setPlans(response.data);
      }
    } catch (error) { 
      console.error(error);
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  }

  const handleAddPlan = async (e) => {
    e.preventDefault();
    try {
      const response = await apiCall('/plans', 'POST', formData);
      if (response.status === 'success') {
        toast.success('Plan added successfully!');
        setPlans([...plans, response.data]);
        setIsModalOpen(false);
        setFormData({
          name: '',
          category: 'Endowment',
          description: '',
          premium: '',
          policyTerm: '',
          ageEligibility: '18 - 60 Years',
          sumAssuredRange: '₹1 Lakh - No Limit'
        });
      } else {
        toast.error(response.message || 'Failed to add plan');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error while adding plan');
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      const response = await apiCall(`/plans/${id}`, 'DELETE');
      if (response.status === 'success') {
        toast.success('Plan deleted successfully!');
        setPlans(plans.filter(p => p.id !== id));
      } else {
        toast.error(response.message || 'Failed to delete plan');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error while deleting plan');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 relative">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Insurance Plans</h1>
          <p className="text-gray-500 mt-2">Create, modify, and manage the life insurance policies offered.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-lic-blue text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all"
        >
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
                  <button className="p-2 bg-gray-50 text-gray-600 hover:text-lic-blue rounded-lg transition-colors" title="Edit Plan"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeletePlan(plan.id)} className="p-2 bg-gray-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors" title="Delete Plan"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md w-fit mb-4">
                {plan.category}
              </span>
              
              <p className="text-sm text-gray-500 line-clamp-2 flex-grow mb-6" title={plan.description}>
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

      {/* Add Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Insurance Plan</h2>
                <p className="text-xs text-gray-500 mt-1">Fill out the details to create a new policy plan.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddPlan} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Plan Name</label>
                  <input 
                    type="text" required
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lic-blue/50 outline-none"
                    placeholder="e.g. LIC Jeevan Anand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lic-blue/50 outline-none"
                  >
                    <option value="Endowment">Endowment</option>
                    <option value="Term Life">Term Life</option>
                    <option value="Whole Life">Whole Life</option>
                    <option value="Health">Health</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  required rows="3"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lic-blue/50 outline-none resize-none"
                  placeholder="Describe the plan benefits and features..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Premium Details</label>
                  <input 
                    type="text" required
                    value={formData.premium} onChange={e => setFormData({...formData, premium: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lic-blue/50 outline-none"
                    placeholder="e.g. ₹2,500/month"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Policy Term</label>
                  <input 
                    type="text" required
                    value={formData.policyTerm} onChange={e => setFormData({...formData, policyTerm: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lic-blue/50 outline-none"
                    placeholder="e.g. 15 - 35 Years"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Age Eligibility</label>
                  <input 
                    type="text" required
                    value={formData.ageEligibility} onChange={e => setFormData({...formData, ageEligibility: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lic-blue/50 outline-none"
                    placeholder="e.g. 18 - 60 Years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sum Assured Range</label>
                  <input 
                    type="text" required
                    value={formData.sumAssuredRange} onChange={e => setFormData({...formData, sumAssuredRange: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lic-blue/50 outline-none"
                    placeholder="e.g. ₹1 Lakh - No Limit"
                  />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-lic-blue text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
                  Publish Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
