'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/public/api';
import Link from 'next/link';
import { 
    FaCheckCircle, 
    FaTimesCircle, 
    FaHourglassHalf, 
    FaAward, 
    FaArrowRight, 
    FaArrowLeft, 
    FaDownload, 
    FaSpinner, 
    FaChevronRight, 
    FaLock, 
    FaUser, 
    FaKey, 
    FaTimes, 
    FaBookOpen,
    FaShareAlt,
    FaListUl,
    FaShieldAlt,
    FaHome,
    FaCommentDots,
    FaVideo,
    FaImage,
    FaCode
} from 'react-icons/fa';
import { CertificatePortalForm } from '@/components/public/CertificatePortalForm';

interface Question {
    id: number;
    question: string;
    options: Record<string, string>;
}

// 4 Module Metadata structure matching Figure 1
const MODULE_METADATA = [
    {
        id: 1,
        title: "Module 1: Basics of AI",
        subtitle: "Learn fundamental AI, Machine Learning, and Neural Network concepts.",
        pill: "MODULE 1 OF 4",
        shortName: "Basics of AI"
    },
    {
        id: 2,
        title: "Module 2: AI in Daily Life",
        subtitle: "Explore daily applications, AI chatbots, and productivity workflows.",
        pill: "MODULE 2 OF 4",
        shortName: "AI in Daily Life"
    },
    {
        id: 3,
        title: "Module 3: Using AI Tools",
        subtitle: "Learn how to use popular AI tools safely and effectively.",
        pill: "MODULE 3 OF 4",
        shortName: "Using AI Tools"
    },
    {
        id: 4,
        title: "Module 4: AI & The Future",
        subtitle: "Discover upcoming trends, ethics, AI alignment, and emerging tech.",
        pill: "MODULE 4 OF 4",
        shortName: "AI & The Future"
    }
];

