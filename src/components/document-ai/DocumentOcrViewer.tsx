import React, { useState } from 'react';
import { DocumentVerificationResult } from '../../types/verification';
import { simulateDocumentOcr } from '../../services/documentAiMock';
import { FileText, CheckCircle2, AlertTriangle, Eye, ShieldCheck, Cpu } from 'lucide-react';

interface DocumentOcrViewerProps {
  documentType: 'ST_CERTIFICATE' | 'INCOME_CERTIFICATE' | 'MARKSHEET' | 'BANK_PASSBOOK' | 'ADMISSION_LETTER';
  applicantName: string;
  declaredIncome?: number;
  isDeficientScenario?: boolean;
}

export const DocumentOcrViewer: React.FC<DocumentOcrViewerProps> = ({
  documentType,
  applicantName,
  declaredIncome,
  isDeficientScenario = false
}) => {
  const result: DocumentVerificationResult = simulateDocumentOcr(
    documentType,
    applicantName,
    declaredIncome,
    isDeficientScenario
  );

  const [activeView, setActiveView] = useState<'FIELDS' | 'OCR_TEXT'>('FIELDS');

  return (
    <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden text-xs">
      {/* Header */}
      <div className="bg-slate-100 p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-blue-900 rounded">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-800 text-xs block">
              {result.documentTitle}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Cert No: {result.certificateNumber || 'N/A'} • {result.issuingAuthority}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {result.overallDocStatus === 'VERIFIED' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              AI VERIFIED (PASS)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px] animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              DEFICIENCY DETECTED
            </span>
          )}

          {/* Toggle between fields and raw OCR */}
          <div className="flex border border-slate-300 rounded overflow-hidden">
            <button
              onClick={() => setActiveView('FIELDS')}
              className={`px-2 py-0.5 text-[10px] font-bold ${
                activeView === 'FIELDS' ? 'bg-blue-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Extracted Data
            </button>
            <button
              onClick={() => setActiveView('OCR_TEXT')}
              className={`px-2 py-0.5 text-[10px] font-bold ${
                activeView === 'OCR_TEXT' ? 'bg-blue-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Raw OCR
            </button>
          </div>
        </div>
      </div>

      {/* Deficiency Banner if present */}
      {result.overallDocStatus === 'DEFICIENCY_DETECTED' && (
        <div className="bg-rose-50 border-b border-rose-200 p-3 text-rose-950 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Reason for Deficiency:</strong> {result.deficiencyMessage}
            <div className="text-[11px] text-rose-800 mt-0.5 font-medium">
              💡 Action Required: {result.suggestedCorrection}
            </div>
          </div>
        </div>
      )}

      {/* View Content */}
      <div className="p-3">
        {activeView === 'FIELDS' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left text-[11px] font-bold uppercase">Attribute</th>
                  <th className="px-3 py-2 text-left text-[11px] font-bold uppercase">OCR Extracted Value</th>
                  <th className="px-3 py-2 text-left text-[11px] font-bold uppercase">Declared in Form</th>
                  <th className="px-3 py-2 text-left text-[11px] font-bold uppercase">Validation Outcome</th>
                  <th className="px-3 py-2 text-left text-[11px] font-bold uppercase">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {result.fields.map((field, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="px-3 py-2 font-semibold text-slate-800">
                      {field.fieldLabel}
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-900 font-bold">
                      {field.extractedValue}
                    </td>
                    <td className="px-3 py-2 text-slate-600 font-mono">
                      {field.applicationValue || '—'}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        {field.matchedWithApplication ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>MATCH</span>
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>MISMATCH</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500">
                          ({field.explanation})
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-mono text-[11px] text-slate-700">
                      {(field.confidence * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
            {result.rawOcrSnippet || 'No raw OCR stream available.'}
          </div>
        )}
      </div>
    </div>
  );
};
