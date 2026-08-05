'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/public/api';
import Link from 'next/link';
import { 
  FaTimesCircle, 
  FaSpinner, 
  FaBookOpen, 
  FaChevronRight, 
  FaGraduationCap, 
  FaUser, 
  FaLock, 
  FaKey,
  FaTimes
} from 'react-icons/fa';
import StudyGuide from '@/components/public/StudyGuide';
import { CertificatePortalForm } from '@/components/public/CertificatePortalForm';

function StudyPageContent() {
    const searchParams = useSearchParams();
    const tokenFromUrl = searchParams.get('token');

    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [tokenError, setTokenError] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [candidateRegId, setCandidateRegId] = useState('');
    const [alreadyPassed, setAlreadyPassed] = useState(false);

    // Login Form State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginId, setLoginId] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Registration Modal State
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // On mount, check URL query parameters and local storage
    useEffect(() => {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('aixx_certificate_token') : null;
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            if (typeof window !== 'undefined') {
                localStorage.setItem('aixx_certificate_token', tokenFromUrl);
            }
        } else if (storedToken) {
            setToken(storedToken);
        } else {
            setLoading(false);
        }
    }, [tokenFromUrl]);

    // Verify token validity when token state changes
    useEffect(() => {
        if (!token) return;

        const verifyToken = async () => {
            setLoading(true);
            try {
                const response = await api.get(`api/certificate/verify-token?token=${token}`);
                const data = response.data;

                setCandidateName(data.full_name);
                setCandidateRegId(data.registration_id || '');

                // Mark study guide as visited so the test unlocks
                if (typeof window !== 'undefined') {
                    localStorage.setItem('aixx_study_guide_visited', 'true');
                }

                if (data.already_passed) {
                    setAlreadyPassed(true);
                } else {
                    setAlreadyPassed(false);
                }
                setTokenError('');
            } catch (err: any) {
                console.error('Verification failed:', err);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('aixx_certificate_token');
                }
                setToken(null);
                setTokenError('Your session token has expired or is invalid. Please log in again.');
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        try {
            const response = await api.post('api/certificate/login', {
                email: loginEmail,
                registration_id: loginId
            });
            const newToken = response.data.token;
            if (newToken) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('aixx_certificate_token', newToken);
                    localStorage.setItem('aixx_candidate_name', response.data.full_name || '');
                    localStorage.setItem('aixx_candidate_email', response.data.email || loginEmail);
                    localStorage.setItem('aixx_candidate_reg_id', response.data.registration_id || loginId);
                    window.dispatchEvent(new Event('aixx-auth-change'));
                }
                setToken(newToken);
            }
        } catch (err: any) {
            setLoginError(err.response?.data?.message || 'Invalid Registered Email or Registration ID.');
        } finally {
            setLoginLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20">
                <FaSpinner className="animate-spin text-brand-600 mb-4" size={40} />
                <p className="text-slate-655 font-bold">Verifying credentials and loading portal...</p>
            </div>
        );
    }

    // Render Login Page if no token is active
    if (!token) {
        return (
            <>
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xl space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-brand-500/10 text-brand-600 rounded-full flex items-center justify-center mx-auto border border-brand-500/20">
                            <FaLock size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Portal Login</h2>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                            Please log in with your registered email and Registration ID to unlock the study lessons.
                        </p>
                    </div>

                    {loginError && (
                        <div className="bg-red-50 border border-red-200 text-red-655 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
                            <FaTimesCircle className="text-red-500 flex-shrink-0" size={14} />
                            <span>{loginError}</span>
                        </div>
                    )}

                    {tokenError && !loginError && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-850 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
                            <FaTimesCircle className="text-amber-500 flex-shrink-0" size={14} />
                            <span>{tokenError}</span>
                        </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        {/* Registered Email Input */}
                        <div>
                            <label className="text-xs font-extrabold text-slate-600 block mb-1">Registered Email Address <span className="text-brand-600">*</span></label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FaUser size={12} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    placeholder="student@example.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs sm:text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Registration ID Input */}
                        <div>
                            <label className="text-xs font-extrabold text-slate-600 block mb-1">Registration ID <span className="text-brand-600">*</span></label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FaKey size={12} />
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={loginId}
                                    onChange={(e) => setLoginId(e.target.value)}
                                    placeholder="e.g. AIXX-REG-1"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs sm:text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white transition-all font-mono"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-brand-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {loginLoading ? (
                                <>
                                    <FaSpinner className="animate-spin" size={14} />
                                    <span>Authenticating &amp; Unlocking...</span>
                                </>
                            ) : (
                                <>
                                    <span>Log In &amp; Unlock Portal</span>
                                    <FaChevronRight size={10} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={() => setShowRegisterModal(true)}
                            className="text-xs text-slate-500 hover:text-brand-600 underline font-medium cursor-pointer"
                        >
                            Don&apos;t have an account? Register Here
                        </button>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {showRegisterModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-lg md:max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 space-y-6 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowRegisterModal(false)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <FaTimes size={18} />
                        </button>
                        <CertificatePortalForm
                            onClose={() => setShowRegisterModal(false)}
                            onSuccess={(studentData) => {
                                setShowRegisterModal(false);
                                setToken(studentData.token);
                            }}
                        />
                    </div>
                </div>
            )}
            </>
        );
    }

    if (alreadyPassed) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <FaBookOpen size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Already Completed</h2>
                <p className="text-slate-600 max-w-md mb-8">
                    Congratulations, {candidateName}! You have already completed this test and earned your certificate.
                </p>
                <Link
                    href={`/ai-certificate/test?token=${token}`}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition cursor-pointer"
                >
                    View Your Certificate
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[95%] xl:max-w-[90%] mx-auto space-y-8">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-brand-950 rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border border-white/5">
                    {/* Glowing background circles */}
                    <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-[-30%] left-[-10%] w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
                    {/* Decorative cyber grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />

                    <div className="space-y-4 relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-450 border border-brand-500/30 rounded-full px-4.5 py-1.5 text-xs font-black uppercase tracking-widest">
                            AIXX Academy Study Portal
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
                            Free AI Knowledge Certificate Study Course
                        </h1>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-medium">
                            Study the 4 interactive lesson modules below. Once all modules are completed, the final 20-question MCQ certification assessment will unlock at the bottom of the page.
                        </p>
                    </div>

                    <div className="flex-shrink-0 z-10 hidden md:flex items-center justify-center w-28 h-28 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner text-brand-400 rotate-3 hover:rotate-6 transition-all duration-300">
                        <FaGraduationCap size={48} className="drop-shadow-lg" />
                    </div>
                </div>

                {/* Full-width Study Guide Lessons */}
                <div className="w-full">
                    <StudyGuide token={token || ''} candidateName={candidateName} candidateRegId={candidateRegId} />
                </div>
            </div>
        </div>
    );
}

export default function StudyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20">
                <FaSpinner className="animate-spin text-brand-600 mb-4" size={40} />
                <p className="text-slate-600 font-medium">Loading study portal...</p>
            </div>
        }>
            <StudyPageContent />
        </Suspense>
    );
}
