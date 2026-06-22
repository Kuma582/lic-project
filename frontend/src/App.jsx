import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import PlansPage from './pages/PlansPage';
import PlanDetailsPage from './pages/PlanDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import MyPoliciesPage from './pages/MyPoliciesPage';
import PremiumPaymentsPage from './pages/PremiumPaymentsPage';
import ApplyPolicyPage from './pages/ApplyPolicyPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminPoliciesPage from './pages/AdminPoliciesPage';
import AdminManagePlansPage from './pages/AdminManagePlansPage';
import ContactPage from './pages/ContactPage';
import SettingsPage from './pages/SettingsPage';
import PremiumCalculatorPage from './pages/PremiumCalculatorPage';
import ClaimsPage from './pages/ClaimsPage';
import TrackClaimPage from './pages/TrackClaimPage';
import LegalPage from './pages/LegalPage';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLoginPage from './pages/AdminLoginPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#fff', color: '#1e3a8a', fontWeight: 'bold' } }} />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex flex-col">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/plans/:id" element={<PlanDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/premium-calculator" element={<PremiumCalculatorPage />} />
                <Route path="/claims" element={<ClaimsPage />} />
                <Route path="/track-claim" element={<TrackClaimPage />} />
                
                {/* Legal & Policy Routes */}
                <Route path="/terms" element={<LegalPage />} />
                <Route path="/privacy" element={<LegalPage />} />
                <Route path="/disclaimer" element={<LegalPage />} />
                <Route path="/fraud-alert" element={<LegalPage />} />
                <Route path="/faq" element={<LegalPage />} />

                {/* Dashboard Routes (Protected) */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route index element={<DashboardPage />} />
                  <Route path="policies" element={<MyPoliciesPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* Apply Policy Route (Protected) */}
                <Route path="/apply" element={<ProtectedRoute><ApplyPolicyPage /></ProtectedRoute>} />
                
                {/* Premium Payments Route (Protected) */}
                <Route path="/payments" element={<ProtectedRoute><PremiumPaymentsPage /></ProtectedRoute>} />
                
                {/* Admin Dashboard Routes (Protected) */}
                <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><DashboardLayout /></ProtectedRoute>}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="policies" element={<AdminPoliciesPage />} />
                  <Route path="plans" element={<AdminManagePlansPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
