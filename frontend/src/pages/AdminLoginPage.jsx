import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  // Force clear any stale session when visiting admin login page
  useEffect(() => {
    logout();
  }, []);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const response = await login(email, password);
    
    if (response.success) {
      if (response.role === 'ADMIN' || response.role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        setError('You do not have admin privileges.');
        logout(); // Force logout if they are not an admin
      }
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-lic-blue rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lic-gold rounded-full opacity-10 blur-3xl"></div>

      <div className="max-w-md w-full bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700 relative z-10">
        
        {/* Header Section */}
        <div className="py-8 px-6 text-center border-b border-gray-700">
          <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-lic-gold">
            <ShieldCheck className="h-8 w-8 text-lic-gold" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">Admin Portal</h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase font-semibold">Restricted Access</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-lic-gold focus:border-transparent transition-all outline-none"
                placeholder="admin@lic.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Master Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-lg bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-lic-gold focus:border-transparent transition-all outline-none"
                  placeholder="Enter master password"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-gray-900 bg-lic-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-lic-gold transition-colors"
            >
              Authenticate
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Unauthorized access to this portal is strictly prohibited and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
