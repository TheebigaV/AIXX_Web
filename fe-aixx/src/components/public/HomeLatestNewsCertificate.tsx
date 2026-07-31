'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  FaTimes, 
  FaSpinner, 
  FaFire,
  FaStar,
  FaShieldAlt,
  FaBolt,
  FaCopy
} from 'react-icons/fa';

const HomeLatestNewsCertificate: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const openModal = (tab: 'register' | 'login' = 'register') => {
    setActiveTab(tab);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  const handleExploreStudyGuide = (e: React.MouseEvent) => {
    e.preventDefault();
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('aixx_certificate_token') : null;
    if (storedToken) {
      router.push(`/ai-certificate/study?token=${storedToken}`);
    } else {
      openModal('register');
    }
  };

  // Check URL hash or query param on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      if (hash === '#latest-news' && searchParams.get('register') === 'true') {
        openModal('register');
      }
    }
  }, []);

  return (
    <section id="latest-news" className="w-full relative py-12 sm:py-16 lg:py-24 bg-white text-slate-900 overflow-hidden">
      
      {/* Stylish Oval Shape Main Container Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="relative rounded-[40px] sm:rounded-[60px] lg:rounded-[80px] bg-gradient-to-br from-blue-50/90 via-slate-50 to-indigo-50/40 border border-brand-200/80 shadow-2xl p-6 sm:p-10 lg:p-14 overflow-hidden">
          
          {/* Glowing Oval Background Shapes */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[380px] rounded-[100%] bg-gradient-to-r from-brand-400/25 via-purple-400/20 to-indigo-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-20 w-[550px] h-[280px] rounded-[100%] bg-gradient-to-l from-indigo-500/20 via-sky-400/20 to-brand-300/20 blur-3xl pointer-events-none" />
          
          {/* Decorative Subtle Oval Rings SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="85%" cy="20%" rx="300" ry="150" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-500" />
            <ellipse cx="15%" cy="85%" rx="250" ry="120" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-500" />
          </svg>

          {/* News & Announcement Header Ticker */}
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md border border-amber-200/80 px-4 py-2 rounded-full mb-8 shadow-sm relative z-10">
            <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-red-500 text-white text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm animate-pulse">
              <FaFire className="text-yellow-200" size={12} />
              LATEST NEWS
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2">
              AIXX Free AI Knowledge Certification Program 2026 is officially live!
            </span>
          </div>

        {/* Hero Section Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
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

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-3 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-500/50 transition-all duration-300">
                <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl flex-shrink-0">
                  <FaBolt size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">100% Free Access</h4>
                  <p className="text-xs text-slate-500 mt-0.5">No hidden fees or credit cards required</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500/50 transition-all duration-300">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl flex-shrink-0">
                  <FaCertificate size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">20 MCQ Assessment</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Instant online grading & feedback</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all duration-300">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0">
                  <FaCheckCircle size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Verified Credential</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Shareable on LinkedIn & resumes</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all duration-300">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl flex-shrink-0">
                  <FaBookOpen size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Full Study Material</h4>
                  <p className="text-xs text-slate-500 mt-0.5">4 preparatory modules included free</p>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => openModal('register')}
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
                <span>Read Full Announcement & FAQ</span>
              </Link>

              <button
                onClick={() => openModal('login')}
                className="text-xs text-slate-600 hover:text-brand-600 underline font-semibold transition-colors ml-auto sm:ml-0 cursor-pointer"
              >
                Already Registered? Enter Reg ID
              </button>
            </div>
          </div>

          {/* Right Column: Visual Certificate Card Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative group hover:border-brand-500/50 transition-all duration-500">
              
              {/* Badge overlay */}
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <FaAward size={13} />
                OFFICIAL CERTIFICATE
              </div>

              {/* Card Content Header */}
              <div className="text-center space-y-4 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <FaGraduationCap size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#191E42] tracking-wide">AIXX ACADEMY</h3>
                  <p className="text-xs text-slate-500 font-medium">Certificate of AI Knowledge Mastery</p>
                </div>
              </div>

              {/* Certificate Details Mockup */}
              <div className="py-6 space-y-4 text-center">
                <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-700 font-mono">
                  REGISTRATION ID: <span className="text-brand-600 font-bold">AIXX-REG-XXXX</span>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                  Validates core competence in Generative AI, Large Language Models, Prompting, and Responsible AI deployment.
                </p>

                <div className="flex items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <FaShieldAlt className="text-emerald-600" />
                    <span>Verified ID</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaCheckCircle className="text-brand-600" />
                    <span>Score ≥ 80%</span>
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="pt-4">
                <button
                  onClick={() => openModal('register')}
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

      {/* Interactive Registration / Login Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <FaTimes size={18} />
            </button>

            {/* Modal Header */}
            {!registrationResult ? (
              <>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto border border-brand-200">
                    <FaGraduationCap size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-[#191E42] tracking-tight">Free AI Certificate Portal</h3>
                  <p className="text-xs text-slate-500">
                    Register below to generate your Registration ID & access the certification portal.
                  </p>
                </div>

                {/* Tab Controls */}
                <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                    className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === 'register' 
                        ? 'bg-brand-600 text-white shadow-md' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    New Registration
                  </button>
                  <button
                    onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                    className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === 'login' 
                        ? 'bg-brand-600 text-white shadow-md' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Candidate Login
                  </button>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Tab 1: Registration Form */}
                {activeTab === 'register' ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
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
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="sarah@example.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                        <div className="relative">
                          <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 234 567 890"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Country</label>
                        <div className="relative">
                          <FaGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            name="country"
                            required
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="Singapore"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Company / University</label>
                      <div className="relative">
                        <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="company_name"
                          required
                          value={formData.company_name}
                          onChange={handleInputChange}
                          placeholder="Acme Corp / NUS"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none"
                        />
                      </div>
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
                          <span>Register & Claim Certificate</span>
                          <FaArrowRight size={12} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Tab 2: Candidate Login Form */
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
              /* Success State screen */
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <FaCheckCircle size={32} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#191E42]">Access Granted!</h3>
                  <p className="text-xs text-slate-600">
                    Welcome, <span className="font-bold text-slate-900">{registrationResult.full_name}</span>. Your registration details have been activated.
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      closeModal();
                      router.push(`/ai-certificate/study?token=${registrationResult.token}`);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl border border-slate-200 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaBookOpen size={14} className="text-brand-600" />
                    <span>Start Free Study Guide</span>
                  </button>

                  <button
                    onClick={() => {
                      closeModal();
                      router.push(`/ai-certificate/test?token=${registrationResult.token}`);
                    }}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-600/20"
                  >
                    <FaGraduationCap size={16} />
                    <span>Take 20-MCQ Test</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
};

export default HomeLatestNewsCertificate;
