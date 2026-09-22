import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, User, UserCheck, Settings, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const RoleSwitcherBanner: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { switchRole } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleRoleSwitch = async (role: 'APPLICANT' | 'OFFICER' | 'ADMIN') => {
    if (role === 'APPLICANT') {
      if (user?.role !== 'APPLICANT') {
        logout();
        navigate('/login');
      }
    } else {
      await switchRole(role);
      navigate('/admin');
    }
  };

  return (
    <aside aria-label="Demo Role Switcher" className="bg-slate-900 text-slate-200 text-xs border-b border-slate-700 py-1 px-4 z-50 sticky top-0 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30 text-[11px]">
            PORTAL ACCESS
          </span>
          {isAuthenticated && user ? (
            <>
              <span className="hidden sm:inline text-slate-300">
                Authenticated User:
              </span>
              <span className="font-semibold text-white">
                {user.name}
              </span>
              <span className="text-amber-300 font-mono">({user.role})</span>
            </>
          ) : (
            <span className="text-slate-400">
              Not Logged In • Please Login or Sign Up
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 mr-1 hidden md:inline">Quick Role Testing:</span>
          
          <button
            onClick={() => handleRoleSwitch('APPLICANT')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              user?.role === 'APPLICANT'
                ? 'bg-blue-600 text-white shadow font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Applicant Portal View"
          >
            <User className="w-3.5 h-3.5" />
            <span>Applicant</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('OFFICER')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              user?.role === 'OFFICER'
                ? 'bg-indigo-600 text-white shadow font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Switch to Scrutiny Officer (Real JWT)"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Scrutiny Officer</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('ADMIN')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              user?.role === 'ADMIN'
                ? 'bg-emerald-600 text-white shadow font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Switch to Scheme Admin (Real JWT)"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Scheme Admin</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block"></div>

          {/* Quick jump links */}
          {user && user.role !== 'APPLICANT' && !location.pathname.startsWith('/admin') && (
            <Link
              to="/admin"
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-2 py-0.5 rounded text-[11px] flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3" />
              Go to Officer Desk
            </Link>
          )}

          {location.pathname.startsWith('/admin') && (
            <Link
              to="/"
              className="bg-blue-700 hover:bg-blue-600 text-white font-medium px-2 py-0.5 rounded text-[11px]"
            >
              Public Portal
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};
