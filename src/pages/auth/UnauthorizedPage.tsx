import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-2 border-rose-300 rounded-lg shadow-lg p-6 sm:p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center mx-auto text-rose-700">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-widest block">
            HTTP 403 • ACCESS FORBIDDEN
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Unauthorized Portal Access
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            Your logged-in account (<strong>{user?.email}</strong> with role{' '}
            <span className="font-bold text-rose-900">[{user?.role}]</span>) does not possess statutory authorization to access this administrative resource.
          </p>
        </div>

        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-[11px] text-slate-600 text-left">
          <strong>Security Notice:</strong> Attempted access to privileged government review queues is audited and logged under MoTA Cybersecurity & DBT Governance Guidelines.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          {user?.role === 'APPLICANT' ? (
            <Link
              to="/applicant/dashboard"
              className="w-full sm:w-auto px-4 py-2 bg-[#0b2853] hover:bg-[#134685] text-white text-xs font-bold rounded shadow flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Return to Applicant Portal</span>
            </Link>
          ) : (
            <Link
              to="/admin"
              className="w-full sm:w-auto px-4 py-2 bg-[#0b2853] hover:bg-[#134685] text-white text-xs font-bold rounded shadow flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Go to Officer Portal</span>
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded"
          >
            Switch Account / Logout
          </button>
        </div>
      </div>
    </div>
  );
};
