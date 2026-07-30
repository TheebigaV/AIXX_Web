'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/public/api';
import Link from 'next/link';
import { FaTimesCircle, FaSpinner, FaBookOpen, FaChevronRight, FaGraduationCap } from 'react-icons/fa';
import StudyGuide from '@/components/public/StudyGuide';

function StudyPageContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(true);
    const [tokenError, setTokenError] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [alreadyPassed, setAlreadyPassed] = useState(false);

    useEffect(() => {
        if (!token) {
            setTokenError('Missing token. Please access this page using the link provided upon registration.');
            setLoading(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await api.get(`api/certificate/verify-token?token=${token}`);
                const data = response.data;

                setCandidateName(data.full_name);

                if (data.already_passed) {
                    setAlreadyPassed(true);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } catch (err: any) {
                console.error('Verification failed:', err);
                setTokenError(err.response?.data?.message || 'Invalid or expired token.');
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20">
                <FaSpinner className="animate-spin text-brand-600 mb-4" size={40} />
                <p className="text-slate-600 font-medium">Verifying access token and loading study materials...</p>
            </div>
        );
    }

    if (tokenError) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <FaTimesCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
                <p className="text-slate-600 max-w-md mb-8">{tokenError}</p>
                <Link
                    href="/ai-certificate"
                    className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                    Return to Registration
                </Link>
            </div>
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
                    className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition"
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
                    <StudyGuide token={token || ''} candidateName={candidateName} />
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
