import React, { useState } from 'react';
import { OFFICIAL_RESOURCES, ResourceItem } from '../../data/resources';
import { FileText, Download, Calendar, Tag, ExternalLink, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ResourceSection: React.FC = () => {
  const { language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { key: 'ALL', label: language === 'HI' ? 'सभी संसाधन' : 'All Resources' },
    { key: 'GUIDELINE', label: language === 'HI' ? 'दिशानिर्देश एवं संशोधन' : 'Guidelines & Amendments' },
    { key: 'CIRCULAR', label: language === 'HI' ? 'परिपत्र एवं आदेश' : 'Circulars & Orders' },
    { key: 'RESULT', label: language === 'HI' ? 'चयन परिणाम' : 'Selection Results' },
    { key: 'MANUAL', label: language === 'HI' ? 'उपयोगकर्ता पुस्तिकाएं' : 'User Manuals' },
    { key: 'NEWS', label: language === 'HI' ? 'समाचार एवं प्रेस विज्ञप्तियां' : 'News & Press Releases' }
  ];

  const filteredItems = OFFICIAL_RESOURCES.filter((res) => {
    if (selectedCategory !== 'ALL' && res.category !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        (res.referenceNumber && res.referenceNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <section aria-label="Official MoTA Resources and Notifications" className="my-8 bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#0b2853] text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-amber-500">
        <div>
          <h2 className="font-bold text-base tracking-wide uppercase">
            {language === 'HI' ? 'आधिकारिक दिशानिर्देश, परिपत्र एवं चयन परिणाम' : 'Official Guidelines, Circulars & Selection Results'}
          </h2>
          <p className="text-xs text-slate-300">
            {language === 'HI' ? 'जनजातीय कार्य मंत्रालय द्वारा जारी प्रामाणिक दस्तावेज़, संशोधन और अधिसूचनाएं' : 'Authoritative documents, amendments, and notifications issued by Ministry of Tribal Affairs'}
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={language === 'HI' ? 'परिपत्र खोजें...' : 'Search circulars...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900/60 border border-slate-500 rounded text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 flex items-center gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              selectedCategory === cat.key
                ? 'border-blue-800 text-blue-900 bg-white shadow-sm font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="divide-y divide-slate-200">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 uppercase tracking-wider">
                    <Tag className="w-3 h-3" />
                    {language === 'HI' ? ({ GUIDELINE: 'दिशानिर्देश', CIRCULAR: 'परिपत्र', RESULT: 'परिणाम', MANUAL: 'पुस्तिका', NEWS: 'समाचार', ACHIEVEMENT: 'उपलब्धि' }[item.category]) : item.category}
                  </span>
                  {item.isNew && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-600 text-white uppercase animate-pulse">
                      {language === 'HI' ? 'नया' : 'NEW'}
                    </span>
                  )}
                  {item.referenceNumber && (
                    <span className="text-[11px] font-medium text-slate-500">
                      {language === 'HI' ? 'संदर्भ:' : 'Ref:'} {item.referenceNumber}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.publishDate}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#0b2853] hover:text-blue-700 cursor-pointer">
                  {language === 'HI' ? item.titleHi : item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                  {language === 'HI' ? item.descriptionHi : item.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                <a
                  href={item.downloadUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Simulated PDF Download: ${item.title}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-900 font-semibold text-xs border border-blue-300 rounded shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-blue-800" />
                  <span>{language === 'HI' ? 'डाउनलोड' : 'Download'} {item.fileSize || 'PDF'}</span>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs">
            {language === 'HI' ? 'चयनित मानदंड से कोई संसाधन मेल नहीं खाता।' : 'No resources match the selected criteria.'}
          </div>
        )}
      </div>
    </section>
  );
};
