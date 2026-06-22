import { useState } from 'react';
import { Calculator, IndianRupee, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PremiumCalculatorPage() {
  const [age, setAge] = useState('');
  const [term, setTerm] = useState('');
  const [sumAssured, setSumAssured] = useState('');
  const [calculatedPremium, setCalculatedPremium] = useState(null);

  const calculatePremium = (e) => {
    e.preventDefault();
    if (!age || !term || !sumAssured) return;

    // Simple mock formula for demonstration
    // Base rate * Age factor / term
    const baseRate = parseInt(sumAssured) * 0.05;
    const ageFactor = parseInt(age) > 40 ? 1.5 : 1.1;
    const yearly = (baseRate * ageFactor) / parseInt(term);
    const monthly = yearly / 12;

    setCalculatedPremium({
      monthly: Math.round(monthly).toLocaleString('en-IN'),
      yearly: Math.round(yearly).toLocaleString('en-IN')
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-lic-blue mx-auto mb-6">
            <Calculator size={32} />
          </div>
          <h1 className="text-4xl font-bold text-lic-blue mb-4">Premium Calculator</h1>
          <p className="text-lg text-gray-600">
            Estimate your life insurance premium in seconds. Plan your finances better with our accurate premium estimator.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Calculator Form */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-100">
            <form onSubmit={calculatePremium} className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Policy Plan</label>
                <select className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none transition-all bg-gray-50">
                  <option>Jeevan Anand (Endowment Plan)</option>
                  <option>Jeevan Umang (Whole Life Plan)</option>
                  <option>Jeevan Tarun (Child Plan)</option>
                  <option>Jeevan Labh</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Age (Years)</label>
                  <input 
                    type="number" 
                    required
                    min="18"
                    max="65"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none transition-all bg-gray-50" 
                    placeholder="e.g. 30" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Policy Term (Years)</label>
                  <input 
                    type="number" 
                    required
                    min="10"
                    max="40"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none transition-all bg-gray-50" 
                    placeholder="e.g. 20" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sum Assured (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="number" 
                    required
                    min="100000"
                    step="50000"
                    value={sumAssured}
                    onChange={(e) => setSumAssured(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none transition-all bg-gray-50" 
                    placeholder="e.g. 1000000" 
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Minimum sum assured is ₹1,00,000.</p>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-lic-blue text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg mt-4 flex justify-center items-center gap-2"
              >
                Calculate Premium <Calculator size={20} />
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div>
            {calculatedPremium ? (
              <div className="bg-gradient-to-br from-lic-blue to-blue-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                  <Calculator size={250} />
                </div>
                
                <h3 className="text-2xl font-bold mb-8 text-lic-gold">Estimated Premium</h3>
                
                <div className="space-y-8 relative z-10">
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                    <p className="text-blue-200 font-medium mb-1">Monthly Premium</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">₹</span>
                      <span className="text-5xl font-extrabold tracking-tight">{calculatedPremium.monthly}</span>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                    <p className="text-blue-200 font-medium mb-1">Yearly Premium</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">₹</span>
                      <span className="text-3xl font-bold tracking-tight">{calculatedPremium.yearly}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-blue-800/50 flex flex-col sm:flex-row gap-4 relative z-10">
                  <Link to="/apply" className="flex-1 bg-lic-gold text-lic-blue font-bold py-3 rounded-xl text-center hover:bg-yellow-400 transition-colors shadow-lg">
                    Apply Now
                  </Link>
                  <Link to="/plans" className="flex-1 bg-transparent border-2 border-white/30 text-white font-bold py-3 rounded-xl text-center hover:bg-white/10 transition-colors">
                    Explore Plans
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-3xl p-10 h-full flex flex-col items-center justify-center text-center border border-dashed border-gray-300">
                <ShieldCheck size={64} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-500 mb-2">No Estimate Yet</h3>
                <p className="text-gray-400 max-w-sm">
                  Fill in the details in the calculator to instantly see your estimated monthly and yearly premiums.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
