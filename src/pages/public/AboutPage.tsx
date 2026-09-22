import React from 'react';
import { Landmark, Shield, Award, Users, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-slate-300 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0b2853] tracking-tight">
          About the Scholarship Division | Ministry of Tribal Affairs
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Empowering the tribal youth of India through quality education, research excellence, and direct welfare delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-6 rounded border border-slate-300 shadow-sm">
          <h2 className="text-base font-bold text-[#0b2853]">Vision & Mandate</h2>
          <p>
            The Ministry of Tribal Affairs was constituted in October 1999 with the objective of providing a more focused approach on the integrated socio-economic development of the Scheduled Tribes (STs), the most underprivileged section of the Indian Society.
          </p>
          <p>
            The Scholarship Division is entrusted with the administration of vital Central Sector and Centrally Sponsored Schemes aimed at reducing educational drop-outs, encouraging higher professional learning in Premier Institutes (IITs, IIMs, AIIMS, NITs), fostering doctoral research, and facilitating overseas studies in global universities of distinction.
          </p>
          <h2 className="text-base font-bold text-[#0b2853] pt-2">Next-Generation Unified AI Architecture</h2>
          <p>
            In alignment with the Prime Minister's vision of <em>Digital India</em> and <em>Minimum Government, Maximum Governance</em>, this Unified Portal consolidates all disparate scholarship applications into a single, rule-driven platform. Powered by AI-assisted document verification, applicant deficiency correction loops, and real-time PFMS DBT integration, the system eliminates administrative delays and guarantees 100% transparent benefit transfer directly into student bank accounts.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 p-5 rounded border border-slate-300 space-y-3">
            <h3 className="font-bold text-[#0b2853] text-sm uppercase tracking-wide border-b border-slate-200 pb-2">
              Key Focus Areas
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Zero Leakage through Aadhaar Payment Bridge (NPCI)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>33% Minimum Gender Earmarking for ST Women Scholars</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Special affirmative quotas for PVTG (Vulnerable Tribal Groups)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Proactive Document Scrutiny & Deficiency Notification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
