import { useState, useEffect } from 'react';
import { ShieldCheck, HeartHandshake, Award, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiCall } from '../api';

export default function LandingPage() {
  const [featuredPlans, setFeaturedPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiCall('/plans');
        if (response.status === 'success') {
          // Take the first 3 plans to feature on the landing page
          setFeaturedPlans(response.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch featured plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-lic-blue text-white py-20 lg:py-32 overflow-hidden">
        {/* Abstract Background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-800 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-lic-gold opacity-20 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-900/50 border border-blue-700 text-lic-gold font-medium text-sm tracking-wide">
                #1 Trusted Insurance Provider
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Secure Your <span className="text-lic-gold">Family's Future</span> Today
              </h1>
              <p className="text-lg lg:text-xl text-gray-300 max-w-lg leading-relaxed">
                Life is unpredictable, but your family's financial security doesn't have to be. Discover plans tailored for every stage of your life.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/plans" className="bg-lic-gold text-lic-blue font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-all transform hover:-translate-y-1">
                  Explore Plans
                </Link>
                <Link to="/contact" className="bg-transparent border-2 border-white/30 text-white font-medium px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
                  Talk to an Advisor
                </Link>
              </div>
              
              <div className="pt-8 flex items-center gap-8 border-t border-blue-800/50">
                <div>
                  <div className="text-3xl font-bold text-white">250M+</div>
                  <div className="text-sm text-gray-400 mt-1">Lives Insured</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">99.8%</div>
                  <div className="text-sm text-gray-400 mt-1">Claim Settlement</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image / Illustration */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-lic-gold/20 to-transparent rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Happy Family" 
                className="rounded-3xl shadow-2xl relative z-10 object-cover h-[500px] w-full border-4 border-white/10"
              />
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Verified by</div>
                  <div className="text-sm font-bold text-gray-900">Govt. Regulations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-24 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose LIC?</h2>
            <p className="text-lg text-gray-600">We provide more than just insurance; we offer peace of mind with a legacy of trust and commitment.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-100 text-lic-blue rounded-xl flex items-center justify-center mb-6 group-hover:bg-lic-blue group-hover:text-white transition-colors">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trusted Company</h3>
              <p className="text-gray-600 leading-relaxed">
                Over 6 decades of unparalleled trust and commitment to our policyholders across the nation.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-2xl hover:border-yellow-100 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-lic-gold group-hover:text-white transition-colors">
                <HeartHandshake size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Future</h3>
              <p className="text-gray-600 leading-relaxed">
                Guaranteed returns and comprehensive coverage to ensure your family's financial independence.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-100 text-lic-blue rounded-xl flex items-center justify-center mb-6 group-hover:bg-lic-blue group-hover:text-white transition-colors">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Best Plans</h3>
              <p className="text-gray-600 leading-relaxed">
                A wide variety of plans customized for child education, retirement, and whole life coverage.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-2xl hover:border-yellow-100 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-lic-gold group-hover:text-white transition-colors">
                <Activity size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Claim Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Industry-leading claim settlement ratio with a hassle-free, fully digital processing system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Plans Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Popular Insurance Plans</h2>
              <p className="text-lg text-gray-600">Discover our most trusted plans chosen by millions of families.</p>
            </div>
            <Link to="/plans" className="hidden md:flex items-center gap-2 text-lic-blue font-bold hover:text-blue-800 transition-colors">
              View All Plans
              <ArrowRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading plans...</div>
          ) : featuredPlans.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No featured plans available at the moment.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col">
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
                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
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
                    </div>
                  </div>
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
          
          <div className="mt-10 md:hidden flex justify-center">
            <Link to="/plans" className="flex items-center gap-2 text-lic-blue font-bold hover:text-blue-800 transition-colors">
              View All Plans
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
