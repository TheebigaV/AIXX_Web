'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';

interface Question {
    id?: number;
    training_id: number | null;
    question: string;
    options: string[];
    correct_answer_index: number;
    explanation: string;
    is_active: boolean;
    training?: {
        id: number;
        name: string;
    };
}

interface Training {
    id: number;
    name: string;
    type: string;
}

export default function CertificateQuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [qRes, tRes] = await Promise.all([
                api.get('/api/admin/certificate-questions'),
                api.get('/api/admin/trainings/all')
            ]);
            setQuestions(qRes.data);
            
            // Filter to only Free Courses and E-Learning for Question Bank
            const relevantTrainings = tRes.data.filter((t: Training) => t.type === 'free_courses' || t.type === 'elearning');
            setTrainings(relevantTrainings);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async () => {
        try {
            const res = await api.get('/api/admin/certificate-questions');
            setQuestions(res.data);
        } catch (error) {
            console.error('Error fetching questions', error);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentQuestion) return;

        try {
            if (currentQuestion.id) {
                await api.put(`/api/admin/certificate-questions/${currentQuestion.id}`, currentQuestion);
            } else {
                await api.post('/api/admin/certificate-questions', currentQuestion);
            }
            setShowModal(false);
            fetchQuestions();
        } catch (error) {
            console.error('Error saving question', error);
            alert('Failed to save question. Please check all fields.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            await api.delete(`/api/admin/certificate-questions/${id}`);
            fetchQuestions();
        } catch (error) {
            console.error('Error deleting question', error);
        }
    };

    const openModal = (q: Question | null) => {
        if (q) {
            setCurrentQuestion(q);
        } else {
            setCurrentQuestion({
                training_id: trainings.length > 0 ? trainings[0].id : null,
                question: '',
                options: ['', '', '', ''],
                correct_answer_index: 0,
                explanation: '',
                is_active: true,
            });
        }
        setShowModal(true);
    };

    const handleOptionChange = (index: number, value: string) => {
        if (!currentQuestion) return;
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Certificate Question Bank</h1>
                    <p className="text-sm text-slate-500">Manage the dynamic MCQ questions for the AI Knowledge Certificate.</p>
                </div>
                <button
                    onClick={() => openModal(null)}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                    <FaPlus /> Add Question
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-brand-600 text-3xl" /></div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
                    <table className="w-full min-w-[800px] text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Course</th>
                                <th className="px-6 py-4 font-semibold">Question</th>
                                <th className="px-6 py-4 font-semibold w-24 text-center">Status</th>
                                <th className="px-6 py-4 font-semibold w-24 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {questions.map((q) => (
                                <tr key={q.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-medium text-slate-800 text-xs">
                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md">{q.training?.name || 'Unassigned'}</span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{q.question}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${q.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {q.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => openModal(q)} className="text-brand-600 hover:text-brand-800 p-2"><FaEdit /></button>
                                        <button onClick={() => q.id && handleDelete(q.id)} className="text-red-500 hover:text-red-700 p-2"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                            {questions.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No questions found in the bank.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && currentQuestion && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-xl font-bold mb-4">{currentQuestion.id ? 'Edit Question' : 'Add Question'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Course Assignment</label>
                                <select
                                    required
                                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-brand-500 outline-none mb-4 bg-white"
                                    value={currentQuestion.training_id || ''}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, training_id: Number(e.target.value) })}
                                >
                                    <option value="" disabled>Select a Course</option>
                                    {trainings.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.type === 'free_courses' ? 'Free Certificate' : 'E-Learning'})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Question Text</label>
                                <textarea
                                    required
                                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-brand-500 outline-none"
                                    rows={3}
                                    value={currentQuestion.question}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                                />
                            </div>
                            
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold">Options & Correct Answer</label>
                                {currentQuestion.options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={currentQuestion.correct_answer_index === idx}
                                            onChange={() => setCurrentQuestion({ ...currentQuestion, correct_answer_index: idx })}
                                            className="w-5 h-5 text-brand-600 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            required
                                            placeholder={`Option ${idx + 1}`}
                                            className="flex-1 border border-slate-300 rounded-lg p-2 text-sm focus:border-brand-500 outline-none"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={currentQuestion.is_active}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, is_active: e.target.checked })}
                                    className="w-4 h-4 rounded text-brand-600"
                                />
                                <label htmlFor="isActive" className="text-sm font-semibold">Active (Available in tests)</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-sm">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-white bg-brand-600 hover:bg-brand-700 rounded-lg font-semibold text-sm">Save Question</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
