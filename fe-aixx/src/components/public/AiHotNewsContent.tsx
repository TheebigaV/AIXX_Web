'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FaAward, 
  FaCheckCircle, 
  FaQuestionCircle,
  FaCalendarAlt,
  FaShareAlt,
  FaSpinner
} from 'react-icons/fa';
import { CertificatePortalForm } from '@/components/public/CertificatePortalForm';
import { fetchPublicTrainings } from '@/lib/training';

const AiHotNewsContent: React.FC = () => {
  const [allNews, setAllNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadNews = async () => {
      try {
        const response = await fetchPublicTrainings('newsletters');
        const payload = response?.data?.data || response?.data || [];
        const items = Array.isArray(payload) ? payload : [];
        if (isMounted) {
          const mappedNews = items.map((item: any) => ({
            id: item.id || item.slug,
            tag: item.highlights || 'NEWS',
            title: item.name,
            time: item.duration || 'Recently',
            img: item.sub_modules || item.image?.url || '/images/gallery/news1.png',
            link: `/news/${item.slug || item.id}`,
            description: item.description || ''
          }));
          setAllNews(mappedNews);
        }
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadNews();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="w-full relative py-12 sm:py-16 bg-white text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* All AI Hot News Section */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-[#191E42] tracking-tight leading-tight mb-8">
            All AI-Hot News
          </h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <FaSpinner className="animate-spin text-brand-500" size={32} />
            </div>
          ) : allNews.length === 0 ? (
            <div className="text-center text-slate-500 py-10 bg-slate-50 rounded-2xl border border-slate-200">
              No news available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allNews.map((news, idx) => (
                <Link key={idx} href={news.link} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-slate-300 transition group cursor-pointer block flex flex-col">
                  <div 
                    className="h-48 bg-slate-100 relative bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105 shrink-0"
                    style={{ backgroundImage: `url(${news.img})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded text-white uppercase shadow-sm ${
                      news.tag === 'BREAKING' ? 'bg-red-500' : news.tag === 'TRENDING' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}>
                      {news.tag}
                    </span>
                  </div>
                  <div className="p-5 relative bg-white z-10 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors mb-2">{news.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">{news.description}</p>
                    <p className="text-xs text-brand-600 font-semibold flex items-center gap-1 mt-auto">
                      <FaCalendarAlt /> {news.time}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        


      </div>
    </div>
  );
};

export default AiHotNewsContent;
