import React from 'react';
import { ResourceSection } from '../../components/common/ResourceSection';
import { FileText, ShieldAlert, Download, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ResourcesPage: React.FC = () => {
  const { language } = useApp();
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="border-b border-slate-300 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest mb-1">
          <FileText className="w-4 h-4 text-amber-500" />
          <span>{language === 'HI' ? 'आधिकारिक MoTA भंडार' : 'Official MoTA Repository'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0b2853] tracking-tight">
          {language === 'HI' ? 'दिशानिर्देश, परिपत्र, आदेश एवं चयन सूचियां' : 'Guidelines, Circulars, Orders & Selection Lists'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {language === 'HI' ? 'आधिकारिक प्रकाशनों, संचालन नियमों, नीति संशोधनों और मेरिट अधिसूचनाओं का केंद्रीय भंडार।' : 'Central repository of official publications, operational norms, policy revisions, and merit notifications.'}
        </p>
      </div>

      <ResourceSection />

      {/* Helpful links box */}
      <div className="bg-slate-100 p-5 rounded border border-slate-300 text-xs">
        <h3 className="font-bold text-slate-800 uppercase mb-2">{language === 'HI' ? 'कानूनी वैधता संबंधी सूचना' : 'Notice Regarding Legal Validity'}</h3>
        <p className="text-slate-600 leading-relaxed">
          {language === 'HI' ? 'यहां दिए गए दस्तावेज़ उम्मीदवारों, संस्थानों और राज्य नोडल विभागों की जानकारी के लिए प्रकाशित किए गए हैं। जानकारी को अद्यतन रखने के सभी प्रयास किए जाते हैं; किसी अनजाने अंतर की स्थिति में जनजातीय कार्य मंत्रालय की आधिकारिक राजपत्र अधिसूचनाएं मान्य होंगी।' : 'The documents provided herein are published for information of candidates, institutions, and state nodal departments. While all efforts are made to keep information updated, in case of any inadvertent discrepancy, official Gazette notifications of the Ministry of Tribal Affairs shall prevail.'}
        </p>
      </div>
    </div>
  );
};
