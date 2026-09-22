import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, User, UserCheck, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const RoleSwitcherBanner: React.FC = () => {
  const { currentUser, switchRole } = useApp();
  const location = useLocation();

  return (
    <aside aria-label="Demo Role Switcher" className="bg-slate-900 text-slate-200 text-xs border-b border-slate-700 py-1 px-4 z-50 sticky top-0 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30 text-[11px]">
            DEMO MODE
          </span>
          <span className="hidden sm:inline text-slate-300">
            Interactive Persona Simulation:
          </span>
          <span className="font-semibold text-white">
            {currentUser.name}
          </span>
          <span className="text-slate-400">({currentUser.role})</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 mr-1 hidden md:inline">Switch Role:</span>
          
          <button
            onClick={() => switchRole('APPLICANT')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              currentUser.role === 'APPLICANT'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Switch to ST Applicant View"
          >
            <User className="w-3.5 h-3.5" />
            <span>Applicant (Scholar)</span>
          </button>

          <button
            onClick={() => switchRole('OFFICER')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              currentUser.role === 'OFFICER'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Switch to Scrutiny Officer View"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Scrutiny Officer</span>
          </button>

          <button
            onClick={() => switchRole('ADMIN')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              currentUser.role === 'ADMIN'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Switch to Scheme Admin View"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Scheme Admin</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block"></div>

          {/* Quick jump links */}
          {currentUser.role !== 'APPLICANT' && !location.pathname.startsWith('/admin') && (
            <Link
              to="/admin"
              className="bg-amber-600/90 hover:bg-amber-600 text-white font-medium px-2 py-0.5 rounded text-[11px] flex items-center gap-1"
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
              Back to Public Portal
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};
