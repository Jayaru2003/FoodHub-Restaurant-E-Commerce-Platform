import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * AdminRoute component
 * Route protection guard for Admin dashboard pages.
 * 
 * Access control rules:
 * 1. Only authenticated ADMIN users can proceed.
 * 2. CUSTOMER users are redirected to the homepage ('/').
 * 3. Unauthenticated users are redirected to '/login'.
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}
