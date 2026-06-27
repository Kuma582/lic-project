import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // If it's an admin route, send to admin login, else user login
    if (requireAdmin) {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    // If they are not admin but trying to access admin route
    return <Navigate to="/" replace />;
  }

  return children;
}
