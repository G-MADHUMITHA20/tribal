import React from 'react';
import { Bell, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewsTicker: React.FC = () => {
  const announcements = [
    'National Fellowship (Ph.D. Scholars) 2025-26 Selection Merit Roster released. Verification portal active.',
    'Urgent: Mandatory Aadhaar Linking on NPCI Mapper for DBT direct disbursement before 30th November 2025.',
    'Pre-Matric & Post-Matric ST Scholarships: Academic Year 2025-26 online registrations are NOW OPEN across all States & UTs.',
    'AI-Assisted Instant Document Deficiency Window is open: Upload valid FY 2024-25 Income Certificates without penalty.',
    'National Overseas Scholarship: 20 Slots ratified for Masters & Doctoral Studies in QS World Top 500 Universities.'
  ];

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-xs py-1.5 px-4 overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
        {/* Badge */}
        <div className="flex-shrink-0 flex items-center gap-1 bg-red-700 text-white font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wide shadow-sm">
          <Flame className="w-3 h-3 animate-pulse text-amber-300" />
          <span>Latest Updates</span>
        </div>

        {/* Scrolling text */}
        <div className="overflow-hidden relative w-full whitespace-nowrap">
          <div className="animate-ticker text-slate-800 font-medium">
            {announcements.map((text, idx) => (
              <span key={idx} className="inline-flex items-center mr-8 hover:text-blue-800 cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 inline-block"></span>
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* View All link */}
        <Link
          to="/resources"
          className="flex-shrink-0 text-blue-900 font-semibold hover:underline text-xs flex items-center gap-1 hidden sm:flex"
        >
          <span>All Circulars</span>
          <Bell className="w-3 h-3 text-blue-700" />
        </Link>
      </div>
    </div>
  );
};
