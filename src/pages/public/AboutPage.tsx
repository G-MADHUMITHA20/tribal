import React from 'react';
import { Landmark, Shield, Award, Users, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AboutPage: React.FC = () => {
  const { language } = useApp();
  const hindi = language === 'HI';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-slate-300 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0b2853] tracking-tight">
          {hindi ? 'छात्रवृत्ति प्रभाग के बारे में | जनजातीय कार्य मंत्रालय' : 'About the Scholarship Division | Ministry of Tribal Affairs'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {hindi ? 'गुणवत्तापूर्ण शिक्षा, उत्कृष्ट अनुसंधान और प्रत्यक्ष कल्याण वितरण के माध्यम से भारत के जनजातीय युवाओं को सशक्त बनाना।' : 'Empowering the tribal youth of India through quality education, research excellence, and direct welfare delivery.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-6 rounded border border-slate-300 shadow-sm">
          <h2 className="text-base font-bold text-[#0b2853]">{hindi ? 'दृष्टिकोण एवं अधिदेश' : 'Vision & Mandate'}</h2>
          <p>
            {hindi ? 'जनजातीय कार्य मंत्रालय का गठन अक्टूबर 1999 में अनुसूचित जनजातियों (ST), जो भारतीय समाज का सबसे वंचित वर्ग है, के एकीकृत सामाजिक-आर्थिक विकास पर अधिक केंद्रित दृष्टिकोण प्रदान करने के उद्देश्य से किया गया था।' : 'The Ministry of Tribal Affairs was constituted in October 1999 with the objective of providing a more focused approach on the integrated socio-economic development of the Scheduled Tribes (STs), the most underprivileged section of the Indian Society.'}
          </p>
          <p>
            {hindi ? 'छात्रवृत्ति प्रभाग को शैक्षिक ड्रॉपआउट कम करने, प्रमुख संस्थानों (IIT, IIM, AIIMS, NIT) में उच्च व्यावसायिक शिक्षा को प्रोत्साहित करने, डॉक्टरेट अनुसंधान को बढ़ावा देने और प्रतिष्ठित वैश्विक विश्वविद्यालयों में विदेशी अध्ययन की सुविधा देने वाली महत्वपूर्ण केंद्रीय क्षेत्र और केंद्र प्रायोजित योजनाओं के प्रशासन का दायित्व सौंपा गया है।' : 'The Scholarship Division is entrusted with the administration of vital Central Sector and Centrally Sponsored Schemes aimed at reducing educational drop-outs, encouraging higher professional learning in Premier Institutes (IITs, IIMs, AIIMS, NITs), fostering doctoral research, and facilitating overseas studies in global universities of distinction.'}
          </p>
          <h2 className="text-base font-bold text-[#0b2853] pt-2">{hindi ? 'अगली पीढ़ी का एकीकृत एआई ढांचा' : 'Next-Generation Unified AI Architecture'}</h2>
          <p>
            {hindi ? <>प्रधानमंत्री के <em>डिजिटल इंडिया</em> और <em>न्यूनतम सरकार, अधिकतम शासन</em> के दृष्टिकोण के अनुरूप, यह एकीकृत पोर्टल सभी अलग-अलग छात्रवृत्ति आवेदनों को एकल, नियम-आधारित मंच पर एकत्र करता है। एआई-सहायित दस्तावेज़ सत्यापन, आवेदक कमी सुधार चक्र और रीयल-टाइम PFMS DBT एकीकरण से संचालित यह प्रणाली प्रशासनिक देरी समाप्त करती है और छात्रों के बैंक खातों में 100% पारदर्शी लाभ अंतरण सुनिश्चित करती है।</> : <>In alignment with the Prime Minister's vision of <em>Digital India</em> and <em>Minimum Government, Maximum Governance</em>, this Unified Portal consolidates all disparate scholarship applications into a single, rule-driven platform. Powered by AI-assisted document verification, applicant deficiency correction loops, and real-time PFMS DBT integration, the system eliminates administrative delays and guarantees 100% transparent benefit transfer directly into student bank accounts.</>}
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 p-5 rounded border border-slate-300 space-y-3">
            <h3 className="font-bold text-[#0b2853] text-sm uppercase tracking-wide border-b border-slate-200 pb-2">
              {hindi ? 'मुख्य प्राथमिकता क्षेत्र' : 'Key Focus Areas'}
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{hindi ? 'आधार पेमेंट ब्रिज (NPCI) के माध्यम से शून्य रिसाव' : 'Zero Leakage through Aadhaar Payment Bridge (NPCI)'}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{hindi ? 'ST महिला विद्वानों के लिए न्यूनतम 33% लिंग आरक्षण' : '33% Minimum Gender Earmarking for ST Women Scholars'}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{hindi ? 'PVTG (विशेष रूप से कमजोर जनजातीय समूहों) के लिए विशेष सकारात्मक कोटा' : 'Special affirmative quotas for PVTG (Vulnerable Tribal Groups)'}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{hindi ? 'सक्रिय दस्तावेज़ जांच एवं कमी अधिसूचना' : 'Proactive Document Scrutiny & Deficiency Notification'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
