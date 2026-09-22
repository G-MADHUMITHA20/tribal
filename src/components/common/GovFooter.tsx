import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, HelpCircle, FileText, Phone, Mail, MapPin } from 'lucide-react';

export const GovFooter: React.FC = () => {
  return (
    <footer className="bg-[#0b2853] text-slate-300 text-xs border-t-4 border-[#b45309]">
      {/* Upper Footer: Links & Info */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Ministry Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded bg-white p-1 flex items-center justify-center">
                <svg viewBox="0 0 100 120" className="w-6 h-6 text-slate-900" fill="currentColor">
                  <circle cx="50" cy="20" r="10" fill="#0b2853" />
                  <path d="M35,32 Q50,26 65,32 L60,65 Q50,68 40,65 Z" fill="#0b2853" />
                  <rect x="42" y="66" width="16" height="18" fill="#134685" />
                  <circle cx="50" cy="94" r="10" fill="#0b2853" stroke="#b45309" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                  Ministry of Tribal Affairs
                </h4>
                <p className="text-[10px] text-slate-400">Government of India</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs mb-3">
              Unified AI-Enabled Scholarship & Fellowship Management System empowering Scheduled Tribe (ST) students across pre-matric, higher education, doctoral, and overseas studies.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Certified National DBT Gateway</span>
            </div>
          </div>

          {/* Column 2: Flagship Schemes */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs border-b border-blue-800 pb-1">
              Flagship Schemes
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/schemes/pre-matric-st" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>› Pre-Matric Scholarship (Class IX & X)</span>
                </Link>
              </li>
              <li>
                <Link to="/schemes/post-matric-st" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>› Post-Matric Scholarship (Class XI to PG)</span>
                </Link>
              </li>
              <li>
                <Link to="/schemes/national-scholarship-top-class" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>› Top Class Education (IITs, IIMs, AIIMS)</span>
                </Link>
              </li>
              <li>
                <Link to="/schemes/national-fellowship-st" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>› National Fellowship (M.Phil / Ph.D.)</span>
                </Link>
              </li>
              <li>
                <Link to="/schemes/national-overseas-scholarship-st" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>› National Overseas Scholarship (World Top 500)</span>
                </Link>
              </li>
              <li>
                <Link to="/schemes/dbt-fellowship-st" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>› DBT Unified Benefit Grant</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & Resources */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs border-b border-blue-800 pb-1">
              Important Portals & Links
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a href="https://tribal.nic.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  <span>Official MoTA Main Website (tribal.nic.in)</span>
                </a>
              </li>
              <li>
                <a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  <span>National Scholarship Portal (NSP)</span>
                </a>
              </li>
              <li>
                <a href="https://pfms.nic.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  <span>PFMS Direct Benefit Transfer (DBT)</span>
                </a>
              </li>
              <li>
                <Link to="/resources" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span>Circulars, Guidelines & Amendments</span>
                </Link>
              </li>
              <li>
                <Link to="/grievances" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  <span>Online Grievance Redressal Cell</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Nodal Contact Details */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs border-b border-blue-800 pb-1">
              Nodal Contact & Helpdesk
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  Scholarship Division, Ministry of Tribal Affairs,
                  Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Toll-Free National Helpline: 011-23386341 / 1800-11-2233</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>edu-tribal@nic.in / support-mota@gov.in</span>
              </div>
              <div className="pt-2">
                <span className="block text-[10px] text-slate-400">Operating Hours:</span>
                <span className="text-[11px] font-medium text-slate-200">Monday to Friday: 9:30 AM – 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Prototype Transparency Disclaimer Banner */}
      <div className="bg-[#071c3d] py-2 px-4 border-t border-blue-900 text-center text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 text-amber-300">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-semibold uppercase tracking-wider text-[10px]">Prototype Demo Notice:</span>
            <span className="text-slate-300">
              This system represents an enhanced AI-enabled prototype of the MoTA Scholarship & Fellowship Portal.
            </span>
          </div>
          <div className="text-slate-400 text-[10px]">
            Designed as a high-density, accessible Government of India institutional platform.
          </div>
        </div>
      </div>

      {/* Copyright, NIC Hosting Disclaimer, Last Updated */}
      <div className="bg-[#05142c] py-3 px-4 text-slate-400 text-[11px] border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            Website content managed by <strong className="text-slate-200">Ministry of Tribal Affairs, Government of India</strong>.
          </div>
          <div>
            Hosted by <strong className="text-slate-200">National Informatics Centre (NIC)</strong> | Last Updated: 22 September 2025
          </div>
        </div>
      </div>
    </footer>
  );
};
