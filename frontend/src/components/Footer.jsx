import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-lic-dark text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group inline-block">
              <div className="bg-lic-gold p-2 rounded-full">
                <ShieldCheck className="h-6 w-6 text-lic-dark" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-tight tracking-wide text-white">LIC</span>
                <span className="text-[10px] tracking-widest uppercase font-medium text-gray-400">Secure Future</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Your trusted partner in life insurance for over six decades. We are committed to securing your family's future with our comprehensive plans.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-lic-gold hover:text-lic-dark transition-colors font-bold text-sm">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-lic-gold hover:text-lic-dark transition-colors font-bold text-sm">
                TW
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-lic-gold hover:text-lic-dark transition-colors font-bold text-sm">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-lic-gold hover:text-lic-dark transition-colors font-bold text-sm">
                LI
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-lic-gold rounded"></span>
            </h4>
            <ul className="space-y-3">
              <li><Link to="/plans" className="hover:text-lic-gold transition-colors flex items-center gap-2"><span className="text-lic-gold text-xs">▸</span> All Insurance Plans</Link></li>
              <li><Link to="/about" className="hover:text-lic-gold transition-colors flex items-center gap-2"><span className="text-lic-gold text-xs">▸</span> About Us</Link></li>
              <li><Link to="/premium-calculator" className="hover:text-lic-gold transition-colors flex items-center gap-2"><span className="text-lic-gold text-xs">▸</span> Premium Calculator</Link></li>
              <li><Link to="/claims" className="hover:text-lic-gold transition-colors flex items-center gap-2"><span className="text-lic-gold text-xs">▸</span> Claims Process</Link></li>
              <li><Link to="/contact" className="hover:text-lic-gold transition-colors flex items-center gap-2"><span className="text-lic-gold text-xs">▸</span> Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Legal & Policy
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-lic-gold rounded"></span>
            </h4>
            <ul className="space-y-3">
              <li><Link to="/terms" className="hover:text-lic-gold transition-colors flex items-center gap-2"><span className="text-lic-gold text-xs">▸</span> Terms and Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-lic-gold transition-colors flex items-center gap-2"><span className="text-lic-gold text-xs">▸</span> Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-lic-gold transition-colors flex items-center gap-2"><span className="text-lic-gold text-xs">▸</span> Disclaimer</Link></li>
              <li><Link to="/fraud-alert" className="hover:text-lic-gold transition-colors flex items-center gap-2"><span className="text-lic-gold text-xs">▸</span> Fraud Alert</Link></li>
              <li><Link to="/faq" className="hover:text-lic-gold transition-colors flex items-center gap-2"><span className="text-lic-gold text-xs">▸</span> FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-lic-gold rounded"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-lic-gold mt-1 shrink-0" size={20} />
                <span className="text-sm">Yogakshema Building, Jeevan Bima Marg, P.O. Box No – 19953, Mumbai – 400 021 IRDAI Reg No- 512</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-lic-gold shrink-0" size={20} />
                <span className="text-sm">+91-022-68276827</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-lic-gold shrink-0" size={20} />
                <span className="text-sm">co_crm_online@licindia.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Life Insurance Corporation. All rights reserved.</p>
          <p>Made with ❤️ for Secure Futures</p>
        </div>
      </div>
    </footer>
  );
}
