'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/public/api';
import Link from 'next/link';
import { 
    FaArrowLeft, 
    FaArrowRight,
    FaCheckCircle,
    FaTimesCircle,
    FaLightbulb,
    FaAward,
    FaSpinner,
    FaComments,
    FaBookOpen
} from 'react-icons/fa';

interface OptionObj {
    A: string;
    B: string;
    C: string;
    D: string;
    [key: string]: string;
}

interface Question {
    id: number;
    question: string;
    options: OptionObj;
    correct_answer: string;
    explanation: string;
}

interface Module {
    id: number;
    module_index: number;
    title: string;
    study_notes: string;
    questions: Question[];
}

interface Training {
    id: number;
    name: string;
    slug: string;
}

export default function InteractiveStudyMode() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [training, setTraining] = useState<Training | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    
    // Navigation State
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);
    const [viewingNotes, setViewingNotes] = useState(true);
    
    // Quiz State
    const [answers, setAnswers] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/trainings/${slug}/modules`);
                setTraining(response.data.training);
                setModules(response.data.modules);
            } catch (err) {
                console.error("Failed to fetch modules", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0F1C] flex flex-col items-center justify-center py-20 text-white">
                <FaSpinner className="animate-spin text-brand-500 mb-4" size={40} />
                <p className="text-slate-400 font-medium tracking-wide">Loading Interactive Study Environment...</p>
            </div>
        );
    }

    if (!training || modules.length === 0) {
        return (
            <div className="min-h-screen bg-[#0A0F1C] flex flex-col items-center justify-center py-20 text-white px-4 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <FaBookOpen size={24} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Modules Available</h2>
                <p className="text-slate-400 max-w-md mb-8">
                    The interactive study modules for this course have not been published yet. Please check back later.
                </p>
                <Link href={`/courses/${slug}`} className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-full transition">
                    Return to Course
                </Link>
            </div>
        );
    }

    const activeModule = modules[activeModuleIndex];
    const isLastModule = activeModuleIndex === modules.length - 1;
    
    // Check if all questions in the current module have been answered
    const moduleQuestions = activeModule.questions || [];
    const allAnswered = moduleQuestions.length > 0 && moduleQuestions.every(q => answers[q.id]);
    const correctCount = moduleQuestions.filter(q => answers[q.id] === q.correct_answer).length;

    const handleSelectOption = (questionId: number, option: string) => {
        // Prevent changing answer if already answered
        if (answers[questionId]) return;
        
        setAnswers({
            ...answers,
            [questionId]: option
        });
    };

    const handleNextModule = () => {
        if (!isLastModule) {
            setActiveModuleIndex(activeModuleIndex + 1);
            setViewingNotes(true); // Reset to notes view for the next module
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Course Complete!
            router.push(`/courses/${slug}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0F1C] text-slate-200 font-sans selection:bg-brand-500/30">
            {/* Top Navigation */}
            <div className="sticky top-0 z-50 bg-[#0A0F1C]/80 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center justify-between">
                <button 
                    onClick={() => router.push(`/courses/${slug}`)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold tracking-widest text-xs uppercase hidden sm:inline">Back to Course</span>
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-white">AI<span className="text-brand-500">XX</span></span>
                </div>
                <div className="w-8"></div> {/* Spacer for centering */}
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 pb-32">
                
                {/* Header Graphic Section */}
                <div className="mb-10 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
                    
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-bold tracking-widest text-slate-300 uppercase mb-4">
                        Module {activeModuleIndex + 1} of {modules.length}
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">
                        MODULE {activeModule.module_index}: <span className="text-brand-400">{activeModule.title}</span>
                    </h1>
                    <p className="text-lg text-slate-400">Interactive Learning & Knowledge Assessment</p>
                </div>

                {/* Study Notes View */}
                {viewingNotes ? (
                    <div className="space-y-8 animate-fadeIn">
                        {activeModule.study_notes ? (
                            <div className="bg-[#121A2F] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-400 to-blue-600"></div>
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <FaBookOpen className="text-brand-400" /> Module Study Notes
                                </h3>
                                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {activeModule.study_notes}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#121A2F] border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
                                <p className="text-slate-400 italic">No preliminary notes for this module. You can proceed directly to the assessment.</p>
                            </div>
                        )}
                        
                        <div className="flex justify-end">
                            <button 
                                onClick={() => setViewingNotes(false)}
                                className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105 flex items-center gap-3"
                            >
                                <span>Start Assessment</span>
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Assessment View */
                    <div className="space-y-6 animate-fadeIn">
                        {/* Questions List */}
                        {moduleQuestions.length > 0 ? moduleQuestions.map((q, idx) => {
                            const selectedAnswer = answers[q.id];
                            const isAnswered = !!selectedAnswer;
                            const isCorrect = selectedAnswer === q.correct_answer;
                            
                            return (
                                <div key={q.id} className="bg-[#121A2F] border border-white/5 rounded-3xl p-5 sm:p-8 shadow-xl transition-all relative overflow-hidden">
                                    
                                    {/* Question Header */}
                                    <div className="flex gap-4 items-start mb-6">
                                        <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-black flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                                            {q.question}
                                        </h3>
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-3 pl-0 sm:pl-12">
                                        {Object.entries(q.options || {}).map(([key, val]) => {
                                            const isThisOptionSelected = selectedAnswer === key;
                                            const isThisOptionCorrect = q.correct_answer === key;
                                            
                                            // Determine styling based on state
                                            let optionClasses = "border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer";
                                            let indicator = null;

                                            if (isAnswered) {
                                                optionClasses = "border-white/5 bg-white/5 text-slate-500 cursor-default opacity-60"; // Default for unselected/wrong
                                                
                                                if (isThisOptionCorrect) {
                                                    // The correct answer always highlights green once answered
                                                    optionClasses = "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)] opacity-100";
                                                    indicator = <FaCheckCircle className="text-emerald-400" size={18} />;
                                                } else if (isThisOptionSelected && !isThisOptionCorrect) {
                                                    // The wrong answer chosen by user highlights red
                                                    optionClasses = "border-red-500/50 bg-red-500/10 text-red-300 opacity-100";
                                                    indicator = <FaTimesCircle className="text-red-400" size={18} />;
                                                }
                                            }

                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => handleSelectOption(q.id, key)}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${optionClasses}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-6 h-6 rounded bg-black/30 flex items-center justify-center text-xs font-bold border border-white/10 flex-shrink-0">
                                                            {key}
                                                        </span>
                                                        <span className="text-sm sm:text-base">{val}</span>
                                                    </div>
                                                    {indicator && <div className="flex-shrink-0">{indicator}</div>}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation Reveal */}
                                    {isAnswered && q.explanation && (
                                        <div className="mt-5 pl-0 sm:pl-12 animate-fadeIn">
                                            <div className="bg-[#0A0F1C]/80 border border-slate-700/50 rounded-xl p-4 flex gap-3 items-start">
                                                <FaLightbulb className="text-amber-400 flex-shrink-0 mt-0.5" size={16} />
                                                <div>
                                                    <span className="text-brand-400 font-bold text-xs uppercase tracking-widest block mb-1">Explanation</span>
                                                    <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }) : (
                            <div className="bg-[#121A2F] border border-white/10 rounded-3xl p-10 text-center">
                                <p className="text-slate-400">No questions available for this module.</p>
                            </div>
                        )}

                        {/* Module Completed Banner */}
                        {allAnswered && moduleQuestions.length > 0 && (
                            <div className="mt-12 bg-gradient-to-r from-[#121A2F] to-[#1A2542] border border-brand-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(37,99,235,0.15)] animate-slideUp">
                                <div className="flex items-center gap-5 text-center sm:text-left">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center border border-brand-400/30 relative">
                                        <FaAward size={32} className="text-brand-400" />
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#1A2542]">
                                            <FaCheckCircle className="text-white" size={12} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white">Module {activeModule.module_index} Completed</h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-400 font-medium justify-center sm:justify-start">
                                            <span className="flex items-center gap-1.5"><FaCheckCircle className="text-emerald-400"/> {correctCount}/{moduleQuestions.length} Correct</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                            <span className="flex items-center gap-1.5"><FaComments className="text-brand-400"/> Instant Feedback</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleNextModule}
                                    className="w-full sm:w-auto bg-gradient-to-r from-brand-600 to-brand-400 hover:from-brand-500 hover:to-brand-300 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 flex-shrink-0"
                                >
                                    <span>{isLastModule ? 'Finish Course' : `Continue to Module ${activeModuleIndex + 2}`}</span>
                                    <FaArrowRight />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Progress Bar (Bottom fixed) */}
            <div className="fixed bottom-0 left-0 w-full h-1.5 bg-slate-800 z-50">
                <div 
                    className="h-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    style={{ width: `${((activeModuleIndex + (allAnswered ? 1 : 0)) / modules.length) * 100}%` }}
                ></div>
            </div>
        </div>
    );
}
