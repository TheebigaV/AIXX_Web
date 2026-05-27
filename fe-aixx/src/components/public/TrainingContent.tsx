'use client';

import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaChalkboardTeacher, FaLaptopCode, FaCertificate, FaCheckCircle, FaArrowRight, FaNewspaper } from 'react-icons/fa';
import { fetchPublicTrainings } from '@/lib/training';

const tabs = [
  { id: 'seminars', label: 'Seminars', icon: FaChalkboardTeacher },
  { id: 'workshops', label: 'Workshops', icon: FaLaptopCode },
  { id: 'courses', label: 'Courses', icon: FaGraduationCap },
  { id: 'certification', label: 'Skill Training & Certification', icon: FaCertificate },
  { id: 'newsletters', label: 'News Letters', icon: FaNewspaper },
];

interface TrainingItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  image?: {
    url: string;
  } | null;
}

const TrainingContent = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicTrainings()
      .then((res) => {
        setTrainings(res.data.data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch trainings:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredItems = trainings.filter((item) => item.type === activeTab);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      );
    }

    switch (activeTab) {
      case 'seminars':
        return (
          <div className="animate-fade-in-up">
            <h3 className="text-3xl font-bold text-[#191E42] mb-6">Expert-Led Seminars</h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Join our exclusive seminars hosted by industry pioneers and thought leaders. Gain deep insights into the future of AI, Quantum Computing, and advanced technological paradigms. Our seminars are designed to provoke thought, inspire innovation, and connect you with global tech ecosystems.
            </p>
            {filteredItems.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex items-start gap-4">
                    {item.image?.url ? (
                      <img src={item.image.url} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                        <FaCheckCircle />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-[#191E42] mb-2">{item.name}</h4>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No seminars currently scheduled. Check back soon!</p>
            )}
          </div>
        );
      case 'workshops':
        return (
          <div className="animate-fade-in-up">
            <h3 className="text-3xl font-bold text-[#191E42] mb-6">Interactive Workshops</h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Our hands-on workshops bridge the gap between theoretical knowledge and practical application. Participate in collaborative sessions where you'll build, break, and innovate using the latest tools in AI and deep tech.
            </p>
            {filteredItems.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex items-start gap-4">
                    {item.image?.url ? (
                      <img src={item.image.url} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                        <FaCheckCircle />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-[#191E42] mb-2">{item.name}</h4>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No workshops currently scheduled. Check back soon!</p>
            )}
          </div>
        );
      case 'courses':
        return (
          <div className="animate-fade-in-up">
            <h3 className="text-3xl font-bold text-[#191E42] mb-6">Comprehensive Courses</h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Enroll in our structured, multi-week courses designed to take you from fundamentals to advanced mastery. Whether you are transitioning into deep tech or upskilling your current team, our curriculum covers all bases.
            </p>
            {filteredItems.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex items-start gap-4">
                    {item.image?.url ? (
                      <img src={item.image.url} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                        <FaCheckCircle />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-[#191E42] mb-2">{item.name}</h4>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                    <FaArrowRight size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-400">Coming Soon</h4>
                    <p className="text-sm text-slate-400">New courses are currently in development.</p>
                  </div>
                </li>
              </ul>
            )}
          </div>
        );
      case 'certification':
        return (
          <div className="animate-fade-in-up">
            <h3 className="text-3xl font-bold text-[#191E42] mb-6">Skill Training & Certification</h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Validate your expertise with globally recognized certifications. Our skill training programs are heavily aligned with industry demands, ensuring that upon completion, you are ready to tackle enterprise-level challenges.
            </p>
            {filteredItems.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex items-start gap-4">
                    {item.image?.url ? (
                      <img src={item.image.url} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                        <FaCheckCircle />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-[#191E42] mb-2">{item.name}</h4>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#191E42] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl mb-8">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500 rounded-full blur-3xl opacity-30 pointer-events-none" />
                <div className="relative z-10">
                  <h4 className="text-2xl font-bold mb-4">Job Opportunities & Placement</h4>
                  <p className="text-slate-300 mb-6 max-w-xl">
                    Graduates of our certification programs gain exclusive access to our career network. We connect top talent directly with our enterprise partners seeking specialized skills.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setActiveTab('courses')}
                      className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      Apply for Certification <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'newsletters':
        return (
          <div className="animate-fade-in-up">
            <h3 className="text-3xl font-bold text-[#191E42] mb-6">News Letters & Updates</h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Stay connected with the ever-evolving landscape of deep tech. Subscribe to our newsletters for the latest breakthroughs, exclusive use-cases, and trending topics.
            </p>
            {filteredItems.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex items-start gap-4">
                    {item.image?.url ? (
                      <img src={item.image.url} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                        <FaCheckCircle />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-[#191E42] mb-2">{item.name}</h4>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No newsletters currently available. Check back soon!</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
      <div className="w-full container mx-auto px-[16px] sm:px-[16px] md:px-[24px] lg:px-[28px] xl:px-[75px] 2xl:px-[240px] relative z-10">
        
        {/* Header Area */}
        <div className="text-center w-full mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#191E42] mb-6 tracking-tight">
            Elevate Your Expertise
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Discover a comprehensive suite of learning pathways. Whether you are looking for a brief seminar or full professional certification, AIXX offers industry-leading education.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col lg:flex-row gap-12 w-full mx-auto">
          {/* Sidebar Tabs */}
          <div className="lg:w-1/3 flex flex-col gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 w-full p-5 rounded-2xl transition-all duration-300 text-left border ${
                    isActive 
                      ? 'bg-white border-brand-500 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-brand-600 transform scale-[1.02]' 
                      : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-600 hover:text-[#191E42]'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-brand-50 text-brand-600' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className={`font-bold text-lg ${isActive ? 'text-[#191E42]' : ''}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 min-h-[500px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingContent;
