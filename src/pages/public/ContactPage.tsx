import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-slate-300 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0b2853] tracking-tight">
          Nodal Contacts & Citizen Helpdesk
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Ministry of Tribal Affairs Central Directorate and State Welfare Department Directory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded border border-slate-300 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#0b2853] border-b border-slate-200 pb-2">
            Central Directorate (Shastri Bhawan, New Delhi)
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Scholarship Division, Ministry of Tribal Affairs</strong>
                <p className="text-slate-600">Room No. 412, A-Wing, Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-800 flex-shrink-0" />
              <div>
                <strong>National Toll-Free Helpline:</strong>
                <p className="text-slate-600">011-23386341 / 1800-11-2233 (Toll Free)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-800 flex-shrink-0" />
              <div>
                <strong>Support & Technical Inquiries:</strong>
                <p className="text-slate-600">edu-tribal@nic.in / dbt-tribal@gov.in</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-800 flex-shrink-0" />
              <div>
                <strong>Working Hours:</strong>
                <p className="text-slate-600">Monday to Friday: 9:30 AM – 6:00 PM (Except Gazetted Holidays)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded border border-slate-300 space-y-4">
          <h2 className="text-base font-bold text-[#0b2853] border-b border-slate-200 pb-2">
            Need Grievance Redressal?
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            If your application has experienced an unexpected delay, document deficiency query, or PFMS account verification bottleneck, you can log an official ticket directly with the MoTA Grievance Redressal Cell.
          </p>
          <Link
            to="/grievances"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-bold transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Open Grievance Redressal Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const HelpPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-slate-300 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0b2853] tracking-tight">
          Applicant Help & User Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Instructions for student registration, document upload, Aadhaar seeding, and deficiency rectification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
          <h3 className="font-bold text-[#0b2853] text-sm">Step 1: Check Eligibility</h3>
          <p className="text-slate-600">
            Use the AI Eligibility Pre-check tool to check income limits and academic percentages before beginning the form.
          </p>
        </div>

        <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
          <h3 className="font-bold text-[#0b2853] text-sm">Step 2: Prepare Documents</h3>
          <p className="text-slate-600">
            Keep clear, legible PDF/JPG scans of your ST Certificate, current FY Income Certificate, and Marksheets ready for OCR scanning.
          </p>
        </div>

        <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
          <h3 className="font-bold text-[#0b2853] text-sm">Step 3: Track & Rectify</h3>
          <p className="text-slate-600">
            Monitor your 8-stage application timeline. If a deficiency is detected by the AI or officer, replace the document within 15 days.
          </p>
        </div>
      </div>
    </div>
  );
};
