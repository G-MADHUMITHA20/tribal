import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentOcrViewer } from '../../components/document-ai/DocumentOcrViewer';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, Upload, ExternalLink } from 'lucide-react';

export const MyDocumentsPage: React.FC = () => {
  const { currentApplicantApplication } = useApp();
  const app = currentApplicantApplication;

  const [activeTab, setActiveTab] = useState<'ST' | 'INC' | 'MARK'>('ST');

  if (!app) return <div>No active application documents.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            Digital Certificate Vault
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight">
            My Enclosed Documents & OCR Verification
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Inspected by MoTA AI Document Intelligence Engine for Application <strong>{app.id}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-cyan-100 text-cyan-900 border border-cyan-300 flex items-center gap-1">
            <ExternalLink className="w-3.5 h-3.5" />
            DigiLocker Synced
          </span>
        </div>
      </div>

      {/* Tabs for inspecting each document */}
      <div className="flex items-center gap-2 border-b border-slate-300 bg-white px-4 pt-2 rounded-t">
        <button
          onClick={() => setActiveTab('ST')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'ST'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          1. ST Caste Certificate
        </button>

        <button
          onClick={() => setActiveTab('INC')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'INC'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          2. Income Certificate {app.hasDeficiency && '(Deficient)'}
        </button>

        <button
          onClick={() => setActiveTab('MARK')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'MARK'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          3. Qualifying Marksheet
        </button>
      </div>

      {/* OCR Inspection Viewer */}
      <div className="space-y-4">
        {activeTab === 'ST' && (
          <DocumentOcrViewer
            documentType="ST_CERTIFICATE"
            applicantName={app.applicant.fullName}
            declaredIncome={app.annualFamilyIncome}
            isDeficientScenario={false}
          />
        )}

        {activeTab === 'INC' && (
          <DocumentOcrViewer
            documentType="INCOME_CERTIFICATE"
            applicantName={app.applicant.fullName}
            declaredIncome={app.annualFamilyIncome}
            isDeficientScenario={app.hasDeficiency}
          />
        )}

        {activeTab === 'MARK' && (
          <DocumentOcrViewer
            documentType="MARKSHEET"
            applicantName={app.applicant.fullName}
            declaredIncome={app.annualFamilyIncome}
            isDeficientScenario={false}
          />
        )}
      </div>
    </div>
  );
};
