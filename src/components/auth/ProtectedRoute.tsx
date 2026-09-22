import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4"
      >
        <div className="w-12 h-12 border-4 border-blue-900 border-t-amber-500 rounded-full animate-spin mb-4" />
        <span className="text-sm font-bold text-[#0b2853]">
          Verifying National Portal Security Credentials...
        </span>
        <span className="text-xs text-slate-500 mt-1">
          Ministry of Tribal Affairs • Government of India
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
