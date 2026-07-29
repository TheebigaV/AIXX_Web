'use client';

import React, { useState } from 'react';
import { api } from '@/lib/public/api';
import Banner from '@/components/public/Banner';
import { FaGraduationCap, FaPaperPlane, FaSpinner, FaCheckCircle, FaUser, FaBuilding, FaPhone, FaEnvelope, FaGlobe, FaVenusMars } from 'react-icons/fa';

const countries = [
    "Singapore", "Malaysia", "Indonesia", "Thailand", "Philippines", "Vietnam",
    "Myanmar", "Cambodia", "Brunei", "Laos", "India", "Australia",
    "United Kingdom", "United States", "China", "Japan", "South Korea"
];

export default function AICertificateLanding() {
    const [formData, setFormData] = useState({
        full_name: '',
        gender: '',
        company_name: '',
        phone: '',
        email: '',
        country: 'Singapore'
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errorMsg) setErrorMsg('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            await api.post('api/certificate/register', formData);
            setSuccess(true);
        } catch (err: any) {
            console.error('Registration failed:', err);
            setErrorMsg(err.response?.data?.message || 'Something went wrong. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <Banner
                altText="Free AI Knowledge Certificate"
                paths={[{ name: 'Home', href: '/' }, { name: 'AI Certificate', href: '/ai-certificate' }]}
                title="Free AI Knowledge Certificate"
                subtitle="Validate your AI expertise with our industry-recognized 20 MCQ assessment."
                bgImage="/images/courses_banner_bg.png"
            />

            <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-16 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-stretch gap-12">

                    {/* Left Column — Info */}
                    <div className="lg:w-1/2 flex flex-col justify-center space-y-6">
                        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-600 rounded-full px-4 py-1.5 w-fit">
                            <FaGraduationCap size={16} />
                            <span className="text-xs font-semibold uppercase tracking-wider">Professional Credential</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                            Showcase Your AI Skills to the World
                        </h2>

                        <p className="text-slate-600 text-base leading-relaxed">
                            Artificial Intelligence is transforming industries globally. Earning the AIXX AI Knowledge Certificate proves your understanding of foundational AI topics including LLMs, prompt engineering, RAG architecture, agentic workflows, and AI ethics.
                        </p>

                        <div className="space-y-4">
                            {[
                                { title: '20 Question Assessment', desc: 'Comprehensive multiple-choice questions covering generative AI theories and implementations.' },
                                { title: 'Passing Grade: 80%', desc: 'Demonstrate competency by scoring at least 80% (16/20 correct answers).' },
                                { title: 'Verifiable Digital Certificate', desc: 'Receive a uniquely serialized digital certificate suitable for resume integration and LinkedIn sharing.' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-950 text-base">{item.title}</h4>
                                        <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column — Registration Card */}
                    <div className="lg:w-1/2 bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col justify-between">
                        {success ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 h-full">
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                                    <FaCheckCircle size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Access Link Dispatched!</h3>
                                <p className="text-slate-600 text-sm max-w-sm leading-relaxed">
                                    Thank you, <strong className="text-slate-900">{formData.full_name}</strong>. We have sent a unique test access link to your email <strong className="text-slate-900">{formData.email}</strong>.
                                </p>
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-500 text-left w-full">
                                    <h5 className="font-bold text-slate-700 mb-1">Next Steps:</h5>
                                    <ol className="list-decimal pl-4 space-y-1">
                                        <li>Check your email inbox (and spam/promotions folder).</li>
                                        <li>Click the unique test link to open the test page.</li>
                                        <li>Complete the 20-question MCQ test to claim your certificate.</li>
                                    </ol>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Registration Form</h3>
                                    <p className="text-xs text-slate-500 mt-1">Please provide valid contact details. The test link will be sent to the email provided.</p>
                                </div>

                                {errorMsg && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-semibold">
                                        {errorMsg}
                                    </div>
                                )}

                                {/* Full Name */}
                                <div className="relative">
                                    <label className="text-xs font-bold text-slate-600 block mb-1">Full Name</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <FaUser size={14} />
                                        </span>
                                        <input
                                            type="text"
                                            name="full_name"
                                            required
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white transition-all placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Gender & Company */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Gender</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <FaVenusMars size={14} />
                                            </span>
                                            <select
                                                name="gender"
                                                required
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Company Name</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <FaBuilding size={14} />
                                            </span>
                                            <input
                                                type="text"
                                                name="company_name"
                                                required
                                                value={formData.company_name}
                                                onChange={handleChange}
                                                placeholder="Company Ltd"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Phone & Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Handphone Number</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <FaPhone size={14} />
                                            </span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+65 9123 4567"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Email Address</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <FaEnvelope size={14} />
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="johndoe@email.com"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-1">Country</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <FaGlobe size={14} />
                                        </span>
                                        <select
                                            name="country"
                                            required
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                        >
                                            {countries.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md shadow-brand-100 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin" size={16} />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Register & Get Test Link</span>
                                            <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" size={14} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
