import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userRole, userEmail, userName, logout } = useAuth();

  const dashboardLink = userRole === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <nav className="bg-lic-blue text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-lic-gold p-2 rounded-full group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-8 w-8 text-lic-blue" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl leading-tight tracking-wide text-lic-gold">LIC</span>
                <span className="text-xs tracking-widest uppercase font-medium text-gray-200">Secure Future</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-100 hover:text-lic-gold font-medium transition-colors">Home</Link>
            <Link to="/plans" className="text-gray-100 hover:text-lic-gold font-medium transition-colors">Plans</Link>
            <Link to="/payments" className="text-gray-100 hover:text-lic-gold font-medium transition-colors">Pay Installment</Link>
            <Link to="/track-claim" className="text-gray-100 hover:text-lic-gold font-medium transition-colors">Track Status</Link>
            <Link to="/about" className="text-gray-100 hover:text-lic-gold font-medium transition-colors">About Us</Link>
            <Link to="/contact" className="text-gray-100 hover:text-lic-gold font-medium transition-colors">Contact Us</Link>
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-white hover:text-lic-gold font-medium px-4 py-2 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-lic-gold text-lic-blue hover:bg-yellow-400 font-bold px-6 py-2 rounded-md shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5">
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center group" title={userRole === 'ADMIN' ? "Admin Profile" : "User Profile"}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md cursor-default ${userRole === 'ADMIN' ? 'bg-red-600 text-white' : 'bg-lic-gold text-lic-blue'}`}>
                    {userName ? userName.charAt(0).toUpperCase() : (userEmail ? userEmail.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <div className="ml-3 hidden lg:flex flex-col mr-4">
                    <span className="text-sm font-bold text-white">{userName}</span>
                    <span className="text-xs text-blue-200">{userEmail}</span>
                  </div>
                </div>
                <button onClick={logout} className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-md transition-colors text-sm">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-white p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-lic-blue border-t border-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 hover:text-lic-gold">Home</Link>
            <Link to="/plans" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 hover:text-lic-gold">Plans</Link>
            <Link to="/payments" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 hover:text-lic-gold">Pay Installment</Link>
            <Link to="/track-claim" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 hover:text-lic-gold">Track Status</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 hover:text-lic-gold">About Us</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 hover:text-lic-gold">Contact Us</Link>
            <div className="pt-4 flex flex-col gap-2 px-3">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-center bg-blue-800 text-white hover:bg-blue-700 font-medium px-4 py-2 rounded-md transition-colors">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="text-center bg-lic-gold text-lic-blue hover:bg-yellow-400 font-bold px-4 py-2 rounded-md transition-colors">Register</Link>
                </>
              ) : (
                <>
                  {userRole === 'ADMIN' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="text-center bg-lic-gold text-lic-blue hover:bg-yellow-400 font-bold px-4 py-2 rounded-md transition-colors">Admin Dashboard</Link>
                  )}
                  <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-center bg-blue-800 text-white hover:bg-blue-700 font-medium px-4 py-2 rounded-md transition-colors">Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
