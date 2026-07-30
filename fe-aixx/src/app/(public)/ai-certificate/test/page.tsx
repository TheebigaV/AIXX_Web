'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/public/api';
import Link from 'next/link';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaAward, FaArrowRight, FaArrowLeft, FaPrint, FaDownload, FaSpinner, FaChevronRight, FaLock } from 'react-icons/fa';

interface Question {
    id: number;
    question: string;
    options: Record<string, string>;
}

function TestPageContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(true);
    const [tokenError, setTokenError] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [alreadyPassed, setAlreadyPassed] = useState(false);
    const [passedAt, setPassedAt] = useState('');
    const [savedScore, setSavedScore] = useState(0);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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
    } | null>(null);

    const certificateRef = useRef<SVGSVGElement>(null);

    // Verify token and status on mount
    useEffect(() => {
        if (!token) {
            setTokenError('Missing token. Please access this page using the link sent to your email.');
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
                    setSavedScore(data.score);
                    setPassedAt(data.passed_at);
                    setLoading(false);
                } else {
                    // Fetch test questions
                    const questionsResponse = await api.get(`api/certificate/questions?token=${token}`);
                    setQuestions(questionsResponse.data.questions);
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

    const handleSelectOption = (questionId: number, optionKey: string) => {
        setAnswers({ ...answers, [questionId]: optionKey });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitTest = async () => {
        if (Object.keys(answers).length < questions.length) {
            const confirmSubmit = window.confirm('You have not answered all questions. Are you sure you want to submit?');
            if (!confirmSubmit) return;
        }

        setSubmittingTest(true);
        try {
            const response = await api.post('api/certificate/submit-test', {
                token,
                answers
            });
            setTestResult(response.data);
        } catch (err: any) {
            console.error('Test submission failed:', err);
            alert('Failed to submit test. Please try again.');
        } finally {
            setSubmittingTest(false);
        }
    };

    const handlePrint = () => {
        const printContent = document.getElementById('printable-certificate');
        const originalContent = document.body.innerHTML;

        if (printContent) {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Print Certificate - AIXX</title>
                            <style>
                                @page { size: landscape; margin: 0; }
                                body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #fff; }
                                .cert-container { width: 100%; max-width: 1120px; }
                            </style>
                        </head>
                        <body>
                            <div class="cert-container">
                                ${printContent.innerHTML}
                            </div>
                            <script>
                                window.onload = function() {
                                    window.print();
                                    setTimeout(function() { window.close(); }, 500);
                                };
                            </script>
                        </body>
                    </html>
                `);
                printWindow.document.close();
            }
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
            canvas.width = 1120;
            canvas.height = 792;
            const context = canvas.getContext('2d');

            if (context) {
                context.drawImage(image, 0, 0, 1120, 792);
                const png = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = png;
                downloadLink.download = `AIXX_AI_Certificate_${candidateName.replace(/\s+/g, '_')}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        };
        image.src = blobURL;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20">
                <FaSpinner className="animate-spin text-brand-600 mb-4" size={40} />
                <p className="text-slate-600 font-medium">Verifying access token and loading test questions...</p>
            </div>
        );
    }

    if (tokenError) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <FaTimesCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h2>
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

    // Success State — Already Passed
    if (alreadyPassed) {
        return (
            <div className="min-h-screen bg-slate-900 text-white py-16 px-6">
                <div className="max-w-5xl mx-auto flex flex-col items-center space-y-10">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-4 py-1.5 font-semibold text-sm">
                            <FaAward /> Verified AI Certificate Holder
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                            Congratulations, {candidateName}!
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto text-base">
                            You passed your AI Knowledge Test with a score of <strong className="text-emerald-400">{savedScore}%</strong> on {passedAt}. Your digital certificate is ready for download.
                        </p>
                    </div>

                    {/* Certificate Display Area (Blurred and Locked) */}
                    <div className="w-full flex justify-center relative">
                        <div className="w-full flex justify-center filter blur-md select-none pointer-events-none opacity-40">
                            <CertificateTemplate
                                ref={certificateRef}
                                name={candidateName}
                                score={savedScore}
                                date={passedAt}
                                uuid={token || 'AIXX-DEMO'}
                            />
                        </div>

                        {/* Lock Overlay Shield */}
                        <div className="absolute inset-0 flex items-center justify-center z-30 p-4">
                            <div className="bg-slate-950/85 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md text-center space-y-4 backdrop-blur-md shadow-2xl">
                                <div className="w-14 h-14 bg-brand-500/20 text-brand-400 rounded-full flex items-center justify-center mx-auto border border-brand-500/30 animate-pulse">
                                    <FaLock size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Certificate Locked</h3>
                                <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-medium">
                                    Congratulations on passing the assessment! To unlock your verified PDF/PNG certificate, verify your details, or request print options, please contact AIXX Support.
                                </p>
                                <a
                                    href={`mailto:cs@aixx.com.sg?subject=Unlock AI Knowledge Certificate - Token: ${token || ''}`}
                                    className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition-all"
                                >
                                    <span>Contact cs@aixx.com.sg</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Locked Actions Placeholder */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="text-xs text-slate-450 font-semibold flex items-center gap-1.5 bg-slate-800/40 px-4.5 py-2 rounded-full border border-slate-700/50">
                            <FaLock size={10} className="text-amber-500 animate-pulse" />
                            <span>Downloads & Printing are disabled until unlocked</span>
                        </div>
                    </div>

                    <Link
                        href="/courses"
                        className="text-slate-400 hover:text-white underline text-sm transition"
                    >
                        Explore Advanced AI Programs at AIXX Academy
                    </Link>
                </div>
            </div>
        );
    }

    // Success State — Just Passed
    if (testResult) {
        const isPass = testResult.passed;

        return (
            <div className={`min-h-screen ${isPass ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} py-16 px-6`}>
                <div className="max-w-5xl mx-auto flex flex-col items-center space-y-10">

                    {isPass ? (
                        <>
                            <div className="text-center space-y-4 animate-fadeIn">
                                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-4 py-1.5 font-semibold text-sm">
                                    <FaAward /> Assessment Passed
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                                    Congratulations! You Passed!
                                </h1>
                                <p className="text-slate-400 max-w-2xl mx-auto text-base">
                                    You scored <strong className="text-emerald-400">{testResult.score}%</strong>. Below is your official AI Knowledge Certificate.
                                </p>
                            </div>

                            {/* Certificate Display Area (Blurred and Locked) */}
                            <div className="w-full flex justify-center relative">
                                <div className="w-full flex justify-center filter blur-md select-none pointer-events-none opacity-40">
                                    <CertificateTemplate
                                        ref={certificateRef}
                                        name={testResult.full_name}
                                        score={testResult.score}
                                        date={testResult.passed_at}
                                        uuid={token || 'AIXX-DEMO'}
                                    />
                                </div>

                                {/* Lock Overlay Shield */}
                                <div className="absolute inset-0 flex items-center justify-center z-30 p-4">
                                    <div className="bg-slate-950/85 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md text-center space-y-4 backdrop-blur-md shadow-2xl">
                                        <div className="w-14 h-14 bg-brand-500/20 text-brand-400 rounded-full flex items-center justify-center mx-auto border border-brand-500/30 animate-pulse">
                                            <FaLock size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Certificate Locked</h3>
                                        <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-medium">
                                            Congratulations on passing the assessment! To unlock your verified PDF/PNG certificate, verify your details, or request print options, please contact AIXX Support.
                                        </p>
                                        <a
                                            href={`mailto:cs@aixx.com.sg?subject=Unlock AI Knowledge Certificate - Token: ${token || ''}`}
                                            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition-all"
                                        >
                                            <span>Contact cs@aixx.com.sg</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Locked Actions Placeholder */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="text-xs text-slate-450 font-semibold flex items-center gap-1.5 bg-slate-800/40 px-4.5 py-2 rounded-full border border-slate-700/50">
                                    <FaLock size={10} className="text-amber-500 animate-pulse" />
                                    <span>Downloads & Printing are disabled until unlocked</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6 animate-fadeIn mt-10">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                                <FaTimesCircle size={40} />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-extrabold text-slate-950">Assessment Unsuccessful</h2>
                                <p className="text-slate-500 text-sm">
                                    You scored <strong className="text-red-500 font-bold">{testResult.score}%</strong>. A passing grade of <strong className="text-slate-900 font-bold">80%</strong> is required to earn the certificate.
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 text-left space-y-1">
                                <p className="font-bold text-slate-700">Performance Summary:</p>
                                <p>• Correct Answers: {testResult.correct_count} / {testResult.total_questions}</p>
                                <p>• Passing Required: 16 / 20 correct answers</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/ai-certificate"
                                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl transition w-full block text-center"
                                >
                                    Try Again (New Registration)
                                </Link>
                                <Link
                                    href="/courses"
                                    className="text-slate-500 hover:text-slate-800 text-sm font-medium transition block text-center underline"
                                >
                                    Explore courses to improve your AI skills
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        );
    }

    // Active Test Engine UI
    const activeQuestion = questions[currentQuestionIndex];
    const progressPercentage = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header Info */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-950">AI Knowledge Certificate Test</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Candidate: <strong className="text-slate-800 font-semibold">{candidateName}</strong></p>
                    </div>
                    <div className="bg-brand-50 border border-brand-100 text-brand-600 rounded-lg px-3 py-1.5 font-bold text-xs flex items-center gap-1.5">
                        <FaHourglassHalf className="animate-pulse" />
                        <span>Untimed Assessment</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                        <span>Progress: {progressPercentage}%</span>
                        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                            className="bg-brand-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Active Question Box */}
                {activeQuestion && (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 sm:p-10 space-y-8 min-h-[380px] flex flex-col justify-between">
                        <div className="space-y-6">
                            <span className="text-xs font-extrabold text-brand-600 uppercase tracking-widest block">Question {currentQuestionIndex + 1}</span>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                                {activeQuestion.question}
                            </h3>
                        </div>

                        {/* Options Selection Grid */}
                        <div className="grid grid-cols-1 gap-3.5 my-6">
                            {Object.entries(activeQuestion.options).map(([key, val]) => {
                                const isSelected = answers[activeQuestion.id] === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleSelectOption(activeQuestion.id, key)}
                                        className={`w-full text-left p-4.5 rounded-2xl border text-sm font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer ${isSelected
                                                ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-100'
                                                : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100/50 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-7 h-7 rounded-lg font-extrabold text-xs flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                                                }`}>
                                                {key}
                                            </span>
                                            <span>{val}</span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-white bg-white text-brand-600' : 'border-slate-300'
                                            }`}>
                                            {isSelected && <FaChevronRight size={10} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-4 gap-4">
                            <button
                                onClick={handlePrev}
                                disabled={currentQuestionIndex === 0}
                                className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 font-semibold py-2.5 px-5 rounded-xl text-sm transition hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <FaArrowLeft size={12} />
                                <span>Previous</span>
                            </button>

                            {currentQuestionIndex < questions.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition cursor-pointer"
                                >
                                    <span>Next Question</span>
                                    <FaArrowRight size={12} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitTest}
                                    disabled={submittingTest}
                                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition shadow-md shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer animate-pulse"
                                >
                                    {submittingTest ? (
                                        <>
                                            <FaSpinner className="animate-spin" size={14} />
                                            <span>Grading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Submit Assessment</span>
                                            <FaAward size={14} />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function CertificateTestPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20">
                <FaSpinner className="animate-spin text-brand-600 mb-4" size={40} />
                <p className="text-slate-600 font-medium">Loading test resources...</p>
            </div>
        }>
            <TestPageContent />
        </Suspense>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// HIGHL-FIDELITY digital completion certificate component
// ─────────────────────────────────────────────────────────────────────────────
const CertificateTemplate = React.forwardRef<
    SVGSVGElement,
    { name: string; score: number; date: string; uuid: string }
>(({ name, score, date, uuid }, ref) => {
    const formattedId = `AIXX-CERT-${uuid.substring(0, 8).toUpperCase()}`;

    return (
        <div id="printable-certificate" className="w-full max-w-[800px] aspect-[1120/792] overflow-hidden rounded-2xl shadow-2xl bg-white border border-slate-200">
            <svg
                ref={ref}
                viewBox="0 0 1120 792"
                width="100%"
                height="100%"
                className="font-sans"
                style={{ backgroundColor: '#ffffff' }}
            >
                {/* Border frames */}
                <rect x="20" y="20" width="1080" height="752" fill="none" stroke="#00062A" strokeWidth="4" />
                <rect x="35" y="35" width="1050" height="722" fill="none" stroke="#1A3A8F" strokeWidth="1" />
                <rect x="40" y="40" width="1040" height="712" fill="none" stroke="#58b347" strokeWidth="2" />
                <rect x="50" y="50" width="1020" height="692" fill="none" stroke="#e2e8f0" strokeWidth="1" />

                {/* Corner details */}
                <path d="M 50 100 L 50 50 L 100 50" fill="none" stroke="#00062A" strokeWidth="3" />
                <path d="M 1070 100 L 1070 50 L 1020 50" fill="none" stroke="#00062A" strokeWidth="3" />
                <path d="M 50 692 L 50 742 L 100 742" fill="none" stroke="#00062A" strokeWidth="3" />
                <path d="M 1070 692 L 1070 742 L 1020 742" fill="none" stroke="#00062A" strokeWidth="3" />

                {/* Header Logo & Academy Name */}
                <text x="560" y="130" textAnchor="middle" fontSize="18" fontWeight="800" fill="#00062A" letterSpacing="6">AIXX PTE LTD</text>
                <text x="560" y="155" textAnchor="middle" fontSize="11" fontWeight="600" fill="#58b347" letterSpacing="4">ACADEMY OF ADVANCED AI & QUANTUM COMPUTING</text>

                {/* Certificate Title */}
                <text x="560" y="245" textAnchor="middle" fontSize="32" fontWeight="900" fill="#00062A" letterSpacing="1">CERTIFICATE OF AI COMPETENCY</text>
                <line x1="420" y1="265" x2="700" y2="265" stroke="#58b347" strokeWidth="2" />

                {/* Body Text */}
                <text x="560" y="335" textAnchor="middle" fontSize="14" fontWeight="600" fill="#64748b" letterSpacing="1">THIS IS PROUDLY PRESENTED TO</text>

                {/* Candidate Name */}
                <text x="560" y="405" textAnchor="middle" fontSize="38" fontWeight="800" fill="#1A3A8F" fontStyle="italic">{name}</text>
                <line x1="260" y1="425" x2="860" y2="425" stroke="#cbd5e1" strokeWidth="1" />

                {/* Accomplishment description */}
                <text x="560" y="480" textAnchor="middle" fontSize="14" fill="#475569">
                    for successfully demonstrating professional competency in Artificial Intelligence by completing the
                </text>
                <text x="560" y="505" textAnchor="middle" fontSize="15" fontWeight="700" fill="#00062A">
                    AIXX 20 MCQ Knowledge Assessment with an official passing score of {score}%
                </text>

                {/* Footer details (ID, Date, Signatures) */}
                <line x1="180" y1="630" x2="380" y2="630" stroke="#94a3b8" strokeWidth="1" />
                <text x="280" y="650" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">DATE OF ISSUANCE</text>
                <text x="280" y="670" textAnchor="middle" fontSize="12" fontWeight="800" fill="#00062A">{date}</text>

                {/* Gold seal design */}
                <g transform="translate(560, 615)">
                    <circle cx="0" cy="0" r="38" fill="#58b347" opacity="0.1" />
                    <circle cx="0" cy="0" r="32" fill="none" stroke="#58b347" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="0" cy="0" r="28" fill="none" stroke="#1A3A8F" strokeWidth="1" />
                    <text x="0" y="4" textAnchor="middle" fontSize="9" fontWeight="900" fill="#1A3A8F" letterSpacing="0.5">VERIFIED</text>
                </g>

                <line x1="740" y1="630" x2="940" y2="630" stroke="#94a3b8" strokeWidth="1" />
                <text x="840" y="650" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">CERTIFICATE SERIAL ID</text>
                <text x="840" y="670" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1A3A8F" letterSpacing="0.5">{formattedId}</text>

                {/* Subtle digital signature seal */}
                <path d="M 500 700 Q 560 705 620 700" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            </svg>
        </div>
    );
});

CertificateTemplate.displayName = 'CertificateTemplate';
