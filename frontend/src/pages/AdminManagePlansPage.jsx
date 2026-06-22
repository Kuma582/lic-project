import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import { apiCall } from '../api';

export default function AdminManagePlansPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [plans, setPlans] = useState([]);
  
  // New Plan State
  const [newPlan, setNewPlan] = useState({
    name: '', description: '', category: 'Endowment Plan', premium: '',
    ageEligibility: '', policyTerm: '', sumAssuredRange: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const response = await apiCall('/plans');
    if (response.status === 'success') {
      setPlans(response.data);
    }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    const response = await apiCall('/plans', 'POST', newPlan);
    
    if (response.status === 'success') {
      setPlans([...plans, response.data]);
      setIsModalOpen(false);
      setShowSuccess(true);
      setNewPlan({
        name: '', description: '', category: 'Endowment Plan', premium: '',
        ageEligibility: '', policyTerm: '', sumAssuredRange: ''
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert(response.message || 'Error adding plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      const response = await apiCall(`/plans/${id}`, 'DELETE');
      if (response.status === 'success') {
        setPlans(plans.filter(p => p.id !== id));
      } else {
        alert(response.message);
      }
    }
  };

  return (
    <div className="relative">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Plans</h1>
          <p className="text-gray-600 mt-1">Add, edit, or remove insurance plans from the platform.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-lic-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus size={20} />
          Add New Plan
        </button>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} className="text-green-600" />
          <span className="font-bold">Success!</span> Plan has been added successfully.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search plans..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lic-blue"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Plan ID</th>
                <th className="px-6 py-4 font-semibold">Plan Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Starting Premium</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{plan.id.substring(0,8)}...</td>
                  <td className="px-6 py-4 font-bold text-lic-blue">{plan.name}</td>
                  <td className="px-6 py-4">{plan.category}</td>
                  <td className="px-6 py-4">{plan.premium}</td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button onClick={() => handleDelete(plan.id)} className="p-2 text-red-600 hover:bg-red-50 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all" title="Delete Plan">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No plans found. Add one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">Add New Plan</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="addPlanForm" onSubmit={handleAddPlan} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                    <input required type="text" value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none" placeholder="e.g. Jeevan Anand" />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea required rows="3" value={newPlan.description} onChange={e => setNewPlan({...newPlan, description: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none" placeholder="Short description of the plan..."></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={newPlan.category} onChange={e => setNewPlan({...newPlan, category: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none">
                      <option>Endowment Plan</option>
                      <option>Whole Life Plan</option>
                      <option>Term Assurance</option>
                      <option>Child Plan</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Starting Premium</label>
                    <input required type="text" value={newPlan.premium} onChange={e => setNewPlan({...newPlan, premium: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none" placeholder="e.g. ₹2,500/month" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age Eligibility</label>
                    <input required type="text" value={newPlan.ageEligibility} onChange={e => setNewPlan({...newPlan, ageEligibility: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none" placeholder="e.g. 18-50 Years" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Term</label>
                    <input required type="text" value={newPlan.policyTerm} onChange={e => setNewPlan({...newPlan, policyTerm: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none" placeholder="e.g. 15-35 Years" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sum Assured Range</label>
                    <input required type="text" value={newPlan.sumAssuredRange} onChange={e => setNewPlan({...newPlan, sumAssuredRange: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none" placeholder="e.g. ₹5,00,000 - ₹50,00,000" />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                type="button" 
                className="px-6 py-2.5 rounded-lg font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="addPlanForm"
                className="px-6 py-2.5 rounded-lg font-bold text-white bg-lic-blue hover:bg-blue-800 shadow-md transition-colors"
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
