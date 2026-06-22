import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await register(name, email, password, confirmPassword);
    
    if (response.success) {
      navigate('/apply'); // Redirect to apply policy as dashboard is removed
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left Panel - Illustration & Benefits */}
      <div className="hidden md:flex md:w-1/2 bg-lic-blue text-white flex-col justify-center px-12 lg:px-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-lic-gold rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <ShieldCheck size={64} className="text-lic-gold mb-8" />
          <h2 className="text-4xl font-bold mb-6">Start Your Journey With LIC</h2>
          <p className="text-blue-100 text-lg mb-10">
            Create an account to explore personalized insurance plans, calculate premiums, and secure your family's future digitally.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-lic-gold" size={24} />
              <span className="text-lg">Track your policies easily</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-lic-gold" size={24} />
              <span className="text-lg">Instant premium payments</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-lic-gold" size={24} />
              <span className="text-lg">Hassle-free claim settlement</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-lic-gold" size={24} />
              <span className="text-lg">24/7 dedicated support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 md:hidden">
            <ShieldCheck size={48} className="text-lic-blue mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          </div>
          
          <h2 className="hidden md:block text-3xl font-bold text-gray-900 mb-8 text-center">Create Account</h2>

          {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue focus:border-transparent transition-all outline-none"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue focus:border-transparent transition-all outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue focus:border-transparent transition-all outline-none"
                placeholder="+91 9876543210"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue focus:border-transparent transition-all outline-none"
                placeholder="Create a strong password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue focus:border-transparent transition-all outline-none"
                placeholder="Confirm password"
              />
            </div>

            <div className="flex items-start mt-4">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-1 text-lic-blue focus:ring-lic-blue border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                I agree to the <a href="#" className="text-lic-blue font-medium hover:underline">Terms & Conditions</a> and <a href="#" className="text-lic-blue font-medium hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 mt-6 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-lic-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lic-blue transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-lic-blue hover:text-blue-800">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
