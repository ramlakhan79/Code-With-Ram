import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { PageSpinner } from '../components/ui/Feedback';

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageSpinner />;
  if (user) return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-4"><Logo /><ThemeToggle /></header>
      <main id="main" className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:items-center">
        <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 sm:p-8"><Outlet /></div>
      </main>
    </div>
  );
}
