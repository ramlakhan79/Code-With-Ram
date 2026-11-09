import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageSpinner } from '../components/ui/Feedback';
import Forbidden from '../pages/Forbidden';

// `permission` is a UX gate. The API checks it again on every request.
export default function ProtectedRoute({ permission }) {
  const { user, loading, can } = useAuth();
  const location = useLocation();
  if (loading) return <PageSpinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (permission && !can(permission)) return <Forbidden />;
  return <Outlet />;
}
