'use client';

import React from 'react';
import { 
  FaAward, 
  FaCheckCircle, 
  FaQuestionCircle,
  FaCalendarAlt,
  FaShareAlt
} from 'react-icons/fa';
import { CertificatePortalForm } from '@/components/public/CertificatePortalForm';

const LatestNewsContent: React.FC = () => {
  return (
    <div className="w-full relative py-12 sm:py-16 bg-white text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Article Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Article Body */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt />
                August 4, 2026
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="bg-brand-50 text-brand-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Education Initiative
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <button className="flex items-center gap-1 hover:text-brand-600 transition-colors cursor-pointer">
                <FaShareAlt />
                Share
              </button>
            </div>

            {/* Article Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#191E42] tracking-tight leading-tight">
              AIXX Academy Launches Free AI Knowledge Certificate 2026 Edition
            </h2>

            {/* Article Intro Paragraph */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              To support professional upskilling and democratization of Artificial Intelligence Southeast Asia and globally, AIXX Academy has officially released its flagship <strong>Free AI Knowledge Certificate 2026</strong>.
            </p>

            <hr className="border-slate-100" />

            {/* Program Highlights */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FaAward className="text-brand-600" />
                What the Certification Program Covers
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                The assessment evaluates fundamental and practical competence across 4 core domains:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <span className="text-xs font-bold text-brand-600 block uppercase tracking-wider mb-1">Module 1</span>
                  <h4 className="text-sm font-extrabold text-slate-900">LLMs & Generative AI</h4>
                  <p className="text-xs text-slate-500 mt-1">Foundations of modern transformer architectures and language models.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <span className="text-xs font-bold text-purple-600 block uppercase tracking-wider mb-1">Module 2</span>
                  <h4 className="text-sm font-extrabold text-slate-900">Prompt Engineering</h4>
                  <p className="text-xs text-slate-500 mt-1">Chain-of-thought, zero-shot, and advanced prompt optimization techniques.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <span className="text-xs font-bold text-emerald-600 block uppercase tracking-wider mb-1">Module 3</span>
                  <h4 className="text-sm font-extrabold text-slate-900">RAG & Vector Databases</h4>
                  <p className="text-xs text-slate-500 mt-1">Retrieval-augmented generation and enterprise knowledge search.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <span className="text-xs font-bold text-amber-600 block uppercase tracking-wider mb-1">Module 4</span>
                  <h4 className="text-sm font-extrabold text-slate-900">Ethics & AI Governance</h4>
                  <p className="text-xs text-slate-500 mt-1">Responsible AI alignment, security, and prompt injection mitigation.</p>
                </div>
              </div>
            </div>

            {/* Key Benefits List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-bold text-slate-900">Candidate Benefits</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                  <span><strong>100% Free Online Access:</strong> Zero registration or hidden credential fees.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                  <span><strong>Instant Certificate Delivery:</strong> Download your verified PDF certificate immediately after scoring 80%+.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                  <span><strong>Unique Registration ID:</strong> Verifiable credential link to share on LinkedIn and digital resumes.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Embedded Registration & Login Form Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 sticky top-24">
            <CertificatePortalForm />
          </div>

        </div>

        {/* Frequently Asked Questions Section */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200/80 shadow-md space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-brand-600 font-extrabold text-xs tracking-widest uppercase flex items-center justify-center gap-2">
              <FaQuestionCircle />
              Certification FAQ
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#191E42]">Frequently Asked Questions</h3>
            <p className="text-slate-600 text-sm">Got questions about the Free AI Knowledge Certificate? Find your answers below.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Is the certificate really 100% free?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes! There are no hidden subscription charges or payment details required to complete the study lessons or take the 20 MCQ assessment.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">What score is required to pass?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Candidates must achieve a score of 80% or higher on the 20-question multiple-choice assessment to earn the official credential.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Can I retake the assessment if I fail?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes, you can review the study lessons and retake the 20-question assessment anytime using your Registration ID.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">How do I display my certificate?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upon passing, your verified certificate is available for instant PDF download and can be added to your LinkedIn certifications.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LatestNewsContent;
