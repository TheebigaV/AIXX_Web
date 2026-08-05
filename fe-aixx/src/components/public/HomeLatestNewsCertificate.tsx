'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FaGraduationCap, 
  FaAward, 
  FaCheckCircle, 
  FaArrowRight, 
  FaBookOpen, 
  FaCertificate, 
  FaTimes, 
  FaFire,
  FaStar,
  FaShieldAlt,
  FaBolt,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { CertificatePortalForm } from '@/components/public/CertificatePortalForm';

const HomeLatestNewsCertificate: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleExploreStudyGuide = (e: React.MouseEvent) => {
    e.preventDefault();
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('aixx_certificate_token') : null;
    if (storedToken) {
      router.push(`/ai-certificate/study?token=${storedToken}`);
    } else {
      openModal();
    }
  };

  React.useEffect(() => {
    if (searchParams.get('register') === 'true') {
      openModal();
    }
  }, [searchParams]);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <section id="latest-news" className="w-full relative py-12 sm:py-16 lg:py-24 bg-white text-slate-900 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-[40px] sm:rounded-[60px] lg:rounded-[80px] bg-gradient-to-br from-blue-50/90 via-slate-50 to-indigo-50/40 border border-brand-200/80 shadow-2xl p-6 sm:p-10 lg:p-14 overflow-hidden">
          
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[380px] rounded-[100%] bg-gradient-to-r from-brand-400/25 via-purple-400/20 to-indigo-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-20 w-[550px] h-[280px] rounded-[100%] bg-gradient-to-l from-indigo-500/20 via-sky-400/20 to-brand-300/20 blur-3xl pointer-events-none" />
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="85%" cy="20%" rx="300" ry="150" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-500" />
            <ellipse cx="15%" cy="85%" rx="250" ry="120" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-500" />
          </svg>

          {/* ── Latest News Ticker (clickable → free course material) ── */}
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md border border-amber-200/80 px-4 py-2 rounded-full mb-8 shadow-sm relative z-10 group">
            <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-red-500 text-white text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm animate-pulse flex-shrink-0">
              <FaFire className="text-yellow-200" size={12} />
              LATEST NEWS
            </span>
            <Link
              href="/ai-certificate/study"
              className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2 hover:text-brand-600 transition-colors duration-200 cursor-pointer"
              title="Access Free Course Material"
            >
              <span className="group-hover:underline underline-offset-2">
                AIXX Free AI Knowledge Certification Program 2026 is officially live!
              </span>
              <FaExternalLinkAlt size={10} className="text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-brand-600 font-extrabold text-xs sm:text-sm tracking-widest uppercase flex items-center gap-2">
                  <FaAward className="text-brand-600" />
                  Global AI Literacy Initiative
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#191E42] tracking-tight leading-[1.15]">
                  Earn Your Official <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Free AI Knowledge</span> Certificate
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-2 max-w-2xl font-normal">
                  Elevate your professional career. Test your mastery across Prompt Engineering, LLM Architecture, RAG systems, and AI Ethics through our 20-question certification test.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-start gap-3 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-500/50 transition-all duration-300">
                  <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl flex-shrink-0"><FaBolt size={18} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">100% Free Access</h4>
                    <p className="text-xs text-slate-500 mt-0.5">No hidden fees or credit cards required</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500/50 transition-all duration-300">
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl flex-shrink-0"><FaCertificate size={18} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">20 MCQ Assessment</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Instant online grading &amp; feedback</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all duration-300">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0"><FaCheckCircle size={18} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Verified Credential</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Shareable on LinkedIn &amp; resumes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all duration-300">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl flex-shrink-0"><FaBookOpen size={18} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Full Study Material</h4>
                    <p className="text-xs text-slate-500 mt-0.5">4 preparatory modules included free</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => openModal()}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg shadow-brand-600/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-3 cursor-pointer text-sm sm:text-base"
                >
                  <span>Get Free Certificate Now</span>
                  <FaArrowRight size={14} />
                </button>
                <Link
                  href="/latest-news"
                  className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-6 py-4 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 flex items-center gap-2 text-sm"
                >
                  <FaBookOpen size={14} className="text-brand-600" />
                  <span>Read Full Announcement &amp; FAQ</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative group hover:border-brand-500/50 transition-all duration-500">
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <FaAward size={13} />
                  OFFICIAL CERTIFICATE
                </div>
                <div className="text-center space-y-4 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <FaGraduationCap size={36} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#191E42] tracking-wide">AIXX ACADEMY</h3>
                    <p className="text-xs text-slate-500 font-medium">Certificate of AI Knowledge Mastery</p>
                  </div>
                </div>
                <div className="py-6 space-y-4 text-center">
                  <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-700 font-mono">
                    REGISTRATION ID: <span className="text-brand-600 font-bold">AIXX-REG-XXXX</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    Validates core competence in Generative AI, Large Language Models, Prompting, and Responsible AI deployment.
                  </p>
                  <div className="flex items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-1.5"><FaShieldAlt className="text-emerald-600" /><span>Verified ID</span></div>
                    <div className="flex items-center gap-1.5"><FaCheckCircle className="text-brand-600" /><span>Score ≥ 80%</span></div>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => openModal()}
                    className="w-full bg-slate-900 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <FaStar size={14} className="text-amber-400" />
                    <span>Claim Your Free Certificate</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Unified Register / Login Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg md:max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <FaTimes size={18} />
            </button>

            <CertificatePortalForm onClose={closeModal} />
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeLatestNewsCertificate;
