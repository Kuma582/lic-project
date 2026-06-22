import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Download, ArrowRight, Activity, Clock, CreditCard } from 'lucide-react';

export default function PlanDetailsPage() {
  const { id } = useParams();

  // Mock data fetching based on ID
  const plan = {
    title: "Jeevan Anand",
    description: "A combination of whole life plan and endowment assurance plan. Provides financial protection against death throughout the lifetime of the policyholder with the provision of payment of a lump sum at the end of the selected policy term in case of his/her survival.",
    premium: "₹2,500/month",
    term: "15-35 Years",
    age: "18-50 Years",
    sumAssured: "₹5,00,000 - ₹50,00,000",
    benefits: [
      "Death Benefit: Sum Assured + Bonuses paid to nominee",
      "Survival Benefit: Basic Sum Assured + Vested Simple Reversionary Bonuses",
      "Loan Facility available after 3 years",
      "Tax Benefits under Section 80C and 10(10D)",
      "Optional Accidental Death and Disability Benefit Rider"
    ]
  };

  const handleDownloadBrochure = () => {
    const textContent = `
=============================================
         LIC PLAN BROCHURE
=============================================

Plan Name: ${plan.title}
---------------------------------------------
Description: 
${plan.description}

Eligibility & Terms:
- Premium: ${plan.premium}
- Policy Term: ${plan.term}
- Age Eligibility: ${plan.age}
- Sum Assured: ${plan.sumAssured}

Key Benefits:
${plan.benefits.map(b => "- " + b).join('\n')}

=============================================
Thank you for choosing LIC Secure Future!
=============================================
    `;
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plan.title.replace(/\s+/g, '_')}_Brochure.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-gray-500 mb-8">
          <Link to="/" className="hover:text-lic-blue">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/plans" className="hover:text-lic-blue">Plans</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{plan.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-64 sm:h-80 w-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Family Insurance" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-lic-gold text-lic-blue font-bold px-4 py-1 rounded-full shadow">
                  Bestseller
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck size={32} className="text-lic-blue" />
                  <h1 className="text-3xl font-bold text-gray-900">{plan.title}</h1>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {plan.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="bg-blue-100 p-3 rounded-lg text-lic-blue">
                      <Activity size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Age Eligibility</div>
                      <div className="font-bold text-gray-900">{plan.age}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="bg-blue-100 p-3 rounded-lg text-lic-blue">
                      <Clock size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Policy Term</div>
                      <div className="font-bold text-gray-900">{plan.term}</div>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Benefits</h2>
                <div className="space-y-4">
                  {plan.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={20} />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Pricing Card (Right) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 sticky top-28 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Premium Overview</h3>
              
              <div className="space-y-6 mb-8">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Starting Premium</div>
                  <div className="text-3xl font-bold text-lic-blue">{plan.premium}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Sum Assured Range</div>
                  <div className="text-lg font-bold text-gray-900">{plan.sumAssured}</div>
                </div>
              </div>

              <div className="space-y-4">
                <Link to="/apply" className="w-full flex items-center justify-center gap-2 bg-lic-blue text-white font-bold py-4 rounded-lg shadow hover:bg-blue-800 transition-colors">
                  Apply Now
                  <ArrowRight size={20} />
                </Link>
                <button onClick={handleDownloadBrochure} className="w-full flex items-center justify-center gap-2 bg-transparent text-lic-blue border-2 border-lic-blue font-bold py-4 rounded-lg hover:bg-blue-50 transition-colors">
                  <Download size={20} />
                  Download Brochure
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                <CreditCard size={16} /> Secure checkout process
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
