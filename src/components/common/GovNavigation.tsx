import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react';

export const GovNavigation: React.FC = () => {
  const { language } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: language === 'HI' ? 'मुख्य पृष्ठ' : 'Home' },
    { to: '/about', label: language === 'HI' ? 'हमारे बारे में' : 'About Us' },
    { to: '/schemes', label: language === 'HI' ? 'योजनाएं' : 'Schemes' },
    { to: '/applicant/apply', label: language === 'HI' ? 'आवेदन' : 'Application' },
    { to: '/applicant/dashboard', label: language === 'HI' ? 'डैशबोर्ड' : 'Dashboard' },
    { to: '/resources', label: language === 'HI' ? 'संसाधन' : 'Resources' },
    { to: '/grievances', label: language === 'HI' ? 'शिकायत' : 'Grievance' },
    { to: '/help', label: language === 'HI' ? 'सहायता' : 'Help' },
    { to: '/contact', label: language === 'HI' ? 'संपर्क' : 'Contact' },
  ];

  return (
    <nav aria-label="Main Navigation" className="bg-[#134685] text-white sticky top-7 z-40 shadow-md border-b-2 border-[#b45309]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="ml-2 font-semibold text-sm">MoTA Portal Menu</span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-t transition-colors ${
                    isActive
                      ? 'bg-[#0b2853] text-amber-400 border-b-2 border-amber-400 font-bold'
                      : 'text-slate-100 hover:bg-[#0b2853]/70 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Prominent Action Button: APPLY / TRACK APPLICATION */}
          <div className="flex items-center gap-2">
            <Link
              to="/applicant/status"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded shadow-sm flex items-center gap-1.5 transition-all transform hover:scale-[1.02] border border-amber-400 uppercase tracking-wider"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-900" />
              <span>{language === 'HI' ? 'आवेदन करें / स्थिति जांचें' : 'APPLY / TRACK APPLICATION'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-900 hidden sm:inline" />
            </Link>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-blue-700 space-y-1 bg-[#0b2853]">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-blue-800 text-amber-400 border-l-4 border-amber-400'
                      : 'text-slate-200 hover:bg-blue-900 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-2 px-4">
              <Link
                to="/applicant/status"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2 px-3 rounded"
              >
                APPLY / TRACK APPLICATION
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