function TestPageContent() {
    const searchParams = useSearchParams();
    const tokenFromUrl = searchParams.get('token');
    const [token, setToken] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [tokenError, setTokenError] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [candidateRegId, setCandidateRegId] = useState('');
    const [alreadyPassed, setAlreadyPassed] = useState(false);
    const [passedAt, setPassedAt] = useState('');
    const [savedScore, setSavedScore] = useState(0);
    const [studyGuideVisited, setStudyGuideVisited] = useState(true);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [activeModuleIndex, setActiveModuleIndex] = useState(0); // 0, 1, 2, 3
    const [answers, setAnswers] = useState<Record<number, string>>({});

    // Grading states
    const [submittingTest, setSubmittingTest] = useState(false);
    const [testResult, setTestResult] = useState<{
        passed: boolean;
        score: number;
        correct_count: number;
        total_questions: number;
        full_name: string;
        passed_at: string;
        results_details?: {
            question: string;
            options: Record<string, string>;
            selected_option: string;
            correct_option: string;
            is_correct: boolean;
            explanation: string;
        }[];
    } | null>(null);

    // Login Form State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginId, setLoginId] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Registration Modal State
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const certificateRef = useRef<SVGSVGElement>(null);

    // On mount, check URL query parameters and local storage
    useEffect(() => {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('aixx_certificate_token') : null;
        const visited = typeof window !== 'undefined' ? !!localStorage.getItem('aixx_study_guide_visited') : true;
        setStudyGuideVisited(visited);
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
                setCandidateRegId(data.registration_id || 'AIXX-FC-SG-2026-0001');

                if (data.already_passed) {
                    setAlreadyPassed(true);
                    setSavedScore(data.score);
                    setPassedAt(data.passed_at);
                    setLoading(false);
                } else {
                    // Fetch test questions
                    const questionsResponse = await api.get(`api/certificate/questions?token=${token}`);
                    setQuestions(questionsResponse.data.questions);
                    setLoading(false);
                }
                setTokenError('');
            } catch (err: any) {
                console.error('Verification failed:', err);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('aixx_certificate_token');
                }
                setToken(null);
                setTokenError('Your session token has expired or is invalid. Please log in again.');
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

    const handleSelectOption = (questionId: number, optionKey: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
    };

    const handleSubmitTest = async () => {
        if (Object.keys(answers).length < questions.length) {
            const confirmSubmit = window.confirm(`You have answered ${Object.keys(answers).length} out of ${questions.length} questions. Are you sure you want to submit?`);
            if (!confirmSubmit) return;
        }

        setSubmittingTest(true);
        try {
            const response = await api.post('api/certificate/submit-test', {
                token,
                answers
            });
            setTestResult(response.data);
            if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err: any) {
            console.error('Test submission failed:', err);
            alert('Failed to submit test. Please try again.');
        } finally {
            setSubmittingTest(false);
        }
    };

    const handleDownloadPNG = () => {
        if (!certificateRef.current) return;

        const svg = certificateRef.current;
        const svgString = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1200;
            canvas.height = 840;
            const context = canvas.getContext('2d');

            if (context) {
                context.drawImage(image, 0, 0, 1200, 840);
                const png = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = png;
                downloadLink.download = `AIXX_Digital_Certificate_${(candidateName || 'Candidate').replace(/\s+/g, '_')}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        };
        image.src = blobURL;
    };

    const handleShareCertificate = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'AIXX AI Knowledge Certificate',
                    text: `Check out my verified AI Certificate of Completion from AIXX Academy!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share error:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Certificate link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center py-20">
                <FaSpinner className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-slate-600 font-bold">Verifying credentials and loading assessment...</p>
            </div>
        );
    }

    // ── Study Guide Gate ──────────────────────────────────────────────────────
    if (token && !studyGuideVisited) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center px-4 py-20">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
                    <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                        <FaLock size={28} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Study Guide Required</h2>
                        <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                            You need to complete the <strong className="text-blue-600">Study Guide</strong> before taking the certification test.
                        </p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-amber-800 text-left flex items-start gap-2">
                        <FaLock size={11} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <span>The test unlocks automatically after you visit the Study Guide.</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link
                            href={`/ai-certificate/study?token=${token}`}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                        >
                            <FaBookOpen size={14} />
                            Go to Study Guide
                        </Link>
                        <Link
                            href="/courses?view=free-certificate"
                            className="text-xs text-slate-500 hover:text-blue-600 font-medium transition"
                        >
                            ← Back to Free Certificate
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Render Login Page if no token is active
    if (!token) {
        return (
            <>
            <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center px-4 py-20">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                            <FaLock size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Portal Login</h2>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                            Please log in with your registered email and Registration ID to unlock the assessment and digital certificate.
                        </p>
                    </div>

                    {loginError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
                            <FaTimesCircle className="text-red-500 flex-shrink-0" size={14} />
                            <span>{loginError}</span>
                        </div>
                    )}

                    {tokenError && !loginError && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
                            <FaTimesCircle className="text-amber-600 flex-shrink-0" size={14} />
                            <span>{tokenError}</span>
                        </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-extrabold text-slate-700 block mb-1">Registered Email Address <span className="text-blue-600">*</span></label>
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
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-extrabold text-slate-700 block mb-1">Registration ID <span className="text-blue-600">*</span></label>
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
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-all font-mono placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                            className="text-xs text-blue-600 hover:text-blue-700 underline font-medium cursor-pointer"
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

    if (tokenError) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 border border-red-200">
                    <FaTimesCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h2>
                <p className="text-slate-600 max-w-md mb-8">{tokenError}</p>
                <button
                    onClick={() => {
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('aixx_certificate_token');
                        }
                        setToken(null);
                        setTokenError('');
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition cursor-pointer shadow-md"
                >
                    Log In Again
                </button>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Success State — Candidate Certificate View (Matching Figure 2!)
    // ─────────────────────────────────────────────────────────────────────────
    if (alreadyPassed) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Top Header matching Figure 2 */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/courses"
                            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-sm transition"
                        >
                            <FaArrowLeft size={14} />
                        </Link>
                        <div className="text-center">
                            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                                YOUR <span className="text-blue-600">CERTIFICATE</span>
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">Your achievement. Your future.</p>
                        </div>
                        <Link
                            href="/"
                            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-sm transition"
                        >
                            <FaHome size={14} />
                        </Link>
                    </div>

                    {/* Digital Certificate Display Container */}
                    <div className="relative group">
                        <CertificateWebCard
                            name={candidateName}
                            courseTitle="AI Free Course – General AI Knowledge for Everyday Life"
                            regNo={candidateRegId || 'AIXX-FC-SG-2026-0001'}
                            date={passedAt || '2026'}
                        />
                    </div>

                    {/* Hidden SVG ref for high-res PNG download */}
                    <div className="hidden">
                        <CertificateSVGTemplate
                            ref={certificateRef}
                            name={candidateName}
                            regNo={candidateRegId || 'AIXX-FC-SG-2026-0001'}
                            date={passedAt || '2026'}
                        />
                    </div>

                    {/* Certificate Action Buttons matching Figure 2 */}
                    <div className="max-w-md mx-auto pt-2">
                        <button
                            onClick={handleDownloadPNG}
                            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm tracking-wide"
                        >
                            <FaDownload size={15} />
                            <span>Download Certificate</span>
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Test Result Submitted View (Pass or Fail + Assessment Review)
    // ─────────────────────────────────────────────────────────────────────────
    if (testResult) {
        const isPass = testResult.passed;

        return (
            <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto space-y-10">

                    {isPass ? (
                        <>
                            <div className="text-center space-y-3 animate-fadeIn">
                                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-4 py-1 font-semibold text-xs uppercase tracking-wider">
                                    <FaAward /> Assessment Passed
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                                    Congratulations! You Passed!
                                </h1>
                                <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
                                    You scored <strong className="text-emerald-600 font-bold">{testResult.score}%</strong> on {testResult.passed_at}. Below is your official AI Knowledge Certificate.
                                </p>
                            </div>

                            {/* Digital Certificate Card matching Figure 2 */}
                            <CertificateWebCard
                                name={testResult.full_name}
                                courseTitle="AI Free Course – General AI Knowledge for Everyday Life"
                                regNo={candidateRegId || 'AIXX-FC-SG-2026-0001'}
                                date={testResult.passed_at}
                            />

                            {/* Hidden SVG ref for high-res PNG download */}
                            <div className="hidden">
                                <CertificateSVGTemplate
                                    ref={certificateRef}
                                    name={testResult.full_name}
                                    regNo={candidateRegId || 'AIXX-FC-SG-2026-0001'}
                                    date={testResult.passed_at}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="max-w-md mx-auto">
                                <button
                                    onClick={handleDownloadPNG}
                                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
                                >
                                    <FaDownload size={15} />
                                    <span>Download Certificate</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-red-200 shadow-xl text-center space-y-6 animate-fadeIn mt-6">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
                                <FaTimesCircle size={36} />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-extrabold text-slate-900">Assessment Unsuccessful</h2>
                                <p className="text-slate-600 text-sm">
                                    You scored <strong className="text-red-600 font-bold">{testResult.score}%</strong>. A score of <strong className="text-emerald-600 font-bold">80%</strong> is required to earn your certificate.
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-700 text-left space-y-1 border border-slate-200">
                                <p className="font-bold text-slate-900">Performance Summary:</p>
                                <p>• Correct Answers: {testResult.correct_count} / {testResult.total_questions}</p>
                                <p>• Required: 16 / 20 correct answers</p>
                            </div>

                            <button
                                onClick={() => {
                                    setTestResult(null);
                                    setActiveModuleIndex(0);
                                    if (typeof window !== 'undefined') {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition w-full block text-center shadow-md text-sm cursor-pointer"
                            >
                                Re-take Assessment
                            </button>
                        </div>
                    )}

                    {/* Detailed Module Assessment Review matching Figure 1 */}
                    {testResult.results_details && testResult.results_details.length > 0 && (
                        <AssessmentReviewSection results={testResult.results_details} />
                    )}

                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Active Test Engine UI — 4 Module Based Layout (Matching Figure 1!)
    // ─────────────────────────────────────────────────────────────────────────
    // Group all 20 questions into 4 modules (5 questions per module)
    const questionsPerModule = 5;
    const currentModuleMeta = MODULE_METADATA[activeModuleIndex];
    const moduleStartIndex = activeModuleIndex * questionsPerModule;
    const moduleQuestions = questions.slice(moduleStartIndex, moduleStartIndex + questionsPerModule);

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = questions.length || 20;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Top Header Bar matching Figure 1 */}
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 gap-3">
                    <Link
                        href="/courses"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 shadow-sm transition flex-shrink-0"
                    >
                        <FaArrowLeft size={13} />
                    </Link>
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center">
                        <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">AIXX ACADEMY</span>
                        <span className="hidden sm:inline text-slate-300">|</span>
                        <span className="text-[10px] sm:text-[11px] uppercase font-bold text-blue-700 tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">AI · INNOVATE · EXCEL</span>
                    </div>
                    <Link
                        href="/"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 shadow-sm transition flex-shrink-0"
                    >
                        <FaHome size={13} />
                    </Link>
                </div>

                {/* Header Module Banner matching Figure 1 */}
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 border border-blue-100/80 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-6">
                    {/* Background glow circle */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200/20 blur-3xl pointer-events-none rounded-full" />
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-200/20 blur-3xl pointer-events-none rounded-full" />

                    <div className="space-y-1.5 sm:space-y-3 relative z-10 max-w-xl w-full">
                        <span className="inline-block bg-purple-100 text-purple-700 border border-purple-200 text-[9px] sm:text-[11px] font-black tracking-widest px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase">
                            {currentModuleMeta.pill}
                        </span>
                        <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                            <span className="text-purple-700">{currentModuleMeta.title.split(':')[0]}:</span>{' '}
                            <span className="text-slate-900">{currentModuleMeta.title.split(':')[1]}</span>
                        </h2>
                        <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed font-medium">
                            {currentModuleMeta.subtitle}
                        </p>
                    </div>

                    {/* Glowing AI Graphics Illustration on Right matching Figure 1 */}
                    <div className="relative z-10 flex-shrink-0 w-full md:w-auto flex justify-center">
                        <div className="relative w-full max-w-[130px] sm:max-w-[200px] md:w-44 h-16 sm:h-28 md:h-32 bg-white rounded-xl sm:rounded-2xl border border-blue-100 shadow-md flex flex-col items-center justify-center p-1.5 sm:p-3 text-center overflow-hidden group">
                            {/* Circuit grid background */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:12px_12px]" />
                            
                            {/* Central Glowing AI Chip */}
                            <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5 shadow-md shadow-blue-500/20 mb-0.5 sm:mb-1 z-10 animate-pulse">
                                <div className="w-full h-full bg-white rounded-[7px] sm:rounded-[10px] flex items-center justify-center text-blue-600 font-black text-xs sm:text-xl">
                                    AI
                                </div>
                            </div>

                            {/* Floating Icons */}
                            <div className="absolute top-1 left-2 text-purple-500 opacity-80 animate-bounce">
                                <FaCommentDots size={10} className="sm:w-3 sm:h-3" />
                            </div>
                            <div className="absolute top-1 right-2 text-blue-500 opacity-80 animate-pulse">
                                <FaVideo size={10} className="sm:w-3 sm:h-3" />
                            </div>
                            <div className="absolute bottom-1 left-2 text-emerald-500 opacity-80">
                                <FaImage size={10} className="sm:w-3 sm:h-3" />
                            </div>
                            <div className="absolute bottom-1 right-2 text-indigo-500 opacity-80">
                                <FaCode size={10} className="sm:w-3 sm:h-3" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4-Module Stepper Navigation Bar matching Figure 1 */}
                <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 relative">
                        {MODULE_METADATA.map((mod, idx) => {
                            const isActive = idx === activeModuleIndex;
                            const isModuleCompleted = questions
                                .slice(idx * questionsPerModule, (idx + 1) * questionsPerModule)
                                .every(q => answers[q.id]);

                            return (
                                <button
                                    key={mod.id}
                                    onClick={() => setActiveModuleIndex(idx)}
                                    className={`flex flex-col items-center text-center p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer border ${
                                        isActive
                                            ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-sm ring-1 ring-purple-400'
                                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                    }`}
                                >
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black mb-1 sm:mb-1.5 transition-all ${
                                        isActive 
                                            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-300' 
                                            : isModuleCompleted 
                                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                                                : 'bg-slate-200 text-slate-600 border border-slate-300'
                                    }`}>
                                        {isModuleCompleted && !isActive ? <FaCheckCircle size={11} /> : mod.id}
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] font-extrabold tracking-tight line-clamp-1">Module {mod.id}</span>
                                    <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 line-clamp-1">{mod.shortName}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Questions Section Header matching Figure 1 */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                            <FaListUl size={14} />
                        </div>
                        <span className="text-sm font-extrabold text-slate-900">
                            20 MCQ Questions <span className="text-slate-400 font-normal">| 1 Point Each</span>
                        </span>
                    </div>
                    <div className="text-xs font-bold text-slate-500">
                        Answered: <span className="text-blue-600 font-extrabold">{answeredCount}</span> / {totalQuestions}
                    </div>
                </div>

                {/* Module Questions List matching Figure 1 */}
                <div className="space-y-6">
                    {moduleQuestions.length === 0 ? (
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                                <FaSpinner className="animate-spin" size={24} />
                            </div>
                            <p className="text-sm font-bold text-slate-700">Loading Assessment Questions...</p>
                        </div>
                    ) : (
                        moduleQuestions.map((q, localIdx) => {
                        const globalIndex = moduleStartIndex + localIdx + 1;
                        const selectedOption = answers[q.id];

                        return (
                            <div 
                                key={q.id} 
                                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-5"
                            >
                                <div className="flex gap-3.5 items-start">
                                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center flex-shrink-0 text-xs shadow-md shadow-purple-600/20 mt-0.5">
                                        {globalIndex}
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                        {q.question}
                                    </h3>
                                </div>

                                {/* Options Grid - Single Column for all devices */}
                                <div className="flex flex-col gap-3 pl-0 sm:pl-11">
                                    {Object.entries(q.options).map(([key, val]) => {
                                        const isSelected = selectedOption === key;

                                        return (
                                            <button
                                                key={key}
                                                onClick={() => handleSelectOption(q.id, key)}
                                                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-sm ring-1 ring-purple-400 font-bold'
                                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50/50 hover:border-purple-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono ${
                                                        isSelected ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'
                                                    }`}>
                                                        {key}
                                                    </span>
                                                    <span>{val}</span>
                                                </div>
                                                {isSelected && (
                                                    <FaCheckCircle className="text-purple-600 flex-shrink-0" size={14} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }))}
                </div>

                {/* Bottom Module Stepper Footer matching Figure 1 */}
                <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
                    <button
                        onClick={() => setActiveModuleIndex(prev => Math.max(0, prev - 1))}
                        disabled={activeModuleIndex === 0}
                        className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold py-2 px-2.5 sm:py-2.5 sm:px-5 rounded-xl text-xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                        title="Previous Module"
                    >
                        <FaArrowLeft size={11} />
                        <span className="hidden md:inline">Previous: Module {Math.max(1, activeModuleIndex)}</span>
                        <span className="md:hidden text-[11px]">Prev</span>
                    </button>

                    {/* Progress indicators line in center */}
                    <div className="flex flex-col items-center gap-1 text-[10px] sm:text-xs text-slate-500 font-bold text-center flex-shrink min-w-0">
                        <div className="flex gap-1.5">
                            {MODULE_METADATA.map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                                        i === activeModuleIndex ? 'bg-purple-600 ring-2 sm:ring-4 ring-purple-100 scale-110' : 'bg-slate-300'
                                    }`} 
                                />
                            ))}
                        </div>
                        <span className="whitespace-nowrap text-[10px] sm:text-xs">Module {activeModuleIndex + 1} of 4</span>
                    </div>

                    {activeModuleIndex < MODULE_METADATA.length - 1 ? (
                        <button
                            onClick={() => setActiveModuleIndex(prev => Math.min(MODULE_METADATA.length - 1, prev + 1))}
                            className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-2.5 sm:py-2.5 sm:px-6 rounded-xl text-xs transition shadow-md shadow-purple-500/20 cursor-pointer flex-shrink-0"
                            title="Next Module"
                        >
                            <span className="hidden md:inline">Next: Module {activeModuleIndex + 2}</span>
                            <span className="md:hidden text-[11px]">Next</span>
                            <FaArrowRight size={11} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmitTest}
                            disabled={submittingTest}
                            className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-2 px-2.5 sm:py-2.5 sm:px-6 rounded-xl text-xs transition shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer animate-pulse flex-shrink-0"
                        >
                            {submittingTest ? (
                                <>
                                    <FaSpinner className="animate-spin" size={12} />
                                    <span className="text-[11px]">Grading...</span>
                                </>
                            ) : (
                                <>
                                    <span className="hidden md:inline">Submit Assessment</span>
                                    <span className="md:hidden text-[11px]">Submit</span>
                                    <FaAward size={12} />
                                </>
                            )}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}

export default function CertificateTestPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center py-20">
                <FaSpinner className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-slate-600 font-medium">Loading test resources...</p>
            </div>
        }>
            <TestPageContent />
        </Suspense>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// HIGH-FIDELITY Digital Certificate Component matching Figure 2 (Web Color Theme)
// ─────────────────────────────────────────────────────────────────────────────
function CertificateWebCard({
    name,
    courseTitle,
    regNo,
    date
}: {
    name: string;
    courseTitle: string;
    regNo: string;
    date: string;
}) {
    return (
        <div className="w-full max-w-2xl mx-auto rounded-3xl p-0.5 sm:p-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 shadow-[0_0_50px_rgba(6,182,212,0.25)] transition-all">
            <div className="bg-[#090d16] rounded-[22px] p-4 sm:p-8 md:p-10 relative overflow-hidden border border-white/5 text-center space-y-4 sm:space-y-6">
                
                {/* Circuit background overlay */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-3xl pointer-events-none rounded-full" />

                {/* AIXX Logo */}
                <div className="flex flex-col items-center justify-center space-y-1 relative z-10">
                    <span className="text-xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                        AIXX ACADEMY
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-[0.25em]">
                        AI · INNOVATE · EXCEL
                    </span>
                </div>

                {/* Title */}
                <div className="space-y-1 relative z-10">
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 tracking-tight">
                        Certificate of Completion
                    </h2>
                    <div className="text-cyan-400 text-xs">★</div>
                </div>

                {/* Certifies */}
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium relative z-10">This certifies that</p>

                {/* Candidate Name in Glowing Font matching Figure 2 */}
                <div className="py-1 relative z-10 px-2">
                    <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-teal-200 tracking-wide font-outfit drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] break-words">
                        {name || 'Registered Candidate'}
                    </h3>
                    <div className="w-36 sm:w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-2 opacity-60" />
                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 font-medium relative z-10">has successfully completed</p>

                {/* Course Name */}
                <h4 className="text-xs sm:text-base md:text-lg font-extrabold text-white max-w-md mx-auto leading-snug relative z-10 px-2">
                    {courseTitle}
                </h4>

                {/* Candidate Registration Box matching Figure 2 */}
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-[#0d162a] border border-emerald-500/50 rounded-xl px-3 sm:px-4 py-2 text-[10px] sm:text-xs text-emerald-400 font-mono font-bold shadow-inner relative z-10 max-w-full">
                    <FaShieldAlt className="text-emerald-400 flex-shrink-0" />
                    <span className="break-all">Candidate Reg No.: <strong className="text-white">{regNo}</strong></span>
                </div>



                {/* Footer details (Gold Badge Seal, Issued Date, Signature) matching Figure 2 */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center sm:items-end justify-between text-center sm:text-left relative z-10 gap-3 sm:gap-2">
                    
                    {/* Gold Certified Seal SVG matching Figure 2 */}
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 relative flex-shrink-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                                <circle cx="50" cy="50" r="45" fill="#d97706" />
                                <circle cx="50" cy="50" r="40" fill="#f59e0b" />
                                <circle cx="50" cy="50" r="36" fill="none" stroke="#fef3c7" strokeWidth="2" strokeDasharray="3 2" />
                                <text x="50" y="44" textAnchor="middle" fill="#78350f" fontSize="11" fontWeight="900">AIXX</text>
                                <text x="50" y="56" textAnchor="middle" fill="#78350f" fontSize="8" fontWeight="800">CERTIFIED</text>
                                <path d="M 35 64 L 50 60 L 65 64 L 50 72 Z" fill="#b45309" />
                            </svg>
                        </div>
                    </div>

                    {/* Issued Date */}
                    <div className="text-center font-mono text-[11px] text-slate-400">
                        <p className="text-[10px] text-slate-500 font-sans uppercase tracking-wider">Issued Date</p>
                        <p className="text-white font-bold">{date}</p>
                    </div>

                    {/* Signature */}
                    <div className="text-center sm:text-right space-y-0.5">
                        <div className="font-serif italic text-lg sm:text-xl font-bold text-cyan-300 tracking-wider">
                            Aixx
                        </div>
                        <div className="w-24 h-0.5 bg-slate-700 mx-auto sm:ml-auto" />
                        <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                            AIXX Learning Team
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Printable / SVG Certificate Template
// ─────────────────────────────────────────────────────────────────────────────
const CertificateSVGTemplate = React.forwardRef<
    SVGSVGElement,
    { name: string; regNo: string; date: string }
>(({ name, regNo, date }, ref) => {
    return (
        <svg
            ref={ref}
            viewBox="0 0 1200 840"
            width="1200"
            height="840"
            className="font-sans"
            style={{ backgroundColor: '#070c1e' }}
        >
            <rect x="0" y="0" width="1200" height="840" fill="#070c1e" />
            <rect x="25" y="25" width="1150" height="790" fill="none" stroke="#06b6d4" strokeWidth="3" rx="20" />
            <rect x="35" y="35" width="1130" height="770" fill="none" stroke="#8b5cf6" strokeWidth="1" rx="16" />

            <text x="600" y="140" textAnchor="middle" fontSize="32" fontWeight="900" fill="#38bdf8" letterSpacing="4">AIXX</text>
            <text x="600" y="165" textAnchor="middle" fontSize="12" fontWeight="700" fill="#94a3b8" letterSpacing="6">AI · INNOVATE · EXCEL</text>

            <text x="600" y="240" textAnchor="middle" fontSize="36" fontWeight="900" fill="#ffffff" letterSpacing="2">Certificate of Completion</text>
            <text x="600" y="270" textAnchor="middle" fontSize="16" fill="#06b6d4">★</text>

            <text x="600" y="330" textAnchor="middle" fontSize="15" fontWeight="600" fill="#94a3b8">This certifies that</text>

            <text x="600" y="400" textAnchor="middle" fontSize="42" fontWeight="900" fill="#38bdf8">{name || 'Registered Candidate'}</text>
            <line x1="300" y1="420" x2="900" y2="420" stroke="#06b6d4" strokeWidth="2" opacity="0.5" />

            <text x="600" y="470" textAnchor="middle" fontSize="15" fill="#94a3b8">has successfully completed</text>
            <text x="600" y="505" textAnchor="middle" fontSize="20" fontWeight="800" fill="#ffffff">AI Free Course – General AI Knowledge for Everyday Life</text>

            <rect x="380" y="540" width="440" height="40" fill="#0d162a" stroke="#10b981" strokeWidth="1.5" rx="10" />
            <text x="600" y="565" textAnchor="middle" fontSize="13" fontWeight="700" fill="#34d399" fontFamily="monospace">
                Candidate Registration No.: {regNo}
            </text>



            <line x1="200" y1="730" x2="400" y2="730" stroke="#334155" strokeWidth="1" />
            <text x="300" y="750" textAnchor="middle" fontSize="11" fontWeight="700" fill="#94a3b8">ISSUED DATE</text>
            <text x="300" y="770" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff">{date}</text>

            <line x1="800" y1="730" x2="1000" y2="730" stroke="#334155" strokeWidth="1" />
            <text x="900" y="750" textAnchor="middle" fontSize="11" fontWeight="700" fill="#94a3b8">SIGNATURE</text>
            <text x="900" y="770" textAnchor="middle" fontSize="13" fontWeight="800" fill="#38bdf8">AIXX Learning Team</text>
        </svg>
    );
});

CertificateSVGTemplate.displayName = 'CertificateSVGTemplate';

// ─────────────────────────────────────────────────────────────────────────────
// Assessment Detailed Review Section Component matching Figure 1
// ─────────────────────────────────────────────────────────────────────────────
function AssessmentReviewSection({
    results
}: {
    results: {
        question: string;
        options: Record<string, string>;
        selected_option: string;
        correct_option: string;
        is_correct: boolean;
        explanation: string;
    }[];
}) {
    return (
        <div className="w-full mt-12 text-left animate-fadeIn space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-50 border border-purple-200 w-10 h-10 rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                    <FaBookOpen size={18} />
                </div>
                <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">Assessment Review</h3>
                    <p className="text-slate-500 text-xs mt-0.5">
                        {results.length} MCQ Questions | Detailed Explanations
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {results.map((item, idx) => (
                    <div 
                        key={idx} 
                        className={`rounded-2xl p-6 sm:p-7 border bg-white shadow-sm space-y-5 ${
                            item.is_correct ? 'border-slate-200' : 'border-red-200'
                        }`}
                    >
                        <div className="flex gap-3.5 items-start justify-between">
                            <div className="flex gap-3.5 items-start flex-1">
                                <div className={`w-8 h-8 rounded-full font-extrabold flex items-center justify-center flex-shrink-0 text-xs shadow-md mt-0.5 ${
                                    item.is_correct ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-red-600 text-white shadow-red-600/20'
                                }`}>
                                    {idx + 1}
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                    {item.question}
                                </h4>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide flex-shrink-0 ${
                                item.is_correct 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                                {item.is_correct ? (
                                    <>
                                        <FaCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Correct</span>
                                    </>
                                ) : (
                                    <>
                                        <FaTimesCircle className="w-3.5 h-3.5 text-red-600" />
                                        <span>Incorrect</span>
                                    </>
                                )}
                            </span>
                        </div>

                        {/* Options Grid - Single Column for all devices */}
                        <div className="flex flex-col gap-3 pl-0 sm:pl-11">
                            {Object.entries(item.options).map(([key, val]) => {
                                const isCorrectOption = key === item.correct_option;
                                const isSelectedOption = key === item.selected_option;

                                let borderClass = 'border-slate-200 bg-slate-50 text-slate-700';
                                if (isCorrectOption) {
                                    borderClass = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold shadow-sm';
                                } else if (isSelectedOption && !isCorrectOption) {
                                    borderClass = 'border-red-300 bg-red-50 text-red-900 font-bold';
                                }

                                return (
                                    <div key={key} className={`flex items-center justify-between p-3.5 rounded-xl border ${borderClass} text-xs sm:text-sm`}>
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono ${
                                                isCorrectOption ? 'bg-emerald-600 text-white' : isSelectedOption ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                                            }`}>
                                                {key}
                                            </span>
                                            <span>{val}</span>
                                        </div>
                                        {isCorrectOption && (
                                            <FaCheckCircle className="text-emerald-600 flex-shrink-0" size={14} />
                                        )}
                                        {isSelectedOption && !isCorrectOption && (
                                            <FaTimesCircle className="text-red-600 flex-shrink-0" size={14} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Answer and Explanation section */}
                        <div className="pl-0 sm:pl-11 space-y-2 text-xs sm:text-sm border-t border-slate-200 pt-3">
                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                                {item.is_correct ? (
                                    <p className="text-emerald-700">
                                        Answer: <span className="font-extrabold">{item.correct_option}</span>
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-red-700">
                                            Your Answer: <span className="font-extrabold">{item.selected_option || 'None'}</span>
                                        </p>
                                        <p className="text-emerald-700">
                                            Correct Answer: <span className="font-extrabold">{item.correct_option}</span>
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Show explanation ONLY if the user's answer is incorrect */}
                            {!item.is_correct && (
                                <div className="text-slate-700 bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed mt-2.5 space-y-1">
                                    <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                                        Explanation:
                                    </span>
                                    <p className="text-slate-800">{item.explanation || 'No detailed explanation provided.'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
