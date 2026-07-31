'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/public/api';
import { 
  FaGraduationCap, 
  FaAward, 
  FaCheckCircle, 
  FaArrowRight, 
  FaBookOpen, 
  FaCertificate, 
  FaLock, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe, 
  FaBuilding, 
  FaSpinner, 
  FaFire,
  FaShieldAlt,
  FaBolt,
  FaCopy,
  FaQuestionCircle,
  FaCalendarAlt,
  FaShareAlt
} from 'react-icons/fa';

const LatestNewsContent: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    gender: 'Male',
    company_name: '',
    phone: '',
    email: '',
    country: '',
  });

  const [loginId, setLoginId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Success State
  const [registrationResult, setRegistrationResult] = useState<{
    token: string;
    registration_id: string;
    full_name: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post('api/certificate/register', formData);
      const uuid = response.data?.uuid || response.data?.data?.uuid || '';
      const registration_id = response.data?.registration_id || response.data?.data?.registration_id || '';

      if (typeof window !== 'undefined' && uuid) {
        localStorage.setItem('aixx_certificate_token', uuid);
      }

      setRegistrationResult({
        token: uuid,
        registration_id: registration_id,
        full_name: formData.full_name,
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to complete registration. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post('api/certificate/login', {
        registration_id: loginId.trim(),
      });
      const token = response.data?.token || '';
      const full_name = response.data?.full_name || 'Candidate';
      const regId = response.data?.registration_id || loginId;

      if (typeof window !== 'undefined' && token) {
        localStorage.setItem('aixx_certificate_token', token);
      }

      setRegistrationResult({
        token,
        registration_id: regId,
        full_name,
      });
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.response?.data?.message || 'Invalid Registration ID. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyRegId = () => {
    if (registrationResult?.registration_id) {
      navigator.clipboard.writeText(registrationResult.registration_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-slate-50 py-12 lg:py-20 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Featured News Article & Registration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Full News Article Details */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
            
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold border border-brand-200/60">
                Official Announcement
              </span>
              <span className="text-slate-500 flex items-center gap-1">
                <FaCalendarAlt className="text-slate-400" />
                July 31, 2026
              </span>
              <span className="text-slate-500 flex items-center gap-1">
                <FaGlobe className="text-slate-400" />
                Global Initiative
              </span>
            </div>

            {/* Article Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#191E42] tracking-tight leading-tight">
              AIXX Academy Launches Free AI Knowledge Certificate 2026 Edition
            </h2>

            {/* Article Intro Paragraph */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              To support professional upskilling and democratization of Artificial Intelligence across Southeast Asia and globally, AIXX Academy has officially released its flagship <strong>Free AI Knowledge Certificate 2026</strong>.
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
            
            {!registrationResult ? (
              <>
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto border border-brand-200">
                    <FaGraduationCap size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-[#191E42] tracking-tight">Claim Your Free Certificate</h3>
                  <p className="text-xs text-slate-500">
                    Register below to unlock your candidate Registration ID & portal access.
                  </p>
                </div>

                {/* Tab Switch */}
                <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                    className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === 'register' 
                        ? 'bg-brand-600 text-white shadow-md' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    New Candidate
                  </button>
                  <button
                    onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                    className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === 'login' 
                        ? 'bg-brand-600 text-white shadow-md' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Enter Reg ID
                  </button>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Tab 1: Registration */}
                {activeTab === 'register' ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                      <div className="relative">
                        <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="full_name"
                          required
                          value={formData.full_name}
                          onChange={handleInputChange}
                          placeholder="e.g. Alex Mercer"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="alex@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+65 9123 4567"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Country</label>
                        <input
                          type="text"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="Singapore"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Company / Organization</label>
                      <input
                        type="text"
                        name="company_name"
                        required
                        value={formData.company_name}
                        onChange={handleInputChange}
                        placeholder="Acme Corp"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" size={14} />
                          <span>Generating Registration ID...</span>
                        </>
                      ) : (
                        <>
                          <span>Register & Access Certificate Portal</span>
                          <FaArrowRight size={12} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Tab 2: Login */
                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Registration ID</label>
                      <div className="relative">
                        <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={loginId}
                          onChange={(e) => setLoginId(e.target.value)}
                          placeholder="e.g. AIXX-REG-105"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-slate-900 font-mono placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none text-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" size={14} />
                          <span>Verifying ID...</span>
                        </>
                      ) : (
                        <>
                          <span>Log In to Portal</span>
                          <FaArrowRight size={12} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            ) : (
              /* Success Screen */
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <FaCheckCircle size={32} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#191E42]">Registration Successful!</h3>
                  <p className="text-xs text-slate-600">
                    Welcome, <span className="font-bold text-slate-900">{registrationResult.full_name}</span>. Your registration ID is active.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Your Official Registration ID</span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-lg font-black text-brand-600 font-mono tracking-wider">
                      {registrationResult.registration_id}
                    </span>
                    <button
                      onClick={copyRegId}
                      className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Copy Registration ID"
                    >
                      <FaCopy size={14} />
                    </button>
                  </div>
                  {copied && (
                    <span className="text-[10px] text-emerald-600 font-semibold block">Copied to clipboard!</span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button
                    onClick={() => router.push(`/ai-certificate/study?token=${registrationResult.token}`)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl border border-slate-200 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaBookOpen size={14} className="text-brand-600" />
                    <span>Start Free Study Lessons</span>
                  </button>

                  <button
                    onClick={() => router.push(`/ai-certificate/test?token=${registrationResult.token}`)}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-600/20"
                  >
                    <FaGraduationCap size={16} />
                    <span>Take 20-MCQ Assessment Test</span>
                  </button>
                </div>
              </div>
            )}

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
