'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FaBookOpen, FaUsers, FaNewspaper, FaBriefcase, 
  FaChartPie, FaFire, FaAtom, FaHandshake, FaArrowRight, FaWhatsapp, FaEnvelope, FaSpinner
} from 'react-icons/fa';
import { fetchPublicTrainings } from '@/lib/training';

const themes = [
  { icon: <FaBookOpen size={56} />, color: 'from-[#1B4332] to-[#2D6A4F]' },
  { icon: <FaUsers size={56} />, color: 'from-[#3A0CA3] to-[#7209B7]' },
  { icon: <FaNewspaper size={56} />, color: 'from-[#023E8A] to-[#0077B6]' },
  { icon: <FaBriefcase size={56} />, color: 'from-[#D62828] to-[#F77F00]' },
  { icon: <FaChartPie size={56} />, color: 'from-[#006D77] to-[#83C5BE]' },
  { icon: <FaFire size={56} />, color: 'from-[#9D0208] to-[#D00000]' },
  { icon: <FaAtom size={56} />, color: 'from-[#240046] to-[#5A189A]' },
  { icon: <FaHandshake size={56} />, color: 'from-[#03045E] to-[#0077B6]' }
];

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'elearning' | 'free_courses'>('all');
  
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [hotNews, setHotNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadNews = async () => {
      try {
        const response = await fetchPublicTrainings('newsletters');
        const payload = response?.data?.data || response?.data || [];
        const items = Array.isArray(payload) ? payload : [];
        if (isMounted) {
          // Map backend fields to the UI structure
          const mappedNews = items.map((item: any) => ({
            tag: item.highlights || 'NEWS',
            title: item.name,
            time: item.duration || 'Recently',
            img: item.sub_modules || '/images/gallery/news1.png',
            link: `/ai-hot-news`
          }));
          
          setHotNews(mappedNews.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        if (isMounted) {
          setLoadingNews(false);
        }
      }
    };

    const loadCourses = async () => {
      setLoadingCourses(true);
      try {
        let typeParam = activeTab === 'all' ? undefined : activeTab;
        let response;
        if (activeTab === 'all') {
          const [elearning, free] = await Promise.all([
             fetchPublicTrainings('elearning'),
             fetchPublicTrainings('free_courses')
          ]);
          const d1 = elearning?.data?.data || elearning?.data || [];
          const d2 = free?.data?.data || free?.data || [];
          response = [...d1, ...d2];
        } else {
          const res = await fetchPublicTrainings(typeParam);
          response = res?.data?.data || res?.data || [];
        }
        
        if (isMounted) {
           setCourses(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoadingCourses(false);
      }
    };

    loadNews();
    loadCourses();
    
    return () => { isMounted = false; };
  }, [activeTab]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      
      {/* Full Width Background Image Header */}
      <section className="relative w-full pt-16 pb-12 sm:pt-28 sm:pb-24 overflow-hidden mb-12 bg-black mt-0">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-70"
          style={{ backgroundImage: 'url("/images/ai_future_bg.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-white drop-shadow-lg">
              The Future is <span className="text-blue-400">AI.</span><br/>
              The <span className="text-purple-400">Journey</span> Starts Here.
            </h1>
            <p className="text-slate-300 text-lg sm:text-xl font-medium tracking-wide drop-shadow-md">
              Learn. Apply. Grow.<br/>
              Stay Ahead. Shape Tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* Course Categories Tabs */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto relative z-10 mb-8" id="courses-catalog">
        <div className="flex flex-wrap items-center justify-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'all' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            All Courses
          </button>
          <button 
            onClick={() => setActiveTab('elearning')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'elearning' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            E-Learning Modules
          </button>
          <button 
            onClick={() => setActiveTab('free_courses')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'free_courses' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Free Certificates
          </button>
        </div>
      </section>

      {/* Course Listing based on Tabs */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lgmid:grid-cols-3 gap-6">
          {loadingCourses ? (
            <div className="col-span-1 md:col-span-2 lgmid:col-span-3 flex justify-center py-10">
               <FaSpinner className="animate-spin text-brand-500" size={32} />
            </div>
          ) : courses.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lgmid:col-span-3 flex justify-center py-10 text-slate-500 font-medium">
               No courses available in this category.
            </div>
          ) : courses.map((course, idx) => {
            const theme = themes[idx % themes.length];
            return (
              <Link 
                key={idx} 
                href={course.type === 'free_courses' ? '/ai-certificate' : `/courses/${course.slug}`} 
                className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden relative"
              >
                <div className={`h-2 relative bg-gradient-to-r ${theme.color}`} />
                <div className="p-6 flex-1 flex flex-col">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <FaBookOpen size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-brand-600 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                    {course.description || 'Enhance your AI knowledge with this comprehensive course module.'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {course.type === 'free_courses' ? 'Free Certificate' : 'E-Learning'}
                    </span>
                    <span className="text-brand-600 group-hover:translate-x-1 transition-transform">
                      <FaArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* AI Hot News */}
      <section id="ai-hot-news" className="px-4 sm:px-6 max-w-7xl mx-auto mb-12 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
            <FaFire className="text-orange-500" /> AI-HOT NEWS
          </h2>
          <Link href="/ai-hot-news" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold">
            View All <FaArrowRight size={10} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loadingNews ? (
            <div className="col-span-1 sm:col-span-3 flex justify-center py-10">
              <FaSpinner className="animate-spin text-blue-500" size={24} />
            </div>
          ) : hotNews.length === 0 ? (
            <div className="col-span-1 sm:col-span-3 text-center text-slate-500 py-10">
              No news available at the moment.
            </div>
          ) : (
            hotNews.map((news, idx) => (
              <Link key={idx} href={news.link} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-slate-300 transition group cursor-pointer block">
                <div 
                  className="h-32 bg-slate-100 relative bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${news.img})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase shadow-sm ${
                    news.tag === 'BREAKING' ? 'bg-red-500' : news.tag === 'TRENDING' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}>
                    {news.tag}
                  </span>
                </div>
                <div className="p-4 relative bg-white z-10">
                  <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{news.title}</h3>
                  <p className="text-xs text-purple-600 mt-2 font-medium">{news.time}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>


    </div>
  );
}
