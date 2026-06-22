import { useLocation } from 'react-router-dom';
import { ShieldCheck, FileText, AlertTriangle, HelpCircle, FileWarning } from 'lucide-react';

export default function LegalPage() {
  const location = useLocation();
  const path = location.pathname;

  let content = {
    title: "",
    icon: null,
    sections: []
  };

  if (path === '/terms') {
    content = {
      title: "Terms and Conditions",
      icon: <FileText className="text-lic-blue" size={32} />,
      sections: [
        {
          heading: "1. Acceptance of Terms",
          text: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services."
        },
        {
          heading: "2. Description of Service",
          text: "LIC provides users with access to a rich collection of resources, including various communications tools, forums, shopping services, and personalized content. You also understand and agree that the service may include certain communications from LIC, such as service announcements and administrative messages."
        },
        {
          heading: "3. Privacy Policy",
          text: "Registration data and certain other information about you is subject to our applicable privacy policy. For more information, see the full privacy policy at our designated Privacy page."
        }
      ]
    };
  } else if (path === '/privacy') {
    content = {
      title: "Privacy Policy",
      icon: <ShieldCheck className="text-lic-blue" size={32} />,
      sections: [
        {
          heading: "1. Information Collection",
          text: "We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey or fill out a form. Any of the information we collect from you may be used in one of the following ways: To personalize your experience, to improve our website, to improve customer service, or to process transactions."
        },
        {
          heading: "2. Data Protection",
          text: "We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server."
        },
        {
          heading: "3. Information Disclosure",
          text: "We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential."
        }
      ]
    };
  } else if (path === '/disclaimer') {
    content = {
      title: "Disclaimer",
      icon: <FileWarning className="text-lic-blue" size={32} />,
      sections: [
        {
          heading: "1. General Disclaimer",
          text: "The information contained in this website is for general information purposes only. The information is provided by LIC and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose."
        },
        {
          heading: "2. Investment Risks",
          text: "Insurance is the subject matter of solicitation. Returns on investment policies depend on market fluctuations and the company does not guarantee exact returns unless explicitly stated in the policy document."
        }
      ]
    };
  } else if (path === '/fraud-alert') {
    content = {
      title: "Fraud Alert",
      icon: <AlertTriangle className="text-red-500" size={32} />,
      sections: [
        {
          heading: "Beware of Spurious Phone Calls and Fictitious Offers",
          text: "IRDAI or LIC officials do not involve in activities like sale of any kind of insurance or financial products nor invest premiums. LIC does not announce any bonus through phone calls. Public receiving such phone calls are requested to lodge a police complaint along with details of phone call and number."
        },
        {
          heading: "How to Report Fraud",
          text: "If you receive any suspicious calls or emails asking for your policy details or offering unexpected bonuses, do not share any OTP, PIN, or password. Please report it immediately to our toll-free number or email us at fraud-control@licindia.com."
        }
      ]
    };
  } else if (path === '/faq') {
    content = {
      title: "Frequently Asked Questions",
      icon: <HelpCircle className="text-lic-blue" size={32} />,
      sections: [
        {
          heading: "How do I pay my premium online?",
          text: "You can pay your premium through our Customer Portal, via credit/debit card, net banking, or UPI. Go to the 'Premium Payments' section in your dashboard."
        },
        {
          heading: "What is the grace period for premium payment?",
          text: "A grace period of 30 days is allowed for yearly, half-yearly, and quarterly premium payments, and 15 days for monthly payments."
        },
        {
          heading: "How can I update my contact details?",
          text: "You can update your mobile number and email ID by navigating to the 'Settings' page in your user dashboard and clicking on 'Profile Information'."
        }
      ]
    };
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          
          <div className="bg-gray-50 border-b border-gray-200 p-8 sm:p-10 flex items-center gap-4">
            <div className={`p-4 rounded-full ${path === '/fraud-alert' ? 'bg-red-100' : 'bg-blue-100'}`}>
              {content.icon}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
          </div>

          <div className="p-8 sm:p-10">
            {path === '/fraud-alert' && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-8 flex items-start gap-3">
                <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                <p className="text-sm font-medium">LIC never asks for your bank details, OTP, or passwords over the phone. Stay alert, stay safe.</p>
              </div>
            )}

            <div className="space-y-8">
              {content.sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-xl font-bold text-lic-blue mb-3">{section.heading}</h3>
                  <p className="text-gray-600 leading-relaxed">{section.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
