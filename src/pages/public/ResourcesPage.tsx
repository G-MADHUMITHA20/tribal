import React from 'react';
import { ResourceSection } from '../../components/common/ResourceSection';
import { FileText, ShieldAlert, Download, ExternalLink } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="border-b border-slate-300 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest mb-1">
          <FileText className="w-4 h-4 text-amber-500" />
          <span>Official MoTA Repository</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0b2853] tracking-tight">
          Guidelines, Circulars, Orders & Selection Lists
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Central repository of official publications, operational norms, policy revisions, and merit notifications.
        </p>
      </div>

      <ResourceSection />

      {/* Helpful links box */}
      <div className="bg-slate-100 p-5 rounded border border-slate-300 text-xs">
        <h3 className="font-bold text-slate-800 uppercase mb-2">Notice Regarding Legal Validity</h3>
        <p className="text-slate-600 leading-relaxed">
          The documents provided herein are published for information of candidates, institutions, and state nodal departments. While all efforts are made to keep information updated, in case of any inadvertent discrepancy, official Gazette notifications of the Ministry of Tribal Affairs shall prevail.
        </p>
      </div>
    </div>
  );
};
